package com.hms.hospital_management_system.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.hospital_management_system.dto.DashboardStats;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:3000"})
public class DashboardController {

    private final DashboardService dashboardService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            return ((CustomUserDetails) auth.getPrincipal()).getUser();
        }
        return null;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        User currentUser = getCurrentUser();
        // If user is a doctor, get filtered dashboard stats
        if (currentUser != null && currentUser.getRole() == User.Role.DOCTOR && currentUser.getDoctorId() != null) {
            return ResponseEntity.ok(dashboardService.getDashboardStatsForDoctor(currentUser.getDoctorId()));
        }
        // If user is a patient, get filtered dashboard stats
        if (currentUser != null && currentUser.getRole() == User.Role.PATIENT && currentUser.getPatientId() != null) {
            return ResponseEntity.ok(dashboardService.getDashboardStatsForPatient(currentUser.getPatientId()));
        }
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
}
