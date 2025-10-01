package com.example.flashcards.repository;

import com.example.flashcards.model.Course;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByIsPublicTrue();

    @EntityGraph(attributePaths = {"levels"})
    List<Course> findAll();
}