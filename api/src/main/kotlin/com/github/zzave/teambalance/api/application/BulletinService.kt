package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.model.BulletinPost
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
}
