package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.Bill;
import com.hms.hospital_management_system.entity.Bill.PaymentStatus;
import com.hms.hospital_management_system.entity.Bill.PaymentMethod;
import com.hms.hospital_management_system.service.BillService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class BillController {

    private final BillService billService;

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Bill>> filterBills(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {
        return ResponseEntity.ok(billService.filterBills(status, paymentMethod, sortBy, sortOrder));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        return billService.getBillById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Bill>> getBillsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(billService.getBillsByPatient(patientId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Bill>> getBillsByStatus(@PathVariable PaymentStatus status) {
        return ResponseEntity.ok(billService.getBillsByStatus(status));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Bill>> getPendingBills() {
        return ResponseEntity.ok(billService.getPendingBills());
    }

    @GetMapping("/patient/{patientId}/status/{status}")
    public ResponseEntity<List<Bill>> getBillsByPatientAndStatus(
            @PathVariable Long patientId, 
            @PathVariable PaymentStatus status) {
        return ResponseEntity.ok(billService.getBillsByPatientAndStatus(patientId, status));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Bill>> getBillsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(billService.getBillsByDateRange(startDate, endDate));
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Double>> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Map<String, Double> revenue = new HashMap<>();
        revenue.put("totalRevenue", billService.getTotalRevenue(startDate, endDate));
        revenue.put("pendingAmount", billService.getTotalPendingAmount());
        return ResponseEntity.ok(revenue);
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill, @RequestParam Long patientId) {
        try {
            Bill createdBill = billService.createBill(bill, patientId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBill);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id, @RequestBody Bill bill) {
        try {
            Bill updatedBill = billService.updateBill(id, bill);
            return ResponseEntity.ok(updatedBill);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<Bill> processPayment(@PathVariable Long id, @RequestParam PaymentMethod paymentMethod) {
        try {
            Bill updatedBill = billService.processPayment(id, paymentMethod);
            return ResponseEntity.ok(updatedBill);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Bill> updatePaymentStatus(@PathVariable Long id, @RequestParam PaymentStatus status) {
        try {
            Bill updatedBill = billService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updatedBill);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        try {
            billService.deleteBill(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
