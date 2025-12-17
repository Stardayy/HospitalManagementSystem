package com.hms.hospital_management_system.controller;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hms.hospital_management_system.entity.Admission;
import com.hms.hospital_management_system.entity.Admission.AdmissionStatus;
import com.hms.hospital_management_system.entity.Admission.AdmissionType;
import com.hms.hospital_management_system.service.AdmissionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admissions")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class AdmissionController {

    private final AdmissionService admissionService;

    @GetMapping
    public ResponseEntity<List<Admission>> getAllAdmissions() {
        return ResponseEntity.ok(admissionService.getAllAdmissions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admission> getAdmissionById(@PathVariable Long id) {
        return admissionService.getAdmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/current")
    public ResponseEntity<List<Admission>> getCurrentAdmissions() {
        return ResponseEntity.ok(admissionService.getCurrentAdmissions());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Admission>> getAdmissionsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(admissionService.getAdmissionsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Admission>> getAdmissionsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(admissionService.getAdmissionsByDoctor(doctorId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Admission>> getAdmissionsByStatus(@PathVariable AdmissionStatus status) {
        return ResponseEntity.ok(admissionService.getAdmissionsByStatus(status));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Admission>> getAdmissionsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(admissionService.getAdmissionsByDateRange(startDate, endDate));
    }

    @GetMapping("/patient/{patientId}/active")
    public ResponseEntity<Admission> getActiveAdmissionByPatient(@PathVariable Long patientId) {
        Admission admission = admissionService.getActiveAdmissionByPatient(patientId);
        if (admission != null) {
            return ResponseEntity.ok(admission);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Admission> createAdmission(@RequestBody Map<String, Object> request) {
        Long patientId = Long.valueOf(request.get("patientId").toString());
        Long doctorId = Long.valueOf(request.get("doctorId").toString());
        Long roomId = request.get("roomId") != null ? Long.valueOf(request.get("roomId").toString()) : null;
        String bedNumber = request.get("bedNumber") != null ? request.get("bedNumber").toString() : null;
        AdmissionType admissionType = request.get("admissionType") != null ? 
                AdmissionType.valueOf(request.get("admissionType").toString()) : AdmissionType.SCHEDULED;
        String reasonForAdmission = request.get("reasonForAdmission") != null ? 
                request.get("reasonForAdmission").toString() : null;
        String notes = request.get("notes") != null ? request.get("notes").toString() : null;
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(admissionService.createAdmission(patientId, doctorId, roomId, bedNumber, 
                        admissionType, reasonForAdmission, notes));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admission> updateAdmission(@PathVariable Long id, @RequestBody Admission admission) {
        return ResponseEntity.ok(admissionService.updateAdmission(id, admission));
    }

    @PutMapping("/{id}/room")
    public ResponseEntity<Admission> assignRoom(@PathVariable Long id,
                                                @RequestParam Long roomId,
                                                @RequestParam(required = false) String bedNumber) {
        return ResponseEntity.ok(admissionService.assignRoom(id, roomId, bedNumber));
    }

    @PutMapping("/{id}/discharge")
    public ResponseEntity<Admission> dischargePatient(@PathVariable Long id,
                                                      @RequestBody Map<String, String> request) {
        String dischargeSummary = request.get("dischargeSummary");
        String dischargeInstructions = request.get("dischargeInstructions");
        return ResponseEntity.ok(admissionService.dischargePatient(id, dischargeSummary, dischargeInstructions));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getAdmissionStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("currentAdmissions", admissionService.countCurrentAdmissions());
        stats.put("todayAdmissions", admissionService.countTodayAdmissions());
        return ResponseEntity.ok(stats);
    }
}
