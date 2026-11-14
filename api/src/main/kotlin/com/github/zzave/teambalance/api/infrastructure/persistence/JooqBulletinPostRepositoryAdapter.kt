package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.BulletinPost
import com.github.zzave.teambalance.api.domain.model.BulletinPostId
import com.github.zzave.teambalance.api.domain.model.PostMarkdown
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.BulletinPostRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.BULLETIN_POSTS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.tables.records.BulletinPostsRecord
import org.jooq.DSLContext
import org.springframework.stereotype.Repository
import java.time.Instant
import java.time.ZoneOffset
import java.util.UUID

/** Bulletin Board Posts, tenant-schema rows (ADR-0048). */
@Repository
class JooqBulletinPostRepositoryAdapter(
    private val dsl: DSLContext,
) : BulletinPostRepository {

    override fun list(): List<BulletinPost> =
        dsl.selectFrom(BULLETIN_POSTS)
            .orderBy(BULLETIN_POSTS.POSTED_AT.desc(), BULLETIN_POSTS.ID)
            .fetch { it.toBulletinPost() }

    override fun create(markdown: PostMarkdown, authorId: UserId, postedAt: Instant): BulletinPost =
        dsl.insertInto(BULLETIN_POSTS)
            .set(BULLETIN_POSTS.ID, UUID.randomUUID())
            .set(BULLETIN_POSTS.MARKDOWN, markdown.value)
            .set(BULLETIN_POSTS.AUTHOR_ID, authorId.value)
            .set(BULLETIN_POSTS.POSTED_AT, postedAt.atOffset(ZoneOffset.UTC))
            .returning()
            .fetchSingle()
            .toBulletinPost()

    private fun BulletinPostsRecord.toBulletinPost() = BulletinPost(
        id = BulletinPostId(id),
        markdown = PostMarkdown.stored(markdown),
        authorId = UserId(authorId),
        postedAt = postedAt.toInstant(),
    )
}
