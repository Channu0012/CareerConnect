# 🚀 CareerConnect — Full-Stack MERN Recruitment Platform

> **Final MERN Stack Developer Internship Project**  
> An enterprise-grade, realistic recruitment platform connecting candidates, recruiters, companies, and platform administrators.

---

## 📋 Table of Contents
1. [Project Overview & Problem Statement](#-project-overview--problem-statement)
2. [Technology Stack](#-technology-stack)
3. [System Architecture](#-system-architecture)
4. [Role Workflows & Capabilities](#-role-workflows--capabilities)
5. [Getting Started & Installation](#-getting-started--installation)
6. [Environment Configuration](#-environment-configuration)
7. [Database Setup & Seeder](#-database-setup--seeder)
8. [Demo Test Credentials](#-demo-test-credentials)
9. [REST API Documentation](#-rest-api-documentation)
10. [Security & Ownership Implementation](#-security--ownership-implementation)
11. [Technical Viva & Interview Cheat Sheet](#-technical-viva--interview-cheat-sheet)

---

## 🎯 Project Overview & Problem Statement

Modern hiring often suffers from disjointed communication, fragmented tracking, and lack of transparency between candidates and hiring managers.

**CareerConnect** solves this by providing a unified, full-stack platform with clear role-based access control (RBAC):
- **Candidates** discover opportunities with rich multi-criteria filters, submit applications with portfolio links, and monitor their hiring progress in real-time.
- **Recruiters** publish vacancies tied to registered companies, review applicants with resume links and cover notes, assign hiring statuses (`Applied` → `Under Review` → `Shortlisted` → `Interview` → `Selected`/`Rejected`), and record internal candidate feedback.
- **Administrators** maintain ecosystem health with platform metrics, user activation governance, and global job moderation.

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 19 (Vite) | High-performance, reactive UI components |
| **Routing** | React Router DOM v7 | Single Page Application (SPA) role-based routing |
| **State & Auth** | Context API & Axios | Global authentication state & HTTP interceptors |
| **Backend API** | Node.js & Express.js | RESTful routing, middleware, and controllers |
| **Database** | MongoDB & Mongoose | Flexible NoSQL document database and schema modeling |
| **Security** | JWT & Bcrypt.js | Stateless authentication & salted password hashing |
| **Design** | Pure Modern CSS | Responsive layouts, CSS variables, and design tokens |

---

## 🏛 System Architecture

```
                                  CareerConnect
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 │                                             │
         React Frontend (Vite)                        Express.js Backend API
                 │                                             │
      ┌──────────┴──────────┐                       ┌──────────┴──────────┐
      │                     │                       │                     │
Components & Pages     Context & Services      Middleware & Auth     Controllers & Models
      │                     │                       │                     │
   Public & Portals     Axios Interceptors    JWT Verification (protect)  CRUD & Ownership
      │                     │                       │                     │
      └──────────┬──────────┘                       └──────────┬──────────┘
                 │                                             │
                 └────────────── HTTP / REST API ──────────────┘
                                        │
                                    Mongoose
                                        │
                                     MongoDB
```

### Folder Structure
```
Careerconnect/
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, JobCard, StatusBadge, Modal, Loader, ProtectedRoute
│   │   ├── context/            # AuthContext (login, register, logout, token state)
│   │   ├── layouts/            # MainLayout (public) & DashboardLayout (role sidebar)
│   │   ├── pages/              # Home, Jobs, JobDetails, Login, Register, NotFound
│   │   │   ├── candidate/      # CandidateDashboard, MyApplications, CandidateProfile
│   │   │   ├── recruiter/      # RecruiterDashboard, ManageJobs, JobForm, ReviewApplications, ManageCompanies
│   │   │   └── admin/          # AdminDashboard, ManageUsers, ManageAllJobs
│   │   ├── services/           # Axios instance with Bearer token interceptor
│   │   ├── App.jsx             # Main routing & protected route tree
│   │   ├── index.css           # Responsive design system
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                     # Express Backend API
│   ├── config/                 # db.js (Mongoose connection)
│   ├── controllers/            # auth, job, application, company, candidate, admin
│   ├── middleware/             # authMiddleware (protect & authorize), errorMiddleware
│   ├── models/                 # User, Company, Job, Candidate, Application
│   ├── routes/                 # authRoutes, jobRoutes, applicationRoutes, companyRoutes, candidateRoutes, adminRoutes
│   ├── utils/                  # generateToken.js, seeder.js
│   ├── app.js                  # Express application setup
│   ├── server.js               # Entry point listening on PORT
│   ├── .env.example
│   └── package.json
│
├── package.json                # Workspace script runner
└── README.md                   # Full documentation & viva guide
```

---

## 👥 Role Workflows & Capabilities

### 1. Candidate Workflow
```
Register / Login → Browse & Filter Jobs → View Job Details → Submit Application & Resume → Track Status & Notes in Dashboard
```
- Multi-criteria job search by keyword, skills, location, employment type, and experience level.
- Submit application with resume link and custom cover letter.
- Track real-time status transitions: `Applied`, `Under Review`, `Shortlisted`, `Interview`, `Selected`, `Rejected`.
- Profile manager to update contact info, headline, skills, and summary bio.

### 2. Recruiter Workflow
```
Login → Recruiter Dashboard → Register Company → Post Job Opening → Review Candidates → Update Application Status & Notes
```
- Dedicated recruiter dashboard with vacancy and applicant statistics.
- Post, edit, and delete job listings (protected with backend ownership verification).
- Access applicant list per job, review candidate resumes, and add recruiter notes.
- Register hiring organizations with descriptions, logos, and headquarters.

### 3. Administrator Workflow
```
Login → Global Dashboard → Monitor Aggregate Metrics → Manage Users (Activate/Deactivate) → Moderate Jobs
```
- Real-time platform metrics: total users by role, active vs closed jobs, application pipeline distribution.
- User governance: search users, toggle active/inactive status, remove accounts (with self-deletion guard).
- Global job moderation: monitor all vacancies across companies and delete non-compliant postings.

---

## ⚙️ Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or newer)
- [MongoDB](https://www.mongodb.com/) (Local installation or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cloud cluster)

### 1. Clone & Navigate
```bash
cd Careerconnect
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/careerconnect
JWT_SECRET=careerconnect_super_secret_jwt_key_2026
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGODB_URI` with your connection string: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/careerconnect?retryWrites=true&w=majority`)*

Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server running on http://localhost:5000
```

### 3. Frontend Setup
In a new terminal window:
```bash
cd client
npm install
npm run dev
# Client running on http://localhost:5173
```

---

## 🔑 Demo Test Credentials

To assist evaluators during assessment demonstrations, pre-seeded accounts are provided with one-click quick fill buttons on the Login page:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@careerconnect.com` | `password123` | Search, Apply, Track Applications, Manage Profile |
| **Candidate 2** | `priya@careerconnect.com` | `password123` | Search, Apply, Track Applications |
| **Recruiter** | `recruiter@techflow.com` | `password123` | Post & Edit Jobs, Review Applicants, Manage Companies |
| **Recruiter 2**| `recruiter@cloudpeak.com` | `password123` | Manage CloudPeak Jobs & Applicants |
| **Admin** | `admin@careerconnect.com` | `password123` | Platform oversight, Manage Users, Moderate All Jobs |

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new Candidate or Recruiter |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Get profile of logged-in user |
| `PUT` | `/api/auth/profile` | Private | Update name, email, or password |

### Job Management (`/api/jobs`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Public | List active jobs with search, filters & pagination |
| `GET` | `/api/jobs/:id` | Public | View detailed job specifications & company info |
| `GET` | `/api/jobs/recruiter/my-jobs` | Recruiter/Admin | List jobs created by current recruiter |
| `POST` | `/api/jobs` | Recruiter/Admin | Publish a new job vacancy |
| `PUT` | `/api/jobs/:id` | Recruiter/Admin | Edit authorized job (enforces ownership) |
| `DELETE` | `/api/jobs/:id` | Recruiter/Admin | Delete authorized job (enforces ownership) |

### Application Workflow (`/api/applications`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/applications/:jobId` | Candidate | Submit application (prevents duplicate submissions) |
| `GET` | `/api/applications/my-applications` | Candidate | View candidate's application history & statuses |
| `GET` | `/api/applications/job/:jobId` | Recruiter/Admin | List applicants for job (enforces ownership) |
| `PATCH`| `/api/applications/:id/status` | Recruiter/Admin | Update hiring decision status & recruiter notes |

### Companies (`/api/companies`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/companies` | Public | List registered hiring companies |
| `GET` | `/api/companies/:id` | Public | View single company overview |
| `POST` | `/api/companies` | Recruiter/Admin | Register new hiring company |

### Candidate Profile (`/api/candidates`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/candidates/me` | Candidate | Get current candidate's profile & skills |
| `PUT` | `/api/candidates/me` | Candidate | Update headline, skills, bio, resume link |
| `GET` | `/api/candidates/:userId`| Recruiter/Admin | Lookup candidate details during application review |

### Administrator Control (`/api/admin`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Admin | Aggregate platform metrics & stage breakdowns |
| `GET` | `/api/admin/users` | Admin | Search & list all users across roles |
| `PATCH`| `/api/admin/users/:id/status` | Admin | Toggle user active/inactive status |
| `DELETE`| `/api/admin/users/:id` | Admin | Cascade-delete user and their records |
| `GET` | `/api/admin/jobs` | Admin | Global oversight on all posted jobs |

---

## 🔒 Security & Ownership Implementation

1. **Password Hashing**: Passwords are never stored in plaintext. They are salted and hashed using `bcryptjs` via Mongoose pre-save hooks.
2. **Stateless JWT Authorization**: Sensitive endpoints are protected via `protect` middleware which verifies token signature and confirms active user status.
3. **Role-Based Access Control (RBAC)**: Protected via `authorize('candidate')`, `authorize('recruiter')`, or `authorize('admin')`.
4. **Resource Ownership Checks**:
   - Recruiter A cannot edit or delete Recruiter B's job.
   - Recruiter A cannot review or modify applications submitted for Recruiter B's jobs.
   - Checked at the database controller level:
   ```javascript
   if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
     return res.status(403).json({ message: 'Security Alert: Ownership violation' });
   }
   ```
5. **No Duplicate Applications**: Compound index on `(candidate, job)` ensures candidates cannot spam multiple applications for the same job.

---

## 🎓 Technical Viva & Interview Cheat Sheet

### 1. React & Frontend Questions
- **What is JSX?**  
  JSX is a syntax extension for JavaScript that allows writing HTML-like markup inside JavaScript code. It gets compiled into `React.createElement()` calls by build tools like Vite.
- **What is the difference between props and state?**  
  *Props* are read-only inputs passed from parent to child components. *State* is mutable data managed internally by a component that causes re-renders when updated.
- **Why are keys required when rendering lists?**  
  Keys help React's virtual DOM reconciliation algorithm identify which items have changed, been added, or removed, avoiding unnecessary re-renders.
- **How do Protected Routes work in React Router?**  
  A custom wrapper component (`ProtectedRoute`) checks authentication state from `AuthContext`. If the user is unauthenticated or lacks the required role, it redirects using `<Navigate to="/login" replace />`, otherwise it renders `<Outlet />`.

### 2. Node.js & Express Questions
- **What is Express middleware?**  
  Functions that execute during the request-response cycle. They have access to `req`, `res`, and `next()`, allowing tasks like parsing JSON bodies, validating tokens, and logging.
- **What is the difference between 401 and 403?**  
  - `401 Unauthorized`: The client is unauthenticated (missing or invalid JWT).
  - `403 Forbidden`: The client is authenticated, but their role or identity lacks permission to access the resource (e.g. candidate trying to access admin endpoints).
- **Why should backend validation exist even when frontend validation exists?**  
  Frontend validation improves user experience, but can easily be bypassed using Postman or cURL. Backend validation is the true line of defense to maintain database integrity and security.

### 3. MongoDB & Mongoose Questions
- **What is Mongoose and why use it?**  
  Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, type casting, middleware hooks (pre/post save), and query building.
- **What is `.populate()` in Mongoose?**  
  MongoDB is a document database without native joins. `.populate()` automatically substitutes referenced ObjectIds with the actual documents from referenced collections.
- **What is indexing and why is it useful?**  
  Indexes are special data structures that store a small portion of the collection's data in an easy-to-traverse form. They dramatically accelerate search and query performance (e.g. text indexing on job titles and compound indexing on application pairs).

### 4. Authentication & Security Questions
- **How does JWT authentication work?**  
  Upon successful login with hashed passwords, the server issues a digitally signed JSON Web Token containing the user ID. The client sends this token in the `Authorization: Bearer <token>` header with subsequent requests. The server verifies the token signature without querying session tables.
- **Why should secrets never be committed to Git?**  
  Committing secrets exposes database credentials and cryptographic keys to unauthorized parties, leading to potential data breaches. Secrets should always reside in `.env` files added to `.gitignore`.

---

## 🏆 Final Assessment Workflow Verification

- [x] **Candidate Registration & Login**
- [x] **Job Search & Multi-criteria Filtering**
- [x] **Application Submission & Status Tracker**
- [x] **Recruiter Job CRUD with Ownership Protection**
- [x] **Applicant Review, Status Updates, & Recruiter Notes**
- [x] **Admin Platform Oversight & User Status Toggles**
- [x] **Seeded Test Accounts with Demo One-Click Access**
- [x] **Zero Build Errors (`npm run build` verified)**
#   C a r e e r C o n n e c t  
 