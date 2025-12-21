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

import com.hms.hospital_management_system.entity.EmergencyCase;
import com.hms.hospital_management_system.entity.EmergencyCase.EmergencyStatus;
import com.hms.hospital_management_system.entity.EmergencyCase.TriageLevel;
import com.hms.hospital_management_system.service.EmergencyCaseService;
import com.hms.hospital_management_system.util.AuditHelper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/emergency")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class EmergencyCaseController {

    private final EmergencyCaseService emergencyService;
    private final AuditHelper auditHelper;

    @GetMapping
    public ResponseEntity<List<EmergencyCase>> getAllCases() {
        return ResponseEntity.ok(emergencyService.getAllCases());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmergencyCase> getCaseById(@PathVariable Long id) {
        return emergencyService.getCaseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public ResponseEntity<List<EmergencyCase>> getActiveCases() {
        return ResponseEntity.ok(emergencyService.getActiveCases());
    }

    @GetMapping("/today")
    public ResponseEntity<List<EmergencyCase>> getTodaysCases() {
        return ResponseEntity.ok(emergencyService.getTodaysCases());
    }

    @GetMapping("/count/active")
    public ResponseEntity<Long> getActiveCaseCount() {
        return ResponseEntity.ok(emergencyService.getActiveCaseCount());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<EmergencyCase>> getCasesByStatus(@PathVariable EmergencyStatus status) {
        return ResponseEntity.ok(emergencyService.getCasesByStatus(status));
    }

    @GetMapping("/triage/{level}")
    public ResponseEntity<List<EmergencyCase>> getCasesByTriageLevel(@PathVariable TriageLevel level) {
        return ResponseEntity.ok(emergencyService.getCasesByTriageLevel(level));
    }

    @PostMapping
    public ResponseEntity<EmergencyCase> createCase(@RequestBody EmergencyCase emergencyCase,
            HttpServletRequest request) {
        EmergencyCase created = emergencyService.createCase(emergencyCase);
        auditHelper.logCreate("EmergencyCase", created.getId().toString(),
                "Created emergency case: " + emergencyCase.getChiefComplaint(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmergencyCase> updateCase(@PathVariable Long id, @RequestBody EmergencyCase emergencyCase,
            HttpServletRequest request) {
        try {
            EmergencyCase updated = emergencyService.updateCase(id, emergencyCase);
            auditHelper.logUpdate("EmergencyCase", id.toString(), "Updated emergency case details", request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/triage")
    public ResponseEntity<EmergencyCase> startTriage(@PathVariable Long id, HttpServletRequest request) {
        try {
            EmergencyCase updated = emergencyService.startTriage(id);
            auditHelper.logUpdate("EmergencyCase", id.toString(), "Triage started", request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/start-treatment")
    public ResponseEntity<EmergencyCase> startTreatment(@PathVariable Long id, HttpServletRequest request) {
        try {
            EmergencyCase updated = emergencyService.startTreatment(id);
            auditHelper.logUpdate("EmergencyCase", id.toString(), "Treatment started", request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<EmergencyCase> updateStatus(@PathVariable Long id, @RequestParam EmergencyStatus status,
            HttpServletRequest request) {
        try {
            EmergencyCase updated = emergencyService.updateStatus(id, status);
            auditHelper.logUpdate("EmergencyCase", id.toString(), "Status updated to: " + status, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/discharge")
    public ResponseEntity<EmergencyCase> dischargePatient(@PathVariable Long id, @RequestParam String disposition,
            HttpServletRequest request) {
        try {
            EmergencyCase discharged = emergencyService.dischargePatient(id, disposition);
            auditHelper.logUpdate("EmergencyCase", id.toString(), "Patient discharged: " + disposition, request);
            return ResponseEntity.ok(discharged);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCase(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("EmergencyCase", id.toString(), "Deleted emergency case", request);
            emergencyService.deleteCase(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
