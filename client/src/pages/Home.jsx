// Home Page: Landing page with hero banner, featured openings, workflow highlights, and CTA
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import JobCard from '../components/JobCard';
import Loader from '../components/Loader';
import {
  Search,
  Briefcase,
  Users,
  Building,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const navigate = useNavigate();

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
    if (searchTerm) params.append('search', searchTerm);
    if (locationTerm) params.append('location', locationTerm);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          padding: '4.5rem 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'center' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.9rem',
                background: 'rgba(37, 99, 235, 0.2)',
                border: '1px solid rgba(37, 99, 235, 0.4)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.85rem',
                color: '#93c5fd',
                fontWeight: 600,
                marginBottom: '1.25rem'
              }}
            >
              <TrendingUp size={16} /> Next-Generation Recruitment Platform
            </span>

            <h1
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                color: '#ffffff',
                marginBottom: '1.25rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.15
              }}
            >
              Connecting Tech Talent With Dream Careers
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                color: 'var(--gray-300)',
                marginBottom: '2.5rem',
                lineHeight: 1.6
              }}
            >
              CareerConnect bridges the gap between ambitious candidates, hiring recruiters, and forward-thinking companies with end-to-end recruitment workflows.
            </p>

            {/* Quick Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              style={{
                background: '#ffffff',
                padding: '0.6rem',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ flex: '1 1 240px', display: 'flex', alignItems: 'center', padding: '0 0.75rem' }}>
                <Search size={20} color="var(--gray-400)" style={{ marginRight: '0.5rem' }} />
                <input
                  type="text"
                  placeholder="Job title, skill (e.g. React, Node.js)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: 'var(--gray-800)'
                  }}
                />
              </div>

              <div
                style={{
                  flex: '1 1 200px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 0.75rem',
                  borderLeft: '1px solid var(--gray-200)'
                }}
              >
                <input
                  type="text"
                  placeholder="Location (e.g. Bangalore, Remote)"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: 'var(--gray-800)'
                  }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
                Search Jobs
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Recruitment Workflow Demonstration */}
      <section style={{ padding: '4rem 0', background: 'var(--white)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: '1.9rem', marginBottom: '0.75rem' }}>
              How CareerConnect Works
            </h2>
            <p style={{ color: 'var(--gray-600)' }}>
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
            <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Users size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>For Candidates</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Search tailored positions, view full salary & skill breakdowns, submit instant applications, and track decisions in real-time.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Browse & multi-filter tech jobs
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Candidate profile & skills portfolio
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Live status tracker (Applied → Selected)
                </li>
              </ul>
            </div>

            {/* Recruiter Box */}
            <div className="card" style={{ borderTop: '4px solid var(--accent)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: '#e0e7ff',
                  color: 'var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <Briefcase size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>For Recruiters</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Publish job openings for registered companies, manage candidate pipelines, review resumes, and assign progression statuses.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Post & manage company job listings
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Review candidates with secure ownership
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Add notes & update hiring stages
                </li>
              </ul>
            </div>

            {/* Admin Box */}
            <div className="card" style={{ borderTop: '4px solid var(--success)' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--success-bg)',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}
              >
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>For Administrators</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Supervise the entire recruitment ecosystem, monitor platform metrics, manage user accounts, and maintain employer directories.
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--gray-700)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Complete user & role management
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Platform health & aggregate metrics
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={15} color="var(--success)" /> Global company & job oversight
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: '4rem 0', background: 'var(--gray-50)' }}>
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
              <h2 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Latest Opportunities</h2>
              <p style={{ color: 'var(--gray-600)' }}>Explore top jobs verified and actively recruiting.</p>
            </div>
            <Link to="/jobs" className="btn btn-outline">
              <span>View All Openings</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <Loader message="Loading verified job postings..." />
          ) : featuredJobs.length === 0 ? (
            <div className="empty-state">
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
    </div>
  );
};

export default Home;
