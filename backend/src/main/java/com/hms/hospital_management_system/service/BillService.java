package com.hms.hospital_management_system.service;

import com.hms.hospital_management_system.entity.Bill;
import com.hms.hospital_management_system.entity.Bill.PaymentStatus;
import com.hms.hospital_management_system.entity.Bill.PaymentMethod;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.repository.BillRepository;
import com.hms.hospital_management_system.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class BillService {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Optional<Bill> getBillById(Long id) {
        return billRepository.findById(id);
    }

    public Bill createBill(Bill bill, Long patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));

        bill.setPatient(patient);
        return billRepository.save(bill);
    }

    public Bill updateBill(Long id, Bill billDetails) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));

        bill.setConsultationFee(billDetails.getConsultationFee());
        bill.setMedicineCost(billDetails.getMedicineCost());
        bill.setRoomCharges(billDetails.getRoomCharges());
        bill.setLabCharges(billDetails.getLabCharges());
        bill.setOtherCharges(billDetails.getOtherCharges());
        bill.setDiscount(billDetails.getDiscount());
        bill.setTax(billDetails.getTax());
        bill.setNotes(billDetails.getNotes());

        return billRepository.save(bill);
    }

    public Bill processPayment(Long id, PaymentMethod paymentMethod) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
        
        bill.setPaymentStatus(PaymentStatus.PAID);
        bill.setPaymentMethod(paymentMethod);
        bill.setPaymentDate(LocalDate.now());
        
        return billRepository.save(bill);
    }

    public Bill updatePaymentStatus(Long id, PaymentStatus status) {
        Bill bill = billRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Bill not found with id: " + id));
        
        bill.setPaymentStatus(status);
        if (status == PaymentStatus.PAID) {
            bill.setPaymentDate(LocalDate.now());
        }
        
        return billRepository.save(bill);
    }

    public void deleteBill(Long id) {
        if (!billRepository.existsById(id)) {
            throw new RuntimeException("Bill not found with id: " + id);
        }
        billRepository.deleteById(id);
    }

    public List<Bill> getBillsByPatient(Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    public List<Bill> getBillsByStatus(PaymentStatus status) {
        return billRepository.findByPaymentStatus(status);
    }

    public List<Bill> getPendingBills() {
        return billRepository.findByPaymentStatus(PaymentStatus.PENDING);
    }

    public List<Bill> getBillsByPatientAndStatus(Long patientId, PaymentStatus status) {
        return billRepository.findByPatientIdAndPaymentStatus(patientId, status);
    }

    public List<Bill> getBillsByDateRange(LocalDate startDate, LocalDate endDate) {
        return billRepository.findByDateRange(startDate, endDate);
    }

    public Double getTotalRevenue(LocalDate startDate, LocalDate endDate) {
        Double revenue = billRepository.getTotalRevenueByDateRange(startDate, endDate);
        return revenue != null ? revenue : 0.0;
    }

    public Double getTotalPendingAmount() {
        Double pending = billRepository.getTotalPendingAmount();
        return pending != null ? pending : 0.0;
    }
}
