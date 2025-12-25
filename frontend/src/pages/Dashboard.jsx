import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mountain, LogOut, Flame, Star, TrendingUp, BookOpen, Lock, CheckCircle, Sparkles, Trophy, Target, Award, ChevronDown, Play, Crown, Zap, UserX, AlertCircle } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.jpg';

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const Dashboard = ({ user, setUser, isGuest, setIsGuest }) => {
  const [units, setUnits] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('quechua');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [selectedLanguage]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Si es invitado, solo cargar unidades sin autenticación
      if (isGuest) {
        const unitsRes = await axios.get(`${API_URL}/api/lessons/units?idioma=${selectedLanguage}`);
        setUnits(unitsRes.data.units);
        setProgress([]); // Invitados no tienen progreso
      } else {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const [unitsRes, progressRes] = await Promise.all([
        axios.get(`${API_URL}/api/lessons/units?idioma=${selectedLanguage}`),
        axios.get(`${API_URL}/api/progress`)
      ]);

        setUnits(unitsRes.data.units);
        setProgress(progressRes.data.progress);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401 && !isGuest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
  // Limpiar todo
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isGuest');
  
  // Resetear estados
  if (setUser) setUser(null);
  if (setIsGuest) setIsGuest(false);
  
  navigate('/');
};

  const isLessonCompleted = (lessonId) => {
    if (isGuest) return false; // Invitados nunca tienen lecciones completadas
    return progress.some(p => p.leccion_id === lessonId && p.completado);
  };

  const completedLessons = progress.filter(p => p.completado).length;
  const totalLessons = units.reduce((acc, unit) => acc + (unit.lecciones_count || 0), 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Datos para invitado
  const guestUser = {
    nombre: 'Invitado',
    racha_actual: 0,
    puntos_totales: 0,
    nivel: 1
  };

  const displayUser = isGuest ? guestUser : user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      
      {/* ==================== BANNER MODO INVITADO ==================== */}
      {isGuest && (
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <UserX className="w-5 h-5" />
              <span className="font-semibold">
                Estás en <strong>Modo Invitado</strong> - Solo puedes acceder a la Unidad 1
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                to="/register" 
                className="px-4 py-2 bg-white text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-all"
              >
                Crear cuenta gratis
              </Link>
              <Link 
                to="/login" 
                className="px-4 py-2 border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-all"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HEADER PREMIUM ==================== */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo y Nombre */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <img 
                src={logo} 
                alt="SimiAru" 
                className="h-10 w-auto transform group-hover:scale-110 transition duration-300"
              />
              <span className="text-2xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent hidden md:block">
                SimiAru
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-6">
              <Link 
                to="/dictionary" 
                className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-all hover:scale-105"
              >
                <BookOpen className="w-5 h-5" />
                <span className="hidden lg:inline">Diccionario</span>
              </Link>
              
              <Link 
                to="/culture" 
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-semibold transition-all hover:scale-105"
              >
                <Sparkles className="w-5 h-5" />
                <span className="hidden lg:inline">Cultura</span>
              </Link>

              {/* Perfil - Solo para usuarios registrados */}
              {!isGuest ? (
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 font-semibold transition-all hover:scale-105"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold">
                    {displayUser?.nombre?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden xl:inline">{displayUser?.nombre}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-orange-600 font-semibold">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold">
                    <UserX className="w-5 h-5" />
                  </div>
                  <span className="hidden xl:inline">Invitado</span>
                </div>
              )}

              <button 
                onClick={handleLogout} 
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title={isGuest ? "Salir del modo invitado" : "Cerrar sesión"}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* ==================== SALUDO Y MOTIVACIÓN ==================== */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-black text-gray-800 mb-2">
            {isGuest ? '¡Bienvenido, Invitado! 👋' : `¡Rimaykullayki, ${displayUser?.nombre}! 👋`}
          </h1>
          <p className="text-xl text-gray-600">
            {isGuest 
              ? "Explora la Unidad 1 gratis. ¡Regístrate para guardar tu progreso!"
              : completedLessons === 0 
                ? "¡Comienza tu viaje hacia el dominio de las lenguas andinas!"
                : `¡Vas genial! Has completado ${completedLessons} lecciones 🎉`
            }
          </p>
        </div>

        {/* ==================== ALERTA PARA INVITADOS ==================== */}
        {isGuest && (
          <div className="mb-8 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-orange-800 mb-2">Modo Invitado - Acceso Limitado</h3>
                <ul className="text-orange-700 space-y-1 mb-4">
                  <li>✅ Puedes explorar la <strong>Unidad 1</strong> de Quechua y Aymara</li>
                  <li>✅ Acceso al Diccionario y Cultura Viva</li>
                  <li>❌ No se guarda tu progreso</li>
                  <li>❌ No puedes acceder a las Unidades 2-8</li>
                  <li>❌ No ganas puntos ni insignias</li>
                </ul>
                <div className="flex gap-3">
                  <Link 
                    to="/register" 
                    className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
                  >
                    Crear cuenta gratis →
                  </Link>
                  <Link 
                    to="/login" 
                    className="px-6 py-2 border-2 border-orange-500 text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-all"
                  >
                    Ya tengo cuenta
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== ESTADÍSTICAS PREMIUM ==================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Racha */}
          <div className={`group relative rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isGuest ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 'bg-gradient-to-br from-orange-500 to-red-600'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Flame className={`w-12 h-12 ${!isGuest && 'animate-pulse'}`} />
                <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">RACHA</span>
              </div>
              <p className="text-5xl font-black mb-1">{displayUser?.racha_actual || 0}</p>
              <p className={`font-semibold ${isGuest ? 'text-gray-200' : 'text-orange-100'}`}>
                {isGuest ? 'Regístrate para racha' : 'días consecutivos'}
              </p>
            </div>
          </div>

          {/* Ayni Points */}
          <div className={`group relative rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isGuest ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 'bg-gradient-to-br from-yellow-400 to-orange-500'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Star className="w-12 h-12 fill-white" />
                <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">PUNTOS</span>
              </div>
              <p className="text-5xl font-black mb-1">{displayUser?.puntos_totales || 0}</p>
              <p className={`font-semibold ${isGuest ? 'text-gray-200' : 'text-yellow-100'}`}>
                {isGuest ? 'Regístrate para puntos' : 'Ayni Points'}
              </p>
            </div>
          </div>

          {/* Progreso General */}
          <div className={`group relative rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isGuest ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-12 h-12" />
                <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">PROGRESO</span>
              </div>
              <p className="text-5xl font-black mb-1">{isGuest ? '--' : `${overallProgress}%`}</p>
              <p className={`font-semibold ${isGuest ? 'text-gray-200' : 'text-green-100'}`}>
                {isGuest ? 'Regístrate para guardar' : `${completedLessons} de ${totalLessons} lecciones`}
              </p>
            </div>
          </div>

          {/* Nivel */}
          <div className={`group relative rounded-3xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${isGuest ? 'bg-gradient-to-br from-gray-400 to-gray-500' : 'bg-gradient-to-br from-purple-500 to-pink-600'}`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <Crown className="w-12 h-12" />
                <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">NIVEL</span>
              </div>
              <p className="text-5xl font-black mb-1">{displayUser?.nivel || 1}</p>
              <p className={`font-semibold ${isGuest ? 'text-gray-200' : 'text-purple-100'}`}>
                {isGuest ? 'Modo Demo' : 
                  displayUser?.nivel === 1 ? "Principiante" :
                  displayUser?.nivel === 2 ? "Intermedio" : "Avanzado"
                }
              </p>
            </div>
          </div>
        </div>

        {/* ==================== SELECCIÓN DE IDIOMA ==================== */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Selecciona tu idioma</h2>
              <p className="text-gray-600">Cambia entre Quechua y Aymara cuando quieras</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Quechua */}
            <button
              onClick={() => setSelectedLanguage('quechua')}
              className={`group relative p-8 rounded-2xl border-3 transition-all duration-300 overflow-hidden ${
                selectedLanguage === 'quechua'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    Q
                  </div>
                  {selectedLanguage === 'quechua' && (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Quechua</h3>
                <p className="text-gray-600 font-semibold mb-3">Cusco - Collao</p>
                <p className="text-sm text-gray-500">El idioma del Imperio Inca, hablado por millones en los Andes</p>
              </div>
            </button>

            {/* Aymara */}
            <button
              onClick={() => setSelectedLanguage('aymara')}
              className={`group relative p-8 rounded-2xl border-3 transition-all duration-300 overflow-hidden ${
                selectedLanguage === 'aymara'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    A
                  </div>
                  {selectedLanguage === 'aymara' && (
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Aymara</h3>
                <p className="text-gray-600 font-semibold mb-3">Altiplano Puneño</p>
                <p className="text-sm text-gray-500">La lengua del lago Titicaca y las montañas sagradas</p>
              </div>
            </button>
          </div>
        </div>

        {/* ==================== UNIDADES DE APRENDIZAJE ==================== */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-800">Tu Ruta de Aprendizaje</h2>
                <p className="text-gray-600">
                  Aprende {selectedLanguage === 'quechua' ? 'Quechua' : 'Aymara'} paso a paso
                </p>
              </div>
            </div>
            
            {!isGuest && overallProgress > 0 && (
              <div className="hidden md:block">
                <div className="text-right mb-2">
                  <span className="text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {overallProgress}%
                  </span>
                </div>
                <div className="w-48 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-green-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p className="text-xl font-semibold text-gray-600">Cargando tu camino de aprendizaje...</p>
            </div>
          ) : units.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <p className="text-xl font-semibold text-gray-600 mb-2">No hay unidades disponibles {selectedLanguage === 'aymara' ? 'para Aymara' : 'para Quechua'}</p>
              <p className="text-gray-500">Pronto agregaremos más contenido para este idioma</p>
            </div>
          ) : (
            <div className="space-y-6">
              {units.map((unit, index) => (
                <UnitCard 
                  key={unit.id} 
                  unit={unit} 
                  index={index}
                  isLessonCompleted={isLessonCompleted}
                  selectedLanguage={selectedLanguage}
                  isGuest={isGuest}
                />
              ))}
            </div>
          )}
        </div>

        {/* ==================== MOTIVACIÓN FINAL ==================== */}
        {!isGuest && completedLessons > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-8 text-white text-center shadow-2xl">
            <Trophy className="w-16 h-16 mx-auto mb-4 animate-bounce" />
            <h3 className="text-2xl font-black mb-2">¡Sigue así!</h3>
            <p className="text-lg text-white/90">
              Has completado {completedLessons} {completedLessons === 1 ? 'lección' : 'lecciones'}. 
              ¡Cada día estás más cerca de dominar {selectedLanguage === 'quechua' ? 'el Quechua' : 'el Aymara'}!
            </p>
          </div>
        )}

        {/* CTA para invitados al final */}
        {isGuest && (
          <div className="mt-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white text-center shadow-2xl">
            <UserX className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-2xl font-black mb-2">¿Te gustó la experiencia?</h3>
            <p className="text-lg text-white/90 mb-6">
              Crea tu cuenta gratis para guardar tu progreso, ganar puntos y acceder a todas las unidades
            </p>
            <div className="flex justify-center gap-4">
              <Link 
                to="/register" 
                className="px-8 py-3 bg-white text-orange-600 font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Crear cuenta gratis
              </Link>
              <Link 
                to="/login" 
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Estilos de animación */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

// ==================== UNIT CARD COMPONENT ==================== 
const UnitCard = ({ unit, index, isLessonCompleted, selectedLanguage, isGuest }) => {
  const [expanded, setExpanded] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  // Los invitados solo pueden acceder a la Unidad 1 (index === 0)
  const isLockedForGuest = isGuest && index > 0;

  const loadLessons = async () => {
    if (lessons.length > 0 || isLockedForGuest) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(`${API_URL}/api/lessons/units/${unit.id}/lessons`, { headers });
      setLessons(data.lessons);
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (isLockedForGuest) return; // No expandir si está bloqueado
    if (!expanded) loadLessons();
    setExpanded(!expanded);
  };

  const completedCount = lessons.filter(l => isLessonCompleted(l.id)).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  const gradients = [
    'from-blue-500 to-cyan-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-yellow-500 to-orange-600',
    'from-pink-500 to-rose-600',
    'from-indigo-500 to-blue-600',
    'from-teal-500 to-green-600',
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <div className={`group border-2 rounded-2xl overflow-hidden transition-all duration-300 bg-white ${
      isLockedForGuest 
        ? 'border-gray-200 opacity-60 cursor-not-allowed' 
        : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
    }`}>
      
      {/* Header de la Unidad */}
      <div
        className={`${isLockedForGuest ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={handleToggle}
      >
        <div className="flex items-center gap-6 p-6">
          
          {/* Número de Unidad */}
          <div className={`w-16 h-16 bg-gradient-to-br ${isLockedForGuest ? 'from-gray-400 to-gray-500' : gradient} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0 ${!isLockedForGuest && 'group-hover:scale-110'} transition-transform`}>
            {isLockedForGuest ? <Lock className="w-8 h-8" /> : index + 1}
          </div>

          {/* Info de Unidad */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-gray-800 mb-1">
                {unit.nombre}
              </h3>
              {isLockedForGuest && (
                <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-full">
                  SOLO REGISTRADOS
                </span>
              )}
            </div>
            <p className="text-gray-600">{unit.descripcion}</p>
            
            {/* Mensaje para invitados en unidades bloqueadas */}
            {isLockedForGuest && (
              <p className="text-orange-600 text-sm font-semibold mt-2">
                🔒 Regístrate gratis para acceder a esta unidad
              </p>
            )}
            
            {/* Barra de Progreso */}
            {!isLockedForGuest && lessons.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm font-semibold text-gray-600 mb-2">
                  <span>{completedCount} de {lessons.length} completadas</span>
                  <span className="text-green-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`bg-gradient-to-r ${gradient} h-2.5 rounded-full transition-all duration-500`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Chevron */}
          {!isLockedForGuest && (
            <ChevronDown 
              className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${
                expanded ? 'rotate-180' : ''
              }`} 
            />
          )}
        </div>
      </div>

      {/* Lista de Lecciones */}
      {expanded && !isLockedForGuest && (
        <div className="border-t-2 border-gray-100 bg-gray-50 p-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="relative w-12 h-12 mx-auto">
                <div className="absolute inset-0 border-3 border-gray-200 rounded-full"></div>
                <div className={`absolute inset-0 border-3 bg-gradient-to-r ${gradient} rounded-full border-t-transparent animate-spin`}></div>
              </div>
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-center text-gray-600 py-8">No hay lecciones disponibles</p>
          ) : (
            <div className="space-y-3">
              {lessons.map((lesson, lessonIndex) => {
                const completed = isLessonCompleted(lesson.id);
                // Para invitados, no bloquear lecciones por progreso (pueden hacer cualquiera de la Unidad 1)
                const locked = !isGuest && lessonIndex > 0 && !isLessonCompleted(lessons[lessonIndex - 1].id);

                return (
                  <Link
                    key={lesson.id}
                    to={locked ? '#' : `/lesson/${lesson.id}`}
                    className={`group/lesson flex items-center gap-4 p-5 rounded-xl transition-all duration-300 ${
                      locked
                        ? 'bg-gray-100 cursor-not-allowed opacity-60'
                        : completed
                        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-400 hover:shadow-md'
                        : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-md'
                    }`}
                    onClick={(e) => locked && e.preventDefault()}
                  >
                    {/* Icono */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover/lesson:scale-110 ${
                      locked
                        ? 'bg-gray-200'
                        : completed
                        ? `bg-gradient-to-br ${gradient}`
                        : 'bg-gray-100 group-hover/lesson:bg-gradient-to-br group-hover/lesson:from-blue-500 group-hover/lesson:to-cyan-600'
                    }`}>
                      {locked ? (
                        <Lock className="w-6 h-6 text-gray-400" />
                      ) : completed ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-gray-400 group-hover/lesson:text-white transition-colors" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h4 className="font-black text-gray-800 text-lg">
                        {lesson.titulo}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {locked ? '🔒 Completa la lección anterior' : 
                         completed ? '✅ Completada' : 
                         isGuest ? '▶️ Probar lección (modo demo)' :
                         '▶️ Comenzar lección'}
                      </p>
                    </div>

                    {/* Puntos */}
                    {!locked && (
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isGuest ? 'bg-gray-100' : 'bg-yellow-100'}`}>
                        <Star className={`w-4 h-4 ${isGuest ? 'fill-gray-400 text-gray-400' : 'fill-yellow-500 text-yellow-500'}`} />
                        <span className={`font-bold text-sm ${isGuest ? 'text-gray-500' : 'text-yellow-700'}`}>
                          {isGuest ? 'Demo' : `+${lesson.puntos_recompensa || 100}`}
                        </span>
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;