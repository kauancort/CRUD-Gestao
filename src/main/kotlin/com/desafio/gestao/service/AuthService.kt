package com.desafio.gestao.service

import com.desafio.gestao.dto.loginRegister.LoginRequest
import com.desafio.gestao.dto.loginRegister.LoginResponse
import com.desafio.gestao.dto.loginRegister.RegisterRequest
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

        if (collaboratorRepository.existsByEmail(request.email)) {
            throw RuntimeException("Email já cadastrado")
        }

        val organization = organizationRepository.findById(request.organizationId)
            .orElseThrow {
                RuntimeException("Organização não encontrada")
            }

        val encoded: String = passwordEncoder.encode(request.password)?:
            throw RuntimeException("erro ao criptografar senha")

        val collaborator = Collaborator(
            fullName = request.fullName,
            email = request.email,
            password = encoded,
            accessLevel = request.accessLevel,
            organization = organization
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

        val collaborator = collaboratorRepository.findByEmail(request.email)
            ?: throw RuntimeException("Usuário não encontrado")

        val token = jwtService.generateToken(collaborator)

        return LoginResponse(token)
    }
}