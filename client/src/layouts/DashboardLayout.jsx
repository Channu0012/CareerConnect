// Dashboard Layout: Side-navigation dashboard frame tailored to the authenticated role
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  PlusCircle,
  Building,
  Users,
  ShieldCheck
} from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="app-layout">
      <Navbar />
      <div className="dashboard-wrapper">
        <aside className="dashboard-sidebar">
          {user?.role === 'candidate' && (
            <>
              <div className="sidebar-title">Candidate Portal</div>
              <NavLink
                to="/candidate"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/candidate/applications"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <FileText size={18} />
                <span>My Applications</span>
              </NavLink>

              <NavLink
                to="/candidate/profile"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <User size={18} />
                <span>Profile & Resume</span>
              </NavLink>

              <NavLink
                to="/jobs"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Briefcase size={18} />
                <span>Browse Jobs</span>
              </NavLink>
            </>
          )}

          {user?.role === 'recruiter' && (
            <>
              <div className="sidebar-title">Recruiter Portal</div>
              <NavLink
                to="/recruiter"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/recruiter/jobs"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Briefcase size={18} />
                <span>Manage My Jobs</span>
              </NavLink>

              <NavLink
                to="/recruiter/jobs/new"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <PlusCircle size={18} />
                <span>Post New Job</span>
              </NavLink>

              <NavLink
                to="/recruiter/companies"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Building size={18} />
                <span>Hiring Companies</span>
              </NavLink>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className="sidebar-title">Administrator Portal</div>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/admin/users"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Users size={18} />
                <span>Manage Users</span>
              </NavLink>

              <NavLink
                to="/admin/companies"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Building size={18} />
                <span>Manage Companies</span>
              </NavLink>

              <NavLink
                to="/admin/jobs"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Briefcase size={18} />
                <span>Platform Jobs</span>
              </NavLink>
            </>
          )}
        </aside>

        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
