package com.hms.hospital_management_system.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.LabTest;

@Repository
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    
    List<LabTest> findByCategory(String category);
    
    List<LabTest> findByIsActiveTrue();
    
    List<LabTest> findByNameContainingIgnoreCase(String name);
    
    List<LabTest> findBySampleType(String sampleType);
}
