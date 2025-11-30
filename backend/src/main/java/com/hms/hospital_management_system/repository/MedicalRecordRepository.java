package com.hms.hospital_management_system.repository;

import com.hms.hospital_management_system.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    
    List<MedicalRecord> findByPatientId(Long patientId);
    
    List<MedicalRecord> findByDoctorId(Long doctorId);
    
    List<MedicalRecord> findByPatientIdOrderByRecordDateDesc(Long patientId);
    
    List<MedicalRecord> findByRecordDate(LocalDate date);
    
    @Query("SELECT m FROM MedicalRecord m WHERE m.patient.id = :patientId AND m.recordDate BETWEEN :startDate AND :endDate ORDER BY m.recordDate DESC")
    List<MedicalRecord> findByPatientIdAndDateRange(Long patientId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT m FROM MedicalRecord m WHERE LOWER(m.diagnosis) LIKE LOWER(CONCAT('%', :diagnosis, '%'))")
    List<MedicalRecord> searchByDiagnosis(String diagnosis);
}
