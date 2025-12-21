package com.hms.hospital_management_system.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.Prescription;
import com.hms.hospital_management_system.entity.Prescription.PrescriptionStatus;
import com.hms.hospital_management_system.entity.PrescriptionItem;
import com.hms.hospital_management_system.repository.PrescriptionItemRepository;
import com.hms.hospital_management_system.repository.PrescriptionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final PrescriptionItemRepository prescriptionItemRepository;

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(Long id) {
        return prescriptionRepository.findById(id);
    }

    public Prescription getPrescriptionWithItems(Long id) {
        return prescriptionRepository.findByIdWithItems(id);
    }

    public List<Prescription> getPrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientIdOrderByPrescriptionDateDesc(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctor(Long doctorId) {
        return prescriptionRepository.findByDoctorIdOrderByPrescriptionDateDesc(doctorId);
    }

    public List<Prescription> getActivePrescriptionsByPatient(Long patientId) {
        return prescriptionRepository.findByPatientIdAndStatus(patientId, PrescriptionStatus.ACTIVE);
    }

    public List<Prescription> getPrescriptionsByStatus(PrescriptionStatus status) {
        return prescriptionRepository.findByStatus(status);
    }

    public List<Prescription> getPrescriptionsByAppointment(Long appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId);
    }

    public Prescription createPrescription(Prescription prescription) {
        // Set default values if not provided
        if (prescription.getPrescriptionDate() == null) {
            prescription.setPrescriptionDate(LocalDate.now());
        }
        if (prescription.getStatus() == null) {
            prescription.setStatus(PrescriptionStatus.ACTIVE);
        }
        if (prescription.getExpiryDate() == null) {
            prescription.setExpiryDate(prescription.getPrescriptionDate().plusMonths(1));
        }

        // Handle items
        if (prescription.getItems() != null) {
            for (PrescriptionItem item : prescription.getItems()) {
                item.setPrescription(prescription);
            }
        }

        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(Long id, Prescription updatedPrescription) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));

        prescription.setDiagnosis(updatedPrescription.getDiagnosis());
        prescription.setNotes(updatedPrescription.getNotes());
        prescription.setPharmacyName(updatedPrescription.getPharmacyName());
        prescription.setStatus(updatedPrescription.getStatus());
        prescription.setExpiryDate(updatedPrescription.getExpiryDate());

        return prescriptionRepository.save(prescription);
    }

    public void deletePrescription(Long id) {
        if (!prescriptionRepository.existsById(id)) {
            throw new RuntimeException("Prescription not found with id: " + id);
        }
        prescriptionRepository.deleteById(id);
    }

    public Prescription updateStatus(Long id, PrescriptionStatus status) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + id));
        prescription.setStatus(status);
        return prescriptionRepository.save(prescription);
    }

    public PrescriptionItem addItem(Long prescriptionId, PrescriptionItem item) {
        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new RuntimeException("Prescription not found with id: " + prescriptionId));
        item.setPrescription(prescription);
        return prescriptionItemRepository.save(item);
    }

    public void removeItem(Long itemId) {
        prescriptionItemRepository.deleteById(itemId);
    }

    public PrescriptionItem updateItemDispensed(Long itemId, boolean dispensed) {
        PrescriptionItem item = prescriptionItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Prescription item not found with id: " + itemId));
        item.setIsDispensed(dispensed);
        return prescriptionItemRepository.save(item);
    }

    public void checkAndExpirePrescriptions() {
        List<Prescription> expiredPrescriptions = prescriptionRepository.findExpiredPrescriptions(LocalDate.now());
        for (Prescription prescription : expiredPrescriptions) {
            prescription.setStatus(PrescriptionStatus.EXPIRED);
            prescriptionRepository.save(prescription);
        }
    }
}
