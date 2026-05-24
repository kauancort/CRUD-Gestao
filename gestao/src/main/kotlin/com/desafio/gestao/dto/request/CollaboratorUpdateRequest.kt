package com.desafio.gestao.dto.request

import com.desafio.gestao.model.Organization
import com.desafio.gestao.model.enums.CollaboratorType

data class CollaboratorUpdateRequest(

    var fullName: String? = null,
    var email: String? = null,
    var password: String? = null,
    var accessLevel: CollaboratorType? = null,
    var organization: Organization? = null

)
