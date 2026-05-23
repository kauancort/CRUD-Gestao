package com.desafio.gestao.dto.request

import com.desafio.gestao.model.enums.CollaboratorType

data class CollaboratorRequest(

    val fullName: String,
    val email: String,
    val password: String,
    val accessLevel: CollaboratorType,
    val organizationId: Long
)