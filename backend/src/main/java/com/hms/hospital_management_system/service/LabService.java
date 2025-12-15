package com.hms.hospital_management_system.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.entity.LabOrder;
import com.hms.hospital_management_system.entity.LabOrder.LabOrderStatus;
import com.hms.hospital_management_system.entity.LabResult;
import com.hms.hospital_management_system.entity.LabTest;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.repository.DoctorRepository;
import com.hms.hospital_management_system.repository.LabOrderRepository;
import com.hms.hospital_management_system.repository.LabResultRepository;
import com.hms.hospital_management_system.repository.LabTestRepository;
import com.hms.hospital_management_system.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class LabService {

    private final LabTestRepository labTestRepository;
    private final LabOrderRepository labOrderRepository;
    private final LabResultRepository labResultRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    // ========== Lab Test Methods ==========

    public List<LabTest> getAllLabTests() {
        return labTestRepository.findAll();
    }

    public List<LabTest> getActiveLabTests() {
        return labTestRepository.findByIsActiveTrue();
    }

    public Optional<LabTest> getLabTestById(Long id) {
        return labTestRepository.findById(id);
    }

    public List<LabTest> getLabTestsByCategory(String category) {
        return labTestRepository.findByCategory(category);
    }

    public List<LabTest> searchLabTests(String name) {
        return labTestRepository.findByNameContainingIgnoreCase(name);
    }

    public LabTest createLabTest(LabTest labTest) {
        return labTestRepository.save(labTest);
    }

    public LabTest updateLabTest(Long id, LabTest labTestDetails) {
        LabTest labTest = labTestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab test not found with id: " + id));
        
        labTest.setName(labTestDetails.getName());
        labTest.setDescription(labTestDetails.getDescription());
        labTest.setCategory(labTestDetails.getCategory());
        labTest.setPrice(labTestDetails.getPrice());
        labTest.setNormalRange(labTestDetails.getNormalRange());
        labTest.setSampleType(labTestDetails.getSampleType());
        labTest.setTurnaroundTime(labTestDetails.getTurnaroundTime());
        labTest.setIsActive(labTestDetails.getIsActive());
        
        return labTestRepository.save(labTest);
    }

    public void deleteLabTest(Long id) {
        labTestRepository.deleteById(id);
    }

    // ========== Lab Order Methods ==========

    public List<LabOrder> getAllLabOrders() {
        return labOrderRepository.findAll();
    }

    public Optional<LabOrder> getLabOrderById(Long id) {
        return labOrderRepository.findById(id);
    }

    public List<LabOrder> getLabOrdersByPatient(Long patientId) {
        return labOrderRepository.findByPatientIdOrderByOrderDateDesc(patientId);
    }

    public List<LabOrder> getLabOrdersByDoctor(Long doctorId) {
        return labOrderRepository.findByDoctorId(doctorId);
    }

    public List<LabOrder> getLabOrdersByStatus(LabOrderStatus status) {
        return labOrderRepository.findByStatus(status);
    }

    public LabOrder createLabOrder(Long patientId, Long doctorId, List<Long> testIds, String notes, String priority) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        
        LabOrder labOrder = LabOrder.builder()
                .patient(patient)
                .doctor(doctor)
                .orderDate(LocalDateTime.now())
                .status(LabOrderStatus.PENDING)
                .notes(notes)
                .priority(priority != null ? priority : "NORMAL")
                .results(new ArrayList<>())
                .build();
        
        labOrder = labOrderRepository.save(labOrder);
        
        // Create lab results for each test
        for (Long testId : testIds) {
            LabTest labTest = labTestRepository.findById(testId)
                    .orElseThrow(() -> new RuntimeException("Lab test not found with id: " + testId));
            
            LabResult result = LabResult.builder()
                    .labOrder(labOrder)
                    .labTest(labTest)
                    .referenceRange(labTest.getNormalRange())
                    .build();
            
            labResultRepository.save(result);
            labOrder.getResults().add(result);
        }
        
        return labOrder;
    }

    public LabOrder updateLabOrderStatus(Long id, LabOrderStatus status) {
        LabOrder labOrder = labOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab order not found with id: " + id));
        
        labOrder.setStatus(status);
        return labOrderRepository.save(labOrder);
    }

    public void deleteLabOrder(Long id) {
        labOrderRepository.deleteById(id);
    }

    // ========== Lab Result Methods ==========

    public List<LabResult> getResultsByLabOrder(Long labOrderId) {
        return labResultRepository.findByLabOrderId(labOrderId);
    }

    public Optional<LabResult> getLabResultById(Long id) {
        return labResultRepository.findById(id);
    }

    public LabResult updateLabResult(Long id, LabResult resultDetails) {
        LabResult result = labResultRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab result not found with id: " + id));
        
        result.setResultValue(resultDetails.getResultValue());
        result.setUnit(resultDetails.getUnit());
        result.setResultStatus(resultDetails.getResultStatus());
        result.setRemarks(resultDetails.getRemarks());
        result.setPerformedBy(resultDetails.getPerformedBy());
        result.setVerifiedBy(resultDetails.getVerifiedBy());
        result.setResultDate(LocalDateTime.now());
        
        LabResult savedResult = labResultRepository.save(result);
        
        // Check if all results are completed to update order status
        checkAndUpdateOrderStatus(result.getLabOrder().getId());
        
        return savedResult;
    }

    private void checkAndUpdateOrderStatus(Long orderId) {
        List<LabResult> results = labResultRepository.findByLabOrderId(orderId);
        boolean allCompleted = results.stream()
                .allMatch(r -> r.getResultValue() != null && !r.getResultValue().isEmpty());
        
        if (allCompleted) {
            LabOrder order = labOrderRepository.findById(orderId).orElse(null);
            if (order != null && order.getStatus() != LabOrderStatus.COMPLETED) {
                order.setStatus(LabOrderStatus.COMPLETED);
                labOrderRepository.save(order);
            }
        }
    }

    // ========== Statistics ==========

    public Long countPendingOrders() {
        return labOrderRepository.countByStatus(LabOrderStatus.PENDING);
    }

    public Long countInProgressOrders() {
        return labOrderRepository.countByStatus(LabOrderStatus.IN_PROGRESS);
    }
}
