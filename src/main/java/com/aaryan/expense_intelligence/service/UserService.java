package com.aaryan.expense_intelligence.service;

import com.aaryan.expense_intelligence.dto.SignupRequest;
import com.aaryan.expense_intelligence.entity.User;
import com.aaryan.expense_intelligence.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(SignupRequest request) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return userRepository.save(user);
    }
}