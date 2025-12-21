package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.Bill;
import com.hms.hospital_management_system.entity.Bill.PaymentStatus;
import com.hms.hospital_management_system.entity.Bill.PaymentMethod;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.BillService;
import com.hms.hospital_management_system.util.AuditHelper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class BillController {

    private final BillService billService;
    private final AuditHelper auditHelper;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Bill>> getAllBills() {
        User currentUser = getCurrentUser();
        // If user is a patient, only return their bills
        if (currentUser != null && currentUser.getRole() == User.Role.PATIENT && currentUser.getPatientId() != null) {
            return ResponseEntity.ok(billService.getBillsByPatient(currentUser.getPatientId()));
        }
        return ResponseEntity.ok(billService.getAllBills());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Bill>> filterBills(
            @RequestParam(required = false) PaymentStatus status,
            @RequestParam(required = false) PaymentMethod paymentMethod,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {
        User currentUser = getCurrentUser();
        // If user is a patient, filter from their bills only
        if (currentUser != null && currentUser.getRole() == User.Role.PATIENT && currentUser.getPatientId() != null) {
            return ResponseEntity.ok(billService.filterBillsForPatient(currentUser.getPatientId(), status,
                    paymentMethod, sortBy, sortOrder));
        }
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
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill, @RequestParam Long patientId,
            HttpServletRequest request) {
        try {
            Bill createdBill = billService.createBill(bill, patientId);
            auditHelper.logCreate("Bill", createdBill.getId().toString(),
                    "Created bill for patient ID: " + patientId + ", amount: " + createdBill.getTotalAmount(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBill);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id, @RequestBody Bill bill,
            HttpServletRequest request) {
        try {
            Bill updatedBill = billService.updateBill(id, bill);
            auditHelper.logUpdate("Bill", id.toString(), "Updated bill details", request);
            return ResponseEntity.ok(updatedBill);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<Bill> processPayment(@PathVariable Long id, @RequestParam PaymentMethod paymentMethod,
            HttpServletRequest request) {
        try {
            Bill updatedBill = billService.processPayment(id, paymentMethod);
            auditHelper.logUpdate("Bill", id.toString(), "Payment processed via " + paymentMethod, request);
            return ResponseEntity.ok(updatedBill);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Bill> updatePaymentStatus(@PathVariable Long id, @RequestParam PaymentStatus status,
            HttpServletRequest request) {
        try {
            Bill updatedBill = billService.updatePaymentStatus(id, status);
            auditHelper.logUpdate("Bill", id.toString(), "Payment status updated to " + status, request);
            return ResponseEntity.ok(updatedBill);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("Bill", id.toString(), "Deleted bill", request);
            billService.deleteBill(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
