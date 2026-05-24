package com.desafio.gestao.dto.request

import com.desafio.gestao.model.enums.DeviceCondition

data class DeviceRequest(

    var model: String,
    var assetTag: String,
    var condition: DeviceCondition,
    var organizationId: Long,
    )
