package com.hms.hospital_management_system.service;

import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.entity.Department;
import com.hms.hospital_management_system.repository.DoctorRepository;
import com.hms.hospital_management_system.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public Optional<Doctor> getDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    public Doctor createDoctor(Doctor doctor) {
        if (doctor.getEmail() != null && doctorRepository.existsByEmail(doctor.getEmail())) {
            throw new RuntimeException("Doctor with email " + doctor.getEmail() + " already exists");
        }
        if (doctor.getLicenseNumber() != null && doctorRepository.existsByLicenseNumber(doctor.getLicenseNumber())) {
            throw new RuntimeException("Doctor with license number " + doctor.getLicenseNumber() + " already exists");
        }
        return doctorRepository.save(doctor);
    }

    public Doctor createDoctorWithDepartment(Doctor doctor, Long departmentId) {
        if (departmentId != null) {
            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
            doctor.setDepartment(department);
        }
        return createDoctor(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));

        doctor.setFirstName(doctorDetails.getFirstName());
        doctor.setLastName(doctorDetails.getLastName());
        doctor.setSpecialization(doctorDetails.getSpecialization());
        doctor.setPhone(doctorDetails.getPhone());
        doctor.setEmail(doctorDetails.getEmail());
        doctor.setLicenseNumber(doctorDetails.getLicenseNumber());
        doctor.setConsultationFee(doctorDetails.getConsultationFee());
        doctor.setYearsOfExperience(doctorDetails.getYearsOfExperience());

        return doctorRepository.save(doctor);
    }

    public Doctor assignDepartment(Long doctorId, Long departmentId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + departmentId));
        
        doctor.setDepartment(department);
        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {
        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException("Doctor not found with id: " + id);
        }
        doctorRepository.deleteById(id);
    }

    public List<Doctor> getDoctorsByDepartment(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId);
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    public List<Doctor> searchDoctorsByName(String name) {
        return doctorRepository.searchByName(name);
    }
}
