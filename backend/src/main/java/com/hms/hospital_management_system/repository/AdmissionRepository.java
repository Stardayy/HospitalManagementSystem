package com.hms.hospital_management_system.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Admission;
import com.hms.hospital_management_system.entity.Admission.AdmissionStatus;
import com.hms.hospital_management_system.entity.Admission.AdmissionType;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Long> {
    
    List<Admission> findByPatientId(Long patientId);
    
    List<Admission> findByAdmittingDoctorId(Long doctorId);
    
    List<Admission> findByRoomId(Long roomId);
    
    List<Admission> findByStatus(AdmissionStatus status);
    
    List<Admission> findByAdmissionType(AdmissionType admissionType);
    
    List<Admission> findByAdmissionDateBetween(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT a FROM Admission a WHERE a.status = 'ADMITTED' ORDER BY a.admissionDate DESC")
    List<Admission> findCurrentAdmissions();
    
    @Query("SELECT a FROM Admission a WHERE a.room.id = :roomId AND a.status = 'ADMITTED'")
    List<Admission> findActiveAdmissionsByRoom(@Param("roomId") Long roomId);
    
    @Query("SELECT COUNT(a) FROM Admission a WHERE a.status = 'ADMITTED'")
    Long countCurrentAdmissions();
    
    @Query("SELECT COUNT(a) FROM Admission a WHERE a.admissionDate = :date")
    Long countAdmissionsByDate(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Admission a WHERE a.patient.id = :patientId AND a.status = 'ADMITTED'")
    Admission findActiveAdmissionByPatient(@Param("patientId") Long patientId);
}
