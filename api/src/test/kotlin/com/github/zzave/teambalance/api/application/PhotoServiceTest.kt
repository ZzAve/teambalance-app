package com.github.zzave.teambalance.api.application

import com.github.zzave.teambalance.api.domain.exception.InvalidPhotoException
import com.github.zzave.teambalance.api.domain.exception.MemberNotFoundException
import com.github.zzave.teambalance.api.domain.exception.NoPersonalPhotoException
import com.github.zzave.teambalance.api.domain.exception.NoTeamMembershipException
import com.github.zzave.teambalance.api.domain.exception.NotTeamAdminException
import com.github.zzave.teambalance.api.domain.exception.PhotoNotFoundException
import com.github.zzave.teambalance.api.domain.model.Photo
import com.github.zzave.teambalance.api.domain.model.Role
import com.github.zzave.teambalance.api.domain.model.UserId
import com.github.zzave.teambalance.api.domain.model.jpegBytes
import com.github.zzave.teambalance.api.domain.model.webpBytes
import com.github.zzave.teambalance.api.domain.port.PhotoRepository
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

private class FakePhotoRepository : PhotoRepository {
    val personal = mutableMapOf<UserId, Photo>()
    val team = mutableMapOf<UserId, Photo>()
    override fun findPersonal(userId: UserId) = personal[userId]
    override fun findPersonalVersion(userId: UserId) = personal[userId]?.version
    override fun savePersonal(userId: UserId, photo: Photo) {
        personal[userId] = photo
    }
    override fun deletePersonal(userId: UserId) {
        personal.remove(userId)
    }
    override fun findTeam(userId: UserId) = team[userId]
    override fun saveTeam(userId: UserId, photo: Photo) {
        team[userId] = photo
    }
    override fun deleteTeam(userId: UserId) {
        team.remove(userId)
    }
}

class PhotoServiceTest : FunSpec({
    val directory = TeamDirectory()
    val teamId = directory.addTeam("Spikers", "spikers")
    val admin = UserId.random()
    val member = UserId.random()
    val other = UserId.random()
    val outsider = UserId.random()
    directory.join(admin, teamId, Role.ADMIN)
    directory.join(member, teamId)
    directory.join(other, teamId)

    fun newService(): Pair<PhotoService, FakePhotoRepository> {
        val photos = FakePhotoRepository()
        val roster = directory.teamMemberRepository()
        return PhotoService(photos, roster, AuthorizationService(roster, FakeActAsGateway())) to photos
    }

    test("a member uploads their own Team Photo and any member can read it") {
        val (service, _) = newService()
        service.uploadTeamPhoto(member, teamId, webpBytes())
        service.teamPhoto(other, teamId, member).bytes.size shouldBe 32
    }

    test("uploading a photo that is not WebP or JPEG is rejected") {
        val (service, _) = newService()
        shouldThrow<InvalidPhotoException> { service.uploadTeamPhoto(member, teamId, ByteArray(32)) }
    }

    test("a non-member cannot upload or read a Team Photo") {
        val (service, _) = newService()
        shouldThrow<MemberNotFoundException> { service.uploadTeamPhoto(outsider, teamId, webpBytes()) }
        shouldThrow<NoTeamMembershipException> { service.teamPhoto(outsider, teamId, member) }
    }

    test("reading a Team Photo that does not exist is not found") {
        val (service, _) = newService()
        shouldThrow<PhotoNotFoundException> { service.teamPhoto(member, teamId, other) }
    }

    test("an admin may remove another member's Team Photo") {
        val (service, photos) = newService()
        service.uploadTeamPhoto(member, teamId, webpBytes())
        service.removeTeamPhoto(admin, teamId, member)
        photos.team[member] shouldBe null
    }

    test("a plain member may not remove another member's Team Photo") {
        val (service, photos) = newService()
        service.uploadTeamPhoto(member, teamId, webpBytes())
        shouldThrow<NotTeamAdminException> { service.removeTeamPhoto(other, teamId, member) }
        photos.team.containsKey(member) shouldBe true
    }

    test("a member removes their own Team Photo, and removing twice is fine") {
        val (service, photos) = newService()
        service.uploadTeamPhoto(member, teamId, webpBytes())
        service.removeTeamPhoto(member, teamId, member)
        service.removeTeamPhoto(member, teamId, member)
        photos.team.containsKey(member) shouldBe false
    }

    test("an admin cannot upload a Team Photo for someone else, only for themselves") {
        val (service, photos) = newService()
        service.uploadTeamPhoto(admin, teamId, webpBytes())
        photos.team.keys shouldBe setOf(admin)
    }

    test("copying without a Personal Photo is NoPersonalPhotoException") {
        val (service, _) = newService()
        shouldThrow<NoPersonalPhotoException> { service.copyPersonalPhotoToTeam(member, teamId) }
    }

    test("copying by a non-member is MemberNotFoundException") {
        val (service, _) = newService()
        service.uploadPersonalPhoto(outsider, webpBytes())
        shouldThrow<MemberNotFoundException> { service.copyPersonalPhotoToTeam(outsider, teamId) }
    }

    test("the Team Photo is a copy: changing the Personal Photo later leaves it alone") {
        val (service, _) = newService()
        service.uploadPersonalPhoto(member, webpBytes(40))
        service.copyPersonalPhotoToTeam(member, teamId)
        service.uploadPersonalPhoto(member, jpegBytes(50))

        service.teamPhoto(member, teamId, member).bytes.size shouldBe 40
        service.personalPhoto(member).bytes.size shouldBe 50
    }

    test("Personal Photo upload, version and removal belong to the caller") {
        val (service, _) = newService()
        service.personalPhotoVersion(member) shouldBe null
        service.uploadPersonalPhoto(member, webpBytes())
        service.personalPhotoVersion(member) shouldBe Photo(webpBytes()).version
        service.personalPhotoVersion(other) shouldBe null
        service.removePersonalPhoto(member)
        shouldThrow<PhotoNotFoundException> { service.personalPhoto(member) }
    }
})
