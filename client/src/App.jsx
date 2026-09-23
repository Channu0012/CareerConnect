// App.jsx: Main application routing and role-based route guard configuration
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import MyApplications from './pages/candidate/MyApplications';
import CandidateProfile from './pages/candidate/CandidateProfile';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import ManageJobs from './pages/recruiter/ManageJobs';
import JobForm from './pages/recruiter/JobForm';
import ReviewApplications from './pages/recruiter/ReviewApplications';
import ManageCompanies from './pages/recruiter/ManageCompanies';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageAllJobs from './pages/admin/ManageAllJobs';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Candidate Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['candidate']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/candidate" element={<CandidateDashboard />} />
              <Route path="/candidate/applications" element={<MyApplications />} />
              <Route path="/candidate/profile" element={<CandidateProfile />} />
            </Route>
          </Route>

          {/* Recruiter Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['recruiter', 'admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/recruiter" element={<RecruiterDashboard />} />
              <Route path="/recruiter/jobs" element={<ManageJobs />} />
              <Route path="/recruiter/jobs/new" element={<JobForm />} />
              <Route path="/recruiter/jobs/:id/edit" element={<JobForm />} />
              <Route path="/recruiter/companies" element={<ManageCompanies />} />
              <Route path="/recruiter/applications/:jobId" element={<ReviewApplications />} />
            </Route>
          </Route>

          {/* Administrator Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/companies" element={<ManageCompanies />} />
              <Route path="/admin/jobs" element={<ManageAllJobs />} />
            </Route>
          </Route>

          {/* 404 Catch-All Route */}
          <Route element={<MainLayout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
