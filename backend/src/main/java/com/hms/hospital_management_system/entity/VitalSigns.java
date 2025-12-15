package com.hms.hospital_management_system.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "vital_signs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class VitalSigns {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recorded_by_doctor_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "appointments", "department"})
    private Doctor recordedBy;

    @Column(name = "recorded_at", nullable = false)
    private LocalDateTime recordedAt;

    // Temperature in Celsius
    @Column(precision = 4, scale = 1)
    private BigDecimal temperature;

    // Blood Pressure - Systolic (mmHg)
    @Column(name = "blood_pressure_systolic")
    private Integer bloodPressureSystolic;

    // Blood Pressure - Diastolic (mmHg)
    @Column(name = "blood_pressure_diastolic")
    private Integer bloodPressureDiastolic;

    // Heart Rate / Pulse (beats per minute)
    @Column(name = "heart_rate")
    private Integer heartRate;

    // Respiratory Rate (breaths per minute)
    @Column(name = "respiratory_rate")
    private Integer respiratoryRate;

    // Oxygen Saturation (SpO2 %)
    @Column(name = "oxygen_saturation")
    private Integer oxygenSaturation;

    // Weight in kg
    @Column(precision = 5, scale = 2)
    private BigDecimal weight;

    // Height in cm
    @Column(precision = 5, scale = 2)
    private BigDecimal height;

    // BMI (calculated)
    @Column(precision = 4, scale = 1)
    private BigDecimal bmi;

    // Blood Glucose Level (mg/dL)
    @Column(name = "blood_glucose")
    private Integer bloodGlucose;

    // Pain Level (0-10 scale)
    @Column(name = "pain_level")
    private Integer painLevel;

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
        if (recordedAt == null) {
            recordedAt = LocalDateTime.now();
        }
        calculateBmi();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateBmi();
    }

    private void calculateBmi() {
        if (weight != null && height != null && height.compareTo(BigDecimal.ZERO) > 0) {
            // BMI = weight (kg) / height (m)^2
            BigDecimal heightInMeters = height.divide(BigDecimal.valueOf(100), 2, java.math.RoundingMode.HALF_UP);
            this.bmi = weight.divide(heightInMeters.multiply(heightInMeters), 1, java.math.RoundingMode.HALF_UP);
        }
    }
}
