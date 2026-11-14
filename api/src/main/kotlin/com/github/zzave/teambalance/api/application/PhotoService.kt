package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.NoPersonalPhotoException
import com.github.zzave.teambalance.api.domain.exception.PhotoNotFoundException
import com.github.zzave.teambalance.api.domain.model.Photo
import com.github.zzave.teambalance.api.domain.model.TeamId
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PhotoRepository

/**
 * The Personal Photo and the Team Photo (ADR-0038).
 *
 * Only the member uploads a photo of either kind; an Admin may only remove a Team Photo. The
 * Personal Photo is always the caller's own, so its methods take no caller separate from the owner.
 */
class PhotoService(
    private val photoRepository: PhotoRepository,
    private val authorizationService: AuthorizationService,
) {
    fun teamPhoto(callerId: UserId, teamId: TeamId, userId: UserId): Photo {
        authorizationService.requireMember(callerId, teamId)
        return photoRepository.findTeam(userId) ?: throw PhotoNotFoundException(userId)
    }

    fun uploadTeamPhoto(callerId: UserId, teamId: TeamId, bytes: ByteArray) {
        authorizationService.requireRealMember(callerId, teamId)
        photoRepository.saveTeam(callerId, Photo(bytes))
    }

    /** Copies the bytes: a later change to the Personal Photo leaves the Team Photo as it was. */
    fun copyPersonalPhotoToTeam(callerId: UserId, teamId: TeamId) {
        authorizationService.requireRealMember(callerId, teamId)
        val personal = photoRepository.findPersonal(callerId) ?: throw NoPersonalPhotoException(callerId)
        photoRepository.saveTeam(callerId, Photo(personal.bytes.copyOf()))
    }

    fun removeTeamPhoto(callerId: UserId, teamId: TeamId, targetUserId: UserId) {
        if (callerId != targetUserId) authorizationService.requireAdmin(callerId, teamId)
        photoRepository.deleteTeam(targetUserId)
    }

    fun personalPhoto(userId: UserId): Photo =
        photoRepository.findPersonal(userId) ?: throw PhotoNotFoundException(userId)

    fun personalPhotoVersion(userId: UserId): String? = photoRepository.findPersonalVersion(userId)

    fun uploadPersonalPhoto(userId: UserId, bytes: ByteArray) = photoRepository.savePersonal(userId, Photo(bytes))

    fun removePersonalPhoto(userId: UserId) = photoRepository.deletePersonal(userId)

}
