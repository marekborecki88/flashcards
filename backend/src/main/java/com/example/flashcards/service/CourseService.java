package com.example.flashcards.service;

import com.example.flashcards.dto.CourseDtos;
import com.example.flashcards.model.Course;
import com.example.flashcards.model.Level;
import com.example.flashcards.model.User;
import com.example.flashcards.repository.CourseRepository;
import com.example.flashcards.repository.LevelRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {
    private final CourseRepository courseRepository;
    private final LevelRepository levelRepository;
    private final UserService userService;

    public CourseService(CourseRepository courseRepository, LevelRepository levelRepository, UserService userService) {
        this.courseRepository = courseRepository;
        this.levelRepository = levelRepository;
        this.userService = userService;
    }

    @Transactional
    public CourseDtos.Response create(CourseDtos.Create req) {
        User creator = userService.getByIdEntity(req.createdByUserId());
        Course c = new Course();
        c.setName(req.name());
        c.setDescription(req.description());
        c.setTaughtLanguage(req.taughtLanguage());
        c.setLearningLanguage(req.learningLanguage());
        c.setPublic(Boolean.TRUE.equals(req.isPublic()));
        c.setCreatedBy(creator);
        Course saved = courseRepository.save(c);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<CourseDtos.Response> listPublic() {
        return courseRepository.findByIsPublicTrue().stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Course getByIdEntity(Long id) {
        return courseRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Course not found: " + id));
    }

    @Transactional(readOnly = true)
    public CourseDtos.Response getById(Long id) {
        Course c = getByIdEntity(id);
        return toResponse(c);
    }

    @Transactional
    public CourseDtos.Response update(Long id, CourseDtos.Update req) {
        Course c = getByIdEntity(id);
        if (req.name() != null) c.setName(req.name());
        if (req.description() != null) c.setDescription(req.description());
        if (req.taughtLanguage() != null) c.setTaughtLanguage(req.taughtLanguage());
        if (req.learningLanguage() != null) c.setLearningLanguage(req.learningLanguage());
        if (req.isPublic() != null) c.setPublic(req.isPublic());
        return toResponse(c);
    }

    @Transactional
    public void delete(Long id) {
        if (!courseRepository.existsById(id)) throw new EntityNotFoundException("Course not found: " + id);
        courseRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<CourseDtos.LevelSummary> listLevels(Long courseId) {
        List<Level> levels = levelRepository.findByCourseIdOrderByOrderPositionAscIdAsc(courseId);
        return levels.stream().map(l -> new CourseDtos.LevelSummary(l.getId(), l.getName(), l.getOrderPosition())).collect(Collectors.toList());
    }

    private CourseDtos.Response toResponse(Course c) {
        List<CourseDtos.LevelSummary> levels = c.getLevels().stream()
                .map(l -> new CourseDtos.LevelSummary(l.getId(), l.getName(), l.getOrderPosition()))
                .collect(Collectors.toList());
        return new CourseDtos.Response(
                c.getId(),
                c.getName(),
                c.getDescription(),
                c.getTaughtLanguage(),
                c.getLearningLanguage(),
                c.isPublic(),
                c.getCreatedBy() != null ? c.getCreatedBy().getId() : null,
                levels
        );
    }
}
