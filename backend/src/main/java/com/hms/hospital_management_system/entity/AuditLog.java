package com.hms.hospital_management_system.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String username;

    private String userRole;

    @Column(nullable = false)
    private String action; // CREATE, UPDATE, DELETE, LOGIN, VIEW

    private String entityName; // Patient, Appointment, etc.

    private String entityId; // ID of the entity affected

    @Column(length = 1000)
    private String details; // Description of the change

    private String ipAddress;

    private LocalDateTime timestamp;

    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}
