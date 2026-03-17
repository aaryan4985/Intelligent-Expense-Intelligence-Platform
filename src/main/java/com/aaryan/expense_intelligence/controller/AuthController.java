package com.aaryan.expense_intelligence.controller;

import com.aaryan.expense_intelligence.dto.SignupRequest;
import com.aaryan.expense_intelligence.entity.User;
import com.aaryan.expense_intelligence.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public User signup(@RequestBody SignupRequest request) {

        return userService.registerUser(request);

    }
}