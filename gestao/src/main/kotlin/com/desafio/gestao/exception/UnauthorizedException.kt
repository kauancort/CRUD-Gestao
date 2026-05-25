package com.desafio.gestao.exception

class UnauthorizedException(
    override val message: String
) : RuntimeException(message)