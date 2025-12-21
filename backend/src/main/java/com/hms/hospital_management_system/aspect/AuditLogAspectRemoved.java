package com.hms.hospital_management_system.aspect;

/**
 * AuditLogAspect has been REMOVED.
 * 
 * The AOP-based approach caused StackOverflowError due to:
 * - Aspect intercepting all service save() methods
 * - AuditLogService.logAction() calling repository.save()
 * - This triggered the aspect again → infinite recursion
 * 
 * NEW APPROACH: Explicit logging in controllers where needed.
 * See AuditLogService.logAction() for direct usage.
 * 
 * To log an action from a controller:
 * 
 * @Autowired AuditLogService auditLogService;
 *            auditLogService.logAction(userId, username, role, "CREATE",
 *            "Patient", patientId, "details", ipAddress);
 */
public class AuditLogAspectRemoved {
    // This class is intentionally empty.
    // It replaces the buggy AuditLogAspect.
    // Keeping the package/class to avoid orphan imports elsewhere.
}
