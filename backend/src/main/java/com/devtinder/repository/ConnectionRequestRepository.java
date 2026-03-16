package com.devtinder.repository;

import com.devtinder.model.ConnectionRequest;
import com.devtinder.model.User;
import com.devtinder.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConnectionRequestRepository extends JpaRepository<ConnectionRequest, Long> {

    // Find request between two users
    Optional<ConnectionRequest> findByFromUserAndToUser(User fromUser, User toUser);

    // Find all pending requests for a user (where they are the receiver)
    List<ConnectionRequest> findByToUserAndStatus(User toUser, RequestStatus status);

    // Find all requests sent by a user
    List<ConnectionRequest> findByFromUserAndStatus(User fromUser, RequestStatus status);

    // Check if request already exists
    boolean existsByFromUserAndToUser(User fromUser, User toUser);
}