package com.example.flashcards.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FlashcardDtos {
    public record Create(
            @NotNull Long levelId,
            @NotBlank String sideA,
            @NotBlank String sideB,
            String imageUrl,
            String audioMp3Url,
            String exampleSentence,
            Integer orderPosition
    ) {}

    public record Update(
            String sideA,
            String sideB,
            String imageUrl,
            String audioMp3Url,
            String exampleSentence,
            Integer orderPosition
    ) {}

    public record Response(
            Long id,
            Long levelId,
            String sideA,
            String sideB,
            String imageUrl,
            String audioMp3Url,
            String exampleSentence,
            Integer orderPosition
    ) {}
}
