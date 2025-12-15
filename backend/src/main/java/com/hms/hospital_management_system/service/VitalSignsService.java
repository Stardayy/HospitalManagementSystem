package com.hms.hospital_management_system.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.VitalSigns;
import com.hms.hospital_management_system.repository.DoctorRepository;
import com.hms.hospital_management_system.repository.PatientRepository;
import com.hms.hospital_management_system.repository.VitalSignsRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class VitalSignsService {

    private final VitalSignsRepository vitalSignsRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public List<VitalSigns> getAllVitalSigns() {
        return vitalSignsRepository.findAll();
    }

    public Optional<VitalSigns> getVitalSignsById(Long id) {
        return vitalSignsRepository.findById(id);
    }

    public List<VitalSigns> getVitalSignsByPatient(Long patientId) {
        return vitalSignsRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
    }

    public VitalSigns getLatestVitalSignsByPatient(Long patientId) {
        return vitalSignsRepository.findLatestByPatientId(patientId);
    }

    public List<VitalSigns> getVitalSignsByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return vitalSignsRepository.findByDateRange(startDate, endDate);
    }

    public List<VitalSigns> getVitalSignsByPatientAndDateRange(Long patientId, LocalDateTime startDate, LocalDateTime endDate) {
        return vitalSignsRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);
    }

    public VitalSigns createVitalSigns(VitalSigns vitalSigns, Long patientId, Long recordedById) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        vitalSigns.setPatient(patient);
        
        if (recordedById != null) {
            Doctor doctor = doctorRepository.findById(recordedById).orElse(null);
            vitalSigns.setRecordedBy(doctor);
        }
        
        if (vitalSigns.getRecordedAt() == null) {
            vitalSigns.setRecordedAt(LocalDateTime.now());
        }
        
        return vitalSignsRepository.save(vitalSigns);
    }

    public VitalSigns updateVitalSigns(Long id, VitalSigns vitalSignsDetails) {
        VitalSigns vitalSigns = vitalSignsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vital signs not found with id: " + id));
        
        vitalSigns.setTemperature(vitalSignsDetails.getTemperature());
        vitalSigns.setBloodPressureSystolic(vitalSignsDetails.getBloodPressureSystolic());
        vitalSigns.setBloodPressureDiastolic(vitalSignsDetails.getBloodPressureDiastolic());
        vitalSigns.setHeartRate(vitalSignsDetails.getHeartRate());
        vitalSigns.setRespiratoryRate(vitalSignsDetails.getRespiratoryRate());
        vitalSigns.setOxygenSaturation(vitalSignsDetails.getOxygenSaturation());
        vitalSigns.setWeight(vitalSignsDetails.getWeight());
        vitalSigns.setHeight(vitalSignsDetails.getHeight());
        vitalSigns.setBloodGlucose(vitalSignsDetails.getBloodGlucose());
        vitalSigns.setPainLevel(vitalSignsDetails.getPainLevel());
        vitalSigns.setNotes(vitalSignsDetails.getNotes());
        
        return vitalSignsRepository.save(vitalSigns);
    }

    public void deleteVitalSigns(Long id) {
        vitalSignsRepository.deleteById(id);
    }
}
