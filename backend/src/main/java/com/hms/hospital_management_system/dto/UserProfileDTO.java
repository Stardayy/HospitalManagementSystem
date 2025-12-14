package com.hms.hospital_management_system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {
    
    private Long id;
    
    @Email(message = "Please provide a valid email address")
    private String email;
    
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;
    
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;
    
    private String role;
    private String phone;
    private Long doctorId;
    private Long patientId;
    
    // For doctors
    private String specialization;
    private String licenseNumber;
    private String departmentName;
    private Double consultationFee;
    private Integer yearsOfExperience;
    
    // For patients
    private String dateOfBirth;
    private String gender;
    private String bloodType;
    private String address;
    private String emergencyContact;
    private String emergencyPhone;
    
    private String createdAt;
    private Boolean isActive;
}
