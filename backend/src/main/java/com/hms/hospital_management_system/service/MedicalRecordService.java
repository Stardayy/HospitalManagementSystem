package com.hms.hospital_management_system.service;

import com.hms.hospital_management_system.entity.MedicalRecord;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.repository.MedicalRecordRepository;
import com.hms.hospital_management_system.repository.PatientRepository;
import com.hms.hospital_management_system.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    public Optional<MedicalRecord> getMedicalRecordById(Long id) {
        return medicalRecordRepository.findById(id);
    }

    public MedicalRecord createMedicalRecord(MedicalRecord medicalRecord, Long patientId, Long doctorId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        medicalRecord.setPatient(patient);
        medicalRecord.setDoctor(doctor);
        
        return medicalRecordRepository.save(medicalRecord);
    }

    public MedicalRecord updateMedicalRecord(Long id, MedicalRecord recordDetails) {
        MedicalRecord record = medicalRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found with id: " + id));

        record.setRecordDate(recordDetails.getRecordDate());
        record.setDiagnosis(recordDetails.getDiagnosis());
        record.setSymptoms(recordDetails.getSymptoms());
        record.setTreatment(recordDetails.getTreatment());
        record.setPrescription(recordDetails.getPrescription());
        record.setFollowUpDate(recordDetails.getFollowUpDate());
        record.setNotes(recordDetails.getNotes());

        return medicalRecordRepository.save(record);
    }

    public void deleteMedicalRecord(Long id) {
        if (!medicalRecordRepository.existsById(id)) {
            throw new RuntimeException("Medical record not found with id: " + id);
        }
        medicalRecordRepository.deleteById(id);
    }

    public List<MedicalRecord> getMedicalRecordsByPatient(Long patientId) {
        return medicalRecordRepository.findByPatientIdOrderByRecordDateDesc(patientId);
    }

    public List<MedicalRecord> getMedicalRecordsByDoctor(Long doctorId) {
        return medicalRecordRepository.findByDoctorId(doctorId);
    }

    public List<MedicalRecord> getMedicalRecordsByPatientAndDateRange(Long patientId, LocalDate startDate, LocalDate endDate) {
        return medicalRecordRepository.findByPatientIdAndDateRange(patientId, startDate, endDate);
    }

    public List<MedicalRecord> searchByDiagnosis(String diagnosis) {
        return medicalRecordRepository.searchByDiagnosis(diagnosis);
    }
}
