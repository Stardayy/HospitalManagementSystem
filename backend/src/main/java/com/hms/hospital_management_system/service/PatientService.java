package com.hms.hospital_management_system.service;

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
}
