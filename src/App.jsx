import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import Sessions from './pages/Sessions';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import { useEffect } from 'react';

// Component to handle GitHub Pages SPA routing
function GitHubPagesRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle the redirected URL from 404.html
    if (location.search.startsWith('?/')) {
      const path = location.search.slice(2); // Remove '?/'
      const search = location.hash ? `?${location.hash.slice(1)}` : '';
      navigate(`${path}${search}`, { replace: true });
    }
  }, [location, navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <GitHubPagesRouter />
      <AuthProvider>
        <AppProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/matches" element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            } />
            <Route path="/sessions" element={
              <ProtectedRoute>
                <Sessions />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/user/:id" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
          </Routes>
          <ToastContainer />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
