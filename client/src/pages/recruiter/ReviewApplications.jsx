// ReviewApplications: Recruiter workflow to evaluate candidates, assign hiring status, and record recruiter notes
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Globe,
  Save,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

const ReviewApplications = () => {
  const { jobId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Track editable state per application row
  const [applicationStates, setApplicationStates] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(`/applications/job/${jobId}`);
        setData(res.data);

        // Initialize state mapping
        const states = {};
        (res.data.applications || []).forEach((app) => {
          states[app._id] = {
            status: app.status,
            recruiterNotes: app.recruiterNotes || ''
          };
        });
        setApplicationStates(states);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [jobId]);

  const handleStateChange = (appId, field, value) => {
    setApplicationStates((prev) => ({
      ...prev,
      [appId]: {
        ...prev[appId],
        [field]: value
      }
    }));
  };

  const handleSaveStatus = async (appId) => {
    setSavingId(appId);
    setFeedback((prev) => ({ ...prev, [appId]: null }));

    try {
      const { status, recruiterNotes } = applicationStates[appId];
      await API.patch(`/applications/${appId}/status`, {
        status,
        recruiterNotes
      });

      setFeedback((prev) => ({
        ...prev,
        [appId]: { type: 'success', message: 'Candidate status updated!' }
      }));
    } catch (err) {
      setFeedback((prev) => ({
        ...prev,
        [appId]: { type: 'danger', message: err.response?.data?.message || 'Failed to update' }
      }));
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Loader message="Loading candidates and applicant files..." />;

  if (error || !data) {
    return (
      <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>
        <AlertCircle size={36} color="var(--danger)" style={{ marginBottom: '1rem' }} />
        <h2>Unable to Access Applicants</h2>
        <p style={{ color: 'var(--gray-600)', margin: '0.5rem 0 1.5rem' }}>{error}</p>
        <Link to="/recruiter/jobs" className="btn btn-primary">
          Back to My Jobs
        </Link>
      </div>
    );
  }

  const { jobTitle, totalApplicants, applications } = data;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          to="/recruiter/jobs"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '0.75rem' }}
        >
          <ArrowLeft size={16} /> Back to My Jobs
        </Link>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>
          Candidate Review: {jobTitle}
        </h1>
        <p style={{ color: 'var(--gray-600)' }}>
          Total {totalApplicants} candidate{totalApplicants !== 1 ? 's' : ''} applied for this requisition.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card">
          <div className="empty-state" style={{ margin: '1rem auto' }}>
            <User size={36} color="var(--gray-400)" style={{ marginBottom: '0.75rem' }} />
            <h3>No applicants yet</h3>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
              When job seekers apply to this listing, their applications, resumes, and contact info will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {applications.map((app) => {
            const currentAppState = applicationStates[app._id] || {
              status: app.status,
              recruiterNotes: app.recruiterNotes || ''
            };
            const appFeedback = feedback[app._id];
            const profile = app.candidateProfile;

            return (
              <div key={app._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        fontWeight: 700
                      }}
                    >
                      {app.candidate?.name ? app.candidate.name.charAt(0) : 'C'}
                    </div>

                    <div>
                      <h2 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{app.candidate?.name}</h2>
                      <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Mail size={14} /> {app.candidate?.email}
                      </p>
                      {profile?.phone && (
                        <p style={{ color: 'var(--gray-600)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                          <Phone size={14} /> {profile.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Current Status:</span>
                      <StatusBadge status={currentAppState.status} />
                    </div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Calendar size={13} /> Applied {new Date(app.appliedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Candidate Headline & Skills */}
                {profile?.headline && (
                  <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--gray-800)', marginBottom: '0.5rem' }}>
                    {profile.headline}
                  </p>
                )}

                {profile?.skills && profile.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {profile.skills.map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.78rem',
                          padding: '0.2rem 0.55rem',
                          background: 'var(--gray-100)',
                          borderRadius: 'var(--radius-sm)',
                          color: 'var(--gray-700)'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Resume / Portfolio Link */}
                {(app.resumeLink || profile?.resumeLink) && (
                  <div style={{ marginBottom: '1rem' }}>
                    <a
                      href={app.resumeLink || profile.resumeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <Globe size={14} />
                      <span>View Resume / Portfolio Link</span>
                    </a>
                  </div>
                )}

                {/* Cover Letter */}
                {app.coverLetter && (
                  <div
                    style={{
                      background: 'var(--gray-50)',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '1.25rem',
                      borderLeft: '3px solid var(--primary)'
                    }}
                  >
                    <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                      Candidate Cover Note
                    </p>
                    <p style={{ fontSize: '0.92rem', color: 'var(--gray-700)', lineHeight: '1.5' }}>
                      {app.coverLetter}
                    </p>
                  </div>
                )}

                {/* Status Update & Recruiter Feedback Box */}
                <div
                  style={{
                    borderTop: '1px solid var(--gray-200)',
                    paddingTop: '1rem',
                    marginTop: '0.5rem',
                    background: '#fcfcfd',
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.75rem', color: 'var(--gray-900)' }}>
                    Recruitment Decision & Feedback
                  </h4>

                  {appFeedback && (
                    <div className={`alert alert-${appFeedback.type}`} style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}>
                      {appFeedback.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
                      <span>{appFeedback.message}</span>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '1rem', alignItems: 'start' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Hiring Stage</label>
                      <select
                        className="form-control"
                        value={currentAppState.status}
                        onChange={(e) => handleStateChange(app._id, 'status', e.target.value)}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Interview">Interview</option>
                        <option value="Selected">Selected (Offer)</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.85rem' }}>Recruiter Notes / Candidate Feedback</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add notes e.g. Technical round scheduled for Friday, Strong React skills..."
                        value={currentAppState.recruiterNotes}
                        onChange={(e) => handleStateChange(app._id, 'recruiterNotes', e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.85rem' }}>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      disabled={savingId === app._id}
                      onClick={() => handleSaveStatus(app._id)}
                    >
                      <Save size={14} />
                      <span>{savingId === app._id ? 'Saving...' : 'Save Decision & Notes'}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ReviewApplications;
