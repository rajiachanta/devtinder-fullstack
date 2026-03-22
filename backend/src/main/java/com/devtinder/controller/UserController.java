package com.devtinder.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.devtinder.dto.ConnectionDTO;  // ← THIS IS THE CORRECT IMPORT
import com.devtinder.model.ConnectionRequest;
import com.devtinder.model.RequestStatus;
import com.devtinder.model.User;
import com.devtinder.repository.ConnectionRequestRepository;
import com.devtinder.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final ConnectionRequestRepository requestRepository;

    @GetMapping("/requests")
    public ResponseEntity<?> getPendingRequests() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
            String email = userDetails.getUsername();
            User currentUser = userService.findByEmail(email);

            List<ConnectionRequest> requests = requestRepository
                    .findByToUserAndStatus(currentUser, RequestStatus.INTERESTED);

            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/connections")
    public ResponseEntity<?> getConnections() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
            String email = userDetails.getUsername();
            User currentUser = userService.findByEmail(email);
            
            List<ConnectionDTO> connectionDTOs = currentUser.getConnections().stream()
                .map(conn -> {
                    ConnectionDTO dto = new ConnectionDTO();
                    dto.setId(conn.getId());
                    dto.setEmail(conn.getEmail());
                    dto.setName(conn.getName());
                    dto.setBio(conn.getBio());
                    dto.setLocation(conn.getLocation());
                    dto.setSkills(conn.getSkills());
                    return dto;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(connectionDTOs);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}