package com.hms.hospital_management_system.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.hospital_management_system.dto.MessageDTO;
import com.hms.hospital_management_system.dto.MessageDTO.ConversationDTO;
import com.hms.hospital_management_system.dto.MessageDTO.SendMessageRequest;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.MessageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class MessageController {

    private final MessageService messageService;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return userDetails.getUser().getId();
    }

    @PostMapping("/send")
    public ResponseEntity<MessageDTO> sendMessage(@Valid @RequestBody SendMessageRequest request) {
        Long senderId = getCurrentUserId();
        return ResponseEntity.ok(messageService.sendMessage(senderId, request));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(messageService.getConversations(userId));
    }

    @GetMapping("/conversation/{partnerId}")
    public ResponseEntity<List<MessageDTO>> getConversation(@PathVariable Long partnerId) {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(messageService.getConversation(userId, partnerId));
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> getUnreadCount() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(messageService.getUnreadCount(userId));
    }

    @PutMapping("/{messageId}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long messageId) {
        Long userId = getCurrentUserId();
        messageService.markAsRead(messageId, userId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/conversation/{partnerId}/read")
    public ResponseEntity<Void> markConversationAsRead(@PathVariable Long partnerId) {
        Long userId = getCurrentUserId();
        messageService.markConversationAsRead(userId, partnerId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/contacts")
    public ResponseEntity<List<User>> getAvailableContacts() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(messageService.getAvailableContacts(userId));
    }
}
