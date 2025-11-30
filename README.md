# 🏥 Hospital Management System

A complete full‑stack hospital management system, including patient records, doctor schedules, appointments, and financial reports. The project uses a separated architecture with **React (Frontend)** and **Spring Boot (Backend)**.

![Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🏗 Project Structure

The project follows a **Monorepo** architecture containing both Frontend and Backend:

```
Hospital-Management-System/
├── backend/                  # Spring Boot Application
│   ├── src/main/java/com/hms 
│   │   ├── config/           # Configurations (CORS, Security)
│   │   ├── controller/       # API Endpoints
│   │   ├── model/            # Entities
│   │   └── repository/       # Database Access
│   ├── src/main/resources    # application.properties
│   └── pom.xml               # Maven configuration
│
├── frontend/                 # React + Vite Application
│   ├── src/
│   │   ├── api/              # API integration
│   │   ├── components/       # UI Components
│   │   ├── pages/            # Main pages
│   │   └── styles/           # CSS assets
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🛠 Tech Stack

### **Frontend**

* **React 19** + Vite
* JavaScript ES6+ / JSX
* Key libraries:

  * `recharts` 
  * `react-calendar`
  * `react-icons`
  * `fetch API` for calling backend
  * `react-router-dom`

### **Backend**

* **Spring Boot 3.5.8**
* Java 17
* **MySQL** Database
* **Maven** build tool
* RESTful API architecture

---

## ⚙️ Prerequisites

Ensure your system has:

* Node.js v18+
* Java JDK 17+
* MySQL Server (default port 3306)

---

## 🚀 Setup Guide

### **Step 1: Create MySQL Database**

Run in MySQL Workbench or terminal:

```sql
CREATE DATABASE hospital_management_system;
```

Backend default database settings:

* user: `root`
* password: `1234`

You can edit these here:

```
backend/src/main/resources/application.properties
```

---

### **Step 2: Run Backend (Spring Boot)**

Backend runs at: **[http://localhost:8080](http://localhost:8080)**

In terminal:

```bash
./mvnw mvn spring-boot:run
```

**Important CORS Config:**

```java
registry.addMapping("/**")
        .allowedOrigins("http://localhost:5173")
        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
        .allowCredentials(true);
```

---

### **Step 3: Run Frontend (React)**

Frontend runs at **[http://localhost:5173](http://localhost:5173)**

**Change directory**

```bash
cd frontend
```

**Installation**
```
npm install
```

**Development**
```
npm run dev
```

**API Configuration:**

```js
const API_BASE_URL = 'http://localhost:8080/api';
```

---

## 🧪 Testing System Connectivity

* Visit **[http://localhost:5173](http://localhost:5173)**

  * Dashboard renders → Frontend OK
  * Real database data shows → Full-stack connection OK

Test backend endpoint:

```
http://localhost:8080/api/hello
```

---

## 🐛 Common Issues & Fixes

| Issue                  | Cause                                 | Solution                                          |
| ---------------------- | ------------------------------------- | ------------------------------------------------- |
| **CORS Error**         | Backend doesn't allow frontend origin | Check `CorsConfig.java`                           |
| **Connection Refused** | Backend or MySQL not running          | Restart backend & database                        |
| **npm run dev error**  | Missing node_modules                  | Run `npm install`                                 |
| **Library not found**  | Missing packages                      | `npm install recharts react-icons react-calendar react-router-dom` |

---

© 2025 Hospital Management System
