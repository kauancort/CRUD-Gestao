import com.desafio.gestao.dto.error.ApiError
import com.desafio.gestao.dto.error.ApiErrors
import com.desafio.gestao.exception.NotFoundException
import com.desafio.gestao.exception.UnauthorizedException
import com.desafio.gestao.exception.ValidationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException::class)
    fun handleValidation(
        ex: ValidationException
    ): ResponseEntity<ApiErrors> {

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(ApiErrors(ex.errors))
    }

    @ExceptionHandler(NotFoundException::class)
    fun handleNotFound(
        ex: NotFoundException
    ): ResponseEntity<ApiError> {

        return ResponseEntity
            .status(HttpStatus.NOT_FOUND)
            .body(ApiError(ex.message))
    }

    @ExceptionHandler(Exception::class)
    fun handleGeneric(
        ex: Exception
    ): ResponseEntity<ApiError> {

        ex.printStackTrace()

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiError("Erro interno do servidor"))
    }

    @ExceptionHandler(UnauthorizedException::class)
    fun handleUnauthorized(
        ex: UnauthorizedException
    ): ResponseEntity<ApiError> {

        return ResponseEntity
            .status(HttpStatus.UNAUTHORIZED)
            .body(ApiError(ex.message))
    }
}