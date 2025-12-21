package com.hms.hospital_management_system.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.hospital_management_system.entity.InsuranceClaim;
import com.hms.hospital_management_system.entity.InsuranceClaim.ClaimStatus;
import com.hms.hospital_management_system.service.InsuranceClaimService;
import com.hms.hospital_management_system.util.AuditHelper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/insurance")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class InsuranceClaimController {

    private final InsuranceClaimService claimService;
    private final AuditHelper auditHelper;

    @GetMapping
    public ResponseEntity<List<InsuranceClaim>> getAllClaims() {
        return ResponseEntity.ok(claimService.getAllClaims());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InsuranceClaim> getClaimById(@PathVariable Long id) {
        return claimService.getClaimById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<InsuranceClaim>> getClaimsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(claimService.getClaimsByPatient(patientId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<InsuranceClaim>> getClaimsByStatus(@PathVariable ClaimStatus status) {
        return ResponseEntity.ok(claimService.getClaimsByStatus(status));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<InsuranceClaim>> getPendingClaims() {
        return ResponseEntity.ok(claimService.getPendingClaims());
    }

    @PostMapping
    public ResponseEntity<InsuranceClaim> createClaim(@RequestBody InsuranceClaim claim,
            HttpServletRequest request) {
        InsuranceClaim created = claimService.createClaim(claim);
        auditHelper.logCreate("InsuranceClaim", created.getId().toString(),
                "Created insurance claim for provider: " + claim.getInsuranceProvider(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InsuranceClaim> updateClaim(@PathVariable Long id, @RequestBody InsuranceClaim claim,
            HttpServletRequest request) {
        try {
            InsuranceClaim updated = claimService.updateClaim(id, claim);
            auditHelper.logUpdate("InsuranceClaim", id.toString(), "Updated claim details", request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/submit")
    public ResponseEntity<InsuranceClaim> submitClaim(@PathVariable Long id, HttpServletRequest request) {
        try {
            InsuranceClaim submitted = claimService.submitClaim(id);
            auditHelper.logUpdate("InsuranceClaim", id.toString(), "Claim submitted for processing", request);
            return ResponseEntity.ok(submitted);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<InsuranceClaim> approveClaim(
            @PathVariable Long id,
            @RequestParam java.math.BigDecimal approvedAmount,
            HttpServletRequest request) {
        try {
            InsuranceClaim approved = claimService.approveClaim(id, approvedAmount);
            auditHelper.logUpdate("InsuranceClaim", id.toString(),
                    "Claim approved with amount: " + approvedAmount, request);
            return ResponseEntity.ok(approved);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<InsuranceClaim> updateStatus(
            @PathVariable Long id,
            @RequestParam ClaimStatus status,
            @RequestParam(required = false) String reason,
            HttpServletRequest request) {
        try {
            InsuranceClaim updated = claimService.updateStatus(id, status, reason);
            auditHelper.logUpdate("InsuranceClaim", id.toString(), "Status updated to: " + status, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("InsuranceClaim", id.toString(), "Deleted insurance claim", request);
            claimService.deleteClaim(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
