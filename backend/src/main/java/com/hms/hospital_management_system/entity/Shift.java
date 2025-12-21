package com.hms.hospital_management_system.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "shift")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Staff staff;

    @Column(name = "shift_date", nullable = false)
    private LocalDate shiftDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "shift_type", nullable = false, length = 20)
    private ShiftType shiftType;

    public enum ShiftType {
        MORNING, // 6:00 AM - 2:00 PM
        AFTERNOON, // 2:00 PM - 10:00 PM
        NIGHT, // 10:00 PM - 6:00 AM
        CUSTOM
    }

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Department department;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    @Builder.Default
    private ShiftStatus status = ShiftStatus.SCHEDULED;

    public enum ShiftStatus {
        SCHEDULED, IN_PROGRESS, COMPLETED, ABSENT, ON_LEAVE, CANCELLED
    }

    @Column(name = "check_in_time")
    private LocalDateTime checkInTime;

    @Column(name = "check_out_time")
    private LocalDateTime checkOutTime;

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        setDefaultTimes();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    private void setDefaultTimes() {
        if (startTime == null && endTime == null && shiftType != null) {
            switch (shiftType) {
                case MORNING:
                    startTime = LocalTime.of(6, 0);
                    endTime = LocalTime.of(14, 0);
                    break;
                case AFTERNOON:
                    startTime = LocalTime.of(14, 0);
                    endTime = LocalTime.of(22, 0);
                    break;
                case NIGHT:
                    startTime = LocalTime.of(22, 0);
                    endTime = LocalTime.of(6, 0);
                    break;
                default:
                    break;
            }
        }
    }
}
