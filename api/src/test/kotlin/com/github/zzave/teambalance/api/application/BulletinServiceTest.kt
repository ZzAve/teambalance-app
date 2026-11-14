package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.BulletinPostId
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
