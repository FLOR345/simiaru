import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, UserX } from 'lucide-react';
import axios from 'axios';
import { AuthLayout, GoogleButton, Divider, ErrorMessage, Field, SubmitButton } from './AuthLayout';

// URL del backend
import { API_URL } from '../../config.js';

const Login = ({ setUser, setIsGuest }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('isGuest');
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      if (setIsGuest) setIsGuest(false);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos iniciar sesión. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Login con Google
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  // Quien llegó aquí desde una página protegida puede seguir sin cuenta
  const handleGuestMode = () => {
    if (setIsGuest) setIsGuest(true);
    try {
      localStorage.setItem('isGuest', 'true');
    } catch {
      // Navegación privada: el modo invitado dura solo esta visita
    }
    navigate('/dashboard');
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Inicia sesión para continuar tu aprendizaje"
      footer={
        <div className="mt-6 text-center space-y-3">
          <button
            type="button"
            onClick={handleGuestMode}
            className="inline-flex items-center gap-2 min-h-11 px-4 text-orange-800 font-bold hover:bg-orange-50 rounded-xl toque"
          >
            <UserX className="w-4 h-4" aria-hidden="true" />
            Probar sin cuenta
          </button>
          <div>
            <Link to="/" className="inline-flex items-center min-h-11 text-stone-600 hover:text-stone-900 font-semibold text-sm transition-colors">
              <span aria-hidden="true">←&nbsp;</span>Volver al inicio
            </Link>
          </div>
        </div>
      }
    >
      <GoogleButton onClick={handleGoogleLogin} />
      <Divider>O con tu correo</Divider>

      <ErrorMessage>{error}</ErrorMessage>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          id="login-email"
          label="Correo electrónico"
          icon={Mail}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          required
        />
        <Field
          id="login-password"
          label="Contraseña"
          icon={Lock}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton loading={loading} loadingText="Iniciando sesión…">
          Iniciar sesión
          <ArrowRight className="w-5 h-5" aria-hidden="true" />
        </SubmitButton>
      </form>

      <p className="mt-8 text-center text-stone-600">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-green-800 font-bold underline-offset-4 hover:underline">
          Regístrate gratis
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
