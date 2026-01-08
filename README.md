<h1 align="center">🏥 HMS - Hospital Management System</h1>

<p align="center">
  <strong>A comprehensive full-stack web application for modern healthcare management</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-active-success?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/version-1.0.0-orange?style=flat-square" alt="Version">
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [Authors](#-authors)
- [License](#-license)

---

## 🌟 Overview

**HMS** is a comprehensive Hospital Management System designed to digitize and streamline hospital operations. Built with modern web technologies, it provides a secure, scalable, and user-friendly platform for managing all aspects of healthcare facility operations.

### Why HMS?

- 🔒 **Secure**: JWT-based authentication with role-based access control
- 📱 **Responsive**: Mobile-friendly design for access anywhere
- ⚡ **Fast**: Optimized performance with sub-200ms API responses
- 🏗️ **Scalable**: Modular architecture for easy expansion
- 🎨 **Modern UI**: Intuitive interface with dark mode support

---

## ✨ Features

### Core Modules

| Module | Description |
|--------|-------------|
| 🔐 **Authentication** | Secure login/register with JWT tokens and role-based access |
| 👥 **Patient Management** | Complete patient records with search, filter, and sort |
| 👨‍⚕️ **Doctor Management** | Doctor profiles, specializations, and department assignment |
| 📅 **Appointments** | Scheduling with conflict detection and availability tracking |
| 📋 **Medical Records** | Comprehensive patient health history management |
| 💊 **Prescriptions** | Electronic prescriptions with dispensing status |
| 🧪 **Laboratory** | Test catalog, orders, and results management |
| 💉 **Vital Signs** | Patient vitals recording and trend analysis |
| 🏥 **Admissions** | Inpatient admission and discharge management |
| 🚪 **Room Management** | Room inventory and availability tracking |
| 🚨 **Emergency** | Emergency case triage with ESI levels |
| 💰 **Billing** | Invoice generation and payment processing |
| 🛡️ **Insurance** | Claims submission and tracking |
| 👔 **Staff Management** | Staff records and shift scheduling |
| 📄 **Documents** | Medical document upload and management |
| 💬 **Messaging** | Internal communication system |
| 🔔 **Notifications** | System alerts and reminders |
| 📊 **Dashboard** | Analytics with charts and statistics |
| 📝 **Audit Logs** | Complete activity tracking for compliance |
| 📑 **PDF Reports** | Downloadable reports and documents |

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.0 | UI Library |
| Vite | 6.0 | Build Tool |
| React Router DOM | 7.1 | Routing |
| Recharts | 2.15 | Charts & Analytics |
| React Toastify | 11.0 | Notifications |
| React Icons | 5.4 | Icon Library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.5.0 | Application Framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | 3.x | Data Access Layer |
| JWT (jjwt) | 0.12.6 | Token Authentication |
| Lombok | 1.18 | Code Generation |
| iTextPDF | 5.5.13 | PDF Generation |

### Database
| Technology | Version | Purpose |
|------------|---------|---------|
| MySQL | 8.0+ | Relational Database |

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                          │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │                         React 19 + Vite                        │  │
│  │  ┌─────────┐  ┌────────────┐  ┌───────────┐  ┌─────────────┐   │  │
│  │  │  Pages  │  │ Components │  │  Context  │  │  API Layer  │   │  │
│  │  └─────────┘  └────────────┘  └───────────┘  └─────────────┘   │  │
│  └────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬──────────────────────────────────────────┘
                            │ HTTP/REST (JSON)
                            ▼
┌───────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                           │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                         Spring Boot 3.5                         │  │
│  │  ┌─────────────┐  ┌──────────┐  ┌──────────────┐  ┌──────────┐  │  │
│  │  │ Controllers │  │ Services │  │ Repositories │  │ Security │  │  │
│  │  └─────────────┘  └──────────┘  └──────────────┘  └──────────┘  │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────────────────┬───────────────────────────────────────────┘
                            │ JDBC/JPA
                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                               DATA LAYER                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                            MySQL 8.0                             │  │
│  │                   22+ Tables | InnoDB | UTF8MB4                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Java JDK 21+** - [Download](https://adoptium.net/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/)
- **Maven** (or use included wrapper)

### Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/HospitalManagementSystem.git
cd HospitalManagementSystem
```

#### 2️⃣ Database Setup

```sql
-- Create database
CREATE DATABASE hospital_management_system;

-- (Optional) Import sample data
SOURCE database/hospital_management_system.sql;
```

#### 3️⃣ Backend Configuration

Edit `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/hospital_management_system
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### 4️⃣ Start Backend Server

```bash
cd backend
./mvnw spring-boot:run
```

Backend starts at: **http://localhost:8080**

#### 5️⃣ Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

Frontend starts at: **http://localhost:5173**

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hospital.com | admin123 |
| Doctor | doctor@hospital.com | doctor123 |
| Patient | patient@hospital.com | patient123 |

---

## 📁 Project Structure

```
HospitalManagementSystem/
├── 📂 backend/
│   └── src/main/java/com/hms/hospital_management_system/
│       ├── 📂 config/          # Security, CORS configuration
│       ├── 📂 controller/      # REST API endpoints (25+ controllers)
│       ├── 📂 dto/             # Data Transfer Objects
│       ├── 📂 entity/          # JPA Entities (22+ entities)
│       ├── 📂 repository/      # Spring Data repositories
│       ├── 📂 security/        # JWT, authentication
│       └── 📂 service/         # Business logic
│
├── 📂 frontend/
│   └── src/
│       ├── 📂 api/             # API integration layer
│       ├── 📂 assets/          # Static assets
│       ├── 📂 component/       # Reusable UI components
│       ├── 📂 context/         # React Context (Auth)
│       ├── 📂 pages/           # Page components (24 pages)
│       └── 📂 styles/          # CSS stylesheets
│
├── 📂 database/
│   └── hospital_management_system.sql
│
├── 📄 ACADEMIC_REPORT.md       # Full project documentation
└── 📄 README.md
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

### Key Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | User login | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| GET | `/patients` | List all patients | ✅ |
| POST | `/patients` | Create patient | ✅ Admin |
| GET | `/doctors` | List all doctors | ✅ |
| GET | `/appointments` | List appointments | ✅ |
| POST | `/appointments` | Create appointment | ✅ |
| GET | `/medical-records` | List medical records | ✅ |
| GET | `/bills` | List bills | ✅ Admin |
| GET | `/dashboard/stats` | Dashboard statistics | ✅ |

> 📖 Full API documentation available in `ACADEMIC_REPORT.md`

---

## 👥 User Roles

| Role | Access Level | Key Permissions |
|------|--------------|-----------------|
| **ADMIN** | Full Access | All modules, user management, audit logs |
| **DOCTOR** | Clinical | Patients, appointments, medical records, prescriptions |
| **PATIENT** | Personal | Own records, appointments, bills, messages |
| **NURSE** | Clinical Support | Patients, vitals, admissions, emergency |
| **PHARMACIST** | Pharmacy | Prescriptions, medicine inventory |

---

## 📸 Screenshots

### Dashboard
- Role-specific statistics cards
- Interactive charts with Recharts
- Recent activity feed
- Quick action buttons

### Patient Management
- Searchable patient list
- Advanced filtering options
- Sortable columns
- CRUD operations with modals

### Appointments
- Calendar view
- Available time slot display
- Status management
- Conflict detection

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
./mvnw test

# Frontend tests
cd frontend
npm test
```

### Test Coverage

| Category | Test Cases | Pass Rate |
|----------|------------|-----------|
| Authentication | 15 | 100% |
| Patient CRUD | 12 | 100% |
| Appointments | 18 | 100% |
| API Validation | 30 | 100% |
| **Total** | **124** | **100%** |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Authors

<table>
  <tr>
    <td align="center">
      <strong>Võ Trí Khôi</strong><br>
      <sub>Backend Developer</sub><br>
      <sub>Spring Boot, Security, API Design</sub>
    </td>
    <td align="center">
      <strong>Trương Minh Trí</strong><br>
      <sub>Frontend Developer</sub><br>
      <sub>React, UI/UX, State Management</sub>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Spring Boot](https://spring.io/projects/spring-boot) - Backend framework
- [React](https://react.dev/) - Frontend library
- [Recharts](https://recharts.org/) - Chart library
- [React Icons](https://react-icons.github.io/react-icons/) - Icon library

---

<p align="center">
  International University - VNU HCMC | 2025-2026
</p>
