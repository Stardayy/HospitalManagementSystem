package com.hms.hospital_management_system.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Notification;
import com.hms.hospital_management_system.entity.Notification.NotificationType;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByUserId(Long userId);
    
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<Notification> findByType(NotificationType type);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    Long countUnreadByUserId(@Param("userId") Long userId);
    
    @Query("SELECT n FROM Notification n WHERE n.scheduledFor <= :now AND n.sentAt IS NULL")
    List<Notification> findPendingScheduledNotifications(@Param("now") LocalDateTime now);
    
    @Query("SELECT n FROM Notification n WHERE n.referenceType = :referenceType AND n.referenceId = :referenceId")
    List<Notification> findByReference(@Param("referenceType") String referenceType, @Param("referenceId") Long referenceId);
}
