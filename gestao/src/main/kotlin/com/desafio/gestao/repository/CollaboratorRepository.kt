package com.desafio.gestao.repository

import com.desafio.gestao.model.Collaborator
import com.desafio.gestao.model.Device
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface CollaboratorRepository : JpaRepository<Collaborator, Long> {

    fun existsByEmail(email: String): Boolean

    fun findByEmail(email: String): Collaborator?

    fun findByOrganizationId(organizationId: Long): List<Collaborator>

    fun findByIdAndOrganizationId(id: Long, organizationId: Long): Optional<Collaborator>
}

