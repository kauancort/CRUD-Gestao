package com.desafio.gestao.model

import com.desafio.gestao.model.enums.DeviceCondition
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
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

    @Enumerated(EnumType.STRING)
    @Column(name = "device_condition", nullable = false)
    var condition: DeviceCondition,

    @ManyToOne
    @JoinColumn(name = "organization_id", nullable = false)
    var organization: Organization,


) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long = 0

    @CreationTimestamp
    var createdAt: LocalDateTime? = null
}