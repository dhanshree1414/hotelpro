import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center flex-grow-1">
      <div className="card shadow-lg border-0 p-4 p-md-5" style={{ maxWidth: '480px', width: '100%', borderRadius: '16px' }}>
        <div className="text-center mb-4">
          <h2 className="brand-font fw-bold">Welcome Back</h2>
          <p className="text-muted small">Sign in to manage reservations and access your HotelPro account</p>
        </div>

        {location.state?.message && (
          <div className="alert alert-info small py-2">{location.state.message}</div>
        )}

        {error && (
          <div className="alert alert-danger small py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold">Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-hotelpro w-100 py-2 fw-semibold mb-3"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Box for Mentor Evaluation */}
        <div className="bg-light p-3 rounded-3 border mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small fw-bold text-dark"><i className="bi bi-person-badge me-1 text-warning"></i> Quick Demo Access:</span>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-dark flex-fill"
              onClick={() => handleQuickLogin('admin@hotelpro.com', 'adminpassword123')}
            >
              Fill Admin
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary flex-fill"
              onClick={() => handleQuickLogin('guest@hotelpro.com', 'guestpassword123')}
            >
              Fill Guest
            </button>
          </div>
        </div>

        <div className="text-center small text-muted">
          Don't have an account? <Link to="/register" className="fw-semibold text-warning">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
