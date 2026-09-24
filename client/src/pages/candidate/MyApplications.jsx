// MyApplications: Full tracking and interactive pipeline stepper for candidate applications
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import ApplicationTracker from '../../components/ApplicationTracker';
import Loader from '../../components/Loader';
import {
  Briefcase,
  Search,
  GitPullRequest,
  LayoutList,
  Sparkles
} from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('pipeline'); // 'pipeline' or 'table'

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get('/applications/my-applications');
        setApplications(res.data || []);
      } catch (error) {
        console.error('Failed to load applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) return <Loader message="Fetching your real-time application pipeline..." />;

  // Filter applications
  const filtered = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch =
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview', 'Selected', 'Rejected'];

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            <Sparkles size={14} /> Live Application Tracking
          </div>
          <h1 style={{ fontSize: '1.9rem', marginBottom: '0.3rem', fontWeight: 800 }}>My Job Applications</h1>
          <p style={{ color: 'var(--gray-600)' }}>
            Follow your application pipeline in real time from initial review to interview scheduling and hiring offers.
          </p>
        </div>

        <Link to="/jobs" className="btn btn-outline" style={{ padding: '0.6rem 1.1rem' }}>
          <Briefcase size={16} />
          <span>Browse More Jobs</span>
        </Link>
      </div>

      {/* Filter Row & View Mode Toggles */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.15rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by job title, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          {/* Quick Status Filter Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            {statuses.map((st) => {
              const count = st === 'All' ? applications.length : applications.filter(a => a.status === st).length;
              const isSelected = statusFilter === st;

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  style={{
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--primary)' : 'var(--gray-200)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--white)',
                    color: isSelected ? 'var(--primary)' : 'var(--gray-600)',
                    padding: '0.35rem 0.7rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'var(--transition)'
                  }}
                >
                  <span>{st}</span>
                  <span
                    style={{
                      background: isSelected ? 'var(--primary)' : 'var(--gray-200)',
                      color: isSelected ? 'var(--white)' : 'var(--gray-700)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle */}
          <div style={{ background: 'var(--gray-100)', padding: '0.2rem', borderRadius: 'var(--radius-md)', display: 'inline-flex', gap: '0.2rem' }}>
            <button
              type="button"
              onClick={() => setViewMode('pipeline')}
              style={{
                border: 'none',
                background: viewMode === 'pipeline' ? 'var(--white)' : 'transparent',
                color: viewMode === 'pipeline' ? 'var(--primary)' : 'var(--gray-600)',
                boxShadow: viewMode === 'pipeline' ? 'var(--shadow-sm)' : 'none',
                padding: '0.35rem 0.7rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <GitPullRequest size={14} /> Pipeline
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              style={{
                border: 'none',
                background: viewMode === 'table' ? 'var(--white)' : 'transparent',
                color: viewMode === 'table' ? 'var(--primary)' : 'var(--gray-600)',
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
                padding: '0.35rem 0.7rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <LayoutList size={14} /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Applications Display */}
      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ margin: '2rem auto' }}>
            <Briefcase size={40} color="var(--gray-400)" style={{ marginBottom: '0.75rem' }} />
            <h3>No applications found</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: '0.4rem 0 1.25rem' }}>
              {applications.length === 0
                ? "You haven't submitted any applications yet."
                : `No applications match the filter "${statusFilter}".`}
            </p>
            <Link to="/jobs" className="btn btn-primary btn-sm">
              Explore Open Positions
            </Link>
          </div>
        </div>
      ) : viewMode === 'pipeline' ? (
        <div>
          {filtered.map((app) => (
            <ApplicationTracker key={app._id} application={app} />
          ))}
        </div>
      ) : (
        <div className="card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title & Location</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Recruiter Notes</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        <Link to={`/jobs/${app.job?._id}`}>{app.job?.title || 'Job Deleted'}</Link>
                      </div>
                      <small style={{ color: 'var(--gray-500)' }}>{app.job?.location}</small>
                    </td>
                    <td>{app.job?.company?.name || 'Company Confidential'}</td>
                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td style={{ fontSize: '0.85rem', color: app.recruiterNotes ? 'var(--gray-800)' : 'var(--gray-400)', maxWidth: '280px' }}>
                      {app.recruiterNotes || 'No notes added yet'}
                    </td>
                    <td>
                      <Link to={`/jobs/${app.job?._id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.3rem 0.65rem' }}>
                        View Job
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
