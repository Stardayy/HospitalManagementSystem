package com.hms.hospital_management_system.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "admin123";
        String encoded = encoder.encode(password);
        System.out.println("Password: " + password);
        System.out.println("BCrypt Hash: " + encoded);
        System.out.println("Matches test: " + encoder.matches(password, encoded));
    }
}
