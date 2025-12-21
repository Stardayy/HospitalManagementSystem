package com.hms.hospital_management_system.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.InsuranceClaim;
import com.hms.hospital_management_system.entity.InsuranceClaim.ClaimStatus;

@Repository
public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {

    List<InsuranceClaim> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    List<InsuranceClaim> findByStatus(ClaimStatus status);

    Optional<InsuranceClaim> findByClaimNumber(String claimNumber);

    List<InsuranceClaim> findByInsuranceProviderContainingIgnoreCase(String provider);

    @Query("SELECT c FROM InsuranceClaim c WHERE c.submissionDate BETWEEN :startDate AND :endDate")
    List<InsuranceClaim> findBySubmissionDateRange(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT c FROM InsuranceClaim c WHERE c.status IN ('SUBMITTED', 'UNDER_REVIEW')")
    List<InsuranceClaim> findPendingClaims();

    @Query("SELECT SUM(c.claimAmount) FROM InsuranceClaim c WHERE c.status = 'APPROVED' OR c.status = 'PAID'")
    java.math.BigDecimal getTotalApprovedAmount();

    List<InsuranceClaim> findByBillId(Long billId);
}
