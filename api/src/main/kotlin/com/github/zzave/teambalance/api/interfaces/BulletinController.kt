package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.application.BulletinService
import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.BulletinPostId
import com.github.zzave.teambalance.api.domain.port.CurrentTeamGateway
import com.github.zzave.teambalance.api.domain.port.CurrentUserGateway
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.CreateBulletinPost
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.DeleteBulletinPost
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.ListBulletinPosts
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.RestoreBulletinPost
import com.github.zzave.teambalance.api.interfaces.generated.endpoint.UpdateBulletinPost
import com.github.zzave.teambalance.api.interfaces.generated.model.BulletinPostEdit
import com.github.zzave.teambalance.api.interfaces.generated.model.BulletinPostList
import com.github.zzave.teambalance.api.interfaces.generated.model.DateTimestampWithTimezone
import org.springframework.web.bind.annotation.RestController
import java.time.Instant
import java.util.UUID
import com.github.zzave.teambalance.api.interfaces.generated.model.BulletinPost as BulletinPostDto

@RestController
class BulletinController(
    private val bulletinService: BulletinService,
    private val currentUserGateway: CurrentUserGateway,
    private val currentTeamGateway: CurrentTeamGateway,
) : ListBulletinPosts.Handler,
    CreateBulletinPost.Handler,
    UpdateBulletinPost.Handler,
    DeleteBulletinPost.Handler,
    RestoreBulletinPost.Handler {

    override suspend fun listBulletinPosts(request: ListBulletinPosts.Request): ListBulletinPosts.Response<*> {
        val posts = bulletinService.listPosts(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
        )
        return ListBulletinPosts.Response200(BulletinPostList(posts.map { it.produce() }))
    }

    override suspend fun createBulletinPost(request: CreateBulletinPost.Request): CreateBulletinPost.Response<*> {
        val created = bulletinService.createPost(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            rawMarkdown = request.body.markdown,
            pinned = request.body.pinned,
            showUntil = request.body.showUntil?.value?.let(Instant::parse),
        )
        return CreateBulletinPost.Response201(created.produce())
    }

    override suspend fun updateBulletinPost(request: UpdateBulletinPost.Request): UpdateBulletinPost.Response<*> {
        val updated = bulletinService.updatePost(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            id = request.path.id.consumeBulletinPostId(),
            rawMarkdown = request.body.markdown,
            pinned = request.body.pinned,
            showUntil = request.body.showUntil?.value?.let(Instant::parse),
        )
        return UpdateBulletinPost.Response200(updated.produce())
    }

    override suspend fun deleteBulletinPost(request: DeleteBulletinPost.Request): DeleteBulletinPost.Response<*> {
        bulletinService.deletePost(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            id = request.path.id.consumeBulletinPostId(),
        )
        return DeleteBulletinPost.Response204
    }

    override suspend fun restoreBulletinPost(request: RestoreBulletinPost.Request): RestoreBulletinPost.Response<*> {
        val restored = bulletinService.restorePost(
            callerId = currentUserGateway.requireCurrentUserId(),
            teamId = currentTeamGateway.requireCurrentTeamId(),
            id = request.path.id.consumeBulletinPostId(),
        )
        return RestoreBulletinPost.Response200(restored.produce())
    }
}

private fun String.consumeBulletinPostId() = BulletinPostId(UUID.fromString(this))

private fun BulletinPost.produce() = BulletinPostDto(
    id = id.toString(),
    markdown = markdown.value,
    authorId = authorId.toString(),
    postedAt = DateTimestampWithTimezone(postedAt.toString()),
    pinned = pinned,
    showUntil = showUntil?.let { DateTimestampWithTimezone(it.toString()) },
    edits = edits.map { BulletinPostEdit(it.editorId.toString(), DateTimestampWithTimezone(it.editedAt.toString())) },
    deletedAt = deletedAt?.let { DateTimestampWithTimezone(it.toString()) },
    removedAt = removedAt?.let { DateTimestampWithTimezone(it.toString()) },
)
