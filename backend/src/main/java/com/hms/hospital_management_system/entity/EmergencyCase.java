package com.hms.hospital_management_system.entity;

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
@Table(name = "emergency_case")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class EmergencyCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Patient patient;

    // For walk-in patients without registration
    @Column(name = "patient_name", length = 200)
    private String patientName;

    @Column(name = "patient_age")
    private Integer patientAge;

    @Column(name = "patient_gender", length = 10)
    private String patientGender;

    @Column(name = "patient_phone", length = 20)
    private String patientPhone;

    @Column(name = "arrival_time", nullable = false)
    private LocalDateTime arrivalTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "triage_level", nullable = false, length = 20)
    private TriageLevel triageLevel;

    /**
     * Triage levels based on Emergency Severity Index (ESI):
     * 1 - Resuscitation: Immediate life-saving intervention required
     * 2 - Emergency: High risk, time-sensitive condition
     * 3 - Urgent: Stable but needs multiple resources
     * 4 - Less Urgent: Stable, needs one resource
     * 5 - Non-Urgent: Stable, may wait without treatment
     */
    public enum TriageLevel {
        LEVEL_1_RESUSCITATION,
        LEVEL_2_EMERGENCY,
        LEVEL_3_URGENT,
        LEVEL_4_LESS_URGENT,
        LEVEL_5_NON_URGENT
    }

    @Column(name = "chief_complaint", nullable = false, length = 500)
    private String chiefComplaint;

    @Column(name = "vital_signs", length = 500)
    private String vitalSigns;

    @Column(name = "initial_assessment", length = 2000)
    private String initialAssessment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_doctor_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler", "appointments", "department" })
    private Doctor assignedDoctor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_nurse_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Staff assignedNurse;

    @Column(name = "treatment_area", length = 50)
    private String treatmentArea;

    @Column(name = "bed_number", length = 20)
    private String bedNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Builder.Default
    private EmergencyStatus status = EmergencyStatus.WAITING;

    public enum EmergencyStatus {
        WAITING, TRIAGE, IN_TREATMENT, OBSERVATION, ADMITTED, DISCHARGED, TRANSFERRED, DECEASED, LEFT_WITHOUT_BEING_SEEN
    }

    @Column(name = "treatment_notes", length = 2000)
    private String treatmentNotes;

    @Column(name = "diagnosis", length = 500)
    private String diagnosis;

    @Column(name = "disposition", length = 500)
    private String disposition;

    @Column(name = "treatment_start_time")
    private LocalDateTime treatmentStartTime;

    @Column(name = "treatment_end_time")
    private LocalDateTime treatmentEndTime;

    @Column(name = "discharge_time")
    private LocalDateTime dischargeTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Admission admission;

    @Column(name = "ambulance_arrival")
    private Boolean ambulanceArrival;

    @Column(name = "brought_by", length = 200)
    private String broughtBy;

    @Column(length = 2000)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (arrivalTime == null) {
            arrivalTime = LocalDateTime.now();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public String getTriageLevelDescription() {
        return switch (triageLevel) {
            case LEVEL_1_RESUSCITATION -> "1 - Resuscitation (Immediate)";
            case LEVEL_2_EMERGENCY -> "2 - Emergency (High Risk)";
            case LEVEL_3_URGENT -> "3 - Urgent (Stable)";
            case LEVEL_4_LESS_URGENT -> "4 - Less Urgent";
            case LEVEL_5_NON_URGENT -> "5 - Non-Urgent";
        };
    }
}
