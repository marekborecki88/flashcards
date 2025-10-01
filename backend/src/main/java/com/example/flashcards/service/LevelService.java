package com.example.flashcards.service;

import com.example.flashcards.dto.LevelDtos;
import com.example.flashcards.model.Course;
import com.example.flashcards.model.Flashcard;
import com.example.flashcards.model.Level;
import com.example.flashcards.repository.FlashcardRepository;
import com.example.flashcards.repository.LevelRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LevelService {
    private final LevelRepository levelRepository;
    private final FlashcardRepository flashcardRepository;
    private final CourseService courseService;

    public LevelService(LevelRepository levelRepository, FlashcardRepository flashcardRepository, CourseService courseService) {
        this.levelRepository = levelRepository;
        this.flashcardRepository = flashcardRepository;
        this.courseService = courseService;
    }

    @Transactional
    public LevelDtos.Response create(LevelDtos.Create req) {
        Course course = courseService.getByIdEntity(req.courseId());
        Level level = new Level();
        level.setCourse(course);
        level.setName(req.name());
        level.setDescription(req.description());
        level.setOrderPosition(req.orderPosition());
        Level saved = levelRepository.save(level);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Level getByIdEntity(Long id) {
        return levelRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Level not found: " + id));
    }

    @Transactional(readOnly = true)
    public LevelDtos.Response getById(Long id) {
        return toResponse(getByIdEntity(id));
    }

    @Transactional(readOnly = true)
    public List<LevelDtos.Response> listByCourse(Long courseId) {
        return levelRepository.findByCourseIdOrderByOrderPositionAscIdAsc(courseId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private LevelDtos.Response toResponse(Level level) {
        List<Flashcard> fcs = flashcardRepository.findByLevelIdOrderByOrderPositionAscIdAsc(level.getId());
        var flashcards = fcs.stream().map(f -> new LevelDtos.FlashcardSummary(f.getId(), f.getSideA(), f.getSideB(), f.getOrderPosition())).collect(Collectors.toList());
        return new LevelDtos.Response(level.getId(), level.getCourse().getId(), level.getName(), level.getDescription(), level.getOrderPosition(), flashcards);
    }
}
