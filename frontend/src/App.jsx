import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, Suspense, lazy } from 'react';

// Sonner llega en su propio archivo, después de la primera pantalla: los avisos siempre
// responden a una acción posterior (guardar, marcar un favorito), así que ninguno se pierde
const Toaster = lazy(() => import('sonner').then((m) => ({ default: m.Toaster })));
import Home from './pages/Home';
import { Login, Register, Dashboard, LessonView, Profile, Dictionary, CultureModule } from './routes';

// Pantalla de espera: mismo fondo claro que la app y solo visible si la carga pasa de 0,3 s
// (las cargas rápidas no muestran un destello de "Cargando")
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-600" role="status">
    <span className="espera flex items-center gap-3 font-semibold">
      <span className="espera-punto" aria-hidden="true" />
      Cargando…
    </span>
  </div>
);

// URL del backend
import { API_URL } from './config.js';

// Ruta protegida que permite usuarios Y invitados.
// Va fuera de App: si se define dentro, cada cambio de estado de App la crea de nuevo
// y React vuelve a montar la pantalla entera (eso provocaba un bucle de peticiones).
const ProtectedRoute = ({ children, auth, guestAllowed = true }) => {
  if (auth.loading) {
    return <LoadingScreen />;
  }

  // Si hay usuario O es invitado (y está permitido), dar acceso
  if (auth.user || (auth.isGuest && guestAllowed)) {
    return children;
  }

  return <Navigate to="/login" />;
};

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

  const auth = { loading, user, isGuest };
  const hasSession = Boolean(user) || isGuest;

  // Con sesión, lo más probable es ir al panel y a una lección:
  // se descargan cuando el navegador está libre, para que abran sin espera
  useEffect(() => {
    if (loading || !hasSession) return undefined;
    const preload = () => {
      Dashboard.preload();
      LessonView.preload();
    };
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(preload, 1500);
    return () => clearTimeout(id);
  }, [loading, hasSession]);

  return (
    <BrowserRouter>
      {/* Avisos de toda la app (progreso guardado, insignias, favoritos, perfil).
          Arriba al centro: nunca tapa el botón "Continuar" de las lecciones, que va abajo */}
      <Suspense fallback={null}>
        <Toaster position="top-center" richColors closeButton duration={4000} toastOptions={{ style: { fontFamily: 'inherit' } }} />
      </Suspense>
      <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Home enableGuestMode={() => setIsGuest(true)} />} />
        <Route path="/login" element={<Login setUser={setUser} setIsGuest={setIsGuest} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute auth={auth}>
              <Dashboard user={user} setUser={setUser} isGuest={isGuest} setIsGuest={setIsGuest} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/lesson/:lessonId" 
          element={
            <ProtectedRoute auth={auth}>
              <LessonView user={user} isGuest={isGuest} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute auth={auth} guestAllowed={false}>
              <Profile user={user} setUser={setUser} />
            </ProtectedRoute>
          } 
        />
        <Route path="/dictionary" element={<Dictionary />} />
        <Route 
          path="/culture" 
          element={
            <ProtectedRoute auth={auth}>
              <CultureModule user={user} setUser={setUser} isGuest={isGuest} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;