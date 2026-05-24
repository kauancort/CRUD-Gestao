package com.desafio.gestao.configuration

import com.desafio.gestao.security.JwtAuthFilter
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableMethodSecurity
class SecurityConfig(

    private val jwtAuthFilter: JwtAuthFilter

) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {

        http
            .cors { }
            .csrf { csrf ->
                csrf.disable()
            }

            .sessionManagement { session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            }

            .authorizeHttpRequests { auth ->

                auth.requestMatchers(
                        "/auth/**"
                    ).permitAll()

                auth.requestMatchers(
                        "/admin/**"
                    ).hasRole("MANAGER")

                auth.requestMatchers(
                    HttpMethod.GET,
                    "/organizations/**",
                    "/collabs/**",
                    "/devices/**"
                ).hasAnyRole("MANAGER", "OPERATOR")

                auth.requestMatchers(
                    HttpMethod.POST,
                    "/organizations/**",
                    "/collabs/**",
                    "/devices/**"
                ).hasRole("MANAGER")

                auth.requestMatchers(
                    HttpMethod.PUT,
                    "/organizations/**",
                    "/collabs/**",
                    "/devices/**"
                ).hasRole("MANAGER")

                auth.requestMatchers(
                    HttpMethod.DELETE,
                    "/organizations/**",
                    "/collabs/**",
                    "/devices/**"
                ).hasRole("MANAGER")

                auth.anyRequest()
                    .authenticated()


            }

            .addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    @Bean
    fun passwordEncoder(): PasswordEncoder {

        return BCryptPasswordEncoder()
    }

    @Bean
    fun authenticationManager(
        config: AuthenticationConfiguration
    ): AuthenticationManager {

        return config.authenticationManager
    }


    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()

        configuration.allowedOrigins = listOf("http://localhost:4200")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)

        return source
    }

}