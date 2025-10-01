package com.example.flashcards.service;

import com.example.flashcards.dto.FlashcardDtos;
import com.example.flashcards.model.Flashcard;
import com.example.flashcards.model.Level;
import com.example.flashcards.repository.FlashcardRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FlashcardService {
    private final FlashcardRepository flashcardRepository;
    private final LevelService levelService;

    public FlashcardService(FlashcardRepository flashcardRepository, LevelService levelService) {
        this.flashcardRepository = flashcardRepository;
        this.levelService = levelService;
    }

    @Transactional
    public FlashcardDtos.Response create(FlashcardDtos.Create req) {
        Level level = levelService.getByIdEntity(req.levelId());
        Flashcard f = new Flashcard();
        f.setLevel(level);
        f.setSideA(req.sideA());
        f.setSideB(req.sideB());
        f.setImageUrl(req.imageUrl());
        f.setAudioMp3Url(req.audioMp3Url());
        f.setExampleSentence(req.exampleSentence());
        f.setOrderPosition(req.orderPosition());
        Flashcard saved = flashcardRepository.save(f);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Flashcard getByIdEntity(Long id) {
        return flashcardRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Flashcard not found: " + id));
    }

    @Transactional(readOnly = true)
    public FlashcardDtos.Response getById(Long id) { return toResponse(getByIdEntity(id)); }

    @Transactional
    public FlashcardDtos.Response update(Long id, FlashcardDtos.Update req) {
        Flashcard f = getByIdEntity(id);
        if (req.sideA() != null) f.setSideA(req.sideA());
        if (req.sideB() != null) f.setSideB(req.sideB());
        if (req.imageUrl() != null) f.setImageUrl(req.imageUrl());
        if (req.audioMp3Url() != null) f.setAudioMp3Url(req.audioMp3Url());
        if (req.exampleSentence() != null) f.setExampleSentence(req.exampleSentence());
        if (req.orderPosition() != null) f.setOrderPosition(req.orderPosition());
        return toResponse(f);
    }

    @Transactional
    public void delete(Long id) {
        if (!flashcardRepository.existsById(id)) throw new EntityNotFoundException("Flashcard not found: " + id);
        flashcardRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<FlashcardDtos.Response> listByLevel(Long levelId) {
        return flashcardRepository.findByLevelIdOrderByOrderPositionAscIdAsc(levelId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private FlashcardDtos.Response toResponse(Flashcard f) {
        return new FlashcardDtos.Response(
                f.getId(),
                f.getLevel().getId(),
                f.getSideA(),
                f.getSideB(),
                f.getImageUrl(),
                f.getAudioMp3Url(),
                f.getExampleSentence(),
                f.getOrderPosition()
        );
    }
}
