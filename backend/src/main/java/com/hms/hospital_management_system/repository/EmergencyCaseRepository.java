package com.hms.hospital_management_system.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.EmergencyCase;
import com.hms.hospital_management_system.entity.EmergencyCase.EmergencyStatus;
import com.hms.hospital_management_system.entity.EmergencyCase.TriageLevel;

@Repository
public interface EmergencyCaseRepository extends JpaRepository<EmergencyCase, Long> {

    List<EmergencyCase> findByStatus(EmergencyStatus status);

    List<EmergencyCase> findByTriageLevel(TriageLevel triageLevel);

    List<EmergencyCase> findByPatientIdOrderByArrivalTimeDesc(Long patientId);

    List<EmergencyCase> findByAssignedDoctorIdOrderByArrivalTimeDesc(Long doctorId);

    @Query("SELECT e FROM EmergencyCase e WHERE e.status IN ('WAITING', 'TRIAGE', 'IN_TREATMENT', 'OBSERVATION') ORDER BY e.triageLevel, e.arrivalTime")
    List<EmergencyCase> findActiveCases();

    @Query("SELECT e FROM EmergencyCase e WHERE e.arrivalTime BETWEEN :startTime AND :endTime ORDER BY e.arrivalTime DESC")
    List<EmergencyCase> findByArrivalTimeRange(@Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime);

    @Query("SELECT e FROM EmergencyCase e WHERE DATE(e.arrivalTime) = :date ORDER BY e.triageLevel, e.arrivalTime")
    List<EmergencyCase> findByDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(e) FROM EmergencyCase e WHERE e.status IN ('WAITING', 'TRIAGE', 'IN_TREATMENT')")
    Long countActiveCases();

    @Query("SELECT e.triageLevel, COUNT(e) FROM EmergencyCase e WHERE e.status IN ('WAITING', 'TRIAGE', 'IN_TREATMENT') GROUP BY e.triageLevel")
    List<Object[]> countByTriageLevel();
}
