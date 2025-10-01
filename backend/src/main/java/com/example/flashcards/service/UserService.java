package com.example.flashcards.service;

import com.example.flashcards.dto.UserDtos;
import com.example.flashcards.model.User;
import com.example.flashcards.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserDtos.Response create(UserDtos.Create req) {
        User user = new User();
        user.setUsername(req.username());
        user.setEmail(req.email());
        // NOTE: For demo purposes, store raw password hash field as provided.
        user.setPasswordHash(req.password());
        User saved = userRepository.save(user);
        return new UserDtos.Response(saved.getId(), saved.getUsername(), saved.getEmail());
    }

    @Transactional(readOnly = true)
    public User getByIdEntity(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("User not found: " + id));
    }

    @Transactional(readOnly = true)
    public UserDtos.Response getById(Long id) {
        User u = getByIdEntity(id);
        return new UserDtos.Response(u.getId(), u.getUsername(), u.getEmail());
    }
}
