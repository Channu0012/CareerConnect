// ManageUsers: Administrator user governance, activation toggle, and account deletion
import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';
import { Search, Filter, Trash2, Power, AlertCircle, CheckCircle } from 'lucide-react';

const ManageUsers = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [deleteModalUser, setDeleteModalUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (roleFilter !== 'all') queryParams.append('role', roleFilter);

      const res = await API.get(`/admin/users?${queryParams.toString()}`);
      setUsers(res.data || []);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    if (user._id === currentAdmin._id) {
      setAlert({ type: 'danger', message: 'You cannot deactivate your own administrative account.' });
      return;
    }

    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    setActionLoading(true);
    setAlert({ type: '', message: '' });

    try {
      await API.patch(`/admin/users/${user._id}/status`, { status: newStatus });
      setAlert({ type: 'success', message: `User status changed to ${newStatus}` });
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to update user status'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModalUser) return;
    setActionLoading(true);

    try {
      await API.delete(`/admin/users/${deleteModalUser._id}`);
      setAlert({ type: 'success', message: 'User account and associated records deleted' });
      setUsers((prev) => prev.filter((u) => u._id !== deleteModalUser._id));
      setDeleteModalUser(null);
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Failed to delete user'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <Loader message="Loading platform users..." />;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>User Governance</h1>
        <p style={{ color: 'var(--gray-600)' }}>
          Manage user accounts, toggle platform permissions, or remove unauthorized profiles.
        </p>
      </div>

      {alert.message && (
        <div className={`alert alert-${alert.type}`}>
          {alert.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{alert.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <Search size={16} color="var(--gray-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '2.4rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Filter size={16} color="var(--gray-500)" />
            <select
              className="form-control"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Roles</option>
              <option value="candidate">Candidates</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Administrators</option>
            </select>
            <button type="submit" className="btn btn-primary btn-sm">
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Administrative Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const isSelf = user._id === currentAdmin._id;

                return (
                  <tr key={user._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {user.name} {isSelf && <span style={{ color: 'var(--primary)', fontSize: '0.8rem' }}>(You)</span>}
                      </div>
                      <small style={{ color: 'var(--gray-500)' }}>{user.email}</small>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background:
                            user.role === 'admin'
                              ? 'var(--success-bg)'
                              : user.role === 'recruiter'
                              ? '#e0e7ff'
                              : 'var(--primary-light)',
                          color:
                            user.role === 'admin'
                              ? 'var(--success)'
                              : user.role === 'recruiter'
                              ? '#4338ca'
                              : 'var(--primary)'
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${user.status === 'active' ? 'badge-active' : 'badge-closed'}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className={`btn btn-sm ${user.status === 'active' ? 'btn-outline' : 'btn-primary'}`}
                          style={{ padding: '0.3rem 0.65rem' }}
                          disabled={isSelf || actionLoading}
                          onClick={() => handleToggleStatus(user)}
                          title={user.status === 'active' ? 'Deactivate Account' : 'Activate Account'}
                        >
                          <Power size={13} />
                          <span>{user.status === 'active' ? 'Deactivate' : 'Activate'}</span>
                        </button>

                        {!isSelf && (
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ padding: '0.3rem 0.65rem', color: 'var(--danger)' }}
                            onClick={() => setDeleteModalUser(user)}
                            title="Delete User"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Modal */}
      <Modal
        isOpen={!!deleteModalUser}
        onClose={() => setDeleteModalUser(null)}
        title="Confirm User Account Deletion"
      >
        <div style={{ padding: '0.5rem 0' }}>
          <p style={{ color: 'var(--gray-700)', marginBottom: '1rem' }}>
            Are you sure you want to permanently delete user{' '}
            <strong>"{deleteModalUser?.name}"</strong> ({deleteModalUser?.email})?
          </p>
          <div className="alert alert-danger" style={{ fontSize: '0.85rem' }}>
            <AlertCircle size={16} />
            <span>This action will cascade and remove their profile and all associated data.</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setDeleteModalUser(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              disabled={actionLoading}
              onClick={handleDeleteUser}
            >
              {actionLoading ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ManageUsers;
