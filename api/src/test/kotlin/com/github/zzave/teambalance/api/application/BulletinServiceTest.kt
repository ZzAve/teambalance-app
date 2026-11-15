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
import java.time.Duration
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

private val NOW = Instant.parse("2026-11-14T10:00:00Z")

private class FakeBulletinPostRepository : BulletinPostRepository {
    private val store = mutableListOf<BulletinPost>()

    override fun list(includeDeleted: Boolean): List<BulletinPost> =
        store.filter { includeDeleted || it.deletedAt == null }.sortedByDescending { it.postedAt }

    override fun create(markdown: PostMarkdown, authorId: UserId, postedAt: Instant): BulletinPost =
        BulletinPost(BulletinPostId(UUID.randomUUID()), markdown, authorId, postedAt).also { store += it }

    override fun update(id: BulletinPostId, markdown: PostMarkdown, editorId: UserId, editedAt: Instant): BulletinPost? {
        val index = store.indexOfFirst { it.id == id && it.deletedAt == null }.takeIf { it >= 0 } ?: return null
        return store[index].let { it.copy(markdown = markdown, edits = it.edits + PostEdit(editorId, editedAt)) }
            .also { store[index] = it }
    }

    override fun delete(id: BulletinPostId, at: Instant): Boolean {
        val index = store.indexOfFirst { it.id == id && it.deletedAt == null }.takeIf { it >= 0 } ?: return false
        store[index] = store[index].copy(deletedAt = at)
        return true
    }

    override fun restore(id: BulletinPostId): BulletinPost? {
        val index = store.indexOfFirst { it.id == id && it.deletedAt != null }.takeIf { it >= 0 } ?: return null
        return store[index].copy(deletedAt = null).also { store[index] = it }
    }

    override fun removeDeletedBefore(cutoff: Instant): Int {
        val before = store.size
        store.removeAll { it.deletedAt?.isBefore(cutoff) == true }
        return before - store.size
    }
}

// A clock the test moves forward, to cross the 14-day line.
private class BulletinTestClock(var now: Instant) : Clock() {
    override fun getZone(): ZoneOffset = ZoneOffset.UTC
    override fun withZone(zone: java.time.ZoneId?): Clock = this
    override fun instant(): Instant = now
}

class BulletinServiceTest : FunSpec() {
    init {
        val directory = TeamDirectory()
        val teamId = directory.addTeam("Bulletin Team", "bulletin-team")
        val adminId = UserId.random().also { directory.join(it, teamId, Role.ADMIN) }
        val memberId = UserId.random().also { directory.join(it, teamId, Role.USER) }

        fun newService(clock: Clock = Clock.fixed(NOW, ZoneOffset.UTC)) = BulletinService(
            bulletinPostRepository = FakeBulletinPostRepository(),
            authorizationService = AuthorizationService(directory.teamMemberRepository(), FakeActAsGateway()),
            clock = clock,
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

        test("a deleted post is hidden from members, listed for admins until its removal date, and restored") {
            val service = newService()
            val post = service.createPost(adminId, teamId, "Closed on Friday")

            service.deletePost(adminId, teamId, post.id)

            service.listPosts(memberId, teamId) shouldBe emptyList()
            val deleted = service.listPosts(adminId, teamId).single()
            deleted.deletedAt shouldBe NOW
            deleted.removedAt shouldBe NOW.plus(BulletinPost.RETENTION)

            service.restorePost(adminId, teamId, post.id).deletedAt shouldBe null
            service.listPosts(memberId, teamId).map { it.id } shouldBe listOf(post.id)
        }

        test("a deleted post cannot be deleted again or edited, and a live one cannot be restored") {
            val service = newService()
            val post = service.createPost(adminId, teamId, "Once")
            shouldThrow<BulletinPostNotFoundException> { service.restorePost(adminId, teamId, post.id) }
            service.deletePost(adminId, teamId, post.id)
            shouldThrow<BulletinPostNotFoundException> { service.deletePost(adminId, teamId, post.id) }
            shouldThrow<BulletinPostNotFoundException> { service.updatePost(adminId, teamId, post.id, "Twice") }
        }

        test("a member may not delete or restore") {
            val service = newService()
            val post = service.createPost(adminId, teamId, "Keep")
            shouldThrow<NotTeamAdminException> { service.deletePost(memberId, teamId, post.id) }
            service.deletePost(adminId, teamId, post.id)
            shouldThrow<NotTeamAdminException> { service.restorePost(memberId, teamId, post.id) }
        }

        test("a post deleted more than 14 days ago is removed, a newer one stays") {
            val clock = BulletinTestClock(NOW)
            val service = newService(clock)
            val old = service.createPost(adminId, teamId, "Old")
            service.deletePost(adminId, teamId, old.id)
            clock.now = NOW.plus(Duration.ofDays(1))
            val recent = service.createPost(adminId, teamId, "Recent")
            service.deletePost(adminId, teamId, recent.id)

            clock.now = NOW.plus(BulletinPost.RETENTION).plusSeconds(1)
            service.removeExpiredPosts() shouldBe 1

            service.listPosts(adminId, teamId).map { it.id } shouldBe listOf(recent.id)
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
