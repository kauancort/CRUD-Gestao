package com.desafio.gestao.exception

class BadRequestException(
    override val message: String
) : RuntimeException(message)