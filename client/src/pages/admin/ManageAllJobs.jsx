// ManageAllJobs: Administrator global oversight and moderation of all platform job postings
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Search, Trash2, ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

const ManageAllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalJob, setDeleteModalJob] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchJobs = async () => {
    try {
      const res = await API.get('/admin/jobs');
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to load global jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteJob = async () => {
    if (!deleteModalJob) return;
    setDeleting(true);

    try {
      await API.delete(`/jobs/${deleteModalJob._id}`);
      setAlert({ type: 'success', message: 'Job listing removed by administrator' });
      setJobs((prev) => prev.filter((j) => j._id !== deleteModalJob._id));
      setDeleteModalJob(null);
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to remove job'
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader message="Fetching all platform jobs..." />;

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.company?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.recruiter?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Platform Job Listings</h1>
        <p style={{ color: 'var(--gray-600)' }}>
          Monitor all posted vacancies across organizations and recruiters.
        </p>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Search Header */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: '350px' }}>
          <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, company, or recruiter..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Posted By Recruiter</th>
                <th>Type & Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job._id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{job.title}</div>
                    <small style={{ color: 'var(--gray-400)' }}>
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </small>
                  </td>
                  <td>{job.company?.name || 'Unknown Company'}</td>
                  <td>
                    <div>{job.recruiter?.name || 'Recruiter'}</div>
                    <small style={{ color: 'var(--gray-500)' }}>{job.recruiter?.email}</small>
                  </td>
                  <td>
                    <div>{job.employmentType}</div>
                    <small style={{ color: 'var(--gray-500)' }}>{job.location}</small>
                  </td>
                  <td>
                    <StatusBadge status={job.status} />
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <Link
                        to={`/jobs/${job._id}`}
                        target="_blank"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.65rem' }}
                        title="View Public Details"
                      >
                        <ExternalLink size={13} />
                      </Link>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        style={{ padding: '0.35rem 0.65rem', color: 'var(--danger)' }}
                        onClick={() => setDeleteModalJob(job)}
                        title="Admin Delete Job"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModalJob}
        onClose={() => setDeleteModalJob(null)}
        title="Admin Confirm: Remove Job"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--gray-700)', marginBottom: '1rem' }}>
            Are you sure you want to remove <strong>"{deleteModalJob?.title}"</strong> by{' '}
            <strong>{deleteModalJob?.recruiter?.name}</strong>?
          </p>
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>This job and its application history will be permanently deleted.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setDeleteModalJob(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              disabled={deleting}
              onClick={handleDeleteJob}
            >
              {deleting ? 'Removing...' : 'Delete Job'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageAllJobs;
