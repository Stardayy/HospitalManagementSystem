package com.hms.hospital_management_system.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.entity.Shift;
import com.hms.hospital_management_system.entity.Shift.ShiftStatus;
import com.hms.hospital_management_system.entity.Shift.ShiftType;
import com.hms.hospital_management_system.entity.Staff;
import com.hms.hospital_management_system.entity.Staff.StaffRole;
import com.hms.hospital_management_system.entity.Staff.StaffStatus;
import com.hms.hospital_management_system.repository.ShiftRepository;
import com.hms.hospital_management_system.repository.StaffRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffService {

    private final StaffRepository staffRepository;
    private final ShiftRepository shiftRepository;

    // ========== Staff Management ==========

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    public List<Staff> getStaffByRole(StaffRole role) {
        return staffRepository.findByRole(role);
    }

    public List<Staff> getStaffByDepartment(Long departmentId) {
        return staffRepository.findByDepartmentId(departmentId);
    }

    public List<Staff> getActiveStaff() {
        return staffRepository.findByStatus(StaffStatus.ACTIVE);
    }

    public List<Staff> searchStaff(String name) {
        return staffRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(name, name);
    }

    public Staff createStaff(Staff staff) {
        if (staff.getEmail() != null && staffRepository.existsByEmail(staff.getEmail())) {
            throw new RuntimeException("Staff with email " + staff.getEmail() + " already exists");
        }
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff staffDetails) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));

        staff.setFirstName(staffDetails.getFirstName());
        staff.setLastName(staffDetails.getLastName());
        staff.setEmail(staffDetails.getEmail());
        staff.setPhone(staffDetails.getPhone());
        staff.setRole(staffDetails.getRole());
        staff.setDepartment(staffDetails.getDepartment());
        staff.setStatus(staffDetails.getStatus());
        staff.setAddress(staffDetails.getAddress());
        staff.setQualifications(staffDetails.getQualifications());
        staff.setEmergencyContact(staffDetails.getEmergencyContact());
        staff.setEmergencyPhone(staffDetails.getEmergencyPhone());

        return staffRepository.save(staff);
    }

    public void deleteStaff(Long id) {
        if (!staffRepository.existsById(id)) {
            throw new RuntimeException("Staff not found with id: " + id);
        }
        staffRepository.deleteById(id);
    }

    // ========== Shift Management ==========

    public List<Shift> getAllShifts() {
        return shiftRepository.findAll();
    }

    public Optional<Shift> getShiftById(Long id) {
        return shiftRepository.findById(id);
    }

    public List<Shift> getShiftsByStaff(Long staffId) {
        return shiftRepository.findByStaffIdOrderByShiftDateDesc(staffId);
    }

    public List<Shift> getShiftsByDate(LocalDate date) {
        return shiftRepository.findByShiftDate(date);
    }

    public List<Shift> getShiftsByDateRange(LocalDate startDate, LocalDate endDate) {
        return shiftRepository.findByDateRange(startDate, endDate);
    }

    public List<Shift> getShiftsByDepartmentAndDate(Long departmentId, LocalDate date) {
        return shiftRepository.findByDepartmentIdAndShiftDate(departmentId, date);
    }

    public List<Shift> getTodaysShifts() {
        return shiftRepository.findByShiftDate(LocalDate.now());
    }

    public Shift createShift(Shift shift) {
        return shiftRepository.save(shift);
    }

    public Shift updateShift(Long id, Shift shiftDetails) {
        Shift shift = shiftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shift not found with id: " + id));

        shift.setShiftDate(shiftDetails.getShiftDate());
        shift.setShiftType(shiftDetails.getShiftType());
        shift.setStartTime(shiftDetails.getStartTime());
        shift.setEndTime(shiftDetails.getEndTime());
        shift.setDepartment(shiftDetails.getDepartment());
        shift.setStatus(shiftDetails.getStatus());
        shift.setNotes(shiftDetails.getNotes());

        return shiftRepository.save(shift);
    }

    public void deleteShift(Long id) {
        if (!shiftRepository.existsById(id)) {
            throw new RuntimeException("Shift not found with id: " + id);
        }
        shiftRepository.deleteById(id);
    }

    public Shift checkIn(Long shiftId) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Shift not found with id: " + shiftId));
        shift.setCheckInTime(java.time.LocalDateTime.now());
        shift.setStatus(ShiftStatus.IN_PROGRESS);
        return shiftRepository.save(shift);
    }

    public Shift checkOut(Long shiftId) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Shift not found with id: " + shiftId));
        shift.setCheckOutTime(java.time.LocalDateTime.now());
        shift.setStatus(ShiftStatus.COMPLETED);
        return shiftRepository.save(shift);
    }

    public Shift updateStatus(Long shiftId, ShiftStatus status) {
        Shift shift = shiftRepository.findById(shiftId)
                .orElseThrow(() -> new RuntimeException("Shift not found with id: " + shiftId));
        shift.setStatus(status);
        return shiftRepository.save(shift);
    }

    // Generate shifts for a week
    public void generateWeeklyShifts(Long staffId, ShiftType shiftType, LocalDate startDate) {
        Staff staff = staffRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + staffId));

        for (int i = 0; i < 7; i++) {
            LocalDate shiftDate = startDate.plusDays(i);
            Shift shift = Shift.builder()
                    .staff(staff)
                    .shiftDate(shiftDate)
                    .shiftType(shiftType)
                    .department(staff.getDepartment())
                    .status(ShiftStatus.SCHEDULED)
                    .build();
            shiftRepository.save(shift);
        }
    }
}
