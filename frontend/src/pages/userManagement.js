import React, { useMemo, useState } from 'react';

export default function AdminUsers() {
  const roles = useMemo(() => ['Admin', 'Manager', 'Clerk', 'Viewer'], []);
  const [users, setUsers] = useState([
    { id: 1, name: 'Nimal Perera', email: 'nimal@islandlink.lk', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Kamal Silva', email: 'kamal@islandlink.lk', role: 'Manager', status: 'Active' },
    { id: 3, name: 'Anil Wickramasingha', email: 'anil@islandlink.lk', role: 'Clerk', status: 'Inactive' },
  ]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [msg, setMsg] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !email || !role) return setMsg('Please fill all fields.');
    const newUser = { id: Date.now(), name, email, role, status: 'Active' };
    setUsers((prev) => [newUser, ...prev]);
    setName(''); setEmail(''); setRole(''); setMsg('User created (demo).');
  };

  const handleResetPwd = (user) => {
    setMsg(`Password reset link sent to ${user.email} (demo).`);
  };

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u))
    );
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">User Management</h3>

      {msg && (
        <div className="alert alert-info alert-dismissible fade show" role="alert">
          {msg}
          <button type="button" className="btn-close" onClick={() => setMsg('')}></button>
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-4">
          <div className="card border-dark h-100">
            <div className="card-header">Create User</div>
            <div className="card-body">
              <form onSubmit={handleAdd}>
                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="">Select role</option>
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary w-100" type="submit">
                  <i className="bi bi-person-plus me-2"></i>Create User
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <div className="card border-dark h-100">
            <div className="card-header">Users</div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className="badge bg-secondary">{u.role}</span></td>
                        <td>
                          <span className={`badge ${u.status === 'Active' ? 'bg-success' : 'bg-warning text-dark'}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="text-end d-flex flex-wrap gap-2 justify-content-end">
                          <button className="btn btn-outline-primary btn-sm" onClick={() => handleResetPwd(u)}>
                            <i className="bi bi-arrow-counterclockwise me-1"></i>Reset Password
                          </button>
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => toggleStatus(u.id)}
                          >
                            {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">No users yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}