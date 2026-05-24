package com.desafio.gestao.dto.loginRegister

import com.desafio.gestao.model.enums.CollaboratorType

data class RegisterRequest(

    val fullName: String,
    val email: String,
    val password: String,
    val accessLevel: CollaboratorType,
    val organizationId: Long
)