package com.hms.hospital_management_system.service;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hms.hospital_management_system.dto.DashboardStats;
import com.hms.hospital_management_system.dto.DashboardStats.*;
import com.hms.hospital_management_system.entity.Appointment;
import com.hms.hospital_management_system.entity.Bill;
import com.hms.hospital_management_system.entity.Doctor;
import com.hms.hospital_management_system.entity.Patient;
import com.hms.hospital_management_system.entity.Room;
import com.hms.hospital_management_system.repository.AppointmentRepository;
import com.hms.hospital_management_system.repository.BillRepository;
import com.hms.hospital_management_system.repository.DepartmentRepository;
import com.hms.hospital_management_system.repository.DoctorRepository;
import com.hms.hospital_management_system.repository.MedicineRepository;
import com.hms.hospital_management_system.repository.PatientRepository;
import com.hms.hospital_management_system.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;
    private final RoomRepository roomRepository;
    private final MedicineRepository medicineRepository;
    private final DepartmentRepository departmentRepository;

    public DashboardStats getDashboardStats() {
        LocalDate today = LocalDate.now();
        LocalDate weekAgo = today.minusDays(7);
        LocalDate twoWeeksAgo = today.minusDays(14);

        // Basic counts
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        long totalAppointments = appointmentRepository.count();
        long todayAppointments = appointmentRepository.findByAppointmentDate(today).size();
        long pendingBills = billRepository.findByPaymentStatus(Bill.PaymentStatus.PENDING).size();
        long availableRooms = roomRepository.findByStatus(Room.RoomStatus.AVAILABLE).size();
        
        // Low stock medicines (stock <= reorder level)
        long lowStockMedicines = medicineRepository.findAll().stream()
                .filter(m -> m.getStockQuantity() <= (m.getReorderLevel() != null ? m.getReorderLevel() : 10))
                .count();

        // Revenue calculation
        Double totalRevenue = billRepository.findByPaymentStatus(Bill.PaymentStatus.PAID).stream()
                .mapToDouble(b -> b.getNetAmount() != null ? b.getNetAmount() : 0.0)
                .sum();

        // Calculate trends (compare this week vs last week)
        long thisWeekPatients = patientRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null && p.getCreatedAt().toLocalDate().isAfter(weekAgo))
                .count();
        long lastWeekPatients = patientRepository.findAll().stream()
                .filter(p -> p.getCreatedAt() != null && 
                        p.getCreatedAt().toLocalDate().isAfter(twoWeeksAgo) && 
                        p.getCreatedAt().toLocalDate().isBefore(weekAgo.plusDays(1)))
                .count();
        double patientsTrend = lastWeekPatients > 0 ? 
                ((double)(thisWeekPatients - lastWeekPatients) / lastWeekPatients) * 100 : 0;

        // Patient overview (last 8 days)
        List<PatientOverviewData> patientOverview = getPatientOverview(today);

        // Revenue data (last 7 days)
        List<RevenueData> revenueData = getRevenueData(today);

        // Department distribution
        List<DepartmentData> departmentDistribution = getDepartmentDistribution();

        // Appointments by status
        List<AppointmentStatusData> appointmentsByStatus = getAppointmentsByStatus();

        // Recent appointments
        List<RecentAppointment> recentAppointments = getRecentAppointments();

        // Doctor schedules for today
        List<DoctorScheduleInfo> doctorSchedules = getDoctorSchedules(today);

        return DashboardStats.builder()
                .totalPatients(totalPatients)
                .totalDoctors(totalDoctors)
                .totalAppointments(totalAppointments)
                .todayAppointments(todayAppointments)
                .pendingBills(pendingBills)
                .totalRevenue(totalRevenue)
                .availableRooms(availableRooms)
                .lowStockMedicines(lowStockMedicines)
                .patientsTrend(patientsTrend)
                .appointmentsTrend(0.0)
                .revenueTrend(0.0)
                .patientOverview(patientOverview)
                .revenueData(revenueData)
                .departmentDistribution(departmentDistribution)
                .appointmentsByStatus(appointmentsByStatus)
                .recentAppointments(recentAppointments)
                .doctorSchedules(doctorSchedules)
                .build();
    }

    private List<PatientOverviewData> getPatientOverview(LocalDate today) {
        List<PatientOverviewData> overview = new ArrayList<>();

        for (int i = 7; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.getDayOfWeek().toString().substring(0, 3);
            
            // Count patients by age group who had appointments on this day
            List<Appointment> dayAppointments = appointmentRepository.findByAppointmentDate(date);
            
            long child = 0, adult = 0, elderly = 0;
            for (Appointment apt : dayAppointments) {
                Patient patient = apt.getPatient();
                if (patient != null && patient.getDateOfBirth() != null) {
                    int age = Period.between(patient.getDateOfBirth(), today).getYears();
                    if (age < 18) child++;
                    else if (age < 60) adult++;
                    else elderly++;
                } else {
                    adult++; // Default to adult if no DOB
                }
            }
            
            overview.add(PatientOverviewData.builder()
                    .date(dateStr)
                    .child(child)
                    .adult(adult)
                    .elderly(elderly)
                    .build());
        }
        return overview;
    }

    private List<RevenueData> getRevenueData(LocalDate today) {
        List<RevenueData> revenueList = new ArrayList<>();
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.getDayOfWeek().toString().substring(0, 3);
            
            double income = billRepository.findAll().stream()
                    .filter(b -> b.getBillDate() != null && b.getBillDate().equals(date) 
                            && b.getPaymentStatus() == Bill.PaymentStatus.PAID)
                    .mapToDouble(b -> b.getNetAmount() != null ? b.getNetAmount() : 0.0)
                    .sum();
            
            // Expense can be calculated from medicine purchases, etc.
            // For now, estimate as percentage of income
            double expense = income * 0.3;
            
            revenueList.add(RevenueData.builder()
                    .date(dateStr)
                    .income(income)
                    .expense(expense)
                    .build());
        }
        return revenueList;
    }

    private List<DepartmentData> getDepartmentDistribution() {
        String[] colors = {"#6ee7b7", "#1f2937", "#e5e7eb", "#3b82f6", "#ef4444", "#f59e0b"};
        List<Doctor> allDoctors = doctorRepository.findAll();
        long totalDoctors = allDoctors.size();
        
        Map<String, Long> deptCounts = allDoctors.stream()
                .filter(d -> d.getDepartment() != null)
                .collect(Collectors.groupingBy(
                        d -> d.getDepartment().getName(),
                        Collectors.counting()
                ));
        
        List<DepartmentData> result = new ArrayList<>();
        int colorIndex = 0;
        for (Map.Entry<String, Long> entry : deptCounts.entrySet()) {
            double percentage = totalDoctors > 0 ? (entry.getValue() * 100.0 / totalDoctors) : 0;
            result.add(DepartmentData.builder()
                    .name(entry.getKey())
                    .count(entry.getValue())
                    .percentage(Math.round(percentage * 10.0) / 10.0)
                    .color(colors[colorIndex % colors.length])
                    .build());
            colorIndex++;
        }
        return result;
    }

    private List<AppointmentStatusData> getAppointmentsByStatus() {
        List<Appointment> allAppointments = appointmentRepository.findAll();
        
        return allAppointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus() != null ? a.getStatus().name() : "UNKNOWN",
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> AppointmentStatusData.builder()
                        .status(e.getKey())
                        .count(e.getValue())
                        .build())
                .collect(Collectors.toList());
    }

    private List<RecentAppointment> getRecentAppointments() {
        return appointmentRepository.findAll().stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(5)
                .map(a -> RecentAppointment.builder()
                        .id(a.getId())
                        .patientName(a.getPatient() != null ? 
                                a.getPatient().getFirstName() + " " + a.getPatient().getLastName() : "N/A")
                        .doctorName(a.getDoctor() != null ? 
                                "Dr. " + a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName() : "N/A")
                        .date(a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : "N/A")
                        .time(a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : "N/A")
                        .status(a.getStatus() != null ? a.getStatus().name() : "N/A")
                        .build())
                .collect(Collectors.toList());
    }

    private List<DoctorScheduleInfo> getDoctorSchedules(LocalDate today) {
        List<Appointment> todayAppointments = appointmentRepository.findByAppointmentDate(today);
        
        Map<Long, Long> appointmentsByDoctor = todayAppointments.stream()
                .filter(a -> a.getDoctor() != null)
                .collect(Collectors.groupingBy(
                        a -> a.getDoctor().getId(),
                        Collectors.counting()
                ));
        
        return doctorRepository.findAll().stream()
                .limit(5)
                .map(d -> {
                    long apptCount = appointmentsByDoctor.getOrDefault(d.getId(), 0L);
                    String status = apptCount > 0 ? "Available" : "Unavailable";
                    
                    return DoctorScheduleInfo.builder()
                            .id(d.getId())
                            .name("Dr. " + d.getFirstName() + " " + d.getLastName())
                            .specialization(d.getSpecialization())
                            .status(status)
                            .appointmentsToday(apptCount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Get dashboard stats filtered for a specific doctor
     */
    public DashboardStats getDashboardStatsForDoctor(Long doctorId) {
        LocalDate today = LocalDate.now();

        // Get doctor's appointments
        List<Appointment> doctorAppointments = appointmentRepository.findByDoctorId(doctorId);
        List<Appointment> todayDoctorAppointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctorId, today);
        
        // Count unique patients for this doctor
        long myPatients = doctorAppointments.stream()
                .map(a -> a.getPatient().getId())
                .distinct()
                .count();
        
        long myTotalAppointments = doctorAppointments.size();
        long myTodayAppointments = todayDoctorAppointments.size();

        // Recent appointments for this doctor
        List<RecentAppointment> recentAppointments = doctorAppointments.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(5)
                .map(a -> RecentAppointment.builder()
                        .id(a.getId())
                        .patientName(a.getPatient() != null ? 
                                a.getPatient().getFirstName() + " " + a.getPatient().getLastName() : "N/A")
                        .doctorName(a.getDoctor() != null ? 
                                "Dr. " + a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName() : "N/A")
                        .date(a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : "N/A")
                        .time(a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : "N/A")
                        .status(a.getStatus() != null ? a.getStatus().name() : "N/A")
                        .build())
                .collect(Collectors.toList());

        // Appointments by status for this doctor
        List<AppointmentStatusData> appointmentsByStatus = doctorAppointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus() != null ? a.getStatus().name() : "UNKNOWN",
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> AppointmentStatusData.builder()
                        .status(e.getKey())
                        .count(e.getValue())
                        .build())
                .collect(Collectors.toList());

        // Doctor's own schedule info
        Doctor doctor = doctorRepository.findById(doctorId).orElse(null);
        List<DoctorScheduleInfo> doctorSchedules = new ArrayList<>();
        if (doctor != null) {
            doctorSchedules.add(DoctorScheduleInfo.builder()
                    .id(doctor.getId())
                    .name("Dr. " + doctor.getFirstName() + " " + doctor.getLastName())
                    .specialization(doctor.getSpecialization())
                    .status("Available")
                    .appointmentsToday((long) todayDoctorAppointments.size())
                    .build());
        }

        return DashboardStats.builder()
                .totalPatients(myPatients)
                .totalDoctors(1L) // Only showing this doctor
                .totalAppointments(myTotalAppointments)
                .todayAppointments(myTodayAppointments)
                .pendingBills(0L)
                .totalRevenue(0.0)
                .availableRooms(0L)
                .lowStockMedicines(0L)
                .patientsTrend(0.0)
                .appointmentsTrend(0.0)
                .revenueTrend(0.0)
                .patientOverview(new ArrayList<>())
                .revenueData(new ArrayList<>())
                .departmentDistribution(new ArrayList<>())
                .appointmentsByStatus(appointmentsByStatus)
                .recentAppointments(recentAppointments)
                .doctorSchedules(doctorSchedules)
                .build();
    }

    /**
     * Get dashboard stats filtered for a specific patient
     */
    public DashboardStats getDashboardStatsForPatient(Long patientId) {
        LocalDate today = LocalDate.now();

        // Get patient's appointments
        List<Appointment> patientAppointments = appointmentRepository.findByPatientId(patientId);
        List<Appointment> todayPatientAppointments = patientAppointments.stream()
                .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().equals(today))
                .collect(Collectors.toList());
        
        long myTotalAppointments = patientAppointments.size();
        long myTodayAppointments = todayPatientAppointments.size();

        // Count unique doctors this patient has seen
        long myDoctors = patientAppointments.stream()
                .filter(a -> a.getDoctor() != null)
                .map(a -> a.getDoctor().getId())
                .distinct()
                .count();

        // Get pending bills for this patient
        long myPendingBills = billRepository.findByPatientIdAndPaymentStatus(patientId, Bill.PaymentStatus.PENDING).size();

        // Recent appointments for this patient
        List<RecentAppointment> recentAppointments = patientAppointments.stream()
                .sorted((a, b) -> {
                    if (a.getCreatedAt() == null) return 1;
                    if (b.getCreatedAt() == null) return -1;
                    return b.getCreatedAt().compareTo(a.getCreatedAt());
                })
                .limit(5)
                .map(a -> RecentAppointment.builder()
                        .id(a.getId())
                        .patientName(a.getPatient() != null ? 
                                a.getPatient().getFirstName() + " " + a.getPatient().getLastName() : "N/A")
                        .doctorName(a.getDoctor() != null ? 
                                "Dr. " + a.getDoctor().getFirstName() + " " + a.getDoctor().getLastName() : "N/A")
                        .date(a.getAppointmentDate() != null ? a.getAppointmentDate().toString() : "N/A")
                        .time(a.getAppointmentTime() != null ? a.getAppointmentTime().toString() : "N/A")
                        .status(a.getStatus() != null ? a.getStatus().name() : "N/A")
                        .build())
                .collect(Collectors.toList());

        // Appointments by status for this patient
        List<AppointmentStatusData> appointmentsByStatus = patientAppointments.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStatus() != null ? a.getStatus().name() : "UNKNOWN",
                        Collectors.counting()
                ))
                .entrySet().stream()
                .map(e -> AppointmentStatusData.builder()
                        .status(e.getKey())
                        .count(e.getValue())
                        .build())
                .collect(Collectors.toList());

        return DashboardStats.builder()
                .totalPatients(1L) // Just this patient
                .totalDoctors(myDoctors)
                .totalAppointments(myTotalAppointments)
                .todayAppointments(myTodayAppointments)
                .pendingBills(myPendingBills)
                .totalRevenue(0.0)
                .availableRooms(0L)
                .lowStockMedicines(0L)
                .patientsTrend(0.0)
                .appointmentsTrend(0.0)
                .revenueTrend(0.0)
                .patientOverview(new ArrayList<>())
                .revenueData(new ArrayList<>())
                .departmentDistribution(new ArrayList<>())
                .appointmentsByStatus(appointmentsByStatus)
                .recentAppointments(recentAppointments)
                .doctorSchedules(new ArrayList<>())
                .build();
    }
}
