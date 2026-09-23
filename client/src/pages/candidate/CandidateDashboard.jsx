// CandidateDashboard: Summary view of candidate activity, KPIs, and recent applications
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import {
  FileText,
  CheckCircle2,
  Clock,
  Briefcase,
  ArrowRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader message="Loading candidate metrics..." />;

  // Calculate stats
  const totalApplied = applications.length;
  const inReview = applications.filter((a) => a.status === 'Under Review').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const interviews = applications.filter((a) => a.status === 'Interview').length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: 'var(--gray-600)' }}>
          Here is an overview of your recruitment journey and application statuses.
        </p>
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
            <div className="stat-label">Interviews Scheduled</div>
          </div>
        </div>
      </div>

      {/* Recent Applications Section */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>Recent Applications</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              Track decisions and notes updated by hiring managers
            </p>
          </div>
          <Link to="/candidate/applications" className="btn btn-outline btn-sm">
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {applications.length === 0 ? (
          <div className="empty-state" style={{ margin: '1rem 0' }}>
            <Briefcase size={32} color="var(--gray-400)" style={{ marginBottom: '0.75rem' }} />
            <h4>No active job applications yet</h4>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: '0.4rem 0 1.25rem' }}>
              Start applying to suitable opportunities to track hiring decisions.
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Search Open Vacancies
            </Link>
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
                  <th>Recruiter Feedback / Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.slice(0, 5).map((app) => (
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
