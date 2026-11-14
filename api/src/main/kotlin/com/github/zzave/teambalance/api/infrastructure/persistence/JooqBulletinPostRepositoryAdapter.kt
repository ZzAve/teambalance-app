package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.BulletinPostId
import com.github.zzave.teambalance.api.domain.model.PostEdit
import com.github.zzave.teambalance.api.domain.model.PostMarkdown
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BulletinPostRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.BULLETIN_POSTS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.BULLETIN_POST_EDITS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.tables.records.BulletinPostsRecord
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

/** Bulletin Board Posts and their edit audit, tenant-schema rows (ADR-0048). */
@Repository
class JooqBulletinPostRepositoryAdapter(
    private val dsl: DSLContext,
) : BulletinPostRepository {

    override fun list(): List<BulletinPost> {
        val edits = editsByPost(postIds = null)
        return dsl.selectFrom(BULLETIN_POSTS)
            .orderBy(BULLETIN_POSTS.POSTED_AT.desc(), BULLETIN_POSTS.ID)
            .fetch { it.toBulletinPost(edits[it.id].orEmpty()) }
    }

    override fun create(markdown: PostMarkdown, authorId: UserId, postedAt: Instant): BulletinPost =
        dsl.insertInto(BULLETIN_POSTS)
            .set(BULLETIN_POSTS.ID, UUID.randomUUID())
            .set(BULLETIN_POSTS.MARKDOWN, markdown.value)
            .set(BULLETIN_POSTS.AUTHOR_ID, authorId.value)
            .set(BULLETIN_POSTS.POSTED_AT, postedAt.atOffset(ZoneOffset.UTC))
            .returning()
            .fetchSingle()
            .toBulletinPost(edits = emptyList())

    @Transactional
    override fun update(id: BulletinPostId, markdown: PostMarkdown, editorId: UserId, editedAt: Instant): BulletinPost? {
        val updated = dsl.update(BULLETIN_POSTS)
            .set(BULLETIN_POSTS.MARKDOWN, markdown.value)
            .where(BULLETIN_POSTS.ID.eq(id.value))
            .returning()
            .fetchOne() ?: return null
        dsl.insertInto(BULLETIN_POST_EDITS)
            .set(BULLETIN_POST_EDITS.POST_ID, id.value)
            .set(BULLETIN_POST_EDITS.EDITOR_ID, editorId.value)
            .set(BULLETIN_POST_EDITS.EDITED_AT, editedAt.atOffset(ZoneOffset.UTC))
            .execute()
        return updated.toBulletinPost(editsByPost(postIds = listOf(id.value))[id.value].orEmpty())
    }

    /** Every Post's edits, oldest first, in one query; [postIds] null reads them all. */
    private fun editsByPost(postIds: List<UUID>?): Map<UUID, List<PostEdit>> =
        dsl.selectFrom(BULLETIN_POST_EDITS)
            .where(postIds?.let { BULLETIN_POST_EDITS.POST_ID.`in`(it) } ?: DSL.noCondition())
            .orderBy(BULLETIN_POST_EDITS.EDITED_AT, BULLETIN_POST_EDITS.ID)
            .fetch()
            .groupBy({ it.postId }, { PostEdit(UserId(it.editorId), it.editedAt.toInstant()) })

    private fun BulletinPostsRecord.toBulletinPost(edits: List<PostEdit>) = BulletinPost(
        id = BulletinPostId(id),
        markdown = PostMarkdown.stored(markdown),
        authorId = UserId(authorId),
        postedAt = postedAt.toInstant(),
        edits = edits,
    )
}
