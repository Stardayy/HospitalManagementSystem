package com.hms.hospital_management_system.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.hms.hospital_management_system.entity.LabOrder;
import com.hms.hospital_management_system.entity.LabOrder.LabOrderStatus;
import com.hms.hospital_management_system.entity.LabResult;
import com.hms.hospital_management_system.entity.LabTest;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.LabService;
import com.hms.hospital_management_system.service.PatientService;
import com.hms.hospital_management_system.util.AuditHelper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lab")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class LabController {

    private final LabService labService;
    private final PatientService patientService;
    private final AuditHelper auditHelper;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    // ========== Lab Test Endpoints ==========

    @GetMapping("/tests")
    public ResponseEntity<List<LabTest>> getAllLabTests() {
        return ResponseEntity.ok(labService.getAllLabTests());
    }

    @GetMapping("/tests/active")
    public ResponseEntity<List<LabTest>> getActiveLabTests() {
        return ResponseEntity.ok(labService.getActiveLabTests());
    }

    @GetMapping("/tests/{id}")
    public ResponseEntity<LabTest> getLabTestById(@PathVariable Long id) {
        return labService.getLabTestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tests/category/{category}")
    public ResponseEntity<List<LabTest>> getLabTestsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(labService.getLabTestsByCategory(category));
    }

    @GetMapping("/tests/search")
    public ResponseEntity<List<LabTest>> searchLabTests(@RequestParam String name) {
        return ResponseEntity.ok(labService.searchLabTests(name));
    }

    @PostMapping("/tests")
    public ResponseEntity<LabTest> createLabTest(@RequestBody LabTest labTest, HttpServletRequest request) {
        LabTest created = labService.createLabTest(labTest);
        auditHelper.logCreate("LabTest", created.getId().toString(), "Created lab test: " + labTest.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/tests/{id}")
    public ResponseEntity<LabTest> updateLabTest(@PathVariable Long id, @RequestBody LabTest labTest,
            HttpServletRequest request) {
        LabTest updated = labService.updateLabTest(id, labTest);
        auditHelper.logUpdate("LabTest", id.toString(), "Updated lab test: " + labTest.getName(), request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/tests/{id}")
    public ResponseEntity<Void> deleteLabTest(@PathVariable Long id, HttpServletRequest request) {
        auditHelper.logDelete("LabTest", id.toString(), "Deleted lab test", request);
        labService.deleteLabTest(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Lab Order Endpoints ==========

    @GetMapping("/orders")
    public ResponseEntity<List<LabOrder>> getAllLabOrders() {
        User currentUser = getCurrentUser();
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            List<Patient> doctorPatients = patientService.getPatientsByDoctor(currentUser.getDoctorId());
            List<Long> patientIds = doctorPatients.stream().map(Patient::getId).toList();
            Long doctorId = currentUser.getDoctorId();
            List<LabOrder> allOrders = labService.getAllLabOrders();
            List<LabOrder> filteredOrders = allOrders.stream()
                    .filter(o -> (o.getPatient() != null && patientIds.contains(o.getPatient().getId()))
                            || (o.getDoctor() != null && o.getDoctor().getId().equals(doctorId)))
                    .toList();
            return ResponseEntity.ok(filteredOrders);
        }
        return ResponseEntity.ok(labService.getAllLabOrders());
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<LabOrder> getLabOrderById(@PathVariable Long id) {
        return labService.getLabOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/orders/patient/{patientId}")
    public ResponseEntity<List<LabOrder>> getLabOrdersByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(labService.getLabOrdersByPatient(patientId));
    }

    @GetMapping("/orders/doctor/{doctorId}")
    public ResponseEntity<List<LabOrder>> getLabOrdersByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(labService.getLabOrdersByDoctor(doctorId));
    }

    @GetMapping("/orders/status/{status}")
    public ResponseEntity<List<LabOrder>> getLabOrdersByStatus(@PathVariable LabOrderStatus status) {
        return ResponseEntity.ok(labService.getLabOrdersByStatus(status));
    }

    @PostMapping("/orders")
    public ResponseEntity<LabOrder> createLabOrder(@RequestBody Map<String, Object> request,
            HttpServletRequest httpRequest) {
        Long patientId = Long.valueOf(request.get("patientId").toString());
        Long doctorId = Long.valueOf(request.get("doctorId").toString());
        @SuppressWarnings("unchecked")
        List<Long> testIds = ((List<?>) request.get("testIds")).stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();
        String notes = request.get("notes") != null ? request.get("notes").toString() : null;
        String priority = request.get("priority") != null ? request.get("priority").toString() : "NORMAL";

        LabOrder created = labService.createLabOrder(patientId, doctorId, testIds, notes, priority);
        auditHelper.logCreate("LabOrder", created.getId().toString(),
                "Created lab order for patient " + patientId, httpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<LabOrder> updateLabOrderStatus(@PathVariable Long id, @RequestParam LabOrderStatus status,
            HttpServletRequest request) {
        LabOrder updated = labService.updateLabOrderStatus(id, status);
        auditHelper.logUpdate("LabOrder", id.toString(), "Status changed to " + status, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteLabOrder(@PathVariable Long id, HttpServletRequest request) {
        auditHelper.logDelete("LabOrder", id.toString(), "Deleted lab order", request);
        labService.deleteLabOrder(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Lab Result Endpoints ==========

    @GetMapping("/results/order/{orderId}")
    public ResponseEntity<List<LabResult>> getResultsByLabOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(labService.getResultsByLabOrder(orderId));
    }

    @GetMapping("/results/{id}")
    public ResponseEntity<LabResult> getLabResultById(@PathVariable Long id) {
        return labService.getLabResultById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/results/{id}")
    public ResponseEntity<LabResult> updateLabResult(@PathVariable Long id, @RequestBody LabResult result,
            HttpServletRequest request) {
        LabResult updated = labService.updateLabResult(id, result);
        auditHelper.logUpdate("LabResult", id.toString(), "Updated lab result", request);
        return ResponseEntity.ok(updated);
    }

    // ========== Statistics ==========

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getLabStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("pendingOrders", labService.countPendingOrders());
        stats.put("inProgressOrders", labService.countInProgressOrders());
        return ResponseEntity.ok(stats);
    }
}
