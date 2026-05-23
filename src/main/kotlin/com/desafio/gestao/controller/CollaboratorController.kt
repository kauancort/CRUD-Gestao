package com.desafio.gestao.controller

import com.desafio.gestao.dto.response.CollaboratorResponse
import com.desafio.gestao.model.Collaborator
import com.desafio.gestao.service.CollaboratorService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/collaborators")
class CollaboratorController(private val collaboratorService: CollaboratorService) {


    @GetMapping
    fun listAll(): List<CollaboratorResponse> =
        collaboratorService.findAll().map { it.toResponse() }

    private fun Collaborator.toResponse(): CollaboratorResponse =
        CollaboratorResponse(
            id,
            fullName,
            email,
            accessLevel,
            organizationId.id
        )
}