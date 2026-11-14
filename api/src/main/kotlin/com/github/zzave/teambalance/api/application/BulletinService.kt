package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.BulletinPostNotFoundException
import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.BulletinPostId
import com.github.zzave.teambalance.api.domain.model.PostMarkdown
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BulletinPostRepository
import java.time.Clock

/** The Team's Bulletin Board (ADR-0048): Admins post, every Member reads. */
class BulletinService(
    private val bulletinPostRepository: BulletinPostRepository,
    private val authorizationService: AuthorizationService,
    private val clock: Clock,
) {
    fun listPosts(callerId: UserId, teamId: TeamId): List<BulletinPost> {
        authorizationService.requireMember(callerId, teamId)
        return bulletinPostRepository.list()
    }

    fun createPost(callerId: UserId, teamId: TeamId, rawMarkdown: String): BulletinPost {
        authorizationService.requireAdmin(callerId, teamId)
        return bulletinPostRepository.create(PostMarkdown.of(rawMarkdown), callerId, clock.instant())
    }

    /** Admin-only. Every save is recorded as an edit, with the caller and the time (ADR-0048). */
    fun updatePost(callerId: UserId, teamId: TeamId, id: BulletinPostId, rawMarkdown: String): BulletinPost {
        authorizationService.requireAdmin(callerId, teamId)
        return bulletinPostRepository.update(id, PostMarkdown.of(rawMarkdown), callerId, clock.instant())
            ?: throw BulletinPostNotFoundException(id)
    }
}
