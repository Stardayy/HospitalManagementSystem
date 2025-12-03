package com.hms.hospital_management_system.service;

import com.hms.hospital_management_system.entity.Appointment;
import com.hms.hospital_management_system.entity.Appointment.AppointmentStatus;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.repository.AppointmentRepository;
import com.hms.hospital_management_system.repository.PatientRepository;
import com.hms.hospital_management_system.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment, Long patientId, Long doctorId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + patientId));
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + doctorId));

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(Long id, Appointment appointmentDetails) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));

        appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
        appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
        appointment.setStatus(appointmentDetails.getStatus());
        appointment.setReason(appointmentDetails.getReason());
        appointment.setNotes(appointmentDetails.getNotes());

        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointmentStatus(Long id, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + id));
        
        appointment.setStatus(status);
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new RuntimeException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    public List<Appointment> getAppointmentsByPatient(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    public List<Appointment> getAppointmentsByStatus(AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    public List<Appointment> getAppointmentsByDoctorAndDate(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, date);
    }

    public List<Appointment> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        return appointmentRepository.findByDateRange(startDate, endDate);
    }

    public List<Appointment> getTodaysAppointments() {
        return appointmentRepository.findByAppointmentDate(LocalDate.now());
    }

    public List<Appointment> filterAppointments(AppointmentStatus status, Long doctorId, Long patientId, 
            LocalDate startDate, LocalDate endDate, String sortBy, String sortOrder) {
        List<Appointment> appointments = appointmentRepository.findAll();
        
        List<Appointment> filtered = appointments.stream()
            .filter(a -> status == null || a.getStatus() == status)
            .filter(a -> doctorId == null || (a.getDoctor() != null && a.getDoctor().getId().equals(doctorId)))
            .filter(a -> patientId == null || (a.getPatient() != null && a.getPatient().getId().equals(patientId)))
            .filter(a -> startDate == null || (a.getAppointmentDate() != null && !a.getAppointmentDate().isBefore(startDate)))
            .filter(a -> endDate == null || (a.getAppointmentDate() != null && !a.getAppointmentDate().isAfter(endDate)))
            .toList();

        if (sortBy != null && !sortBy.isEmpty()) {
            Comparator<Appointment> comparator = getAppointmentComparator(sortBy);
            if (comparator != null) {
                if ("desc".equalsIgnoreCase(sortOrder)) {
                    comparator = comparator.reversed();
                }
                filtered = filtered.stream().sorted(comparator).toList();
            }
        }
        
        return filtered;
    }

    private Comparator<Appointment> getAppointmentComparator(String sortBy) {
        return switch (sortBy) {
            case "date" -> Comparator.comparing(Appointment::getAppointmentDate, Comparator.nullsLast(Comparator.naturalOrder()));
            case "time" -> Comparator.comparing(Appointment::getAppointmentTime, Comparator.nullsLast(Comparator.naturalOrder()));
            case "patient" -> Comparator.comparing(a -> a.getPatient() != null ? a.getPatient().getFirstName() : "", Comparator.nullsLast(Comparator.naturalOrder()));
            case "doctor" -> Comparator.comparing(a -> a.getDoctor() != null ? a.getDoctor().getFirstName() : "", Comparator.nullsLast(Comparator.naturalOrder()));
            case "status" -> Comparator.comparing(a -> a.getStatus() != null ? a.getStatus().name() : "", Comparator.nullsLast(Comparator.naturalOrder()));
            case "createdAt" -> Comparator.comparing(Appointment::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder()));
            default -> null;
        };
    }
}
