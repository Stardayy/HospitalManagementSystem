package com.hms.hospital_management_system.util;

import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

/**
 * Utility class for audit logging from controllers.
 * Provides a simplified interface for logging CRUD operations.
 */
@Component
public class AuditHelper {

    private final AuditLogService auditLogService;

    public AuditHelper(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    /**
     * Get the currently authenticated user.
     */
    public User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    /**
     * Log an audit action.
     * 
     * @param action     The action type (CREATE, UPDATE, DELETE, LOGIN, etc.)
     * @param entityName The entity name (Patient, Appointment, etc.)
     * @param entityId   The ID of the affected entity
     * @param details    Additional details about the action
     * @param request    The HTTP request (for IP address)
     */
    public void log(String action, String entityName, String entityId, String details, HttpServletRequest request) {
        User user = getCurrentUser();
        String username = user != null ? user.getEmail() : "SYSTEM";
        Long userId = user != null ? user.getId() : null;
        String role = user != null ? user.getRole().name() : "UNKNOWN";
        String ipAddress = request != null ? request.getRemoteAddr() : "UNKNOWN";

        auditLogService.logAction(userId, username, role, action, entityName, entityId, details, ipAddress);
    }

    /**
     * Log a CREATE action.
     */
    public void logCreate(String entityName, String entityId, String details, HttpServletRequest request) {
        log("CREATE", entityName, entityId, details, request);
    }

    /**
     * Log an UPDATE action.
     */
    public void logUpdate(String entityName, String entityId, String details, HttpServletRequest request) {
        log("UPDATE", entityName, entityId, details, request);
    }

    /**
     * Log a DELETE action.
     */
    public void logDelete(String entityName, String entityId, String details, HttpServletRequest request) {
        log("DELETE", entityName, entityId, details, request);
    }
}
