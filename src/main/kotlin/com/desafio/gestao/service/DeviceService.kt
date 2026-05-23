package com.desafio.gestao.service

import com.desafio.gestao.dto.request.DeviceRequest
import com.desafio.gestao.dto.response.DeviceResponse
import com.desafio.gestao.model.Device
import com.desafio.gestao.repository.DeviceRepository
import com.desafio.gestao.repository.OrganizationRepository

class DeviceService(
    private val deviceRepository: DeviceRepository,
    private val organizationRepository: OrganizationRepository
) {

    fun create(request: DeviceRequest): DeviceResponse {

        val orgId = organizationRepository.findById(request.organizationId)
            .orElseThrow{ RuntimeException("id nao encontrado") }

        val save = deviceRepository.save(
            Device(
                request.model,
                request.assetTag,
                orgId
            )
        )

        return DeviceResponse(
            save.model,
            save.assetTag,
            save.organization.id
        )

    }




}