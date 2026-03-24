package com.devtinder.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ChatMessage {
    private Long id;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String content;
    private LocalDateTime timestamp;
    private MessageType type;
    
    public enum MessageType {
        CHAT, JOIN, LEAVE
    }
}