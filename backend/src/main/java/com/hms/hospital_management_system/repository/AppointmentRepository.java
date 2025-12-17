package com.hms.hospital_management_system.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Appointment;
import com.hms.hospital_management_system.entity.Appointment.AppointmentStatus;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    List<Appointment> findByPatientId(Long patientId);
    
    List<Appointment> findByDoctorId(Long doctorId);
    
    List<Appointment> findByAppointmentDate(LocalDate date);
    
    List<Appointment> indByPatientIdOrderByAppointmentDateDesc(Long patientId);

    List<Appointment> findByStatus(AppointmentStatus status);
    
    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate date);
    
    List<Appointment> findByPatientIdAndStatus(Long patientId, AppointmentStatus status);
    
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findByDateRange(LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId AND a.appointmentDate BETWEEN :startDate AND :endDate")
    List<Appointment> findByDoctorIdAndDateRange(Long doctorId, LocalDate startDate, LocalDate endDate);
    
    // Check for conflicting appointments (same doctor, date, and time within 30-minute window)
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date " +
           "AND a.appointmentTime BETWEEN :startTime AND :endTime " +
           "AND a.status NOT IN ('CANCELLED', 'NO_SHOW')")
    List<Appointment> findConflictingAppointments(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
    
    // Check for conflicting appointments excluding a specific appointment (for updates)
    @Query("SELECT a FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date " +
           "AND a.appointmentTime BETWEEN :startTime AND :endTime " +
           "AND a.status NOT IN ('CANCELLED', 'NO_SHOW') " +
           "AND a.id != :excludeId")
    List<Appointment> findConflictingAppointmentsExcluding(
            @Param("doctorId") Long doctorId,
            @Param("date") LocalDate date,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId);
}