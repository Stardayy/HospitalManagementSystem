-- Hospital Management System - Sample Data
-- This script will be executed automatically when the application starts

-- Clear existing data (optional - comment out if you want to keep existing data)
-- Note: Due to foreign key constraints, order matters
DELETE FROM medical_record;
DELETE FROM bill;
DELETE FROM appointment;
DELETE FROM medicine;
DELETE FROM room;
DELETE FROM doctor;
DELETE FROM department;
DELETE FROM patient;

-- Reset auto-increment (MySQL)
ALTER TABLE department AUTO_INCREMENT = 1;
ALTER TABLE patient AUTO_INCREMENT = 1;
ALTER TABLE doctor AUTO_INCREMENT = 1;
ALTER TABLE appointment AUTO_INCREMENT = 1;
ALTER TABLE bill AUTO_INCREMENT = 1;
ALTER TABLE medicine AUTO_INCREMENT = 1;
ALTER TABLE room AUTO_INCREMENT = 1;
ALTER TABLE medical_record AUTO_INCREMENT = 1;

-- =============================================
-- DEPARTMENTS
-- =============================================
INSERT INTO department (name, description, location, phone, created_at, updated_at) VALUES
('Cardiology', 'Heart and cardiovascular diseases treatment', 'Building A, Floor 2', '555-0101', NOW(), NOW()),
('Neurology', 'Brain and nervous system disorders', 'Building A, Floor 3', '555-0102', NOW(), NOW()),
('Orthopedics', 'Bone and joint treatment', 'Building B, Floor 1', '555-0103', NOW(), NOW()),
('Pediatrics', 'Children healthcare services', 'Building C, Floor 1', '555-0104', NOW(), NOW()),
('Emergency', '24/7 Emergency medical services', 'Building A, Ground Floor', '555-0105', NOW(), NOW()),
('Dermatology', 'Skin diseases and treatments', 'Building B, Floor 2', '555-0106', NOW(), NOW()),
('Ophthalmology', 'Eye care and vision services', 'Building C, Floor 2', '555-0107', NOW(), NOW()),
('Oncology', 'Cancer diagnosis and treatment', 'Building D, Floor 1', '555-0108', NOW(), NOW());

-- =============================================
-- PATIENTS
-- =============================================
INSERT INTO patient (first_name, last_name, date_of_birth, gender, phone, email, address, blood_type, emergency_contact, emergency_phone, created_at, updated_at) VALUES
('John', 'Smith', '1985-03-15', 'Male', '555-1001', 'john.smith@email.com', '123 Main St, New York, NY 10001', 'A+', 'Jane Smith', '555-1002', NOW(), NOW()),
('Emily', 'Johnson', '1990-07-22', 'Female', '555-1003', 'emily.j@email.com', '456 Oak Ave, Los Angeles, CA 90001', 'B+', 'Michael Johnson', '555-1004', NOW(), NOW()),
('Robert', 'Williams', '1978-11-08', 'Male', '555-1005', 'r.williams@email.com', '789 Pine Rd, Chicago, IL 60601', 'O-', 'Sarah Williams', '555-1006', NOW(), NOW()),
('Maria', 'Garcia', '1995-01-30', 'Female', '555-1007', 'maria.g@email.com', '321 Elm St, Houston, TX 77001', 'AB+', 'Carlos Garcia', '555-1008', NOW(), NOW()),
('David', 'Brown', '1982-09-12', 'Male', '555-1009', 'david.brown@email.com', '654 Maple Dr, Phoenix, AZ 85001', 'A-', 'Lisa Brown', '555-1010', NOW(), NOW()),
('Jennifer', 'Davis', '1988-05-25', 'Female', '555-1011', 'jen.davis@email.com', '987 Cedar Ln, Philadelphia, PA 19101', 'B-', 'Mark Davis', '555-1012', NOW(), NOW()),
('Michael', 'Miller', '1975-12-03', 'Male', '555-1013', 'mike.miller@email.com', '147 Birch Blvd, San Antonio, TX 78201', 'O+', 'Nancy Miller', '555-1014', NOW(), NOW()),
('Sarah', 'Wilson', '1992-08-17', 'Female', '555-1015', 's.wilson@email.com', '258 Spruce Way, San Diego, CA 92101', 'AB-', 'Tom Wilson', '555-1016', NOW(), NOW()),
('James', 'Anderson', '1980-04-28', 'Male', '555-1017', 'james.a@email.com', '369 Walnut Ave, Dallas, TX 75201', 'A+', 'Emma Anderson', '555-1018', NOW(), NOW()),
('Jessica', 'Taylor', '1998-02-14', 'Female', '555-1019', 'jessica.t@email.com', '741 Chestnut St, San Jose, CA 95101', 'B+', 'Chris Taylor', '555-1020', NOW(), NOW());

-- =============================================
-- DOCTORS
-- =============================================
INSERT INTO doctor (first_name, last_name, specialization, phone, email, license_number, department_id, consultation_fee, years_of_experience, created_at, updated_at) VALUES
('William', 'Chen', 'Cardiology', '555-2001', 'w.chen@hospital.com', 'MD-2001-CA', 1, 150.00, 15, NOW(), NOW()),
('Susan', 'Martinez', 'Neurology', '555-2002', 's.martinez@hospital.com', 'MD-2002-NY', 2, 175.00, 12, NOW(), NOW()),
('Richard', 'Lee', 'Orthopedics', '555-2003', 'r.lee@hospital.com', 'MD-2003-TX', 3, 160.00, 10, NOW(), NOW()),
('Amanda', 'Thompson', 'Pediatrics', '555-2004', 'a.thompson@hospital.com', 'MD-2004-FL', 4, 120.00, 8, NOW(), NOW()),
('Christopher', 'White', 'Emergency Medicine', '555-2005', 'c.white@hospital.com', 'MD-2005-IL', 5, 200.00, 18, NOW(), NOW()),
('Elizabeth', 'Harris', 'Dermatology', '555-2006', 'e.harris@hospital.com', 'MD-2006-AZ', 6, 130.00, 7, NOW(), NOW()),
('Daniel', 'Clark', 'Ophthalmology', '555-2007', 'd.clark@hospital.com', 'MD-2007-PA', 7, 140.00, 9, NOW(), NOW()),
('Michelle', 'Lewis', 'Oncology', '555-2008', 'm.lewis@hospital.com', 'MD-2008-WA', 8, 180.00, 14, NOW(), NOW()),
('Joseph', 'Walker', 'Cardiology', '555-2009', 'j.walker@hospital.com', 'MD-2009-MA', 1, 155.00, 11, NOW(), NOW()),
('Patricia', 'Hall', 'Neurology', '555-2010', 'p.hall@hospital.com', 'MD-2010-NJ', 2, 165.00, 13, NOW(), NOW());

-- =============================================
-- APPOINTMENTS
-- =============================================
INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, status, reason, notes, created_at, updated_at) VALUES
(1, 1, '2025-12-01', '09:00:00', 'SCHEDULED', 'Annual heart checkup', 'Patient has family history of heart disease', NOW(), NOW()),
(2, 2, '2025-12-01', '10:30:00', 'CONFIRMED', 'Recurring headaches', 'Experiencing migraines for 2 weeks', NOW(), NOW()),
(3, 3, '2025-12-01', '14:00:00', 'SCHEDULED', 'Knee pain evaluation', 'Sports injury from last month', NOW(), NOW()),
(4, 4, '2025-12-02', '09:30:00', 'CONFIRMED', 'Child vaccination', 'Regular immunization schedule', NOW(), NOW()),
(5, 5, '2025-11-28', '11:00:00', 'COMPLETED', 'Emergency visit - chest pain', 'ECG performed, no abnormalities', NOW(), NOW()),
(6, 6, '2025-11-29', '15:30:00', 'COMPLETED', 'Skin rash examination', 'Prescribed topical treatment', NOW(), NOW()),
(7, 7, '2025-12-03', '08:30:00', 'SCHEDULED', 'Vision test', 'Annual eye examination', NOW(), NOW()),
(8, 8, '2025-12-02', '13:00:00', 'CONFIRMED', 'Follow-up consultation', 'Post-treatment evaluation', NOW(), NOW()),
(9, 9, '2025-12-04', '10:00:00', 'SCHEDULED', 'Cardiac stress test', 'Pre-surgery evaluation', NOW(), NOW()),
(10, 10, '2025-11-30', '16:00:00', 'CANCELLED', 'Neurological consultation', 'Patient rescheduled', NOW(), NOW()),
(1, 5, '2025-11-25', '12:00:00', 'COMPLETED', 'Follow-up after emergency visit', 'Recovery progressing well', NOW(), NOW()),
(2, 1, '2025-12-05', '11:30:00', 'SCHEDULED', 'Heart palpitations', 'New symptom reported', NOW(), NOW());

-- =============================================
-- BILLS
-- =============================================
INSERT INTO bill (patient_id, bill_date, consultation_fee, medicine_cost, room_charges, lab_charges, other_charges, total_amount, discount, tax, net_amount, payment_status, payment_method, payment_date, notes, created_at, updated_at) VALUES
(1, '2025-11-28', 150.00, 75.50, 0.00, 200.00, 25.00, 450.50, 0.00, 36.04, 486.54, 'PAID', 'CREDIT_CARD', '2025-11-28', 'Emergency visit charges', NOW(), NOW()),
(2, '2025-11-29', 130.00, 45.00, 0.00, 0.00, 0.00, 175.00, 17.50, 12.60, 170.10, 'PAID', 'INSURANCE', '2025-11-30', 'Insurance claim processed', NOW(), NOW()),
(3, '2025-11-27', 160.00, 0.00, 500.00, 150.00, 50.00, 860.00, 86.00, 61.92, 835.92, 'PARTIAL', 'BANK_TRANSFER', NULL, 'Payment plan: 3 installments', NOW(), NOW()),
(4, '2025-11-26', 120.00, 85.00, 0.00, 0.00, 0.00, 205.00, 0.00, 16.40, 221.40, 'PAID', 'CASH', '2025-11-26', 'Vaccination and consultation', NOW(), NOW()),
(5, '2025-11-25', 200.00, 150.00, 1000.00, 350.00, 100.00, 1800.00, 180.00, 129.60, 1749.60, 'PENDING', NULL, NULL, 'Insurance approval pending', NOW(), NOW()),
(6, '2025-11-29', 130.00, 55.00, 0.00, 0.00, 0.00, 185.00, 0.00, 14.80, 199.80, 'PAID', 'DEBIT_CARD', '2025-11-29', 'Dermatology consultation', NOW(), NOW()),
(7, '2025-11-24', 140.00, 0.00, 0.00, 100.00, 0.00, 240.00, 24.00, 17.28, 233.28, 'PAID', 'CREDIT_CARD', '2025-11-24', 'Eye examination with tests', NOW(), NOW()),
(8, '2025-11-23', 180.00, 500.00, 2000.00, 800.00, 200.00, 3680.00, 368.00, 265.00, 3577.00, 'PARTIAL', 'INSURANCE', NULL, 'Oncology treatment - ongoing', NOW(), NOW());

-- =============================================
-- MEDICINES (Inventory)
-- =============================================
INSERT INTO medicine (name, generic_name, manufacturer, description, dosage_form, strength, price, stock_quantity, expiry_date, reorder_level, created_at, updated_at) VALUES
('Amoxicillin', 'Amoxicillin', 'PharmaCorp', 'Antibiotic for bacterial infections', 'Capsule', '500mg', 15.99, 500, '2026-06-15', 100, NOW(), NOW()),
('Lisinopril', 'Lisinopril', 'MedPharm Inc', 'ACE inhibitor for blood pressure', 'Tablet', '10mg', 12.50, 350, '2026-12-31', 75, NOW(), NOW()),
('Metformin', 'Metformin HCl', 'DiabeteCare', 'Oral diabetes medicine', 'Tablet', '850mg', 8.99, 600, '2027-03-20', 150, NOW(), NOW()),
('Ibuprofen', 'Ibuprofen', 'PainRelief Labs', 'NSAID for pain and inflammation', 'Tablet', '400mg', 6.50, 800, '2026-08-10', 200, NOW(), NOW()),
('Omeprazole', 'Omeprazole', 'GastroHealth', 'Proton pump inhibitor', 'Capsule', '20mg', 18.75, 250, '2026-04-25', 50, NOW(), NOW()),
('Atorvastatin', 'Atorvastatin Calcium', 'HeartCare Pharma', 'Cholesterol lowering medication', 'Tablet', '20mg', 22.00, 400, '2027-01-15', 80, NOW(), NOW()),
('Amlodipine', 'Amlodipine Besylate', 'CardioMed', 'Calcium channel blocker', 'Tablet', '5mg', 14.25, 300, '2026-09-30', 60, NOW(), NOW()),
('Levothyroxine', 'Levothyroxine Sodium', 'ThyroidCare', 'Thyroid hormone replacement', 'Tablet', '50mcg', 11.00, 450, '2026-11-20', 100, NOW(), NOW()),
('Prednisone', 'Prednisone', 'ImmunoPharm', 'Corticosteroid anti-inflammatory', 'Tablet', '10mg', 9.50, 200, '2026-05-10', 40, NOW(), NOW()),
('Azithromycin', 'Azithromycin', 'AntiBioTech', 'Macrolide antibiotic', 'Tablet', '250mg', 25.00, 180, '2026-07-05', 35, NOW(), NOW()),
('Gabapentin', 'Gabapentin', 'NeuroCare', 'Anticonvulsant medication', 'Capsule', '300mg', 16.00, 280, '2026-10-15', 55, NOW(), NOW()),
('Aspirin', 'Acetylsalicylic Acid', 'BasicMed', 'Pain reliever and blood thinner', 'Tablet', '81mg', 4.99, 1000, '2027-06-30', 250, NOW(), NOW()),
('Ciprofloxacin', 'Ciprofloxacin', 'InfectioCure', 'Fluoroquinolone antibiotic', 'Tablet', '500mg', 19.99, 150, '2025-12-15', 30, NOW(), NOW()),
('Hydrochlorothiazide', 'Hydrochlorothiazide', 'DiuretiCare', 'Diuretic for hypertension', 'Tablet', '25mg', 7.50, 380, '2026-02-28', 75, NOW(), NOW()),
('Sertraline', 'Sertraline HCl', 'MentalHealth Pharma', 'SSRI antidepressant', 'Tablet', '50mg', 20.00, 220, '2026-08-20', 45, NOW(), NOW());

-- =============================================
-- ROOMS
-- =============================================
INSERT INTO room (room_number, room_type, floor_number, bed_count, daily_rate, status, department_id, facilities, created_at, updated_at) VALUES
('A101', 'GENERAL', 1, 4, 150.00, 'OCCUPIED', 1, 'TV, WiFi, Shared Bathroom', NOW(), NOW()),
('A102', 'GENERAL', 1, 4, 150.00, 'AVAILABLE', 1, 'TV, WiFi, Shared Bathroom', NOW(), NOW()),
('A201', 'PRIVATE', 2, 1, 350.00, 'OCCUPIED', 2, 'TV, WiFi, Private Bathroom, AC, Sofa', NOW(), NOW()),
('A202', 'PRIVATE', 2, 1, 350.00, 'RESERVED', 2, 'TV, WiFi, Private Bathroom, AC, Sofa', NOW(), NOW()),
('B101', 'ICU', 1, 1, 800.00, 'OCCUPIED', 5, 'Ventilator, Cardiac Monitor, Suction', NOW(), NOW()),
('B102', 'ICU', 1, 1, 800.00, 'AVAILABLE', 5, 'Ventilator, Cardiac Monitor, Suction', NOW(), NOW()),
('B103', 'ICU', 1, 1, 800.00, 'MAINTENANCE', 5, 'Ventilator, Cardiac Monitor, Suction', NOW(), NOW()),
('C101', 'EMERGENCY', 1, 6, 200.00, 'AVAILABLE', 5, 'Emergency Equipment, Oxygen', NOW(), NOW()),
('C102', 'EMERGENCY', 1, 6, 200.00, 'OCCUPIED', 5, 'Emergency Equipment, Oxygen', NOW(), NOW()),
('D101', 'OPERATION', 1, 1, 1500.00, 'AVAILABLE', 3, 'Full Surgical Equipment, Anesthesia', NOW(), NOW()),
('D102', 'OPERATION', 1, 1, 1500.00, 'RESERVED', 3, 'Full Surgical Equipment, Anesthesia', NOW(), NOW()),
('E101', 'RECOVERY', 2, 2, 250.00, 'OCCUPIED', 3, 'Monitoring Equipment, Nurse Call', NOW(), NOW()),
('E102', 'RECOVERY', 2, 2, 250.00, 'AVAILABLE', 3, 'Monitoring Equipment, Nurse Call', NOW(), NOW()),
('F101', 'GENERAL', 3, 6, 100.00, 'AVAILABLE', 4, 'Child-friendly, Play Area Access', NOW(), NOW()),
('F102', 'PRIVATE', 3, 1, 400.00, 'AVAILABLE', 4, 'Child-friendly, Parent Bed, Play Area', NOW(), NOW());

-- =============================================
-- MEDICAL RECORDS
-- =============================================
INSERT INTO medical_record (patient_id, doctor_id, record_date, diagnosis, symptoms, treatment, prescription, follow_up_date, notes, created_at, updated_at) VALUES
(1, 1, '2025-11-28', 'Mild Hypertension', 'Elevated blood pressure, occasional headaches', 'Lifestyle modifications, medication', 'Lisinopril 10mg daily, low sodium diet', '2025-12-28', 'Monitor BP daily, report if >140/90', NOW(), NOW()),
(2, 2, '2025-11-29', 'Tension Headache', 'Recurring headaches, neck stiffness', 'Pain management, stress reduction', 'Ibuprofen 400mg as needed, massage therapy', '2025-12-15', 'MRI scheduled if no improvement', NOW(), NOW()),
(5, 5, '2025-11-28', 'Acute Anxiety Attack', 'Chest pain, shortness of breath, palpitations', 'Ruled out cardiac cause, referred to psychiatry', 'Sertraline 50mg daily', '2025-12-05', 'ECG normal, recommend counseling', NOW(), NOW()),
(6, 6, '2025-11-29', 'Contact Dermatitis', 'Itchy red rash on arms, blistering', 'Topical treatment, allergen avoidance', 'Prednisone cream 1%, antihistamine', '2025-12-10', 'Possible nickel allergy - patch test recommended', NOW(), NOW()),
(3, 3, '2025-11-27', 'ACL Sprain Grade II', 'Knee pain, swelling, instability', 'RICE protocol, physical therapy', 'Ibuprofen 400mg TID, knee brace', '2026-01-15', 'Surgery may be needed if no improvement', NOW(), NOW());

