package com.hms.hospital_management_system.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import com.hms.hospital_management_system.entity.LabOrder;
import com.hms.hospital_management_system.entity.LabOrder.LabOrderStatus;
import com.hms.hospital_management_system.entity.LabResult;
import com.hms.hospital_management_system.entity.LabTest;
import com.hms.hospital_management_system.service.LabService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/lab")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class LabController {

    private final LabService labService;

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
    public ResponseEntity<LabTest> createLabTest(@RequestBody LabTest labTest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(labService.createLabTest(labTest));
    }

    @PutMapping("/tests/{id}")
    public ResponseEntity<LabTest> updateLabTest(@PathVariable Long id, @RequestBody LabTest labTest) {
        return ResponseEntity.ok(labService.updateLabTest(id, labTest));
    }

    @DeleteMapping("/tests/{id}")
    public ResponseEntity<Void> deleteLabTest(@PathVariable Long id) {
        labService.deleteLabTest(id);
        return ResponseEntity.noContent().build();
    }

    // ========== Lab Order Endpoints ==========

    @GetMapping("/orders")
    public ResponseEntity<List<LabOrder>> getAllLabOrders() {
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
    public ResponseEntity<LabOrder> createLabOrder(@RequestBody Map<String, Object> request) {
        Long patientId = Long.valueOf(request.get("patientId").toString());
        Long doctorId = Long.valueOf(request.get("doctorId").toString());
        @SuppressWarnings("unchecked")
        List<Long> testIds = ((List<?>) request.get("testIds")).stream()
                .map(id -> Long.valueOf(id.toString()))
                .toList();
        String notes = request.get("notes") != null ? request.get("notes").toString() : null;
        String priority = request.get("priority") != null ? request.get("priority").toString() : "NORMAL";
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(labService.createLabOrder(patientId, doctorId, testIds, notes, priority));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<LabOrder> updateLabOrderStatus(@PathVariable Long id, 
                                                         @RequestParam LabOrderStatus status) {
        return ResponseEntity.ok(labService.updateLabOrderStatus(id, status));
    }

    @DeleteMapping("/orders/{id}")
    public ResponseEntity<Void> deleteLabOrder(@PathVariable Long id) {
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
    public ResponseEntity<LabResult> updateLabResult(@PathVariable Long id, @RequestBody LabResult result) {
        return ResponseEntity.ok(labService.updateLabResult(id, result));
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
