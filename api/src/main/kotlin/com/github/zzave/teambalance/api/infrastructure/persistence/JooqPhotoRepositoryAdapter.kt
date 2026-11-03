package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Photo
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PhotoRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.default_schema.Tables.MEMBER_PHOTOS
import com.github.zzave.teambalance.api.infrastructure.persistence.jooq.public_.Tables.PERSONAL_PHOTOS
import org.jooq.DSLContext
import org.jooq.impl.DSL.excluded
import org.springframework.stereotype.Repository
import java.time.OffsetDateTime
import java.time.ZoneOffset

@Repository
class JooqPhotoRepositoryAdapter(
    private val dsl: DSLContext,
) : PhotoRepository {
    override fun findPersonal(userId: UserId): Photo? =
        dsl.select(PERSONAL_PHOTOS.IMAGE)
            .from(PERSONAL_PHOTOS)
            .where(PERSONAL_PHOTOS.USER_ID.eq(userId.value))
            .fetchOne(PERSONAL_PHOTOS.IMAGE)
            ?.let(::Photo)

    // Selects the version column alone so checking for a photo never reads the image bytes.
    override fun findPersonalVersion(userId: UserId): String? =
        dsl.select(PERSONAL_PHOTOS.VERSION)
            .from(PERSONAL_PHOTOS)
            .where(PERSONAL_PHOTOS.USER_ID.eq(userId.value))
            .fetchOne(PERSONAL_PHOTOS.VERSION)

    override fun savePersonal(userId: UserId, photo: Photo) {
        dsl.insertInto(PERSONAL_PHOTOS)
            .set(PERSONAL_PHOTOS.USER_ID, userId.value)
            .set(PERSONAL_PHOTOS.IMAGE, photo.bytes)
            .set(PERSONAL_PHOTOS.VERSION, photo.version)
            .set(PERSONAL_PHOTOS.UPDATED_AT, OffsetDateTime.now(ZoneOffset.UTC))
            .onConflict(PERSONAL_PHOTOS.USER_ID)
            .doUpdate()
            .set(PERSONAL_PHOTOS.IMAGE, excluded(PERSONAL_PHOTOS.IMAGE))
            .set(PERSONAL_PHOTOS.VERSION, excluded(PERSONAL_PHOTOS.VERSION))
            .set(PERSONAL_PHOTOS.UPDATED_AT, excluded(PERSONAL_PHOTOS.UPDATED_AT))
            .execute()
    }

    override fun deletePersonal(userId: UserId) {
        dsl.deleteFrom(PERSONAL_PHOTOS).where(PERSONAL_PHOTOS.USER_ID.eq(userId.value)).execute()
    }

    override fun findTeam(userId: UserId): Photo? =
        dsl.select(MEMBER_PHOTOS.IMAGE)
            .from(MEMBER_PHOTOS)
            .where(MEMBER_PHOTOS.USER_ID.eq(userId.value))
            .fetchOne(MEMBER_PHOTOS.IMAGE)
            ?.let(::Photo)

    override fun saveTeam(userId: UserId, photo: Photo) {
        dsl.insertInto(MEMBER_PHOTOS)
            .set(MEMBER_PHOTOS.USER_ID, userId.value)
            .set(MEMBER_PHOTOS.IMAGE, photo.bytes)
            .set(MEMBER_PHOTOS.VERSION, photo.version)
            .set(MEMBER_PHOTOS.UPDATED_AT, OffsetDateTime.now(ZoneOffset.UTC))
            .onConflict(MEMBER_PHOTOS.USER_ID)
            .doUpdate()
            .set(MEMBER_PHOTOS.IMAGE, excluded(MEMBER_PHOTOS.IMAGE))
            .set(MEMBER_PHOTOS.VERSION, excluded(MEMBER_PHOTOS.VERSION))
            .set(MEMBER_PHOTOS.UPDATED_AT, excluded(MEMBER_PHOTOS.UPDATED_AT))
            .execute()
    }

    override fun deleteTeam(userId: UserId) {
        dsl.deleteFrom(MEMBER_PHOTOS).where(MEMBER_PHOTOS.USER_ID.eq(userId.value)).execute()
    }
}
