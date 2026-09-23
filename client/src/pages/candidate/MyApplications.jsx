// MyApplications: Full tracking table for all applications submitted by candidate
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import { Briefcase, Search, Filter } from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  if (loading) return <Loader message="Fetching your application history..." />;

  // Filter applications
  const filtered = applications.filter((app) => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const matchesSearch =
      app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.job?.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>My Job Applications</h1>
        <p style={{ color: 'var(--gray-600)' }}>
          Review the real-time hiring stage and notes for every position you've applied to.
        </p>
      </div>

      {/* Filter Row */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: '1 1 250px' }}>
            <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Filter by job or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 1 220px' }}>
            <Filter size={16} color="var(--gray-500)" />
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Stages</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ margin: '1.5rem auto' }}>
            <Briefcase size={36} color="var(--gray-400)" style={{ marginBottom: '0.75rem' }} />
            <h3>No applications found</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: '0.4rem 0 1.25rem' }}>
              {applications.length === 0
                ? "You haven't submitted any applications yet."
                : 'No applications match your chosen filter.'}
            </p>
            {applications.length === 0 && (
              <Link to="/jobs" className="btn btn-primary btn-sm">
                Explore Open Positions
              </Link>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
};

export default MyApplications;
