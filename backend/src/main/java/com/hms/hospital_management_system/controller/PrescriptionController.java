package com.hms.hospital_management_system.controller;

import java.util.List;

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

import com.hms.hospital_management_system.entity.Prescription;
import com.hms.hospital_management_system.entity.Prescription.PrescriptionStatus;
import com.hms.hospital_management_system.entity.PrescriptionItem;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.PrescriptionService;
import com.hms.hospital_management_system.util.AuditHelper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final AuditHelper auditHelper;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Prescription>> getAllPrescriptions() {
        User currentUser = getCurrentUser();
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            return ResponseEntity.ok(prescriptionService.getPrescriptionsByDoctor(currentUser.getDoctorId()));
        }
        if (currentUser != null && currentUser.getRole() == User.Role.PATIENT && currentUser.getPatientId() != null) {
            return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatient(currentUser.getPatientId()));
        }
        return ResponseEntity.ok(prescriptionService.getAllPrescriptions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return prescriptionService.getPrescriptionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<Prescription> getPrescriptionWithItems(@PathVariable Long id) {
        Prescription prescription = prescriptionService.getPrescriptionWithItems(id);
        if (prescription == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(prescription);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}/active")
    public ResponseEntity<List<Prescription>> getActivePrescriptionsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(prescriptionService.getActivePrescriptionsByPatient(patientId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByStatus(@PathVariable PrescriptionStatus status) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByStatus(status));
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByAppointment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(prescriptionService.getPrescriptionsByAppointment(appointmentId));
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody Prescription prescription,
            HttpServletRequest request) {
        try {
            Prescription created = prescriptionService.createPrescription(prescription);
            auditHelper.logCreate("Prescription", created.getId().toString(),
                    "Created prescription for patient", request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable Long id,
            @RequestBody Prescription prescription, HttpServletRequest request) {
        try {
            Prescription updated = prescriptionService.updatePrescription(id, prescription);
            auditHelper.logUpdate("Prescription", id.toString(), "Updated prescription", request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Prescription> updatePrescriptionStatus(
            @PathVariable Long id,
            @RequestParam PrescriptionStatus status,
            HttpServletRequest request) {
        try {
            Prescription updated = prescriptionService.updateStatus(id, status);
            auditHelper.logUpdate("Prescription", id.toString(), "Status changed to " + status, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("Prescription", id.toString(), "Deleted prescription", request);
            prescriptionService.deletePrescription(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{prescriptionId}/items")
    public ResponseEntity<PrescriptionItem> addItem(
            @PathVariable Long prescriptionId,
            @RequestBody PrescriptionItem item,
            HttpServletRequest request) {
        try {
            PrescriptionItem created = prescriptionService.addItem(prescriptionId, item);
            auditHelper.logCreate("PrescriptionItem", created.getId().toString(),
                    "Added item to prescription " + prescriptionId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<Void> removeItem(@PathVariable Long itemId, HttpServletRequest request) {
        auditHelper.logDelete("PrescriptionItem", itemId.toString(), "Removed prescription item", request);
        prescriptionService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/items/{itemId}/dispense")
    public ResponseEntity<PrescriptionItem> markItemDispensed(
            @PathVariable Long itemId,
            @RequestParam boolean dispensed,
            HttpServletRequest request) {
        try {
            PrescriptionItem updated = prescriptionService.updateItemDispensed(itemId, dispensed);
            auditHelper.logUpdate("PrescriptionItem", itemId.toString(),
                    "Dispensed: " + dispensed, request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
