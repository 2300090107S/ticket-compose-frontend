import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/allUsers');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/delete/${id}`);
        fetchUsers();
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  const handleApprove = async (user) => {
    if (window.confirm('Are you sure you want to approve this user?')) {
      try {
        await api.put(`/users/${user.id}`, { ...user, approved: true });
        fetchUsers();
      } catch (err) {
        setError('Failed to approve user.');
      }
    }
  };

  return (
    <div>
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: '#ff6a00'
      }}>
        👥 Manage Users
      </h2>

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '0.8rem',
          borderRadius: '8px',
          marginBottom: '1rem',
          border: '1px solid #fcc',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 0.8rem'
        }}>
          <thead>
            <tr style={{ background: '#f9f9f9' }}>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#555',
                borderTopLeftRadius: '8px',
                borderBottomLeftRadius: '8px'
              }}>
                Name
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#555'
              }}>
                Email
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#555'
              }}>
                Role
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#555'
              }}>
                Status
              </th>
              <th style={{
                padding: '1rem',
                textAlign: 'left',
                fontWeight: '600',
                color: '#555',
                borderTopRightRadius: '8px',
                borderBottomRightRadius: '8px'
              }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                style={{
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <td style={{
                  padding: '1rem',
                  borderTopLeftRadius: '8px',
                  borderBottomLeftRadius: '8px',
                  fontWeight: '500'
                }}>
                  {user.name}
                </td>
                <td style={{ padding: '1rem', color: '#666' }}>
                  {user.email}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    background: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'MANAGER' ? '#dbeafe' : '#d1fae5',
                    color: user.role === 'ADMIN' ? '#b91c1c' : user.role === 'MANAGER' ? '#1e40af' : '#065f46'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    padding: '0.3rem 0.8rem',
                    borderRadius: '12px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    background: user.approved ? '#d1fae5' : '#fef3c7',
                    color: user.approved ? '#065f46' : '#92400e'
                  }}>
                    {user.approved ? '✓ Approved' : '⏳ Pending'}
                  </span>
                </td>
                <td style={{
                  padding: '1rem',
                  borderTopRightRadius: '8px',
                  borderBottomRightRadius: '8px'
                }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!user.approved && user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleApprove(user)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: '#51a78a',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s',
                          fontFamily: "'Poppins', sans-serif"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#316d8e';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#51a78a';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        ✓ Approve
                      </button>
                    )}
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: '#ff6a00',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          fontWeight: '600',
                          transition: 'all 0.3s',
                          fontFamily: "'Poppins', sans-serif"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#ee5400';
                          e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#ff6a00';
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !error && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#666'
        }}>
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</p>
          <p style={{ fontSize: '1.1rem' }}>No users found.</p>
        </div>
      )}
    </div>
  );
};

export default UserList;