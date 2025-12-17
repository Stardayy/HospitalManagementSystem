package com.hms.hospital_management_system.service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.dto.MessageDTO;
import com.hms.hospital_management_system.dto.MessageDTO.ConversationDTO;
import com.hms.hospital_management_system.dto.MessageDTO.SendMessageRequest;
import com.hms.hospital_management_system.entity.Message;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.repository.MessageRepository;
import com.hms.hospital_management_system.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageDTO sendMessage(Long senderId, SendMessageRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(request.getContent())
                .isRead(false)
                .build();

        Message saved = messageRepository.save(message);
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<MessageDTO> getConversation(Long userId, Long partnerId) {
        return messageRepository.findConversation(userId, partnerId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ConversationDTO> getConversations(Long userId) {
        // Get all partner IDs from both queries and combine them
        List<Long> receiverIds = messageRepository.findReceiverIdsForUser(userId);
        List<Long> senderIds = messageRepository.findSenderIdsForUser(userId);
        
        // Combine and deduplicate partner IDs
        java.util.Set<Long> partnerIdsSet = new java.util.HashSet<>();
        partnerIdsSet.addAll(receiverIds);
        partnerIdsSet.addAll(senderIds);
        
        // Fetch User entities by IDs
        List<User> partners = userRepository.findAllById(partnerIdsSet);
        List<ConversationDTO> conversations = new ArrayList<>();

        for (User partner : partners) {
            List<Message> conversationMessages = messageRepository.findConversation(userId, partner.getId());
            if (conversationMessages.isEmpty()) continue;

            Message lastMessage = conversationMessages.get(conversationMessages.size() - 1);
            Long unreadCount = messageRepository.countBySenderIdAndReceiverIdAndIsReadFalse(partner.getId(), userId);

            conversations.add(ConversationDTO.builder()
                    .id(partner.getId())
                    .partnerId(partner.getId())
                    .partnerName(partner.getFirstName() + " " + partner.getLastName())
                    .partnerRole(partner.getRole().name())
                    .partnerAvatar(getInitials(partner))
                    .lastMessage(lastMessage.getContent())
                    .lastMessageTime(lastMessage.getSentAt())
                    .timeAgo(getTimeAgo(lastMessage.getSentAt()))
                    .unreadCount(unreadCount)
                    .online(true) // Can implement real online status later
                    .build());
        }

        // Sort by last message time descending
        conversations.sort((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()));
        return conversations;
    }

    @Transactional(readOnly = true)
    public Long getUnreadCount(Long userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }

    public void markAsRead(Long messageId, Long userId) {
        Message message = messageRepository.findById(messageId)
                .orElseThrow(() -> new RuntimeException("Message not found"));
        
        if (message.getReceiver().getId().equals(userId)) {
            message.setIsRead(true);
            messageRepository.save(message);
        }
    }

    public void markConversationAsRead(Long userId, Long partnerId) {
        List<Message> messages = messageRepository.findConversation(userId, partnerId);
        for (Message message : messages) {
            if (message.getReceiver().getId().equals(userId) && !message.getIsRead()) {
                message.setIsRead(true);
                messageRepository.save(message);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<User> getAvailableContacts(Long userId) {
        // Get all users except current user
        return userRepository.findAll().stream()
                .filter(u -> !u.getId().equals(userId))
                .filter(u -> u.getIsActive() != null && u.getIsActive())
                .collect(Collectors.toList());
    }

    private MessageDTO toDTO(Message message) {
        return MessageDTO.builder()
                .id(message.getId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFirstName() + " " + message.getSender().getLastName())
                .senderAvatar(getInitials(message.getSender()))
                .receiverId(message.getReceiver().getId())
                .receiverName(message.getReceiver().getFirstName() + " " + message.getReceiver().getLastName())
                .receiverAvatar(getInitials(message.getReceiver()))
                .content(message.getContent())
                .isRead(message.getIsRead())
                .sentAt(message.getSentAt())
                .timeAgo(getTimeAgo(message.getSentAt()))
                .build();
    }

    private String getInitials(User user) {
        String first = user.getFirstName() != null && !user.getFirstName().isEmpty() 
                ? user.getFirstName().substring(0, 1).toUpperCase() : "";
        String last = user.getLastName() != null && !user.getLastName().isEmpty() 
                ? user.getLastName().substring(0, 1).toUpperCase() : "";
        return first + last;
    }

    private String getTimeAgo(LocalDateTime dateTime) {
        if (dateTime == null) return "";
        
        Duration duration = Duration.between(dateTime, LocalDateTime.now());
        long minutes = duration.toMinutes();
        
        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " min ago";
        
        long hours = duration.toHours();
        if (hours < 24) return hours + " hr ago";
        
        long days = duration.toDays();
        if (days < 7) return days + " day" + (days > 1 ? "s" : "") + " ago";
        
        return dateTime.toLocalDate().toString();
    }
}
