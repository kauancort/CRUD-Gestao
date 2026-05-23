package com.desafio.gestao.repository

import com.desafio.gestao.model.Collaborator
import org.springframework.data.jpa.repository.JpaRepository

interface CollaboratorRepository : JpaRepository<Collaborator, Long> {

}

