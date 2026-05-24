package com.desafio.gestao.controller

import com.desafio.gestao.dto.request.CollaboratorRequest
import com.desafio.gestao.dto.request.CollaboratorUpdateRequest
import com.desafio.gestao.dto.response.CollaboratorResponse
import com.desafio.gestao.service.CollaboratorService
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
@RequestMapping("/collabs")
class CollaboratorController (private val service: CollaboratorService) {

    @PostMapping
    fun create(@RequestBody collaborator: CollaboratorRequest): CollaboratorResponse {
        return service.create(collaborator)
    }

    @GetMapping("/find-all")
    @PreAuthorize("hasRole('MANAGER')")
    fun findAll() : List<CollaboratorResponse> {

        return service.findAll()
    }

    @GetMapping()
    fun findAllByOrg(): List<CollaboratorResponse> {
        return service.findAll()
    }

    @GetMapping("/{id}")
    fun findById(@PathVariable id: Long): CollaboratorResponse {
        return service.findById(id)
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}")
    fun update(@PathVariable id: Long,
               @RequestBody updateRequest: CollaboratorUpdateRequest) : CollaboratorResponse {

        return service.update(id, updateRequest)

    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        return service.delete(id)
    }

}