package com.desafio.gestao.service

import com.desafio.gestao.configuration.SecurityConfig
import com.desafio.gestao.dto.request.DeviceRequest
import com.desafio.gestao.dto.request.DeviceRequestCondition
import com.desafio.gestao.dto.response.DeviceResponse
import com.desafio.gestao.model.Collaborator
import com.desafio.gestao.model.Device
import com.desafio.gestao.model.enums.CollaboratorType
import com.desafio.gestao.repository.DeviceRepository
import com.desafio.gestao.repository.OrganizationRepository
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.stereotype.Service

@Service
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
                request.condition,
                orgId
            )
        )

        return DeviceResponse(
            save.id,
            save.model,
            save.assetTag,
            save.condition,
            save.organization.id
        )
    }

    fun findAll(): List<DeviceResponse> {

        return deviceRepository.findAll()
            .map { device ->
                DeviceResponse(
                    device.id,
                    device.model,
                    device.assetTag,
                    device.condition,
                    device.organization.id,
                )
            }
    }

    fun findByOrg(): List<DeviceResponse> {

        val collaborator = getAuthenticatedCollaborator()

        val devices = deviceRepository.findByOrganizationId(
            collaborator.organization.id
        )

        return devices
            .map { device ->
                DeviceResponse(
                    device.id,
                    device.model,
                    device.assetTag,
                    device.condition,
                    device.organization.id,
                )
            }
    }

    fun findById(id: Long): DeviceResponse {

        val collaborator = getAuthenticatedCollaborator()

        val device = if (
            collaborator.accessLevel == CollaboratorType.MANAGER
        ) {

            deviceRepository.findById(id)

        } else {

            deviceRepository.findByIdAndOrganizationId(
                id,
                collaborator.organization.id
            )
        }.orElseThrow {
            RuntimeException("Device não encontrado")
        }

        return DeviceResponse(
            device.id,
            device.model,
            device.assetTag,
            device.condition,
            device.organization.id
        )
    }

    fun update(id: Long, request: DeviceRequestCondition): DeviceResponse {

        val device = deviceRepository.findById(id)
            .orElseThrow{ RuntimeException("id nao encontrado") }

        device.condition = request.condition

        val updated = deviceRepository.save(device)

        return DeviceResponse(updated.id, updated.model, updated.assetTag, updated.condition,
            updated.organization.id)

    }

    fun delete(id: Long) {
        deviceRepository.deleteById(id)
    }

    private fun getAuthenticatedCollaborator(): Collaborator {

        return SecurityContextHolder
            .getContext()
            .authentication!!
            .principal as Collaborator
    }
}