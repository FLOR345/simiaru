import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import axios from 'axios';
import logo from '../../assets/logo.jpg';

const Login = ({ setUser, setIsGuest }) => {  // <-- Agregar setIsGuest aquí
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
    const { data } = await axios.post('/api/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.removeItem('isGuest');  // <-- AGREGAR ESTO
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    if (setIsGuest) setIsGuest(false);  // <-- AGREGAR ESTO
    navigate('/dashboard');
  } catch (err) {
    setError(err.response?.data?.message || 'Error al iniciar sesión');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="card max-w-md w-full shadow-2xl">
        {/* Logo y Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src={logo} 
              alt="SIMIARU Logo" 
              className="h-24 w-auto"
            />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Bienvenido de vuelta</h2>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar tu aprendizaje</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none transition"
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Iniciando sesión...
              </>
            ) : (
              <>
                Iniciar Sesión
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ¿No tienes cuenta?{' '}
            <Link 
              to="/register" 
              className="text-green-600 font-bold hover:text-green-700 hover:underline transition"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-gray-500 hover:text-gray-700 font-semibold transition text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;