package com.hms.hospital_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
    Optional<Doctor> findByEmail(String email);
    
    Optional<Doctor> findByLicenseNumber(String licenseNumber);
    
    @Query("SELECT d FROM Doctor d WHERE d.id = (SELECT u.doctorId FROM User u WHERE u.id = :userId)")
    Optional<Doctor> findByUserId(@Param("userId") Long userId);
    
    List<Doctor> findByDepartmentId(Long departmentId);
    
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
    
    @Query("SELECT d FROM Doctor d WHERE LOWER(d.firstName) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(d.lastName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Doctor> searchByName(String name);
    
    boolean existsByEmail(String email);
    
    boolean existsByLicenseNumber(String licenseNumber);
}
