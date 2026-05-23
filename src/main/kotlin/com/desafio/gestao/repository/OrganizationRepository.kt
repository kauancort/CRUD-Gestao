package com.desafio.gestao.repository

import com.desafio.gestao.model.Organization
import org.springframework.data.jpa.repository.JpaRepository

interface OrganizationRepository : JpaRepository<Organization, Long> {
}