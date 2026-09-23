// RecruiterDashboard: KPI metrics, hiring pipeline summary, and quick post actions
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import {
  Briefcase,
  Users,
  CheckCircle,
  PlusCircle,
  Building,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterJobs = async () => {
      try {
        const res = await API.get('/jobs/recruiter/my-jobs');
        setJobs(res.data || []);
      } catch (error) {
        console.error('Failed to load recruiter jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecruiterJobs();
  }, []);

  if (loading) return <Loader message="Loading recruiter dashboard..." />;

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === 'Active').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>
            Recruiter Control Center 👋
          </h1>
          <p style={{ color: 'var(--gray-600)' }}>
            Manage your open requisitions and evaluate incoming talent applications.
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Post New Job Opening</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-value">{totalJobs}</div>
            <div className="stat-label">Total Jobs Posted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <CheckCircle size={24} />
          </div>
          <div>
            <div className="stat-value">{activeJobs}</div>
            <div className="stat-label">Active Vacancies</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{totalApplicants}</div>
            <div className="stat-label">Total Applications Received</div>
          </div>
        </div>
      </div>

      {/* Managed Jobs Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.2rem' }}>My Job Listings</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              Select a job opening to evaluate candidates and update hiring stages
            </p>
          </div>
          <Link to="/recruiter/jobs" className="btn btn-outline btn-sm">
            <span>Manage All ({jobs.length})</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="empty-state" style={{ margin: '1.5rem auto' }}>
            <Briefcase size={36} color="var(--gray-400)" style={{ marginBottom: '0.75rem' }} />
            <h3>No job postings published yet</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: '0.4rem 0 1.25rem' }}>
              Create your first opening to begin receiving candidate applications.
            </p>
            <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
              Create Job Listing
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Location & Type</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {jobs.slice(0, 6).map((job) => (
                  <tr key={job._id}>
                    <td style={{ fontWeight: 600 }}>{job.title}</td>
                    <td>{job.company?.name}</td>
                    <td>
                      <div>{job.location}</div>
                      <small style={{ color: 'var(--gray-500)' }}>{job.employmentType}</small>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: job.applicationsCount > 0 ? 'var(--primary)' : 'var(--gray-500)'
                        }}
                      >
                        {job.applicationsCount || 0} candidates
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link
                          to={`/recruiter/applications/${job._id}`}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.3rem 0.65rem' }}
                        >
                          <Users size={14} />
                          <span>Review</span>
                        </Link>
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.3rem 0.65rem' }}
                        >
                          Edit
                        </Link>
                      </div>
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

export default RecruiterDashboard;
