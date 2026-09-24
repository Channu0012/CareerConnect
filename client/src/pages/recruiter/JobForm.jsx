// JobForm: Dynamic create and edit form for job requisitions
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../../services/api';
import Loader from '../../components/Loader';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const JobForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    employmentType: 'Full-time',
    experienceLevel: 'Entry Level',
    minSalary: '',
    maxSalary: '',
    skills: '',
    status: 'Active',
    description: ''
  });

  useEffect(() => {
    const initializeForm = async () => {
      try {
        // 1. Fetch available companies
        const compRes = await API.get('/companies');
        setCompanies(compRes.data || []);

        // 2. If edit mode, load existing job values
        if (isEditMode) {
          const jobRes = await API.get(`/jobs/${id}`);
          const job = jobRes.data;
          setFormData({
            title: job.title || '',
            company: job.company?._id || '',
            location: job.location || '',
            employmentType: job.employmentType || 'Full-time',
            experienceLevel: job.experienceLevel || 'Entry Level',
            minSalary: job.salaryRange?.min || '',
            maxSalary: job.salaryRange?.max || '',
            skills: job.skills ? job.skills.join(', ') : '',
            status: job.status || 'Active',
            description: job.description || ''
          });
        } else if (compRes.data && compRes.data.length > 0) {
          // Default to first company in list for convenience
          setFormData((prev) => ({ ...prev, company: compRes.data[0]._id }));
        }
      } catch (err) {
        console.error('Job form initialization error:', err);
        setError('Failed to load data for form initialization');
      } finally {
        setLoading(false);
      }
    };

    initializeForm();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.company) {
      return setError('Please select a hiring company');
    }

    setSaving(true);

    try {
      const payload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        salaryRange: {
          min: Number(formData.minSalary) || 0,
          max: Number(formData.maxSalary) || 0,
          currency: 'INR'
        },
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        status: formData.status,
        description: formData.description
      };

      if (isEditMode) {
        await API.put(`/jobs/${id}`, payload);
      } else {
        await API.post('/jobs', payload);
      }

      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save job requisition');
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading requisition builder..." />;

  return (
    <div style={{ maxWidth: '850px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/recruiter/jobs"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', color: 'var(--gray-600)', marginBottom: '0.75rem' }}
        >
          <ArrowLeft size={16} /> Back to My Jobs
        </Link>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>
          {isEditMode ? 'Edit Job Requisition' : 'Post New Job Requisition'}
        </h1>
        <p style={{ color: 'var(--gray-600)' }}>
          Provide clear requirements and salary parameters to attract the right candidates.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                placeholder="e.g. Senior MERN Stack Developer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hiring Company *</label>
              <select
                name="company"
                className="form-control"
                value={formData.company}
                onChange={handleChange}
                required
              >
                <option value="">-- Choose Company --</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Job Location *</label>
              <input
                type="text"
                name="location"
                className="form-control"
                placeholder="e.g. Bangalore, India / Remote"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Employment Type</label>
              <select
                name="employmentType"
                className="form-control"
                value={formData.employmentType}
                onChange={handleChange}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Experience Requirement</label>
              <select
                name="experienceLevel"
                className="form-control"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Principal">Lead / Principal</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Listing Status</label>
              <select
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active (Accepting applications)</option>
                <option value="Closed">Closed (Hidden from search)</option>
                <option value="Draft">Draft (In progress)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Minimum Annual Salary (INR)</label>
              <input
                type="number"
                name="minSalary"
                className="form-control"
                placeholder="e.g. 800000"
                value={formData.minSalary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Annual Salary (INR)</label>
              <input
                type="number"
                name="maxSalary"
                className="form-control"
                placeholder="e.g. 1400000"
                value={formData.maxSalary}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (Comma separated) *</label>
            <input
              type="text"
              name="skills"
              className="form-control"
              placeholder="e.g. React, Node.js, Express, MongoDB, REST API, Git"
              value={formData.skills}
              onChange={handleChange}
              required
            />
            <small style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
              Separate required competencies with commas.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Job Description & Requirements *</label>
            <textarea
              name="description"
              className="form-control"
              rows={8}
              placeholder="Describe daily responsibilities, ideal candidate attributes, required technologies, and qualification criteria..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to="/recruiter/jobs" className="btn btn-secondary">
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : isEditMode ? 'Update Requisition' : 'Publish Requisition'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
