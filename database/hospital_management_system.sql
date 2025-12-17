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
-- TABLE: vital_signs
-- =============================================
CREATE TABLE vital_signs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    recorded_by_id BIGINT,
    recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    temperature DECIMAL(4, 1),
    blood_pressure_systolic INT,
    blood_pressure_diastolic INT,
    heart_rate INT,
    respiratory_rate INT,
    oxygen_saturation DECIMAL(4, 1),
    weight DECIMAL(5, 2),
    height DECIMAL(5, 2),
    bmi DECIMAL(4, 1),
    pain_level INT,
    notes VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_vitals_patient (patient_id),
    INDEX idx_vitals_recorded_at (recorded_at),
    INDEX idx_vitals_recorded_by (recorded_by_id),
    
    CONSTRAINT fk_vitals_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_vitals_recorded_by 
        FOREIGN KEY (recorded_by_id) REFERENCES doctor(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: lab_test (catalog of available tests)
-- =============================================
CREATE TABLE lab_test (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE,
    category VARCHAR(50),
    description VARCHAR(500),
    normal_range VARCHAR(100),
    unit VARCHAR(50),
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    turnaround_time VARCHAR(50),
    sample_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_lab_test_name (name),
    INDEX idx_lab_test_code (code),
    INDEX idx_lab_test_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: lab_order
-- =============================================
CREATE TABLE lab_order (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    priority ENUM('NORMAL', 'URGENT', 'STAT') DEFAULT 'NORMAL',
    status ENUM('PENDING', 'SAMPLE_COLLECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    clinical_notes VARCHAR(1000),
    sample_collected_at DATETIME,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_lab_order_patient (patient_id),
    INDEX idx_lab_order_doctor (doctor_id),
    INDEX idx_lab_order_date (order_date),
    INDEX idx_lab_order_status (status),
    
    CONSTRAINT fk_lab_order_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_lab_order_doctor 
        FOREIGN KEY (doctor_id) REFERENCES doctor(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: lab_result
-- =============================================
CREATE TABLE lab_result (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    lab_order_id BIGINT NOT NULL,
    lab_test_id BIGINT NOT NULL,
    result_value VARCHAR(100),
    unit VARCHAR(50),
    reference_range VARCHAR(100),
    is_abnormal BOOLEAN DEFAULT FALSE,
    performed_by VARCHAR(100),
    performed_at DATETIME,
    notes VARCHAR(500),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_lab_result_order (lab_order_id),
    INDEX idx_lab_result_test (lab_test_id),
    
    CONSTRAINT fk_lab_result_order 
        FOREIGN KEY (lab_order_id) REFERENCES lab_order(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_lab_result_test 
        FOREIGN KEY (lab_test_id) REFERENCES lab_test(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: admission (inpatient admissions)
-- =============================================
CREATE TABLE admission (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    room_id BIGINT,
    doctor_id BIGINT,
    admission_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    discharge_date DATETIME,
    admission_type ENUM('EMERGENCY', 'SCHEDULED', 'TRANSFER', 'OBSERVATION') DEFAULT 'SCHEDULED',
    status ENUM('ADMITTED', 'DISCHARGED', 'TRANSFERRED') DEFAULT 'ADMITTED',
    bed_number VARCHAR(10),
    admission_reason VARCHAR(500),
    diagnosis VARCHAR(500),
    discharge_summary VARCHAR(2000),
    discharge_instructions VARCHAR(1000),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_admission_patient (patient_id),
    INDEX idx_admission_room (room_id),
    INDEX idx_admission_doctor (doctor_id),
    INDEX idx_admission_date (admission_date),
    INDEX idx_admission_status (status),
    
    CONSTRAINT fk_admission_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_admission_room 
        FOREIGN KEY (room_id) REFERENCES room(id) 
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_admission_doctor 
        FOREIGN KEY (doctor_id) REFERENCES doctor(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: document (file uploads)
-- =============================================
CREATE TABLE document (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    uploaded_by_id BIGINT,
    document_type ENUM('LAB_REPORT', 'PRESCRIPTION', 'IMAGING', 'DISCHARGE_SUMMARY', 'CONSENT_FORM', 'INSURANCE', 'OTHER') DEFAULT 'OTHER',
    file_name VARCHAR(255) NOT NULL,
    original_file_name VARCHAR(255),
    file_type VARCHAR(100),
    file_size BIGINT,
    file_path VARCHAR(500),
    description VARCHAR(500),
    is_confidential BOOLEAN DEFAULT FALSE,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_document_patient (patient_id),
    INDEX idx_document_type (document_type),
    INDEX idx_document_uploaded_by (uploaded_by_id),
    
    CONSTRAINT fk_document_patient 
        FOREIGN KEY (patient_id) REFERENCES patient(id) 
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_document_uploaded_by 
        FOREIGN KEY (uploaded_by_id) REFERENCES users(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- TABLE: notification
-- =============================================
CREATE TABLE notification (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type ENUM('APPOINTMENT', 'LAB_RESULT', 'PRESCRIPTION', 'PAYMENT', 'SYSTEM', 'ALERT') DEFAULT 'SYSTEM',
    title VARCHAR(200) NOT NULL,
    message VARCHAR(1000),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    scheduled_for DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_notification_user (user_id),
    INDEX idx_notification_type (type),
    INDEX idx_notification_read (is_read),
    INDEX idx_notification_created (created_at),
    
    CONSTRAINT fk_notification_user 
        FOREIGN KEY (user_id) REFERENCES users(id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERT SAMPLE DATA: Vital Signs
-- =============================================
INSERT INTO vital_signs (patient_id, recorded_by_id, recorded_at, temperature, blood_pressure_systolic, blood_pressure_diastolic, heart_rate, respiratory_rate, oxygen_saturation, weight, height, bmi, pain_level, notes) VALUES
(1, 1, '2025-12-15 09:00:00', 36.8, 140, 90, 78, 16, 98.5, 82.5, 175.0, 26.9, 2, 'Slightly elevated BP, monitoring required'),
(1, 1, '2025-12-10 14:30:00', 36.6, 138, 88, 75, 15, 99.0, 82.0, 175.0, 26.8, 0, 'BP improving with medication'),
(2, 2, '2025-12-14 10:15:00', 37.2, 118, 76, 82, 18, 97.5, 58.0, 162.0, 22.1, 5, 'Mild headache reported'),
(3, 3, '2025-12-13 11:00:00', 36.5, 125, 82, 70, 14, 99.0, 95.0, 180.0, 29.3, 6, 'Knee pain from ACL injury'),
(4, 4, '2025-12-12 09:30:00', 36.9, 100, 65, 90, 20, 98.0, 22.5, 110.0, 18.6, 0, 'Healthy child, routine checkup'),
(5, 5, '2025-12-11 08:45:00', 36.7, 145, 95, 88, 20, 97.0, 78.0, 168.0, 27.6, 3, 'Anxiety symptoms, elevated heart rate'),
(6, 6, '2025-12-10 15:00:00', 36.4, 115, 75, 68, 14, 99.5, 65.0, 165.0, 23.9, 4, 'Skin irritation causing discomfort'),
(7, 7, '2025-12-09 10:00:00', 36.6, 128, 84, 72, 16, 98.0, 70.5, 170.0, 24.4, 1, 'Eye strain headache'),
(8, 8, '2025-12-08 14:00:00', 37.0, 110, 70, 76, 16, 98.5, 62.0, 160.0, 24.2, 2, 'Post-treatment vitals stable'),
(9, 9, '2025-12-15 11:30:00', 36.8, 135, 85, 95, 18, 96.5, 88.0, 178.0, 27.8, 1, 'Irregular heartbeat noted'),
(10, 10, '2025-12-14 16:00:00', 36.5, 120, 78, 74, 15, 98.0, 68.0, 165.0, 25.0, 3, 'Numbness in extremities'),
(1, 1, '2025-12-16 08:00:00', 36.7, 132, 85, 72, 15, 98.8, 82.0, 175.0, 26.8, 1, 'BP trending down, good progress'),
(2, 2, '2025-12-16 09:30:00', 36.5, 116, 74, 78, 16, 98.5, 58.0, 162.0, 22.1, 2, 'Headache improved'),
(5, 5, '2025-12-15 14:00:00', 36.6, 138, 88, 82, 17, 97.5, 78.0, 168.0, 27.6, 2, 'Anxiety improving with treatment');

-- =============================================
-- INSERT SAMPLE DATA: Lab Tests (Catalog)
-- =============================================
INSERT INTO lab_test (name, code, category, description, normal_range, unit, price, turnaround_time, sample_type, is_active) VALUES
('Complete Blood Count', 'CBC', 'Hematology', 'Measures different components of blood', 'See individual components', '', 45.00, '2-4 hours', 'Blood', TRUE),
('Hemoglobin', 'HGB', 'Hematology', 'Measures hemoglobin level in blood', '12-17 g/dL', 'g/dL', 25.00, '1-2 hours', 'Blood', TRUE),
('White Blood Cell Count', 'WBC', 'Hematology', 'Counts white blood cells', '4,500-11,000', 'cells/mcL', 30.00, '1-2 hours', 'Blood', TRUE),
('Platelet Count', 'PLT', 'Hematology', 'Measures platelet count', '150,000-400,000', 'cells/mcL', 28.00, '1-2 hours', 'Blood', TRUE),
('Blood Glucose Fasting', 'GLU-F', 'Chemistry', 'Measures blood sugar after fasting', '70-100', 'mg/dL', 35.00, '1-2 hours', 'Blood', TRUE),
('HbA1c', 'HBA1C', 'Chemistry', 'Measures average blood sugar over 3 months', '4.0-5.6', '%', 55.00, '24 hours', 'Blood', TRUE),
('Lipid Panel', 'LIPID', 'Chemistry', 'Measures cholesterol and triglycerides', 'See individual components', '', 65.00, '4-6 hours', 'Blood', TRUE),
('Total Cholesterol', 'CHOL', 'Chemistry', 'Measures total cholesterol', '<200', 'mg/dL', 30.00, '2-4 hours', 'Blood', TRUE),
('LDL Cholesterol', 'LDL', 'Chemistry', 'Low-density lipoprotein cholesterol', '<100', 'mg/dL', 35.00, '2-4 hours', 'Blood', TRUE),
('HDL Cholesterol', 'HDL', 'Chemistry', 'High-density lipoprotein cholesterol', '>40', 'mg/dL', 35.00, '2-4 hours', 'Blood', TRUE),
('Triglycerides', 'TG', 'Chemistry', 'Measures triglyceride levels', '<150', 'mg/dL', 32.00, '2-4 hours', 'Blood', TRUE),
('Liver Function Test', 'LFT', 'Chemistry', 'Assesses liver health', 'See individual components', '', 75.00, '4-6 hours', 'Blood', TRUE),
('Kidney Function Test', 'KFT', 'Chemistry', 'Assesses kidney health', 'See individual components', '', 70.00, '4-6 hours', 'Blood', TRUE),
('Creatinine', 'CREAT', 'Chemistry', 'Measures kidney function', '0.7-1.3', 'mg/dL', 28.00, '2-4 hours', 'Blood', TRUE),
('Blood Urea Nitrogen', 'BUN', 'Chemistry', 'Measures kidney function', '7-20', 'mg/dL', 28.00, '2-4 hours', 'Blood', TRUE),
('Thyroid Panel', 'THYROID', 'Endocrine', 'Measures thyroid hormones', 'See individual components', '', 85.00, '24 hours', 'Blood', TRUE),
('TSH', 'TSH', 'Endocrine', 'Thyroid stimulating hormone', '0.4-4.0', 'mIU/L', 45.00, '24 hours', 'Blood', TRUE),
('T3', 'T3', 'Endocrine', 'Triiodothyronine hormone', '80-200', 'ng/dL', 40.00, '24 hours', 'Blood', TRUE),
('T4', 'T4', 'Endocrine', 'Thyroxine hormone', '4.5-12.0', 'mcg/dL', 40.00, '24 hours', 'Blood', TRUE),
('Urinalysis', 'UA', 'Urinalysis', 'Complete urine analysis', 'Normal', '', 35.00, '2-4 hours', 'Urine', TRUE),
('Urine Culture', 'UCULT', 'Microbiology', 'Tests for bacteria in urine', 'No growth', '', 60.00, '48-72 hours', 'Urine', TRUE),
('COVID-19 PCR', 'COVID-PCR', 'Molecular', 'Detects SARS-CoV-2 virus', 'Negative', '', 120.00, '24-48 hours', 'Nasal Swab', TRUE),
('Vitamin D', 'VITD', 'Chemistry', 'Measures vitamin D levels', '30-100', 'ng/mL', 55.00, '24 hours', 'Blood', TRUE),
('Iron Studies', 'IRON', 'Hematology', 'Measures iron levels', 'See individual components', '', 65.00, '4-6 hours', 'Blood', TRUE),
('Electrolyte Panel', 'ELEC', 'Chemistry', 'Measures sodium, potassium, chloride', 'See individual components', '', 50.00, '2-4 hours', 'Blood', TRUE);

-- =============================================
-- INSERT SAMPLE DATA: Lab Orders
-- =============================================
INSERT INTO lab_order (patient_id, doctor_id, order_date, priority, status, clinical_notes, sample_collected_at, completed_at) VALUES
(1, 1, '2025-12-15 09:30:00', 'NORMAL', 'COMPLETED', 'Routine cardiac workup', '2025-12-15 10:00:00', '2025-12-15 14:00:00'),
(1, 1, '2025-12-10 10:00:00', 'URGENT', 'COMPLETED', 'Follow-up lipid panel after medication change', '2025-12-10 10:30:00', '2025-12-10 15:00:00'),
(2, 2, '2025-12-14 11:00:00', 'NORMAL', 'COMPLETED', 'Rule out thyroid issues for headaches', '2025-12-14 11:30:00', '2025-12-15 11:00:00'),
(3, 3, '2025-12-13 14:00:00', 'NORMAL', 'IN_PROGRESS', 'Pre-surgery workup for ACL repair', '2025-12-13 14:30:00', NULL),
(5, 5, '2025-12-11 09:00:00', 'STAT', 'COMPLETED', 'Emergency cardiac enzymes', '2025-12-11 09:15:00', '2025-12-11 10:30:00'),
(8, 8, '2025-12-08 08:00:00', 'NORMAL', 'COMPLETED', 'Post-treatment monitoring', '2025-12-08 08:30:00', '2025-12-08 14:00:00'),
(9, 9, '2025-12-15 12:00:00', 'URGENT', 'SAMPLE_COLLECTED', 'Cardiac panel for arrhythmia workup', '2025-12-15 12:30:00', NULL),
(10, 10, '2025-12-14 15:00:00', 'NORMAL', 'PENDING', 'MS workup - comprehensive panel', NULL, NULL),
(4, 4, '2025-12-12 10:00:00', 'NORMAL', 'COMPLETED', 'Routine pediatric checkup', '2025-12-12 10:15:00', '2025-12-12 13:00:00'),
(6, 6, '2025-12-10 14:00:00', 'NORMAL', 'COMPLETED', 'Allergy panel for dermatitis', '2025-12-10 14:30:00', '2025-12-11 10:00:00'),
(11, 11, '2025-12-16 08:00:00', 'NORMAL', 'PENDING', 'Annual wellness bloodwork', NULL, NULL),
(12, 12, '2025-12-16 09:00:00', 'NORMAL', 'SAMPLE_COLLECTED', 'Thyroid check for anxiety medication', '2025-12-16 09:30:00', NULL);

-- =============================================
-- INSERT SAMPLE DATA: Lab Results
-- =============================================
INSERT INTO lab_result (lab_order_id, lab_test_id, result_value, unit, reference_range, is_abnormal, performed_by, performed_at, notes) VALUES
-- Order 1: Cardiac workup for patient 1
(1, 7, 'See components', '', '', FALSE, 'Lab Tech Johnson', '2025-12-15 13:30:00', 'Lipid panel complete'),
(1, 8, '195', 'mg/dL', '<200', FALSE, 'Lab Tech Johnson', '2025-12-15 13:30:00', 'Within normal range'),
(1, 9, '115', 'mg/dL', '<100', TRUE, 'Lab Tech Johnson', '2025-12-15 13:30:00', 'Slightly elevated LDL'),
(1, 10, '52', 'mg/dL', '>40', FALSE, 'Lab Tech Johnson', '2025-12-15 13:30:00', 'Good HDL level'),
(1, 11, '140', 'mg/dL', '<150', FALSE, 'Lab Tech Johnson', '2025-12-15 13:30:00', 'Normal triglycerides'),
-- Order 2: Lipid panel follow-up for patient 1
(2, 7, 'See components', '', '', FALSE, 'Lab Tech Smith', '2025-12-10 14:30:00', 'Follow-up lipid panel'),
(2, 8, '188', 'mg/dL', '<200', FALSE, 'Lab Tech Smith', '2025-12-10 14:30:00', 'Improved from last test'),
(2, 9, '105', 'mg/dL', '<100', TRUE, 'Lab Tech Smith', '2025-12-10 14:30:00', 'Slightly elevated but improving'),
-- Order 3: Thyroid for patient 2
(3, 16, 'See components', '', '', FALSE, 'Lab Tech Davis', '2025-12-15 10:30:00', 'Thyroid panel complete'),
(3, 17, '2.5', 'mIU/L', '0.4-4.0', FALSE, 'Lab Tech Davis', '2025-12-15 10:30:00', 'Normal TSH'),
(3, 18, '120', 'ng/dL', '80-200', FALSE, 'Lab Tech Davis', '2025-12-15 10:30:00', 'Normal T3'),
(3, 19, '8.5', 'mcg/dL', '4.5-12.0', FALSE, 'Lab Tech Davis', '2025-12-15 10:30:00', 'Normal T4'),
-- Order 5: Emergency cardiac enzymes for patient 5
(5, 1, 'See components', '', '', FALSE, 'Lab Tech Emergency', '2025-12-11 10:15:00', 'STAT CBC completed'),
(5, 2, '14.2', 'g/dL', '12-17', FALSE, 'Lab Tech Emergency', '2025-12-11 10:15:00', 'Normal hemoglobin'),
(5, 5, '95', 'mg/dL', '70-100', FALSE, 'Lab Tech Emergency', '2025-12-11 10:15:00', 'Normal glucose'),
-- Order 6: Post-treatment for patient 8
(6, 1, 'See components', '', '', FALSE, 'Lab Tech Wilson', '2025-12-08 13:30:00', 'CBC for monitoring'),
(6, 2, '11.8', 'g/dL', '12-17', TRUE, 'Lab Tech Wilson', '2025-12-08 13:30:00', 'Slightly low hemoglobin, expected post-treatment'),
(6, 3, '5800', 'cells/mcL', '4,500-11,000', FALSE, 'Lab Tech Wilson', '2025-12-08 13:30:00', 'Normal WBC'),
(6, 4, '180000', 'cells/mcL', '150,000-400,000', FALSE, 'Lab Tech Wilson', '2025-12-08 13:30:00', 'Normal platelets'),
-- Order 9: Pediatric checkup for patient 4
(9, 1, 'See components', '', '', FALSE, 'Lab Tech Pediatric', '2025-12-12 12:30:00', 'Routine CBC'),
(9, 2, '13.5', 'g/dL', '12-17', FALSE, 'Lab Tech Pediatric', '2025-12-12 12:30:00', 'Normal for age'),
(9, 3, '7500', 'cells/mcL', '4,500-11,000', FALSE, 'Lab Tech Pediatric', '2025-12-12 12:30:00', 'Normal WBC'),
-- Order 10: Allergy workup for patient 6
(10, 1, 'See components', '', '', FALSE, 'Lab Tech Allergy', '2025-12-11 09:30:00', 'CBC with differential'),
(10, 3, '8200', 'cells/mcL', '4,500-11,000', FALSE, 'Lab Tech Allergy', '2025-12-11 09:30:00', 'Normal, slight eosinophilia noted');

-- =============================================
-- INSERT SAMPLE DATA: Admissions
-- =============================================
INSERT INTO admission (patient_id, room_id, doctor_id, admission_date, discharge_date, admission_type, status, bed_number, admission_reason, diagnosis, discharge_summary, discharge_instructions) VALUES
(5, 7, 5, '2025-12-11 08:30:00', '2025-12-12 16:00:00', 'EMERGENCY', 'DISCHARGED', 'ICU-1', 'Acute anxiety attack with chest pain', 'Panic disorder, ruled out cardiac cause', 'Patient presented with chest pain and shortness of breath. ECG and cardiac enzymes normal. Diagnosed with panic attack. Started on anti-anxiety medication.', 'Take Sertraline as prescribed. Follow up with psychiatry in 1 week. Return to ER if chest pain recurs.'),
(8, 20, 8, '2025-12-05 10:00:00', NULL, 'SCHEDULED', 'ADMITTED', 'A', 'Chemotherapy treatment cycle 3', 'Breast cancer Stage I - ongoing treatment', NULL, NULL),
(3, 15, 3, '2025-12-13 07:00:00', NULL, 'SCHEDULED', 'ADMITTED', 'B', 'ACL reconstruction surgery', 'ACL tear - post-operative care', NULL, NULL),
(7, 6, 7, '2025-12-14 09:00:00', '2025-12-15 11:00:00', 'OBSERVATION', 'DISCHARGED', 'A', 'Post-cataract surgery observation', 'Routine cataract surgery - successful', 'Uncomplicated cataract surgery. Vision improved. No complications observed during overnight stay.', 'Use prescribed eye drops 4 times daily. Wear eye shield while sleeping. Follow up in 1 week.'),
(9, 1, 9, '2025-12-15 06:00:00', NULL, 'EMERGENCY', 'ADMITTED', '1', 'Atrial fibrillation with rapid ventricular response', 'Atrial fibrillation - rate control', NULL, NULL),
(1, 4, 1, '2025-12-10 14:00:00', '2025-12-12 10:00:00', 'OBSERVATION', 'DISCHARGED', 'A', 'Hypertensive urgency observation', 'Hypertensive urgency - controlled', 'BP initially 180/110, controlled with IV medication. Transitioned to oral meds. BP stable at discharge.', 'Take Lisinopril 20mg daily. Low sodium diet. Monitor BP twice daily. Follow up in 3 days.'),
(10, 4, 10, '2025-12-14 11:00:00', NULL, 'SCHEDULED', 'ADMITTED', 'A', 'MRI and neurological workup', 'Suspected Multiple Sclerosis - under investigation', NULL, NULL),
(15, 11, 15, '2025-12-16 02:30:00', NULL, 'EMERGENCY', 'ADMITTED', '3', 'Motor vehicle accident - multiple injuries', 'Polytrauma - stable condition', NULL, NULL);

-- =============================================
-- INSERT SAMPLE DATA: Documents
-- =============================================
INSERT INTO document (patient_id, uploaded_by_id, document_type, file_name, original_file_name, file_type, file_size, description, is_confidential, uploaded_at) VALUES
(1, 2, 'LAB_REPORT', 'lab_report_001.pdf', 'Lipid_Panel_Results.pdf', 'application/pdf', 245760, 'Lipid panel results from Dec 15', FALSE, '2025-12-15 15:00:00'),
(1, 2, 'PRESCRIPTION', 'prescription_001.pdf', 'Lisinopril_Prescription.pdf', 'application/pdf', 128000, 'Hypertension medication prescription', FALSE, '2025-12-10 16:00:00'),
(5, 2, 'DISCHARGE_SUMMARY', 'discharge_005.pdf', 'Discharge_Summary_Dec12.pdf', 'application/pdf', 356000, 'Discharge summary after anxiety episode', FALSE, '2025-12-12 17:00:00'),
(8, 2, 'IMAGING', 'imaging_008.pdf', 'Mammogram_Results.pdf', 'application/pdf', 1024000, 'Pre-treatment imaging results', TRUE, '2025-12-04 14:00:00'),
(3, 2, 'IMAGING', 'imaging_003.pdf', 'MRI_Knee_Results.pdf', 'application/pdf', 2048000, 'MRI showing ACL tear', FALSE, '2025-12-12 10:00:00'),
(3, 2, 'CONSENT_FORM', 'consent_003.pdf', 'Surgery_Consent_Form.pdf', 'application/pdf', 180000, 'Signed consent for ACL surgery', FALSE, '2025-12-12 11:00:00'),
(7, 2, 'DISCHARGE_SUMMARY', 'discharge_007.pdf', 'Cataract_Surgery_Discharge.pdf', 'application/pdf', 290000, 'Post-cataract surgery discharge', FALSE, '2025-12-15 12:00:00'),
(9, 2, 'LAB_REPORT', 'lab_report_009.pdf', 'Cardiac_Enzymes.pdf', 'application/pdf', 210000, 'Emergency cardiac panel results', FALSE, '2025-12-15 13:00:00'),
(1, 3, 'INSURANCE', 'insurance_001.pdf', 'Insurance_Card_Copy.pdf', 'application/pdf', 95000, 'Insurance information', FALSE, '2025-11-28 09:00:00'),
(2, 2, 'LAB_REPORT', 'lab_report_002.pdf', 'Thyroid_Panel.pdf', 'application/pdf', 198000, 'Thyroid function test results', FALSE, '2025-12-15 11:30:00');

-- =============================================
-- INSERT SAMPLE DATA: Notifications
-- =============================================
INSERT INTO notification (user_id, type, title, message, is_read, link, scheduled_for, created_at) VALUES
(3, 'LAB_RESULT', 'Lab Results Available', 'Your lipid panel results are now available. Please review and discuss with your doctor.', FALSE, '/lab', NULL, '2025-12-15 15:00:00'),
(3, 'APPOINTMENT', 'Upcoming Appointment Reminder', 'You have an appointment with Dr. Chen tomorrow at 9:00 AM.', TRUE, '/appointments', '2025-12-16 09:00:00', '2025-12-15 09:00:00'),
(3, 'PRESCRIPTION', 'Prescription Refill Reminder', 'Your Lisinopril prescription will need a refill in 7 days.', FALSE, '/prescriptions', NULL, '2025-12-10 10:00:00'),
(2, 'SYSTEM', 'New Patient Assigned', 'Patient Robert Williams has been assigned to your care for ACL surgery.', TRUE, '/patients/3', NULL, '2025-12-13 07:30:00'),
(2, 'LAB_RESULT', 'Lab Results Ready for Review', 'Lab results for John Smith are ready for your review.', FALSE, '/lab', NULL, '2025-12-15 14:30:00'),
(1, 'SYSTEM', 'System Maintenance Scheduled', 'The system will undergo maintenance on Dec 20 from 2:00 AM to 4:00 AM.', FALSE, NULL, '2025-12-20 02:00:00', '2025-12-15 08:00:00'),
(3, 'PAYMENT', 'Payment Received', 'Your payment of $486.54 has been received. Thank you.', TRUE, '/payments', NULL, '2025-11-28 12:00:00'),
(2, 'ALERT', 'Critical Lab Value Alert', 'Patient John Smith has elevated LDL cholesterol (115 mg/dL). Review recommended.', FALSE, '/lab', NULL, '2025-12-15 14:00:00'),
(3, 'APPOINTMENT', 'Appointment Confirmed', 'Your appointment with Dr. Walker on Dec 4 at 10:00 AM has been confirmed.', TRUE, '/appointments', NULL, '2025-12-01 10:00:00'),
(1, 'SYSTEM', 'New User Registration', 'A new doctor account has been created: Dr. Steven Green', TRUE, '/users', NULL, '2025-11-15 11:00:00'),
(2, 'APPOINTMENT', 'New Appointment Scheduled', 'John Smith has scheduled an appointment for Dec 1 at 9:00 AM.', TRUE, '/appointments', NULL, '2025-11-28 14:00:00'),
(3, 'SYSTEM', 'Welcome to Hospital Management System', 'Your patient account has been created. Complete your profile for better service.', TRUE, '/profile', NULL, '2025-11-20 09:00:00');

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
UNION ALL SELECT CONCAT('  Users:           ', LPAD(COUNT(*), 3, ' ')) FROM users
UNION ALL SELECT CONCAT('  Messages:        ', LPAD(COUNT(*), 3, ' ')) FROM message
UNION ALL SELECT CONCAT('  Vital Signs:     ', LPAD(COUNT(*), 3, ' ')) FROM vital_signs
UNION ALL SELECT CONCAT('  Lab Tests:       ', LPAD(COUNT(*), 3, ' ')) FROM lab_test
UNION ALL SELECT CONCAT('  Lab Orders:      ', LPAD(COUNT(*), 3, ' ')) FROM lab_order
UNION ALL SELECT CONCAT('  Lab Results:     ', LPAD(COUNT(*), 3, ' ')) FROM lab_result
UNION ALL SELECT CONCAT('  Admissions:      ', LPAD(COUNT(*), 3, ' ')) FROM admission
UNION ALL SELECT CONCAT('  Documents:       ', LPAD(COUNT(*), 3, ' ')) FROM document
UNION ALL SELECT CONCAT('  Notifications:   ', LPAD(COUNT(*), 3, ' ')) FROM notification;

SELECT '========================================' AS '';
SELECT 'Connection Info:' AS '';
SELECT '  Database: hospital_management_system' AS '';
SELECT '  Backend:  http://localhost:8080' AS '';
SELECT '  Frontend: http://localhost:5174' AS '';
SELECT '========================================' AS '';
