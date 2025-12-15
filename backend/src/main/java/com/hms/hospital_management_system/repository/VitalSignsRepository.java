package com.hms.hospital_management_system.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.VitalSigns;

@Repository
public interface VitalSignsRepository extends JpaRepository<VitalSigns, Long> {
    
    List<VitalSigns> findByPatientId(Long patientId);
    
    List<VitalSigns> findByRecordedById(Long doctorId);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patient.id = :patientId ORDER BY vs.recordedAt DESC")
    List<VitalSigns> findByPatientIdOrderByRecordedAtDesc(@Param("patientId") Long patientId);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patient.id = :patientId ORDER BY vs.recordedAt DESC LIMIT 1")
    VitalSigns findLatestByPatientId(@Param("patientId") Long patientId);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.recordedAt BETWEEN :startDate AND :endDate")
    List<VitalSigns> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT vs FROM VitalSigns vs WHERE vs.patient.id = :patientId AND vs.recordedAt BETWEEN :startDate AND :endDate ORDER BY vs.recordedAt")
    List<VitalSigns> findByPatientIdAndDateRange(@Param("patientId") Long patientId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
