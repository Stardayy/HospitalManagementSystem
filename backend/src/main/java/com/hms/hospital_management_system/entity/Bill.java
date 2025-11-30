package com.hms.hospital_management_system.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "bill")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @Column(name = "bill_date", nullable = false)
    private LocalDate billDate;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(name = "medicine_cost")
    private Double medicineCost;

    @Column(name = "room_charges")
    private Double roomCharges;

    @Column(name = "lab_charges")
    private Double labCharges;

    @Column(name = "other_charges")
    private Double otherCharges;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(name = "discount")
    private Double discount;

    @Column(name = "tax")
    private Double tax;

    @Column(name = "net_amount", nullable = false)
    private Double netAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status", length = 20)
    private PaymentStatus paymentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", length = 30)
    private PaymentMethod paymentMethod;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(length = 500)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum PaymentStatus {
        PENDING, PARTIAL, PAID, CANCELLED, REFUNDED
    }

    public enum PaymentMethod {
        CASH, CREDIT_CARD, DEBIT_CARD, INSURANCE, BANK_TRANSFER
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (billDate == null) {
            billDate = LocalDate.now();
        }
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }
        calculateTotals();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateTotals();
    }

    private void calculateTotals() {
        double total = 0.0;
        if (consultationFee != null) total += consultationFee;
        if (medicineCost != null) total += medicineCost;
        if (roomCharges != null) total += roomCharges;
        if (labCharges != null) total += labCharges;
        if (otherCharges != null) total += otherCharges;
        this.totalAmount = total;
        
        double net = total;
        if (discount != null) net -= discount;
        if (tax != null) net += tax;
        this.netAmount = net;
    }
}
