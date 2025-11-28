import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token'); // Changed from 'authToken' to 'token'
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Listen for storage changes (useful for multi-tab sync)
    window.addEventListener('storage', checkAuth);
    
    // Custom event for same-tab updates
    window.addEventListener('authChange', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Changed from 'authToken'
    setIsLoggedIn(false);
    
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));
    
    // Redirect to landing page
    navigate('/landing');
  };

  return (
    <header className="header">
      <Link to="/landing" className="logo">🎬 MyBookApp</Link>
      <nav className="nav-links">
        <Link to="/landing" className="nav-link">Home</Link>
        
        {isLoggedIn ? (
          <button onClick={handleLogout} className="nav-link auth-btn logout-btn">
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link auth-btn">Login</Link>
            <Link to="/register" className="nav-link auth-btn register-btn">Register</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;