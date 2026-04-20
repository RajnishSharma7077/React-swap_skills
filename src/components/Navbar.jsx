import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { getAvatarGradient } from '../data/mockData';
import './Navbar.css';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { currentUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/dashboard', label: 'Dashboard', private: true },
    { to: '/matches', label: 'Matches', private: true },
    { to: '/sessions', label: 'Sessions', private: true },
    { to: '/profile', label: 'Profile', private: true },
  ];

  return (
    <nav className="navbar" id="main-nav">
      <div className="container navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">
            <svg width="24" height="24" viewBox="0 0 64 64" fill="none">
              <path d="M20 40 L32 20 L44 40" stroke="url(#ng)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M44 24 L32 44 L20 24" stroke="url(#ng)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
              <defs>
                <linearGradient id="ng" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7c3aed"/>
                  <stop offset="100%" stopColor="#06b6d4"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="brand-text">Skill<span className="gradient-text">Swap</span></span>
        </NavLink>

        <div className="navbar-links">
          {links.map((link) => {
            if (link.private && !user) return null;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                id={`nav-${link.label.toLowerCase()}`}
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>

        <div className="navbar-user">
          {user ? (
            <>
              <div className="user-points">
                <span className="points-icon">⚡</span>
                <span className="points-value">{currentUser?.skillPoints || 0}</span>
              </div>
              <div className="user-avatar-group">
                <NavLink to="/profile" className="user-avatar-link">
                  <div
                    className="avatar avatar-sm"
                    style={{ background: getAvatarGradient(currentUser?.id || 0) }}
                  >
                    {currentUser?.name?.charAt(0) || user.email?.charAt(0) || '?'}
                  </div>
                </NavLink>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm" id="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <NavLink to="/login" className="btn btn-secondary btn-sm">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">Sign Up</NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
