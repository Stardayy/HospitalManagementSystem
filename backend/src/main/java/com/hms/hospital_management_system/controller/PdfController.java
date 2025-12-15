package com.hms.hospital_management_system.controller;

import com.hms.hospital_management_system.entity.*;
import com.hms.hospital_management_system.repository.*;
import com.hms.hospital_management_system.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class PdfController {

    private final PdfService pdfService;
    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;
    private final VitalSignsRepository vitalSignsRepository;
    private final BillRepository billRepository;
    private final LabOrderRepository labOrderRepository;
    private final LabResultRepository labResultRepository;
    private final AdmissionRepository admissionRepository;

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or @patientSecurityService.isPatient(#patientId, principal)")
    public ResponseEntity<byte[]> generatePatientReport(@PathVariable Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        
        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdOrderByRecordDateDesc(patientId);
        List<Appointment> appointments = appointmentRepository.findByPatientIdOrderByAppointmentDateDesc(patientId);
        List<VitalSigns> vitalSigns = vitalSignsRepository.findByPatientIdOrderByRecordedAtDesc(patientId);
        
        byte[] pdfContent = pdfService.generatePatientReport(patient, records, appointments, vitalSigns);
        
        String filename = "patient_report_" + patient.getLastName() + "_" + 
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".pdf";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    @GetMapping("/bill/{billId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or @patientSecurityService.isBillOwner(#billId, principal)")
    public ResponseEntity<byte[]> generateBillReport(@PathVariable Long billId) {
        Bill bill = billRepository.findById(billId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        
        byte[] pdfContent = pdfService.generateBillReport(bill);
        
        String filename = "invoice_" + billId + "_" + 
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".pdf";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    @GetMapping("/lab/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or @patientSecurityService.isLabOrderOwner(#orderId, principal)")
    public ResponseEntity<byte[]> generateLabReport(@PathVariable Long orderId) {
        LabOrder labOrder = labOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Lab order not found"));
        
        List<LabResult> results = labResultRepository.findByLabOrderId(orderId);
        
        byte[] pdfContent = pdfService.generateLabReport(labOrder, results);
        
        String filename = "lab_report_" + orderId + "_" + 
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".pdf";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }

    @GetMapping("/admission/{admissionId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR') or @patientSecurityService.isAdmissionOwner(#admissionId, principal)")
    public ResponseEntity<byte[]> generateAdmissionReport(@PathVariable Long admissionId) {
        Admission admission = admissionRepository.findById(admissionId)
                .orElseThrow(() -> new RuntimeException("Admission not found"));
        
        List<VitalSigns> vitalSigns = List.of(); // Get vitals during admission period
        if (admission.getPatient() != null) {
            vitalSigns = vitalSignsRepository.findByPatientIdOrderByRecordedAtDesc(admission.getPatient().getId());
        }
        
        List<MedicalRecord> records = List.of();
        if (admission.getPatient() != null) {
            records = medicalRecordRepository.findByPatientIdOrderByRecordDateDesc(admission.getPatient().getId());
        }
        
        byte[] pdfContent = pdfService.generateAdmissionSummary(admission, vitalSigns, records);
        
        String filename = "admission_summary_" + admissionId + "_" + 
                LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".pdf";
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }
}
