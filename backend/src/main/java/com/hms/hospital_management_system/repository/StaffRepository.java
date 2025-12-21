package com.hms.hospital_management_system.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hms.hospital_management_system.entity.Staff;
import com.hms.hospital_management_system.entity.Staff.StaffRole;
import com.hms.hospital_management_system.entity.Staff.StaffStatus;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByRole(StaffRole role);

    List<Staff> findByDepartmentId(Long departmentId);

    List<Staff> findByStatus(StaffStatus status);

    List<Staff> findByRoleAndStatus(StaffRole role, StaffStatus status);

    Optional<Staff> findByEmail(String email);

    boolean existsByEmail(String email);

    List<Staff> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String firstName, String lastName);
}
