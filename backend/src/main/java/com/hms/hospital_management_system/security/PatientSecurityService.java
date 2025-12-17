package com.hms.hospital_management_system.security;

import com.hms.hospital_management_system.entity.*;
import com.hms.hospital_management_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service("patientSecurityService")
@RequiredArgsConstructor
public class PatientSecurityService {

    private final PatientRepository patientRepository;
    private final BillRepository billRepository;
    private final LabOrderRepository labOrderRepository;
    private final AdmissionRepository admissionRepository;
    private final UserRepository userRepository;

    public boolean isPatient(Long patientId, UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return false;
        
        Patient patient = patientRepository.findByUserId(user.getId()).orElse(null);
        if (patient == null) return false;
        
        return patient.getId().equals(patientId);
    }

    public boolean isBillOwner(Long billId, UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return false;
        
        Patient patient = patientRepository.findByUserId(user.getId()).orElse(null);
        if (patient == null) return false;
        
        Bill bill = billRepository.findById(billId).orElse(null);
        if (bill == null || bill.getPatient() == null) return false;
        
        return bill.getPatient().getId().equals(patient.getId());
    }

    public boolean isLabOrderOwner(Long orderId, UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return false;
        
        Patient patient = patientRepository.findByUserId(user.getId()).orElse(null);
        if (patient == null) return false;
        
        LabOrder labOrder = labOrderRepository.findById(orderId).orElse(null);
        if (labOrder == null || labOrder.getPatient() == null) return false;
        
        return labOrder.getPatient().getId().equals(patient.getId());
    }

    public boolean isAdmissionOwner(Long admissionId, UserDetails principal) {
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return false;
        
        Patient patient = patientRepository.findByUserId(user.getId()).orElse(null);
        if (patient == null) return false;
        
        Admission admission = admissionRepository.findById(admissionId).orElse(null);
        if (admission == null || admission.getPatient() == null) return false;
        
        return admission.getPatient().getId().equals(patient.getId());
    }
}
