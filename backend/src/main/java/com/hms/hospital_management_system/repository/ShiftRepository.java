package com.hms.hospital_management_system.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Shift;
import com.hms.hospital_management_system.entity.Shift.ShiftStatus;
import com.hms.hospital_management_system.entity.Shift.ShiftType;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {

    List<Shift> findByStaffIdOrderByShiftDateDesc(Long staffId);

    List<Shift> findByShiftDate(LocalDate shiftDate);

    List<Shift> findByShiftDateAndShiftType(LocalDate shiftDate, ShiftType shiftType);

    List<Shift> findByDepartmentIdAndShiftDate(Long departmentId, LocalDate shiftDate);

    List<Shift> findByStatus(ShiftStatus status);

    @Query("SELECT s FROM Shift s WHERE s.shiftDate BETWEEN :startDate AND :endDate ORDER BY s.shiftDate, s.shiftType")
    List<Shift> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT s FROM Shift s WHERE s.staff.id = :staffId AND s.shiftDate BETWEEN :startDate AND :endDate")
    List<Shift> findByStaffIdAndDateRange(@Param("staffId") Long staffId, @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT s FROM Shift s WHERE s.shiftDate = :date AND s.status = 'SCHEDULED'")
    List<Shift> findScheduledShiftsForDate(@Param("date") LocalDate date);

    @Query("SELECT COUNT(s) FROM Shift s WHERE s.staff.id = :staffId AND s.shiftDate BETWEEN :startDate AND :endDate")
    Long countShiftsByStaffInPeriod(@Param("staffId") Long staffId, @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
