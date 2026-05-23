package com.desafio.gestao.dto.response

import com.desafio.gestao.model.enums.CollaboratorType

data class CollaboratorResponse(
    val fullName: String,
    val email: String,
    val accessLevel: CollaboratorType,
    val organizationId: Long
)
