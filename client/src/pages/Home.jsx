import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import {
  Search,
  Briefcase,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  LayoutDashboard
} from 'lucide-react';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const navigate = useNavigate();

  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'recruiter' ? '/recruiter' : '/candidate';

  useEffect(() => {
    const fetchRecentJobs = async () => {
      try {
        const res = await API.get('/jobs?limit=6');
        setFeaturedJobs(res.data.jobs || []);
      } catch (error) {
        console.error('Failed to load featured jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentJobs();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.append('search', searchTerm.trim());
    if (locationTerm.trim()) params.append('location', locationTerm.trim());
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#1e293b' }}>
      {/* 1. Hero Section (Clean White Theme) */}
      <section
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          padding: '4.5rem 0 3.5rem',
          borderBottom: '1px solid #e2e8f0',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '820px' }}>
          {/* Top Badge */}
          <div style={{ marginBottom: '1.25rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.4rem 1rem',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '9999px',
                fontSize: '0.85rem',
                color: '#1d4ed8',
                fontWeight: 600
              }}
            >
              <TrendingUp size={16} /> Verified Tech Opportunities & Real-Time Tracking
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 5vw, 3.25rem)',
              color: '#0f172a',
              marginBottom: '1.25rem',
              letterSpacing: '-0.025em',
              fontWeight: 800,
              lineHeight: 1.2
            }}
          >
            Connecting Tech Talent With Dream Careers
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: '#475569',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto 2.5rem'
            }}
          >
            CareerConnect bridges the gap between ambitious candidates, hiring recruiters, and forward-thinking companies with end-to-end recruitment workflows.
          </p>

          {/* Simple White Search Bar */}
          <div
            style={{
              background: '#ffffff',
              padding: '0.85rem',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
              border: '1px solid #e2e8f0',
              maxWidth: '750px',
              margin: '0 auto'
            }}
          >
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ flex: '1 1 240px', position: 'relative' }}>
                <Search
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Job title, skills, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    paddingLeft: '2.5rem',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    height: '46px'
                  }}
                />
              </div>

              <div style={{ flex: '1 1 180px', position: 'relative' }}>
                <MapPin
                  size={18}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Location or Remote"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  style={{
                    paddingLeft: '2.5rem',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    height: '46px'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{
                  height: '46px',
                  padding: '0 1.75rem',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  borderRadius: '8px'
                }}
              >
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Recruitment Workflow Demonstration */}
      <section style={{ padding: '4rem 0', background: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.9rem', color: '#0f172a', marginBottom: '0.75rem', fontWeight: 700 }}>
              How CareerConnect Works
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Built to demonstrate a realistic recruitment lifecycle with 3 distinct user roles.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.75rem'
            }}
          >
            {/* Candidate Box */}
            <div
              className="card"
              style={{
                borderTop: '4px solid var(--primary)',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderTopColor: 'var(--primary)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                padding: '1.75rem'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem', fontWeight: 600 }}>
                For Candidates
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Search tailored positions, view full salary & skill breakdowns, submit instant applications, and track decisions in real-time.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Browse & multi-filter tech jobs
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Candidate profile & portfolio links
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Live status tracker (Applied → Offer)
                </li>
              </ul>
            </div>

            {/* Recruiter Box */}
            <div
              className="card"
              style={{
                borderTop: '4px solid var(--accent)',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderTopColor: 'var(--accent)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                padding: '1.75rem'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: '#e0e7ff',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <Briefcase size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem', fontWeight: 600 }}>
                For Recruiters
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Publish job openings for registered companies, manage candidate pipelines, review resumes, and assign progression statuses.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Post & manage company job listings
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Review candidates with secure ownership
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Add notes & update hiring stages
                </li>
              </ul>
            </div>

            {/* Admin Box */}
            <div
              className="card"
              style={{
                borderTop: '4px solid var(--success)',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderTopColor: 'var(--success)',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                padding: '1.75rem'
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '0.5rem', fontWeight: 600 }}>
                For Administrators
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                Supervise the entire recruitment ecosystem, monitor platform metrics, manage user accounts, and maintain employer directories.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Complete user & role management
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Platform health & aggregate metrics
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle size={16} color="var(--success)" /> Global company & job oversight
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Jobs Section (Clean White Background) */}
      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 700 }}>
                Latest Opportunities
              </h2>
              <p style={{ color: '#64748b' }}>Explore top jobs verified and actively recruiting.</p>
            </div>
            <Link to="/jobs" className="btn btn-outline" style={{ background: '#ffffff', borderColor: '#cbd5e1', color: '#0f172a' }}>
              <span>View All Openings</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading verified job postings..." />
          ) : featuredJobs.length === 0 ? (
            <div className="empty-state" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
              <Briefcase size={36} color="var(--gray-400)" style={{ marginBottom: '1rem' }} />
              <h3>No jobs posted yet</h3>
              <p style={{ color: 'var(--gray-500)', marginTop: '0.5rem' }}>
                Run the database seeder (`npm run seed`) to load sample opportunities.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Simple Call to Action Banner */}
      <section style={{ padding: '3.5rem 0', background: '#ffffff', borderTop: '1px solid #e2e8f0', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.75rem', fontWeight: 700 }}>
            {isAuthenticated ? `Welcome Back, ${user?.name}!` : 'Ready to Take Your Next Step?'}
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '1.75rem' }}>
            {isAuthenticated
              ? 'Access your personalized dashboard to manage job applications, interviews, or hiring pipelines.'
              : 'Join thousands of professionals finding great roles or hiring top engineers through CareerConnect.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <LayoutDashboard size={18} />
                  <span>Go to Dashboard</span>
                </Link>
                <Link to="/jobs" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
                  Explore Open Jobs
                </Link>
              </>
            ) : (
              <>
                <Link to="/jobs" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
                  Browse All Jobs
                </Link>
                <Link to="/register" className="btn btn-outline" style={{ padding: '0.75rem 1.5rem' }}>
                  Create Free Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
