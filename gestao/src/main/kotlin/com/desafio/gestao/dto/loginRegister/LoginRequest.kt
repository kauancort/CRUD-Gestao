package com.desafio.gestao.dto.loginRegister
import com.desafio.gestao.model.enums.CollaboratorType

data class LoginRequest (
    val email: String,
    val password: String,
)