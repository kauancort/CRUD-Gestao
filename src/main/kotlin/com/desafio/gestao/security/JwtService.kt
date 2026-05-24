package com.desafio.gestao.security

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Service
import java.security.Key
import java.util.Date

@Service
class JwtService(

    @Value("\${app.jwt.secret}")
    private val secretKey: String,

    @Value("\${app.jwt.expiration}")
    private val jwtExpiration: Long

) {

    fun generateToken(userDetails: UserDetails): String {

        return Jwts.builder()
            .setSubject(userDetails.username)
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + jwtExpiration))
            .signWith(getSignKey(), SignatureAlgorithm.HS256)
            .compact()
    }

    fun extractUsername(token: String): String {
        return extractClaim(token) { claims ->
            claims.subject
        }
    }

    fun isTokenValid(token: String, userDetails: UserDetails): Boolean {

        val username = extractUsername(token)

        return username == userDetails.username &&
                !isTokenExpired(token)
    }

    private fun isTokenExpired(token: String): Boolean {
        return extractExpiration(token).before(Date())
    }

    private fun extractExpiration(token: String): Date {
        return extractClaim(token) { claims ->
            claims.expiration
        }
    }

    private fun <T> extractClaim(
        token: String,
        resolver: (Claims) -> T
    ): T {

        val claims = extractAllClaims(token)

        return resolver(claims)
    }

    private fun extractAllClaims(token: String): Claims {

        return Jwts.parserBuilder()
            .setSigningKey(getSignKey())
            .build()
            .parseClaimsJws(token)
            .body
    }

    private fun getSignKey(): Key {

        val keyBytes = secretKey.toByteArray()

        return Keys.hmacShaKeyFor(keyBytes)
    }
}