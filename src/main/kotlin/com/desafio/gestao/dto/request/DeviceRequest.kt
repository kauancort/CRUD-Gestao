package com.desafio.gestao.dto.request

data class DeviceRequest(

    var model: String,
    var assetTag: String,
    var organizationId: Long,

)
