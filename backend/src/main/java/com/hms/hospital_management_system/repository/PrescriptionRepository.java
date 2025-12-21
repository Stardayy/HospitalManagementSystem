package com.hms.hospital_management_system.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Prescription;
import com.hms.hospital_management_system.entity.Prescription.PrescriptionStatus;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    List<Prescription> findByPatientIdOrderByPrescriptionDateDesc(Long patientId);

    List<Prescription> findByDoctorIdOrderByPrescriptionDateDesc(Long doctorId);

    List<Prescription> findByStatus(PrescriptionStatus status);

    List<Prescription> findByPatientIdAndStatus(Long patientId, PrescriptionStatus status);

    @Query("SELECT p FROM Prescription p WHERE p.expiryDate < :date AND p.status = 'ACTIVE'")
    List<Prescription> findExpiredPrescriptions(@Param("date") LocalDate date);

    @Query("SELECT p FROM Prescription p WHERE p.prescriptionDate BETWEEN :startDate AND :endDate")
    List<Prescription> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT p FROM Prescription p JOIN FETCH p.items WHERE p.id = :id")
    Prescription findByIdWithItems(@Param("id") Long id);

    List<Prescription> findByAppointmentId(Long appointmentId);
}
