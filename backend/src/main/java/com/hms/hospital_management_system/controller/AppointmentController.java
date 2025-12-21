package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.Appointment;
import com.hms.hospital_management_system.entity.Appointment.AppointmentStatus;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.AppointmentService;
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
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class AppointmentController {

    private final AppointmentService appointmentService;
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

        auditLogService.logAction(userId, username, role, action, "Appointment", entityId, details, ipAddress);
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        User currentUser = getCurrentUser();
        // If user is a doctor, only return their appointments
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(currentUser.getDoctorId()));
        }
        // If user is a patient, only return their appointments
        if (currentUser != null && currentUser.getRole() == User.Role.PATIENT && currentUser.getPatientId() != null) {
            return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(currentUser.getPatientId()));
        }
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Appointment>> filterAppointments(
            @RequestParam(required = false) AppointmentStatus status,
            @RequestParam(required = false) Long doctorId,
            @RequestParam(required = false) Long patientId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {
        User currentUser = getCurrentUser();
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            doctorId = currentUser.getDoctorId();
        }
        if (currentUser != null && currentUser.getRole() == User.Role.PATIENT && currentUser.getPatientId() != null) {
            patientId = currentUser.getPatientId();
        }
        return ResponseEntity.ok(appointmentService.filterAppointments(status, doctorId, patientId, startDate, endDate,
                sortBy, sortOrder));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable Long id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDate(date));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Appointment>> getTodaysAppointments() {
        return ResponseEntity.ok(appointmentService.getTodaysAppointments());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(@PathVariable AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByStatus(status));
    }

    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctorAndDate(
            @PathVariable Long doctorId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctorAndDate(doctorId, date));
    }

    @GetMapping("/range")
    public ResponseEntity<List<Appointment>> getAppointmentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(appointmentService.getAppointmentsByDateRange(startDate, endDate));
    }

    @GetMapping("/available-slots")
    public ResponseEntity<List<LocalTime>> getAvailableTimeSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableTimeSlots(doctorId, date));
    }

    @GetMapping("/check-availability")
    public ResponseEntity<Map<String, Boolean>> checkTimeSlotAvailability(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime time) {
        boolean available = appointmentService.isTimeSlotAvailable(doctorId, date, time);
        return ResponseEntity.ok(Map.of("available", available));
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(
            @RequestBody Appointment appointment,
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            HttpServletRequest request) {
        try {
            Appointment createdAppointment = appointmentService.createAppointment(appointment, patientId, doctorId);

            // Log the action
            logAction("CREATE", createdAppointment.getId().toString(),
                    "Created appointment for patient " + patientId + " with doctor " + doctorId, request);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable Long id,
            @RequestBody Appointment appointment,
            HttpServletRequest request) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointment(id, appointment);

            // Log the action
            logAction("UPDATE", id.toString(),
                    "Updated appointment: date=" + appointment.getAppointmentDate() + ", status="
                            + appointment.getStatus(),
                    request);

            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Appointment> updateAppointmentStatus(
            @PathVariable Long id,
            @RequestParam AppointmentStatus status,
            HttpServletRequest request) {
        try {
            Appointment updatedAppointment = appointmentService.updateAppointmentStatus(id, status);

            // Log the action
            logAction("UPDATE", id.toString(), "Changed status to " + status, request);

            return ResponseEntity.ok(updatedAppointment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable Long id, HttpServletRequest request) {
        try {
            // Log before deletion
            logAction("DELETE", id.toString(), "Deleted appointment", request);

            appointmentService.deleteAppointment(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
