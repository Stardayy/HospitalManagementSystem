package com.hms.hospital_management_system.controller;

import java.time.LocalDate;
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

import com.hms.hospital_management_system.entity.Shift;
import com.hms.hospital_management_system.entity.Shift.ShiftStatus;
import com.hms.hospital_management_system.entity.Shift.ShiftType;
import com.hms.hospital_management_system.entity.Staff;
import com.hms.hospital_management_system.entity.Staff.StaffRole;
import com.hms.hospital_management_system.service.StaffService;
import com.hms.hospital_management_system.util.AuditHelper;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/staff")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class StaffController {

    private final StaffService staffService;
    private final AuditHelper auditHelper;

    // ========== Staff Endpoints ==========

    @GetMapping
    public ResponseEntity<List<Staff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Staff> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<Staff>> getStaffByRole(@PathVariable StaffRole role) {
        return ResponseEntity.ok(staffService.getStaffByRole(role));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Staff>> getStaffByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(staffService.getStaffByDepartment(departmentId));
    }

    @GetMapping("/active")
    public ResponseEntity<List<Staff>> getActiveStaff() {
        return ResponseEntity.ok(staffService.getActiveStaff());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Staff>> searchStaff(@RequestParam String name) {
        return ResponseEntity.ok(staffService.searchStaff(name));
    }

    @PostMapping
    public ResponseEntity<Staff> createStaff(@RequestBody Staff staff, HttpServletRequest request) {
        try {
            Staff created = staffService.createStaff(staff);
            auditHelper.logCreate("Staff", created.getId().toString(),
                    "Created staff: " + staff.getFirstName() + " " + staff.getLastName() + " (" + staff.getRole() + ")",
                    request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Staff> updateStaff(@PathVariable Long id, @RequestBody Staff staff,
            HttpServletRequest request) {
        try {
            Staff updated = staffService.updateStaff(id, staff);
            auditHelper.logUpdate("Staff", id.toString(),
                    "Updated staff: " + staff.getFirstName() + " " + staff.getLastName(), request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("Staff", id.toString(), "Deleted staff member", request);
            staffService.deleteStaff(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ========== Shift Endpoints ==========

    @GetMapping("/shifts")
    public ResponseEntity<List<Shift>> getAllShifts() {
        return ResponseEntity.ok(staffService.getAllShifts());
    }

    @GetMapping("/shifts/{id}")
    public ResponseEntity<Shift> getShiftById(@PathVariable Long id) {
        return staffService.getShiftById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{staffId}/shifts")
    public ResponseEntity<List<Shift>> getShiftsByStaff(@PathVariable Long staffId) {
        return ResponseEntity.ok(staffService.getShiftsByStaff(staffId));
    }

    @GetMapping("/shifts/date/{date}")
    public ResponseEntity<List<Shift>> getShiftsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(staffService.getShiftsByDate(date));
    }

    @GetMapping("/shifts/today")
    public ResponseEntity<List<Shift>> getTodaysShifts() {
        return ResponseEntity.ok(staffService.getTodaysShifts());
    }

    @GetMapping("/shifts/range")
    public ResponseEntity<List<Shift>> getShiftsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(staffService.getShiftsByDateRange(startDate, endDate));
    }

    @PostMapping("/shifts")
    public ResponseEntity<Shift> createShift(@RequestBody Shift shift, HttpServletRequest request) {
        Shift created = staffService.createShift(shift);
        auditHelper.logCreate("Shift", created.getId().toString(),
                "Created shift for staff ID: " + shift.getStaff().getId() + " on " + shift.getShiftDate(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/shifts/{id}")
    public ResponseEntity<Shift> updateShift(@PathVariable Long id, @RequestBody Shift shift,
            HttpServletRequest request) {
        try {
            Shift updated = staffService.updateShift(id, shift);
            auditHelper.logUpdate("Shift", id.toString(), "Updated shift details", request);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/shifts/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id, HttpServletRequest request) {
        try {
            auditHelper.logDelete("Shift", id.toString(), "Deleted shift", request);
            staffService.deleteShift(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/shifts/{id}/check-in")
    public ResponseEntity<Shift> checkIn(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(staffService.checkIn(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/shifts/{id}/check-out")
    public ResponseEntity<Shift> checkOut(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(staffService.checkOut(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/shifts/{id}/status")
    public ResponseEntity<Shift> updateShiftStatus(@PathVariable Long id, @RequestParam ShiftStatus status) {
        try {
            return ResponseEntity.ok(staffService.updateStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{staffId}/shifts/generate-weekly")
    public ResponseEntity<Void> generateWeeklyShifts(
            @PathVariable Long staffId,
            @RequestParam ShiftType shiftType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        try {
            staffService.generateWeeklyShifts(staffId, shiftType, startDate);
            return ResponseEntity.status(HttpStatus.CREATED).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
