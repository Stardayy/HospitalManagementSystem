package com.hms.hospital_management_system.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.dto.PasswordDTO.ChangePasswordRequest;
import com.hms.hospital_management_system.dto.PasswordDTO.ForgotPasswordRequest;
import com.hms.hospital_management_system.dto.PasswordDTO.PasswordResetResponse;
import com.hms.hospital_management_system.dto.PasswordDTO.ResetPasswordRequest;
import com.hms.hospital_management_system.dto.UserProfileDTO;
import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.repository.DoctorRepository;
import com.hms.hospital_management_system.repository.PatientRepository;
import com.hms.hospital_management_system.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;

    // In-memory token storage (in production, use Redis or database)
    private final ConcurrentHashMap<String, TokenInfo> resetTokens = new ConcurrentHashMap<>();

    private record TokenInfo(Long userId, LocalDateTime expiry) {}

    // Get all users for messaging
    @Transactional(readOnly = true)
    public List<UserProfileDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> {
                    String firstName = user.getFirstName();
                    String lastName = user.getLastName();
                    
                    // Get name from Doctor or Patient if available
                    if (user.getRole() == User.Role.DOCTOR) {
                        Optional<Doctor> doctor = doctorRepository.findByUserId(user.getId());
                        if (doctor.isPresent()) {
                            firstName = doctor.get().getFirstName();
                            lastName = doctor.get().getLastName();
                        }
                    } else if (user.getRole() == User.Role.PATIENT) {
                        Optional<Patient> patient = patientRepository.findByUserId(user.getId());
                        if (patient.isPresent()) {
                            firstName = patient.get().getFirstName();
                            lastName = patient.get().getLastName();
                        }
                    }
                    
                    return UserProfileDTO.builder()
                            .id(user.getId())
                            .email(user.getEmail())
                            .firstName(firstName)
                            .lastName(lastName)
                            .role(user.getRole().name())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // Password Reset Methods
    public PasswordResetResponse forgotPassword(ForgotPasswordRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            // Don't reveal if email exists for security
            return PasswordResetResponse.builder()
                    .success(true)
                    .message("If an account exists with this email, you will receive password reset instructions.")
                    .build();
        }

        User user = userOpt.get();
        String token = UUID.randomUUID().toString();
        
        // Store token with 1-hour expiry
        resetTokens.put(token, new TokenInfo(user.getId(), LocalDateTime.now().plusHours(1)));
        
        // In production, send email with reset link
        log.info("Password reset token for user {}: {}", user.getEmail(), token);
        
        return PasswordResetResponse.builder()
                .success(true)
                .message("If an account exists with this email, you will receive password reset instructions.")
                .build();
    }

    @Transactional
    public PasswordResetResponse resetPassword(ResetPasswordRequest request) {
        TokenInfo tokenInfo = resetTokens.get(request.getToken());
        
        if (tokenInfo == null) {
            throw new RuntimeException("Invalid or expired reset token");
        }
        
        if (tokenInfo.expiry().isBefore(LocalDateTime.now())) {
            resetTokens.remove(request.getToken());
            throw new RuntimeException("Reset token has expired");
        }

        User user = userRepository.findById(tokenInfo.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        // Remove used token
        resetTokens.remove(request.getToken());
        
        return PasswordResetResponse.builder()
                .success(true)
                .message("Password has been reset successfully")
                .build();
    }

    @Transactional
    public PasswordResetResponse changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        
        return PasswordResetResponse.builder()
                .success(true)
                .message("Password has been changed successfully")
                .build();
    }

    // Profile Methods
    @Transactional(readOnly = true)
    public UserProfileDTO getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return toProfileDTO(user);
    }

    @Transactional
    public UserProfileDTO updateProfile(Long userId, UserProfileDTO profileDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update user fields
        if (profileDTO.getFirstName() != null) {
            user.setFirstName(profileDTO.getFirstName());
        }
        if (profileDTO.getLastName() != null) {
            user.setLastName(profileDTO.getLastName());
        }
        
        userRepository.save(user);
        
        // Update linked Doctor/Patient records
        if (user.getDoctorId() != null) {
            updateDoctorProfile(user.getDoctorId(), profileDTO);
        }
        if (user.getPatientId() != null) {
            updatePatientProfile(user.getPatientId(), profileDTO);
        }
        
        return toProfileDTO(user);
    }

    private void updateDoctorProfile(Long doctorId, UserProfileDTO dto) {
        doctorRepository.findById(doctorId).ifPresent(doctor -> {
            if (dto.getFirstName() != null) doctor.setFirstName(dto.getFirstName());
            if (dto.getLastName() != null) doctor.setLastName(dto.getLastName());
            if (dto.getPhone() != null) doctor.setPhone(dto.getPhone());
            if (dto.getSpecialization() != null) doctor.setSpecialization(dto.getSpecialization());
            if (dto.getLicenseNumber() != null) doctor.setLicenseNumber(dto.getLicenseNumber());
            if (dto.getConsultationFee() != null) doctor.setConsultationFee(dto.getConsultationFee());
            if (dto.getYearsOfExperience() != null) doctor.setYearsOfExperience(dto.getYearsOfExperience());
            doctorRepository.save(doctor);
        });
    }

    private void updatePatientProfile(Long patientId, UserProfileDTO dto) {
        patientRepository.findById(patientId).ifPresent(patient -> {
            if (dto.getFirstName() != null) patient.setFirstName(dto.getFirstName());
            if (dto.getLastName() != null) patient.setLastName(dto.getLastName());
            if (dto.getPhone() != null) patient.setPhone(dto.getPhone());
            if (dto.getAddress() != null) patient.setAddress(dto.getAddress());
            if (dto.getGender() != null) patient.setGender(dto.getGender());
            if (dto.getBloodType() != null) patient.setBloodType(dto.getBloodType());
            if (dto.getEmergencyContact() != null) patient.setEmergencyContact(dto.getEmergencyContact());
            if (dto.getEmergencyPhone() != null) patient.setEmergencyPhone(dto.getEmergencyPhone());
            patientRepository.save(patient);
        });
    }

    private UserProfileDTO toProfileDTO(User user) {
        UserProfileDTO.UserProfileDTOBuilder builder = UserProfileDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .role(user.getRole().name())
                .doctorId(user.getDoctorId())
                .patientId(user.getPatientId())
                .createdAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : null)
                .isActive(user.getIsActive());

        // Add doctor-specific fields
        if (user.getDoctorId() != null) {
            doctorRepository.findById(user.getDoctorId()).ifPresent(doctor -> {
                builder.phone(doctor.getPhone())
                        .specialization(doctor.getSpecialization())
                        .licenseNumber(doctor.getLicenseNumber())
                        .consultationFee(doctor.getConsultationFee())
                        .yearsOfExperience(doctor.getYearsOfExperience())
                        .departmentName(doctor.getDepartment() != null ? 
                                doctor.getDepartment().getName() : null);
            });
        }

        // Add patient-specific fields
        if (user.getPatientId() != null) {
            patientRepository.findById(user.getPatientId()).ifPresent(patient -> {
                builder.phone(patient.getPhone())
                        .dateOfBirth(patient.getDateOfBirth() != null ? 
                                patient.getDateOfBirth().toString() : null)
                        .gender(patient.getGender())
                        .bloodType(patient.getBloodType())
                        .address(patient.getAddress())
                        .emergencyContact(patient.getEmergencyContact())
                        .emergencyPhone(patient.getEmergencyPhone());
            });
        }

        return builder.build();
    }
}
