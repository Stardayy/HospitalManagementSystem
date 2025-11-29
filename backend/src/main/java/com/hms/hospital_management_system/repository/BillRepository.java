package com.hms.hospital_management_system.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Bill;
import com.hms.hospital_management_system.entity.Bill.PaymentStatus;

@Repository
public interface BillRepository extends JpaRepository<Bill, Long> {
    
    List<Bill> findByPatientId(Long patientId);
    
    List<Bill> findByPaymentStatus(PaymentStatus status);
    
    List<Bill> findByBillDate(LocalDate date);
    
    List<Bill> findByPatientIdAndPaymentStatus(Long patientId, PaymentStatus status);
    
    @Query("SELECT b FROM Bill b WHERE b.billDate BETWEEN :startDate AND :endDate")
    List<Bill> findByDateRange(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(b.netAmount) FROM Bill b WHERE b.paymentStatus = 'PAID' AND b.billDate BETWEEN :startDate AND :endDate")
    Double getTotalRevenueByDateRange(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT SUM(b.netAmount) FROM Bill b WHERE b.paymentStatus = 'PENDING'")
    Double getTotalPendingAmount();
}
