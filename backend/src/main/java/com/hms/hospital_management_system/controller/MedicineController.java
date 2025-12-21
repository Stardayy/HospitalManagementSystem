package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.Medicine;
import com.hms.hospital_management_system.service.MedicineService;
import com.hms.hospital_management_system.util.AuditHelper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class MedicineController {

    private final MedicineService medicineService;
    private final AuditHelper auditHelper;

    @GetMapping
    public ResponseEntity<List<Medicine>> getAllMedicines() {
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Medicine>> filterMedicines(
            @RequestParam(required = false) String dosageForm,
            @RequestParam(required = false) Boolean lowStock,
            @RequestParam(required = false) Boolean expired,
            @RequestParam(required = false) Boolean expiringSoon,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {
        return ResponseEntity
                .ok(medicineService.filterMedicines(dosageForm, lowStock, expired, expiringSoon, sortBy, sortOrder));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medicine> getMedicineById(@PathVariable Long id) {
        return medicineService.getMedicineById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Medicine> getMedicineByName(@PathVariable String name) {
        return medicineService.getMedicineByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Medicine>> searchMedicines(@RequestParam String name) {
        return ResponseEntity.ok(medicineService.searchMedicinesByName(name));
    }

    @GetMapping("/manufacturer/{manufacturer}")
    public ResponseEntity<List<Medicine>> getMedicinesByManufacturer(@PathVariable String manufacturer) {
        return ResponseEntity.ok(medicineService.getMedicinesByManufacturer(manufacturer));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<Medicine>> getLowStockMedicines() {
        return ResponseEntity.ok(medicineService.getLowStockMedicines());
    }

    @GetMapping("/expired")
    public ResponseEntity<List<Medicine>> getExpiredMedicines() {
        return ResponseEntity.ok(medicineService.getExpiredMedicines());
    }

    @GetMapping("/expiring-soon")
    public ResponseEntity<List<Medicine>> getMedicinesExpiringSoon(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(medicineService.getMedicinesExpiringSoon(days));
    }

    @PostMapping
    public ResponseEntity<Medicine> createMedicine(@RequestBody Medicine medicine, HttpServletRequest request) {
        try {
            Medicine createdMedicine = medicineService.createMedicine(medicine);
            auditHelper.logCreate("Medicine", createdMedicine.getId().toString(),
                    "Created medicine: " + medicine.getName(), request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMedicine);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicine,
            HttpServletRequest request) {
        try {
            Medicine updatedMedicine = medicineService.updateMedicine(id, medicine);
            auditHelper.logUpdate("Medicine", id.toString(), "Updated medicine: " + medicine.getName(), request);
            return ResponseEntity.ok(updatedMedicine);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<Medicine> updateStock(@PathVariable Long id, @RequestParam Integer quantity,
            HttpServletRequest request) {
        try {
            Medicine updatedMedicine = medicineService.updateStock(id, quantity);
            auditHelper.logUpdate("Medicine", id.toString(), "Stock updated to: " + quantity, request);
            return ResponseEntity.ok(updatedMedicine);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("Medicine", id.toString(), "Deleted medicine", request);
            medicineService.deleteMedicine(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
