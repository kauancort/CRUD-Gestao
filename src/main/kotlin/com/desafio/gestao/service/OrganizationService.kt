package com.desafio.gestao.service

import com.desafio.gestao.dto.request.OrganizationRequest
import com.desafio.gestao.dto.request.OrganizationRequestName
import com.desafio.gestao.dto.response.OrganizationResponse
import com.desafio.gestao.model.Organization
import com.desafio.gestao.repository.OrganizationRepository
import org.springframework.stereotype.Service

@Service
class OrganizationService (private val organizationRepository: OrganizationRepository,) {

    fun create(request: OrganizationRequest): OrganizationResponse {

        val org = Organization(
            corporateName = request.corporateName,
            registrationCode = request.registrationCode
        )

        val saved = organizationRepository.save(org)

        return OrganizationResponse(
            id = saved.id,
            corporateName = saved.corporateName,
            registrationCode = saved.registrationCode
        )

    }

    fun findAll(): List<OrganizationResponse> {
        return organizationRepository.findAll()
            .map { org -> OrganizationResponse(
                org.id,
                org.corporateName,
                org.registrationCode
            )
        }
    }

    fun update(id: Long, request: OrganizationRequestName): OrganizationResponse {
        val org = organizationRepository.findById(id)
            .orElseThrow {
            RuntimeException("Organização nao encontrada!")
            }

        org.corporateName = request.corporateName

        val saved = organizationRepository.save(org)
        return OrganizationResponse(
            saved.id,
            corporateName = saved.corporateName,
            registrationCode = saved.registrationCode
        )
    }

    fun delete(id: Long) {
        organizationRepository.deleteById(id)
    }
}