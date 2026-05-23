package com.desafio.gestao.service

import com.desafio.gestao.dto.request.CollaboratorRequest
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

}
