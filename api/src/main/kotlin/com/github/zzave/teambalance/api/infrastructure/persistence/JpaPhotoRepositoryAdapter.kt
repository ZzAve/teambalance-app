package com.github.zzave.teambalance.api.infrastructure.persistence

import com.github.zzave.teambalance.api.domain.model.Photo
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.port.PhotoRepository
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.MemberPhotoJpaEntity
import com.github.zzave.teambalance.api.infrastructure.persistence.entity.PersonalPhotoJpaEntity
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.OffsetDateTime

@Repository
class JpaPhotoRepositoryAdapter(
    private val personalPhotos: SpringDataPersonalPhotoRepository,
    private val memberPhotos: SpringDataMemberPhotoRepository,
) : PhotoRepository {
    override fun findPersonal(userId: UserId): Photo? =
        personalPhotos.findById(userId.value).map { Photo(it.image) }.orElse(null)

    override fun findPersonalVersion(userId: UserId): String? = personalPhotos.findVersionByUserId(userId.value)

    @Transactional
    override fun savePersonal(userId: UserId, photo: Photo) {
        personalPhotos.save(
            PersonalPhotoJpaEntity(
                userId = userId.value,
                image = photo.bytes,
                version = photo.version,
                updatedAt = OffsetDateTime.now(),
            ),
        )
    }

    @Transactional
    override fun deletePersonal(userId: UserId) {
        personalPhotos.deleteById(userId.value)
    }

    override fun findTeam(userId: UserId): Photo? =
        memberPhotos.findById(userId.value).map { Photo(it.image) }.orElse(null)

    @Transactional
    override fun saveTeam(userId: UserId, photo: Photo) {
        memberPhotos.save(
            MemberPhotoJpaEntity(
                userId = userId.value,
                image = photo.bytes,
                version = photo.version,
                updatedAt = OffsetDateTime.now(),
            ),
        )
    }

    @Transactional
    override fun deleteTeam(userId: UserId) {
        memberPhotos.deleteById(userId.value)
    }
}
