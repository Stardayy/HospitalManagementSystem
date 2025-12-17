package com.hms.hospital_management_system.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.Admission;
import com.hms.hospital_management_system.entity.Admission.AdmissionStatus;
import com.hms.hospital_management_system.entity.Admission.AdmissionType;
import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.Room;
import com.hms.hospital_management_system.entity.Room.RoomStatus;
import com.hms.hospital_management_system.repository.AdmissionRepository;
import com.hms.hospital_management_system.repository.DoctorRepository;
import com.hms.hospital_management_system.repository.PatientRepository;
import com.hms.hospital_management_system.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final RoomRepository roomRepository;

    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    public Optional<Admission> getAdmissionById(Long id) {
        return admissionRepository.findById(id);
    }

    public List<Admission> getCurrentAdmissions() {
        return admissionRepository.findCurrentAdmissions();
    }

    public List<Admission> getAdmissionsByPatient(Long patientId) {
        return admissionRepository.findByPatientId(patientId);
    }

    public List<Admission> getAdmissionsByDoctor(Long doctorId) {
        return admissionRepository.findByAdmittingDoctorId(doctorId);
    }

    public List<Admission> getAdmissionsByStatus(AdmissionStatus status) {
        return admissionRepository.findByStatus(status);
    }

    public List<Admission> getAdmissionsByDateRange(LocalDate startDate, LocalDate endDate) {
        return admissionRepository.findByAdmissionDateBetween(startDate, endDate);
    }

    public Admission getActiveAdmissionByPatient(Long patientId) {
        return admissionRepository.findActiveAdmissionByPatient(patientId);
    }

    public Admission createAdmission(Long patientId, Long doctorId, Long roomId, String bedNumber,
                                     AdmissionType admissionType, String reasonForAdmission, String notes) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        
        // Check if patient is already admitted
        Admission existingAdmission = admissionRepository.findActiveAdmissionByPatient(patientId);
        if (existingAdmission != null) {
            throw new RuntimeException("Patient is already admitted with admission ID: " + existingAdmission.getId());
        }
        
        Admission admission = Admission.builder()
                .patient(patient)
                .admittingDoctor(doctor)
                .admissionDate(LocalDate.now())
                .admissionTime(LocalDateTime.now())
                .admissionType(admissionType)
                .reasonForAdmission(reasonForAdmission)
                .notes(notes)
                .bedNumber(bedNumber)
                .status(AdmissionStatus.ADMITTED)
                .build();
        
        // Assign room if provided
        if (roomId != null) {
            Room room = roomRepository.findById(roomId)
                    .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
            
            admission.setRoom(room);
            
            // Update room status to occupied
            room.setStatus(RoomStatus.OCCUPIED);
            roomRepository.save(room);
        }
        
        return admissionRepository.save(admission);
    }

    public Admission updateAdmission(Long id, Admission admissionDetails) {
        Admission admission = admissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Admission not found with id: " + id));
        
        admission.setDiagnosis(admissionDetails.getDiagnosis());
        admission.setExpectedDischargeDate(admissionDetails.getExpectedDischargeDate());
        admission.setNotes(admissionDetails.getNotes());
        admission.setInsuranceInfo(admissionDetails.getInsuranceInfo());
        
        return admissionRepository.save(admission);
    }

    public Admission assignRoom(Long admissionId, Long roomId, String bedNumber) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found with id: " + admissionId));
        
        // Release old room if exists
        if (admission.getRoom() != null) {
            Room oldRoom = admission.getRoom();
            oldRoom.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(oldRoom);
        }
        
        // Assign new room
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));
        
        admission.setRoom(room);
        admission.setBedNumber(bedNumber);
        
        room.setStatus(RoomStatus.OCCUPIED);
        roomRepository.save(room);
        
        return admissionRepository.save(admission);
    }

    public Admission dischargePatient(Long admissionId, String dischargeSummary, String dischargeInstructions) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found with id: " + admissionId));
        
        admission.setStatus(AdmissionStatus.DISCHARGED);
        admission.setActualDischargeDate(LocalDate.now());
        admission.setDischargeTime(LocalDateTime.now());
        admission.setDischargeSummary(dischargeSummary);
        admission.setDischargeInstructions(dischargeInstructions);
        
        // Release room
        if (admission.getRoom() != null) {
            Room room = admission.getRoom();
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }
        
        return admissionRepository.save(admission);
    }

    public Long countCurrentAdmissions() {
        return admissionRepository.countCurrentAdmissions();
    }

    public Long countTodayAdmissions() {
        return admissionRepository.countAdmissionsByDate(LocalDate.now());
    }
}
