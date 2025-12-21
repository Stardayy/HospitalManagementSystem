-- =====================================================
-- HMS New Features Database Schema
-- Run this script in MySQL to create tables manually
-- Note: With ddl-auto=update, tables are auto-created
-- =====================================================

-- Prescription Table (e-Prescribing)
CREATE TABLE IF NOT EXISTS prescription (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT,
    appointment_id BIGINT,
    prescription_date DATE,
    expiry_date DATE,
    status VARCHAR(30) DEFAULT 'ACTIVE',
    diagnosis VARCHAR(500),
    notes VARCHAR(1000),
    pharmacy_name VARCHAR(200),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (doctor_id) REFERENCES doctor(id),
    FOREIGN KEY (appointment_id) REFERENCES appointment(id)
);

-- Prescription Item Table (Medicines in Prescription)
CREATE TABLE IF NOT EXISTS prescription_item (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    prescription_id BIGINT NOT NULL,
    medicine_id BIGINT,
    medicine_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    duration VARCHAR(100),
    quantity INT,
    instructions VARCHAR(500),
    dispensed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (prescription_id) REFERENCES prescription(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicine(id)
);

-- Staff Table (Staff Management)
CREATE TABLE IF NOT EXISTS staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(30) NOT NULL,
    department_id BIGINT,
    hire_date DATE,
    status VARCHAR(20) DEFAULT 'ACTIVE',
    address VARCHAR(200),
    qualifications VARCHAR(500),
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Shift Table (Shift Scheduling)
CREATE TABLE IF NOT EXISTS shift (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    staff_id BIGINT NOT NULL,
    shift_date DATE NOT NULL,
    shift_type VARCHAR(20) NOT NULL,
    start_time TIME,
    end_time TIME,
    department_id BIGINT,
    status VARCHAR(20) DEFAULT 'SCHEDULED',
    check_in_time DATETIME,
    check_out_time DATETIME,
    notes VARCHAR(500),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (staff_id) REFERENCES staff(id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Insurance Claim Table
CREATE TABLE IF NOT EXISTS insurance_claim (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    bill_id BIGINT,
    admission_id BIGINT,
    claim_number VARCHAR(50) UNIQUE,
    insurance_provider VARCHAR(200) NOT NULL,
    policy_number VARCHAR(100),
    group_number VARCHAR(100),
    subscriber_name VARCHAR(200),
    subscriber_id VARCHAR(100),
    claim_amount DECIMAL(12,2),
    approved_amount DECIMAL(12,2),
    paid_amount DECIMAL(12,2),
    patient_responsibility DECIMAL(12,2),
    status VARCHAR(30) DEFAULT 'DRAFT',
    submission_date DATE,
    response_date DATE,
    payment_date DATE,
    pre_authorization_number VARCHAR(100),
    diagnosis_codes VARCHAR(500),
    procedure_codes VARCHAR(500),
    rejection_reason VARCHAR(1000),
    notes VARCHAR(2000),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (bill_id) REFERENCES bill(id),
    FOREIGN KEY (admission_id) REFERENCES admission(id)
);

-- Emergency Case Table (Triage)
CREATE TABLE IF NOT EXISTS emergency_case (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT,
    patient_name VARCHAR(200),
    patient_age INT,
    patient_gender VARCHAR(10),
    patient_phone VARCHAR(20),
    arrival_time DATETIME NOT NULL,
    triage_level VARCHAR(20) NOT NULL,
    chief_complaint VARCHAR(500) NOT NULL,
    vital_signs VARCHAR(500),
    initial_assessment VARCHAR(2000),
    assigned_doctor_id BIGINT,
    assigned_nurse_id BIGINT,
    treatment_area VARCHAR(50),
    bed_number VARCHAR(20),
    status VARCHAR(30) DEFAULT 'WAITING',
    treatment_notes VARCHAR(2000),
    diagnosis VARCHAR(500),
    disposition VARCHAR(500),
    treatment_start_time DATETIME,
    treatment_end_time DATETIME,
    discharge_time DATETIME,
    admission_id BIGINT,
    ambulance_arrival BOOLEAN,
    brought_by VARCHAR(200),
    notes VARCHAR(2000),
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (patient_id) REFERENCES patient(id),
    FOREIGN KEY (assigned_doctor_id) REFERENCES doctor(id),
    FOREIGN KEY (assigned_nurse_id) REFERENCES staff(id),
    FOREIGN KEY (admission_id) REFERENCES admission(id)
);

-- Audit Log Table (Compliance & Security)
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(100),
    user_role VARCHAR(50),
    action VARCHAR(50) NOT NULL,
    entity_name VARCHAR(100),
    entity_id VARCHAR(50),
    details VARCHAR(1000),
    ip_address VARCHAR(50),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_prescription_patient ON prescription(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescription_doctor ON prescription(doctor_id);
CREATE INDEX IF NOT EXISTS idx_prescription_status ON prescription(status);
CREATE INDEX IF NOT EXISTS idx_shift_staff ON shift(staff_id);
CREATE INDEX IF NOT EXISTS idx_shift_date ON shift(shift_date);
CREATE INDEX IF NOT EXISTS idx_insurance_patient ON insurance_claim(patient_id);
CREATE INDEX IF NOT EXISTS idx_insurance_status ON insurance_claim(status);
CREATE INDEX IF NOT EXISTS idx_emergency_status ON emergency_case(status);
CREATE INDEX IF NOT EXISTS idx_emergency_triage ON emergency_case(triage_level);
CREATE INDEX IF NOT EXISTS idx_staff_role ON staff(role);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_username ON audit_log(username);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);

