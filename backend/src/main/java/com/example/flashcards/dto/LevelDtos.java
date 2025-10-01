package com.example.flashcards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class LevelDtos {
    public record Create(
            @NotNull Long courseId,
            @NotBlank String name,
            String description,
            Integer orderPosition
    ) {}

    public record Response(
            Long id,
            Long courseId,
            String name,
            String description,
            Integer orderPosition,
            List<FlashcardSummary> flashcards
    ) {}

    public record FlashcardSummary(
            Long id,
            String sideA,
            String sideB,
            Integer orderPosition
    ) {}
}
