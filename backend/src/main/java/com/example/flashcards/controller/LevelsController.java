package com.example.flashcards.controller;

import com.example.flashcards.dto.FlashcardDtos;
import com.example.flashcards.dto.LevelDtos;
import com.example.flashcards.service.FlashcardService;
import com.example.flashcards.service.LevelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/levels")
public class LevelsController {

    private final LevelService levelService;
    private final FlashcardService flashcardService;

    public LevelsController(LevelService levelService, FlashcardService flashcardService) {
        this.levelService = levelService;
        this.flashcardService = flashcardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<LevelDtos.Response> get(@PathVariable Long id) {
        return ResponseEntity.ok(levelService.getById(id));
    }

    @GetMapping("/{levelId}/flashcards")
    public ResponseEntity<List<FlashcardDtos.Response>> listFlashcards(@PathVariable Long levelId) {
        return ResponseEntity.ok(flashcardService.listByLevel(levelId));
    }

    @PostMapping("/{levelId}/flashcards")
    public ResponseEntity<FlashcardDtos.Response> createFlashcard(@PathVariable Long levelId, @RequestBody @Valid FlashcardDtos.Crflashcardseate req) {
        if (!levelId.equals(req.levelId())) {
            throw new IllegalArgumentException("Path levelId and body.levelId must match");
        }
        return ResponseEntity.ok(flashcardService.create(req));
    }
}
