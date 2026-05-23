package com.desafio.gestao.service

import com.desafio.gestao.dto.request.CollaboratorRequest
import com.desafio.gestao.dto.response.CollaboratorResponse
import com.desafio.gestao.model.Collaborator
import com.desafio.gestao.repository.CollaboratorRepository
import com.desafio.gestao.repository.OrganizationRepository
import org.springframework.stereotype.Service

@Service
class CollaboratorService(
    private val repository: CollaboratorRepository,
    private val organizationRepository: OrganizationRepository
)  {

    fun create(request: CollaboratorRequest ): CollaboratorResponse {

        val org = organizationRepository.findById(request.organizationId)
                                            .orElseThrow{ RuntimeException("Organização não encontrada") }

        val saved = repository.save(
            Collaborator(
                    request.fullName,
                    request.email,
                    request.password,
                    request.accessLevel,
                    org
            )
        )

        return CollaboratorResponse (
            saved.id,
            saved.fullName,
            saved.email,
            saved.accessLevel,
            org.id
            );
    }


    //fun update(request: CollaboratorRequest ): CollaboratorResponse {}

    fun findAll(): List<Collaborator> = repository.findAll()
}
