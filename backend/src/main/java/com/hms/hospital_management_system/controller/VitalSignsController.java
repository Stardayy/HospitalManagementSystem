package com.hms.hospital_management_system.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.entity.VitalSigns;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.VitalSignsService;
import com.hms.hospital_management_system.service.PatientService;
import com.hms.hospital_management_system.util.AuditHelper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vitals")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class VitalSignsController {

    private final VitalSignsService vitalSignsService;
    private final PatientService patientService;
    private final AuditHelper auditHelper;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<VitalSigns>> getAllVitalSigns() {
        User currentUser = getCurrentUser();
        // If user is a doctor, only return vitals for their patients
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            List<Patient> doctorPatients = patientService.getPatientsByDoctor(currentUser.getDoctorId());
            List<Long> patientIds = doctorPatients.stream().map(Patient::getId).toList();
            List<VitalSigns> allVitals = vitalSignsService.getAllVitalSigns();
            List<VitalSigns> filteredVitals = allVitals.stream()
                    .filter(v -> v.getPatient() != null && patientIds.contains(v.getPatient().getId()))
                    .toList();
            return ResponseEntity.ok(filteredVitals);
        }
        return ResponseEntity.ok(vitalSignsService.getAllVitalSigns());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VitalSigns> getVitalSignsById(@PathVariable Long id) {
        return vitalSignsService.getVitalSignsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VitalSigns>> getVitalSignsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(vitalSignsService.getVitalSignsByPatient(patientId));
    }

    @GetMapping("/patient/{patientId}/latest")
    public ResponseEntity<VitalSigns> getLatestVitalSignsByPatient(@PathVariable Long patientId) {
        VitalSigns latest = vitalSignsService.getLatestVitalSignsByPatient(patientId);
        if (latest != null) {
            return ResponseEntity.ok(latest);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/range")
    public ResponseEntity<List<VitalSigns>> getVitalSignsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(vitalSignsService.getVitalSignsByDateRange(startDate, endDate));
    }

    @GetMapping("/patient/{patientId}/range")
    public ResponseEntity<List<VitalSigns>> getVitalSignsByPatientAndDateRange(
            @PathVariable Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return ResponseEntity.ok(vitalSignsService.getVitalSignsByPatientAndDateRange(patientId, startDate, endDate));
    }

    @PostMapping
    public ResponseEntity<VitalSigns> createVitalSigns(
            @RequestBody VitalSigns vitalSigns,
            @RequestParam Long patientId,
            @RequestParam(required = false) Long recordedById,
            HttpServletRequest request) {
        VitalSigns created = vitalSignsService.createVitalSigns(vitalSigns, patientId, recordedById);
        auditHelper.logCreate("VitalSigns", created.getId().toString(),
                "Recorded vital signs for patient: " + patientId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VitalSigns> updateVitalSigns(@PathVariable Long id, @RequestBody VitalSigns vitalSigns,
            HttpServletRequest request) {
        VitalSigns updated = vitalSignsService.updateVitalSigns(id, vitalSigns);
        auditHelper.logUpdate("VitalSigns", id.toString(), "Updated vital signs", request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVitalSigns(@PathVariable Long id, HttpServletRequest request) {
        auditHelper.logDelete("VitalSigns", id.toString(), "Deleted vital signs record", request);
        vitalSignsService.deleteVitalSigns(id);
        return ResponseEntity.noContent().build();
    }
}
