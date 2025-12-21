package com.hms.hospital_management_system.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hms.hospital_management_system.dto.PasswordDTO.ChangePasswordRequest;
import com.hms.hospital_management_system.dto.PasswordDTO.PasswordResetResponse;
import com.hms.hospital_management_system.dto.UserProfileDTO;
import com.hms.hospital_management_system.security.CustomUserDetails;
import com.hms.hospital_management_system.service.UserService;
import com.hms.hospital_management_system.util.AuditHelper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174", "http://localhost:3000" })
public class UserController {

    private final UserService userService;
    private final AuditHelper auditHelper;

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        return userDetails.getUser().getId();
    }

    // Get all users (for messaging)
    @GetMapping("/all")
    public ResponseEntity<List<UserProfileDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Profile endpoints
    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getProfile() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(userService.getProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDTO> updateProfile(@Valid @RequestBody UserProfileDTO profileDTO,
            HttpServletRequest request) {
        Long userId = getCurrentUserId();
        UserProfileDTO updated = userService.updateProfile(userId, profileDTO);
        auditHelper.logUpdate("User", userId.toString(), "Updated user profile", request);
        return ResponseEntity.ok(updated);
    }

    // Password change (for authenticated users)
    @PostMapping("/change-password")
    public ResponseEntity<PasswordResetResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest passwordRequest,
            HttpServletRequest httpRequest) {
        Long userId = getCurrentUserId();
        PasswordResetResponse response = userService.changePassword(userId, passwordRequest);
        auditHelper.logUpdate("User", userId.toString(), "Password changed", httpRequest);
        return ResponseEntity.ok(response);
    }
}
