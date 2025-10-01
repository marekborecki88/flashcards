package com.example.flashcards.repository;

import com.example.flashcards.model.Flashcard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    List<Flashcard> findByLevelIdOrderByOrderPositionAscIdAsc(Long levelId);
}