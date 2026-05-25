package com.desafio.gestao.service

import com.desafio.gestao.dto.request.CollaboratorRequest
import com.desafio.gestao.dto.request.CollaboratorUpdateRequest
import com.desafio.gestao.dto.response.CollaboratorResponse
import com.desafio.gestao.dto.response.DeviceResponse
import com.desafio.gestao.exception.BadRequestException
import com.desafio.gestao.exception.ConflictException
import com.desafio.gestao.model.Collaborator
import com.desafio.gestao.model.enums.CollaboratorType
import com.desafio.gestao.repository.CollaboratorRepository
import com.desafio.gestao.repository.OrganizationRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class CollaboratorService(
    private val collaboratorRepository: CollaboratorRepository,
    private val organizationRepository: OrganizationRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun create(request: CollaboratorRequest ): CollaboratorResponse {

        if (collaboratorRepository.existsByEmail(request.email)) {
            throw ConflictException("Email já cadastrado")
        }

        val org = organizationRepository.findById(request.organizationId)
                .orElseThrow{
                    throw BadRequestException("Código da empresa inválido")
                }


        val collaborator = collaboratorRepository.save(
            Collaborator(
                request.fullName,
                request.email,
                request.password,
                request.accessLevel,
                org
            )
        )

        return CollaboratorResponse (
            collaborator.id,
            collaborator.fullName,
            collaborator.email,
            collaborator.accessLevel,
            collaborator.organization.id
            );
    }

    fun findAll(): List<CollaboratorResponse> {
        return collaboratorRepository.findAll()
            .map { collaborator ->
                CollaboratorResponse (
                    collaborator.id,
                    collaborator.fullName,
                    collaborator.email,
                    collaborator.accessLevel,
                    collaborator.organization.id
                )
            }
    }

    fun findAllByOrg(): List<CollaboratorResponse> {

        val collaborator = getAuthenticatedCollaborator()

        val values = collaboratorRepository.findByOrganizationId(
            collaborator.organization.id
        )

        return values
            .map { collaborator ->
                CollaboratorResponse (
                    collaborator.id,
                    collaborator.fullName,
                    collaborator.email,
                    collaborator.accessLevel,
                    collaborator.organization.id
                )
            }
    }



    fun findById(id: Long): CollaboratorResponse {

        val collaborator = getAuthenticatedCollaborator()

        val find = if (
            collaborator.accessLevel == CollaboratorType.MANAGER
        ) {

            collaboratorRepository.findById(id)

        } else {

            collaboratorRepository
                .findByIdAndOrganizationId(id, collaborator.organization.id)

        }.orElseThrow {
            RuntimeException("Colaborador não encontrado")
        }

        return CollaboratorResponse(
            find.id,
            find.fullName,
            find.email,
            find.accessLevel,
            find.organization.id
        )
    }

    fun update(id: Long, request: CollaboratorUpdateRequest): CollaboratorResponse {
        val collaborator = collaboratorRepository.findById(id)
            .orElseThrow { RuntimeException("Funcionário nao encontraddo") }

        request.fullName?.let { collaborator.fullName = it }
        request.email?.let { collaborator.email = it }

        request.password?.let { collaborator.changePassword(
            passwordEncoder.encode(it)?:
            throw RuntimeException("Erro ao criptografar senha")
        ) }

        request.accessLevel?.let { collaborator.accessLevel = it }
        request.organization?.let { collaborator.organization = it }

        collaboratorRepository.save(collaborator)

        return CollaboratorResponse (
            collaborator.id,
            collaborator.fullName,
            collaborator.email,
            collaborator.accessLevel,
            collaborator.organization.id
        )

    }

    fun delete(id: Long) {
        collaboratorRepository.deleteById(id)
    }

    private fun getAuthenticatedCollaborator(): Collaborator {

        return SecurityContextHolder
            .getContext()
            .authentication!!
            .principal as Collaborator
    }
}
