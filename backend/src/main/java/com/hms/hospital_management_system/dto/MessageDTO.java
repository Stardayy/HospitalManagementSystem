package com.hms.hospital_management_system.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageDTO {

    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Long receiverId;
    private String receiverName;
    private String receiverAvatar;
    private String content;
    private Boolean isRead;
    private LocalDateTime sentAt;
    private String timeAgo;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SendMessageRequest {
        @NotNull(message = "Receiver ID is required")
        private Long receiverId;
        
        @NotBlank(message = "Message content is required")
        private String content;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ConversationDTO {
        private Long id;
        private Long partnerId;
        private String partnerName;
        private String partnerRole;
        private String partnerAvatar;
        private String lastMessage;
        private LocalDateTime lastMessageTime;
        private String timeAgo;
        private Long unreadCount;
        private Boolean online;
    }
}
