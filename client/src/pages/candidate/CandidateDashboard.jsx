// CandidateDashboard: Real-time candidate recruitment tracking, pipeline progress, and KPIs
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import ApplicationTracker from '../../components/ApplicationTracker';
import Loader from '../../components/Loader';
import {
  FileText,
  Clock,
  Briefcase,
  User,
  TrendingUp,
  UserCheck,
  Sparkles,
  LayoutList,
  GitPullRequest
} from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' or 'table'

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications/my-applications');
        setApplications(res.data || []);
      } catch (error) {
        console.error('Failed to load candidate applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <Loader message="Loading candidate metrics & live tracking pipeline..." />;

  // Calculate stats
  const totalApplied = applications.length;
  const inReview = applications.filter((a) => a.status === 'Under Review').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviews = applications.filter((a) => a.status === 'Interview').length;
  const offers = applications.filter((a) => a.status === 'Selected').length;

  // Active spotlight application (prefer Interview, then Shortlisted, then Under Review, then latest)
  const spotlightApp =
    applications.find((a) => a.status === 'Interview') ||
    applications.find((a) => a.status === 'Shortlisted') ||
    applications.find((a) => a.status === 'Under Review') ||
    applications[0];

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Real-Time Candidate Hub
          </div>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '0.3rem', fontWeight: 800 }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--gray-600)' }}>
            Track your recruitment stages, interview invitations, and hiring manager decisions in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/candidate/profile" className="btn btn-outline" style={{ padding: '0.65rem 1.25rem' }}>
            <User size={16} />
            <span>My Profile & Resume</span>
          </Link>
          <Link to="/jobs" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem' }}>
            <Briefcase size={16} />
            <span>Explore Jobs</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-value">{totalApplied}</div>
            <div className="stat-label">Total Applied</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <Clock size={24} />
          </div>
          <div>
            <div className="stat-value">{inReview}</div>
            <div className="stat-label">Under Review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="stat-value">{shortlisted}</div>
            <div className="stat-label">Shortlisted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <UserCheck size={24} />
          </div>
          <div>
            <div className="stat-value">{interviews}</div>
            <div className="stat-label">Interviews Live</div>
          </div>
        </div>
      </div>

      {/* Live Active Application Pipeline Spotlight */}
      {spotlightApp && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitPullRequest size={18} color="var(--primary)" />
              Active Application Stage Spotlight
            </h2>
            <Link to="/candidate/applications" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
              View All {applications.length} Applications →
            </Link>
          </div>
          <ApplicationTracker application={spotlightApp} />
        </div>
      )}

      {/* Applications Explorer Section with View Toggles */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.2rem', fontWeight: 700 }}>
              All Application Progress ({applications.length})
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              Real-time synchronization with recruiter reviews and internal decisions
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ background: 'var(--gray-100)', padding: '0.25rem', borderRadius: 'var(--radius-md)', display: 'inline-flex', gap: '0.25rem' }}>
              <button
                type="button"
                onClick={() => setViewMode('pipeline')}
                style={{
                  border: 'none',
                  background: viewMode === 'pipeline' ? 'var(--white)' : 'transparent',
                  color: viewMode === 'pipeline' ? 'var(--primary)' : 'var(--gray-600)',
                  boxShadow: viewMode === 'pipeline' ? 'var(--shadow-sm)' : 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <GitPullRequest size={14} /> Pipeline View
              </button>

              <button
                type="button"
                onClick={() => setViewMode('table')}
                style={{
                  border: 'none',
                  background: viewMode === 'table' ? 'var(--white)' : 'transparent',
                  color: viewMode === 'table' ? 'var(--primary)' : 'var(--gray-600)',
                  boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <LayoutList size={14} /> Table View
              </button>
            </div>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state" style={{ margin: '1rem 0' }}>
            <Briefcase size={36} color="var(--gray-400)" style={{ marginBottom: '0.75rem' }} />
            <h4>No active job applications yet</h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: '0.4rem 0 1.25rem' }}>
              Apply to active positions to unlock your real-time candidate hiring tracker.
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Search Open Vacancies
            </Link>
          </div>
        ) : viewMode === 'pipeline' ? (
          <div>
            {applications.map((app) => (
              <ApplicationTracker key={app._id} application={app} />
            ))}
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Hiring Manager Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td style={{ fontWeight: 600 }}>
                      <Link to={`/jobs/${app.job?._id}`}>
                        {app.job?.title || 'Position Unavailable'}
                      </Link>
                    </td>
                    <td>{app.job?.company?.name || 'Confidential'}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: app.recruiterNotes ? 'var(--gray-700)' : 'var(--gray-400)', fontStyle: app.recruiterNotes ? 'normal' : 'italic' }}>
                      {app.recruiterNotes || 'Awaiting recruiter feedback'}
                    </td>
                    <td>
                      <Link to={`/jobs/${app.job?._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.6rem' }}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
