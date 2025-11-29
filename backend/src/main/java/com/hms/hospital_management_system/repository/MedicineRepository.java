package com.hms.hospital_management_system.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Medicine;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {
    
    Optional<Medicine> findByName(String name);
    
    List<Medicine> findByNameContainingIgnoreCase(String name);
    
    List<Medicine> findByManufacturer(String manufacturer);
    
    @Query("SELECT m FROM Medicine m WHERE m.stockQuantity <= m.reorderLevel")
    List<Medicine> findLowStockMedicines();
    
    @Query("SELECT m FROM Medicine m WHERE m.expiryDate <= :date")
    List<Medicine> findExpiredMedicines(LocalDate date);
    
    @Query("SELECT m FROM Medicine m WHERE m.expiryDate BETWEEN :startDate AND :endDate")
    List<Medicine> findMedicinesExpiringBetween(LocalDate startDate, LocalDate endDate);
    
    boolean existsByName(String name);
}
