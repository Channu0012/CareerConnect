// ManageJobs: Recruiter job listing administration and deletion control
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { PlusCircle, Edit, Trash2, Users, Search, AlertCircle } from 'lucide-react';

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalJob, setDeleteModalJob] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const fetchJobs = async () => {
    try {
      const res = await API.get('/jobs/recruiter/my-jobs');
      setJobs(res.data || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteModalJob) return;
    setDeleting(true);
    setAlert({ type: '', message: '' });

    try {
      await API.delete(`/jobs/${deleteModalJob._id}`);
      setAlert({ type: 'success', message: 'Job posting and associated applications removed successfully' });
      setJobs((prev) => prev.filter((j) => j._id !== deleteModalJob._id));
      setDeleteModalJob(null);
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to delete job'
      });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader message="Fetching your managed jobs..." />;

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      j.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Manage Job Listings</h1>
          <p style={{ color: 'var(--gray-600)' }}>
            Maintain vacancies, update descriptions, and track candidate applicant pools.
          </p>
        </div>

        <Link to="/recruiter/jobs/new" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Post New Vacancy</span>
        </Link>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
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
            placeholder="Search by title or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: '2.4rem' }}
          />
        </div>
      </div>

      <div className="card">
        {filteredJobs.length === 0 ? (
          <div className="empty-state" style={{ margin: '1.5rem auto' }}>
            <h3>No jobs found</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', margin: '0.4rem 0 1.25rem' }}>
              {jobs.length === 0
                ? "You haven't posted any jobs yet."
                : 'No vacancies match your search query.'}
            </p>
            {jobs.length === 0 && (
              <Link to="/recruiter/jobs/new" className="btn btn-primary btn-sm">
                Create First Job
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
                  <th>Type & Level</th>
                  <th>Status</th>
                  <th>Applicants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{job.title}</div>
                      <small style={{ color: 'var(--gray-500)' }}>{job.location}</small>
                    </td>
                    <td>{job.company?.name}</td>
                    <td>
                      <div>{job.employmentType}</div>
                      <small style={{ color: 'var(--gray-500)' }}>{job.experienceLevel}</small>
                    </td>
                    <td>
                      <StatusBadge status={job.status} />
                    </td>
                    <td>
                      <Link
                        to={`/recruiter/applications/${job._id}`}
                        style={{
                          fontWeight: 700,
                          color: 'var(--primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Users size={15} />
                        <span>{job.applicationsCount || 0} Applicants</span>
                      </Link>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link
                          to={`/recruiter/applications/${job._id}`}
                          className="btn btn-primary btn-sm"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Review Candidates"
                        >
                          Review
                        </Link>
                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.65rem' }}
                          title="Edit Job"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          style={{ padding: '0.35rem 0.65rem', color: 'var(--danger)' }}
                          onClick={() => setDeleteModalJob(job)}
                          title="Delete Job"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModalJob}
        onClose={() => setDeleteModalJob(null)}
        title="Confirm Job Deletion"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--gray-700)', marginBottom: '1rem' }}>
            Are you sure you want to permanently delete the job listing for{' '}
            <strong>"{deleteModalJob?.title}"</strong>?
          </p>
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>This action will permanently delete all associated applicant submissions from candidates.</span>
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
              onClick={handleDeleteConfirm}
            >
              {deleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageJobs;
