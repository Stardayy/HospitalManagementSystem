package com.hms.hospital_management_system.config;

import java.util.Optional;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hms.hospital_management_system.entity.User;
import com.hms.hospital_management_system.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create or update default admin user
        createOrUpdateUser("admin@hospital.com", "admin123", "Admin", "User", User.Role.ADMIN, null, null);
        
        // Create or update default doctor user
        createOrUpdateUser("doctor@hospital.com", "doctor123", "Dr. William", "Chen", User.Role.DOCTOR, 1L, null);
        
        // Create or update default patient user
        createOrUpdateUser("patient@hospital.com", "patient123", "John", "Smith", User.Role.PATIENT, null, 1L);
    }

    private void createOrUpdateUser(String email, String password, String firstName, String lastName, 
                                     User.Role role, Long doctorId, Long patientId) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            // Update existing user's password
            User user = existingUser.get();
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            log.info("Updated password for user: {}", email);
        } else {
            // Create new user
            User user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .firstName(firstName)
                    .lastName(lastName)
                    .role(role)
                    .doctorId(doctorId)
                    .patientId(patientId)
                    .isActive(true)
                    .build();
            userRepository.save(user);
            log.info("Created default user: {}", email);
        }
    }
}
