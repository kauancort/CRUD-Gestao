package com.desafio.gestao.controller

import com.desafio.gestao.dto.request.CollaboratorRequest
import com.desafio.gestao.dto.request.CollaboratorUpdateRequest
import com.desafio.gestao.dto.response.CollaboratorResponse
import com.desafio.gestao.service.CollaboratorService
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
class CollaboratorController (private val serice: CollaboratorService) {

    @PostMapping
    fun create(@RequestBody collaborator: CollaboratorRequest): CollaboratorResponse {
        return serice.create(collaborator) 
    }

    @GetMapping
    fun findAll() : List<CollaboratorResponse> {

        return serice.listAll()
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: Long,
               @RequestBody updateRequest: CollaboratorUpdateRequest) : CollaboratorResponse {

        return serice.update(id, updateRequest)

    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) {
        return serice.delete(id)
    }

}