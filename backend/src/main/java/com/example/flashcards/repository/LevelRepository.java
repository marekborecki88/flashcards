package com.example.flashcards.repository;

import com.example.flashcards.model.Level;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LevelRepository extends JpaRepository<Level, Long> {
    List<Level> findByCourseIdOrderByOrderPositionAscIdAsc(Long courseId);
}