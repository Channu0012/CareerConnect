# 💼 CareerConnect — Full-Stack MERN Recruitment Platform

<div align="center">

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge&logo=react)
![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-25.x-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT Auth](https://img.shields.io/badge/JWT-Protected-black?style=for-the-badge&logo=jsonwebtokens)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<p align="center">
  <strong>A realistic, enterprise-grade recruitment ecosystem connecting job seekers, technical recruiters, hiring companies, and platform administrators.</strong>
</p>

</div>

---

## 📌 Table of Contents
- [Project Overview](#-project-overview)
- [System Architecture & Data Flow](#-system-architecture--data-flow)
- [Recruitment Workflows (Role-Based)](#-recruitment-workflows-role-based)
- [Database Architecture (ER Diagram)](#-database-architecture-er-diagram)
- [Security & Defense Architecture](#-security--defense-architecture)
- [REST API Reference](#-rest-api-reference)
- [Installation & Quick Start](#-installation--quick-start)
- [Environment Configuration](#-environment-configuration)
- [Seeding Realistic Test Data](#-seeding-realistic-test-data)
- [Technical Viva & Defense Guide](#-technical-viva--defense-guide)

---

## 🎯 Project Overview

In conventional job portals, candidates often experience an opaque hiring process, while recruiters struggle to coordinate multiple postings and track individual applicant pipelines.

**CareerConnect** solves this with an end-to-end, multi-tenant hiring lifecycle built on the **MERN (MongoDB, Express.js, React, Node.js)** architecture:
- **Candidates**: Search and filter opportunities across technical domains, submit applications with portfolio/resume links, and track live status updates (`Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview` ➔ `Selected` / `Rejected`).
- **Recruiters**: Manage company-linked job postings, evaluate candidate portfolios, update stage decisions with internal notes, and maintain requisition pipelines.
- **Administrators**: Maintain global oversight with real-time aggregate statistics, user account governance (activation toggling), and compliance moderation.

---

## 🏛 System Architecture & Data Flow

```
                                  +-----------------------+
                                  |     Web Browser       |
                                  |   (React 19 + Vite)   |
                                  +-----------+-----------+
                                              |
                             HTTP / HTTPS     | REST API Calls
                                (JSON)        | (Bearer JWT)
                                              v
                             +----------------+---------------+
                             |       Express.js Server        |
                             |         (Node.js API)          |
                             +----------------+---------------+
                                              |
                   +--------------------------+--------------------------+
                   |                          |                          |
                   v                          v                          v
          +-----------------+        +-----------------+        +-----------------+
          | Security Layers |        | Auth & RBAC     |        | Controllers     |
          | - CORS Guard    |        | - JWT Protect   |        | - Auth & Users  |
          | - Rate Limiter  |        | - Role Check    |        | - Jobs & Search |
          | - DoS Limiter   |        | - Ownership     |        | - Applications  |
          +--------+--------+        +--------+--------+        +--------+--------+
                   |                          |                          |
                   +--------------------------+--------------------------+
                                              |
                                              v
                             +----------------+---------------+
                             |        Mongoose ODM            |
                             |   (Schema Validation Hooks)    |
                             +----------------+---------------+
                                              |
                                              v
                             +----------------+---------------+
                             |    MongoDB Database Cluster    |
                             |    (Atlas Cloud / Local)       |
                             +--------------------------------+
```

---

## 🔄 Recruitment Workflows (Role-Based)

### 1. Candidate Lifecycle
```
[ Register / Sign In ]
         │
         ▼
[ Explore & Search Vacancies ] ──( Keywords, Skills, Location, Salary )
         │
         ▼
[ Inspect Job & Company Profile ]
         │
         ▼
[ Submit Application & Resume URL ]
         │
         ▼
[ Candidate Dashboard: Real-Time Tracker ]
         │
         ├──► Status: "Applied"
         ├──► Status: "Under Review"
         ├──► Status: "Shortlisted"
         ├──► Status: "Interview"
         └──► Status: "Selected" / "Rejected" (With Recruiter Feedback)
```

### 2. Recruiter Lifecycle
```
[ Recruiter Sign In ]
         │
         ▼
[ Recruiter Dashboard ] ──( Overview: Active Jobs, Applicant Headcount )
         │
         ├──► [ Register / Link Company Profile ]
         │
         ├──► [ Publish New Job Opening ]
         │
         ├──► [ Manage My Listings ] ──( Edit / Delete with Ownership Verification )
         │
         └──► [ Review Job Applicants ]
                     │
                     ├──► Inspect Candidate Skills, Bio, & Portfolio Link
                     ├──► Update Stage Status (Applied ➔ Selected)
                     └──► Record Internal Feedback & Recruiter Notes
```

### 3. Administrator Lifecycle
```
[ Administrator Sign In ]
         │
         ▼
[ Platform Oversight Dashboard ]
         │
         ├──► Global Metrics (Users breakdown, Job distribution, Pipeline aggregate)
         ├──► User Governance (Search, Activate / Deactivate Accounts, Delete)
         ├──► Company Directory Oversight
         └──► Global Job Moderation (Delete non-compliant listings)
```

---

## 🗄 Database Architecture (ER Diagram)

```
  +------------------+             +------------------+
  |       USER       |             |     COMPANY      |
  +------------------+             +------------------+
  | _id (PK)         |             | _id (PK)         |
  | name             |             | name             |
  | email (Unique)   |             | description      |
  | password (Hash)  |             | industry         |
  | role (Enum)      |             | location         |
  | status (Active)  |             | website          |
  | createdAt        |             | logo             |
  +--------+---------+             | createdBy (FK)   |
           | 1                     +--------+---------+
           |                                | 1
           | owns/posts                     | hires for
           v *                              v *
  +--------+--------------------------------+---------+
  |                       JOB                         |
  +---------------------------------------------------+
  | _id (PK)                                          |
  | title                                             |
  | description                                       |
  | company (FK -> Company)                           |
  | recruiter (FK -> User)                            |
  | location                                          |
  | employmentType (Full-time, Remote, Contract, etc.)|
  | experienceLevel (Entry, Mid, Senior, Lead)        |
  | salaryRange (min, max, currency)                  |
  | skills (Array of Strings)                         |
  | status (Active, Closed, Draft)                    |
  | applicationsCount                                 |
  +-------------------------+-------------------------+
                            | 1
                            | receives
                            v *
  +-------------------------+-------------------------+
  |                   APPLICATION                     |
  +---------------------------------------------------+
  | _id (PK)                                          |
  | candidate (FK -> User)                            |
  | job (FK -> Job)                                   |
  | status (Applied, Shortlisted, Interview, etc.)    |
  | coverLetter                                       |
  | resumeLink                                        |
  | recruiterNotes                                    |
  | appliedAt                                         |
  +---------------------------------------------------+
           ^ *
           | submits
           | 1
  +--------+---------+
  |    CANDIDATE     |
  +------------------+
  | _id (PK)         |
  | user (FK, Unique)|
  | phone            |
  | headline         |
  | location         |
  | skills (Array)   |
  | bio              |
  | resumeLink       |
  +------------------+
```

---

## 🛡 Security & Defense Architecture

The backend implements defense-in-depth measures against common web vulnerabilities:

```
[ Incoming HTTP Request ]
           │
           ▼
[ CORS Whitelist Filter ] ────────► Reject unauthorized cross-origin requests
           │
           ▼
[ HTTP Security Headers ] ────────► X-Frame-Options: DENY (Anti-Clickjacking)
           │                        X-Content-Type-Options: nosniff
           │                        X-XSS-Protection: 1; mode=block
           │                        Strict-Transport-Security (HSTS)
           ▼
[ DoS Payload Limiter ] ──────────► Reject payloads > 50KB
           │
           ▼
[ IP Rate Limiter ] ──────────────► Max 10 auth attempts per 15 min (Anti-Brute-Force)
           │
           ▼
[ NoSQL Injection Sanitizer ] ────► Strict primitive string validation on inputs
           │
           ▼
[ JWT Authentication Guard ] ─────► Verify bearer signature & active account status
           │
           ▼
[ Role-Based Access Control ] ────► Enforce role permissions ('candidate', 'recruiter', 'admin')
           │
           ▼
[ Resource Ownership Check ] ─────► Recruiter can only modify their own listings
           │
           ▼
[ Business Controller & DB ]
```

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new candidate or recruiter |
| `POST` | `/api/auth/login` | Public | Authenticate user & return signed JWT |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile |
| `PUT` | `/api/auth/profile` | Authenticated | Update account profile details |

### Vacancies & Jobs (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | Search & multi-filter active openings with pagination |
| `GET` | `/api/jobs/:id` | Public | View detailed job requirements & company specs |
| `GET` | `/api/jobs/recruiter/my-jobs` | Recruiter/Admin | List jobs authored by authenticated recruiter |
| `POST` | `/api/jobs` | Recruiter/Admin | Publish a new job requisition |
| `PUT` | `/api/jobs/:id` | Recruiter/Admin | Edit requisition (Ownership verified) |
| `DELETE` | `/api/jobs/:id` | Recruiter/Admin | Delete requisition & associated applications |

### Applications (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/:jobId` | Candidate | Submit job application (Compound index prevents duplicates) |
| `GET` | `/api/applications/my-applications` | Candidate | View candidate's submitted applications & stage updates |
| `GET` | `/api/applications/job/:jobId` | Recruiter/Admin | Review all applicant profiles for a specific requisition |
| `PATCH` | `/api/applications/:id/status` | Recruiter/Admin | Update hiring stage & record recruiter feedback notes |

### Administration (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Real-time aggregate platform metrics |
| `GET` | `/api/admin/users` | Admin | Search & filter all platform accounts |
| `PATCH` | `/api/admin/users/:id/status` | Admin | Toggle account active/inactive status |
| `DELETE` | `/api/admin/users/:id` | Admin | Cascade delete user account (Self-deletion protected) |
| `GET` | `/api/admin/jobs` | Admin | Global moderation view of all system jobs |

---

## 🚀 Installation & Quick Start

### Prerequisites
- **Node.js** (v18.x or newer)
- **MongoDB** (Local instance or MongoDB Atlas Cloud Cluster)

### 1. Clone Repository
```bash
git clone https://github.com/Channu0012/CareerConnect.git
cd CareerConnect
```

### 2. Configure Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/careerconnect?retryWrites=true&w=majority
JWT_SECRET=careerconnect_super_secret_jwt_key_2026
NODE_ENV=development
```

### 3. Seed Realistic Data (Optional but Recommended)
```bash
npm run seed
```

### 4. Start the Application
In your backend terminal:
```bash
npm run dev
# Backend running at: http://localhost:5000
```

In a new terminal, start the frontend:
```bash
cd client
npm install
npm run dev
# Frontend running at: http://localhost:5173
```

---

## 🔑 Demo Seeded Test Accounts

| Role | Email | Password | Pre-loaded Content |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@careerconnect.com` | `password123` | Applied to 2 jobs, Shortlisted & Under Review |
| **Candidate 2** | `priya@careerconnect.com` | `password123` | Applied to Cloud DevOps, Interview stage |
| **Recruiter** | `recruiter@techflow.com` | `password123` | Authored vacancies, applicant reviews ready |
| **Admin** | `admin@careerconnect.com` | `password123` | Global metrics, user governance & moderation |

---

## 🎓 Technical Viva & Defense Guide

### 1. React & Modern Frontend Architecture
- **Q: Why use React's Context API over Redux for this application?**  
  *A:* Context API provides a lightweight, native state management solution for global authentication (`user`, `token`, `login`, `logout`) without introducing redundant boilerplate or external dependencies.
- **Q: How does client-side route protection work?**  
  *A:* The `<ProtectedRoute>` component wraps protected routes. It verifies whether an active session exists in `AuthContext` and whether `user.role` matches `allowedRoles`. Unauthorized access triggers a `<Navigate to="/login" replace />` redirect.
- **Q: Why are React keys required when mapping lists?**  
  *A:* Keys give elements a stable identity across renders. They allow React's Virtual DOM reconciliation engine to determine which items were added, modified, or removed, preventing unnecessary DOM reconstructions.

### 2. Node.js & Express API Design
- **Q: What is the difference between 401 Unauthorized and 403 Forbidden?**  
  *A:* `401 Unauthorized` signifies missing or invalid credentials (unauthenticated). `403 Forbidden` signifies that the user is authenticated, but lacks sufficient permissions (e.g., a candidate attempting to access `/api/admin/users`).
- **Q: Why implement backend validation when frontend validation already exists?**  
  *A:* Frontend validation is solely for user experience. Malicious actors can bypass browser validations using tools like cURL or Postman. Server-side validation is the single source of truth for database integrity and security.

### 3. MongoDB & Mongoose Schema Architecture
- **Q: How do you prevent duplicate job applications?**  
  *A:* Using a compound unique index on the Application schema: `applicationSchema.index({ candidate: 1, job: 1 }, { unique: true })`. This guarantees atomic duplicate prevention at the database engine level.
- **Q: What is `.populate()` in Mongoose?**  
  *A:* MongoDB is a document-oriented database without native relational SQL joins. `.populate()` performs an automated query to replace referenced ObjectIds with the actual documents from referenced collections.

### 4. Authentication & Security
- **Q: How does password hashing work?**  
  *A:* Plaintext passwords are never stored. Using a Mongoose pre-save hook, passwords are salted and hashed using `bcryptjs` (`bcrypt.genSalt(10)`). During authentication, `bcrypt.compare()` verifies the candidate password against the stored hash in constant time to prevent timing attacks.
- **Q: How do you prevent NoSQL injection?**  
  *A:* By validating input variable types (ensuring `typeof email === 'string'`) before constructing queries. This neutralizes malicious JSON payloads like `{ "email": { "$gt": "" } }`.

---

<div align="center">
  <sub>Developed for the Final MERN Stack Developer Internship Assessment. Built with passion and engineering rigor.</sub>
</div>