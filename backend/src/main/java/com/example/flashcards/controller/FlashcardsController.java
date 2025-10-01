package com.example.flashcards.controller;

import com.example.flashcards.dto.FlashcardDtos;
import com.example.flashcards.service.FlashcardService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flashcards")
public class FlashcardsController {

    private final FlashcardService flashcardService;

    public FlashcardsController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<FlashcardDtos.Response> get(@PathVariable Long id) {
        return ResponseEntity.ok(flashcardService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FlashcardDtos.Response> update(@PathVariable Long id, @RequestBody @Valid FlashcardDtos.Update req) {
        return ResponseEntity.ok(flashcardService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        flashcardService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
