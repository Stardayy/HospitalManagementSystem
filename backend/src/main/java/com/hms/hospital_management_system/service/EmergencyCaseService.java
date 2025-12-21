package com.hms.hospital_management_system.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.EmergencyCase;
import com.hms.hospital_management_system.entity.EmergencyCase.EmergencyStatus;
import com.hms.hospital_management_system.entity.EmergencyCase.TriageLevel;
import com.hms.hospital_management_system.repository.EmergencyCaseRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class EmergencyCaseService {

    private final EmergencyCaseRepository emergencyRepository;

    public List<EmergencyCase> getAllCases() {
        return emergencyRepository.findAll();
    }

    public Optional<EmergencyCase> getCaseById(Long id) {
        return emergencyRepository.findById(id);
    }

    public List<EmergencyCase> getActiveCases() {
        return emergencyRepository.findActiveCases();
    }

    public List<EmergencyCase> getCasesByStatus(EmergencyStatus status) {
        return emergencyRepository.findByStatus(status);
    }

    public List<EmergencyCase> getCasesByTriageLevel(TriageLevel level) {
        return emergencyRepository.findByTriageLevel(level);
    }

    public List<EmergencyCase> getTodaysCases() {
        return emergencyRepository.findByDate(LocalDate.now());
    }

    public Long getActiveCaseCount() {
        return emergencyRepository.countActiveCases();
    }

    public EmergencyCase createCase(EmergencyCase emergencyCase) {
        if (emergencyCase.getArrivalTime() == null) {
            emergencyCase.setArrivalTime(LocalDateTime.now());
        }
        return emergencyRepository.save(emergencyCase);
    }

    public EmergencyCase updateCase(Long id, EmergencyCase caseDetails) {
        EmergencyCase emergencyCase = emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency case not found with id: " + id));

        emergencyCase.setChiefComplaint(caseDetails.getChiefComplaint());
        emergencyCase.setTriageLevel(caseDetails.getTriageLevel());
        emergencyCase.setVitalSigns(caseDetails.getVitalSigns());
        emergencyCase.setInitialAssessment(caseDetails.getInitialAssessment());
        emergencyCase.setAssignedDoctor(caseDetails.getAssignedDoctor());
        emergencyCase.setAssignedNurse(caseDetails.getAssignedNurse());
        emergencyCase.setTreatmentArea(caseDetails.getTreatmentArea());
        emergencyCase.setBedNumber(caseDetails.getBedNumber());
        emergencyCase.setTreatmentNotes(caseDetails.getTreatmentNotes());
        emergencyCase.setDiagnosis(caseDetails.getDiagnosis());
        emergencyCase.setNotes(caseDetails.getNotes());

        return emergencyRepository.save(emergencyCase);
    }

    public EmergencyCase startTriage(Long id) {
        EmergencyCase emergencyCase = emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency case not found with id: " + id));
        emergencyCase.setStatus(EmergencyStatus.TRIAGE);
        return emergencyRepository.save(emergencyCase);
    }

    public EmergencyCase startTreatment(Long id) {
        EmergencyCase emergencyCase = emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency case not found with id: " + id));
        emergencyCase.setStatus(EmergencyStatus.IN_TREATMENT);
        emergencyCase.setTreatmentStartTime(LocalDateTime.now());
        return emergencyRepository.save(emergencyCase);
    }

    public EmergencyCase updateStatus(Long id, EmergencyStatus status) {
        EmergencyCase emergencyCase = emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency case not found with id: " + id));
        emergencyCase.setStatus(status);

        if (status == EmergencyStatus.DISCHARGED) {
            emergencyCase.setDischargeTime(LocalDateTime.now());
            emergencyCase.setTreatmentEndTime(LocalDateTime.now());
        }

        return emergencyRepository.save(emergencyCase);
    }

    public EmergencyCase dischargePatient(Long id, String disposition) {
        EmergencyCase emergencyCase = emergencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Emergency case not found with id: " + id));
        emergencyCase.setStatus(EmergencyStatus.DISCHARGED);
        emergencyCase.setDisposition(disposition);
        emergencyCase.setDischargeTime(LocalDateTime.now());
        emergencyCase.setTreatmentEndTime(LocalDateTime.now());
        return emergencyRepository.save(emergencyCase);
    }

    public void deleteCase(Long id) {
        if (!emergencyRepository.existsById(id)) {
            throw new RuntimeException("Emergency case not found with id: " + id);
        }
        emergencyRepository.deleteById(id);
    }
}
