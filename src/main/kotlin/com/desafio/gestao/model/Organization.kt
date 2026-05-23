package com.desafio.gestao.model

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.CreationTimestamp
import java.time.LocalDateTime

@Entity
@Table(name = "organizations")
class Organization(

    @Column(nullable = false)
    var corporateName: String,

    @Column(nullable = false, unique = true)
    var registrationCode: Int,

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0,

    @CreationTimestamp
    var createdAt: LocalDateTime = LocalDateTime.now()

)
