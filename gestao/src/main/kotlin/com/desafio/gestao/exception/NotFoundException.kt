package com.desafio.gestao.exception

class NotFoundException(
    override val message: String
) : RuntimeException(message)