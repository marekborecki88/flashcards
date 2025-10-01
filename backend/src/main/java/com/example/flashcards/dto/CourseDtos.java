package com.example.flashcards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CourseDtos {
    public record Create(
            @NotBlank String name,
            String description,
            @NotBlank String taughtLanguage,
            @NotBlank String learningLanguage,
            @NotNull Boolean isPublic,
            @NotNull Long createdByUserId
    ) {}

    public record Update(
            String name,
            String description,
            String taughtLanguage,
            String learningLanguage,
            Boolean isPublic
    ) {}

    public record LevelSummary(
            Long id,
            String name,
            Integer orderPosition
    ) {}

    public record Response(
            Long id,
            String name,
            String description,
            String taughtLanguage,
            String learningLanguage,
            boolean isPublic,
            Long createdByUserId,
            List<LevelSummary> levels
    ) {}
}
