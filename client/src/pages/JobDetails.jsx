// JobDetails Page: Comprehensive view of job specifications, company info, and application workflow
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/Modal';
import Loader from '../components/Loader';
import {
  MapPin,
  Briefcase,
  Building,
  Calendar,
  Globe,
  CheckCircle,
  AlertCircle,
  Send,
  Edit,
  Users
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeLink, setResumeLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState('');
  const [applyError, setApplyError] = useState('');
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);

        // If candidate is logged in, check if they have already applied
        if (isAuthenticated && user?.role === 'candidate') {
          try {
            const appsRes = await API.get('/applications/my-applications');
            const hasApplied = appsRes.data.some((app) => app.job?._id === id);
            setAlreadyApplied(hasApplied);
          } catch (appErr) {
            console.error('Could not verify past application status:', appErr);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load job details');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, isAuthenticated, user]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setApplyError('');
    setApplySuccess('');

    try {
      await API.post(`/applications/${id}`, {
        coverLetter,
        resumeLink
      });

      setApplySuccess('Application submitted successfully! You can track its status in your candidate dashboard.');
      setAlreadyApplied(true);
      setTimeout(() => {
        setIsApplyModalOpen(false);
      }, 2500);
    } catch (err) {
      setApplyError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Competitive compensation';
    const minLakhs = (min / 100000).toFixed(1);
    const maxLakhs = (max / 100000).toFixed(1);
    return `₹${minLakhs} - ${maxLakhs} Lakhs / Year`;
  };

  if (loading) return <Loader message="Loading job opening..." />;

  if (error || !job) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <AlertCircle size={40} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h2>Job Posting Not Found</h2>
        <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 1.5rem' }}>{error || 'This vacancy may have expired or been removed.'}</p>
        <Link to="/jobs" className="btn btn-primary">
          Back to All Jobs
        </Link>
      </div>
    );
  }

  const isOwnerRecruiter =
    user?.role === 'recruiter' && job.recruiter?._id === user._id;

  return (
    <div style={{ padding: '2.5rem 0 4rem', minHeight: '80vh' }}>
      <div className="container">
        {/* Breadcrumb Navigation */}
        <div style={{ marginBottom: '1.5rem', fontSize: '0.88rem', color: 'var(--gray-500)' }}>
          <Link to="/">Home</Link> &gt; <Link to="/jobs">Jobs</Link> &gt; <span style={{ color: 'var(--gray-800)' }}>{job.title}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
          {/* Main Job Details Column */}
          <div>
            <div className="card" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary)',
                      fontWeight: 800,
                      fontSize: '1.5rem',
                      overflow: 'hidden',
                      flexShrink: 0
                    }}
                  >
                    {job.company?.logo ? (
                      <img src={job.company.logo} alt={job.company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      job.company?.name ? job.company.name.charAt(0) : 'J'
                    )}
                  </div>

                  <div>
                    <h1 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>{job.title}</h1>
                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gray-600)', fontSize: '0.95rem' }}>
                      <Building size={16} />
                      <strong>{job.company?.name}</strong>
                    </p>
                  </div>
                </div>

                <span className="badge badge-active" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
                  {job.status}
                </span>
              </div>

              {/* Quick Meta Badges */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.25rem',
                  padding: '1rem',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '1.75rem',
                  fontSize: '0.9rem',
                  color: 'var(--gray-700)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={16} color="var(--primary)" />
                  <span>{job.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Briefcase size={16} color="var(--primary)" />
                  <span>{job.employmentType} &bull; {job.experienceLevel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons for Roles */}
              <div style={{ marginBottom: '2rem' }}>
                {isOwnerRecruiter ? (
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link to={`/recruiter/jobs/${job._id}/edit`} className="btn btn-outline btn-sm">
                      <Edit size={16} />
                      <span>Edit Job Listing</span>
                    </Link>
                    <Link to={`/recruiter/applications/${job._id}`} className="btn btn-primary btn-sm">
                      <Users size={16} />
                      <span>Review Applicants ({job.applicationsCount || 0})</span>
                    </Link>
                  </div>
                ) : user?.role === 'candidate' ? (
                  alreadyApplied ? (
                    <div className="alert alert-success" style={{ margin: 0 }}>
                      <CheckCircle size={18} />
                      <span>You have already submitted an application for this role. Track its status in your dashboard.</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsApplyModalOpen(true)}
                      className="btn btn-primary btn-lg"
                    >
                      <Send size={18} />
                      <span>Apply For This Position</span>
                    </button>
                  )
                ) : !isAuthenticated ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--primary-light)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--primary-dark)', fontWeight: 500 }}>
                      Ready to apply? Log in to your candidate account.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-sm">
                      Sign In to Apply
                    </Link>
                  </div>
                ) : null}
              </div>

              {/* Job Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                  Role Overview & Responsibilities
                </h3>
                <div style={{ whiteSpace: 'pre-line', color: 'var(--gray-700)', lineHeight: '1.7', fontSize: '0.96rem' }}>
                  {job.description}
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                  Required Skills & Technologies
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {job.skills && job.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '0.4rem 0.85rem',
                        background: 'var(--gray-100)',
                        color: 'var(--gray-800)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.88rem',
                        fontWeight: 600
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Column: Company & Compensation Overview */}
          <div>
            {/* Compensation Card */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Compensation</h3>
              <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.25rem' }}>
                {formatSalary(job.salaryRange?.min, job.salaryRange?.max, job.salaryRange?.currency)}
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>
                Based on experience, interview evaluation, and market standard.
              </p>
            </div>

            {/* Company Card */}
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '0.5rem' }}>
                About the Company
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--gray-900)' }}>{job.company?.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)', marginTop: '0.2rem' }}>
                  {job.company?.industry}
                </p>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
                {job.company?.description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--gray-700)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} color="var(--gray-400)" />
                  <span>{job.company?.location}</span>
                </div>
                {job.company?.website && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={16} color="var(--gray-400)" />
                    <a href={job.company.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Candidate Apply Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply for ${job.title}`}
      >
        <form onSubmit={handleApplySubmit}>
          {applyError && <div className="alert alert-danger">{applyError}</div>}
          {applySuccess && <div className="alert alert-success">{applySuccess}</div>}

          <div className="form-group">
            <label className="form-label">Portfolio / Resume Link</label>
            <input
              type="url"
              className="form-control"
              placeholder="https://github.com/your-username or drive link"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
            />
            <small style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
              Provide a link to your resume PDF, GitHub, or portfolio website.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Letter / Note to Recruiter</label>
            <textarea
              className="form-control"
              rows={4}
              placeholder="Highlight why your skills and background make you a strong candidate for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              required
            />
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '1.5rem', border: 'none' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsApplyModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Confirm & Apply'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetails;
