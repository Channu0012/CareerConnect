// JobCard: Reusable card display for job listings
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, Building, ArrowRight } from 'lucide-react';

const JobCard = ({ job }) => {
  // Format salary in INR lakhs or standard notation
  const formatSalary = (min, max, currency) => {
    if (!min && !max) return 'Competitive';
    const minLakhs = (min / 100000).toFixed(1);
    const maxLakhs = (max / 100000).toFixed(1);
    return `₹${minLakhs} - ${maxLakhs} LPA`;
  };

  return (
    <div className="card card-clickable" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '1.2rem',
              overflow: 'hidden',
              flexShrink: 0
            }}
          >
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={job.company.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              job.company?.name ? job.company.name.charAt(0) : 'J'
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>
              <Link to={`/jobs/${job._id}`} style={{ color: 'var(--gray-900)' }}>
                {job.title}
              </Link>
            </h3>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--gray-600)', fontSize: '0.88rem' }}>
              <Building size={14} />
              {job.company?.name || 'Company Confidential'}
            </p>
          </div>
        </div>

        <span className="badge badge-active">{job.employmentType}</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--gray-600)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <MapPin size={14} />
          {job.location}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Briefcase size={14} />
          {job.experienceLevel}
        </span>
        <span style={{ fontWeight: 600, color: 'var(--primary-dark)' }}>
          {formatSalary(job.salaryRange?.min, job.salaryRange?.max, job.salaryRange?.currency)}
        </span>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.25rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      {job.skills && job.skills.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
          {job.skills.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.55rem',
                background: 'var(--gray-100)',
                color: 'var(--gray-700)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && (
            <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)', alignSelf: 'center' }}>
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '0.85rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
          <span>Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
