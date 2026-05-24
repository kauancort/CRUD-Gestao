package com.desafio.gestao.dto.response

import com.desafio.gestao.model.enums.DeviceCondition

data class DeviceResponse(
    var id: Long,
    var model: String,
    var assetTag: String,
    var condition: DeviceCondition,
    var organizationId: Long,

    )
