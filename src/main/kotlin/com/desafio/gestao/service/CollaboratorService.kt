package com.desafio.gestao.service

import com.desafio.gestao.dto.request.CollaboratorRequest
import com.desafio.gestao.dto.request.CollaboratorUpdateRequest
import com.desafio.gestao.dto.response.CollaboratorResponse
import com.desafio.gestao.model.Collaborator
import com.desafio.gestao.repository.CollaboratorRepository
import com.desafio.gestao.repository.OrganizationRepository
import org.springframework.stereotype.Service

@Service
class CollaboratorService(
    private val collaboratorRepository: CollaboratorRepository,
    private val organizationRepository: OrganizationRepository
)  {

    fun create(request: CollaboratorRequest ): CollaboratorResponse {

        if (collaboratorRepository.existsByEmail(request.email)) {
            throw RuntimeException("Este email ja existe")
        }

        val org = organizationRepository.findById(request.organizationId)
                .orElseThrow{
                    RuntimeException("Organização não encontrada")
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

    fun listAll(): List<CollaboratorResponse> {
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

    fun findById(id: Long): CollaboratorResponse {

        val find = collaboratorRepository.findById(id)
        .orElseThrow{RuntimeException("Id nao encontrado")}

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
        request.password?.let { collaborator.password = it }
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
}
