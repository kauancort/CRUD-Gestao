package com.desafio.gestao.controller

import com.desafio.gestao.dto.request.OrganizationRequest
import com.desafio.gestao.dto.request.OrganizationRequestName
import com.desafio.gestao.dto.response.CollaboratorResponse
import com.desafio.gestao.dto.response.OrganizationResponse

import com.desafio.gestao.service.OrganizationService
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/orgs")
class OrganizationController(private val service: OrganizationService) {

    @PostMapping
    fun create(@RequestBody request: OrganizationRequest): OrganizationResponse {

        return service.create(request)

    }

    @GetMapping()
    @PreAuthorize("hasRole('MANAGER')")
    fun findAll(): List<OrganizationResponse> {
        return service.findAll()
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): OrganizationResponse {
        return service.findById(id)
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    fun update(@PathVariable id: Long, @RequestBody request: OrganizationRequestName): OrganizationResponse {
        return service.update(id, request)
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    fun delete(@PathVariable id: Long) {
        service.delete(id)
    }
}