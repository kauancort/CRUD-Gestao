package com.desafio.gestao.model

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
@Table(name = "devices")
class Device(

    @Column(nullable = false)
    var model: String,

    @Column(nullable = false, unique = true)
    var assetTag: String,

    @ManyToOne
    @JoinColumn(name = "organization_id")
    var organizationId: Organization,

    @CreationTimestamp
    var createdAt: LocalDateTime = LocalDateTime.now(),

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Int

) {
}