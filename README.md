# 🚀 Smart Campus Operations Hub
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com/?color=00F7FF&size=28&center=true&vCenter=true&width=700&lines=Smart+Campus+Operations+Hub;Modern+University+Management+System;React+%2B+Spring+Boot+Project" />
</p>


<p align="center">
  <b>A modern platform for managing campus facilities, bookings, and maintenance workflows</b>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/LithiraLiyanage/Smart-Campus-Operations-Hub?style=for-the-badge&color=yellow" />
  <img src="https://img.shields.io/github/forks/LithiraLiyanage/Smart-Campus-Operations-Hub?style=for-the-badge&color=blue" />
  <img src="https://img.shields.io/github/issues/LithiraLiyanage/Smart-Campus-Operations-Hub?style=for-the-badge&color=green" />
  <img src="https://img.shields.io/github/last-commit/LithiraLiyanage/Smart-Campus-Operations-Hub?style=for-the-badge&color=orange" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img src="https://img.shields.io/badge/Backend-SpringBoot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white"/>
  <img src="https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/UI-TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white"/>
</p>

---

## 🌐 Overview

**Smart Campus Operations Hub** is a modern, production-inspired web application designed to streamline university operations through a single centralized platform.

It integrates:

* 📅 Facility & Asset Booking
* 🛠️ Maintenance & Incident Management
* 🔔 Real-time Notifications
* 🔐 Secure Role-Based Access

> Built using **Spring Boot + React**, following real-world system architecture and best practices.

---

## 🚀 Project Overview

<p align="center">
  <img src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop" width="700"/>
</p>

<p align="center">
  <b>💻 A modern platform to manage campus facilities, bookings, and maintenance workflows efficiently</b>
</p>

---

Smart Campus Operations Hub is a production-inspired web application designed to centralize and streamline university operations into a single intelligent system.

It provides a seamless experience for managing facilities, handling bookings, tracking maintenance requests, and delivering real-time notifications with secure role-based access.

✨ Built with scalability, performance, and real-world architecture in mind.

---

## 🎯 Key Features

### 🏢 Facilities & Assets Management

* Manage lecture halls, labs, meeting rooms, and equipment
* Resource metadata: capacity, location, availability, status
* Advanced search and filtering

---

### 📅 Booking Management

* Request bookings with date, time, and purpose
* Workflow:

  ```
  PENDING → APPROVED / REJECTED → CANCELLED
  ```
* Prevent overlapping bookings
* Admin approval with reasons
* View personal and all bookings

---

### 🛠️ Maintenance & Incident Ticketing

* Create tickets with category, priority, and description
* Upload up to 3 image attachments
* Workflow:

  ```
  OPEN → IN_PROGRESS → RESOLVED → CLOSED
  ```
* Assign technicians
* Add comments with ownership control

---

### 🔔 Notifications System

* Booking approvals/rejections
* Ticket updates and comments
* Real-time UI notification panel

---

### 🔐 Authentication & Authorization

* Role-Based Access Control (RBAC)
* Roles:

  * 👤 USER
  * 🛡️ ADMIN
  * 🔧 TECHNICIAN (optional)
* Secure API endpoints

---

## 🧱 Tech Stack

### 💻 Frontend

* React.js
* Tailwind CSS
* Axios
* Framer Motion

### ⚙️ Backend

* Spring Boot (REST API)
* MongoDB / SQL
* Spring Security
* Maven

### 🔧 DevOps

* GitHub
* GitHub Actions (CI/CD ready)

---

## 🏗️ System Architecture

```
Frontend (React)
        ↓
REST API (Spring Boot)
        ↓
Database (MongoDB)
```

* Clean layered architecture
* RESTful design
* Scalable and maintainable

---

## 🔑 Core Workflows

### 📅 Booking Flow

```
User → Request Booking → Admin Review → Approve/Reject → Notification
```

### 🛠️ Ticket Flow

```
User → Create Ticket → Assign Technician → Update Status → Resolve → Close
```
---

## ⚡ Installation & Setup

### 1️⃣ Clone Repository

```
git clone https://github.com/LithiraLiyanage/Smart-Campus-Operations-Hub.git
cd Smart-Campus-Operations-Hub
```

---

### 2️⃣ Backend Setup

```
cd backend
mvn spring-boot:run
```

Update `application.properties`:

```
spring.data.mongodb.uri=mongodb://localhost:27017/campusdb
```

---

### 3️⃣ Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing & Quality

* API tested using Postman
* Input validation & error handling
* Proper HTTP status codes
* Clean and maintainable code

---

## 👥 Team Contribution

| Member   | Module                |
| -------- | --------------------- |
| Member A | Facilities & Assets   |
| Member B | Booking System        |
| Member C | Maintenance & Tickets |
| Member D | Notifications & Auth  |

---

## 🔥 Advanced Features

* 🌙 Light / Dark Mode
* 🎨 Modern UI with animations
* 🔐 Secure authentication system
* 📊 Scalable architecture

---

## 📌 Future Improvements

* 📊 Admin analytics dashboard
* 🔔 Email & push notifications
* 📱 Mobile responsiveness improvements
* 📷 QR-based booking check-in

---

## ⚠️ Academic Integrity

This project is developed for:

**IT3030 – Programming Applications and Frameworks (SLIIT)**

* Each member contributed individually
* All implementations can be explained during viva
* Commit history reflects real contributions

---

## 💡 Author

👨‍💻 Developed by a student team group no 14 Y3S1
🎓 SLIIT – 2026

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub!

