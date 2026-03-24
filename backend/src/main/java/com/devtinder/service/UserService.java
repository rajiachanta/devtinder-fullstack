package com.devtinder.service;

import com.devtinder.dto.RegisterRequest;
import com.devtinder.model.User;
import com.devtinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setName(request.getName());
        user.setBio(request.getBio());
        user.setLocation(request.getLocation());
        user.setGithubUrl(request.getGithubUrl());
        user.setLinkedinUrl(request.getLinkedinUrl());
        user.setSkills(request.getSkills());
        user.setExperienceLevel(request.getExperienceLevel());
        user.setLookingFor(request.getLookingFor());

        return userRepository.save(user);
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    public User updateProfile(String email, User updatedDetails) {
        User existingUser = findByEmail(email);

        if (updatedDetails.getName() != null) {
            existingUser.setName(updatedDetails.getName());
        }
        if (updatedDetails.getBio() != null) {
            existingUser.setBio(updatedDetails.getBio());
        }
        if (updatedDetails.getLocation() != null) {
            existingUser.setLocation(updatedDetails.getLocation());
        }
        if (updatedDetails.getSkills() != null) {
            existingUser.setSkills(updatedDetails.getSkills());
        }
        if (updatedDetails.getGithubUrl() != null) {
            existingUser.setGithubUrl(updatedDetails.getGithubUrl());
        }
        if (updatedDetails.getLinkedinUrl() != null) {
            existingUser.setLinkedinUrl(updatedDetails.getLinkedinUrl());
        }
        if (updatedDetails.getLookingFor() != null) {
            existingUser.setLookingFor(updatedDetails.getLookingFor());
        }
        if (updatedDetails.getExperienceLevel() != null) {
            existingUser.setExperienceLevel(updatedDetails.getExperienceLevel());
        }

        return userRepository.save(existingUser);
    }
}