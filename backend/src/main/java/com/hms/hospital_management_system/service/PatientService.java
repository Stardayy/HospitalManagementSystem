package com.hms.hospital_management_system.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService {

    private final PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(Long id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> getPatientByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    public Patient createPatient(Patient patient) {
        if (patient.getEmail() != null && patientRepository.existsByEmail(patient.getEmail())) {
            throw new RuntimeException("Patient with email " + patient.getEmail() + " already exists");
        }
        return patientRepository.save(patient);
    }

    public Patient updatePatient(Long id, Patient patientDetails) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));

        patient.setFirstName(patientDetails.getFirstName());
        patient.setLastName(patientDetails.getLastName());
        patient.setDateOfBirth(patientDetails.getDateOfBirth());
        patient.setGender(patientDetails.getGender());
        patient.setPhone(patientDetails.getPhone());
        patient.setEmail(patientDetails.getEmail());
        patient.setAddress(patientDetails.getAddress());
        patient.setBloodType(patientDetails.getBloodType());
        patient.setEmergencyContact(patientDetails.getEmergencyContact());
        patient.setEmergencyPhone(patientDetails.getEmergencyPhone());

        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {
        if (!patientRepository.existsById(id)) {
            throw new RuntimeException("Patient not found with id: " + id);
        }
        patientRepository.deleteById(id);
    }

    public List<Patient> searchPatientsByName(String name) {
        return patientRepository.searchByName(name);
    }

    public List<Patient> getPatientsByBloodType(String bloodType) {
        return patientRepository.findByBloodType(bloodType);
    }

    public List<Patient> filterPatients(String gender, String bloodType, String sortBy, String sortOrder) {
        List<Patient> patients = patientRepository.findAll();
        
        List<Patient> filtered = patients.stream()
            .filter(p -> gender == null || gender.isEmpty() || gender.equals(p.getGender()))
            .filter(p -> bloodType == null || bloodType.isEmpty() || bloodType.equals(p.getBloodType()))
            .toList();

        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<Patient> comparator = getPatientComparator(sortBy);
            if (comparator != null) {
                if ("desc".equalsIgnoreCase(sortOrder)) {
                    comparator = comparator.reversed();
                }
                filtered = filtered.stream().sorted(comparator).toList();
            }
        }
        
        return filtered;
    }

    private Comparator<Patient> getPatientComparator(String sortBy) {
        return switch (sortBy) {
            case "name" -> Comparator.comparing(Patient::getFirstName, Comparator.nullsLast(Comparator.naturalOrder()));
            case "dateOfBirth" -> Comparator.comparing(Patient::getDateOfBirth, Comparator.nullsLast(Comparator.naturalOrder()));
            case "gender" -> Comparator.comparing(Patient::getGender, Comparator.nullsLast(Comparator.naturalOrder()));
            case "bloodType" -> Comparator.comparing(Patient::getBloodType, Comparator.nullsLast(Comparator.naturalOrder()));
            case "email" -> Comparator.comparing(Patient::getEmail, Comparator.nullsLast(Comparator.naturalOrder()));
            case "createdAt" -> Comparator.comparing(Patient::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
            default -> null;
        };
    }

    public List<Patient> getPatientsByDoctor(Long doctorId) {
        return patientRepository.findByDoctorId(doctorId);
    }
}
