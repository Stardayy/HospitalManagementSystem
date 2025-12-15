package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class DoctorController {

    private final DoctorService doctorService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        User currentUser = getCurrentUser();
        // Patients can only see doctors they have appointments with
        if (currentUser != null && currentUser.getRole() == User.Role.PATIENT && currentUser.getPatientId() != null) {
            return ResponseEntity.ok(doctorService.getDoctorsByPatient(currentUser.getPatientId()));
        }
        // Doctors and admins can see all doctors
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/me")
    public ResponseEntity<Doctor> getCurrentDoctor() {
        User currentUser = getCurrentUser();
        if (currentUser != null && currentUser.getDoctorId() != null) {
            return doctorService.getDoctorById(currentUser.getDoctorId())
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Doctor>> filterDoctors(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String specialization,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {
        return ResponseEntity.ok(doctorService.filterDoctors(departmentId, specialization, sortBy, sortOrder));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Doctor> getDoctorByEmail(@PathVariable String email) {
        return doctorService.getDoctorByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Doctor>> getDoctorsByDepartment(@PathVariable Long departmentId) {
        return ResponseEntity.ok(doctorService.getDoctorsByDepartment(departmentId));
    }

    @GetMapping("/specialization/{specialization}")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String specialization) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(specialization));
    }

    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchDoctors(@RequestParam String name) {
        return ResponseEntity.ok(doctorService.searchDoctorsByName(name));
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor, 
                                               @RequestParam(required = false) Long departmentId) {
        try {
            Doctor createdDoctor = doctorService.createDoctorWithDepartment(doctor, departmentId);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdDoctor);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        try {
            Doctor updatedDoctor = doctorService.updateDoctor(id, doctor);
            return ResponseEntity.ok(updatedDoctor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/department/{departmentId}")
    public ResponseEntity<Doctor> assignDepartment(@PathVariable Long id, @PathVariable Long departmentId) {
        try {
            Doctor updatedDoctor = doctorService.assignDepartment(id, departmentId);
            return ResponseEntity.ok(updatedDoctor);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        try {
            doctorService.deleteDoctor(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
