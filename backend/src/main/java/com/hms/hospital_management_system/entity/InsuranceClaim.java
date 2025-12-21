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
@Table(name = "insurance_claim")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class InsuranceClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bill_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Bill bill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admission_id")
    @JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
    private Admission admission;

    @Column(name = "claim_number", unique = true, length = 50)
    private String claimNumber;

    @Column(name = "insurance_provider", nullable = false, length = 200)
    private String insuranceProvider;

    @Column(name = "policy_number", length = 100)
    private String policyNumber;

    @Column(name = "group_number", length = 100)
    private String groupNumber;

    @Column(name = "subscriber_name", length = 200)
    private String subscriberName;

    @Column(name = "subscriber_id", length = 100)
    private String subscriberId;

    @Column(name = "claim_amount", precision = 12, scale = 2)
    private BigDecimal claimAmount;

    @Column(name = "approved_amount", precision = 12, scale = 2)
    private BigDecimal approvedAmount;

    @Column(name = "paid_amount", precision = 12, scale = 2)
    private BigDecimal paidAmount;

    @Column(name = "patient_responsibility", precision = 12, scale = 2)
    private BigDecimal patientResponsibility;

    @Enumerated(EnumType.STRING)
    @Column(length = 30)
    @Builder.Default
    private ClaimStatus status = ClaimStatus.DRAFT;

    public enum ClaimStatus {
        DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, PARTIALLY_APPROVED, REJECTED, APPEALED, PAID, CLOSED
    }

    @Column(name = "submission_date")
    private LocalDate submissionDate;

    @Column(name = "response_date")
    private LocalDate responseDate;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "pre_authorization_number", length = 100)
    private String preAuthorizationNumber;

    @Column(name = "diagnosis_codes", length = 500)
    private String diagnosisCodes;

    @Column(name = "procedure_codes", length = 500)
    private String procedureCodes;

    @Column(name = "rejection_reason", length = 1000)
    private String rejectionReason;

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
        if (claimNumber == null) {
            claimNumber = "CLM-" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
