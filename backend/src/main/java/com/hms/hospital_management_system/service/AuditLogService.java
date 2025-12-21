package com.hms.hospital_management_system.service;

import com.hms.hospital_management_system.entity.AuditLog;
import com.hms.hospital_management_system.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Log an action synchronously with a new transaction.
     * Removed @Async as it was causing logs to fail silently.
     * Uses REQUIRES_NEW to create a separate transaction.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(Long userId, String username, String userRole, String action,
            String entityName, String entityId, String details, String ipAddress) {
        try {
            AuditLog log = new AuditLog();
            log.setUserId(userId);
            log.setUsername(username != null ? username : "SYSTEM");
            log.setUserRole(userRole != null ? userRole : "UNKNOWN");
            log.setAction(action != null ? action : "UNKNOWN");
            log.setEntityName(entityName);
            log.setEntityId(entityId);
            log.setDetails(truncateDetails(details));
            log.setIpAddress(ipAddress);
            log.setTimestamp(LocalDateTime.now());

            auditLogRepository.save(log);
            System.out.println("AUDIT LOG SAVED: " + action + " on " + entityName + " by " + username);
        } catch (Exception e) {
            // Failsafe: Don't let logging failures crash the application
            System.err.println("Failed to save audit log: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Truncate details to fit in database column (max 1000 chars).
     */
    private String truncateDetails(String details) {
        if (details == null)
            return null;
        return details.length() > 1000 ? details.substring(0, 997) + "..." : details;
    }

    /**
     * Get all audit logs with optional search filter.
     */
    public Page<AuditLog> getAllAuditLogs(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return auditLogRepository.findByUsernameContainingOrActionContainingOrEntityNameContaining(
                    search, search, search, pageable);
        }
        return auditLogRepository.findAll(pageable);
    }
}
