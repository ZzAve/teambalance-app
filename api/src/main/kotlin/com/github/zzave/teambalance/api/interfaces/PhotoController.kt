package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.PhotoService
import com.github.zzave.teambalance.api.domain.model.Photo
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RestController

/**
 * The photo endpoints (ADR-0038). Deliberately outside the Wirespec contract: the bodies are image
 * bytes, which the contract's JSON model cannot describe. The metadata that is JSON travels in the
 * contract instead — `Member.photoVersion` and `AuthenticatedUser.personalPhotoVersion`.
 *
 * Uploads are read as raw bytes and judged by their content, not their `Content-Type` header: the
 * browser sends WebP, or JPEG where it cannot encode WebP. The body is read up to one byte past the
 * limit, so an oversized upload is rejected without being read whole.
 *
 * Images are served with a year-long immutable cache header. That is safe because clients always
 * request them as `?v=<photoVersion>`, so the URL changes whenever the image does.
 */
@RestController
class PhotoController(
    private val photoService: PhotoService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) {
    @GetMapping("/api/members/{userId}/photo")
    fun teamPhoto(@PathVariable userId: String): ResponseEntity<ByteArray> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        return photoService.teamPhoto(caller, teamId, userId.consumeUserId()).toResponse()
    }

    @PutMapping("/api/members/me/photo")
    fun uploadTeamPhoto(request: HttpServletRequest): ResponseEntity<Void> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        photoService.uploadTeamPhoto(caller, teamId, request.readPhotoBody())
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/api/members/me/photo/from-personal")
    fun copyPersonalPhotoToTeam(): ResponseEntity<Void> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        photoService.copyPersonalPhotoToTeam(caller, teamId)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/api/members/{userId}/photo")
    fun removeTeamPhoto(@PathVariable userId: String): ResponseEntity<Void> {
        val caller = currentUserGateway.requireCurrentUserId()
        val teamId = currentTeamGateway.requireCurrentTeamId()
        photoService.removeTeamPhoto(caller, teamId, userId.consumeUserId())
        return ResponseEntity.noContent().build()
    }

    // The /api/account routes need only a signed-in user, so they work before any team exists.
    @GetMapping("/api/account/photo")
    fun personalPhoto(): ResponseEntity<ByteArray> =
        photoService.personalPhoto(currentUserGateway.requireCurrentUserId()).toResponse()

    @PutMapping("/api/account/photo")
    fun uploadPersonalPhoto(request: HttpServletRequest): ResponseEntity<Void> {
        photoService.uploadPersonalPhoto(currentUserGateway.requireCurrentUserId(), request.readPhotoBody())
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/api/account/photo")
    fun removePersonalPhoto(): ResponseEntity<Void> {
        photoService.removePersonalPhoto(currentUserGateway.requireCurrentUserId())
        return ResponseEntity.noContent().build()
    }
}

private const val IMMUTABLE_CACHE_CONTROL = "private, max-age=31536000, immutable"

private fun HttpServletRequest.readPhotoBody(): ByteArray = inputStream.readNBytes(Photo.MAX_BYTES + 1)

private fun Photo.toResponse(): ResponseEntity<ByteArray> =
    ResponseEntity.ok()
        .contentType(MediaType.parseMediaType(contentType))
        .header(HttpHeaders.CACHE_CONTROL, IMMUTABLE_CACHE_CONTROL)
        .body(bytes)
