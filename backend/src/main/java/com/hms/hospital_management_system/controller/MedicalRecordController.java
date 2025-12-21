package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.MedicalRecord;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.MedicalRecordService;
import com.hms.hospital_management_system.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;
    private final AuditLogService auditLogService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    private void logAction(String action, String entityId, String details, HttpServletRequest request) {
        User user = getCurrentUser();
        String username = user != null ? user.getEmail() : "SYSTEM";
        Long userId = user != null ? user.getId() : null;
        String role = user != null ? user.getRole().name() : "UNKNOWN";
        String ipAddress = request != null ? request.getRemoteAddr() : "UNKNOWN";

        auditLogService.logAction(userId, username, role, action, "MedicalRecord", entityId, details, ipAddress);
    }

    @GetMapping
    public ResponseEntity<List<MedicalRecord>> getAllMedicalRecords() {
        User currentUser = getCurrentUser();
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByDoctor(currentUser.getDoctorId()));
        }
        if (currentUser != null && currentUser.getRole() == User.Role.PATIENT && currentUser.getPatientId() != null) {
            return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatient(currentUser.getPatientId()));
        }
        return ResponseEntity.ok(medicalRecordService.getAllMedicalRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalRecord> getMedicalRecordById(@PathVariable Long id) {
        return medicalRecordService.getMedicalRecordById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(medicalRecordService.getMedicalRecordsByDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}/range")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecordsByPatientAndDateRange(
            @PathVariable Long patientId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity
                .ok(medicalRecordService.getMedicalRecordsByPatientAndDateRange(patientId, startDate, endDate));
    }

    @GetMapping("/search")
    public ResponseEntity<List<MedicalRecord>> searchByDiagnosis(@RequestParam String diagnosis) {
        return ResponseEntity.ok(medicalRecordService.searchByDiagnosis(diagnosis));
    }

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(
            @RequestBody MedicalRecord medicalRecord,
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            HttpServletRequest request) {
        try {
            MedicalRecord createdRecord = medicalRecordService.createMedicalRecord(medicalRecord, patientId, doctorId);

            // Log the action
            logAction("CREATE", createdRecord.getId().toString(),
                    "Created medical record for patient " + patientId + ": " + medicalRecord.getDiagnosis(), request);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicalRecord> updateMedicalRecord(
            @PathVariable Long id,
            @RequestBody MedicalRecord medicalRecord,
            HttpServletRequest request) {
        try {
            MedicalRecord updatedRecord = medicalRecordService.updateMedicalRecord(id, medicalRecord);

            // Log the action
            logAction("UPDATE", id.toString(),
                    "Updated medical record: diagnosis=" + medicalRecord.getDiagnosis(), request);

            return ResponseEntity.ok(updatedRecord);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicalRecord(@PathVariable Long id, HttpServletRequest request) {
        try {
            // Log before deletion
            logAction("DELETE", id.toString(), "Deleted medical record", request);

            medicalRecordService.deleteMedicalRecord(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
