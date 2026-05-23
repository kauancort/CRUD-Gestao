package com.desafio.gestao.model

import com.desafio.gestao.model.enums.CollaboratorType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "collaborators")
class Collaborator(


    @Column(nullable = false)
    var fullName: String,

    @Column(nullable = false, unique = true)
    var email: String,

    @Column(nullable = false)
    var password: String,

    @Column(nullable = false)
    var accessLevel: CollaboratorType,

    @ManyToOne
    @JoinColumn(name = "Organization_id")
    var organizationId: Organization,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,
    @CreationTimestamp
    var createdAt: LocalDateTime = LocalDateTime.now(),


    )