package com.hms.hospital_management_system.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "admission")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Admission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "appointments", "department"})
    private Doctor admittingDoctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Room room;

    @Column(name = "bed_number")
    private String bedNumber;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "admission_time")
    private LocalDateTime admissionTime;

    @Column(name = "expected_discharge_date")
    private LocalDate expectedDischargeDate;

    @Column(name = "actual_discharge_date")
    private LocalDate actualDischargeDate;

    @Column(name = "discharge_time")
    private LocalDateTime dischargeTime;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AdmissionStatus status;

    public enum AdmissionStatus {
        ADMITTED, DISCHARGED, TRANSFERRED, DECEASED
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "admission_type", length = 20)
    private AdmissionType admissionType;

    public enum AdmissionType {
        EMERGENCY, SCHEDULED, TRANSFER, OBSERVATION
    }

    @Column(name = "reason_for_admission", length = 500)
    private String reasonForAdmission;

    @Column(name = "diagnosis", length = 500)
    private String diagnosis;

    @Column(name = "discharge_summary", length = 2000)
    private String dischargeSummary;

    @Column(name = "discharge_instructions", length = 1000)
    private String dischargeInstructions;

    @Column(name = "total_charges", precision = 12, scale = 2)
    private BigDecimal totalCharges;

    @Column(name = "insurance_info", length = 500)
    private String insuranceInfo;

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
        if (status == null) {
            status = AdmissionStatus.ADMITTED;
        }
        if (admissionTime == null) {
            admissionTime = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
