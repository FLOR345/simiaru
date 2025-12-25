import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import LessonView from './pages/LessonView';
import Profile from './pages/Profile';
import Dictionary from './pages/Dictionary';
import CultureModule from './pages/CultureModule';

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [user, setUser] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token en la URL (viene de Google OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    
    if (tokenFromUrl) {
      // Guardar el token de Google
      localStorage.setItem('token', tokenFromUrl);
      localStorage.removeItem('isGuest');
      
      // Limpiar la URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Obtener datos del usuario desde el backend
      fetch(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${tokenFromUrl}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            setIsGuest(false);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error getting user:', err);
          setLoading(false);
        });
    } else {
      // Login normal (sin Google)
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      const guestMode = localStorage.getItem('isGuest');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
      if (guestMode === 'true') {
        setIsGuest(true);
      }
      setLoading(false);
    }
  }, []);

  // Ruta protegida que permite usuarios Y invitados
  const ProtectedRoute = ({ children, guestAllowed = true }) => {
    if (loading) {
      return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;
    }
    
    // Si hay usuario O es invitado (y está permitido), dar acceso
    if (user || (isGuest && guestAllowed)) {
      return children;
    }
    
    return <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home setIsGuest={setIsGuest} />} />
        <Route path="/login" element={<Login setUser={setUser} setIsGuest={setIsGuest} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard user={user} setUser={setUser} isGuest={isGuest} setIsGuest={setIsGuest} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lesson/:lessonId" 
          element={
            <ProtectedRoute>
              <LessonView user={user} isGuest={isGuest} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute guestAllowed={false}>
              <Profile user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route 
          path="/culture" 
          element={
            <ProtectedRoute>
              <CultureModule user={user} setUser={setUser} isGuest={isGuest} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;