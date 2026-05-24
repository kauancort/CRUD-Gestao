package com.desafio.gestao.repository

import com.desafio.gestao.model.Collaborator
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CollaboratorRepository : JpaRepository<Collaborator, Long> {

    fun existsByEmail(email: String): Boolean

    fun findByEmail(email: String): Collaborator?
}

