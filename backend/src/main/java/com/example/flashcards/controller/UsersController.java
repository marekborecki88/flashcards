package com.example.flashcards.controller;

import com.example.flashcards.dto.UserDtos;
import com.example.flashcards.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UsersController {

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserDtos.Response> create(@RequestBody @Valid UserDtos.Create req) {
        return ResponseEntity.ok(userService.create(req));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDtos.Response> get(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getById(id));
    }
}
