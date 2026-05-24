package com.desafio.gestao.repository

import com.desafio.gestao.model.Device
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface DeviceRepository : JpaRepository<Device, Long> {

    fun findByOrganizationId(organizationId: Long): List<Device>

    fun findByIdAndOrganizationId(id: Long, organizationId: Long): Optional<Device>
}