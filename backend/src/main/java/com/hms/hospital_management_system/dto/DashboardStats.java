package com.hms.hospital_management_system.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    
    // Summary counts
    private Long totalPatients;
    private Long totalDoctors;
    private Long totalAppointments;
    private Long todayAppointments;
    private Long pendingBills;
    private Double totalRevenue;
    private Long availableRooms;
    private Long lowStockMedicines;
    
    // Trend data (percentage change from last period)
    private Double patientsTrend;
    private Double appointmentsTrend;
    private Double revenueTrend;
    
    // Chart data
    private List<PatientOverviewData> patientOverview;
    private List<RevenueData> revenueData;
    private List<DepartmentData> departmentDistribution;
    private List<AppointmentStatusData> appointmentsByStatus;
    
    // Recent items
    private List<RecentAppointment> recentAppointments;
    private List<DoctorScheduleInfo> doctorSchedules;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatientOverviewData {
        private String date;
        private Long child;
        private Long adult;
        private Long elderly;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RevenueData {
        private String date;
        private Double income;
        private Double expense;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentData {
        private String name;
        private Long count;
        private Double percentage;
        private String color;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AppointmentStatusData {
        private String status;
        private Long count;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentAppointment {
        private Long id;
        private String patientName;
        private String doctorName;
        private String date;
        private String time;
        private String status;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DoctorScheduleInfo {
        private Long id;
        private String name;
        private String specialization;
        private String status;
        private Long appointmentsToday;
    }
}
