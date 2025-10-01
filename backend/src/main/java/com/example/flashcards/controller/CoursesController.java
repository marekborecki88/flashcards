package com.example.flashcards.controller;

import com.example.flashcards.dto.CourseDtos;
import com.example.flashcards.dto.LevelDtos;
import com.example.flashcards.service.CourseService;
import com.example.flashcards.service.LevelService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/courses")
public class CoursesController {

    private final CourseService courseService;
    private final LevelService levelService;

    public CoursesController(CourseService courseService, LevelService levelService) {
        this.courseService = courseService;
        this.levelService = levelService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDtos.Response>> listPublic() {
        return ResponseEntity.ok(courseService.listPublic());
    }

    @PostMapping
    public ResponseEntity<CourseDtos.Response> create(@RequestBody @Valid CourseDtos.Create req) {
        return ResponseEntity.ok(courseService.create(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CourseDtos.Response> get(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseDtos.Response> update(@PathVariable Long id, @RequestBody CourseDtos.Update req) {
        return ResponseEntity.ok(courseService.update(id, req));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{courseId}/levels")
    public ResponseEntity<List<LevelDtos.Response>> listLevels(@PathVariable Long courseId) {
        return ResponseEntity.ok(levelService.listByCourse(courseId));
    }

    @PostMapping("/{courseId}/levels")
    public ResponseEntity<LevelDtos.Response> createLevel(@PathVariable Long courseId, @RequestBody @Valid LevelDtos.Create req) {
        if (!courseId.equals(req.courseId())) {
            throw new IllegalArgumentException("Path courseId and body.courseId must match");
        }
        return ResponseEntity.ok(levelService.create(req));
    }
}
