package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.BulletinPostNotFoundException
import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.BulletinPostId
import com.github.zzave.teambalance.api.domain.model.NewPostContent
import com.github.zzave.teambalance.api.domain.model.PostMarkdown
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BulletinPostRepository
import java.time.Clock
import java.time.Instant

/** The Team's Bulletin Board (ADR-0048): Admins post, edit, delete and restore; every Member reads. */
class BulletinService(
    private val bulletinPostRepository: BulletinPostRepository,
    private val authorizationService: AuthorizationService,
    private val clock: Clock,
) {
    /** Admins also get the Posts past their show-until and the deleted Posts they can still restore. */
    fun listPosts(callerId: UserId, teamId: TeamId): List<BulletinPost> {
        authorizationService.requireMember(callerId, teamId)
        return bulletinPostRepository.list(includeHidden = authorizationService.isAdmin(callerId, teamId), now = clock.instant())
    }

    fun createPost(
        callerId: UserId,
        teamId: TeamId,
        rawMarkdown: String,
        pinned: Boolean = false,
        showUntil: Instant? = null,
    ): BulletinPost {
        authorizationService.requireAdmin(callerId, teamId)
        val content = NewPostContent(PostMarkdown.of(rawMarkdown), pinned, showUntil)
        return bulletinPostRepository.create(content, callerId, clock.instant())
    }

    /** Admin-only. Every save is recorded as an edit, with the caller and the time (ADR-0048). */
    fun updatePost(
        callerId: UserId,
        teamId: TeamId,
        id: BulletinPostId,
        rawMarkdown: String,
        pinned: Boolean = false,
        showUntil: Instant? = null,
    ): BulletinPost {
        authorizationService.requireAdmin(callerId, teamId)
        val content = NewPostContent(PostMarkdown.of(rawMarkdown), pinned, showUntil)
        return bulletinPostRepository.update(id, content, callerId, clock.instant())
            ?: throw BulletinPostNotFoundException(id)
    }

    /** Admin-only. Hides the Post from Members; it can be restored for [BulletinPost.RETENTION]. */
    fun deletePost(callerId: UserId, teamId: TeamId, id: BulletinPostId) {
        authorizationService.requireAdmin(callerId, teamId)
        if (!bulletinPostRepository.delete(id, clock.instant())) throw BulletinPostNotFoundException(id)
    }

    /** Admin-only. Shows a deleted Post again. */
    fun restorePost(callerId: UserId, teamId: TeamId, id: BulletinPostId): BulletinPost {
        authorizationService.requireAdmin(callerId, teamId)
        return bulletinPostRepository.restore(id) ?: throw BulletinPostNotFoundException(id)
    }

    /** For the scheduler, inside one tenant: removes the Posts deleted longer ago than [BulletinPost.RETENTION]. */
    fun removeExpiredPosts(): Int = bulletinPostRepository.removeDeletedBefore(clock.instant().minus(BulletinPost.RETENTION))
}
