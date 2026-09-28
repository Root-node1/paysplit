package com.paysplit.backend.common.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class ApiExceptionHandler {

    public record ApiError(
            Instant timestamp,
            int status,
            String error,
            String message,
            String path
    ) {}

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiError> handleResponseStatus(
            ResponseStatusException ex,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        String message = ex.getReason() != null ? ex.getReason() : status.getReasonPhrase();
        return ResponseEntity.status(status).body(
                new ApiError(Instant.now(), status.value(), status.getReasonPhrase(), message, request.getRequestURI())
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(
            MethodArgumentNotValidException ex,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(fe.getField(), fe.getDefaultMessage());
        }
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", Instant.now());
        body.put("status", HttpStatus.BAD_REQUEST.value());
        body.put("error", "Bad Request");
        body.put("message", "Validation failed");
        body.put("fields", fieldErrors);
        body.put("path", request.getRequestURI());
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiError> handleIllegalArgument(
            IllegalArgumentException ex,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        return ResponseEntity.badRequest().body(
                new ApiError(Instant.now(), 400, "Bad Request", ex.getMessage(), request.getRequestURI())
        );
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiError> handleIllegalState(
            IllegalStateException ex,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(
                new ApiError(Instant.now(), 409, "Conflict", ex.getMessage(), request.getRequestURI())
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(
            Exception ex,
            jakarta.servlet.http.HttpServletRequest request
    ) {
        log.error("Unhandled exception at {}: {}", request.getRequestURI(), ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                new ApiError(
                        Instant.now(),
                        500,
                        "Internal Server Error",
                        ex.getClass().getSimpleName() + ": " + ex.getMessage(),
                        request.getRequestURI()
                )
        );
    }
}
