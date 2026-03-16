package com.devtinder.controller;

import com.devtinder.model.User;
import com.devtinder.service.RequestService;
import com.devtinder.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class RequestController {

    private final RequestService requestService;
    private final UserService userService;

    @PostMapping("/send/{status}/{userId}")
    public ResponseEntity<?> sendRequest(@PathVariable String status, @PathVariable Long userId) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
            String email = userDetails.getUsername();
            User fromUser = userService.findByEmail(email);
            User toUser = userService.findById(userId);

            var request = requestService.sendRequest(fromUser, toUser, status);
            return ResponseEntity.ok("Request sent successfully: " + status);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/review/{status}/{requestId}")
    public ResponseEntity<?> reviewRequest(@PathVariable String status, @PathVariable Long requestId) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
            String email = userDetails.getUsername();
            User currentUser = userService.findByEmail(email);

            var request = requestService.reviewRequest(requestId, currentUser, status);
            return ResponseEntity.ok("Request " + status + " successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}