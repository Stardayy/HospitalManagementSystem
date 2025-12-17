package com.hms.hospital_management_system.controller;

import java.util.List;

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

import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.PatientService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class PatientController {

    private final PatientService patientService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        User currentUser = getCurrentUser();
        // If user is a doctor, only return patients they have treated
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            return ResponseEntity.ok(patientService.getPatientsByDoctor(currentUser.getDoctorId()));
        }
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Patient>> filterPatients(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String bloodType,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortOrder) {
        User currentUser = getCurrentUser();
        // If user is a doctor, filter from their patients only
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            List<Patient> doctorPatients = patientService.getPatientsByDoctor(currentUser.getDoctorId());
            return ResponseEntity.ok(filterPatientsList(doctorPatients, gender, bloodType, sortBy, sortOrder));
        }
        return ResponseEntity.ok(patientService.filterPatients(gender, bloodType, sortBy, sortOrder));
    }

    private List<Patient> filterPatientsList(List<Patient> patients, String gender, String bloodType, String sortBy, String sortOrder) {
        java.util.Comparator<Patient> comparator = null;
        
        List<Patient> filtered = patients.stream()
            .filter(p -> gender == null || gender.isEmpty() || gender.equals(p.getGender()))
            .filter(p -> bloodType == null || bloodType.isEmpty() || bloodType.equals(p.getBloodType()))
            .toList();

        if (sortBy != null && !sortBy.isEmpty()) {
            comparator = switch (sortBy) {
                case "name" -> java.util.Comparator.comparing(Patient::getFirstName, java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()));
                case "dateOfBirth" -> java.util.Comparator.comparing(Patient::getDateOfBirth, java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()));
                case "gender" -> java.util.Comparator.comparing(Patient::getGender, java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()));
                case "bloodType" -> java.util.Comparator.comparing(Patient::getBloodType, java.util.Comparator.nullsLast(java.util.Comparator.naturalOrder()));
                default -> null;
            };
            if (comparator != null) {
                if ("desc".equalsIgnoreCase(sortOrder)) {
                    comparator = comparator.reversed();
                }
                filtered = filtered.stream().sorted(comparator).toList();
            }
        }
        
        return filtered;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Patient> getPatientByEmail(@PathVariable String email) {
        return patientService.getPatientByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Patient>> searchPatients(@RequestParam String name) {
        return ResponseEntity.ok(patientService.searchPatientsByName(name));
    }

    @GetMapping("/blood-type/{bloodType}")
    public ResponseEntity<List<Patient>> getPatientsByBloodType(@PathVariable String bloodType) {
        return ResponseEntity.ok(patientService.getPatientsByBloodType(bloodType));
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        try {
            Patient createdPatient = patientService.createPatient(patient);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPatient);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patient) {
        try {
            Patient updatedPatient = patientService.updatePatient(id, patient);
            return ResponseEntity.ok(updatedPatient);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        try {
            patientService.deletePatient(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
