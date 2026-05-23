package com.desafio.gestao.service

import com.desafio.gestao.dto.request.OrganizationRequest
import com.desafio.gestao.dto.response.OrganizationResponse
import com.desafio.gestao.model.Organization
import com.desafio.gestao.repository.OrganizationRepository
import org.springframework.stereotype.Service

@Service
class OrganizationService (private val organizationRepository: OrganizationRepository,) {

    fun create(dto: OrganizationRequest): OrganizationResponse {

        val org = Organization(
            corporateName = dto.corporateName,
            registrationCode = dto.registrationCode
        )

        val saved = organizationRepository.save(org)

        return OrganizationResponse(
            id = saved.id,
            corporateName = saved.corporateName,
            registrationCode = saved.registrationCode
        )

    }

}