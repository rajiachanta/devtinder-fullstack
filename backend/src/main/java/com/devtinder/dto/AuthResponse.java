package com.devtinder.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String message;
    private Long userId;
    private String email;
    private String name;

    public AuthResponse(String token, String message, Long userId, String email, String name) {
        this.token = token;
        this.message = message;
        this.userId = userId;
        this.email = email;
        this.name = name;
    }
}