package com.hms.hospital_management_system.repository;

import com.hms.hospital_management_system.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByUsernameContainingOrActionContainingOrEntityNameContaining(
            String username, String action, String entityName, Pageable pageable);

    List<AuditLog> findByUserId(Long userId);
}
