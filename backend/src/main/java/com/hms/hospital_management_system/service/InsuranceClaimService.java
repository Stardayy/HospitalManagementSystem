package com.hms.hospital_management_system.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.InsuranceClaim;
import com.hms.hospital_management_system.entity.InsuranceClaim.ClaimStatus;
import com.hms.hospital_management_system.repository.InsuranceClaimRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InsuranceClaimService {

    private final InsuranceClaimRepository claimRepository;

    public List<InsuranceClaim> getAllClaims() {
        return claimRepository.findAll();
    }

    public Optional<InsuranceClaim> getClaimById(Long id) {
        return claimRepository.findById(id);
    }

    public List<InsuranceClaim> getClaimsByPatient(Long patientId) {
        return claimRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<InsuranceClaim> getClaimsByStatus(ClaimStatus status) {
        return claimRepository.findByStatus(status);
    }

    public List<InsuranceClaim> getPendingClaims() {
        return claimRepository.findPendingClaims();
    }

    public InsuranceClaim createClaim(InsuranceClaim claim) {
        return claimRepository.save(claim);
    }

    public InsuranceClaim updateClaim(Long id, InsuranceClaim claimDetails) {
        InsuranceClaim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));

        claim.setInsuranceProvider(claimDetails.getInsuranceProvider());
        claim.setPolicyNumber(claimDetails.getPolicyNumber());
        claim.setGroupNumber(claimDetails.getGroupNumber());
        claim.setSubscriberName(claimDetails.getSubscriberName());
        claim.setSubscriberId(claimDetails.getSubscriberId());
        claim.setClaimAmount(claimDetails.getClaimAmount());
        claim.setDiagnosisCodes(claimDetails.getDiagnosisCodes());
        claim.setProcedureCodes(claimDetails.getProcedureCodes());
        claim.setPreAuthorizationNumber(claimDetails.getPreAuthorizationNumber());
        claim.setNotes(claimDetails.getNotes());

        return claimRepository.save(claim);
    }

    public InsuranceClaim submitClaim(Long id) {
        InsuranceClaim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
        claim.setStatus(ClaimStatus.SUBMITTED);
        claim.setSubmissionDate(LocalDate.now());
        return claimRepository.save(claim);
    }

    public InsuranceClaim updateStatus(Long id, ClaimStatus status, String reason) {
        InsuranceClaim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
        claim.setStatus(status);
        claim.setResponseDate(LocalDate.now());
        if (status == ClaimStatus.REJECTED && reason != null) {
            claim.setRejectionReason(reason);
        }
        return claimRepository.save(claim);
    }

    public InsuranceClaim approveClaim(Long id, java.math.BigDecimal approvedAmount) {
        InsuranceClaim claim = claimRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Claim not found with id: " + id));
        claim.setStatus(ClaimStatus.APPROVED);
        claim.setApprovedAmount(approvedAmount);
        claim.setResponseDate(LocalDate.now());
        return claimRepository.save(claim);
    }

    public void deleteClaim(Long id) {
        if (!claimRepository.existsById(id)) {
            throw new RuntimeException("Claim not found with id: " + id);
        }
        claimRepository.deleteById(id);
    }
}
