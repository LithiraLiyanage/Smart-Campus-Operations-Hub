# 🚀 PAFProject – Full Stack Web Application

This project is a **Full Stack Web Application** built using:

* 🔹 **Backend**: Spring Boot (Java, Maven)
* 🔹 **Frontend**: React.js + Tailwind CSS
* 🔹 **Database**: MongoDB Atlas

---

## 🚀 Git Workflow Guide

## 📌 Branch Structure Overview

| Branch    | Purpose                               | Who Can Push              |
|-----------|----------------------------------------|---------------------------|
| `main`    | Production-ready stable code           | ❌ DO NOT PUSH DIRECTLY   |
| `dev` | Integration branch (combined features) | ✅ Via Pull Request (PR)  |
| `authentication`    | auth-notifications-role-management          | 👤 Achindu             |
| `facilities_resources` | booking-management                  | 👤 Kalindu               |
| `booking_system` | booking-management                  | 👤 Shalini               |
| `incident_ticketing` | ticketing-system               | 👤 Deshan              |

---

## ⚠️ Important Rules

- ❌ Never push directly to `main`
- ❌ Never push directly to `dev`
- ✅ Always work in your assigned branch
- ✅ Always create a Pull Request (PR)
- ✅ `main` should only be updated from `dev`

---

# 🛠️ Prerequisites (IMPORTANT)

Before running this project, make sure your system has the following installed:

## 🔹 1. Java Development Kit (JDK)

* Version: **JDK 17 or above** (Recommended: JDK 21 or 23)
* Check installation:

```bash
java -version
```

---

## 🔹 2. Node.js & npm

* Install Node.js (LTS version recommended)
* Check:

```bash
node -v
npm -v
```

---

## 🔹 3. Maven (Optional)

Maven wrapper is included, so no need to install manually.

---

## 🔹 4. MongoDB Atlas Account

* Accept the invitaton and joined the cluster PAF_Project
* Get your **MongoDB connection URI**

---

## 🔹 5. VS Code Extensions (Recommended)

Install these extensions in VS Code:

* Java Extension Pack
* Spring Boot Extension Pack
* Maven for Java
* ES7+ React/Redux Snippets
* Tailwind CSS IntelliSense
* Prettier (Code Formatter)

---

# 📥 How to Clone the Project

Open terminal and run:

```bash
git clone https://github.com/AchinduW/EduNexus.git
cd PAFProject
```

---

# 🔐 Environment Setup (VERY IMPORTANT)

## Step 1 — Set MongoDB URI

You must set your MongoDB connection string as an environment variable.

### Windows (PowerShell)

```bash
$env:MONGO_URI="your_mongodb_connection_string"
```

### Mac/Linux

```bash
export MONGO_URI=your_mongodb_connection_string
```

---

## Step 2 — Verify application.properties

File:

```
backend/src/main/resources/application.properties
```

Ensure:

```properties
spring.data.mongodb.uri=${MONGO_URI}
```

---

# ▶️ How to Run the Project

## 🔹 Run Backend (Spring Boot)

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

👉 Backend will start at:

```
http://localhost:8080
```

---

## 🔹 Run Frontend (React)

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

👉 Frontend will run at:

```
http://localhost:3000
```

---

# 📂 Project Structure

```
PAFProject/
├── backend/      # Spring Boot backend
├── frontend/     # React frontend
├── .gitignore
└── README.md
```

---

# 🔒 Security Notes

* ❌ Do NOT commit `.env` files
* ❌ Do NOT expose MongoDB credentials
* ✅ Use environment variables for sensitive data

---

# ⚠️ Troubleshooting

## 🔴 Error: MONGO_URI not found

👉 Fix:

```bash
$env:MONGO_URI="your_uri"
```

---

## 🔴 Port already in use

👉 Change port in:

```properties
server.port=8081
```

---

## 🔴 Node modules missing

```bash
npm install
```

---

# 👨‍💻 Author

* Developed as part of **PAF (Programming Applications Framework)** module

---

# ⭐ Final Notes

* Make sure backend is running before frontend
* Ensure MongoDB URI is correct
* Use latest stable tools for best performance

---

🎯 **Your project is now ready to run and deploy!**
