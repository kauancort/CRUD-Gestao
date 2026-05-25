package com.desafio.gestao.controller

import com.desafio.gestao.dto.loginRegister.LoginRequest
import com.desafio.gestao.dto.loginRegister.LoginResponse
import com.desafio.gestao.dto.loginRegister.RegisterRequest
import com.desafio.gestao.service.AuthService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/auth")
class AuthController(private val service: AuthService) {


    @PostMapping("/register")
    fun register(@RequestBody request: RegisterRequest): ResponseEntity<Void> {

        //esse linha 23:
        service.register(request)

        return ResponseEntity.status(HttpStatus.CREATED).build()
    }

    @PostMapping("/login")
    fun login(@RequestBody request: LoginRequest): ResponseEntity<LoginResponse> {

        val response = service.login(request)

        return ResponseEntity.ok(response)




    }


}