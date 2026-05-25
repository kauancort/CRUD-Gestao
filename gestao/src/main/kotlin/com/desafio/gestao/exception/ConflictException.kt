package com.desafio.gestao.exception

class ConflictException(
    override val message: String
) : RuntimeException(message)