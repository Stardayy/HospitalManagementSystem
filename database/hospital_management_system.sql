-- =============================================
-- Hospital Management System - MySQL Database
-- =============================================
-- Author: Hospital Management System Team
-- Date: November 30, 2025
-- Description: Complete database schema with sample data
-- =============================================

-- Create and use the database
DROP DATABASE IF EXISTS hospital_management_system;
CREATE DATABASE hospital_management_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hospital_management_system;

-- =============================================
-- TABLE: department
-- =============================================
CREATE TABLE department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    location VARCHAR(100),
    phone VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_department_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: patient
-- =============================================
CREATE TABLE patient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(10),
    phone VARCHAR(15),
    email VARCHAR(100),
    address VARCHAR(255),
    blood_type VARCHAR(5),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_patient_name (first_name, last_name),
    INDEX idx_patient_email (email),
    INDEX idx_patient_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: doctor
-- =============================================
CREATE TABLE doctor (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100),
    phone VARCHAR(15),
    email VARCHAR(100),
    license_number VARCHAR(50),
    department_id BIGINT,
    consultation_fee DECIMAL(10, 2),
    years_of_experience INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_doctor_name (first_name, last_name),
    INDEX idx_doctor_specialization (specialization),
    INDEX idx_doctor_department (department_id),
    
    CONSTRAINT fk_doctor_department 
        FOREIGN KEY (department_id) REFERENCES department(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: appointment
-- =============================================
CREATE TABLE appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW') DEFAULT 'SCHEDULED',
    reason VARCHAR(500),
    notes VARCHAR(1000),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_appointment_patient (patient_id),
    INDEX idx_appointment_doctor (doctor_id),
    INDEX idx_appointment_status (status),
    
    CONSTRAINT fk_appointment_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_appointment_doctor 
        FOREIGN KEY (doctor_id) REFERENCES doctor(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: bill
-- =============================================
CREATE TABLE bill (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    bill_date DATE NOT NULL,
    consultation_fee DECIMAL(10, 2) DEFAULT 0.00,
    medicine_cost DECIMAL(10, 2) DEFAULT 0.00,
    room_charges DECIMAL(10, 2) DEFAULT 0.00,
    lab_charges DECIMAL(10, 2) DEFAULT 0.00,
    other_charges DECIMAL(10, 2) DEFAULT 0.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0.00,
    tax DECIMAL(10, 2) DEFAULT 0.00,
    net_amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('PENDING', 'PARTIAL', 'PAID', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    payment_method ENUM('CASH', 'CREDIT_CARD', 'DEBIT_CARD', 'INSURANCE', 'BANK_TRANSFER'),
    payment_date DATE,
    notes VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_bill_patient (patient_id),
    INDEX idx_bill_date (bill_date),
    INDEX idx_bill_status (payment_status),
    
    CONSTRAINT fk_bill_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: medicine
-- =============================================
CREATE TABLE medicine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    generic_name VARCHAR(100),
    manufacturer VARCHAR(100),
    description VARCHAR(500),
    dosage_form VARCHAR(50),
    strength VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    expiry_date DATE,
    reorder_level INT DEFAULT 10,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_medicine_name (name),
    INDEX idx_medicine_generic (generic_name),
    INDEX idx_medicine_manufacturer (manufacturer),
    INDEX idx_medicine_expiry (expiry_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: room
-- =============================================
CREATE TABLE room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    room_type ENUM('GENERAL', 'PRIVATE', 'ICU', 'EMERGENCY', 'OPERATION', 'RECOVERY') NOT NULL,
    floor_number INT,
    bed_count INT DEFAULT 1,
    daily_rate DECIMAL(10, 2),
    status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED') DEFAULT 'AVAILABLE',
    department_id BIGINT,
    facilities VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_room_number (room_number),
    INDEX idx_room_type (room_type),
    INDEX idx_room_status (status),
    INDEX idx_room_department (department_id),
    
    CONSTRAINT fk_room_department 
        FOREIGN KEY (department_id) REFERENCES department(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: medical_record
-- =============================================
CREATE TABLE medical_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    record_date DATE NOT NULL,
    diagnosis VARCHAR(500),
    symptoms VARCHAR(1000),
    treatment VARCHAR(1000),
    prescription VARCHAR(1000),
    follow_up_date DATE,
    notes VARCHAR(2000),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_record_patient (patient_id),
    INDEX idx_record_doctor (doctor_id),
    INDEX idx_record_date (record_date),
    
    CONSTRAINT fk_record_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_record_doctor 
        FOREIGN KEY (doctor_id) REFERENCES doctor(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: users (for authentication)
-- =============================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'PATIENT') NOT NULL,
    doctor_id BIGINT,
    patient_id BIGINT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    
    CONSTRAINT fk_users_doctor 
        FOREIGN KEY (doctor_id) REFERENCES doctor(id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_users_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERT SAMPLE DATA: Departments
-- =============================================
INSERT INTO department (name, description, location, phone) VALUES
('Cardiology', 'Heart and cardiovascular diseases treatment', 'Building A, Floor 2', '555-0101'),
('Neurology', 'Brain and nervous system disorders', 'Building A, Floor 3', '555-0102'),
('Orthopedics', 'Bone and joint treatment', 'Building B, Floor 1', '555-0103'),
('Pediatrics', 'Children healthcare services', 'Building C, Floor 1', '555-0104'),
('Emergency', '24/7 Emergency medical services', 'Building A, Ground Floor', '555-0105'),
('Dermatology', 'Skin diseases and treatments', 'Building B, Floor 2', '555-0106'),
('Ophthalmology', 'Eye care and vision services', 'Building C, Floor 2', '555-0107'),
('Oncology', 'Cancer diagnosis and treatment', 'Building D, Floor 1', '555-0108'),
('Gynecology', 'Women health services', 'Building D, Floor 2', '555-0109'),
('Psychiatry', 'Mental health services', 'Building E, Floor 1', '555-0110');

-- =============================================
-- INSERT SAMPLE DATA: Patients
-- =============================================
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, blood_type, emergency_contact, emergency_phone) VALUES
('John', 'Smith', '1985-03-15', 'Male', '555-1001', 'john.smith@email.com', '123 Main St, New York, NY 10001', 'A+', 'Jane Smith', '555-1002'),
('Emily', 'Johnson', '1990-07-22', 'Female', '555-1003', 'emily.j@email.com', '456 Oak Ave, Los Angeles, CA 90001', 'B+', 'Michael Johnson', '555-1004'),
('Robert', 'Williams', '1978-11-08', 'Male', '555-1005', 'r.williams@email.com', '789 Pine Rd, Chicago, IL 60601', 'O-', 'Sarah Williams', '555-1006'),
('Maria', 'Garcia', '1995-01-30', 'Female', '555-1007', 'maria.g@email.com', '321 Elm St, Houston, TX 77001', 'AB+', 'Carlos Garcia', '555-1008'),
('David', 'Brown', '1982-09-12', 'Male', '555-1009', 'david.brown@email.com', '654 Maple Dr, Phoenix, AZ 85001', 'A-', 'Lisa Brown', '555-1010'),
('Jennifer', 'Davis', '1988-05-25', 'Female', '555-1011', 'jen.davis@email.com', '987 Cedar Ln, Philadelphia, PA 19101', 'B-', 'Mark Davis', '555-1012'),
('Michael', 'Miller', '1975-12-03', 'Male', '555-1013', 'mike.miller@email.com', '147 Birch Blvd, San Antonio, TX 78201', 'O+', 'Nancy Miller', '555-1014'),
('Sarah', 'Wilson', '1992-08-17', 'Female', '555-1015', 's.wilson@email.com', '258 Spruce Way, San Diego, CA 92101', 'AB-', 'Tom Wilson', '555-1016'),
('James', 'Anderson', '1980-04-28', 'Male', '555-1017', 'james.a@email.com', '369 Walnut Ave, Dallas, TX 75201', 'A+', 'Emma Anderson', '555-1018'),
('Jessica', 'Taylor', '1998-02-14', 'Female', '555-1019', 'jessica.t@email.com', '741 Chestnut St, San Jose, CA 95101', 'B+', 'Chris Taylor', '555-1020'),
('William', 'Thomas', '1970-06-20', 'Male', '555-1021', 'w.thomas@email.com', '852 Poplar Ave, Austin, TX 78701', 'O+', 'Patricia Thomas', '555-1022'),
('Ashley', 'Jackson', '1993-09-05', 'Female', '555-1023', 'ashley.j@email.com', '963 Willow St, Jacksonville, FL 32099', 'A-', 'Brandon Jackson', '555-1024'),
('Christopher', 'White', '1987-01-18', 'Male', '555-1025', 'chris.w@email.com', '159 Ash Dr, San Francisco, CA 94101', 'B+', 'Amanda White', '555-1026'),
('Amanda', 'Harris', '1991-11-30', 'Female', '555-1027', 'amanda.h@email.com', '357 Hickory Ln, Columbus, OH 43085', 'AB+', 'Kevin Harris', '555-1028'),
('Daniel', 'Martin', '1984-07-07', 'Male', '555-1029', 'daniel.m@email.com', '486 Sycamore Rd, Fort Worth, TX 76101', 'O-', 'Rachel Martin', '555-1030');

-- =============================================
-- INSERT SAMPLE DATA: Doctors
-- =============================================
INSERT INTO doctor (first_name, last_name, specialization, phone, email, license_number, department_id, consultation_fee, years_of_experience) VALUES
('William', 'Chen', 'Cardiology', '555-2001', 'w.chen@hospital.com', 'MD-2001-CA', 1, 150.00, 15),
('Susan', 'Martinez', 'Neurology', '555-2002', 's.martinez@hospital.com', 'MD-2002-NY', 2, 175.00, 12),
('Richard', 'Lee', 'Orthopedics', '555-2003', 'r.lee@hospital.com', 'MD-2003-TX', 3, 160.00, 10),
('Amanda', 'Thompson', 'Pediatrics', '555-2004', 'a.thompson@hospital.com', 'MD-2004-FL', 4, 120.00, 8),
('Christopher', 'White', 'Emergency Medicine', '555-2005', 'c.white@hospital.com', 'MD-2005-IL', 5, 200.00, 18),
('Elizabeth', 'Harris', 'Dermatology', '555-2006', 'e.harris@hospital.com', 'MD-2006-AZ', 6, 130.00, 7),
('Daniel', 'Clark', 'Ophthalmology', '555-2007', 'd.clark@hospital.com', 'MD-2007-PA', 7, 140.00, 9),
('Michelle', 'Lewis', 'Oncology', '555-2008', 'm.lewis@hospital.com', 'MD-2008-WA', 8, 180.00, 14),
('Joseph', 'Walker', 'Cardiology', '555-2009', 'j.walker@hospital.com', 'MD-2009-MA', 1, 155.00, 11),
('Patricia', 'Hall', 'Neurology', '555-2010', 'p.hall@hospital.com', 'MD-2010-NJ', 2, 165.00, 13),
('Robert', 'Young', 'Gynecology', '555-2011', 'r.young@hospital.com', 'MD-2011-GA', 9, 145.00, 16),
('Jennifer', 'King', 'Psychiatry', '555-2012', 'j.king@hospital.com', 'MD-2012-NC', 10, 170.00, 11),
('Thomas', 'Wright', 'Orthopedics', '555-2013', 't.wright@hospital.com', 'MD-2013-MI', 3, 155.00, 9),
('Linda', 'Scott', 'Pediatrics', '555-2014', 'l.scott@hospital.com', 'MD-2014-OH', 4, 125.00, 6),
('Steven', 'Green', 'Emergency Medicine', '555-2015', 's.green@hospital.com', 'MD-2015-VA', 5, 195.00, 20);

-- =============================================
-- INSERT SAMPLE DATA: Appointments
-- =============================================
INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes) VALUES
(1, 1, '2025-12-01', '09:00:00', 'SCHEDULED', 'Annual heart checkup', 'Patient has family history of heart disease'),
(2, 2, '2025-12-01', '10:30:00', 'CONFIRMED', 'Recurring headaches', 'Experiencing migraines for 2 weeks'),
(3, 3, '2025-12-01', '14:00:00', 'SCHEDULED', 'Knee pain evaluation', 'Sports injury from last month'),
(4, 4, '2025-12-02', '09:30:00', 'CONFIRMED', 'Child vaccination', 'Regular immunization schedule'),
(5, 5, '2025-11-28', '11:00:00', 'COMPLETED', 'Emergency visit - chest pain', 'ECG performed, no abnormalities'),
(6, 6, '2025-11-29', '15:30:00', 'COMPLETED', 'Skin rash examination', 'Prescribed topical treatment'),
(7, 7, '2025-12-03', '08:30:00', 'SCHEDULED', 'Vision test', 'Annual eye examination'),
(8, 8, '2025-12-02', '13:00:00', 'CONFIRMED', 'Follow-up consultation', 'Post-treatment evaluation'),
(9, 9, '2025-12-04', '10:00:00', 'SCHEDULED', 'Cardiac stress test', 'Pre-surgery evaluation'),
(10, 10, '2025-11-30', '16:00:00', 'CANCELLED', 'Neurological consultation', 'Patient rescheduled'),
(1, 5, '2025-11-25', '12:00:00', 'COMPLETED', 'Follow-up after emergency visit', 'Recovery progressing well'),
(2, 1, '2025-12-05', '11:30:00', 'SCHEDULED', 'Heart palpitations', 'New symptom reported'),
(11, 11, '2025-12-03', '09:00:00', 'SCHEDULED', 'Annual gynecological exam', 'Routine checkup'),
(12, 12, '2025-12-04', '14:00:00', 'CONFIRMED', 'Anxiety consultation', 'First visit for mental health'),
(13, 13, '2025-12-05', '10:30:00', 'SCHEDULED', 'Back pain assessment', 'Chronic lower back pain'),
(14, 14, '2025-12-02', '11:00:00', 'CONFIRMED', 'Child wellness visit', '5-year checkup'),
(15, 15, '2025-11-29', '08:00:00', 'COMPLETED', 'Emergency - minor accident', 'Treated and discharged'),
(3, 1, '2025-12-06', '09:30:00', 'SCHEDULED', 'Cardiac evaluation', 'Referred by primary care'),
(4, 2, '2025-12-07', '15:00:00', 'SCHEDULED', 'Neurological assessment', 'Recurring dizziness'),
(5, 6, '2025-12-08', '11:30:00', 'SCHEDULED', 'Dermatology follow-up', 'Check treatment progress');

-- =============================================
-- INSERT SAMPLE DATA: Bills
-- =============================================
INSERT INTO bill (patient_id, bill_date, consultation_fee, medicine_cost, room_charges, lab_charges, other_charges, total_amount, discount, tax, net_amount, payment_status, payment_method, payment_date, notes) VALUES
(1, '2025-11-28', 150.00, 75.50, 0.00, 200.00, 25.00, 450.50, 0.00, 36.04, 486.54, 'PAID', 'CREDIT_CARD', '2025-11-28', 'Emergency visit charges'),
(2, '2025-11-29', 130.00, 45.00, 0.00, 0.00, 0.00, 175.00, 17.50, 12.60, 170.10, 'PAID', 'INSURANCE', '2025-11-30', 'Insurance claim processed'),
(3, '2025-11-27', 160.00, 0.00, 500.00, 150.00, 50.00, 860.00, 86.00, 61.92, 835.92, 'PARTIAL', 'BANK_TRANSFER', NULL, 'Payment plan: 3 installments'),
(4, '2025-11-26', 120.00, 85.00, 0.00, 0.00, 0.00, 205.00, 0.00, 16.40, 221.40, 'PAID', 'CASH', '2025-11-26', 'Vaccination and consultation'),
(5, '2025-11-25', 200.00, 150.00, 1000.00, 350.00, 100.00, 1800.00, 180.00, 129.60, 1749.60, 'PENDING', NULL, NULL, 'Insurance approval pending'),
(6, '2025-11-29', 130.00, 55.00, 0.00, 0.00, 0.00, 185.00, 0.00, 14.80, 199.80, 'PAID', 'DEBIT_CARD', '2025-11-29', 'Dermatology consultation'),
(7, '2025-11-24', 140.00, 0.00, 0.00, 100.00, 0.00, 240.00, 24.00, 17.28, 233.28, 'PAID', 'CREDIT_CARD', '2025-11-24', 'Eye examination with tests'),
(8, '2025-11-23', 180.00, 500.00, 2000.00, 800.00, 200.00, 3680.00, 368.00, 265.00, 3577.00, 'PARTIAL', 'INSURANCE', NULL, 'Oncology treatment - ongoing'),
(9, '2025-11-22', 155.00, 0.00, 0.00, 250.00, 0.00, 405.00, 40.50, 29.16, 393.66, 'PAID', 'INSURANCE', '2025-11-25', 'Cardiac tests'),
(10, '2025-11-20', 165.00, 120.00, 0.00, 180.00, 30.00, 495.00, 0.00, 39.60, 534.60, 'PENDING', NULL, NULL, 'Awaiting insurance verification'),
(11, '2025-11-28', 145.00, 60.00, 0.00, 0.00, 0.00, 205.00, 20.50, 14.76, 199.26, 'PAID', 'CASH', '2025-11-28', 'Routine exam'),
(12, '2025-11-27', 170.00, 80.00, 0.00, 0.00, 0.00, 250.00, 0.00, 20.00, 270.00, 'PAID', 'CREDIT_CARD', '2025-11-27', 'Mental health consultation'),
(15, '2025-11-29', 195.00, 45.00, 0.00, 75.00, 25.00, 340.00, 0.00, 27.20, 367.20, 'PAID', 'DEBIT_CARD', '2025-11-29', 'Emergency treatment');

-- =============================================
-- INSERT SAMPLE DATA: Medicines
-- =============================================
INSERT INTO medicine (name, generic_name, manufacturer, description, dosage_form, strength, price, stock_quantity, expiry_date, reorder_level) VALUES
('Amoxicillin', 'Amoxicillin', 'PharmaCorp', 'Antibiotic for bacterial infections', 'Capsule', '500mg', 15.99, 500, '2026-06-15', 100),
('Lisinopril', 'Lisinopril', 'MedPharm Inc', 'ACE inhibitor for blood pressure', 'Tablet', '10mg', 12.50, 350, '2026-12-31', 75),
('Metformin', 'Metformin HCl', 'DiabeteCare', 'Oral diabetes medicine', 'Tablet', '850mg', 8.99, 600, '2027-03-20', 150),
('Ibuprofen', 'Ibuprofen', 'PainRelief Labs', 'NSAID for pain and inflammation', 'Tablet', '400mg', 6.50, 800, '2026-08-10', 200),
('Omeprazole', 'Omeprazole', 'GastroHealth', 'Proton pump inhibitor', 'Capsule', '20mg', 18.75, 250, '2026-04-25', 50),
('Atorvastatin', 'Atorvastatin Calcium', 'HeartCare Pharma', 'Cholesterol lowering medication', 'Tablet', '20mg', 22.00, 400, '2027-01-15', 80),
('Amlodipine', 'Amlodipine Besylate', 'CardioMed', 'Calcium channel blocker', 'Tablet', '5mg', 14.25, 300, '2026-09-30', 60),
('Levothyroxine', 'Levothyroxine Sodium', 'ThyroidCare', 'Thyroid hormone replacement', 'Tablet', '50mcg', 11.00, 450, '2026-11-20', 100),
('Prednisone', 'Prednisone', 'ImmunoPharm', 'Corticosteroid anti-inflammatory', 'Tablet', '10mg', 9.50, 200, '2026-05-10', 40),
('Azithromycin', 'Azithromycin', 'AntiBioTech', 'Macrolide antibiotic', 'Tablet', '250mg', 25.00, 180, '2026-07-05', 35),
('Gabapentin', 'Gabapentin', 'NeuroCare', 'Anticonvulsant medication', 'Capsule', '300mg', 16.00, 280, '2026-10-15', 55),
('Aspirin', 'Acetylsalicylic Acid', 'BasicMed', 'Pain reliever and blood thinner', 'Tablet', '81mg', 4.99, 1000, '2027-06-30', 250),
('Ciprofloxacin', 'Ciprofloxacin', 'InfectioCure', 'Fluoroquinolone antibiotic', 'Tablet', '500mg', 19.99, 150, '2025-12-15', 30),
('Hydrochlorothiazide', 'Hydrochlorothiazide', 'DiuretiCare', 'Diuretic for hypertension', 'Tablet', '25mg', 7.50, 380, '2026-02-28', 75),
('Sertraline', 'Sertraline HCl', 'MentalHealth Pharma', 'SSRI antidepressant', 'Tablet', '50mg', 20.00, 220, '2026-08-20', 45),
('Metoprolol', 'Metoprolol Tartrate', 'CardioMed', 'Beta blocker for heart', 'Tablet', '50mg', 13.50, 320, '2026-11-15', 65),
('Pantoprazole', 'Pantoprazole Sodium', 'GastroHealth', 'Proton pump inhibitor', 'Tablet', '40mg', 17.25, 270, '2026-09-20', 55),
('Losartan', 'Losartan Potassium', 'HeartCare Pharma', 'ARB for hypertension', 'Tablet', '50mg', 15.75, 340, '2027-02-10', 70),
('Fluoxetine', 'Fluoxetine HCl', 'MentalHealth Pharma', 'SSRI antidepressant', 'Capsule', '20mg', 18.50, 190, '2026-07-25', 40),
('Cetirizine', 'Cetirizine HCl', 'AllergyFree', 'Antihistamine for allergies', 'Tablet', '10mg', 8.25, 550, '2027-04-15', 120);

-- =============================================
-- INSERT SAMPLE DATA: Rooms
-- =============================================
INSERT INTO room (room_number, room_type, floor_number, bed_count, daily_rate, status, department_id, facilities) VALUES
('A101', 'GENERAL', 1, 4, 150.00, 'OCCUPIED', 1, 'TV, WiFi, Shared Bathroom'),
('A102', 'GENERAL', 1, 4, 150.00, 'AVAILABLE', 1, 'TV, WiFi, Shared Bathroom'),
('A103', 'GENERAL', 1, 4, 150.00, 'AVAILABLE', 1, 'TV, WiFi, Shared Bathroom'),
('A201', 'PRIVATE', 2, 1, 350.00, 'OCCUPIED', 2, 'TV, WiFi, Private Bathroom, AC, Sofa'),
('A202', 'PRIVATE', 2, 1, 350.00, 'RESERVED', 2, 'TV, WiFi, Private Bathroom, AC, Sofa'),
('A203', 'PRIVATE', 2, 1, 350.00, 'AVAILABLE', 2, 'TV, WiFi, Private Bathroom, AC, Sofa'),
('B101', 'ICU', 1, 1, 800.00, 'OCCUPIED', 5, 'Ventilator, Cardiac Monitor, Suction'),
('B102', 'ICU', 1, 1, 800.00, 'AVAILABLE', 5, 'Ventilator, Cardiac Monitor, Suction'),
('B103', 'ICU', 1, 1, 800.00, 'MAINTENANCE', 5, 'Ventilator, Cardiac Monitor, Suction'),
('B104', 'ICU', 1, 1, 800.00, 'AVAILABLE', 5, 'Ventilator, Cardiac Monitor, Suction'),
('C101', 'EMERGENCY', 1, 6, 200.00, 'AVAILABLE', 5, 'Emergency Equipment, Oxygen'),
('C102', 'EMERGENCY', 1, 6, 200.00, 'OCCUPIED', 5, 'Emergency Equipment, Oxygen'),
('D101', 'OPERATION', 1, 1, 1500.00, 'AVAILABLE', 3, 'Full Surgical Equipment, Anesthesia'),
('D102', 'OPERATION', 1, 1, 1500.00, 'RESERVED', 3, 'Full Surgical Equipment, Anesthesia'),
('E101', 'RECOVERY', 2, 2, 250.00, 'OCCUPIED', 3, 'Monitoring Equipment, Nurse Call'),
('E102', 'RECOVERY', 2, 2, 250.00, 'AVAILABLE', 3, 'Monitoring Equipment, Nurse Call'),
('F101', 'GENERAL', 3, 6, 100.00, 'AVAILABLE', 4, 'Child-friendly, Play Area Access'),
('F102', 'PRIVATE', 3, 1, 400.00, 'AVAILABLE', 4, 'Child-friendly, Parent Bed, Play Area'),
('G101', 'PRIVATE', 4, 1, 450.00, 'AVAILABLE', 8, 'Isolation capable, Special equipment'),
('G102', 'PRIVATE', 4, 1, 450.00, 'OCCUPIED', 8, 'Isolation capable, Special equipment');

-- =============================================
-- INSERT SAMPLE DATA: Medical Records
-- =============================================
INSERT INTO medical_record (patient_id, doctor_id, record_date, diagnosis, symptoms, treatment, prescription, follow_up_date, notes) VALUES
(1, 1, '2025-11-28', 'Mild Hypertension', 'Elevated blood pressure, occasional headaches', 'Lifestyle modifications, medication', 'Lisinopril 10mg daily, low sodium diet', '2025-12-28', 'Monitor BP daily, report if >140/90'),
(2, 2, '2025-11-29', 'Tension Headache', 'Recurring headaches, neck stiffness', 'Pain management, stress reduction', 'Ibuprofen 400mg as needed, massage therapy', '2025-12-15', 'MRI scheduled if no improvement'),
(5, 5, '2025-11-28', 'Acute Anxiety Attack', 'Chest pain, shortness of breath, palpitations', 'Ruled out cardiac cause, referred to psychiatry', 'Sertraline 50mg daily', '2025-12-05', 'ECG normal, recommend counseling'),
(6, 6, '2025-11-29', 'Contact Dermatitis', 'Itchy red rash on arms, blistering', 'Topical treatment, allergen avoidance', 'Prednisone cream 1%, antihistamine', '2025-12-10', 'Possible nickel allergy - patch test recommended'),
(3, 3, '2025-11-27', 'ACL Sprain Grade II', 'Knee pain, swelling, instability', 'RICE protocol, physical therapy', 'Ibuprofen 400mg TID, knee brace', '2026-01-15', 'Surgery may be needed if no improvement'),
(7, 7, '2025-11-24', 'Myopia', 'Blurred distance vision, eye strain', 'Corrective lenses prescribed', 'New prescription glasses -2.50 both eyes', '2026-11-24', 'Annual follow-up recommended'),
(8, 8, '2025-11-23', 'Breast Cancer Stage I', 'Lump detected during self-exam', 'Lumpectomy performed, radiation planned', 'Tamoxifen 20mg daily', '2025-12-23', 'Weekly radiation for 6 weeks'),
(4, 4, '2025-11-26', 'Well Child Visit', 'Routine vaccination', 'Administered DTaP, MMR boosters', 'No medication needed', '2026-05-26', 'Growth on track, meeting milestones'),
(9, 9, '2025-11-22', 'Atrial Fibrillation', 'Irregular heartbeat, fatigue', 'Rate control medication', 'Metoprolol 50mg BID, Aspirin 81mg daily', '2025-12-22', 'Consider ablation if symptoms persist'),
(10, 10, '2025-11-20', 'Multiple Sclerosis Suspected', 'Numbness in extremities, vision changes', 'Further testing needed', 'MRI ordered, referral to specialist', '2025-12-10', 'Urgent neurology follow-up'),
(11, 11, '2025-11-28', 'Annual Wellness Exam', 'No complaints, routine checkup', 'Preventive care counseling', 'Continue current supplements', '2026-11-28', 'All screenings normal'),
(12, 12, '2025-11-27', 'Generalized Anxiety Disorder', 'Persistent worry, sleep disturbance', 'Cognitive behavioral therapy recommended', 'Sertraline 25mg daily, increase to 50mg in 2 weeks', '2025-12-11', 'Weekly therapy sessions scheduled'),
(15, 15, '2025-11-29', 'Minor Laceration', 'Cut on forearm from accident', 'Wound cleaned and sutured', 'Antibiotics for 5 days, tetanus booster given', '2025-12-06', '5 sutures placed, remove in 7 days');

-- =============================================
-- INSERT SAMPLE DATA: Users (Authentication)
-- Note: Passwords are BCrypt encoded
-- admin123, doctor123, patient123
-- =============================================
INSERT INTO users (email, password, first_name, last_name, role, doctor_id, patient_id, is_active) VALUES
('admin@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MJ.kLOhJJrGxw3VLa1LJwqb7qbXBTO', 'Admin', 'Khôi', 'ADMIN', NULL, NULL, TRUE),
('doctor@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MJ.kLOhJJrGxw3VLa1LJwqb7qbXBTO', 'William', 'Chen', 'DOCTOR', 1, NULL, TRUE),
('patient@hospital.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.MJ.kLOhJJrGxw3VLa1LJwqb7qbXBTO', 'John', 'Smith', 'PATIENT', NULL, 1, TRUE);

-- =============================================
-- TABLE: message (for internal messaging system)
-- =============================================
CREATE TABLE IF NOT EXISTS message (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_message_sender (sender_id),
    INDEX idx_message_receiver (receiver_id),
    INDEX idx_message_sent_at (sent_at),
    
    CONSTRAINT fk_message_sender 
        FOREIGN KEY (sender_id) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_message_receiver 
        FOREIGN KEY (receiver_id) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
SELECT '========================================' AS '';
SELECT 'DATABASE SETUP COMPLETE!' AS Status;
SELECT '========================================' AS '';

SELECT 'Table Record Counts:' AS '';
SELECT CONCAT('  Departments:     ', LPAD(COUNT(*), 3, ' ')) AS '' FROM department
UNION ALL SELECT CONCAT('  Patients:        ', LPAD(COUNT(*), 3, ' ')) FROM patient
UNION ALL SELECT CONCAT('  Doctors:         ', LPAD(COUNT(*), 3, ' ')) FROM doctor
UNION ALL SELECT CONCAT('  Appointments:    ', LPAD(COUNT(*), 3, ' ')) FROM appointment
UNION ALL SELECT CONCAT('  Bills:           ', LPAD(COUNT(*), 3, ' ')) FROM bill
UNION ALL SELECT CONCAT('  Medicines:       ', LPAD(COUNT(*), 3, ' ')) FROM medicine
UNION ALL SELECT CONCAT('  Rooms:           ', LPAD(COUNT(*), 3, ' ')) FROM room
UNION ALL SELECT CONCAT('  Medical Records: ', LPAD(COUNT(*), 3, ' ')) FROM medical_record
UNION ALL SELECT CONCAT('  Users:           ', LPAD(COUNT(*), 3, ' ')) FROM users;

SELECT '========================================' AS '';
SELECT 'Connection Info:' AS '';
SELECT '  Database: hospital_management_system' AS '';
SELECT '  Backend:  http://localhost:8080' AS '';
SELECT '  Frontend: http://localhost:5174' AS '';
SELECT '========================================' AS '';
