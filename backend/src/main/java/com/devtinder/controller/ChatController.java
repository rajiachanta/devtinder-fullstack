package com.devtinder.controller;

import com.devtinder.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import java.time.LocalDateTime;

@Controller
public class ChatController {

    @MessageMapping("/chat.send")
    @SendTo("/topic/messages")
    public ChatMessage sendMessage(ChatMessage message) {
        message.setTimestamp(LocalDateTime.now());
        return message;
    }
    
    @MessageMapping("/chat.join")
    @SendTo("/topic/messages")
    public ChatMessage joinChat(ChatMessage message) {
        message.setType(ChatMessage.MessageType.JOIN);
        message.setTimestamp(LocalDateTime.now());
        return message;
    }
}