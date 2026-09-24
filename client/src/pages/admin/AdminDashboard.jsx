// AdminDashboard: Platform-wide operational overview, aggregate metrics, and system statistics
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../services/api';
import Loader from '../../components/Loader';
import {
  Users,
  Briefcase,
  Building,
  FileText,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <Loader message="Compiling platform metrics..." />;

  const { users, jobs, applications, companies } = stats || {
    users: { total: 0, candidates: 0, recruiters: 0, admins: 0 },
    jobs: { total: 0, active: 0, closed: 0 },
    applications: { total: 0, breakdown: [] },
    companies: { total: 0 }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>
          Platform Administration Console 🛡️
        </h1>
        <p style={{ color: 'var(--gray-600)' }}>
          High-level oversight of user registrations, job health, and application lifecycles.
        </p>
      </div>

      {/* Primary KPI Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-value">{users.total}</div>
            <div className="stat-label">Total Registered Users</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
            <Briefcase size={24} />
          </div>
          <div>
            <div className="stat-value">{jobs.total}</div>
            <div className="stat-label">Total Jobs ({jobs.active} Active)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff', color: '#4338ca' }}>
            <FileText size={24} />
          </div>
          <div>
            <div className="stat-value">{applications.total}</div>
            <div className="stat-label">Total Applications Submitted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <Building size={24} />
          </div>
          <div>
            <div className="stat-value">{companies.total}</div>
            <div className="stat-label">Hiring Companies</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* User Distribution Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>User Role Distribution</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                <Users size={16} color="var(--primary)" /> Candidates
              </span>
              <strong>{users.candidates}</strong>
            </div>
            <div style={{ height: '6px', background: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--primary)',
                  width: `${users.total > 0 ? (users.candidates / users.total) * 100 : 0}%`
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                <Briefcase size={16} color="var(--accent)" /> Recruiters
              </span>
              <strong>{users.recruiters}</strong>
            </div>
            <div style={{ height: '6px', background: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--accent)',
                  width: `${users.total > 0 ? (users.recruiters / users.total) * 100 : 0}%`
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem' }}>
                <ShieldCheck size={16} color="var(--success)" /> Administrators
              </span>
              <strong>{users.admins}</strong>
            </div>
            <div style={{ height: '6px', background: 'var(--gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  background: 'var(--success)',
                  width: `${users.total > 0 ? (users.admins / users.total) * 100 : 0}%`
                }}
              />
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1rem', marginTop: '1.5rem' }}>
            <Link to="/admin/users" className="btn btn-outline btn-block btn-sm">
              <span>Manage User Accounts</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Application Stage Breakdown */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem' }}>Application Hiring Stages</h2>
          {applications.breakdown && applications.breakdown.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {applications.breakdown.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.85rem',
                    background: 'var(--gray-50)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{item._id}</span>
                  <span className="badge badge-active">{item.count} applications</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: 'var(--gray-500)', fontSize: '0.9rem' }}>No applications recorded yet.</p>
          )}

          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '1rem', marginTop: '1.5rem' }}>
            <Link to="/admin/jobs" className="btn btn-outline btn-block btn-sm">
              <span>View Global Vacancies</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
