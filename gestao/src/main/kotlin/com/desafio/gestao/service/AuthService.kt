package com.desafio.gestao.service

import com.desafio.gestao.dto.loginRegister.LoginRequest
import com.desafio.gestao.dto.loginRegister.LoginResponse
import com.desafio.gestao.dto.loginRegister.RegisterRequest
import com.desafio.gestao.exception.NotFoundException
import com.desafio.gestao.exception.ValidationException
import com.desafio.gestao.model.Collaborator
import com.desafio.gestao.repository.CollaboratorRepository
import com.desafio.gestao.repository.OrganizationRepository
import com.desafio.gestao.security.JwtService
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val collaboratorRepository: CollaboratorRepository,
    private val organizationRepository: OrganizationRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService,
    private val authenticationManager: AuthenticationManager
) {

    fun register(request: RegisterRequest) {

        val errors = mutableListOf<String>()

        if (collaboratorRepository.existsByEmail(request.email)) {
            errors.add("Email já cadastrado.")
        }

        val organization = organizationRepository
            .findById(request.organizationId)

        if (organization.isEmpty) {
            errors.add("Organização não encontrada.")
        }

        if (errors.isNotEmpty()) {
            //isso pertence a linha 42:
            throw ValidationException(errors)
        }

        val encoded = passwordEncoder.encode(request.password)!!

        val collaborator = Collaborator(
            fullName = request.fullName,
            email = request.email,
            password = encoded,
            accessLevel = request.accessLevel,
            organization = organization.get()
        )

        collaboratorRepository.save(collaborator)
    }

    fun login(request: LoginRequest): LoginResponse {

        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(
                request.email,
                request.password
            )
        )

        val collaborator = collaboratorRepository
            .findByEmail(request.email)
            ?: throw NotFoundException("Usuário não encontrado")

        val token = jwtService.generateToken(collaborator)

        return LoginResponse(
            token = token
        )
    }
}