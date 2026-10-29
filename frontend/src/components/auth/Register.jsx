import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User, Facebook } from 'lucide-react';
import axios from 'axios';
import { AuthLayout, GoogleButton, Divider, ErrorMessage, Field, SubmitButton } from './AuthLayout';

// URL del backend
import { API_URL } from '../../config.js';

const Register = ({ setUser }) => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden. Escríbela de nuevo en "Confirmar contraseña".');
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, { nombre, email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.removeItem('isGuest');
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setUser(data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'No pudimos crear tu cuenta. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${API_URL}/api/auth/facebook`;
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Guarda tu progreso, tus rachas y tus insignias"
      footer={
        <div className="mt-6 text-center">
          <Link to="/" className="inline-flex items-center min-h-11 text-stone-600 hover:text-stone-900 font-semibold text-sm transition-colors">
            <span aria-hidden="true">←&nbsp;</span>Volver al inicio
          </Link>
        </div>
      }
    >
      <div className="space-y-3">
        <GoogleButton onClick={handleGoogleLogin} />
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="w-full min-h-12 px-4 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-bold toque flex items-center justify-center gap-3"
        >
          <Facebook className="w-5 h-5 fill-white" aria-hidden="true" />
          Continuar con Facebook
        </button>
      </div>

      <Divider>O regístrate con tu correo</Divider>

      <ErrorMessage>{error}</ErrorMessage>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          id="registro-nombre"
          label="Nombre"
          icon={User}
          type="text"
          autoComplete="name"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Rosa Mamani"
          required
        />
        <Field
          id="registro-email"
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
          id="registro-password"
          label="Contraseña"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          minLength={6}
          hint="Al menos 6 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Field
          id="registro-confirmar"
          label="Confirmar contraseña"
          icon={Lock}
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <div className="pt-2">
          <SubmitButton loading={loading} loadingText="Creando cuenta…">
            Crear cuenta
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </SubmitButton>
        </div>
      </form>

      <p className="mt-8 text-center text-stone-600">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-green-800 font-bold underline-offset-4 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
