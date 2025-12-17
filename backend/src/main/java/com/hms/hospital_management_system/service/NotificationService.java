package com.hms.hospital_management_system.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.Notification;
import com.hms.hospital_management_system.entity.Notification.NotificationType;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.repository.NotificationRepository;
import com.hms.hospital_management_system.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Optional<Notification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    public Long countUnreadNotifications(Long userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    public Notification createNotification(Long userId, String title, String message, 
                                           NotificationType type, String referenceType, Long referenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .isRead(false)
                .sentAt(LocalDateTime.now())
                .build();
        
        return notificationRepository.save(notification);
    }

    public Notification createScheduledNotification(Long userId, String title, String message, 
                                                    NotificationType type, LocalDateTime scheduledFor,
                                                    String referenceType, Long referenceId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .scheduledFor(scheduledFor)
                .referenceType(referenceType)
                .referenceId(referenceId)
                .isRead(false)
                .build();
        
        return notificationRepository.save(notification);
    }

    public Notification markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notificationRepository.save(notification);
        }
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    // ========== Appointment Reminder Methods ==========

    public void createAppointmentReminder(Long userId, Long appointmentId, String patientName, 
                                          String doctorName, LocalDateTime appointmentDateTime) {
        String title = "Appointment Reminder";
        String message = String.format("Reminder: You have an appointment with %s on %s at %s",
                doctorName,
                appointmentDateTime.toLocalDate().toString(),
                appointmentDateTime.toLocalTime().toString());
        
        // Schedule reminder for 24 hours before
        LocalDateTime reminderTime = appointmentDateTime.minusHours(24);
        if (reminderTime.isAfter(LocalDateTime.now())) {
            createScheduledNotification(userId, title, message, 
                    NotificationType.APPOINTMENT_REMINDER, reminderTime, 
                    "APPOINTMENT", appointmentId);
        }
        
        // Schedule reminder for 1 hour before
        reminderTime = appointmentDateTime.minusHours(1);
        if (reminderTime.isAfter(LocalDateTime.now())) {
            createScheduledNotification(userId, title, message, 
                    NotificationType.APPOINTMENT_REMINDER, reminderTime, 
                    "APPOINTMENT", appointmentId);
        }
    }

    public void sendLabResultNotification(Long userId, Long labOrderId, String patientName) {
        String title = "Lab Results Ready";
        String message = String.format("Lab results for %s are now available.", patientName);
        
        createNotification(userId, title, message, NotificationType.LAB_RESULT_READY, 
                "LAB_ORDER", labOrderId);
    }

    public void sendBillNotification(Long userId, Long billId, Double amount) {
        String title = "New Bill Generated";
        String message = String.format("A new bill of $%.2f has been generated for you.", amount);
        
        createNotification(userId, title, message, NotificationType.BILL_GENERATED, 
                "BILL", billId);
    }

    // ========== Process Scheduled Notifications ==========

    public void processScheduledNotifications() {
        List<Notification> pendingNotifications = notificationRepository
                .findPendingScheduledNotifications(LocalDateTime.now());
        
        for (Notification notification : pendingNotifications) {
            notification.setSentAt(LocalDateTime.now());
            notificationRepository.save(notification);
            // Here you could also trigger email/SMS sending
        }
    }
}
