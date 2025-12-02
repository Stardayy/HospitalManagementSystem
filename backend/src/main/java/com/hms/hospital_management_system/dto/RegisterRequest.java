package com.hms.hospital_management_system.dto;

import com.hms.hospital_management_system.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private User.Role role;
    private Long doctorId;
    private Long patientId;
}
