package com.hms.hospital_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Patient;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    
    Optional<Patient> findByEmail(String email);
    
    @Query("SELECT p FROM Patient p WHERE p.id = (SELECT u.patientId FROM User u WHERE u.id = :userId)")
    Optional<Patient> findByUserId(@Param("userId") Long userId);
    
    List<Patient> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String firstName, String lastName, String email);
    
    List<Patient> findByBloodType(String bloodType);
    
    @Query("SELECT p FROM Patient p WHERE LOWER(p.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(p.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Patient> searchByName(String name);
    
    boolean existsByEmail(String email);
    
    // Find patients who have appointments or medical records with a specific doctor
    @Query("SELECT DISTINCT p FROM Patient p WHERE p.id IN " +
           "(SELECT a.patient.id FROM Appointment a WHERE a.doctor.id = :doctorId) " +
           "OR p.id IN (SELECT m.patient.id FROM MedicalRecord m WHERE m.doctor.id = :doctorId)")
    List<Patient> findByDoctorId(@Param("doctorId") Long doctorId);
}
