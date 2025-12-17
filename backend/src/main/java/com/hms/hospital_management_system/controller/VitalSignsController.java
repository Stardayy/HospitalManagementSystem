package com.hms.hospital_management_system.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
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

import com.hms.hospital_management_system.entity.VitalSigns;
import com.hms.hospital_management_system.service.VitalSignsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vitals")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class VitalSignsController {

    private final VitalSignsService vitalSignsService;

    @GetMapping
    public ResponseEntity<List<VitalSigns>> getAllVitalSigns() {
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
            @RequestParam(required = false) Long recordedById) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(vitalSignsService.createVitalSigns(vitalSigns, patientId, recordedById));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VitalSigns> updateVitalSigns(@PathVariable Long id, @RequestBody VitalSigns vitalSigns) {
        return ResponseEntity.ok(vitalSignsService.updateVitalSigns(id, vitalSigns));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVitalSigns(@PathVariable Long id) {
        vitalSignsService.deleteVitalSigns(id);
        return ResponseEntity.noContent().build();
    }
}
