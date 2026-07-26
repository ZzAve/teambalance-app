package com.github.zzave.teambalance.api.interfaces

import com.github.zzave.teambalance.api.domain.exception.ConflictException
import com.github.zzave.teambalance.api.domain.exception.ForbiddenException
import com.github.zzave.teambalance.api.domain.exception.NotFoundException
import com.github.zzave.teambalance.api.domain.exception.TeambalanceException
import com.github.zzave.teambalance.api.domain.exception.UnprocessableEntityException
import com.github.zzave.teambalance.api.domain.exception.UnauthenticatedException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import java.time.format.DateTimeParseException

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(UnauthenticatedException::class)
    fun handleUnauthenticated(ex: UnauthenticatedException): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(mapOf("error" to (ex.message ?: "Unauthorized")))

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFound(ex: NotFoundException): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(mapOf("error" to (ex.message ?: "Not found")))

    @ExceptionHandler(ForbiddenException::class)
    fun handleForbidden(ex: ForbiddenException): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(mapOf("error" to (ex.message ?: "Forbidden"), "code" to ex.code))

    @ExceptionHandler(ConflictException::class)
    fun handleConflict(ex: ConflictException): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(HttpStatus.CONFLICT)
            .body(mapOf("error" to (ex.message ?: "Conflict"), "code" to ex.code))

    @ExceptionHandler(UnprocessableEntityException::class)
    fun handleUnprocessableEntity(ex: UnprocessableEntityException): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
            .body(mapOf("error" to (ex.message ?: "Unprocessable"), "code" to ex.code))

    @ExceptionHandler(TeambalanceException::class)
    fun handleTeambalanceException(ex: TeambalanceException): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(mapOf("error" to (ex.message ?: "Invalid request")))

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(ex: IllegalArgumentException): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(mapOf("error" to (ex.message ?: "Invalid request")))

    @ExceptionHandler(DateTimeParseException::class)
    fun handleDateTimeParse(ex: DateTimeParseException): ResponseEntity<Map<String, String>> =
        ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(mapOf("error" to "Invalid date/time format: ${ex.parsedString}"))
}
