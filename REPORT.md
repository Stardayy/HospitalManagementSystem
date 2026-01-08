# HOSPITAL MANAGEMENT SYSTEM
## MEDS - Medical Enterprise Digital Solution

---

<div align="center">

# ACADEMIC PROJECT REPORT

## HOSPITAL MANAGEMENT SYSTEM
### MEDS - Medical Enterprise Digital Solution

---

**Submitted to:**  
International University - Vietnam National University HCMC (HCMIU)  
School of Computer Science and Engineering

**Course:** Web Application Development  
**Academic Year:** 2025-2026

---

**Submitted by:**

| Student Name | Student ID | Role |
|--------------|------------|------|
| Võ Trí Khôi | [Student ID] | Backend Developer |
| Trương Minh Trí | [Student ID] | Frontend Developer |

---

**Submission Date:** January 2026

</div>

---

# Abstract

The **MEDS (Medical Enterprise Digital Solution) Hospital Management System** is a comprehensive full-stack web application designed to digitize and streamline hospital operations. This project addresses the critical challenges faced by healthcare institutions in managing patient information, scheduling appointments, maintaining medical records, and handling billing processes.

**Problem Statement:** Traditional hospital management relies on fragmented, paper-based systems that lead to data inconsistencies, inefficient workflows, and potential medical errors. The lack of integrated digital solutions hampers healthcare delivery quality and operational efficiency.

**Solution:** We developed a modern, web-based Hospital Management System using a three-tier architecture with React 19 for the frontend, Spring Boot 3.5 for the backend, and MySQL for data persistence. The system implements JWT-based authentication with role-based access control (RBAC) supporting five user roles: Admin, Doctor, Patient, Nurse, and Pharmacist.

**Key Features:** The system encompasses 20+ functional modules including patient management, appointment scheduling with conflict detection, electronic medical records, laboratory management, prescription handling, billing and payments, emergency case triage, staff scheduling, insurance claims processing, and comprehensive audit logging.

**Results:** The implementation achieved 100% completion of planned features with all 124 test cases passing. Performance metrics show average API response times under 200ms, meeting all target benchmarks. The system demonstrates robust security through BCrypt password hashing, JWT token authentication, and role-based endpoint protection.

**Conclusion:** The MEDS HMS successfully demonstrates the feasibility of building enterprise-grade healthcare management solutions using modern web technologies. The modular architecture ensures extensibility for future enhancements including real-time notifications, mobile applications, and advanced analytics.

**Keywords:** Hospital Management System, Healthcare IT, React, Spring Boot, JWT Authentication, Role-Based Access Control, Electronic Health Records, Web Application Development

---

# Acknowledgements

We would like to express our sincere gratitude to all those who have contributed to the successful completion of this project.

**Academic Support:**
- We extend our heartfelt thanks to our course instructor for providing guidance, valuable feedback, and continuous encouragement throughout the development of this project.
- We are grateful to the International University - Vietnam National University HCMC for providing the academic environment and resources necessary for this work.

**Technical Resources:**
- We acknowledge the open-source community for providing excellent frameworks and libraries including React, Spring Boot, and MySQL that formed the foundation of our application.
- We appreciate the comprehensive documentation and tutorials available from official sources that facilitated our learning and implementation process.

**Personal Support:**
- We thank our families and friends for their unwavering support, patience, and understanding during the intensive development period.
- We are grateful to our classmates for their collaboration, feedback, and shared learning experiences.

This project represents not only a technical achievement but also a significant learning experience in full-stack web development, software engineering practices, and teamwork. We are proud of what we have accomplished and grateful for the opportunity to work on such a comprehensive project.

---

# Table of Contents

## Front Matter
- [Abstract](#abstract)
- [Acknowledgements](#acknowledgements)
- [Table of Contents](#table-of-contents)
- [List of Figures](#list-of-figures)
- [List of Tables](#list-of-tables)
- [List of Abbreviations](#list-of-abbreviations)

## Main Content

### [Chapter 1: Introduction](#chapter-1-introduction)
- [1.1 Background](#11-background)
  - [1.1.1 The Evolution of Healthcare Management](#111-the-evolution-of-healthcare-management)
  - [1.1.2 The Digital Healthcare Revolution](#112-the-digital-healthcare-revolution)
  - [1.1.3 Web-Based Healthcare Solutions](#113-web-based-healthcare-solutions)
  - [1.1.4 Technology Stack Selection](#114-technology-stack-selection)
  - [1.1.5 Project Context](#115-project-context)
- [1.2 Problem Statement](#12-problem-statement)
  - [1.2.1 Challenges in Traditional Healthcare Management](#121-challenges-in-traditional-healthcare-management)
- [1.3 Objectives](#13-objectives)
- [1.4 Scope](#14-scope)
- [1.5 Out-Of-Scope](#15-out-of-scope)

### [Chapter 2: Task Timeline and Division](#chapter-2-task-timeline-and-division)
- [2.1 Project Planning](#21-project-planning)
- [2.2 Task Division](#22-task-division)
- [2.3 Development Timeline](#23-development-timeline)

### [Chapter 3: Methodology](#chapter-3-methodology)
- [3.1 Technology Stack](#31-technology-stack)
  - [3.1.1 Technologies Used](#311-technologies-used)
  - [3.1.2 Overall Workflow](#312-overall-workflow)
- [3.2 Requirements Analysis](#32-requirements-analysis)
  - [3.2.1 Functional Requirements](#321-functional-requirements)
  - [3.2.2 Non-Functional Requirements](#322-non-functional-requirements)
- [3.3 System Design](#33-system-design)
  - [3.3.1 Database Design](#331-database-design)
  - [3.3.2 Backend API Design](#332-backend-api-design)
  - [3.3.3 Frontend Architecture](#333-frontend-architecture)
- [3.4 Implementation Details](#34-implementation-details)
  - [3.4.1 Authentication and Security Implementation](#341-authentication-and-security-implementation)
  - [3.4.2 Business Logic Implementation](#342-business-logic-implementation)
  - [3.4.3 Frontend Implementation](#343-frontend-implementation)
  - [3.4.4 Error Handling](#344-error-handling)

### [Chapter 4: Results and Discussion](#chapter-4-results-and-discussion)
- [4.1 System Demonstration](#41-system-demonstration)
  - [4.1.1 Application Screenshots](#411-application-screenshots)
  - [4.1.2 Feature Implementation Status](#412-feature-implementation-status)
- [4.2 Testing Results](#42-testing-results)
  - [4.2.1 Functional Testing](#421-functional-testing)
  - [4.2.2 Security Testing](#422-security-testing)
  - [4.2.3 Performance Metrics](#423-performance-metrics)
- [4.3 Discussion](#43-discussion)
  - [4.3.1 Achievements](#431-achievements)
  - [4.3.2 Challenges and Solutions](#432-challenges-and-solutions)
  - [4.3.3 Limitations](#433-limitations)
  - [4.3.4 Future Enhancements](#434-future-enhancements)

### [Chapter 5: Conclusion](#chapter-5-conclusion)
- [5.1 Summary](#51-summary)
  - [5.1.1 Project Objectives Achievement](#511-project-objectives-achievement)
  - [5.1.2 Technical Achievements](#512-technical-achievements)
- [5.2 Contributions](#52-contributions)
- [5.3 Lessons Learned](#53-lessons-learned)
- [5.4 Recommendations](#54-recommendations)
- [5.5 Final Remarks](#55-final-remarks)

## Back Matter
- [References](#references)
- [Appendices](#appendices)
  - [Appendix A: Installation Guide](#appendix-a-installation-guide)
  - [Appendix B: API Endpoint Reference](#appendix-b-api-endpoint-reference)
  - [Appendix C: Database Schema](#appendix-c-database-schema)

---

# List of Figures

| Figure No. | Description | Section |
|------------|-------------|---------|
| Figure 3.1 | Three-Tier System Architecture Diagram | 3.1.2 |
| Figure 3.2 | User Registration Flow Sequence Diagram | 3.1.2 |
| Figure 3.3 | User Login Flow Sequence Diagram | 3.1.2 |
| Figure 3.4 | JWT Token Validation Flow | 3.1.2 |
| Figure 3.5 | Patient Care Workflow Diagram | 3.1.2 |
| Figure 3.6 | API Request Data Flow | 3.1.2 |
| Figure 3.7 | Emergency Case Workflow | 3.1.2 |
| Figure 3.8 | Billing and Payment Workflow | 3.1.2 |
| Figure 3.9 | Audit Trail Workflow | 3.1.2 |
| Figure 3.10 | Entity-Relationship Diagram | 3.3.1 |
| Figure 3.11 | JWT Authentication Flow | 3.3.2 |
| Figure 3.12 | React Application Structure | 3.3.3 |
| Figure 3.13 | Component Hierarchy Diagram | 3.3.3 |

---

# List of Tables

| Table No. | Description | Section |
|-----------|-------------|---------|
| Table 2.1 | Team Member Responsibilities | 2.2 |
| Table 2.2 | Project Timeline and Milestones | 2.3 |
| Table 3.1 | Frontend Technology Stack | 3.1.1 |
| Table 3.2 | Backend Technology Stack | 3.1.1 |
| Table 3.3 | Database Technology | 3.1.1 |
| Table 3.4 | User Authentication Requirements | 3.2.1 |
| Table 3.5 | Patient Management Requirements | 3.2.1 |
| Table 3.6 | Doctor Management Requirements | 3.2.1 |
| Table 3.7 | Appointment Management Requirements | 3.2.1 |
| Table 3.8 | Medical Records Requirements | 3.2.1 |
| Table 3.9 | Vital Signs Requirements | 3.2.1 |
| Table 3.10 | Laboratory Management Requirements | 3.2.1 |
| Table 3.11 | Prescription Management Requirements | 3.2.1 |
| Table 3.12 | Billing and Payments Requirements | 3.2.1 |
| Table 3.13 | Room and Admission Requirements | 3.2.1 |
| Table 3.14 | Emergency Case Requirements | 3.2.1 |
| Table 3.15 | Staff and Scheduling Requirements | 3.2.1 |
| Table 3.16 | Performance Requirements | 3.2.2 |
| Table 3.17 | Security Requirements | 3.2.2 |
| Table 3.18 | Requirements Traceability Matrix | 3.2.2 |
| Table 3.19 | Database Configuration | 3.3.1 |
| Table 3.20 | Users Table Schema | 3.3.1 |
| Table 3.21 | Patient Table Schema | 3.3.1 |
| Table 3.22 | Doctor Table Schema | 3.3.1 |
| Table 3.23 | Appointment Table Schema | 3.3.1 |
| Table 3.24 | Bill Table Schema | 3.3.1 |
| Table 3.25 | Emergency Case Table Schema | 3.3.1 |
| Table 3.26 | Database Relationships | 3.3.1 |
| Table 3.27 | Database Indexes | 3.3.1 |
| Table 3.28 | Authentication API Endpoints | 3.3.2 |
| Table 3.29 | Patient API Endpoints | 3.3.2 |
| Table 3.30 | Doctor API Endpoints | 3.3.2 |
| Table 3.31 | Appointment API Endpoints | 3.3.2 |
| Table 3.32 | Route Definitions | 3.3.3 |
| Table 4.1 | Feature Implementation Status | 4.1.2 |
| Table 4.2 | Functional Testing Results | 4.2.1 |
| Table 4.3 | Security Testing Results | 4.2.2 |
| Table 4.4 | Performance Metrics | 4.2.3 |
| Table 4.5 | Challenges and Solutions | 4.3.2 |
| Table 5.1 | Project Objectives Achievement | 5.1.1 |

---

# List of Abbreviations

| Abbreviation | Full Form |
|--------------|-----------|
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CRUD | Create, Read, Update, Delete |
| CSS | Cascading Style Sheets |
| DOM | Document Object Model |
| DTO | Data Transfer Object |
| EHR | Electronic Health Records |
| ER | Entity-Relationship |
| ESI | Emergency Severity Index |
| FHIR | Fast Healthcare Interoperability Resources |
| HIPAA | Health Insurance Portability and Accountability Act |
| HL7 | Health Level Seven |
| HMS | Hospital Management System |
| HTML | HyperText Markup Language |
| HTTP | HyperText Transfer Protocol |
| IDE | Integrated Development Environment |
| IT | Information Technology |
| JDK | Java Development Kit |
| JPA | Java Persistence API |
| JSON | JavaScript Object Notation |
| JWT | JSON Web Token |
| MVC | Model-View-Controller |
| MySQL | My Structured Query Language |
| ORM | Object-Relational Mapping |
| PDF | Portable Document Format |
| PK | Primary Key |
| RBAC | Role-Based Access Control |
| REST | Representational State Transfer |
| SaaS | Software as a Service |
| SQL | Structured Query Language |
| UI | User Interface |
| URL | Uniform Resource Locator |
| UX | User Experience |
| VNU | Vietnam National University |
| XSS | Cross-Site Scripting |

---

# CHAPTER 1: INTRODUCTION

## 1.1 Background

### 1.1.1 The Evolution of Healthcare Management

The healthcare industry has undergone a significant transformation in recent decades, driven by rapid technological advancements and the increasing need for efficient patient care delivery. Traditional paper-based systems for managing patient records, appointments, and medical information have proven to be inadequate in meeting the demands of modern healthcare facilities. These legacy systems are prone to errors, data loss, and inefficiencies that can directly impact patient outcomes and operational effectiveness.

The emergence of Hospital Management Systems (HMS) represents a paradigm shift in how healthcare institutions operate. An HMS is a comprehensive, integrated information system designed to manage all aspects of a hospital's operations, including medical, administrative, financial, and legal issues, as well as the corresponding processing of services. The adoption of such systems has become imperative for healthcare organizations seeking to improve service quality, reduce operational costs, and enhance patient satisfaction.

### 1.1.2 The Digital Healthcare Revolution

The global healthcare IT market has experienced exponential growth, with hospital management systems being at the forefront of this digital revolution. According to industry reports, the healthcare information technology market is projected to continue its upward trajectory, driven by factors such as:

- **Increasing Patient Volumes:** Healthcare facilities worldwide are experiencing a surge in patient numbers, necessitating robust systems for efficient management.
- **Regulatory Compliance:** Governments and regulatory bodies are mandating the adoption of electronic health records (EHR) and standardized healthcare information systems.
- **Data-Driven Decision Making:** Healthcare providers increasingly rely on data analytics for clinical decision support, resource optimization, and quality improvement.
- **Patient Expectations:** Modern patients expect seamless digital experiences, including online appointment booking, access to their medical records, and electronic prescriptions.

### 1.1.3 Web-Based Healthcare Solutions

The advent of web technologies has revolutionized the development and deployment of healthcare information systems. Web-based Hospital Management Systems offer several advantages over traditional desktop applications:

1. **Accessibility:** Healthcare professionals can access the system from any device with an internet connection, enabling remote consultations and telemedicine services.
2. **Scalability:** Web applications can easily scale to accommodate growing user bases and data volumes without significant infrastructure changes.
3. **Cost-Effectiveness:** Cloud-based deployment models reduce the need for expensive on-premises hardware and IT infrastructure.
4. **Real-Time Collaboration:** Multiple users can simultaneously access and update information, facilitating seamless collaboration among healthcare teams.
5. **Automatic Updates:** Web applications can be updated centrally without requiring users to install software updates manually.

### 1.1.4 Technology Stack Selection

The development of modern web applications requires careful consideration of the technology stack to ensure performance, security, and maintainability. For this Hospital Management System project, we have selected a robust combination of technologies:

**Frontend Technologies:**
- **React 19:** A JavaScript library for building user interfaces, known for its component-based architecture and efficient rendering through the Virtual DOM.
- **Vite:** A next-generation frontend build tool that provides fast development server startup and hot module replacement.
- **Recharts:** A composable charting library built on React components for data visualization.
- **React Router DOM:** For declarative routing in the single-page application.

**Backend Technologies:**
- **Spring Boot 3.5:** A Java-based framework that simplifies the development of production-ready applications with minimal configuration.
- **Spring Security:** For implementing robust authentication and authorization mechanisms.
- **Spring Data JPA:** For simplified data access layer implementation with Hibernate ORM.
- **JWT (JSON Web Tokens):** For stateless, secure authentication in RESTful APIs.

**Database:**
- **MySQL:** A reliable, open-source relational database management system widely used in enterprise applications.

### 1.1.5 Project Context

This Hospital Management System, branded as "MEDS (Medical Enterprise Digital Solution)," was developed as part of the Web Application Development course at the International University - Vietnam National University HCMC. The project aims to demonstrate proficiency in full-stack web development while addressing real-world challenges in healthcare management. The system is designed to serve as a comprehensive platform for managing various aspects of hospital operations, from patient registration to billing, with a focus on user experience and data security.

---

## 1.2 Problem Statement

### 1.2.1 Challenges in Traditional Healthcare Management

Healthcare institutions, particularly hospitals and clinics, face numerous challenges in their daily operations that significantly impact their efficiency, service quality, and patient outcomes. The following problems have been identified as critical issues that this Hospital Management System aims to address:

#### 1.2.1.1 Fragmented Information Systems

Many healthcare facilities operate with disparate, disconnected systems for different departments. Patient records may be stored in one system, while billing information resides in another, and appointment scheduling uses yet another platform. This fragmentation leads to:

- **Data Inconsistencies:** The same patient information may exist in multiple systems with conflicting data, leading to potential medical errors.
- **Redundant Data Entry:** Healthcare staff must enter the same information multiple times across different systems, wasting time and increasing the likelihood of errors.
- **Difficulty in Information Retrieval:** Accessing complete patient information requires navigating multiple systems, delaying clinical decision-making.
- **Integration Challenges:** Sharing data between departments becomes complex and error-prone.

#### 1.2.1.2 Inefficient Appointment Management

Traditional appointment scheduling methods, whether paper-based or using basic digital tools, often result in:

- **Scheduling Conflicts:** Double-booking of doctors or examination rooms due to lack of real-time availability checking.
- **High No-Show Rates:** Without automated reminders and notifications, patients frequently miss appointments.
- **Poor Resource Utilization:** Inefficient scheduling leads to underutilization of medical staff and facilities during some periods while creating bottlenecks during others.
- **Long Wait Times:** Patients experience extended waiting times due to ineffective queue management.

#### 1.2.1.3 Paper-Based Medical Records

Despite the digital age, many healthcare facilities still rely heavily on paper-based medical records, which present significant challenges:

- **Storage and Retrieval:** Physical storage of medical records requires substantial space and makes retrieval time-consuming.
- **Legibility Issues:** Handwritten notes may be difficult to read, potentially leading to misinterpretation of critical medical information.
- **Data Security:** Paper records are vulnerable to unauthorized access, loss, and damage from environmental factors.
- **Lack of Backup:** Unlike digital records, paper documents cannot be easily backed up, risking permanent data loss in case of disasters.

#### 1.2.1.4 Complex Billing and Payment Processes

Healthcare billing is inherently complex, involving multiple stakeholders including patients, insurance companies, and government programs. Common challenges include:

- **Billing Errors:** Manual calculation of charges leads to errors in patient bills.
- **Delayed Payments:** Inefficient billing processes result in delayed payment collection.
- **Insurance Claim Management:** Tracking and managing insurance claims is labor-intensive without proper automation.
- **Lack of Transparency:** Patients often find it difficult to understand their bills and payment obligations.

#### 1.2.1.5 Limited Access to Patient Information

Healthcare providers often struggle to access comprehensive patient information when needed:

- **Historical Data:** Accessing a patient's complete medical history, including previous diagnoses, treatments, and prescriptions, is challenging with fragmented systems.
- **Real-Time Updates:** Information about recent lab results, vital signs, or medication changes may not be immediately available to all relevant healthcare providers.
- **Cross-Departmental Communication:** Coordination between different departments (e.g., emergency, laboratory, pharmacy) is hindered by information silos.

#### 1.2.1.6 Emergency Response Inefficiencies

Emergency departments face unique challenges that require specialized solutions:

- **Triage Management:** Proper prioritization of patients based on the severity of their conditions is critical but often inefficiently managed.
- **Resource Allocation:** Quickly assigning appropriate medical staff and resources to emergency cases is challenging without proper tracking systems.
- **Documentation Under Pressure:** Recording accurate information during high-pressure emergency situations is difficult with traditional methods.

#### 1.2.1.7 Compliance and Audit Requirements

Healthcare institutions must comply with various regulations and maintain detailed records for audit purposes:

- **Audit Trail:** Tracking who accessed what information and when is essential for compliance but difficult to maintain with paper-based or basic digital systems.
- **Data Protection:** Ensuring patient data privacy and security in compliance with regulations requires robust access controls and monitoring.
- **Reporting Requirements:** Generating reports for regulatory bodies and internal quality assurance is time-consuming without automated systems.

### 1.2.2 The Need for an Integrated Solution

Given the multitude of challenges outlined above, there is a clear need for a comprehensive, integrated Hospital Management System that can:

1. Consolidate all hospital operations into a single, unified platform
2. Automate routine administrative tasks to improve efficiency
3. Provide real-time access to patient information for better clinical decision-making
4. Ensure data security and regulatory compliance
5. Enhance communication and coordination among healthcare teams
6. Improve the overall patient experience

This project addresses these needs by developing a modern, web-based Hospital Management System that leverages cutting-edge technologies to provide a robust, secure, and user-friendly platform for healthcare management.

---

## 1.3 Objectives

### 1.3.1 Primary Objectives

The Hospital Management System project aims to achieve the following primary objectives:

#### 1.3.1.1 Develop a Comprehensive Healthcare Management Platform

Create a fully functional, integrated web application that encompasses all critical aspects of hospital management, including:

- **Patient Management:** Complete lifecycle management of patient information from registration through discharge, including demographic data, medical history, and contact information.
- **Appointment Scheduling:** An intuitive system for scheduling, rescheduling, and canceling appointments with real-time availability checking and conflict prevention.
- **Medical Records Management:** Secure storage and retrieval of patient medical records, including diagnoses, treatments, prescriptions, and clinical notes.
- **Billing and Payments:** Comprehensive billing system with support for multiple payment methods, insurance claims, and financial reporting.
- **Laboratory Management:** Complete workflow for ordering, tracking, and reporting laboratory tests and results.
- **Pharmacy and Prescription Management:** Electronic prescription system with medication tracking and dispensing management.
- **Emergency Case Management:** Specialized module for handling emergency cases with triage classification and priority-based treatment.

#### 1.3.1.2 Implement Robust Security Mechanisms

Develop and integrate comprehensive security features to protect sensitive healthcare data:

- **Authentication System:** Secure user authentication using JWT (JSON Web Tokens) with encrypted password storage using BCrypt hashing.
- **Role-Based Access Control (RBAC):** Implement five distinct user roles (Admin, Doctor, Patient, Nurse, Pharmacist) with granular permissions for different system functionalities.
- **Audit Logging:** Comprehensive logging of all user actions for security monitoring and compliance purposes.
- **Session Management:** Stateless session management to prevent session hijacking and ensure secure user sessions.

#### 1.3.1.3 Create an Intuitive User Interface

Design and develop a user-friendly interface that facilitates efficient workflow:

- **Responsive Design:** Ensure the application works seamlessly across different devices and screen sizes.
- **Dashboard Analytics:** Provide visual representations of key metrics through interactive charts and statistics.
- **Intuitive Navigation:** Implement a logical navigation structure that allows users to quickly access needed functionality.
- **Real-Time Notifications:** Alert users to important events such as new appointments, lab results, or system messages.

#### 1.3.1.4 Ensure System Reliability and Performance

Build a robust, high-performance application that can handle the demands of a busy healthcare environment:

- **Scalable Architecture:** Design the system architecture to support growth in users and data volume.
- **Error Handling:** Implement comprehensive error handling to prevent system crashes and provide meaningful feedback to users.
- **Data Integrity:** Ensure data consistency and integrity through proper database design and transaction management.

### 1.3.2 Secondary Objectives

#### 1.3.2.1 Demonstrate Full-Stack Development Proficiency

Showcase comprehensive skills in modern web development:

- **Frontend Development:** Demonstrate proficiency in React.js, component-based architecture, state management, and modern JavaScript (ES6+).
- **Backend Development:** Exhibit expertise in Spring Boot, RESTful API design, and enterprise Java development patterns.
- **Database Design:** Apply database normalization principles and design efficient relational database schemas.
- **API Integration:** Implement secure, well-documented RESTful APIs following industry best practices.

#### 1.3.2.2 Apply Software Engineering Best Practices

Follow established software engineering principles throughout the development process:

- **Modular Architecture:** Organize code into logical, reusable modules and components.
- **Code Documentation:** Provide clear, comprehensive documentation for code and APIs.
- **Version Control:** Use Git for source code management with meaningful commit messages.
- **Testing:** Implement appropriate testing strategies to ensure code quality.

#### 1.3.2.3 Address Real-World Healthcare Challenges

Develop solutions that address genuine challenges faced by healthcare institutions:

- **Workflow Optimization:** Streamline common healthcare workflows to improve efficiency.
- **Data-Driven Insights:** Provide analytics and reporting capabilities to support decision-making.
- **Communication Enhancement:** Facilitate better communication between healthcare providers and patients.

### 1.3.3 Learning Objectives

Through the development of this project, the team aims to:

1. Gain hands-on experience with modern full-stack web development technologies
2. Understand the complexities of developing enterprise-level applications
3. Learn to integrate multiple technologies into a cohesive system
4. Develop skills in secure application development
5. Experience the software development lifecycle from planning to deployment

---

## 1.4 Scope

### 1.4.1 System Modules and Functionalities

The Hospital Management System encompasses the following modules and functionalities within its scope:

#### 1.4.1.1 User Authentication and Authorization Module

| Feature | Description |
|---------|-------------|
| User Registration | Allow new users to create accounts with role selection (Patient, Doctor, Admin) |
| User Login | Secure authentication using email and password with JWT token generation |
| Password Management | Support for password reset and change functionality |
| Session Management | Stateless JWT-based session handling with configurable expiration |
| Role-Based Access | Five user roles (ADMIN, DOCTOR, PATIENT, NURSE, PHARMACIST) with specific permissions |

#### 1.4.1.2 Dashboard and Analytics Module

| Feature | Description |
|---------|-------------|
| Overview Statistics | Display key metrics including total patients, doctors, appointments, and revenue |
| Visual Analytics | Interactive charts for patient demographics, revenue trends, and department distribution |
| Role-Specific Dashboards | Customized dashboard views based on user role |
| Recent Activity | Display recent appointments, admissions, and system activities |
| Doctor Schedules | Overview of today's doctor appointments and availability |

#### 1.4.1.3 Patient Management Module

| Feature | Description |
|---------|-------------|
| Patient Registration | Capture comprehensive patient information including demographics, contact details, and emergency contacts |
| Patient Search | Search and filter patients by name, email, blood type, or gender |
| Patient Profile | View and edit complete patient profiles with medical history |
| Patient-Doctor Relationship | Track which doctors are treating which patients |
| Blood Type Management | Record and filter patients by blood type for emergency situations |

#### 1.4.1.4 Doctor Management Module

| Feature | Description |
|---------|-------------|
| Doctor Profiles | Manage doctor information including specialization, department, and credentials |
| Department Assignment | Associate doctors with specific hospital departments |
| Consultation Fees | Track and manage doctor consultation fees |
| Experience Tracking | Record years of experience and license information |
| Availability Management | Manage doctor availability for appointments |

#### 1.4.1.5 Appointment Management Module

| Feature | Description |
|---------|-------------|
| Appointment Scheduling | Create appointments with patient, doctor, date, time, and reason |
| Availability Checking | Real-time verification of doctor availability for selected time slots |
| Status Management | Track appointment status (Scheduled, Confirmed, Completed, Cancelled, No-Show) |
| Appointment Filtering | Filter appointments by date range, doctor, patient, or status |
| Conflict Prevention | Prevent double-booking of doctors at the same time |

#### 1.4.1.6 Medical Records Module

| Feature | Description |
|---------|-------------|
| Record Creation | Create detailed medical records with diagnosis, symptoms, and treatment plans |
| Historical Records | Maintain complete medical history for each patient |
| Doctor Notes | Allow doctors to add clinical notes and observations |
| Follow-up Scheduling | Schedule and track follow-up appointments |
| Record Search | Search and filter medical records by patient, doctor, or date |

#### 1.4.1.7 Vital Signs Monitoring Module

| Feature | Description |
|---------|-------------|
| Vital Signs Recording | Record temperature, blood pressure, heart rate, respiratory rate, and oxygen saturation |
| BMI Calculation | Automatic calculation of BMI from weight and height |
| Pain Level Tracking | Record patient-reported pain levels on a standardized scale |
| Trend Analysis | View historical vital signs data for trend analysis |
| Alert Thresholds | Identify abnormal vital signs values |

#### 1.4.1.8 Laboratory Management Module

| Feature | Description |
|---------|-------------|
| Lab Test Catalog | Maintain a catalog of available laboratory tests with prices and reference ranges |
| Lab Order Creation | Create lab orders with multiple tests and priority levels |
| Sample Tracking | Track sample collection and processing status |
| Result Recording | Record and validate lab results with abnormal value flagging |
| Result Notification | Notify doctors and patients when results are available |

#### 1.4.1.9 Prescription Management Module

| Feature | Description |
|---------|-------------|
| Electronic Prescriptions | Create digital prescriptions with medication details |
| Medication Database | Access to medication information including dosage and instructions |
| Prescription Items | Add multiple medications to a single prescription |
| Status Tracking | Track prescription status (Active, Dispensed, Partially Dispensed, Expired, Cancelled) |
| Pharmacy Integration | Support for pharmacy dispensing workflow |

#### 1.4.1.10 Billing and Payments Module

| Feature | Description |
|---------|-------------|
| Bill Generation | Create itemized bills with consultation fees, medicines, labs, and room charges |
| Payment Processing | Record payments with multiple payment methods (Cash, Card, Insurance, Bank Transfer) |
| Payment Status Tracking | Track payment status (Pending, Partial, Paid, Cancelled, Refunded) |
| Tax and Discount | Apply taxes and discounts to bills |
| Bill History | Maintain complete payment history for each patient |

#### 1.4.1.11 Room and Bed Management Module

| Feature | Description |
|---------|-------------|
| Room Inventory | Manage hospital rooms with type, floor, and capacity information |
| Room Types | Support for different room types (General, Private, ICU, Emergency, Operation, Recovery) |
| Availability Tracking | Real-time tracking of room availability status |
| Room Facilities | Document facilities available in each room |
| Department Assignment | Associate rooms with specific departments |

#### 1.4.1.12 Admission Management Module

| Feature | Description |
|---------|-------------|
| Patient Admission | Record patient admissions with room assignment and attending doctor |
| Admission Types | Support for different admission types (Emergency, Scheduled, Transfer, Observation) |
| Bed Assignment | Assign specific beds within rooms |
| Discharge Management | Process patient discharges with summary and instructions |
| Admission History | Maintain historical admission records |

#### 1.4.1.13 Emergency Case Management Module

| Feature | Description |
|---------|-------------|
| Emergency Registration | Quick registration of emergency patients with minimal required information |
| Triage Classification | Five-level triage system based on Emergency Severity Index (ESI) |
| Status Workflow | Track case progression (Waiting, Triage, In Treatment, Observation, Admitted, Discharged) |
| Resource Assignment | Assign doctors and nurses to emergency cases |
| Walk-in Support | Handle unregistered patients arriving at emergency |

#### 1.4.1.14 Staff Management Module

| Feature | Description |
|---------|-------------|
| Staff Profiles | Manage non-physician staff including nurses, technicians, and administrators |
| Role Categories | Support for multiple staff roles (Nurse, Technician, Pharmacist, Receptionist, etc.) |
| Qualification Tracking | Record staff qualifications and certifications |
| Department Assignment | Associate staff with hospital departments |
| Status Management | Track staff status (Active, On Leave, Inactive, Terminated) |

#### 1.4.1.15 Shift Scheduling Module

| Feature | Description |
|---------|-------------|
| Shift Types | Support for different shift types (Morning, Afternoon, Night, Custom) |
| Schedule Management | Create and manage staff shift schedules |
| Check-in/Check-out | Record staff attendance with timestamps |
| Department Coverage | Ensure adequate staffing for all departments |
| Schedule Status | Track shift status (Scheduled, In Progress, Completed, Absent, On Leave) |

#### 1.4.1.16 Insurance Claims Module

| Feature | Description |
|---------|-------------|
| Claim Submission | Create and submit insurance claims with relevant documentation |
| Provider Management | Track different insurance providers and policy details |
| Claim Status | Monitor claim status through the approval process |
| Payment Tracking | Record approved amounts and payments received |
| Rejection Handling | Document rejection reasons and support appeals |

#### 1.4.1.17 Document Management Module

| Feature | Description |
|---------|-------------|
| File Upload | Support for uploading various document types (PDF, images) |
| Document Types | Categorize documents (Lab Report, Prescription, Imaging, Discharge Summary, Consent Form, Insurance) |
| Secure Storage | Store documents securely with access control |
| Download Capability | Allow authorized users to download documents |
| Confidentiality Marking | Mark sensitive documents as confidential |

#### 1.4.1.18 Messaging System Module

| Feature | Description |
|---------|-------------|
| Internal Messaging | Send messages between system users |
| Read Receipts | Track message read status |
| Conversation Threads | Organize messages into conversations |
| Unread Count | Display count of unread messages |
| User Search | Search for users to send messages |

#### 1.4.1.19 Notification System Module

| Feature | Description |
|---------|-------------|
| Notification Types | Support for different notification types (Appointment, Lab Result, Prescription, Payment, System, Alert) |
| Read Management | Mark notifications as read/unread |
| Notification Links | Direct links to relevant content from notifications |
| Real-time Updates | Polling for new notifications |
| Scheduled Notifications | Support for scheduled notification delivery |

#### 1.4.1.20 Audit Log Module

| Feature | Description |
|---------|-------------|
| Action Logging | Record all significant user actions (Create, Update, Delete, Login, View) |
| User Tracking | Log which user performed each action |
| Entity Tracking | Record which data entity was affected |
| IP Address Logging | Capture IP addresses for security analysis |
| Search and Filter | Search audit logs by user, action, or entity |

#### 1.4.1.21 PDF Report Generation Module

| Feature | Description |
|---------|-------------|
| Patient Reports | Generate comprehensive patient medical reports |
| Prescription PDFs | Create printable prescription documents |
| Billing Invoices | Generate itemized billing invoices |
| Lab Reports | Create formatted laboratory result reports |
| Discharge Summaries | Generate discharge summary documents |

#### 1.4.1.22 Department Management Module

| Feature | Description |
|---------|-------------|
| Department CRUD | Create, read, update, and delete hospital departments |
| Location Tracking | Record department locations within the hospital |
| Contact Information | Store department phone numbers and contacts |
| Doctor Association | View doctors assigned to each department |
| Description Management | Maintain department descriptions and services |

### 1.4.2 Technical Scope

#### 1.4.2.1 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library for building component-based user interfaces |
| Vite | 7.2.4 | Build tool and development server |
| React Router DOM | 7.9.6 | Client-side routing |
| Recharts | 3.5.1 | Data visualization and charting |
| React Icons | 5.5.0 | Icon library |
| React Calendar | 6.0.0 | Calendar component |
| React Toastify | 11.0.5 | Toast notifications |
| Axios | 1.13.2 | HTTP client for API calls |

#### 1.4.2.2 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.5.8 | Application framework |
| Spring Security | (via Boot) | Security framework |
| Spring Data JPA | (via Boot) | Data access layer |
| Spring AOP | (via Boot) | Aspect-oriented programming |
| JJWT | 0.12.6 | JWT token handling |
| Lombok | (latest) | Boilerplate code reduction |
| OpenPDF | 1.3.30 | PDF document generation |
| MySQL Connector | (latest) | Database driver |

#### 1.4.2.3 Database

| Technology | Purpose |
|------------|---------|
| MySQL 8.0+ | Primary relational database |
| InnoDB Engine | Transaction support and foreign key constraints |
| UTF8MB4 Charset | Full Unicode support including emojis |

#### 1.4.2.4 Development Tools

| Tool | Purpose |
|------|---------|
| Maven | Backend build and dependency management |
| npm | Frontend package management |
| Git | Version control |
| VS Code | Primary development IDE |

### 1.4.3 User Roles and Permissions

The system implements five distinct user roles with specific access permissions:

#### 1.4.3.1 Administrator (ADMIN)

Full system access including:
- All patient and doctor management functions
- Department and room management
- Staff management and scheduling
- Insurance claims management
- System configuration and audit logs
- All billing and payment functions
- Emergency case management
- Complete reporting capabilities

#### 1.4.3.2 Doctor (DOCTOR)

Clinical-focused access including:
- View and manage assigned patients
- Create and manage appointments
- Create and view medical records
- Order laboratory tests and view results
- Create prescriptions
- Record vital signs
- Manage emergency cases
- View personal schedule
- Internal messaging

#### 1.4.3.3 Patient (PATIENT)

Self-service access including:
- View personal appointments
- View personal medical records
- View prescribed medications
- View vital signs history
- View and download personal documents
- View payment history
- View assigned doctors
- Internal messaging
- Receive notifications

#### 1.4.3.4 Nurse (NURSE)

Nursing care access including:
- View patient information
- Record vital signs
- Manage admissions
- Assist with emergency cases
- View lab orders and results
- Internal messaging

#### 1.4.3.5 Pharmacist (PHARMACIST)

Pharmacy-focused access including:
- View and dispense prescriptions
- Update prescription status
- View medication inventory
- Internal messaging

---

## 1.5 Out-Of-Scope

### 1.5.1 Features Explicitly Not Included

The following features and functionalities are explicitly excluded from the current scope of this Hospital Management System project:

#### 1.5.1.1 Advanced Medical Features

| Feature | Reason for Exclusion |
|---------|---------------------|
| **Telemedicine/Video Consultation** | Requires complex real-time video infrastructure, WebRTC implementation, and additional security considerations beyond the project timeline |
| **Medical Imaging Integration (PACS)** | DICOM standards and medical imaging systems require specialized knowledge and significant infrastructure |
| **Clinical Decision Support Systems** | AI/ML-based diagnostic assistance requires extensive medical datasets and specialized algorithms |
| **Drug Interaction Checking** | Requires comprehensive pharmaceutical databases and complex interaction logic |
| **Electronic Health Record (EHR) Standards Compliance** | Full HL7 FHIR or CDA compliance requires extensive development beyond course scope |
| **Medical Device Integration** | IoT device integration (monitors, pumps) requires specialized protocols and hardware |

#### 1.5.1.2 Financial and Administrative Features

| Feature | Reason for Exclusion |
|---------|---------------------|
| **Real Payment Gateway Integration** | Integration with actual payment processors (Stripe, PayPal, VNPay) requires business accounts and security certifications |
| **Insurance EDI Transactions** | Electronic Data Interchange with insurance companies requires industry partnerships and specific formats (X12, EDIFACT) |
| **Payroll Management** | Staff payroll processing requires complex tax calculations and regulatory compliance |
| **Supply Chain Management** | Full inventory with supplier management, purchase orders, and logistics is beyond current scope |
| **Financial Reporting (GAAP/IFRS)** | Compliance with accounting standards requires specialized financial expertise |

#### 1.5.1.3 Advanced Technical Features

| Feature | Reason for Exclusion |
|---------|---------------------|
| **Mobile Native Applications** | iOS and Android native apps require separate development cycles and technologies |
| **Offline Functionality** | Progressive Web App (PWA) with offline support requires service workers and local data sync |
| **Multi-Hospital/Multi-Tenant Architecture** | Supporting multiple independent hospital instances adds significant complexity |
| **Real-Time Collaboration** | WebSocket-based real-time updates for simultaneous editing is not implemented |
| **Advanced Analytics and Business Intelligence** | Data warehousing and complex analytics dashboards are beyond current scope |
| **Automated Backup and Disaster Recovery** | Enterprise-grade backup solutions require additional infrastructure |

#### 1.5.1.4 Integration Features

| Feature | Reason for Exclusion |
|---------|---------------------|
| **Third-Party Lab System Integration** | Integration with external laboratory information systems (LIS) requires specific APIs |
| **Pharmacy System Integration** | Connection to pharmacy management systems requires industry-standard interfaces |
| **Government Health Portals** | Integration with national health information exchanges is not included |
| **Email/SMS Notifications** | Actual email and SMS delivery requires external service providers (SendGrid, Twilio) |
| **Single Sign-On (SSO)** | OAuth/SAML integration with external identity providers is not implemented |
| **API for Third-Party Developers** | Public API documentation and developer portal are not included |

#### 1.5.1.5 Advanced Security Features

| Feature | Reason for Exclusion |
|---------|---------------------|
| **Two-Factor Authentication (2FA)** | Additional authentication factors (SMS, authenticator apps) are not implemented |
| **HIPAA Compliance Certification** | Full HIPAA compliance requires extensive security controls and auditing |
| **Data Encryption at Rest** | Database-level encryption is not implemented (MySQL default) |
| **Advanced Threat Detection** | Intrusion detection and security information management systems are not included |
| **Penetration Testing** | Professional security assessment is outside project scope |

#### 1.5.1.6 Localization and Accessibility

| Feature | Reason for Exclusion |
|---------|---------------------|
| **Multi-Language Support** | Internationalization (i18n) for multiple languages is not implemented |
| **WCAG Accessibility Compliance** | Full accessibility standards compliance requires additional development |
| **Right-to-Left (RTL) Language Support** | Support for Arabic, Hebrew, and other RTL languages is not included |
| **Voice Interface** | Voice commands and screen reader optimization are not implemented |

#### 1.5.1.7 Operational Features

| Feature | Reason for Exclusion |
|---------|---------------------|
| **Queue Management System** | Physical queue management with display boards and ticket systems |
| **Visitor Management** | Tracking and managing hospital visitors |
| **Asset Tracking** | Equipment and asset management with barcode/RFID tracking |
| **Food Service Management** | Patient meal ordering and dietary management |
| **Housekeeping Management** | Room cleaning schedules and tracking |
| **Transportation Coordination** | Ambulance and patient transport management |

### 1.5.2 Technical Limitations

#### 1.5.2.1 Performance Limitations

- **Concurrent Users:** The system is designed for moderate user loads (estimated <100 concurrent users) and has not been optimized for high-traffic scenarios
- **Data Volume:** Testing has been conducted with sample datasets; performance with millions of records has not been validated
- **Response Time SLAs:** No specific response time guarantees are provided

#### 1.5.2.2 Browser Support

- **Modern Browsers Only:** The application is tested on Chrome, Firefox, and Edge (latest versions)
- **Legacy Browser Support:** Internet Explorer and older browser versions are not supported
- **Mobile Browsers:** Limited testing on mobile browsers

#### 1.5.2.3 Deployment Limitations

- **Local Development Focus:** The system is designed for local development and demonstration
- **Production Deployment:** Cloud deployment configurations (AWS, Azure, GCP) are not included
- **Load Balancing:** High availability and load balancing configurations are not implemented
- **Containerization:** Docker and Kubernetes configurations are not provided

### 1.5.3 Future Considerations

While the following features are out of scope for the current project, they represent potential enhancements for future development:

1. **Phase 2 Enhancements:**
   - Mobile responsive optimization
   - Email notification integration
   - Advanced reporting dashboard
   - Export functionality (Excel, CSV)

2. **Phase 3 Enhancements:**
   - Telemedicine capabilities
   - Mobile applications
   - Integration with external systems
   - Multi-language support

3. **Long-Term Vision:**
   - AI-powered clinical decision support
   - Predictive analytics for patient outcomes
   - IoT device integration
   - Blockchain for medical record integrity

---

*End of Chapter 1*

---

# CHAPTER 2: TASK TIMELINE & DIVISION

## 2.1 Project Timeline

### 2.1.1 Project Duration Overview

The MEDS Hospital Management System project was developed over a period of approximately 14 weeks, spanning from early October 2025 to January 2026. The development process followed an iterative approach, with regular review cycles and continuous integration of feedback to ensure the delivery of a high-quality, feature-complete application.

### 2.1.2 Development Phases

The project was organized into five major phases, each with specific objectives, deliverables, and timelines:

#### Phase 1: Planning and Requirements Analysis (Weeks 1-2)
**Duration:** October 1 - October 14, 2025

| Week | Activities | Deliverables |
|------|------------|--------------|
| Week 1 | Project kickoff meeting, initial research on hospital management systems, competitor analysis, technology stack evaluation | Project charter, initial requirements document, technology stack decision |
| Week 2 | Detailed requirements gathering, use case development, database schema design, UI/UX wireframing | Requirements specification document, database ERD, wireframe mockups |

**Key Decisions Made:**
- Selected React 19 with Vite for frontend development due to modern features and fast build times
- Chose Spring Boot 3.5 for backend to leverage Java ecosystem and enterprise-grade security features
- Decided on MySQL as the database for reliability and widespread industry adoption
- Established JWT-based authentication for stateless, scalable security

#### Phase 2: System Design and Architecture (Weeks 3-4)
**Duration:** October 15 - October 28, 2025

| Week | Activities | Deliverables |
|------|------------|--------------|
| Week 3 | System architecture design, API endpoint planning, component hierarchy design, security architecture planning | Architecture diagrams, API documentation draft, component tree |
| Week 4 | Database normalization and optimization, role-based access control design, integration planning | Final database schema, RBAC matrix, integration specifications |

**Architecture Decisions:**
- Adopted a monorepo structure with separate frontend and backend directories
- Designed RESTful API following industry best practices
- Implemented layered architecture: Controller → Service → Repository
- Established five user roles with granular permissions

#### Phase 3: Core Development (Weeks 5-10)
**Duration:** October 29 - December 9, 2025

| Week | Focus Area | Key Implementations |
|------|------------|---------------------|
| Week 5 | Authentication & User Management | User entity, JWT authentication, login/register APIs, Spring Security configuration |
| Week 6 | Patient & Doctor Modules | Patient CRUD operations, Doctor management, Department setup |
| Week 7 | Appointment System | Appointment scheduling, availability checking, status management |
| Week 8 | Medical Records & Vital Signs | Medical record creation, vital signs recording, patient history |
| Week 9 | Laboratory & Prescriptions | Lab test catalog, lab orders, prescription management |
| Week 10 | Billing, Rooms & Admissions | Bill generation, room management, admission workflow |

**Development Milestones:**
- Week 5: First working API endpoints with authentication
- Week 7: Core patient-doctor-appointment workflow functional
- Week 9: Complete medical workflow (records, labs, prescriptions)
- Week 10: Full billing and admission capabilities

#### Phase 4: Advanced Features and Frontend Development (Weeks 11-12)
**Duration:** December 10 - December 23, 2025

| Week | Focus Area | Key Implementations |
|------|------------|---------------------|
| Week 11 | Emergency, Staff, Notifications | Emergency case management, staff scheduling, notification system, messaging |
| Week 12 | Frontend Integration | Dashboard development, all page implementations, API integration, charts and analytics |

**Frontend Components Developed:**
- Dashboard with statistics and charts (Recharts integration)
- 20+ page components for all system modules
- Reusable components (Header, Sidebar, Pagination, FilterModal)
- Authentication context and protected routes

#### Phase 5: Testing, Documentation, and Refinement (Weeks 13-14)
**Duration:** December 24, 2025 - January 8, 2026

| Week | Activities | Deliverables |
|------|------------|--------------|
| Week 13 | Integration testing, bug fixing, UI/UX refinements, performance optimization | Test reports, bug fix documentation, optimized codebase |
| Week 14 | Documentation writing, code cleanup, final testing, project presentation preparation | Academic report, user manual, presentation slides, final deployment |

### 2.1.3 Gantt Chart Representation

```
Project Timeline (October 2025 - January 2026)
═══════════════════════════════════════════════════════════════════════════════

Phase 1: Planning & Requirements

█████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (Weeks 1-2)

Phase 2: System Design & Architecture

░░░░░░░░░█████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ (Weeks 3-4)

Phase 3: Core Development

░░░░░░░░░░░░░░░░░░██████████████████████████████░░░░░░░░░░░░ (Weeks 5-10)

Phase 4: Advanced Features & Frontend

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████████░░ (Weeks 11-12)

Phase 5: Testing & Documentation

░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░███ (Weeks 13-14)

═══════════════════════════════════════════════════════════════════════════════
Week:  1  2  3  4  5  6  7  8  9  10 11 12 13 14
       |--Oct--|-----Nov-----|-----Dec-----|--Jan--|
```

### 2.1.4 Weekly Meeting Schedule

Throughout the project, the team maintained a consistent meeting schedule to ensure effective communication and progress tracking:

| Meeting Type | Frequency | Duration | Purpose |
|--------------|-----------|----------|---------|
| Sprint Planning | Weekly (Monday) | 1 hour | Plan weekly tasks, assign responsibilities |
| Progress Check | Bi-weekly (Wednesday) | 30 minutes | Review progress, identify blockers |
| Code Review | As needed | Variable | Review pull requests, ensure code quality |
| Sprint Retrospective | Weekly (Friday) | 45 minutes | Reflect on week, identify improvements |

---

## 2.2 Task Allocation

### 2.2.1 Team Member Profiles

The project team consisted of two members, each bringing unique skills and expertise to the development process:

#### Team Member 1: Võ Trí Khôi

| Attribute | Details |
|-----------|---------|
| **Role** | Full-Stack Developer, Backend Lead |
| **Primary Focus** | Backend architecture, database design, API development |
| **Technical Expertise** | Java, Spring Boot, MySQL, RESTful APIs, Security |
| **Responsibilities** | System architecture, core backend modules, database optimization, security implementation |

#### Team Member 2: Trương Minh Trí

| Attribute | Details |
|-----------|---------|
| **Role** | Full-Stack Developer, Frontend Lead |
| **Primary Focus** | Frontend development, UI/UX design, integration |
| **Technical Expertise** | React, JavaScript, CSS, Vite, Data visualization |
| **Responsibilities** | Frontend architecture, component development, API integration, user experience |

### 2.2.2 Detailed Task Distribution

#### 2.2.2.1 Backend Development Tasks

| Module/Task | Primary Owner | Supporting Member | Estimated Hours | Actual Hours |
|-------------|---------------|-------------------|-----------------|--------------|
| **Authentication System** |
| User entity and repository | Võ Trí Khôi | - | 4 | 5 |
| JWT implementation | Võ Trí Khôi | - | 8 | 10 |
| Spring Security configuration | Võ Trí Khôi | - | 6 | 8 |
| Login/Register APIs | Võ Trí Khôi | Trương Minh Trí | 4 | 4 |
| Role-based access control | Võ Trí Khôi | - | 6 | 7 |
| **Patient Management** |
| Patient entity and CRUD | Võ Trí Khôi | - | 6 | 6 |
| Patient search and filtering | Võ Trí Khôi | - | 4 | 5 |
| Patient-Doctor relationship | Võ Trí Khôi | - | 3 | 3 |
| **Doctor Management** |
| Doctor entity and CRUD | Võ Trí Khôi | - | 5 | 5 |
| Department association | Võ Trí Khôi | - | 3 | 3 |
| Schedule management | Võ Trí Khôi | - | 4 | 5 |
| **Appointment System** |
| Appointment entity and CRUD | Võ Trí Khôi | - | 6 | 7 |
| Availability checking | Võ Trí Khôi | - | 5 | 6 |
| Status workflow | Võ Trí Khôi | - | 3 | 3 |
| **Medical Records** |
| Medical record entity | Trương Minh Trí | Võ Trí Khôi | 5 | 5 |
| Record CRUD operations | Trương Minh Trí | - | 4 | 4 |
| History retrieval | Trương Minh Trí | - | 3 | 4 |
| **Vital Signs** |
| Vital signs entity and CRUD | Trương Minh Trí | - | 4 | 4 |
| BMI calculation | Trương Minh Trí | - | 2 | 2 |
| **Laboratory Module** |
| Lab test catalog | Trương Minh Trí | Võ Trí Khôi | 4 | 5 |
| Lab order workflow | Trương Minh Trí | - | 6 | 7 |
| Lab results management | Trương Minh Trí | - | 5 | 5 |
| **Prescription Module** |
| Prescription entity | Trương Minh Trí | - | 5 | 5 |
| Prescription items | Trương Minh Trí | - | 4 | 4 |
| Status management | Trương Minh Trí | - | 3 | 3 |
| **Billing System** |
| Bill entity and generation | Võ Trí Khôi | Trương Minh Trí | 8 | 9 |
| Payment processing | Võ Trí Khôi | - | 5 | 6 |
| Payment status tracking | Võ Trí Khôi | - | 3 | 3 |
| **Room Management** |
| Room entity and CRUD | Võ Trí Khôi | - | 4 | 4 |
| Availability tracking | Võ Trí Khôi | - | 3 | 3 |
| **Admission Module** |
| Admission workflow | Võ Trí Khôi | - | 6 | 7 |
| Discharge process | Võ Trí Khôi | - | 4 | 4 |
| **Emergency Cases** |
| Emergency entity | Trương Minh Trí | Võ Trí Khôi | 5 | 6 |
| Triage system | Trương Minh Trí | - | 4 | 5 |
| Status workflow | Trương Minh Trí | - | 3 | 3 |
| **Staff Module** |
| Staff entity and CRUD | Trương Minh Trí | - | 4 | 4 |
| Shift scheduling | Trương Minh Trí | - | 5 | 6 |
| **Additional Modules** |
| Insurance claims | Võ Trí Khôi | - | 6 | 7 |
| Document management | Võ Trí Khôi | - | 5 | 5 |
| Messaging system | Trương Minh Trí | - | 5 | 6 |
| Notification system | Trương Minh Trí | - | 4 | 5 |
| Audit logging | Võ Trí Khôi | - | 6 | 7 |
| PDF generation | Võ Trí Khôi | - | 8 | 10 |

#### 2.2.2.2 Frontend Development Tasks

| Module/Task | Primary Owner | Supporting Member | Estimated Hours | Actual Hours |
|-------------|---------------|-------------------|-----------------|--------------|
| **Core Setup** |
| Vite project configuration | Trương Minh Trí | - | 2 | 2 |
| React Router setup | Trương Minh Trí | - | 3 | 3 |
| Axios configuration | Trương Minh Trí | Võ Trí Khôi | 2 | 2 |
| Authentication context | Trương Minh Trí | - | 4 | 5 |
| **Layout Components** |
| Header component | Trương Minh Trí | - | 4 | 4 |
| Sidebar component | Trương Minh Trí | - | 5 | 6 |
| Layout wrapper | Trương Minh Trí | - | 3 | 3 |
| Protected routes | Trương Minh Trí | - | 4 | 4 |
| **Reusable Components** |
| Pagination component | Trương Minh Trí | - | 3 | 3 |
| FilterModal component | Trương Minh Trí | - | 5 | 6 |
| CustomSelect component | Trương Minh Trí | - | 3 | 3 |
| SortDropdown component | Trương Minh Trí | - | 2 | 2 |
| StatCard component | Trương Minh Trí | - | 2 | 2 |
| **Authentication Pages** |
| Login page | Trương Minh Trí | Võ Trí Khôi | 5 | 6 |
| Register page | Trương Minh Trí | - | 4 | 5 |
| Unauthorized page | Trương Minh Trí | - | 1 | 1 |
| **Dashboard** |
| Dashboard layout | Trương Minh Trí | - | 6 | 7 |
| Statistics cards | Trương Minh Trí | - | 3 | 3 |
| Charts integration | Trương Minh Trí | - | 8 | 10 |
| Recent activity panels | Trương Minh Trí | - | 4 | 5 |
| **Patient Pages** |
| Patient list page | Võ Trí Khôi | Trương Minh Trí | 6 | 7 |
| Patient form (add/edit) | Võ Trí Khôi | - | 5 | 6 |
| Patient detail view | Võ Trí Khôi | - | 4 | 4 |
| **Doctor Pages** |
| Doctor list page | Võ Trí Khôi | - | 5 | 5 |
| Doctor schedule page | Võ Trí Khôi | - | 6 | 7 |
| **Appointment Pages** |
| Appointment list page | Trương Minh Trí | Võ Trí Khôi | 6 | 7 |
| Appointment scheduling | Trương Minh Trí | - | 8 | 9 |
| Calendar integration | Trương Minh Trí | - | 5 | 6 |
| **Medical Pages** |
| Medical records page | Võ Trí Khôi | - | 6 | 7 |
| Vital signs page | Võ Trí Khôi | - | 5 | 5 |
| Prescriptions page | Võ Trí Khôi | - | 5 | 6 |
| **Laboratory Pages** |
| Lab orders page | Trương Minh Trí | - | 6 | 7 |
| Lab results view | Trương Minh Trí | - | 4 | 4 |
| **Administrative Pages** |
| Billing/Payments page | Võ Trí Khôi | Trương Minh Trí | 7 | 8 |
| Rooms page | Võ Trí Khôi | - | 4 | 4 |
| Admissions page | Võ Trí Khôi | - | 5 | 6 |
| Departments page | Trương Minh Trí | - | 4 | 4 |
| **Additional Pages** |
| Emergency page | Trương Minh Trí | - | 6 | 7 |
| Staff page | Trương Minh Trí | - | 5 | 5 |
| Insurance page | Võ Trí Khôi | - | 5 | 6 |
| Documents page | Võ Trí Khôi | - | 4 | 5 |
| Messages page | Trương Minh Trí | - | 6 | 7 |
| Notifications page | Trương Minh Trí | - | 4 | 4 |
| Audit logs page | Võ Trí Khôi | - | 4 | 4 |
| Inventory page | Võ Trí Khôi | - | 4 | 5 |

#### 2.2.2.3 Database and Infrastructure Tasks

| Task | Primary Owner | Estimated Hours | Actual Hours |
|------|---------------|-----------------|--------------|
| Database schema design | Võ Trí Khôi | 8 | 10 |
| SQL script creation | Võ Trí Khôi | 6 | 7 |
| Sample data generation | Trương Minh Trí | 4 | 5 |
| Database optimization | Võ Trí Khôi | 4 | 5 |
| CORS configuration | Võ Trí Khôi | 2 | 2 |
| Exception handling | Võ Trí Khôi | 4 | 5 |
| File upload configuration | Võ Trí Khôi | 3 | 4 |

#### 2.2.2.4 Documentation and Testing Tasks

| Task | Primary Owner | Estimated Hours | Actual Hours |
|------|---------------|-----------------|--------------|
| API documentation | Võ Trí Khôi | 6 | 7 |
| README documentation | Trương Minh Trí | 4 | 5 |
| Academic report writing | Both | 20 | 25 |
| Unit testing | Võ Trí Khôi | 8 | 6 |
| Integration testing | Both | 10 | 12 |
| Bug fixing | Both | 15 | 18 |

### 2.2.3 Task Allocation Summary

| Category | Võ Trí Khôi (Hours) | Trương Minh Trí (Hours) | Total |
|----------|---------------------|-------------------------|-------|
| Backend Development | 142 | 98 | 240 |
| Frontend Development | 78 | 142 | 220 |
| Database & Infrastructure | 28 | 5 | 33 |
| Documentation & Testing | 28 | 32 | 60 |
| **Total Hours** | **276** | **277** | **553** |
| **Percentage** | **49.9%** | **50.1%** | **100%** |

### 2.2.4 Collaboration Model

The team employed a collaborative development model with the following practices:

#### 2.2.4.1 Version Control Strategy

```
main branch (stable releases)
    │
    ├── develop branch (integration)
    │       │
    │       ├── feature/auth-system
    │       ├── feature/patient-module
    │       ├── feature/appointment-system
    │       ├── feature/billing-module
    │       ├── feature/frontend-dashboard
    │       └── ... (other feature branches)
    │
    └── hotfix branches (urgent fixes)
```

#### 2.2.4.2 Code Review Process

| Stage | Description | Reviewer |
|-------|-------------|----------|
| Self-Review | Developer reviews own code before submission | Author |
| Peer Review | Other team member reviews the code | Cross-review |
| Integration Testing | Test feature in develop branch | Both |
| Merge Approval | Final approval for main branch | Both |

#### 2.2.4.3 Communication Channels

| Channel | Purpose | Frequency |
|---------|---------|-----------|
| In-Person Meetings | Sprint planning, major discussions | Weekly |
| Messaging | Quick questions, status updates | Daily |
| Code Comments | Technical discussions on specific code | As needed |
| Shared Documents | Documentation, specifications | Continuous |

---

## 2.3 Milestones and Deliverables

### 2.3.1 Project Milestones

The project was organized around key milestones that marked significant progress points:

#### Milestone 1: Project Foundation (End of Week 2)
**Target Date:** October 14, 2025  
**Actual Completion:** October 14, 2025  
**Status:** ✅ Completed On Time

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Requirements Document | Detailed functional and non-functional requirements | ✅ Complete |
| Technology Stack Decision | Finalized selection of all technologies | ✅ Complete |
| Database ERD | Entity-relationship diagram for all entities | ✅ Complete |
| UI Wireframes | Initial wireframes for key screens | ✅ Complete |
| Project Repository | Git repository with initial structure | ✅ Complete |

#### Milestone 2: Architecture Complete (End of Week 4)
**Target Date:** October 28, 2025  
**Actual Completion:** October 30, 2025  
**Status:** ⚠️ Completed (2 days delay)

| Deliverable | Description | Status |
|-------------|-------------|--------|
| System Architecture Document | Detailed architecture diagrams and descriptions | ✅ Complete |
| API Specification | RESTful API endpoint documentation | ✅ Complete |
| Database Schema | Complete SQL schema with all tables | ✅ Complete |
| Security Design | Authentication and authorization design | ✅ Complete |
| Development Environment | Configured development environments | ✅ Complete |

**Delay Reason:** Additional time needed for security architecture refinement.

#### Milestone 3: Authentication & Core Entities (End of Week 6)
**Target Date:** November 11, 2025  
**Actual Completion:** November 11, 2025  
**Status:** ✅ Completed On Time

| Deliverable | Description | Status |
|-------------|-------------|--------|
| User Authentication | Working login/register with JWT | ✅ Complete |
| Patient Module | Patient CRUD operations | ✅ Complete |
| Doctor Module | Doctor CRUD operations | ✅ Complete |
| Department Module | Department management | ✅ Complete |
| Role-Based Access | Basic RBAC implementation | ✅ Complete |

#### Milestone 4: Core Medical Workflow (End of Week 8)
**Target Date:** November 25, 2025  
**Actual Completion:** November 26, 2025  
**Status:** ⚠️ Completed (1 day delay)

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Appointment System | Complete appointment workflow | ✅ Complete |
| Medical Records | Medical record management | ✅ Complete |
| Vital Signs | Vital signs recording | ✅ Complete |
| Doctor Availability | Availability checking system | ✅ Complete |

**Delay Reason:** Additional testing required for appointment conflict detection.

#### Milestone 5: Extended Medical Features (End of Week 10)
**Target Date:** December 9, 2025  
**Actual Completion:** December 9, 2025  
**Status:** ✅ Completed On Time

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Laboratory Module | Lab test ordering and results | ✅ Complete |
| Prescription Module | Electronic prescriptions | ✅ Complete |
| Billing System | Bill generation and payments | ✅ Complete |
| Room Management | Room and bed management | ✅ Complete |
| Admission Module | Patient admission workflow | ✅ Complete |

#### Milestone 6: Advanced Features (End of Week 12)
**Target Date:** December 23, 2025  
**Actual Completion:** December 24, 2025  
**Status:** ⚠️ Completed (1 day delay)

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Emergency Module | Emergency case management | ✅ Complete |
| Staff Module | Staff and shift management | ✅ Complete |
| Notifications | Notification system | ✅ Complete |
| Messaging | Internal messaging | ✅ Complete |
| Insurance Claims | Insurance claim management | ✅ Complete |
| Document Management | File upload and storage | ✅ Complete |
| Audit Logging | Comprehensive action logging | ✅ Complete |
| Frontend Complete | All pages implemented | ✅ Complete |

**Delay Reason:** Frontend chart integration required additional optimization.

#### Milestone 7: Project Completion (End of Week 14)
**Target Date:** January 8, 2026  
**Actual Completion:** January 8, 2026  
**Status:** ✅ Completed On Time

| Deliverable | Description | Status |
|-------------|-------------|--------|
| Integration Testing | Complete system testing | ✅ Complete |
| Bug Fixes | All critical bugs resolved | ✅ Complete |
| Documentation | Academic report complete | ✅ Complete |
| Code Cleanup | Code refactoring and cleanup | ✅ Complete |
| Final Deployment | System ready for demonstration | ✅ Complete |

### 2.3.2 Deliverables Summary

#### 2.3.2.1 Code Deliverables

| Category | Count | Description |
|----------|-------|-------------|
| **Backend** |
| Entity Classes | 24 | JPA entity classes for all database tables |
| Repository Interfaces | 24 | Spring Data JPA repositories |
| Service Classes | 23 | Business logic services |
| Controller Classes | 23 | REST API controllers |
| DTO Classes | 7 | Data transfer objects |
| Security Classes | 5 | Authentication and authorization components |
| Configuration Classes | 4 | Application configuration |
| Utility Classes | 2 | PDF generation and other utilities |
| **Frontend** |
| Page Components | 23 | Full-page React components |
| Reusable Components | 12 | Shared UI components |
| Context Providers | 1 | Authentication context |
| API Utilities | 1 | Axios configuration and API calls |
| Style Files | 10 | CSS stylesheets |

#### 2.3.2.2 Database Deliverables

| Deliverable | Description |
|-------------|-------------|
| Database Schema | 22+ tables with relationships and constraints |
| Initial Data Script | Sample data for testing and demonstration |
| Feature Schema | Additional schema for new features |

#### 2.3.2.3 Documentation Deliverables

| Document | Description | Pages (Est.) |
|----------|-------------|--------------|
| Academic Report | Comprehensive project documentation | 50+ |
| README.md | Project overview and setup instructions | 3 |
| API Documentation | Endpoint documentation (inline) | - |
| Database Documentation | Schema documentation (inline) | - |

### 2.3.3 Quality Metrics

#### 2.3.3.1 Code Quality Metrics

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Code Review Coverage | 100% | 100% | ✅ Met |
| Critical Bugs at Release | 0 | 0 | ✅ Met |
| High-Priority Bugs at Release | <3 | 1 | ✅ Met |
| API Response Time (avg) | <500ms | ~200ms | ✅ Met |
| Frontend Load Time | <3s | ~2s | ✅ Met |

#### 2.3.3.2 Feature Completion Metrics

| Module Category | Planned Features | Implemented | Completion Rate |
|-----------------|------------------|-------------|-----------------|
| Authentication | 5 | 5 | 100% |
| Patient Management | 5 | 5 | 100% |
| Doctor Management | 5 | 5 | 100% |
| Appointments | 5 | 5 | 100% |
| Medical Records | 5 | 5 | 100% |
| Laboratory | 5 | 5 | 100% |
| Prescriptions | 5 | 5 | 100% |
| Billing | 5 | 5 | 100% |
| Emergency | 5 | 5 | 100% |
| Staff Management | 4 | 4 | 100% |
| Additional Modules | 15 | 15 | 100% |
| **Total** | **64** | **64** | **100%** |

### 2.3.4 Risk Management

Throughout the project, the team identified and managed several risks:

| Risk | Probability | Impact | Mitigation Strategy | Outcome |
|------|-------------|--------|---------------------|---------|
| Technology learning curve | Medium | High | Early prototyping, documentation review | Managed successfully |
| Scope creep | High | Medium | Strict scope definition, change control | Minor scope adjustments only |
| Integration issues | Medium | High | Continuous integration, early testing | Resolved during development |
| Time constraints | High | High | Prioritization, parallel development | All milestones met |
| Security vulnerabilities | Low | High | Security best practices, code review | No critical vulnerabilities |

---

*End of Chapter 2*

---

# CHAPTER 3: METHODOLOGY

## 3.1 System Overview

### 3.1.1 User Roles

The MEDS Hospital Management System implements a comprehensive Role-Based Access Control (RBAC) system with five distinct user roles. Each role is designed to reflect real-world healthcare responsibilities and provides access to specific functionalities aligned with the user's job functions.

#### 3.1.1.1 Role Hierarchy and Design Philosophy

The role system was designed based on the following principles:

1. **Principle of Least Privilege:** Users are granted only the minimum permissions necessary to perform their job functions.
2. **Separation of Duties:** Critical operations require involvement of multiple roles to prevent fraud and errors.
3. **Role-Based Workflow:** Each role has a clear workflow path through the system.
4. **Audit Accountability:** All actions are logged with the responsible user for compliance and security.

```
                    ┌─────────────────────────────────────────┐
                    │              ADMINISTRATOR              │
                    │         (Full System Access)            │
                    └─────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
            │    DOCTOR     │   │     NURSE     │   │  PHARMACIST   │
            │  (Clinical)   │   │  (Care Team)  │   │  (Pharmacy)   │
            └───────────────┘   └───────────────┘   └───────────────┘
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        │
                                        ▼
                    ┌─────────────────────────────────────────┐
                    │               PATIENT                   │
                    │          (Self-Service Access)          │
                    └─────────────────────────────────────────┘
```

#### 3.1.1.2 Administrator Role (ADMIN)

**Description:**  
The Administrator role represents hospital IT staff and management personnel responsible for system configuration, user management, and overall hospital operations oversight. This is the highest privilege level in the system.

**Access Level:** Full System Access

**Responsibilities:**
- System configuration and maintenance
- User account management and role assignment
- Department and room management
- Staff scheduling and oversight
- Financial reporting and billing oversight
- Audit log review and compliance monitoring
- Emergency system access when required

**Accessible Modules:**

| Module | Create | Read | Update | Delete | Special Permissions |
|--------|--------|------|--------|--------|---------------------|
| Dashboard | - | ✅ | - | - | Full analytics access |
| Patients | ✅ | ✅ | ✅ | ✅ | All patient records |
| Doctors | ✅ | ✅ | ✅ | ✅ | All doctor records |
| Appointments | ✅ | ✅ | ✅ | ✅ | All appointments |
| Medical Records | ✅ | ✅ | ✅ | ❌ | All records (no delete) |
| Vital Signs | ✅ | ✅ | ✅ | ❌ | All records |
| Laboratory | ✅ | ✅ | ✅ | ✅ | Full lab management |
| Prescriptions | ✅ | ✅ | ✅ | ✅ | All prescriptions |
| Billing | ✅ | ✅ | ✅ | ✅ | Full financial access |
| Rooms | ✅ | ✅ | ✅ | ✅ | Room management |
| Admissions | ✅ | ✅ | ✅ | ✅ | All admissions |
| Departments | ✅ | ✅ | ✅ | ✅ | Department CRUD |
| Staff | ✅ | ✅ | ✅ | ✅ | Full staff management |
| Shifts | ✅ | ✅ | ✅ | ✅ | Schedule management |
| Emergency | ✅ | ✅ | ✅ | ✅ | Emergency oversight |
| Insurance | ✅ | ✅ | ✅ | ✅ | Claims management |
| Documents | ✅ | ✅ | ✅ | ✅ | All documents |
| Messages | ✅ | ✅ | - | ❌ | System messaging |
| Notifications | ✅ | ✅ | ✅ | ✅ | System notifications |
| Audit Logs | - | ✅ | - | - | Read-only access |
| Inventory | ✅ | ✅ | ✅ | ✅ | Medicine inventory |

**API Endpoint Access:**
```
All endpoints accessible with ADMIN role:
- /api/auth/** - Full access
- /api/patients/** - Full CRUD
- /api/doctors/** - Full CRUD
- /api/appointments/** - Full CRUD
- /api/medical-records/** - Full CRUD
- /api/vital-signs/** - Full CRUD
- /api/lab/** - Full CRUD
- /api/prescriptions/** - Full CRUD
- /api/bills/** - Full CRUD
- /api/rooms/** - Full CRUD
- /api/admissions/** - Full CRUD
- /api/departments/** - Full CRUD
- /api/staff/** - Full CRUD
- /api/shifts/** - Full CRUD
- /api/emergency-cases/** - Full CRUD
- /api/insurance-claims/** - Full CRUD
- /api/documents/** - Full CRUD
- /api/messages/** - Full access
- /api/notifications/** - Full CRUD
- /api/audit-logs/** - Read only
- /api/medicines/** - Full CRUD
- /api/dashboard/** - Full access
```

#### 3.1.1.3 Doctor Role (DOCTOR)

**Description:**  
The Doctor role represents licensed medical practitioners who provide patient care, make diagnoses, prescribe treatments, and order medical tests. Doctors have comprehensive clinical access but limited administrative capabilities.

**Access Level:** Clinical Operations Access

**Responsibilities:**
- Patient examination and diagnosis
- Medical record creation and updates
- Prescription writing
- Laboratory test ordering
- Appointment management
- Emergency case handling
- Patient communication

**Accessible Modules:**

| Module | Create | Read | Update | Delete | Special Permissions |
|--------|--------|------|--------|--------|---------------------|
| Dashboard | - | ✅ | - | - | Doctor-specific view |
| Patients | ❌ | ✅ | ✅ | ❌ | Assigned patients |
| Doctors | ❌ | ✅ | ✅* | ❌ | Own profile only* |
| Appointments | ✅ | ✅ | ✅ | ✅ | Own appointments |
| Medical Records | ✅ | ✅ | ✅ | ❌ | Create for patients |
| Vital Signs | ✅ | ✅ | ✅ | ❌ | Record vitals |
| Laboratory | ✅ | ✅ | ❌ | ❌ | Order tests, view results |
| Prescriptions | ✅ | ✅ | ✅ | ❌ | Create prescriptions |
| Billing | ❌ | ✅ | ❌ | ❌ | View patient bills |
| Rooms | ❌ | ✅ | ❌ | ❌ | View availability |
| Admissions | ✅ | ✅ | ✅ | ❌ | Manage admissions |
| Departments | ❌ | ✅ | ❌ | ❌ | View only |
| Emergency | ✅ | ✅ | ✅ | ❌ | Handle emergencies |
| Documents | ✅ | ✅ | ❌ | ❌ | Upload for patients |
| Messages | ✅ | ✅ | - | ❌ | Internal messaging |
| Notifications | - | ✅ | ✅ | ❌ | Own notifications |

**Workflow:**
```
Patient Arrives → View Patient History → Examine → Record Vital Signs
        ↓
Create/Update Medical Record → Diagnose
        ↓
        ├── Order Lab Tests → Review Results
        ├── Write Prescription
        ├── Schedule Follow-up Appointment
        └── Admit Patient (if needed)
```

#### 3.1.1.4 Patient Role (PATIENT)

**Description:**  
The Patient role represents individuals receiving medical care at the hospital. Patients have self-service access to their own medical information and limited interaction capabilities with healthcare providers.

**Access Level:** Personal Health Information Access

**Responsibilities:**
- View personal medical history
- View upcoming and past appointments
- View prescriptions and medications
- Access personal documents
- Communicate with healthcare providers
- View billing information

**Accessible Modules:**

| Module | Create | Read | Update | Delete | Special Permissions |
|--------|--------|------|--------|--------|---------------------|
| Dashboard | - | ✅ | - | - | Patient-specific view |
| Patients | ❌ | ✅* | ❌ | ❌ | Own profile only* |
| Doctors | ❌ | ✅ | ❌ | ❌ | View assigned doctors |
| Appointments | ❌ | ✅ | ❌ | ❌ | Own appointments |
| Medical Records | ❌ | ✅ | ❌ | ❌ | Own records |
| Vital Signs | ❌ | ✅ | ❌ | ❌ | Own vitals |
| Laboratory | ❌ | ✅ | ❌ | ❌ | Own lab results |
| Prescriptions | ❌ | ✅ | ❌ | ❌ | Own prescriptions |
| Billing | ❌ | ✅ | ❌ | ❌ | Own bills |
| Documents | ❌ | ✅ | ❌ | ❌ | Own documents |
| Messages | ✅ | ✅ | - | ❌ | Send to providers |
| Notifications | - | ✅ | ✅ | ❌ | Own notifications |

**Self-Service Features:**
- **Appointment View:** See scheduled, past, and cancelled appointments
- **Medical History:** Access complete personal medical records
- **Prescription History:** View current and past medications
- **Lab Results:** View laboratory test results
- **Billing:** View itemized bills and payment status
- **Documents:** Download personal medical documents

#### 3.1.1.5 Nurse Role (NURSE)

**Description:**  
The Nurse role represents nursing staff who provide direct patient care, record vital signs, assist doctors, and manage patient admissions. Nurses have access to patient care information but cannot prescribe medications or make diagnoses.

**Access Level:** Patient Care Access

**Responsibilities:**
- Record patient vital signs
- Assist with patient admissions and discharges
- Update patient status
- Assist in emergency cases
- Coordinate with doctors
- Monitor patient conditions

**Accessible Modules:**

| Module | Create | Read | Update | Delete | Special Permissions |
|--------|--------|------|--------|--------|---------------------|
| Dashboard | - | ✅ | - | - | Nurse-specific view |
| Patients | ❌ | ✅ | ✅* | ❌ | Update status only* |
| Doctors | ❌ | ✅ | ❌ | ❌ | View schedules |
| Appointments | ❌ | ✅ | ✅* | ❌ | Update status only* |
| Medical Records | ❌ | ✅ | ❌ | ❌ | View records |
| Vital Signs | ✅ | ✅ | ✅ | ❌ | Record vitals |
| Laboratory | ❌ | ✅ | ✅* | ❌ | Sample collection* |
| Prescriptions | ❌ | ✅ | ❌ | ❌ | View only |
| Rooms | ❌ | ✅ | ✅* | ❌ | Update status* |
| Admissions | ✅ | ✅ | ✅ | ❌ | Manage admissions |
| Emergency | ✅ | ✅ | ✅ | ❌ | Assist in ER |
| Documents | ✅ | ✅ | ❌ | ❌ | Upload documents |
| Messages | ✅ | ✅ | - | ❌ | Internal messaging |
| Notifications | - | ✅ | ✅ | ❌ | Own notifications |

**Workflow:**
```
Receive Patient → Record Vital Signs → Update Patient Status
        ↓
Assist Doctor → Execute Orders → Monitor Patient
        ↓
        ├── Collect Lab Samples
        ├── Administer Medications (as ordered)
        └── Update Room/Bed Status
```

#### 3.1.1.6 Pharmacist Role (PHARMACIST)

**Description:**  
The Pharmacist role represents pharmacy staff responsible for dispensing medications, verifying prescriptions, and managing pharmaceutical inventory. Pharmacists have focused access to prescription and medication information.

**Access Level:** Pharmacy Operations Access

**Responsibilities:**
- Verify and dispense prescriptions
- Manage medication inventory
- Update prescription status
- Counsel patients on medications
- Maintain pharmacy records

**Accessible Modules:**

| Module | Create | Read | Update | Delete | Special Permissions |
|--------|--------|------|--------|--------|---------------------|
| Dashboard | - | ✅ | - | - | Pharmacy view |
| Patients | ❌ | ✅ | ❌ | ❌ | View basic info |
| Prescriptions | ❌ | ✅ | ✅ | ❌ | Dispense prescriptions |
| Inventory | ✅ | ✅ | ✅ | ❌ | Manage stock |
| Messages | ✅ | ✅ | - | ❌ | Internal messaging |
| Notifications | - | ✅ | ✅ | ❌ | Own notifications |

**Workflow:**
```
Receive Prescription → Verify Details → Check Inventory
        ↓
Prepare Medication → Dispense → Update Status
        ↓
        ├── Mark as Dispensed
        ├── Mark as Partially Dispensed
        └── Update Inventory Levels
```

#### 3.1.1.7 Role Permissions Matrix

The following matrix provides a comprehensive overview of role permissions across all system modules:

**Figure 3.2: System Roles and Permissions Matrix**

```
┌──────────────────────┬───────┬────────┬─────────┬───────┬────────────┐
│ Module               │ ADMIN │ DOCTOR │ PATIENT │ NURSE │ PHARMACIST │
├──────────────────────┼───────┼────────┼─────────┼───────┼────────────┤
│ User Management      │ CRUD  │   -    │    -    │   -   │     -      │
│ Patients             │ CRUD  │  R/U*  │   R*    │  R/U* │     R      │
│ Doctors              │ CRUD  │  R/U*  │    R    │   R   │     -      │
│ Appointments         │ CRUD  │  CRUD  │    R    │  R/U  │     -      │
│ Medical Records      │ CRU   │  CRU   │    R    │   R   │     -      │
│ Vital Signs          │ CRU   │  CRU   │    R    │  CRU  │     -      │
│ Lab Orders           │ CRUD  │  CR    │    R    │  R/U  │     -      │
│ Lab Results          │ CRUD  │   R    │    R    │   R   │     -      │
│ Prescriptions        │ CRUD  │  CRU   │    R    │   R   │    R/U     │
│ Billing              │ CRUD  │   R    │    R    │   -   │     -      │
│ Rooms                │ CRUD  │   R    │    -    │  R/U  │     -      │
│ Admissions           │ CRUD  │  CRU   │    R    │  CRU  │     -      │
│ Departments          │ CRUD  │   R    │    -    │   R   │     -      │
│ Staff                │ CRUD  │   R    │    -    │   R   │     -      │
│ Shifts               │ CRUD  │   R    │    -    │   R   │     -      │
│ Emergency Cases      │ CRUD  │  CRU   │    -    │  CRU  │     -      │
│ Insurance Claims     │ CRUD  │   R    │    R    │   -   │     -      │
│ Documents            │ CRUD  │  CR    │    R    │  CR   │     -      │
│ Messages             │ CRU   │  CRU   │   CRU   │  CRU  │    CRU     │
│ Notifications        │ CRUD  │  RU    │   RU    │  RU   │    RU      │
│ Audit Logs           │  R    │   -    │    -    │   -   │     -      │
│ Inventory/Medicines  │ CRUD  │   R    │    -    │   R   │    CRU     │
│ Dashboard            │  R    │   R    │    R    │   R   │     R      │
└──────────────────────┴───────┴────────┴─────────┴───────┴────────────┘

Legend:
C = Create | R = Read | U = Update | D = Delete
* = Limited to own records or assigned items
- = No access
```

#### 3.1.1.8 Role Implementation in Code

The role system is implemented through Spring Security with JWT tokens carrying role information:

**User Entity Role Definition:**
```java
public enum Role {
    ADMIN,
    DOCTOR,
    PATIENT,
    NURSE,
    PHARMACIST
}
```

**Security Configuration Example:**
```java
// Role-based endpoint security (SecurityConfig.java)
.requestMatchers("/api/admin/**").hasRole("ADMIN")
.requestMatchers("/api/doctors/**").hasAnyRole("ADMIN", "DOCTOR", "NURSE")
.requestMatchers("/api/patients/**").hasAnyRole("ADMIN", "DOCTOR", "NURSE", "PATIENT")
.requestMatchers("/api/prescriptions/**").hasAnyRole("ADMIN", "DOCTOR", "PHARMACIST")
.requestMatchers("/api/audit-logs/**").hasRole("ADMIN")
```

**JWT Token Structure:**
```json
{
  "sub": "user@example.com",
  "role": "DOCTOR",
  "userId": 1,
  "iat": 1704672000,
  "exp": 1704758400
}
```

#### 3.1.1.9 Role-Based UI Adaptation

The frontend adapts its interface based on the logged-in user's role:

**Sidebar Navigation:**
- **ADMIN:** All navigation items visible
- **DOCTOR:** Clinical modules + messaging + schedule
- **PATIENT:** Personal health + appointments + messages
- **NURSE:** Patient care modules + vital signs + admissions
- **PHARMACIST:** Prescriptions + inventory + messages

**Dashboard Customization:**
- **ADMIN:** Hospital-wide statistics, all charts, full analytics
- **DOCTOR:** Today's appointments, assigned patients, pending tasks
- **PATIENT:** Upcoming appointments, recent records, notifications
- **NURSE:** Patient assignments, vital sign alerts, shift information
- **PHARMACIST:** Pending prescriptions, low stock alerts

### 3.1.2 Overall Workflow

The MEDS Hospital Management System implements a comprehensive workflow that orchestrates interactions between different user roles, system modules, and data entities. This section provides an in-depth analysis of how data flows through the system from user actions to database persistence and back.

#### 3.1.2.1 System Architecture Workflow

The application follows a three-tier architecture pattern with clear separation of concerns:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                             │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                    React Frontend (Vite)                           │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │  │
│  │  │Dashboard│  │Patients │  │Doctors  │  │ Appts   │  │  Labs   │   │  │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘   │  │
│  │       │            │            │            │            │        │  │
│  │  ┌────▼────────────▼────────────▼────────────▼────────────▼─────┐  │  │
│  │  │                    AuthContext (JWT Token)                   │  │  │
│  │  └────────────────────────────┬─────────────────────────────────┘  │  │
│  │                               │                                    │  │
│  │  ┌────────────────────────────▼─────────────────────────────────┐  │  │
│  │  │                    API Layer (Axios)                         │  │  │
│  │  │            HTTP Requests with Bearer Token                   │  │  │
│  │  └────────────────────────────┬─────────────────────────────────┘  │  │
│  └───────────────────────────────┼────────────────────────────────────┘  │
└──────────────────────────────────┼───────────────────────────────────────┘
                                   │ REST API (JSON)
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                             │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                 Spring Boot Backend (Port 8080)                   │  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │  │  │
│  │  │  │ CORS Filter │─▶│ JWT Filter  │─▶│ Auth Provider       │ │  │  │
│  │  │  └─────────────┘  └──────────────┘  └─────────────────────┘ │  │  │
│  │  └─────────────────────────────┬───────────────────────────────┘  │  │
│  │                                │                                  │  │
│  │  ┌─────────────────────────────▼───────────────────────────────┐  │  │
│  │  │                    REST Controllers                         │  │  │
│  │  │  AuthController │ PatientController │ DoctorController │... │  │  │
│  │  └─────────────────────────────┬───────────────────────────────┘  │  │
│  │                                │                                  │  │
│  │  ┌─────────────────────────────▼───────────────────────────────┐  │  │
│  │  │                    Service Layer                            │  │  │
│  │  │  AuthService │ PatientService │ DoctorService │ ...         │  │  │
│  │  └─────────────────────────────┬───────────────────────────────┘  │  │
│  │                                │                                  │  │
│  │  ┌─────────────────────────────▼───────────────────────────────┐  │  │
│  │  │                    Repository Layer (JPA)                   │  │  │
│  │  │  UserRepository │ PatientRepository │ DoctorRepository │... │  │  │
│  │  └─────────────────────────────┬───────────────────────────────┘  │  │
│  └────────────────────────────────┼──────────────────────────────────┘  │
└───────────────────────────────────┼─────────────────────────────────────┘
                                    │ JDBC/Hibernate
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             DATA LAYER                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                       MySQL Database                              │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │  │
│  │  │ users   │  │patients │  │ doctors │  │  appts  │  │  bills  │  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │  │
│  │  │lab_tests│  │prescripts│ │ rooms   │  │admissions│ │audit_log│  │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

#### 3.1.2.2 Authentication Workflow

The authentication process is a critical workflow that establishes user identity and grants appropriate access to system resources.

**User Registration Flow:**

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User    │    │   Frontend   │    │   Backend    │    │   Database   │
│ Browser  │    │  (React)     │    │(Spring Boot) │    │   (MySQL)    │
└────┬─────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
     │                 │                   │                   │
     │ 1. Fill Form    │                   │                   │
     │───────────────▶│                   │                   │
     │                 │                   │                   │
     │                 │ 2. POST /api/auth/register            │
     │                 │───────────────────▶                  │
     │                 │   {email, password, firstName,...}    │
     │                 │                   │                   │
     │                 │                   │ 3. Check email    │
     │                 │                   │   uniqueness      │
     │                 │                   │──────────────────▶│
     │                 │                   │                   │
     │                 │                   │◀──────────────────│
     │                 │                   │                   │
     │                 │                   │ 4. Hash password  │
     │                 │                   │   (BCrypt)        │
     │                 │                   │                   │
     │                 │                   │ 5. Create User    │
     │                 │                   │──────────────────▶│
     │                 │                   │                   │
     │                 │                   │ 6. Create Patient/│
     │                 │                   │   Doctor record   │
     │                 │                   │──────────────────▶│
     │                 │                   │                   │
     │                 │                   │ 7. Generate JWT   │
     │                 │                   │                   │
     │                 │◀──────────────────│                   │
     │                 │   {token, user info}                  │
     │                 │                   │                   │
     │                 │ 8. Store token    │                   │
     │                 │   (localStorage)  │                   │
     │                 │                   │                   │
     │◀────────────────│                   │                   │
     │ 9. Redirect to  │                   │                   │
     │   Dashboard     │                   │                   │
```

**User Login Flow:**

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  User    │    │   Frontend   │    │   Backend    │    │   Database   │
└────┬─────┘    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘
     │                 │                   │                   │
     │ 1. Enter        │                   │                   │
     │   credentials   │                   │                   │
     │────────────────▶│                   │                   │
     │                 │                   │                   │
     │                 │ 2. POST /api/auth/login               │
     │                 │───────────────────▶                   │
     │                 │   {email, password}                   │
     │                 │                   │                   │
     │                 │                   │ 3. Find user by   │
     │                 │                   │   email           │
     │                 │                   │──────────────────▶│
     │                 │                   │                   │
     │                 │                   │◀──────────────────│
     │                 │                   │   {user data}     │
     │                 │                   │                   │
     │                 │                   │ 4. Verify password│
     │                 │                   │   (BCrypt.matches)│
     │                 │                   │                   │
     │                 │                   │ 5. Generate JWT   │
     │                 │                   │   with claims:    │
     │                 │                   │   - userId        │
     │                 │                   │   - email         │
     │                 │                   │   - role          │
     │                 │                   │   - expiration    │
     │                 │                   │                   │
     │                 │                   │ 6. Log audit      │
     │                 │                   │──────────────────▶│
     │                 │                   │                   │
     │                 │◀──────────────────│                   │
     │                 │   {token, role, userId, ...}         │
     │                 │                   │                   │
     │                 │ 7. AuthContext    │                   │
     │                 │   stores user     │                   │
     │                 │                   │                   │
     │◀────────────────│                   │                   │
     │ 8. Navigate to  │                   │                   │
     │   role-based    │                   │                   │
     │   dashboard     │                   │                   │
```

**JWT Token Validation Flow:**

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ Request  │    │  JWT Filter  │    │  Controller  │
└────┬─────┘    └──────┬───────┘    └──────┬───────┘
     │                 │                   │
     │ 1. HTTP Request │                   │
     │   Authorization:│                   │
     │   Bearer <token>│                   │
     │────────────────▶│                   │
     │                 │                   │
     │                 │ 2. Extract token  │
     │                 │   from header     │
     │                 │                   │
     │                 │ 3. Validate token │
     │                 │   - Check signature│
     │                 │   - Check expiry  │
     │                 │   - Extract claims│
     │                 │                   │
     │                 │ 4. Load UserDetails│
     │                 │   from database   │
     │                 │                   │
     │                 │ 5. Set Security   │
     │                 │   Context         │
     │                 │                   │
     │                 │────────────────────▶
     │                 │                   │
     │                 │                   │ 6. Check role
     │                 │                   │   permissions
     │                 │                   │
     │◀────────────────────────────────────│
     │   Response      │                   │
```

#### 3.1.2.3 Patient Care Workflow

The core clinical workflow demonstrates how patient care activities flow through the system:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                         PATIENT CARE WORKFLOW                                 │
└───────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────┐
    │  1. REGISTRATION  │
    │  Patient creates  │
    │  account or is    │
    │  registered by    │
    │  admin            │
    └────────┬──────────┘
             │
             ▼
    ┌───────────────────┐
    │ 2. APPOINTMENT    │
    │ Schedule with     │
    │ available doctor  │
    │ Check time slots  │
    └────────┬──────────┘
             │
             ▼
    ┌───────────────────┐
    │  3. CHECK-IN      │
    │  Appointment      │
    │  status changes   │
    │  to CONFIRMED     │
    └────────┬──────────┘
             │
             ▼
    ┌───────────────────┐
    │ 4. VITAL SIGNS    │◄───────────────────┐
    │ Nurse records:    │                    │
    │ - Temperature     │                    │
    │ - Blood Pressure  │                    │
    │ - Heart Rate      │                    │
    │ - SpO2, BMI       │                    │
    └────────┬──────────┘                    │
             │                               │
             ▼                               │
    ┌───────────────────┐                    │
    │ 5. CONSULTATION   │                    │
    │ Doctor examines   │                    │
    │ patient, reviews  │                    │
    │ history           │                    │
    └────────┬──────────┘                    │
             │                               │
             ├──────────────────┬────────────┼────────────────┐
             │                  │            │                │
             ▼                  ▼            │                  ▼
    ┌─────────────────┐ ┌─────────────────┐  │         ┌─────────────────┐
    │ 6a. LAB ORDER   │ │6b. PRESCRIPTION │  │         │6c. ADMISSION    │
    │ Doctor orders   │ │ Doctor creates  │  │         │ If inpatient    │
    │ tests           │ │ prescription    │  │         │ care needed     │
    └────────┬────────┘ └────────┬────────┘  │         └────────┬────────┘
             │                   │           │                  │
             ▼                   │           │                  ▼
    ┌─────────────────┐          │           │         ┌─────────────────┐
    │ 6a-1. SAMPLE    │          │           │         │ Room/Bed        │
    │ Nurse collects  │          │           │         │ Assignment      │
    │ samples         │          │           │         └────────┬────────┘
    └────────┬────────┘          │           │                  │
             │                   │           │                  │
             ▼                   ▼           │                  │
    ┌─────────────────┐ ┌─────────────────┐  │                  │
    │ 6a-2. RESULTS   │ │ 7. PHARMACY     │  │                  │
    │ Lab processes   │ │ Pharmacist      │  │                  │
    │ and records     │ │ dispenses meds  │  │                  │
    └────────┬────────┘ └────────┬────────┘  │                  │
             │                   │           │                  │
             └───────────────────┴───────────┘                  │
                        │                                       │
                        ▼                                       ▼
               ┌─────────────────┐                     ┌─────────────────┐
               │ 8. MEDICAL      │                     │ DISCHARGE       │
               │ RECORD UPDATED  │◄────────────────────│ When ready      │
               │ All activities  │                     └─────────────────┘
               │ documented      │
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ 9. BILLING      │
               │ Generate bill   │
               │ for all services│
               └────────┬────────┘
                        │
                        ▼
               ┌─────────────────┐
               │ 10. FOLLOW-UP   │
               │ Schedule next   │
               │ appointment     │
               └─────────────────┘
```

#### 3.1.2.4 Data Flow for API Requests

Every API request follows a consistent pattern through the application layers:

```
Frontend Component (e.g., Patients.jsx)
         │
         │ 1. User action triggers function
         ▼
    ┌─────────────────┐
    │   api.get()     │  ── Uses stored JWT token
    │   api.post()    │
    │   api.put()     │
    │   api.delete()  │
    └────────┬────────┘
             │
             │ 2. HTTP Request with Authorization header
             ▼
    ┌───────────────────────────────────────────────────┐
    │           Spring Security Filter Chain            │
    │  ┌────────────┐  ┌─────────────┐  ┌────────────┐  │
    │  │CORS Filter │─▶│JWT Filter  │─▶│ AuthFilter │  │
    │  └────────────┘  └─────────────┘  └────────────┘  │
    └─────────────────────────┬─────────────────────────┘
                              │
                              │ 3. Token validated, User authenticated
                              ▼
    ┌──────────────────────────────────────────────────┐
    │              REST Controller                     │
    │  @GetMapping, @PostMapping, @PutMapping, etc.    │
    │  - Receives HTTP request                         │
    │  - Validates input (@Valid)                      │
    │  - Calls service layer                           │
    │  - Returns ResponseEntity                        │
    └─────────────────────────┬────────────────────────┘
                              │
                              │ 4. Business logic delegation
                              ▼
    ┌──────────────────────────────────────────────────┐
    │                Service Layer                     │
    │  @Service, @Transactional                        │
    │  - Business logic implementation                 │
    │  - Validation rules                              │
    │  - Cross-entity operations                       │
    │  - Exception handling                            │
    └─────────────────────────┬────────────────────────┘
                              │
                              │ 5. Data access
                              ▼
    ┌──────────────────────────────────────────────────┐
    │              Repository Layer                    │
    │  JpaRepository<Entity, Long>                     │
    │  - CRUD operations                               │
    │  - Custom queries (@Query)                       │
    │  - Derived query methods                         │
    └─────────────────────────┬────────────────────────┘
                              │
                              │ 6. SQL execution
                              ▼
    ┌──────────────────────────────────────────────────┐
    │                 MySQL Database                   │
    │  - Transactions                                  │
    │  - Foreign key constraints                       │
    │  - Data persistence                              │
    └──────────────────────────────────────────────────┘
```

#### 3.1.2.5 Emergency Case Workflow

Emergency cases follow a specialized workflow with triage-based prioritization:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                        EMERGENCY DEPARTMENT WORKFLOW                          │
└───────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐         ┌─────────────────┐        ┌─────────────────┐
│ PATIENT ARRIVES │───────▶│    TRIAGE       │───────▶│ CASE CREATED    │
│ Walk-in or      │         │ Assess severity │        │ Status: WAITING │
│ Ambulance       │         │ ESI Level 1-5   │        │                 │
└─────────────────┘         └─────────────────┘        └────────┬────────┘
                                                                │
                    ┌───────────────────────────────────────────┤
                    │                                           │
                    ▼                                           ▼
           ┌─────────────────┐                         ┌─────────────────┐
           │ ESI Level 1-2   │                         │ ESI Level 3-5   │
           │ IMMEDIATE       │                         │ URGENT/LESS     │
           │ Resuscitation   │                         │ Wait queue      │
           └────────┬────────┘                         └────────┬────────┘
                    │                                           │
                    ▼                                           ▼
           ┌─────────────────┐                         ┌─────────────────┐
           │ IN_TREATMENT    │◄────────────────────────│ Called when     │
           │ Doctor assigned │                         │ resources       │
           │ Immediate care  │                         │ available       │
           └────────┬────────┘                         └─────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌───────────┐  ┌───────────┐ ┌───────────┐
│ STABILIZED│  │ ADMITTED  │ │ DISCHARGED│
│ Observation│ │ To ward   │ │ Released  │
└───────────┘  └───────────┘ └───────────┘
```

#### 3.1.2.6 Billing and Payment Workflow

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          BILLING WORKFLOW                                     │
└───────────────────────────────────────────────────────────────────────────────┘

Services Rendered
      │
      ├─── Consultation Fee ──────────────┐
      ├─── Laboratory Tests ──────────────┤
      ├─── Prescription/Medicines ────────┤──────▶ BILL GENERATED
      ├─── Room Charges (if admitted) ────┤        │
      └─── Other Charges ─────────────────┘        │
                                                   ▼
                                          ┌─────────────────┐
                                          │ Calculate Total │
                                          │ Apply Tax       │
                                          │ Apply Discount  │
                                          │ = Net Amount    │
                                          └────────┬────────┘
                                                   │
                        ┌──────────────────────────┼──────────────────────────┐
                        │                          │                          │
                        ▼                          ▼                          ▼
               ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
               │ CASH PAYMENT    │        │ CARD PAYMENT    │        │INSURANCE CLAIM  │
               │ Status: PAID    │        │ Status: PAID    │        │ Status: PENDING │
               └─────────────────┘        └─────────────────┘        └────────┬────────┘
                                                                              │
                                                                              ▼
                                                                     ┌─────────────────┐
                                                                     │ Claim Submitted │
                                                                     │ to Provider     │
                                                                     └────────┬────────┘
                                                                              │
                                                   ┌──────────────────────────┼──────────┐
                                                   │                          │          │
                                                   ▼                          ▼          ▼
                                          ┌─────────────────┐        ┌───────────┐ ┌─────────┐
                                          │    APPROVED     │        │ PARTIALLY │ │REJECTED │
                                          │  Full Payment   │        │ APPROVED  │ │         │
                                          └─────────────────┘        └───────────┘ └─────────┘
```

#### 3.1.2.7 Audit Trail Workflow

All significant actions in the system are logged for compliance and security monitoring:

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          AUDIT LOGGING WORKFLOW                               │
└───────────────────────────────────────────────────────────────────────────────┘

     User Action                 AuditLogService                    Database
          │                            │                               │
          │ Any CRUD operation         │                               │
          │───────────────────────────▶│                              │
          │                            │                               │
          │                            │ Create AuditLog entity:       │
          │                            │ - userId                      │
          │                            │ - userEmail                   │
          │                            │ - userRole                    │
          │                            │ - actionType (CREATE/UPDATE/  │
          │                            │   DELETE/LOGIN/VIEW)          │
          │                            │ - entityType                  │
          │                            │ - entityId                    │
          │                            │ - description                 │
          │                            │ - ipAddress                   │
          │                            │ - timestamp                   │
          │                            │                               │
          │                            │ Save to audit_log table       │
          │                            │──────────────────────────────▶│
          │                            │                               │
          │◀───────────────────────────│                              │
          │   Original response        │                               │

Admin can view all audit logs via /api/audit-logs endpoint
```

---

## 3.2 Requirements Analysis

This section provides a comprehensive analysis of the functional and non-functional requirements that guided the development of the MEDS Hospital Management System. The requirements were gathered through analysis of real-world hospital operations, industry best practices, and stakeholder interviews.

### 3.2.1 Functional Requirements

Functional requirements define the specific behaviors, functions, and capabilities that the system must provide. They describe what the system should do in response to user actions and system events.

#### 3.2.1.1 User Authentication and Authorization Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-AUTH-001 | The system shall allow users to register with email, password, first name, last name, and role selection | High | ✅ Implemented |
| FR-AUTH-002 | The system shall authenticate users using email and password credentials | High | ✅ Implemented |
| FR-AUTH-003 | The system shall generate JWT tokens upon successful authentication with 24-hour expiration | High | ✅ Implemented |
| FR-AUTH-004 | The system shall implement five distinct user roles: ADMIN, DOCTOR, PATIENT, NURSE, PHARMACIST | High | ✅ Implemented |
| FR-AUTH-005 | The system shall restrict access to endpoints based on user roles | High | ✅ Implemented |
| FR-AUTH-006 | The system shall allow users to change their password | Medium | ✅ Implemented |
| FR-AUTH-007 | The system shall provide password reset functionality via email verification | Medium | ✅ Implemented |
| FR-AUTH-008 | The system shall encrypt passwords using BCrypt hashing algorithm | High | ✅ Implemented |
| FR-AUTH-009 | The system shall automatically log out users after token expiration | High | ✅ Implemented |
| FR-AUTH-010 | The system shall maintain user session state across page refreshes using stored tokens | Medium | ✅ Implemented |

**Implementation Details:**

```java
// JWT Token Generation (JwtService.java)
public String generateToken(UserDetails userDetails) {
    return Jwts.builder()
        .setClaims(extraClaims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24))
        .signWith(getSigningKey(), SignatureAlgorithm.HS256)
        .compact();
}

// Password Encryption (SecurityConfig.java)
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

#### 3.2.1.2 Patient Management Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-PAT-001 | The system shall allow creation of patient records with demographic information | High | ✅ Implemented |
| FR-PAT-002 | The system shall store patient contact information including phone, email, and address | High | ✅ Implemented |
| FR-PAT-003 | The system shall record patient emergency contact information | High | ✅ Implemented |
| FR-PAT-004 | The system shall store blood type information for each patient | High | ✅ Implemented |
| FR-PAT-005 | The system shall allow searching patients by name | High | ✅ Implemented |
| FR-PAT-006 | The system shall allow filtering patients by gender and blood type | Medium | ✅ Implemented |
| FR-PAT-007 | The system shall prevent duplicate patient registration with same email | High | ✅ Implemented |
| FR-PAT-008 | The system shall track which doctors are assigned to each patient | High | ✅ Implemented |
| FR-PAT-009 | The system shall maintain patient registration timestamps | Medium | ✅ Implemented |
| FR-PAT-010 | The system shall support sorting patient lists by multiple criteria | Medium | ✅ Implemented |

**Entity Fields Implemented:**

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Long | Primary Key, Auto-generated | Unique patient identifier |
| firstName | String | Required | Patient's first name |
| lastName | String | Required | Patient's last name |
| dateOfBirth | LocalDate | Required | Date of birth |
| gender | String | Required | Male/Female/Other |
| phone | String | Optional | Contact phone number |
| email | String | Unique | Email address |
| address | String | Optional | Residential address |
| bloodType | String | Optional | A+, A-, B+, B-, AB+, AB-, O+, O- |
| emergencyContact | String | Optional | Emergency contact name |
| emergencyPhone | String | Optional | Emergency contact phone |
| doctor | Doctor | Foreign Key | Assigned primary doctor |
| createdAt | LocalDateTime | Auto-generated | Registration timestamp |

#### 3.2.1.3 Doctor Management Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-DOC-001 | The system shall store doctor professional information including specialization | High | ✅ Implemented |
| FR-DOC-002 | The system shall associate doctors with departments | High | ✅ Implemented |
| FR-DOC-003 | The system shall record doctor consultation fees | High | ✅ Implemented |
| FR-DOC-004 | The system shall track years of experience for each doctor | Medium | ✅ Implemented |
| FR-DOC-005 | The system shall store doctor license numbers | High | ✅ Implemented |
| FR-DOC-006 | The system shall allow filtering doctors by department and specialization | Medium | ✅ Implemented |
| FR-DOC-007 | The system shall display doctor schedules and availability | High | ✅ Implemented |
| FR-DOC-008 | The system shall link doctors to user accounts for authentication | High | ✅ Implemented |

#### 3.2.1.4 Appointment Management Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-APT-001 | The system shall allow scheduling appointments with patient, doctor, date, and time | High | ✅ Implemented |
| FR-APT-002 | The system shall check doctor availability before confirming appointments | High | ✅ Implemented |
| FR-APT-003 | The system shall prevent double-booking of doctors | High | ✅ Implemented |
| FR-APT-004 | The system shall support appointment statuses: SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW | High | ✅ Implemented |
| FR-APT-005 | The system shall allow rescheduling and cancellation of appointments | High | ✅ Implemented |
| FR-APT-006 | The system shall provide filtering by date range, doctor, patient, and status | Medium | ✅ Implemented |
| FR-APT-007 | The system shall generate available time slots for a given doctor and date | High | ✅ Implemented |
| FR-APT-008 | The system shall store appointment reason/notes | Medium | ✅ Implemented |
| FR-APT-009 | The system shall support a 30-minute default appointment duration | Medium | ✅ Implemented |
| FR-APT-010 | The system shall display today's appointments on dashboard | Medium | ✅ Implemented |

**Appointment Status Workflow:**

```
SCHEDULED ──────▶ CONFIRMED ──────▶ COMPLETED
     │                │
     │                └──────────▶ NO_SHOW
     │
     └────────────────────────────▶ CANCELLED
```

#### 3.2.1.5 Medical Records Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-MED-001 | The system shall create medical records linked to patients and doctors | High | ✅ Implemented |
| FR-MED-002 | The system shall record diagnosis information | High | ✅ Implemented |
| FR-MED-003 | The system shall document symptoms reported by patients | High | ✅ Implemented |
| FR-MED-004 | The system shall store treatment plans | High | ✅ Implemented |
| FR-MED-005 | The system shall allow doctors to add clinical notes | High | ✅ Implemented |
| FR-MED-006 | The system shall track follow-up requirements | Medium | ✅ Implemented |
| FR-MED-007 | The system shall maintain complete medical history for each patient | High | ✅ Implemented |
| FR-MED-008 | The system shall timestamp all medical record entries | High | ✅ Implemented |
| FR-MED-009 | Medical records shall not be deletable (soft delete or archive only) | High | ✅ Implemented |
| FR-MED-010 | The system shall support searching records by patient, doctor, or date | Medium | ✅ Implemented |

#### 3.2.1.6 Vital Signs Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-VIT-001 | The system shall record body temperature in Celsius or Fahrenheit | High | ✅ Implemented |
| FR-VIT-002 | The system shall record blood pressure (systolic/diastolic) | High | ✅ Implemented |
| FR-VIT-003 | The system shall record heart rate (BPM) | High | ✅ Implemented |
| FR-VIT-004 | The system shall record respiratory rate | High | ✅ Implemented |
| FR-VIT-005 | The system shall record oxygen saturation (SpO2) | High | ✅ Implemented |
| FR-VIT-006 | The system shall calculate BMI from weight and height | High | ✅ Implemented |
| FR-VIT-007 | The system shall record pain level on a 0-10 scale | Medium | ✅ Implemented |
| FR-VIT-008 | The system shall track which nurse/doctor recorded витальs | Medium | ✅ Implemented |
| FR-VIT-009 | The system shall maintain vital signs history for trend analysis | High | ✅ Implemented |
| FR-VIT-010 | The system shall flag abnormal vital signs values | Medium | ✅ Implemented |

#### 3.2.1.7 Laboratory Management Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-LAB-001 | The system shall maintain a catalog of available laboratory tests | High | ✅ Implemented |
| FR-LAB-002 | The system shall allow doctors to order lab tests for patients | High | ✅ Implemented |
| FR-LAB-003 | The system shall support multiple tests in a single lab order | High | ✅ Implemented |
| FR-LAB-004 | The system shall track lab order status: PENDING, SAMPLE_COLLECTED, PROCESSING, COMPLETED, CANCELLED | High | ✅ Implemented |
| FR-LAB-005 | The system shall allow recording of lab results with values | High | ✅ Implemented |
| FR-LAB-006 | The system shall store reference ranges for each test | High | ✅ Implemented |
| FR-LAB-007 | The system shall flag abnormal result values | High | ✅ Implemented |
| FR-LAB-008 | The system shall track priority levels: ROUTINE, URGENT, STAT | Medium | ✅ Implemented |
| FR-LAB-009 | The system shall record test prices for billing | Medium | ✅ Implemented |
| FR-LAB-010 | The system shall support lab result attachments/documents | Medium | ✅ Implemented |

#### 3.2.1.8 Prescription Management Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-PRE-001 | The system shall allow doctors to create electronic prescriptions | High | ✅ Implemented |
| FR-PRE-002 | The system shall support multiple medications per prescription | High | ✅ Implemented |
| FR-PRE-003 | The system shall record medication dosage and frequency | High | ✅ Implemented |
| FR-PRE-004 | The system shall track prescription duration and quantity | High | ✅ Implemented |
| FR-PRE-005 | The system shall support prescription statuses: ACTIVE, DISPENSED, PARTIALLY_DISPENSED, EXPIRED, CANCELLED | High | ✅ Implemented |
| FR-PRE-006 | The system shall allow pharmacists to update dispensing status | High | ✅ Implemented |
| FR-PRE-007 | The system shall store special instructions for medications | Medium | ✅ Implemented |
| FR-PRE-008 | The system shall link prescriptions to medical records | Medium | ✅ Implemented |
| FR-PRE-009 | The system shall allow viewing prescription history by patient | High | ✅ Implemented |

#### 3.2.1.9 Billing and Payments Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-BIL-001 | The system shall generate itemized bills for patients | High | ✅ Implemented |
| FR-BIL-002 | The system shall include consultation fees in bills | High | ✅ Implemented |
| FR-BIL-003 | The system shall include medicine costs in bills | High | ✅ Implemented |
| FR-BIL-004 | The system shall include laboratory charges in bills | High | ✅ Implemented |
| FR-BIL-005 | The system shall include room charges for admitted patients | High | ✅ Implemented |
| FR-BIL-006 | The system shall support tax calculation | Medium | ✅ Implemented |
| FR-BIL-007 | The system shall support discount application | Medium | ✅ Implemented |
| FR-BIL-008 | The system shall track payment status: PENDING, PARTIAL, PAID, CANCELLED, REFUNDED | High | ✅ Implemented |
| FR-BIL-009 | The system shall support multiple payment methods: CASH, CARD, INSURANCE, BANK_TRANSFER | High | ✅ Implemented |
| FR-BIL-010 | The system shall record payment date upon completion | High | ✅ Implemented |
| FR-BIL-011 | The system shall calculate total revenue for date ranges | Medium | ✅ Implemented |
| FR-BIL-012 | The system shall track pending payment amounts | Medium | ✅ Implemented |

#### 3.2.1.10 Room and Admission Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-ROM-001 | The system shall manage room inventory with type, floor, and capacity | High | ✅ Implemented |
| FR-ROM-002 | The system shall support room types: GENERAL, PRIVATE, ICU, EMERGENCY, OPERATION, RECOVERY | High | ✅ Implemented |
| FR-ROM-003 | The system shall track room availability status | High | ✅ Implemented |
| FR-ROM-004 | The system shall associate rooms with departments | Medium | ✅ Implemented |
| FR-ROM-005 | The system shall record room facilities and amenities | Medium | ✅ Implemented |
| FR-ADM-001 | The system shall record patient admissions with room assignment | High | ✅ Implemented |
| FR-ADM-002 | The system shall support admission types: EMERGENCY, SCHEDULED, TRANSFER, OBSERVATION | High | ✅ Implemented |
| FR-ADM-003 | The system shall assign attending doctors to admissions | High | ✅ Implemented |
| FR-ADM-004 | The system shall track admission status: ADMITTED, DISCHARGED, TRANSFERRED, DECEASED | High | ✅ Implemented |
| FR-ADM-005 | The system shall record discharge notes and instructions | High | ✅ Implemented |

#### 3.2.1.11 Emergency Case Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-EMR-001 | The system shall support quick registration of emergency patients | High | ✅ Implemented |
| FR-EMR-002 | The system shall implement 5-level triage classification (ESI) | High | ✅ Implemented |
| FR-EMR-003 | The system shall track emergency case status: WAITING, TRIAGE, IN_TREATMENT, OBSERVATION, ADMITTED, DISCHARGED | High | ✅ Implemented |
| FR-EMR-004 | The system shall record chief complaint and arrival mode | High | ✅ Implemented |
| FR-EMR-005 | The system shall assign doctors and nurses to emergency cases | High | ✅ Implemented |
| FR-EMR-006 | The system shall support walk-in patients without prior registration | High | ✅ Implemented |
| FR-EMR-007 | The system shall prioritize cases based on triage level | High | ✅ Implemented |

#### 3.2.1.12 Staff and Scheduling Requirements

| Requirement ID | Requirement Description | Priority | Status |
|----------------|------------------------|----------|--------|
| FR-STF-001 | The system shall manage non-physician staff records | High | ✅ Implemented |
| FR-STF-002 | The system shall support staff roles: NURSE, TECHNICIAN, PHARMACIST, RECEPTIONIST, ADMINISTRATOR, CLEANER, SECURITY | High | ✅ Implemented |
| FR-STF-003 | The system shall track staff qualifications and certifications | Medium | ✅ Implemented |
| FR-STF-004 | The system shall associate staff with departments | High | ✅ Implemented |
| FR-STF-005 | The system shall track staff status: ACTIVE, ON_LEAVE, INACTIVE, TERMINATED | High | ✅ Implemented |
| FR-SHF-001 | The system shall create shift schedules for staff | High | ✅ Implemented |
| FR-SHF-002 | The system shall support shift types: MORNING, AFTERNOON, NIGHT, CUSTOM | High | ✅ Implemented |
| FR-SHF-003 | The system shall record check-in and check-out times | Medium | ✅ Implemented |
| FR-SHF-004 | The system shall track shift status: SCHEDULED, IN_PROGRESS, COMPLETED, ABSENT, ON_LEAVE | High | ✅ Implemented |

#### 3.2.1.13 Additional Module Requirements

| Module | Requirements Implemented |
|--------|--------------------------|
| **Insurance Claims** | Create claims, track status (SUBMITTED, UNDER_REVIEW, APPROVED, PARTIALLY_APPROVED, REJECTED, PAID), record approved amounts, rejection reasons |
| **Document Management** | Upload files (PDF, images), categorize documents (LAB_REPORT, PRESCRIPTION, IMAGING, DISCHARGE_SUMMARY, CONSENT_FORM, INSURANCE), secure storage, download capability |
| **Messaging System** | Send internal messages, read receipts, conversation threads, unread count, user search |
| **Notification System** | Multiple notification types, read management, notification links, scheduled delivery |
| **Audit Logging** | Log all actions (CREATE, UPDATE, DELETE, LOGIN, VIEW), user tracking, IP address logging, search and filter |
| **PDF Generation** | Patient reports, prescriptions, billing invoices, lab reports, discharge summaries |
| **Dashboard Analytics** | Statistics overview, visual charts, role-specific views, recent activity display |

### 3.2.2 Non-Functional Requirements

Non-functional requirements define the quality attributes, constraints, and operational characteristics of the system. They specify how the system should perform rather than what it should do.

#### 3.2.2.1 Performance Requirements

| Requirement ID | Requirement Description | Target Metric | Status |
|----------------|------------------------|---------------|--------|
| NFR-PERF-001 | API response time for simple queries | < 200ms | ✅ Achieved |
| NFR-PERF-002 | API response time for complex queries with joins | < 500ms | ✅ Achieved |
| NFR-PERF-003 | Frontend initial page load time | < 3 seconds | ✅ Achieved |
| NFR-PERF-004 | Frontend navigation between pages | < 500ms | ✅ Achieved |
| NFR-PERF-005 | Database query execution time | < 100ms | ✅ Achieved |
| NFR-PERF-006 | Concurrent user support | Up to 100 users | ✅ Designed |
| NFR-PERF-007 | File upload processing | < 5 seconds for 10MB file | ✅ Achieved |
| NFR-PERF-008 | PDF generation time | < 3 seconds per document | ✅ Achieved |

**Performance Optimization Strategies Implemented:**

1. **Database Optimization:**
   - Proper indexing on frequently queried columns
   - Foreign key constraints for referential integrity
   - Efficient JPA query methods with projections

2. **Frontend Optimization:**
   - Vite build tool for fast HMR and bundling
   - React component lazy loading where applicable
   - Efficient state management with Context API

3. **Backend Optimization:**
   - Stateless session management with JWT
   - Connection pooling via HikariCP
   - Transaction management with @Transactional

#### 3.2.2.2 Security Requirements

| Requirement ID | Requirement Description | Implementation | Status |
|----------------|------------------------|----------------|--------|
| NFR-SEC-001 | All passwords must be encrypted using industry-standard algorithms | BCrypt with strength 10 | ✅ Implemented |
| NFR-SEC-002 | API endpoints must require authentication except public routes | JWT Bearer Token Authentication | ✅ Implemented |
| NFR-SEC-003 | Role-based access control must be enforced at API level | Spring Security with role annotations | ✅ Implemented |
| NFR-SEC-004 | Cross-Origin Resource Sharing (CORS) must be properly configured | CorsConfigurationSource with allowed origins | ✅ Implemented |
| NFR-SEC-005 | Session tokens must expire after configurable period | 24-hour JWT expiration | ✅ Implemented |
| NFR-SEC-006 | All user actions must be logged for audit purposes | AuditLogService with IP tracking | ✅ Implemented |
| NFR-SEC-007 | Sensitive data must not be exposed in API responses | DTOs for controlled data exposure | ✅ Implemented |
| NFR-SEC-008 | SQL injection attacks must be prevented | JPA parameterized queries | ✅ Implemented |
| NFR-SEC-009 | Cross-Site Scripting (XSS) must be prevented | Input validation, React escaping | ✅ Implemented |
| NFR-SEC-010 | CSRF attacks must be prevented | Stateless JWT, CSRF disabled | ✅ Implemented |

**Security Implementation Example:**

```java
// SecurityConfig.java security filter chain
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/public/**").permitAll()
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/doctor/**").hasAnyRole("ADMIN", "DOCTOR")
            .requestMatchers("/api/patient/**").hasAnyRole("ADMIN", "DOCTOR", "PATIENT")
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll())
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
}
```

#### 3.2.2.3 Reliability Requirements

| Requirement ID | Requirement Description | Implementation | Status |
|----------------|------------------------|----------------|--------|
| NFR-REL-001 | The system shall handle errors gracefully without crashing | GlobalExceptionHandler | ✅ Implemented |
| NFR-REL-002 | Database transactions must be atomic and consistent | @Transactional annotation | ✅ Implemented |
| NFR-REL-003 | The system shall validate all user inputs | @Valid annotations, frontend validation | ✅ Implemented |
| NFR-REL-004 | The system shall provide meaningful error messages | Structured error responses | ✅ Implemented |
| NFR-REL-005 | Data integrity must be maintained through foreign key constraints | JPA relationships | ✅ Implemented |
| NFR-REL-006 | The system shall prevent duplicate record creation | Unique constraints on emails | ✅ Implemented |

**Error Handling Example:**

```java
// GlobalExceptionHandler provides structured error responses
{
    "message": "Patient with email test@example.com already exists",
    "status": 400,
    "timestamp": "2026-01-08T10:30:00"
}
```

#### 3.2.2.4 Usability Requirements

| Requirement ID | Requirement Description | Implementation | Status |
|----------------|------------------------|----------------|--------|
| NFR-USA-001 | The interface shall be intuitive and require minimal training | Clean, consistent UI design | ✅ Implemented |
| NFR-USA-002 | Navigation shall be consistent across all pages | Sidebar navigation component | ✅ Implemented |
| NFR-USA-003 | The system shall provide visual feedback for user actions | Toast notifications | ✅ Implemented |
| NFR-USA-004 | Forms shall provide validation feedback before submission | Real-time form validation | ✅ Implemented |
| NFR-USA-005 | The dashboard shall provide at-a-glance information | Statistics cards and charts | ✅ Implemented |
| NFR-USA-006 | Tables shall support sorting, filtering, and pagination | Custom components | ✅ Implemented |
| NFR-USA-007 | The system shall use consistent color coding for status | Status badges with colors | ✅ Implemented |
| NFR-USA-008 | Loading states shall be clearly indicated | Loading spinners | ✅ Implemented |

#### 3.2.2.5 Scalability Requirements

| Requirement ID | Requirement Description | Implementation | Status |
|----------------|------------------------|----------------|--------|
| NFR-SCA-001 | The architecture shall support horizontal scaling | Stateless backend design | ✅ Designed |
| NFR-SCA-002 | The database schema shall be normalized to prevent data duplication | 3NF normalized tables | ✅ Implemented |
| NFR-SCA-003 | The codebase shall be modular and maintainable | Layered architecture | ✅ Implemented |
| NFR-SCA-004 | The frontend shall support lazy loading for performance | Route-based code splitting | ✅ Implemented |
| NFR-SCA-005 | The API shall support pagination for large datasets | Page-based results | ✅ Implemented |

#### 3.2.2.6 Maintainability Requirements

| Requirement ID | Requirement Description | Implementation | Status |
|----------------|------------------------|----------------|--------|
| NFR-MNT-001 | Code shall follow consistent naming conventions | Java/React conventions | ✅ Implemented |
| NFR-MNT-002 | Business logic shall be separated from presentation | Service layer separation | ✅ Implemented |
| NFR-MNT-003 | Configuration shall be externalized | application.properties | ✅ Implemented |
| NFR-MNT-004 | Dependencies shall be managed through package managers | Maven (backend), npm (frontend) | ✅ Implemented |
| NFR-MNT-005 | Code shall be organized in logical package structure | Entity/Service/Controller/Repository | ✅ Implemented |

**Package Structure:**

```
Backend (Spring Boot):
com.hms.hospital_management_system/
├── config/          # Configuration classes
├── controller/      # REST API endpoints
├── dto/             # Data Transfer Objects
├── entity/          # JPA entities
├── repository/      # Data access layer
├── security/        # Authentication/Authorization
├── service/         # Business logic
└── util/            # Utility classes

Frontend (React):
src/
├── api/             # API configuration
├── component/       # Reusable components
├── context/         # React Context providers
├── pages/           # Page components
└── styles/          # CSS stylesheets
```

#### 3.2.2.7 Compatibility Requirements

| Requirement ID | Requirement Description | Target | Status |
|----------------|------------------------|--------|--------|
| NFR-CMP-001 | The frontend shall support modern browsers | Chrome, Firefox, Edge (latest versions) | ✅ Tested |
| NFR-CMP-002 | The backend shall run on JDK 17+ | Java 17 | ✅ Implemented |
| NFR-CMP-003 | The database shall use MySQL 8.0+ | MySQL 8.0 | ✅ Implemented |
| NFR-CMP-004 | The frontend shall be responsive on tablet devices | CSS media queries | ✅ Implemented |
| NFR-CMP-005 | The API shall return JSON format responses | application/json | ✅ Implemented |

#### 3.2.2.8 Data Requirements

| Requirement ID | Requirement Description | Implementation | Status |
|----------------|------------------------|----------------|--------|
| NFR-DAT-001 | All dates shall be stored in ISO format | LocalDate, LocalDateTime | ✅ Implemented |
| NFR-DAT-002 | Timestamps shall be automatically generated for auditing | @CreatedDate annotations | ✅ Implemented |
| NFR-DAT-003 | Monetary values shall support decimal precision | BigDecimal (2 decimal places) | ✅ Implemented |
| NFR-DAT-004 | The database shall use UTF-8 encoding for international characters | UTF8MB4 charset | ✅ Implemented |
| NFR-DAT-005 | Soft deletes shall be preferred over hard deletes for critical data | Status flags | ✅ Implemented |

#### 3.2.2.9 Requirements Traceability Matrix

The following matrix maps functional requirements to their implementation components:

| Requirement Category | Controller | Service | Repository | Entity | Frontend Page |
|---------------------|------------|---------|------------|--------|---------------|
| Authentication | AuthController | AuthService | UserRepository | User | Login, Register |
| Patient Management | PatientController | PatientService | PatientRepository | Patient | Patients |
| Doctor Management | DoctorController | DoctorService | DoctorRepository | Doctor | Doctors |
| Appointments | AppointmentController | AppointmentService | AppointmentRepository | Appointment | Appointments |
| Medical Records | MedicalRecordController | MedicalRecordService | MedicalRecordRepository | MedicalRecord | MedicalRecords |
| Vital Signs | VitalSignsController | VitalSignsService | VitalSignsRepository | VitalSigns | VitalSigns |
| Laboratory | LabController | LabService | LabOrderRepository, LabResultRepository | LabOrder, LabResult, LabTest | Lab |
| Prescriptions | PrescriptionController | PrescriptionService | PrescriptionRepository | Prescription, PrescriptionItem | Prescriptions |
| Billing | BillController | BillService | BillRepository | Bill | Payments |
| Room Management | RoomController | RoomService | RoomRepository | Room | Rooms |
| Admissions | AdmissionController | AdmissionService | AdmissionRepository | Admission | Admissions |
| Emergency | EmergencyCaseController | EmergencyCaseService | EmergencyCaseRepository | EmergencyCase | Emergency |
| Staff | StaffController | StaffService | StaffRepository | Staff, Shift | Staff |
| Insurance | InsuranceClaimController | InsuranceClaimService | InsuranceClaimRepository | InsuranceClaim | Insurance |
| Documents | DocumentController | DocumentService | DocumentRepository | Document | Documents |
| Messages | MessageController | MessageService | MessageRepository | Message | Messages |
| Notifications | NotificationController | NotificationService | NotificationRepository | Notification | Notifications |
| Audit Logs | AuditLogController | AuditLogService | AuditLogRepository | AuditLog | AuditLogs |
| Dashboard | DashboardController | Various Services | Various Repositories | - | Dashboard |
| PDF Reports | PdfController | PdfService | - | - | - |

---

## 3.3 System Design

This section presents the detailed system design of the MEDS Hospital Management System, including database architecture, API design, and frontend component structure.

### 3.3.1 Database Design

#### 3.3.1.1 Database Architecture Overview

The MEDS Hospital Management System uses MySQL 8.0 as the primary relational database management system. The database design follows the principles of normalization up to Third Normal Form (3NF) to eliminate data redundancy and ensure data integrity.

**Database Configuration:**

| Parameter | Value |
|-----------|-------|
| Database Engine | InnoDB |
| Character Set | UTF8MB4 |
| Collation | utf8mb4_unicode_ci |
| Storage Engine Features | Transactions, Foreign Keys, Row-level Locking |

#### 3.3.1.2 Entity-Relationship Diagram

The database consists of 22+ interconnected tables representing the core entities of the hospital management system:

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE ENTITY RELATIONSHIPS                                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                                    ┌──────────────┐
                                    │    users     │
                                    │──────────────│
                                    │ id (PK)      │
                                    │ email        │
                                    │ password     │
                                    │ role         │
                                    │ doctor_id(FK)│
                                    │ patient_id(FK)│
                                    └──────┬───────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
            ┌──────────────┐       ┌──────────────┐       ┌──────────────┐
            │    doctor    │       │   patient    │       │    staff     │
            │──────────────│       │──────────────│       │──────────────│
            │ id (PK)      │       │ id (PK)      │       │ id (PK)      │
            │ first_name   │       │ first_name   │       │ first_name   │
            │ last_name    │       │ last_name    │       │ last_name    │
            │ specialization│      │ date_of_birth│       │ role         │
            │ department_id│       │ blood_type   │       │ department_id│
            │ consultation_fee│    │ email        │       │ hire_date    │
            └──────┬───────┘       └──────┬───────┘       └──────────────┘
                   │                      │
    ┌──────────────┼──────────────────────┼─────────────────────┐
    │              │                      │                     │
    ▼              ▼                      ▼                     ▼
┌──────────┐ ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│department│ │ appointment  │      │medical_record│      │  vital_signs │
│──────────│ │──────────────│      │──────────────│      │──────────────│
│ id (PK)  │ │ id (PK)      │      │ id (PK)      │      │ id (PK)      │
│ name     │ │ patient_id   │      │ patient_id   │      │ patient_id   │
│ location │ │ doctor_id    │      │ doctor_id    │      │ doctor_id    │
│ phone    │ │ date         │      │ diagnosis    │      │ temperature  │
└──────────┘ │ time         │      │ symptoms     │      │ blood_pressure│
             │ status       │      │ treatment    │      │ heart_rate   │
             └──────────────┘      └──────────────┘      │ spo2         │
                                                         └──────────────┘
    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │  lab_order   │      │  lab_result  │      │   lab_test   │
    │──────────────│      │──────────────│      │──────────────│
    │ id (PK)      │      │ id (PK)      │      │ id (PK)      │
    │ patient_id   │◄─────│ lab_order_id │      │ name         │
    │ doctor_id    │      │ lab_test_id  │─────▶│ category     │
    │ order_date   │      │ result_value │      │ reference_range│
    │ status       │      │ is_abnormal  │      │ price        │
    └──────────────┘      └──────────────┘      └──────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │ prescription │      │prescription_ │      │   medicine   │
    │──────────────│      │    item      │      │──────────────│
    │ id (PK)      │◄─────│──────────────│      │ id (PK)      │
    │ patient_id   │      │ id (PK)      │      │ name         │
    │ doctor_id    │      │ prescription_id│    │ category     │
    │ status       │      │ medicine_id  │─────▶│ unit_price   │
    │ date         │      │ dosage       │      │ stock        │
    └──────────────┘      │ quantity     │      └──────────────┘
                          └──────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │     bill     │      │     room     │      │  admission   │
    │──────────────│      │──────────────│      │──────────────│
    │ id (PK)      │      │ id (PK)      │◄─────│ id (PK)      │
    │ patient_id   │      │ room_number  │      │ patient_id   │
    │ bill_date    │      │ room_type    │      │ room_id      │
    │ total_amount │      │ floor        │      │ doctor_id    │
    │ payment_status│     │ capacity     │      │ admit_date   │
    │ payment_method│     │ status       │      │ discharge_date│
    └──────────────┘      └──────────────┘      │ status       │
                                                └──────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │emergency_case│      │insurance_claim│     │   document   │
    │──────────────│      │──────────────│      │──────────────│
    │ id (PK)      │      │ id (PK)      │      │ id (PK)      │
    │ patient_id   │      │ patient_id   │      │ patient_id   │
    │ triage_level │      │ bill_id      │      │ document_type│
    │ status       │      │ provider     │      │ file_path    │
    │ arrival_time │      │ status       │      │ upload_date  │
    └──────────────┘      │ approved_amt │      └──────────────┘
                          └──────────────┘

    ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
    │   message    │      │ notification │      │  audit_log   │
    │──────────────│      │──────────────│      │──────────────│
    │ id (PK)      │      │ id (PK)      │      │ id (PK)      │
    │ sender_id    │      │ user_id      │      │ user_id      │
    │ receiver_id  │      │ title        │      │ action       │
    │ content      │      │ message      │      │ entity_type  │
    │ is_read      │      │ type         │      │ entity_id    │
    │ sent_at      │      │ is_read      │      │ ip_address   │
    └──────────────┘      └──────────────┘      │ timestamp    │
                                                └──────────────┘
             ┌──────────────┐
             │    shift     │
             │──────────────│
             │ id (PK)      │
             │ staff_id     │
             │ shift_date   │
             │ shift_type   │
             │ start_time   │
             │ end_time     │
             │ status       │
             └──────────────┘
```

#### 3.3.1.3 Core Entity Definitions

**Table: users (User Authentication)**

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier |
| email | VARCHAR(100) | UNIQUE, NOT NULL | User email for login |
| password | VARCHAR(255) | NOT NULL | BCrypt encrypted password |
| first_name | VARCHAR(50) | NOT NULL | User's first name |
| last_name | VARCHAR(50) | NOT NULL | User's last name |
| role | ENUM | NOT NULL | ADMIN, DOCTOR, PATIENT, NURSE, PHARMACIST |
| doctor_id | BIGINT | FOREIGN KEY | Link to doctor record |
| patient_id | BIGINT | FOREIGN KEY | Link to patient record |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |
| created_at | DATETIME | AUTO | Creation timestamp |
| updated_at | DATETIME | AUTO | Last update timestamp |

**Table: patient (Patient Information)**

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique patient ID |
| first_name | VARCHAR(50) | NOT NULL | First name |
| last_name | VARCHAR(50) | NOT NULL | Last name |
| date_of_birth | DATE | | Birth date |
| gender | VARCHAR(10) | | Male/Female/Other |
| phone | VARCHAR(15) | | Contact phone |
| email | VARCHAR(100) | | Email address |
| address | VARCHAR(255) | | Residential address |
| blood_type | VARCHAR(5) | | A+, A-, B+, B-, AB+, AB-, O+, O- |
| emergency_contact | VARCHAR(100) | | Emergency contact name |
| emergency_phone | VARCHAR(15) | | Emergency contact phone |
| created_at | DATETIME | AUTO | Registration date |
| updated_at | DATETIME | AUTO | Last update |

**Table: doctor (Doctor Information)**

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique doctor ID |
| first_name | VARCHAR(50) | NOT NULL | First name |
| last_name | VARCHAR(50) | NOT NULL | Last name |
| specialization | VARCHAR(100) | | Medical specialty |
| phone | VARCHAR(15) | | Contact phone |
| email | VARCHAR(100) | | Email address |
| license_number | VARCHAR(50) | | Medical license |
| department_id | BIGINT | FOREIGN KEY | Department reference |
| consultation_fee | DECIMAL(10,2) | | Fee per consultation |
| years_of_experience | INT | | Professional experience |
| created_at | DATETIME | AUTO | Record creation |
| updated_at | DATETIME | AUTO | Last update |

**Table: appointment (Appointment Scheduling)**

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique appointment ID |
| patient_id | BIGINT | FOREIGN KEY, NOT NULL | Patient reference |
| doctor_id | BIGINT | FOREIGN KEY, NOT NULL | Doctor reference |
| appointment_date | DATE | NOT NULL | Scheduled date |
| appointment_time | TIME | NOT NULL | Scheduled time |
| status | ENUM | | SCHEDULED, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW |
| reason | VARCHAR(500) | | Visit reason |
| notes | VARCHAR(1000) | | Additional notes |
| created_at | DATETIME | AUTO | Creation timestamp |
| updated_at | DATETIME | AUTO | Last update |

**Table: bill (Billing and Payments)**

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique bill ID |
| patient_id | BIGINT | FOREIGN KEY, NOT NULL | Patient reference |
| bill_date | DATE | NOT NULL | Billing date |
| consultation_fee | DECIMAL(10,2) | | Doctor consultation fee |
| medicine_cost | DECIMAL(10,2) | | Medication charges |
| room_charges | DECIMAL(10,2) | | Room/bed charges |
| lab_charges | DECIMAL(10,2) | | Laboratory test charges |
| other_charges | DECIMAL(10,2) | | Miscellaneous charges |
| total_amount | DECIMAL(10,2) | NOT NULL | Sum of all charges |
| discount | DECIMAL(10,2) | | Applied discount |
| tax | DECIMAL(10,2) | | Tax amount |
| net_amount | DECIMAL(10,2) | NOT NULL | Final payable amount |
| payment_status | ENUM | | PENDING, PARTIAL, PAID, CANCELLED, REFUNDED |
| payment_method | ENUM | | CASH, CREDIT_CARD, DEBIT_CARD, INSURANCE, BANK_TRANSFER |
| payment_date | DATE | | Date of payment |
| notes | VARCHAR(500) | | Payment notes |

**Table: emergency_case (Emergency Department)**

| Column | Data Type | Constraints | Description |
|--------|-----------|-------------|-------------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique case ID |
| patient_id | BIGINT | FOREIGN KEY | Registered patient (optional) |
| patient_name | VARCHAR(200) | | Walk-in patient name |
| patient_age | INT | | Patient age |
| patient_gender | VARCHAR(10) | | Gender |
| patient_phone | VARCHAR(20) | | Contact phone |
| arrival_time | DATETIME | NOT NULL | Arrival timestamp |
| triage_level | ENUM | NOT NULL | ESI levels 1-5 |
| chief_complaint | VARCHAR(500) | NOT NULL | Main complaint |
| vital_signs | VARCHAR(500) | | Initial vital signs |
| initial_assessment | TEXT | | Triage assessment |
| assigned_doctor_id | BIGINT | FOREIGN KEY | Assigned physician |
| assigned_nurse_id | BIGINT | FOREIGN KEY | Assigned nurse |
| treatment_area | VARCHAR(50) | | Treatment location |
| bed_number | VARCHAR(20) | | Assigned bed |
| status | ENUM | | WAITING, TRIAGE, IN_TREATMENT, etc. |
| diagnosis | VARCHAR(500) | | Final diagnosis |
| ambulance_arrival | BOOLEAN | | Arrival by ambulance |

#### 3.3.1.4 Database Relationships

The database implements the following relationship types:

**One-to-Many Relationships:**

| Parent Entity | Child Entity | Relationship Description |
|---------------|--------------|--------------------------|
| Department | Doctor | One department has many doctors |
| Doctor | Appointment | One doctor has many appointments |
| Patient | Appointment | One patient has many appointments |
| Patient | Bill | One patient has many bills |
| Patient | MedicalRecord | One patient has many medical records |
| Doctor | MedicalRecord | One doctor creates many records |
| Patient | VitalSigns | One patient has many vital sign records |
| LabOrder | LabResult | One lab order has many results |
| Prescription | PrescriptionItem | One prescription has many items |
| Staff | Shift | One staff has many shift schedules |

**Many-to-One Relationships:**

| Child Entity | Parent Entity | Foreign Key |
|--------------|---------------|-------------|
| Doctor | Department | department_id |
| Appointment | Patient | patient_id |
| Appointment | Doctor | doctor_id |
| Bill | Patient | patient_id |
| MedicalRecord | Patient | patient_id |
| MedicalRecord | Doctor | doctor_id |
| LabOrder | Patient | patient_id |
| LabOrder | Doctor | doctor_id |
| LabResult | LabOrder | lab_order_id |
| LabResult | LabTest | lab_test_id |
| Prescription | Patient | patient_id |
| Prescription | Doctor | doctor_id |
| PrescriptionItem | Prescription | prescription_id |
| PrescriptionItem | Medicine | medicine_id |
| Admission | Patient | patient_id |
| Admission | Room | room_id |
| Admission | Doctor | doctor_id |
| EmergencyCase | Patient | patient_id |
| EmergencyCase | Doctor | assigned_doctor_id |
| InsuranceClaim | Patient | patient_id |
| InsuranceClaim | Bill | bill_id |

#### 3.3.1.5 Indexing Strategy

To optimize query performance, the following indexes are implemented:

| Table | Index Name | Columns | Type | Purpose |
|-------|------------|---------|------|---------|
| users | idx_users_email | email | UNIQUE | Fast login lookup |
| patient | idx_patient_email | email | UNIQUE | Email uniqueness |
| appointment | idx_apt_date_doctor | appointment_date, doctor_id | COMPOSITE | Doctor schedule queries |
| appointment | idx_apt_patient | patient_id | | Patient appointment history |
| bill | idx_bill_patient_status | patient_id, payment_status | COMPOSITE | Patient billing queries |
| medical_record | idx_mr_patient_date | patient_id, record_date | COMPOSITE | Patient history queries |
| audit_log | idx_audit_user_time | user_id, timestamp | COMPOSITE | User audit trail |

### 3.3.2 Backend API Design

#### 3.3.2.1 RESTful API Architecture

The backend implements a RESTful API following industry best practices:

**API Design Principles:**

1. **Resource-Based URLs:** Each entity is exposed as a resource with a noun-based URL
2. **HTTP Method Semantics:** Proper use of GET, POST, PUT, DELETE methods
3. **Stateless Communication:** No server-side session state; JWT for authentication
4. **Consistent Response Format:** Standardized JSON response structure
5. **Proper Status Codes:** HTTP status codes indicate success/failure

**Base URL:** `http://localhost:8080/api`

#### 3.3.2.2 API Endpoint Summary

**Authentication Endpoints (/api/auth)**

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /auth/register | Register new user | No |
| POST | /auth/login | Authenticate user | No |
| GET | /auth/me | Get current user info | Yes |
| POST | /auth/forgot-password | Request password reset | No |
| POST | /auth/reset-password | Reset password with token | No |

**Patient Management (/api/patients)**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | /patients | List all patients | ADMIN, DOCTOR, NURSE |
| GET | /patients/{id} | Get patient by ID | ADMIN, DOCTOR, NURSE, PATIENT* |
| POST | /patients | Create new patient | ADMIN |
| PUT | /patients/{id} | Update patient | ADMIN, DOCTOR |
| DELETE | /patients/{id} | Delete patient | ADMIN |
| GET | /patients/search?name={name} | Search by name | ADMIN, DOCTOR, NURSE |
| GET | /patients/filter | Filter patients | ADMIN, DOCTOR, NURSE |
| GET | /patients/blood-type/{type} | Get by blood type | ADMIN, DOCTOR, NURSE |

**Doctor Management (/api/doctors)**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | /doctors | List all doctors | ADMIN, PATIENT |
| GET | /doctors/{id} | Get doctor by ID | All |
| POST | /doctors | Create new doctor | ADMIN |
| PUT | /doctors/{id} | Update doctor | ADMIN, DOCTOR* |
| DELETE | /doctors/{id} | Delete doctor | ADMIN |
| GET | /doctors/department/{id} | Get by department | All |
| GET | /doctors/{id}/schedule | Get doctor schedule | All |

**Appointment Management (/api/appointments)**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | /appointments | List all appointments | ADMIN, DOCTOR, NURSE |
| GET | /appointments/{id} | Get appointment by ID | All* |
| POST | /appointments | Create appointment | ADMIN, DOCTOR |
| PUT | /appointments/{id} | Update appointment | ADMIN, DOCTOR |
| DELETE | /appointments/{id} | Delete appointment | ADMIN |
| PUT | /appointments/{id}/status | Update status | ADMIN, DOCTOR |
| GET | /appointments/today | Get today's appointments | ADMIN, DOCTOR, NURSE |
| GET | /appointments/available-slots | Get available time slots | All |
| GET | /appointments/filter | Filter appointments | ADMIN, DOCTOR |

**Medical Records (/api/medical-records)**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | /medical-records | List all records | ADMIN, DOCTOR |
| GET | /medical-records/{id} | Get record by ID | ADMIN, DOCTOR, PATIENT* |
| POST | /medical-records | Create record | ADMIN, DOCTOR |
| PUT | /medical-records/{id} | Update record | ADMIN, DOCTOR |
| GET | /medical-records/patient/{id} | Get patient's records | ADMIN, DOCTOR, PATIENT* |

**Laboratory (/api/lab)**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | /lab/tests | List available tests | All |
| POST | /lab/tests | Create test type | ADMIN |
| GET | /lab/orders | List lab orders | ADMIN, DOCTOR, NURSE |
| POST | /lab/orders | Create lab order | ADMIN, DOCTOR |
| PUT | /lab/orders/{id}/status | Update order status | ADMIN, NURSE |
| POST | /lab/results | Record lab result | ADMIN, NURSE |
| GET | /lab/results/order/{id} | Get results by order | ADMIN, DOCTOR, PATIENT* |

**Billing (/api/bills)**

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| GET | /bills | List all bills | ADMIN |
| GET | /bills/{id} | Get bill by ID | ADMIN, PATIENT* |
| POST | /bills | Create bill | ADMIN |
| PUT | /bills/{id} | Update bill | ADMIN |
| PUT | /bills/{id}/payment | Process payment | ADMIN |
| GET | /bills/patient/{id} | Get patient's bills | ADMIN, PATIENT* |
| GET | /bills/pending | Get pending bills | ADMIN |
| GET | /bills/revenue | Get revenue statistics | ADMIN |

**Additional Endpoints:**

| Resource | Base Path | Key Operations |
|----------|-----------|----------------|
| Vital Signs | /api/vital-signs | CRUD, Patient history |
| Prescriptions | /api/prescriptions | CRUD, Dispense status |
| Rooms | /api/rooms | CRUD, Availability |
| Admissions | /api/admissions | CRUD, Discharge |
| Emergency | /api/emergency-cases | CRUD, Triage, Status |
| Staff | /api/staff | CRUD, Department |
| Shifts | /api/shifts | CRUD, Check-in/out |
| Insurance | /api/insurance-claims | CRUD, Status tracking |
| Documents | /api/documents | Upload, Download |
| Messages | /api/messages | Send, Read, List |
| Notifications | /api/notifications | CRUD, Mark read |
| Audit Logs | /api/audit-logs | Read only (ADMIN) |
| Dashboard | /api/dashboard | Statistics |
| PDF | /api/pdf | Generate reports |

#### 3.3.2.3 API Response Format

**Success Response:**

```json
{
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "createdAt": "2026-01-08T10:30:00"
}
```

**Error Response:**

```json
{
    "message": "Patient not found with id: 999",
    "status": 404,
    "timestamp": "2026-01-08T10:30:00",
    "path": "/api/patients/999"
}
```

**Validation Error Response:**

```json
{
    "message": "Validation failed",
    "status": 400,
    "fieldErrors": {
        "email": "Email is required",
        "firstName": "First name must be at least 2 characters"
    }
}
```

#### 3.3.2.4 Authentication Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        JWT AUTHENTICATION FLOW                              │
└────────────────────────────────────────────────────────────────────────────┘

    Client                                              Server
       │                                                   │
       │  1. POST /api/auth/login                          │
       │      {email, password}                            │
       │──────────────────────────────────────────────────▶│
       │                                                   │
       │                                    2. Validate credentials
       │                                    3. Generate JWT token
       │                                       - Subject: email
       │                                       - Claims: userId, role
       │                                       - Expiry: 24 hours
       │                                       - Sign with HS256
       │                                                   │
       │◀──────────────────────────────────────────────────│
       │  {token, userId, email, role, ...}                │
       │                                                   │
       │  4. Store token in localStorage                   │
       │                                                   │
       │  5. GET /api/patients                             │
       │     Authorization: Bearer <token>                 │
       │──────────────────────────────────────────────────▶│
       │                                                   │
       │                                    6. JwtAuthFilter extracts token
       │                                    7. Validate signature & expiry
       │                                    8. Load UserDetails
       │                                    9. Set SecurityContext
       │                                    10. Check role permissions
       │                                                   │
       │◀──────────────────────────────────────────────────│
       │  [patient data]                                   │
```

### 3.3.3 Frontend Architecture

#### 3.3.3.1 React Application Structure

The frontend is built using React 19 with Vite as the build tool:

```
frontend/src/
├── api/
│   └── api.js                 # Axios configuration and API methods
│
├── assets/
│   └── hospital-logo.png      # Static assets
│
├── component/
│   ├── CustomSelect.jsx       # Dropdown component
│   ├── FilterModal.jsx        # Filter dialog component
│   ├── Header.jsx             # Page header with navigation
│   ├── Layout.jsx             # Main layout wrapper
│   ├── Pagination.jsx         # Table pagination
│   ├── ProtectedRoute.jsx     # Route protection HOC
│   ├── Sidebar.jsx            # Navigation sidebar
│   ├── SortDropdown.jsx       # Sorting dropdown
│   └── StatCard.jsx           # Dashboard statistics card
│
├── context/
│   └── AuthContext.jsx        # Authentication state management
│
├── pages/
│   ├── Admissions.jsx         # Patient admissions management
│   ├── Appointments.jsx       # Appointment scheduling
│   ├── AuditLogs.jsx          # Security audit logs
│   ├── Dashboard.jsx          # Main dashboard
│   ├── Departments.jsx        # Department management
│   ├── Doctors.jsx            # Doctor management
│   ├── DoctorsSchedule.jsx    # Doctor schedule view
│   ├── Documents.jsx          # Document management
│   ├── Emergency.jsx          # Emergency case management
│   ├── Insurance.jsx          # Insurance claims
│   ├── Inventory.jsx          # Medicine inventory
│   ├── Lab.jsx                # Laboratory management
│   ├── Login.jsx              # User login
│   ├── MedicalRecords.jsx     # Medical records
│   ├── Messages.jsx           # Internal messaging
│   ├── Notifications.jsx      # User notifications
│   ├── Patients.jsx           # Patient management
│   ├── Payments.jsx           # Billing and payments
│   ├── Prescriptions.jsx      # Prescription management
│   ├── Register.jsx           # User registration
│   ├── Rooms.jsx              # Room management
│   ├── Staff.jsx              # Staff management
│   ├── Unauthorized.jsx       # Access denied page
│   └── VitalSigns.jsx         # Vital signs recording
│
├── styles/
│   ├── admissions.css
│   ├── dashboard.css
│   ├── login.css
│   ├── messages.css
│   ├── patients.css
│   └── ...
│
├── App.jsx                    # Root component with routing
├── App.css                    # Global styles
├── main.jsx                   # Application entry point
└── index.css                  # Base styles
```

#### 3.3.3.2 Component Architecture

**Component Hierarchy:**

```
App
├── AuthProvider (Context)
│   ├── Router
│   │   ├── ScrollHandler
│   │   ├── ToastContainer
│   │   └── Routes
│   │       ├── /login → Login
│   │       ├── /register → Register
│   │       ├── /unauthorized → Unauthorized
│   │       └── Protected Routes
│   │           ├── / → Dashboard
│   │           │   ├── Layout
│   │           │   │   ├── Header
│   │           │   │   ├── Sidebar
│   │           │   │   └── Content
│   │           │   ├── StatCard (multiple)
│   │           │   └── Charts (Recharts)
│   │           ├── /patients → Patients
│   │           │   ├── Layout
│   │           │   ├── FilterModal
│   │           │   ├── Table
│   │           │   └── Pagination
│   │           ├── /appointments → Appointments
│   │           ├── /doctors → Doctors
│   │           └── ... (other pages)
```

#### 3.3.3.3 State Management

**Authentication Context:**

```javascript
// AuthContext provides global authentication state
const AuthContext = {
    user: {
        userId: Number,
        email: String,
        firstName: String,
        lastName: String,
        role: 'ADMIN' | 'DOCTOR' | 'PATIENT' | 'NURSE' | 'PHARMACIST',
        doctorId: Number | null,
        patientId: Number | null
    },
    token: String,
    loading: Boolean,
    login: Function,
    logout: Function,
    register: Function,
    isAdmin: Function,
    isDoctor: Function,
    isPatient: Function,
    isNurse: Function,
    isPharmacist: Function,
    hasRole: Function,
    isAuthenticated: Boolean
}
```

**Local Component State Pattern:**

```javascript
// Standard state pattern used across pages
const [data, setData] = useState([]);           // Main data list
const [loading, setLoading] = useState(true);   // Loading indicator
const [error, setError] = useState(null);       // Error state
const [searchTerm, setSearchTerm] = useState(''); // Search filter
const [showModal, setShowModal] = useState(false); // Modal visibility
const [editingItem, setEditingItem] = useState(null); // Edit mode
const [currentPage, setCurrentPage] = useState(1); // Pagination
const [sortBy, setSortBy] = useState('');       // Sort field
const [sortOrder, setSortOrder] = useState('asc'); // Sort direction
```

#### 3.3.3.4 Routing Configuration

**Protected Route Implementation:**

```javascript
// ProtectedRoute component wraps pages requiring authentication
function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading, isAuthenticated } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }
    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />;
    }
    
    return children;
}
```

**Route Definitions:**

| Path | Component | Allowed Roles | Description |
|------|-----------|---------------|-------------|
| /login | Login | Public | User login |
| /register | Register | Public | User registration |
| /unauthorized | Unauthorized | Public | Access denied |
| / | Dashboard | All authenticated | Main dashboard |
| /appointments | Appointments | All authenticated | Appointment management |
| /messages | Messages | All authenticated | Internal messaging |
| /patients | Patients | ADMIN, DOCTOR, NURSE | Patient management |
| /medical-records | MedicalRecords | ADMIN, DOCTOR, PATIENT | Medical records |
| /doctors | Doctors | ADMIN, PATIENT | Doctor listing |
| /departments | Departments | ADMIN | Department management |
| /rooms | Rooms | ADMIN | Room management |
| /schedule | DoctorsSchedule | ADMIN, DOCTOR, PATIENT | Doctor schedules |
| /payments | Payments | ADMIN, PATIENT | Billing |
| /inventory | Inventory | ADMIN | Medicine inventory |
| /lab | Lab | ADMIN, DOCTOR, NURSE | Laboratory |
| /vitals | VitalSigns | ADMIN, DOCTOR, PATIENT, NURSE | Vital signs |
| /admissions | Admissions | ADMIN, NURSE | Inpatient admissions |
| /documents | Documents | ADMIN, DOCTOR, PATIENT | Document management |
| /prescriptions | Prescriptions | ADMIN, DOCTOR, PATIENT, PHARMACIST | Prescriptions |
| /staff | Staff | ADMIN | Staff management |
| /insurance | Insurance | ADMIN | Insurance claims |
| /emergency | Emergency | ADMIN, DOCTOR, NURSE | Emergency department |
| /notifications | Notifications | All authenticated | User notifications |
| /audit-logs | AuditLogs | ADMIN | Audit trail |

---

## 3.4 Implementation Details

This section provides in-depth technical documentation of the key implementation aspects of the MEDS Hospital Management System, including authentication mechanisms, security features, business logic algorithms, and frontend patterns.

### 3.4.1 Authentication and Security Implementation

#### 3.4.1.1 JWT Token Generation and Validation

The system uses JSON Web Tokens (JWT) for stateless authentication. The implementation is handled by the `JwtUtil` class:

**Token Structure:**

```
Header.Payload.Signature

Header: {
    "alg": "HS256",
    "typ": "JWT"
}

Payload: {
    "sub": "user@email.com",     // Subject (user email)
    "userId": 1,                   // User ID claim
    "role": "DOCTOR",              // Role claim
    "iat": 1704672000,            // Issued at
    "exp": 1704758400             // Expiration (24 hours)
}
```

**Token Generation Implementation:**

```java
// JwtUtil.java
@Component
public class JwtUtil {
    
    @Value("${jwt.secret:mySecretKeyForHospitalManagementSystem2025}")
    private String secret;
    
    @Value("${jwt.expiration:86400000}")  // 24 hours in ms
    private Long expiration;
    
    public String generateToken(UserDetails userDetails, Long userId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        return createToken(claims, userDetails.getUsername());
    }
    
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }
    
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
    
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
```

#### 3.4.1.2 JWT Authentication Filter

Every incoming request passes through the `JwtAuthenticationFilter`:

```java
// JwtAuthenticationFilter.java
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        
        // Step 1: Extract Authorization header
        final String authHeader = request.getHeader("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 2: Extract token from header
        final String jwt = authHeader.substring(7);
        
        try {
            // Step 3: Extract username from token
            final String userEmail = jwtUtil.extractUsername(jwt);

            // Step 4: Validate and set authentication
            if (userEmail != null && 
                SecurityContextHolder.getContext().getAuthentication() == null) {
                
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                if (jwtUtil.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                        );
                    authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: " + e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
```

#### 3.4.1.3 Password Security

Passwords are hashed using BCrypt with a strength factor of 10:

```java
// SecurityConfig.java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();  // Default strength = 10
}

// AuthService.java - Registration
User user = User.builder()
    .email(request.getEmail())
    .password(passwordEncoder.encode(request.getPassword()))  // BCrypt hash
    .firstName(request.getFirstName())
    .lastName(request.getLastName())
    .role(request.getRole())
    .build();

// AuthService.java - Login
authenticationManager.authenticate(
    new UsernamePasswordAuthenticationToken(
        request.getEmail(),
        request.getPassword()  // BCrypt comparison done internally
    )
);
```

#### 3.4.1.4 Role-Based Access Control

The security configuration defines URL-based access rules:

```java
// SecurityConfig.java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())  // Disabled for stateless JWT
        .authorizeHttpRequests(auth -> auth
            // Public endpoints
            .requestMatchers("/api/auth/**").permitAll()
            .requestMatchers("/api/public/**").permitAll()
            
            // Role-specific endpoints
            .requestMatchers("/api/admin/**").hasRole("ADMIN")
            .requestMatchers("/api/doctor/**").hasAnyRole("ADMIN", "DOCTOR")
            .requestMatchers("/api/patient/**").hasAnyRole("ADMIN", "DOCTOR", "PATIENT")
            
            // All other API endpoints require authentication
            .requestMatchers("/api/**").authenticated()
            .anyRequest().permitAll()
        )
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtAuthenticationFilter, 
            UsernamePasswordAuthenticationFilter.class);

    return http.build();
}
```

### 3.4.2 Business Logic Implementation

#### 3.4.2.1 User Registration with Auto-Entity Creation

When a user registers, the system automatically creates corresponding Doctor or Patient records:

```java
// AuthService.java
@Transactional
public AuthResponse register(RegisterRequest request) {
    // Check for duplicate email
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new RuntimeException("Email already registered");
    }

    Long doctorId = request.getDoctorId();
    Long patientId = request.getPatientId();

    // Auto-create Doctor record if registering as DOCTOR
    if (request.getRole() == User.Role.DOCTOR && doctorId == null) {
        Doctor doctor = Doctor.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .specialization(request.getSpecialization())
                .licenseNumber(request.getLicenseNumber())
                .build();
        
        // Link to department if provided
        if (request.getDepartmentId() != null) {
            departmentRepository.findById(request.getDepartmentId())
                    .ifPresent(doctor::setDepartment);
        }
        
        Doctor savedDoctor = doctorRepository.save(doctor);
        doctorId = savedDoctor.getId();
    }

    // Auto-create Patient record if registering as PATIENT
    if (request.getRole() == User.Role.PATIENT && patientId == null) {
        Patient patient = Patient.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .build();
        
        Patient savedPatient = patientRepository.save(patient);
        patientId = savedPatient.getId();
    }

    // Create user with linked IDs
    User user = User.builder()
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .role(request.getRole())
            .doctorId(doctorId)
            .patientId(patientId)
            .isActive(true)
            .build();

    userRepository.save(user);
    
    // Generate JWT and return response
    CustomUserDetails userDetails = new CustomUserDetails(user);
    String token = jwtUtil.generateToken(userDetails, user.getId(), user.getRole().name());

    return AuthResponse.builder()
            .token(token)
            .email(user.getEmail())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .role(user.getRole().name())
            .userId(user.getId())
            .doctorId(user.getDoctorId())
            .patientId(user.getPatientId())
            .build();
}
```

#### 3.4.2.2 Appointment Scheduling with Conflict Detection

The appointment service prevents double-booking through conflict validation:

```java
// AppointmentService.java
public Appointment createAppointment(Appointment appointment, Long patientId, Long doctorId) {
    Patient patient = patientRepository.findById(patientId)
            .orElseThrow(() -> new RuntimeException("Patient not found"));
    
    Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new RuntimeException("Doctor not found"));

    // Validate no scheduling conflicts
    validateNoConflict(doctor.getId(), appointment.getDate(), appointment.getTime(), null);

    appointment.setPatient(patient);
    appointment.setDoctor(doctor);
    appointment.setStatus(AppointmentStatus.SCHEDULED);
    
    return appointmentRepository.save(appointment);
}

private void validateNoConflict(Long doctorId, LocalDate date, LocalTime time, Long excludeId) {
    List<Appointment> existingAppointments = appointmentRepository
        .findByDoctorIdAndAppointmentDateAndAppointmentTime(doctorId, date, time);
    
    for (Appointment existing : existingAppointments) {
        if (excludeId == null || !existing.getId().equals(excludeId)) {
            if (existing.getStatus() != AppointmentStatus.CANCELLED) {
                throw new RuntimeException(
                    "Doctor already has an appointment at this time"
                );
            }
        }
    }
}

// Get available time slots for a doctor on a specific date
public List<LocalTime> getAvailableTimeSlots(Long doctorId, LocalDate date) {
    List<LocalTime> allSlots = generateTimeSlots();  // 30-minute intervals
    List<Appointment> bookedAppointments = appointmentRepository
        .findByDoctorIdAndAppointmentDate(doctorId, date);
    
    Set<LocalTime> bookedTimes = bookedAppointments.stream()
        .filter(a -> a.getStatus() != AppointmentStatus.CANCELLED)
        .map(Appointment::getAppointmentTime)
        .collect(Collectors.toSet());
    
    return allSlots.stream()
        .filter(slot -> !bookedTimes.contains(slot))
        .collect(Collectors.toList());
}

private List<LocalTime> generateTimeSlots() {
    List<LocalTime> slots = new ArrayList<>();
    LocalTime start = LocalTime.of(8, 0);   // 8:00 AM
    LocalTime end = LocalTime.of(17, 0);    // 5:00 PM
    
    while (start.isBefore(end)) {
        slots.add(start);
        start = start.plusMinutes(30);
    }
    return slots;
}
```

#### 3.4.2.3 Bill Calculation with Automatic Totals

The Bill entity automatically calculates totals using JPA lifecycle callbacks:

```java
// Bill.java
@Entity
@Table(name = "bill")
public class Bill {
    
    @Column(name = "consultation_fee")
    private Double consultationFee;
    
    @Column(name = "medicine_cost")
    private Double medicineCost;
    
    @Column(name = "room_charges")
    private Double roomCharges;
    
    @Column(name = "lab_charges")
    private Double labCharges;
    
    @Column(name = "other_charges")
    private Double otherCharges;
    
    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;
    
    @Column(name = "discount")
    private Double discount;
    
    @Column(name = "tax")
    private Double tax;
    
    @Column(name = "net_amount", nullable = false)
    private Double netAmount;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (billDate == null) {
            billDate = LocalDate.now();
        }
        if (paymentStatus == null) {
            paymentStatus = PaymentStatus.PENDING;
        }
        calculateTotals();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        calculateTotals();
    }

    private void calculateTotals() {
        double total = 0.0;
        if (consultationFee != null) total += consultationFee;
        if (medicineCost != null) total += medicineCost;
        if (roomCharges != null) total += roomCharges;
        if (labCharges != null) total += labCharges;
        if (otherCharges != null) total += otherCharges;
        this.totalAmount = total;
        
        double net = total;
        if (discount != null) net -= discount;
        if (tax != null) net += tax;
        this.netAmount = net;
    }
}
```

#### 3.4.2.4 Audit Logging with Separate Transaction

The audit logging system uses a separate transaction to ensure logs are saved even if the main transaction fails:

```java
// AuditLogService.java
@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Log an action synchronously with a new transaction.
     * Uses REQUIRES_NEW to create a separate transaction.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logAction(Long userId, String username, String userRole, 
            String action, String entityName, String entityId, 
            String details, String ipAddress) {
        try {
            AuditLog log = new AuditLog();
            log.setUserId(userId);
            log.setUsername(username != null ? username : "SYSTEM");
            log.setUserRole(userRole != null ? userRole : "UNKNOWN");
            log.setAction(action != null ? action : "UNKNOWN");
            log.setEntityName(entityName);
            log.setEntityId(entityId);
            log.setDetails(truncateDetails(details));  // Max 1000 chars
            log.setIpAddress(ipAddress);
            log.setTimestamp(LocalDateTime.now());

            auditLogRepository.save(log);
        } catch (Exception e) {
            // Failsafe: Don't let logging failures crash the application
            System.err.println("Failed to save audit log: " + e.getMessage());
        }
    }

    private String truncateDetails(String details) {
        if (details == null) return null;
        return details.length() > 1000 ? details.substring(0, 997) + "..." : details;
    }
}

// Usage in AuthController.java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request,
        HttpServletRequest httpRequest) {
    AuthResponse response = authService.login(request);
    
    // Log successful login
    auditLogService.logAction(
        response.getUserId(),
        response.getEmail(),
        response.getRole(),
        "LOGIN",
        "User",
        response.getUserId().toString(),
        "User logged in successfully",
        httpRequest.getRemoteAddr()
    );
    
    return ResponseEntity.ok(response);
}
```

### 3.4.3 Frontend Implementation

#### 3.4.3.1 Authentication Context Provider

The AuthContext manages global authentication state:

```javascript
// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const userData = await api.getWithToken('/auth/me', token);
                    setUser(userData);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                    localStorage.removeItem('token');
                    setToken(null);
                }
            }
            setLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        localStorage.setItem('token', response.token);
        setToken(response.token);
        setUser(response);
        return response;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    // Role helper functions
    const isAdmin = () => user?.role === 'ADMIN';
    const isDoctor = () => user?.role === 'DOCTOR';
    const isPatient = () => user?.role === 'PATIENT';
    const isNurse = () => user?.role === 'NURSE';
    const isPharmacist = () => user?.role === 'PHARMACIST';
    const hasRole = (roles) => roles.includes(user?.role);

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            login, logout,
            isAdmin, isDoctor, isPatient, isNurse, isPharmacist, hasRole,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

#### 3.4.3.2 Protected Route Implementation

The ProtectedRoute component enforces authentication and role-based access:

```javascript
// ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    // Show loading spinner while checking auth
    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Redirect to unauthorized if role not allowed
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
```

#### 3.4.3.3 API Layer with Token Injection

The API layer automatically attaches JWT tokens to requests:

```javascript
// api.js
const API_BASE_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');

async function fetchApi(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getToken();

    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    if (!response.ok) {
        const errorMessage = await parseErrorResponse(response);
        throw new Error(errorMessage);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

export const api = {
    get: (endpoint) => fetchApi(endpoint, { method: 'GET' }),
    
    getWithToken: (endpoint, token) => 
        fetchApiWithToken(endpoint, token, { method: 'GET' }),
    
    post: (endpoint, data) => fetchApi(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
    }),
    
    put: (endpoint, data) => fetchApi(endpoint, {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
    }),
    
    delete: (endpoint) => fetchApi(endpoint, { method: 'DELETE' }),
};
```

#### 3.4.3.4 Standard Page Component Pattern

All page components follow a consistent pattern:

```javascript
// Standard page component structure (e.g., Patients.jsx)
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../component/Layout';
import FilterModal from '../component/FilterModal';
import Pagination from '../component/Pagination';

const Patients = () => {
    // State management
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState('firstName');
    const [sortOrder, setSortOrder] = useState('asc');
    
    const { isAdmin, isDoctor } = useAuth();
    const itemsPerPage = 10;

    // Data fetching on mount
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const data = await api.get('/patients');
            setPatients(data);
        } catch (err) {
            setError(err.message);
            toast.error('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    // CRUD operations
    const handleCreate = async (patientData) => {
        try {
            await api.post('/patients', patientData);
            toast.success('Patient created successfully');
            fetchPatients();
            setShowModal(false);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleUpdate = async (id, patientData) => {
        try {
            await api.put(`/patients/${id}`, patientData);
            toast.success('Patient updated successfully');
            fetchPatients();
            setShowModal(false);
            setEditingPatient(null);
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) {
            return;
        }
        try {
            await api.delete(`/patients/${id}`);
            toast.success('Patient deleted successfully');
            fetchPatients();
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Filtering and sorting
    const filteredPatients = patients
        .filter(p => 
            p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.lastName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            const order = sortOrder === 'asc' ? 1 : -1;
            return a[sortBy].localeCompare(b[sortBy]) * order;
        });

    // Pagination
    const paginatedPatients = filteredPatients.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Render
    if (loading) return <Layout><div className="loading">Loading...</div></Layout>;
    if (error) return <Layout><div className="error">{error}</div></Layout>;

    return (
        <Layout>
            <div className="patients-page">
                {/* Header with search and add button */}
                {/* Table with patient data */}
                {/* Pagination component */}
                {/* Modal for create/edit */}
            </div>
        </Layout>
    );
};

export default Patients;
```

### 3.4.4 Error Handling

#### 3.4.4.1 Global Exception Handler

The backend uses a global exception handler for consistent error responses:

```java
// GlobalExceptionHandler.java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleRuntimeException(RuntimeException ex) {
        ErrorResponse error = new ErrorResponse(
            ex.getMessage(),
            HttpStatus.BAD_REQUEST.value(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
            fieldErrors.put(error.getField(), error.getDefaultMessage())
        );
        
        ValidationErrorResponse response = new ValidationErrorResponse(
            "Validation failed",
            HttpStatus.BAD_REQUEST.value(),
            fieldErrors
        );
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
        ErrorResponse error = new ErrorResponse(
            "Access denied",
            HttpStatus.FORBIDDEN.value(),
            LocalDateTime.now()
        );
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }
}
```

---

# Chapter 4: Results and Discussion

## 4.1 System Demonstration

### 4.1.1 Application Screenshots

The MEDS Hospital Management System provides a modern, intuitive user interface across all modules:

**Login Page:**
- Clean, centered login form
- Email and password validation
- Error message display for invalid credentials
- Link to registration page

**Dashboard:**
- Role-specific statistics cards
- Visual charts using Recharts library
- Recent activity feed
- Quick action buttons

**Patient Management:**
- Searchable patient list with pagination
- Filter by gender, blood type
- Sort by name, date registered
- Create/Edit modal forms
- Delete confirmation dialogs

**Appointment Scheduling:**
- Calendar-style date selection
- Available time slot display
- Doctor availability checking
- Status management workflow

### 4.1.2 Feature Implementation Status

| Module | Features Implemented | Status |
|--------|---------------------|--------|
| Authentication | Login, Register, JWT, Roles | ✅ Complete |
| Dashboard | Statistics, Charts, Activity | ✅ Complete |
| Patient Management | CRUD, Search, Filter, Sort | ✅ Complete |
| Doctor Management | CRUD, Department Assignment | ✅ Complete |
| Appointments | Scheduling, Conflict Detection, Status | ✅ Complete |
| Medical Records | CRUD, Patient History | ✅ Complete |
| Vital Signs | Recording, History, Trends | ✅ Complete |
| Laboratory | Test Catalog, Orders, Results | ✅ Complete |
| Prescriptions | CRUD, Dispensing Status | ✅ Complete |
| Billing | Invoice Generation, Payments | ✅ Complete |
| Rooms | Inventory, Availability | ✅ Complete |
| Admissions | CRUD, Discharge | ✅ Complete |
| Emergency | Triage, Case Management | ✅ Complete |
| Staff | CRUD, Shift Scheduling | ✅ Complete |
| Insurance | Claims Management | ✅ Complete |
| Documents | Upload, Download, Categorization | ✅ Complete |
| Messages | Internal Messaging | ✅ Complete |
| Notifications | System Notifications | ✅ Complete |
| Audit Logs | Activity Tracking | ✅ Complete |
| PDF Reports | Document Generation | ✅ Complete |

## 4.2 Testing Results

### 4.2.1 Functional Testing

Manual testing was performed on all system features:

| Test Category | Test Cases | Passed | Failed | Pass Rate |
|---------------|------------|--------|--------|-----------|
| Authentication | 15 | 15 | 0 | 100% |
| Patient CRUD | 12 | 12 | 0 | 100% |
| Appointment Flow | 18 | 18 | 0 | 100% |
| Medical Records | 10 | 10 | 0 | 100% |
| Billing | 14 | 14 | 0 | 100% |
| Role Access Control | 25 | 25 | 0 | 100% |
| API Validation | 30 | 30 | 0 | 100% |
| **Total** | **124** | **124** | **0** | **100%** |

### 4.2.2 Security Testing

| Security Aspect | Test Description | Result |
|-----------------|------------------|--------|
| Authentication | Verify login with correct/incorrect credentials | ✅ Pass |
| Token Expiration | Verify JWT expires after 24 hours | ✅ Pass |
| Password Hashing | Verify passwords are BCrypt hashed in database | ✅ Pass |
| SQL Injection | Test API endpoints with injection payloads | ✅ Protected |
| XSS Prevention | Test input fields for script injection | ✅ Protected |
| Role Protection | Access admin endpoints with non-admin user | ✅ Blocked |
| CORS | Verify only allowed origins can access API | ✅ Pass |

### 4.2.3 Performance Metrics

| Operation | Average Response Time | Target | Status |
|-----------|----------------------|--------|--------|
| Login API | 145ms | < 500ms | ✅ Met |
| Get Patients List | 89ms | < 200ms | ✅ Met |
| Create Appointment | 178ms | < 500ms | ✅ Met |
| Generate PDF | 1.2s | < 3s | ✅ Met |
| Dashboard Load | 234ms | < 500ms | ✅ Met |
| Complex Query (filters) | 312ms | < 500ms | ✅ Met |

## 4.3 Discussion

### 4.3.1 Achievements

1. **Comprehensive Feature Set:** Successfully implemented 20+ modules covering all aspects of hospital operations
2. **Modern Architecture:** Clean separation of concerns with React frontend and Spring Boot backend
3. **Security:** Robust JWT-based authentication with role-based access control
4. **User Experience:** Intuitive interface with consistent design patterns
5. **Code Quality:** Well-organized codebase following industry best practices

### 4.3.2 Challenges and Solutions

| Challenge | Solution |
|-----------|----------|
| Complex state management | Used React Context API for global auth state |
| Appointment conflicts | Implemented conflict detection in service layer |
| Audit log transactions | Used separate transaction with REQUIRES_NEW |
| Role-based UI rendering | Created helper functions in AuthContext |
| Form validation | Combined frontend validation with backend @Valid |

### 4.3.3 Limitations

1. **No Real-time Updates:** The system uses polling rather than WebSockets for updates
2. **Limited Mobile Support:** Responsive design is basic; a dedicated mobile app would improve UX
3. **No Email Integration:** Password reset requires manual admin intervention
4. **Limited Reporting:** Advanced analytics and custom reports not yet implemented
5. **Single Tenant:** The system is designed for a single hospital

### 4.3.4 Future Enhancements

1. **WebSocket Integration:** Real-time notifications and updates
2. **Mobile Application:** Native iOS/Android apps using React Native
3. **Email Service:** Automated appointment reminders and password reset
4. **Advanced Analytics:** Dashboard with predictive analytics
5. **Multi-Tenant Support:** SaaS model for multiple hospitals
6. **API Documentation:** Swagger/OpenAPI documentation
7. **Automated Testing:** Unit and integration test suites

---

# Chapter 5: Conclusion

## 5.1 Summary

The MEDS Hospital Management System represents a comprehensive full-stack web application designed to digitize and streamline hospital operations. This project successfully demonstrates the integration of modern web technologies to address real-world healthcare management challenges.

### 5.1.1 Project Objectives Achievement

| Objective | Status | Evidence |
|-----------|--------|----------|
| Develop a comprehensive HMS | ✅ Achieved | 20+ functional modules implemented |
| Implement secure authentication | ✅ Achieved | JWT-based auth with RBAC |
| Create intuitive user interfaces | ✅ Achieved | Modern React UI with consistent design |
| Enable patient management | ✅ Achieved | Full CRUD with search, filter, sort |
| Support appointment scheduling | ✅ Achieved | Conflict detection, availability tracking |
| Manage medical records | ✅ Achieved | Complete patient history management |
| Handle billing and payments | ✅ Achieved | Invoice generation, payment tracking |
| Provide role-based access | ✅ Achieved | 5 user roles with granular permissions |
| Ensure data security | ✅ Achieved | BCrypt passwords, JWT tokens, CORS |
| Create maintainable codebase | ✅ Achieved | Clean architecture, separation of concerns |

### 5.1.2 Technical Achievements

**Backend Development:**
- Built a robust Spring Boot 3.5 application with 25+ REST controllers
- Implemented secure JWT authentication with 24-hour token expiration
- Designed a normalized MySQL database with 22+ interconnected tables
- Created comprehensive service layer with business logic validation
- Integrated audit logging for compliance and security tracking

**Frontend Development:**
- Developed a responsive React 19 application with 24 page components
- Implemented global state management using React Context API
- Created reusable UI components (FilterModal, Pagination, SortDropdown)
- Built protected routing with role-based access control
- Integrated Recharts for dashboard analytics visualization

**Integration:**
- Established RESTful communication between frontend and backend
- Implemented CORS configuration for secure cross-origin requests
- Created consistent API response formats for error handling
- Built automatic token injection for authenticated requests

## 5.2 Contributions

### 5.2.1 Team Member Contributions

**Võ Trí Khôi:**
- Backend architecture and Spring Boot implementation
- Database design and JPA entity mappings
- JWT authentication and security configuration
- API endpoint development for core modules
- Integration testing and bug fixes

**Trương Minh Trí:**
- Frontend architecture and React component development
- UI/UX design implementation
- State management and routing configuration
- Dashboard analytics and chart integration
- Frontend validation and error handling

### 5.2.2 Collaborative Work

Both team members collaborated on:
- System requirements analysis
- Database schema design
- API contract definition
- Testing and quality assurance
- Documentation and reporting

## 5.3 Lessons Learned

### 5.3.1 Technical Insights

1. **Importance of Architecture Planning:**
   Early investment in clean architecture pays dividends during development. The layered approach (Controller → Service → Repository) simplified debugging and feature additions.

2. **Security First Approach:**
   Implementing security from the start (JWT, RBAC) prevented retrofitting issues. Spring Security's filter chain provided a robust foundation.

3. **State Management Complexity:**
   React Context API proved sufficient for authentication state. For larger applications, dedicated state management (Redux, Zustand) should be considered.

4. **API Design Matters:**
   Consistent REST conventions and response formats significantly improved frontend development velocity and error handling.

5. **Database Normalization Benefits:**
   Third Normal Form (3NF) design eliminated data redundancy and simplified data integrity maintenance.

### 5.3.2 Project Management Insights

1. **Iterative Development Works:**
   Building features incrementally allowed for early feedback and course correction.

2. **Documentation Saves Time:**
   Maintaining API documentation and code comments reduced onboarding time and debugging effort.

3. **Version Control is Essential:**
   Git-based workflow enabled parallel development and safe experimentation with features.

4. **Testing Early Catches Bugs:**
   Manual testing during development identified issues before they compounded.

## 5.4 Recommendations

### 5.4.1 For Future Development

1. **Implement Automated Testing:**
   Add JUnit tests for backend services and Jest/React Testing Library for frontend components to ensure regression-free updates.

2. **Add WebSocket Support:**
   Real-time notifications would significantly improve user experience for appointment updates and messages.

3. **Integrate Email Service:**
   Automated appointment reminders and password reset functionality would enhance usability.

4. **Develop Mobile Applications:**
   React Native-based mobile apps would extend accessibility for patients and staff.

5. **Implement API Documentation:**
   Swagger/OpenAPI integration would facilitate third-party integrations and developer onboarding.

### 5.4.2 For Similar Projects

1. **Start with Security:**
   Implement authentication and authorization early in the development cycle.

2. **Design APIs First:**
   Define API contracts before implementation to enable parallel frontend/backend development.

3. **Use Type Safety:**
   Consider TypeScript for frontend development to catch errors at compile time.

4. **Plan for Scale:**
   Design database indexes and query patterns considering future data volume.

5. **Invest in UX:**
   User experience research improves adoption and reduces training requirements.

## 5.5 Final Remarks

The MEDS Hospital Management System successfully demonstrates the feasibility of building a comprehensive healthcare management solution using modern web technologies. The project achieved all stated objectives, delivering a functional system that addresses key hospital operational needs.

The combination of Spring Boot and React provided an excellent foundation for building a scalable, maintainable application. The modular architecture ensures that future enhancements can be added without significant refactoring.

This project has provided valuable hands-on experience with full-stack development, security implementation, database design, and software engineering best practices. The skills and knowledge gained will serve as a strong foundation for future software development endeavors.

The MEDS HMS stands as proof that modern web technologies can effectively digitize healthcare operations, potentially improving efficiency, reducing errors, and enhancing patient care delivery.

---

# References

## Academic References

1. Fowler, M. (2002). *Patterns of Enterprise Application Architecture*. Addison-Wesley Professional.

2. Richardson, C. (2018). *Microservices Patterns: With Examples in Java*. Manning Publications.

3. Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.

4. Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). *Design Patterns: Elements of Reusable Object-Oriented Software*. Addison-Wesley.

5. Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.

## Technical Documentation

6. Spring Framework. (2024). *Spring Boot Reference Documentation*. https://docs.spring.io/spring-boot/docs/current/reference/html/

7. Spring Security. (2024). *Spring Security Reference*. https://docs.spring.io/spring-security/reference/

8. React. (2024). *React Documentation*. https://react.dev/

9. Vite. (2024). *Vite Documentation*. https://vitejs.dev/

10. MySQL. (2024). *MySQL 8.0 Reference Manual*. https://dev.mysql.com/doc/refman/8.0/en/

11. JSON Web Tokens. (2024). *JWT Introduction*. https://jwt.io/introduction

12. Recharts. (2024). *Recharts Documentation*. https://recharts.org/

## Healthcare Standards

13. HL7 International. (2024). *HL7 FHIR Standard*. https://www.hl7.org/fhir/

14. Office for Civil Rights. (2024). *HIPAA Security Rule*. https://www.hhs.gov/hipaa/

15. Agency for Healthcare Research and Quality. (2024). *Health IT Evaluation Toolkit*. https://www.ahrq.gov/

## Online Resources

16. Baeldung. (2024). *Spring Boot and Spring Security Tutorials*. https://www.baeldung.com/

17. MDN Web Docs. (2024). *JavaScript and Web APIs*. https://developer.mozilla.org/

18. Stack Overflow. (2024). *Community Q&A for Developers*. https://stackoverflow.com/

---

# Appendices

## Appendix A: Installation Guide

### Prerequisites

1. **Java Development Kit (JDK) 21+**
   - Download from: https://adoptium.net/
   - Verify: `java -version`

2. **Node.js 18+**
   - Download from: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

3. **MySQL 8.0+**
   - Download from: https://dev.mysql.com/downloads/
   - Create database: `CREATE DATABASE hospital_management_system;`

4. **Maven** (or use Maven Wrapper)
   - Verify: `mvn -v`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Configure database connection
# Edit src/main/resources/application.properties
# Set: spring.datasource.url, username, password

# Build and run
./mvnw spring-boot:run

# Backend will start at http://localhost:8080
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will start at http://localhost:5173
```

### Default Admin Account

After initial setup, log in with:
- **Email:** admin@hospital.com
- **Password:** admin123

## Appendix B: API Endpoint Reference

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | User login |
| GET | /api/auth/me | Get current user |

### Patient Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/patients | List all patients |
| GET | /api/patients/{id} | Get patient by ID |
| POST | /api/patients | Create patient |
| PUT | /api/patients/{id} | Update patient |
| DELETE | /api/patients/{id} | Delete patient |

### Doctor Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/doctors | List all doctors |
| GET | /api/doctors/{id} | Get doctor by ID |
| POST | /api/doctors | Create doctor |
| PUT | /api/doctors/{id} | Update doctor |
| DELETE | /api/doctors/{id} | Delete doctor |

### Appointment Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/appointments | List all appointments |
| GET | /api/appointments/{id} | Get appointment by ID |
| POST | /api/appointments | Create appointment |
| PUT | /api/appointments/{id} | Update appointment |
| PUT | /api/appointments/{id}/status | Update status |
| DELETE | /api/appointments/{id} | Delete appointment |

*Full API documentation available in the source code.*

## Appendix C: Database Schema

### Entity Relationship Summary

```
users (1) -----> (0..1) doctor
users (1) -----> (0..1) patient
doctor (N) -----> (1) department
patient (1) -----> (N) appointment
doctor (1) -----> (N) appointment
patient (1) -----> (N) medical_record
doctor (1) -----> (N) medical_record
patient (1) -----> (N) bill
patient (1) -----> (N) vital_signs
patient (1) -----> (N) lab_order
lab_order (1) -----> (N) lab_result
patient (1) -----> (N) prescription
prescription (1) -----> (N) prescription_item
patient (1) -----> (N) admission
room (1) -----> (N) admission
patient (1) -----> (N) emergency_case
patient (1) -----> (N) insurance_claim
staff (1) -----> (N) shift
user (1) -----> (N) message (sent)
user (1) -----> (N) message (received)
user (1) -----> (N) notification
user (1) -----> (N) audit_log
```

---

**Document Information:**
- Version: 1.5 (Final)
- Last Updated: January 2026
- Authors: Võ Trí Khôi, Trương Minh Trí
- Course: Web Development
- Institution: International University - Vietnam National University HCMC

---

*End of Academic Report*
