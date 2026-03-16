package com.devtinder.service;

import com.devtinder.model.ConnectionRequest;
import com.devtinder.model.User;
import com.devtinder.model.RequestStatus;
import com.devtinder.repository.ConnectionRequestRepository;
import com.devtinder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RequestService {

    private final ConnectionRequestRepository requestRepository;
    private final UserRepository userRepository;

    @Transactional
    public ConnectionRequest sendRequest(User fromUser, User toUser, String statusStr) {
        if (fromUser.getId().equals(toUser.getId())) {
            throw new RuntimeException("Cannot send request to yourself");
        }

        if (requestRepository.existsByFromUserAndToUser(fromUser, toUser)) {
            throw new RuntimeException("Request already exists");
        }

        RequestStatus status;
        try {
            status = RequestStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + statusStr);
        }

        ConnectionRequest request = new ConnectionRequest();
        request.setFromUser(fromUser);
        request.setToUser(toUser);
        request.setStatus(status);

        return requestRepository.save(request);
    }

    @Transactional
    public ConnectionRequest reviewRequest(Long requestId, User currentUser, String statusStr) {
        ConnectionRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        if (!request.getToUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You are not authorized to review this request");
        }

        if (request.getStatus() != RequestStatus.INTERESTED) {
            throw new RuntimeException("Only INTERESTED requests can be reviewed");
        }

        RequestStatus newStatus;
        try {
            newStatus = RequestStatus.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status: " + statusStr);
        }

        if (newStatus != RequestStatus.ACCEPTED && newStatus != RequestStatus.REJECTED) {
            throw new RuntimeException("Status must be ACCEPTED or REJECTED");
        }

        request.setStatus(newStatus);

        if (newStatus == RequestStatus.ACCEPTED) {
            User fromUser = request.getFromUser();
            User toUser = request.getToUser();

            fromUser.getConnections().add(toUser);
            toUser.getConnections().add(fromUser);

            userRepository.save(fromUser);
            userRepository.save(toUser);
        }

        return requestRepository.save(request);
    }
}