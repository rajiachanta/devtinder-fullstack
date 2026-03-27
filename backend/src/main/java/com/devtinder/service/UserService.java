package com.devtinder.service;

import com.devtinder.dto.RegisterRequest;
import com.devtinder.model.ConnectionRequest;
import com.devtinder.model.RequestStatus;
import com.devtinder.model.User;
import com.devtinder.repository.ConnectionRequestRepository;
import com.devtinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ConnectionRequestRepository requestRepository;
    private final PasswordEncoder passwordEncoder;

    //Register User
    public User registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered!");
        }

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

    //Get All Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //Get User by ID
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    //Get User by Email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    //Update Profile
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

    //FEED ALGORITHM
    public List<User> getFeed(User currentUser) {

        List<User> allUsers = userRepository.findAll();

        // Requests sent by current user
        List<ConnectionRequest> sentRequests =
                requestRepository.findByFromUserAndStatus(currentUser, RequestStatus.INTERESTED);

        // Requests received by current user
        List<ConnectionRequest> receivedRequests =
                requestRepository.findByToUserAndStatus(currentUser, RequestStatus.INTERESTED);

        Set<Long> excludeUserIds = new HashSet<>();

        // Exclude self
        excludeUserIds.add(currentUser.getId());

        // Exclude users to whom request was sent
        for (ConnectionRequest req : sentRequests) {
            excludeUserIds.add(req.getToUser().getId());
        }

        // Exclude users who sent request
        for (ConnectionRequest req : receivedRequests) {
            excludeUserIds.add(req.getFromUser().getId());
        }

        // (Optional) Exclude already connected users
        if (currentUser.getConnections() != null) {
            currentUser.getConnections()
                    .forEach(user -> excludeUserIds.add(user.getId()));
        }

        // Final filtered feed
        return allUsers.stream()
                .filter(user -> !excludeUserIds.contains(user.getId()))
                .toList();
    }
}