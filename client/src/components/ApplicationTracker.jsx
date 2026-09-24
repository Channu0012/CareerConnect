// ApplicationTracker: Pro Real-Time Move-to-Job Pipeline Stepper & Decision Tracker
import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  Award,
  XCircle,
  FileText,
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const STAGES = [
  { key: 'Applied', label: 'Application Submitted', desc: 'Profile and resume delivered to hiring team', icon: FileText },
  { key: 'Under Review', label: 'Resume Screening', desc: 'Recruiter evaluating credentials & portfolio', icon: Clock },
  { key: 'Shortlisted', label: 'Candidate Shortlisted', desc: 'Shortlisted for technical assessments', icon: UserCheck },
  { key: 'Interview', label: 'Interview Scheduled', desc: 'Technical & behavioral rounds underway', icon: Calendar },
  { key: 'Decision', label: 'Final Decision', desc: 'Offer extended or stage feedback recorded', icon: Award }
];

const getStageIndex = (status) => {
  switch (status) {
    case 'Applied': return 0;
    case 'Under Review': return 1;
    case 'Shortlisted': return 2;
    case 'Interview': return 3;
    case 'Selected':
    case 'Rejected': return 4;
    default: return 0;
  }
};

const ApplicationTracker = ({ application, showJobDetails = true }) => {
  if (!application) return null;

  const currentStatus = application.status || 'Applied';
  const isRejected = currentStatus === 'Rejected';
  const isSelected = currentStatus === 'Selected';
  const currentIndex = getStageIndex(currentStatus);

  const appliedDate = application.appliedAt
    ? new Date(application.appliedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  return (
    <div
      style={{
        background: 'var(--white)',
        border: '1px solid var(--gray-200)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '1.5rem',
        transition: 'var(--transition)'
      }}
    >
      {/* Header Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1rem',
          borderBottom: '1px solid var(--gray-100)',
          paddingBottom: '1.25rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: '0.2rem 0.6rem',
                background: '#eff6ff',
                color: 'var(--primary)',
                borderRadius: 'var(--radius-full)'
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'inline-block',
                  animation: 'pulse 1.5s infinite'
                }}
              />
              Live Status Tracker
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              Applied on {appliedDate}
            </span>
          </div>

          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.2rem 0' }}>
            {application.job?.title || 'Tech Opportunity'}
          </h3>
          <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', margin: 0 }}>
            {application.job?.company?.name || 'Company Profile'} •{' '}
            <span style={{ color: 'var(--gray-500)' }}>{application.job?.location || 'Remote'}</span>
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <StatusBadge status={currentStatus} />
          {showJobDetails && application.job?._id && (
            <Link
              to={`/jobs/${application.job._id}`}
              className="btn btn-outline btn-sm"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            >
              <span>View Job Spec</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Visual Move-To-Job Stepper */}
      <div style={{ margin: '1.5rem 0 2rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
            gap: '1rem',
            position: 'relative'
          }}
        >
          {STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex || (idx === 4 && (isSelected || isRejected));
            const isCurrent = idx === currentIndex && !(idx === 4 && (isSelected || isRejected));
            const isFinalSuccess = idx === 4 && isSelected;
            const isFinalDanger = idx === 4 && isRejected;

            let stepColor = 'var(--gray-300)';
            let stepBg = 'var(--gray-100)';
            let textColor = 'var(--gray-500)';

            if (isFinalSuccess) {
              stepColor = 'var(--success)';
              stepBg = 'var(--success-bg)';
              textColor = 'var(--success)';
            } else if (isFinalDanger) {
              stepColor = 'var(--danger)';
              stepBg = 'var(--danger-bg)';
              textColor = 'var(--danger)';
            } else if (isCurrent) {
              stepColor = 'var(--primary)';
              stepBg = '#dbeafe';
              textColor = 'var(--primary)';
            } else if (isCompleted) {
              stepColor = 'var(--success)';
              stepBg = 'var(--success-bg)';
              textColor = 'var(--gray-800)';
            }

            return (
              <div
                key={stage.key}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '0.75rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  background: isCurrent ? 'rgba(37, 99, 235, 0.04)' : 'transparent',
                  border: isCurrent ? '1px dashed var(--primary)' : '1px solid transparent'
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: stepBg,
                    color: stepColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '0.6rem',
                    transition: 'all 0.3s ease',
                    boxShadow: isCurrent ? '0 0 0 4px rgba(37, 99, 235, 0.15)' : 'none'
                  }}
                >
                  {isFinalSuccess ? (
                    <Award size={20} />
                  ) : isFinalDanger ? (
                    <XCircle size={20} />
                  ) : isCompleted ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <stage.icon size={18} />
                  )}
                </div>

                <div
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: isCurrent || isCompleted ? 700 : 500,
                    color: textColor,
                    lineHeight: 1.25,
                    marginBottom: '0.2rem'
                  }}
                >
                  {idx === 4 ? (isSelected ? 'Offer Extended' : isRejected ? 'Not Selected' : 'Decision') : stage.label}
                </div>

                <div
                  style={{
                    fontSize: '0.72rem',
                    color: 'var(--gray-400)',
                    lineHeight: 1.2
                  }}
                >
                  {isCurrent ? 'In Progress' : isCompleted ? 'Completed' : 'Upcoming'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recruiter Notes & Hiring Insights Card */}
      <div
        style={{
          background: isSelected
            ? 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)'
            : isRejected
            ? '#fef2f2'
            : currentStatus === 'Interview'
            ? 'linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)'
            : 'var(--gray-50)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem 1.5rem',
          borderLeft: `4px solid ${
            isSelected
              ? 'var(--success)'
              : isRejected
              ? 'var(--danger)'
              : currentStatus === 'Interview'
              ? 'var(--accent)'
              : 'var(--primary)'
          }`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <MessageSquare size={16} color="var(--gray-700)" />
          <strong style={{ fontSize: '0.9rem', color: 'var(--gray-900)' }}>
            Hiring Manager Feedback & Notes:
          </strong>
        </div>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--gray-700)',
            margin: '0.35rem 0 0.75rem',
            lineHeight: 1.55,
            fontStyle: application.recruiterNotes ? 'normal' : 'italic'
          }}
        >
          {application.recruiterNotes ||
            'Your application is currently active. The talent acquisition team will record progress notes and next round details here.'}
        </p>

        {/* Actionable Stage Guidance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            fontSize: '0.8rem',
            paddingTop: '0.6rem',
            borderTop: '1px solid rgba(0, 0, 0, 0.06)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gray-600)' }}>
            <Sparkles size={14} color="var(--warning)" />
            {currentStatus === 'Applied' && 'Stage 1: Profile submitted. Recruiters typically review applications within 48 hours.'}
            {currentStatus === 'Under Review' && 'Stage 2: Technical team is reviewing your GitHub portfolio and background.'}
            {currentStatus === 'Shortlisted' && 'Stage 3: Congratulations! You have been shortlisted for upcoming interviews.'}
            {currentStatus === 'Interview' && 'Stage 4: Active Interview! Review the job description and prep system architecture.'}
            {currentStatus === 'Selected' && '🎉 Formal offer extended! Check your registered email for offer documentation.'}
            {currentStatus === 'Rejected' && 'Review constructive feedback notes above to strengthen future applications.'}
          </span>

          {application.resumeLink && (
            <a
              href={application.resumeLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'var(--primary)',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <span>View Submitted Portfolio / Resume</span>
              <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTracker;
