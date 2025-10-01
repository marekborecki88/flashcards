package com.example.flashcards.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class UserDtos {
    public record Create(
            @NotBlank String username,
            @Email @NotBlank String email,
            @NotBlank String password
    ) {}

    public record Response(
            Long id,
            String username,
            String email
    ) {}
}
