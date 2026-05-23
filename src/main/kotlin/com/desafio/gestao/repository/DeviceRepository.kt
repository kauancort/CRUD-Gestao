package com.desafio.gestao.repository

import com.desafio.gestao.model.Device
import org.springframework.data.jpa.repository.JpaRepository

interface DeviceRepository : JpaRepository<Device, Long> {
}