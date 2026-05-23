package com.desafio.gestao.controller

import com.desafio.gestao.dto.request.DeviceRequest
import com.desafio.gestao.dto.request.DeviceRequestCondition
import com.desafio.gestao.dto.response.CollaboratorResponse
import com.desafio.gestao.dto.response.DeviceResponse
import com.desafio.gestao.service.DeviceService
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/devices")
class DeviceController(private val service: DeviceService) {

    @PostMapping
    fun create(@RequestBody device: DeviceRequest): DeviceResponse {
        return service.create(device)
    }

    @GetMapping
    fun findAll(): List<DeviceResponse> {
        return service.findAll()
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): DeviceResponse {
        return service.findById(id)
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long, @RequestBody device: DeviceRequestCondition): DeviceResponse {
        return service.update(id, device)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        service.delete(id)
    }


}