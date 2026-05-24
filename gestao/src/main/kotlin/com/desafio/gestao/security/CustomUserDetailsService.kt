package com.desafio.gestao.security

import com.desafio.gestao.repository.CollaboratorRepository
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service

@Service
class CustomUserDetailsService(private val collaboratorRepository: CollaboratorRepository) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails {

        return collaboratorRepository.findByEmail(username)?:
            throw UsernameNotFoundException("Usuário $username não encontrado")


    }


}