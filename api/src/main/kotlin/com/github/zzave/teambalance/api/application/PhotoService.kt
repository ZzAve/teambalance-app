package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NoPersonalPhotoException
import com.github.zzave.teambalance.api.domain.exception.PhotoNotFoundException
import com.github.zzave.teambalance.api.domain.model.Photo
import com.github.zzave.teambalance.api.domain.model.TeamScope
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PhotoRepository
import com.github.zzave.teambalance.api.domain.port.TeamMemberRepository

/**
 * The Personal Photo and the Team Photo (ADR-0038).
 *
 * Only the member uploads a photo of either kind; an Admin may only remove a Team Photo. The
 * Personal Photo is always the caller's own, so its methods take no caller separate from the owner.
 */
class PhotoService(
    private val photoRepository: PhotoRepository,
    private val teamMemberRepository: TeamMemberRepository,
    private val authorizationService: AuthorizationService,
) {
    fun teamPhoto(scope: TeamScope, userId: UserId): Photo {
        authorizationService.requireMember(scope)
        return photoRepository.findTeam(userId) ?: throw PhotoNotFoundException(userId)
    }

    fun uploadTeamPhoto(scope: TeamScope, bytes: ByteArray) {
        requireActiveMember(scope)
        photoRepository.saveTeam(scope.userId, Photo(bytes))
    }

    /** Copies the bytes: a later change to the Personal Photo leaves the Team Photo as it was. */
    fun copyPersonalPhotoToTeam(scope: TeamScope) {
        requireActiveMember(scope)
        val personal = photoRepository.findPersonal(scope.userId) ?: throw NoPersonalPhotoException(scope.userId)
        photoRepository.saveTeam(scope.userId, Photo(personal.bytes.copyOf()))
    }

    fun removeTeamPhoto(scope: TeamScope, targetUserId: UserId) {
        authorizationService.requireSelfOrAdmin(scope, targetUserId)
        photoRepository.deleteTeam(targetUserId)
    }

    fun personalPhoto(userId: UserId): Photo =
        photoRepository.findPersonal(userId) ?: throw PhotoNotFoundException(userId)

    fun personalPhotoVersion(userId: UserId): String? = photoRepository.findPersonalVersion(userId)

    fun uploadPersonalPhoto(userId: UserId, bytes: ByteArray) = photoRepository.savePersonal(userId, Photo(bytes))

    fun removePersonalPhoto(userId: UserId) = photoRepository.deletePersonal(userId)

    // Act-as grants a Virtual Member that is no one's face, so this asks the roster, not
    // AuthorizationService: there is no member to attach a photo to.
    private fun requireActiveMember(scope: TeamScope) {
        teamMemberRepository.findRole(scope.teamId, scope.userId) ?: throw MemberNotFoundException(scope.userId)
    }
}
