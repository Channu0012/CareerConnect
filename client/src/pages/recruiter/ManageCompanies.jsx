// ManageCompanies: Directory and registration of hiring companies
import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Building, PlusCircle, Globe, MapPin, CheckCircle, AlertCircle } from 'lucide-react';

const ManageCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    website: '',
    logo: '',
    description: ''
  });

  const fetchCompanies = async () => {
    try {
      const res = await API.get('/companies');
      setCompanies(res.data || []);
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await API.post('/companies', formData);
      setSuccess('Company registered successfully!');
      fetchCompanies();
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({
          name: '',
          industry: '',
          location: '',
          website: '',
          logo: '',
          description: ''
        });
        setSuccess('');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register company');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading registered companies..." />;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Hiring Companies</h1>
          <p style={{ color: 'var(--gray-600)' }}>
            Organizations registered on CareerConnect for recruitment and job postings.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Register New Company</span>
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}
      >
        {companies.map((company) => (
          <div key={company._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  overflow: 'hidden',
                  flexShrink: 0
                }}
              >
                {company.logo ? (
                  <img src={company.logo} alt={company.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  company.name.charAt(0)
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>{company.name}</h3>
                <span
                  style={{
                    fontSize: '0.78rem',
                    padding: '0.15rem 0.5rem',
                    background: 'var(--gray-100)',
                    color: 'var(--gray-700)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  {company.industry}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--gray-600)', marginBottom: '1.25rem', flex: 1, lineHeight: '1.5' }}>
              {company.description}
            </p>

            <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--gray-500)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={14} /> {company.location}
              </span>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600 }}
                >
                  <Globe size={14} /> Website
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Register Company Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register New Hiring Company"
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="alert alert-success">
              <CheckCircle size={16} />
              <span>{success}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Company Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="e.g. Acme Innovations"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Industry *</label>
            <input
              type="text"
              name="industry"
              className="form-control"
              placeholder="e.g. FinTech, Cloud Computing, Healthcare"
              value={formData.industry}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Headquarters / Location *</label>
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="e.g. Bangalore, Karnataka"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Website URL</label>
            <input
              type="url"
              name="website"
              className="form-control"
              placeholder="https://example.com"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Logo Image URL</label>
            <input
              type="url"
              name="logo"
              className="form-control"
              placeholder="https://images.unsplash.com/..."
              value={formData.logo}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Company Overview / Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows={3}
              placeholder="Brief summary of company culture, products, and vision..."
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-footer" style={{ padding: 0, marginTop: '1.25rem', border: 'none' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Registering...' : 'Register Company'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCompanies;
