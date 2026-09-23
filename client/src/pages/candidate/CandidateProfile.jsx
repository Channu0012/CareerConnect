// CandidateProfile: Profile and resume portfolio management
import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import { User, Phone, MapPin, Globe, CheckCircle, AlertCircle, Save } from 'lucide-react';

const CandidateProfile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    headline: '',
    location: '',
    skills: '',
    resumeLink: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/candidates/me');
        const data = res.data;
        setFormData({
          name: data.name || user?.name || '',
          phone: data.phone || '',
          headline: data.headline || '',
          location: data.location || '',
          skills: data.skills ? data.skills.join(', ') : '',
          resumeLink: data.resumeLink || '',
          bio: data.bio || ''
        });
      } catch (error) {
        console.error('Failed to load candidate profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback({ type: '', message: '' });

    try {
      const res = await API.put('/candidates/me', {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean)
      });

      // Update auth user if name changed
      if (formData.name && formData.name !== user?.name) {
        updateUser({ ...user, name: formData.name });
      }

      setFeedback({ type: 'success', message: 'Candidate profile updated successfully!' });
    } catch (err) {
      setFeedback({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader message="Loading your profile data..." />;

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>Profile & Resume Portfolio</h1>
        <p style={{ color: 'var(--gray-600)' }}>
          Keep your skills and contact details up-to-date for reviewing recruiters.
        </p>
      </div>

      {feedback.message && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.4rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Location / City</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  placeholder="e.g. Bangalore, India"
                  value={formData.location}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Resume / Portfolio Link</label>
              <div style={{ position: 'relative' }}>
                <Globe size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="url"
                  name="resumeLink"
                  className="form-control"
                  placeholder="https://github.com/username or Drive URL"
                  value={formData.resumeLink}
                  onChange={handleChange}
                  style={{ paddingLeft: '2.4rem' }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Headline</label>
            <input
              type="text"
              name="headline"
              className="form-control"
              placeholder="e.g. Full-Stack MERN Developer | React Enthusiast"
              value={formData.headline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Core Technical Skills (Comma separated)</label>
            <input
              type="text"
              name="skills"
              className="form-control"
              placeholder="React, Node.js, Express, MongoDB, JavaScript, Docker, REST APIs"
              value={formData.skills}
              onChange={handleChange}
            />
            <small style={{ color: 'var(--gray-500)', fontSize: '0.8rem' }}>
              Separate each skill with a comma (e.g. React, Node.js, MongoDB)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Summary / Bio</label>
            <textarea
              name="bio"
              className="form-control"
              rows={4}
              placeholder="Brief summary of your academic background, achievements, and career aspirations..."
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CandidateProfile;
