package com.desafio.gestao.exception

class ValidationException(
    val errors: List<String>
) : RuntimeException()