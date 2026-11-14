package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.BulletinPostNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.BulletinPostId
import com.github.zzave.teambalance.api.domain.model.PostEdit
import com.github.zzave.teambalance.api.domain.model.PostMarkdown
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BulletinPostRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import java.time.Clock
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

private val NOW = Instant.parse("2026-11-14T10:00:00Z")

private class FakeBulletinPostRepository : BulletinPostRepository {
    private val store = mutableListOf<BulletinPost>()

    override fun list(): List<BulletinPost> = store.sortedByDescending { it.postedAt }

    override fun create(markdown: PostMarkdown, authorId: UserId, postedAt: Instant): BulletinPost =
        BulletinPost(BulletinPostId(UUID.randomUUID()), markdown, authorId, postedAt).also { store += it }

    override fun update(id: BulletinPostId, markdown: PostMarkdown, editorId: UserId, editedAt: Instant): BulletinPost? {
        val index = store.indexOfFirst { it.id == id }.takeIf { it >= 0 } ?: return null
        return store[index].let { it.copy(markdown = markdown, edits = it.edits + PostEdit(editorId, editedAt)) }
            .also { store[index] = it }
    }
}

class BulletinServiceTest : FunSpec() {
    init {
        val directory = TeamDirectory()
        val teamId = directory.addTeam("Bulletin Team", "bulletin-team")
        val adminId = UserId.random().also { directory.join(it, teamId, Role.ADMIN) }
        val memberId = UserId.random().also { directory.join(it, teamId, Role.USER) }

        fun newService() = BulletinService(
            bulletinPostRepository = FakeBulletinPostRepository(),
            authorizationService = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway()),
            clock = Clock.fixed(NOW, ZoneOffset.UTC),
        )

        test("an admin's post is trimmed, credited to them and read by a member") {
            val service = newService()
            service.createPost(adminId, teamId, "  ### Ball bag\n- Lisa  ")

            val post = service.listPosts(memberId, teamId).single()
            post.markdown.value shouldBe "### Ball bag\n- Lisa"
            post.authorId shouldBe adminId
            post.postedAt shouldBe NOW
        }

        test("a member may not post") {
            shouldThrow<NotTeamAdminException> { newService().createPost(memberId, teamId, "Hello") }
        }

        test("each admin save records who edited and when, oldest first") {
            val service = newService()
            val otherAdminId = UserId.random().also { directory.join(it, teamId, Role.ADMIN) }
            val post = service.createPost(adminId, teamId, "First")

            service.updatePost(otherAdminId, teamId, post.id, "Second")
            val edited = service.updatePost(adminId, teamId, post.id, " Third ")

            edited.markdown.value shouldBe "Third"
            edited.authorId shouldBe adminId
            edited.edits shouldBe listOf(PostEdit(otherAdminId, NOW), PostEdit(adminId, NOW))
        }

        test("a member may not edit, and a missing post is not found") {
            val service = newService()
            val post = service.createPost(adminId, teamId, "Mine")
            shouldThrow<NotTeamAdminException> { service.updatePost(memberId, teamId, post.id, "Changed") }
            shouldThrow<BulletinPostNotFoundException> {
                service.updatePost(adminId, teamId, BulletinPostId(UUID.randomUUID()), "Changed")
            }
        }

        test("a blank post or one over the limit is refused") {
            val service = newService()
            shouldThrow<IllegalArgumentException> { service.createPost(adminId, teamId, "   ") }
            shouldThrow<IllegalArgumentException> {
                service.createPost(adminId, teamId, "a".repeat(PostMarkdown.MAX_LENGTH + 1))
            }
            service.createPost(adminId, teamId, "a".repeat(PostMarkdown.MAX_LENGTH)).markdown.value.length shouldBe
                PostMarkdown.MAX_LENGTH
        }
    }
}
