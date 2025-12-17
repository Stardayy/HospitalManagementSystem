package com.hms.hospital_management_system.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.LabOrder;
import com.hms.hospital_management_system.entity.LabOrder.LabOrderStatus;

@Repository
public interface LabOrderRepository extends JpaRepository<LabOrder, Long> {
    
    List<LabOrder> findByPatientId(Long patientId);
    
    List<LabOrder> findByDoctorId(Long doctorId);
    
    List<LabOrder> findByStatus(LabOrderStatus status);
    
    List<LabOrder> findByPatientIdAndStatus(Long patientId, LabOrderStatus status);
    
    @Query("SELECT lo FROM LabOrder lo WHERE lo.orderDate BETWEEN :startDate AND :endDate")
    List<LabOrder> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT lo FROM LabOrder lo WHERE lo.patient.id = :patientId ORDER BY lo.orderDate DESC")
    List<LabOrder> findByPatientIdOrderByOrderDateDesc(@Param("patientId") Long patientId);
    
    @Query("SELECT COUNT(lo) FROM LabOrder lo WHERE lo.status = :status")
    Long countByStatus(@Param("status") LabOrderStatus status);
}
