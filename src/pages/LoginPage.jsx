import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './AuthPages.css';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      
      // Trigger header update
      window.dispatchEvent(new Event('authChange'));

      const token = localStorage.getItem('token');
      if (token) {
          const role = JSON.parse(atob(token.split('.')[1])).role;
          if (role === 'ADMIN') navigate('/admin');
          else if (role === 'MANAGER') navigate('/manager');
          else navigate('/dashboard');
      }

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={credentials.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
          <button type="submit" className="btn login-btn" disabled={loading}>
            {loading ? 'Signing In...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#ff6a00', fontWeight: '600', textDecoration: 'none' }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;