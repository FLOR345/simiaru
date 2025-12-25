import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Award, Flame, Star, TrendingUp, Mountain, ArrowLeft, Calendar, Target, Trophy, Crown, CheckCircle, Clock, Zap, BookOpen, Globe, Sparkles, Play, ArrowRight, Shield, Medal, Edit3, Camera, Bell, BellOff, Save, X, Lock } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.jpg';

const Profile = ({ user, setUser }) => {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState({
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    idioma_objetivo: '',
    notificaciones_email: true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [passwordInfo, setPasswordInfo] = useState({ hasPassword: true, isGoogleUser: false });
  const navigate = useNavigate();

  useEffect(() => {
    loadProgress();
    if (user) {
      setEditForm({
        nombre: user.nombre || '',
        idioma_objetivo: user.idioma_objetivo || 'quechua',
        notificaciones_email: user.notificaciones_email !== false
      });
    }
  }, [user]);

  // Verificar si el usuario tiene contraseña
  useEffect(() => {
    const checkPassword = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('/api/auth/has-password', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPasswordInfo({
          hasPassword: data.hasPassword,
          isGoogleUser: data.isGoogleUser
        });
      } catch (error) {
        console.error('Error checking password:', error);
      }
    };
    
    if (user) {
      checkPassword();
    }
  }, [user?.id]);

// ==================== FUNCIÓN loadProgress CORREGIDA ====================
const loadProgress = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    
    // Verificar que hay token
    if (!token) {
      console.error('No hay token de autenticación');
      setProgress([]);
      setStats({
        totalLessons: 0,
        completedLessons: 0,
        averageScore: 0
      });
      setLoading(false);
      return;
    }

    console.log('🔍 Solicitando progreso del usuario...');
    
    const { data } = await axios.get('/api/progress', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Respuesta del backend:', data);
    
    // ✅ PROTECCIÓN: Manejar la estructura del backend
    // El backend devuelve: { success: true, progress: [...] }
    let progressArray = [];
    
    if (data.success && Array.isArray(data.progress)) {
      progressArray = data.progress;
    } else if (Array.isArray(data)) {
      // Por si acaso el backend envía directamente el array
      progressArray = data;
    } else {
      console.warn('⚠️ Estructura inesperada del backend:', data);
      progressArray = [];
    }
    
    console.log(`📊 Total de lecciones encontradas: ${progressArray.length}`);
    
    setProgress(progressArray);
    
    // ✅ PROTECCIÓN: Filtrar con validación
    const completed = progressArray.filter(p => {
      // En PostgreSQL, completado puede ser boolean (true/false) o integer (1/0)
      return p?.completado === true || 
             p?.completado === 1 || 
             p?.completado === '1' ||
             p?.completado === 't'; // PostgreSQL a veces devuelve 't' para true
    });
    
    console.log(`✅ Lecciones completadas: ${completed.length}`);
    
    // ✅ PROTECCIÓN: Calcular promedio con seguridad
    const avgScore = completed.length > 0
      ? Math.round(
          completed.reduce((sum, p) => {
            const score = Number(p.porcentaje_aciertos) || 0;
            return sum + score;
          }, 0) / completed.length
        )
      : 0;
    
    console.log(`📈 Promedio de aciertos: ${avgScore}%`);
    
    setStats({
      totalLessons: progressArray.length,
      completedLessons: completed.length,
      averageScore: avgScore
    });
    
  } catch (error) {
    console.error('❌ Error cargando progreso:', error);
    
    // Mostrar más detalles del error
    if (error.response) {
      // El servidor respondió con un error
      console.error('📛 Error del servidor:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
      
      // Si es error 401, redirigir al login
      if (error.response.status === 401) {
        console.error('🔐 Token inválido o expirado. Redirigiendo al login...');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta
      console.error('🌐 Sin respuesta del servidor:', error.request);
      console.error('⚠️ Verifica que el backend esté corriendo en Railway');
    } else {
      // Algo pasó al configurar la petición
      console.error('⚙️ Error de configuración:', error.message);
    }
    
    // ✅ Establecer valores por defecto en caso de error
    setProgress([]);
    setStats({
      totalLessons: 0,
      completedLessons: 0,
      averageScore: 0
    });
  } finally {
    setLoading(false);
    console.log('🏁 Carga de progreso finalizada');
  }
};

// ==================== EXTRA: Función de inicialización mejorada ====================
useEffect(() => {
  // Solo cargar si hay usuario
  if (user && user.id) {
    console.log('👤 Usuario detectado:', user.email);
    loadProgress();
  } else {
    console.warn('⚠️ No hay usuario autenticado');
    setProgress([]);
    setStats({
      totalLessons: 0,
      completedLessons: 0,
      averageScore: 0
    });
    setLoading(false);
  }
  
  // Configurar formulario de edición
  if (user) {
    setEditForm({
      nombre: user.nombre || '',
      idioma_objetivo: user.idioma_objetivo || 'quechua',
      notificaciones_email: user.notificaciones_email !== false
    });
  }
}, [user?.id]); // Dependencia específica para evitar re-renders innecesarios

  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('/api/auth/profile', editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUser({ ...user, ...editForm });
      setMessage({ type: 'success', text: '¡Perfil actualizado correctamente!' });
      
      setTimeout(() => {
        setShowEditModal(false);
        setMessage(null);
      }, 1500);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al actualizar el perfil' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' });
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessage({ type: 'success', text: data.message || '¡Contraseña cambiada correctamente!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordInfo({ ...passwordInfo, hasPassword: true });
      
      setTimeout(() => {
        setShowPasswordModal(false);
        setMessage(null);
      }, 2000);
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Error al cambiar la contraseña' });
    } finally {
      setSaving(false);
    }
  };

  const getLevelName = (nivel) => {
    const levels = {
      1: { name: 'Ayllu', subtitle: 'Comunidad', color: 'from-green-400 to-emerald-500' },
      2: { name: "Mark'a", subtitle: 'Pueblo', color: 'from-blue-400 to-cyan-500' },
      3: { name: 'Llaqta', subtitle: 'Ciudad', color: 'from-purple-400 to-pink-500' },
      4: { name: 'Suyu', subtitle: 'Región', color: 'from-orange-400 to-red-500' },
      5: { name: 'Tawantinsuyu', subtitle: 'Imperio', color: 'from-yellow-400 to-orange-500' }
    };
    return levels[nivel] || { name: `Nivel ${nivel}`, subtitle: 'Aprendiz', color: 'from-gray-400 to-gray-500' };
  };

  const getAchievements = () => {
    const achievements = [];
    
    if (user?.racha_actual >= 7) {
      achievements.push({ icon: '🔥', name: 'Racha de Fuego', description: '7 días seguidos', color: 'from-orange-500 to-red-600' });
    }
    if (user?.racha_actual >= 30) {
      achievements.push({ icon: '🌟', name: 'Maestro Constante', description: '30 días seguidos', color: 'from-yellow-400 to-orange-500' });
    }
    if (stats.completedLessons >= 10) {
      achievements.push({ icon: '📚', name: 'Estudiante Dedicado', description: '10 lecciones', color: 'from-blue-500 to-purple-600' });
    }
    if (stats.completedLessons >= 50) {
      achievements.push({ icon: '🏆', name: 'Experto', description: '50 lecciones', color: 'from-purple-500 to-pink-600' });
    }
    if (stats.averageScore >= 80) {
      achievements.push({ icon: '⭐', name: 'Excelencia', description: 'Promedio 80%+', color: 'from-green-500 to-emerald-600' });
    }
    if (user?.puntos_totales >= 1000) {
      achievements.push({ icon: '💎', name: 'Coleccionista', description: '1000 puntos', color: 'from-cyan-500 to-blue-600' });
    }
    
    return achievements;
  };

  const level = getLevelName(user?.nivel_actual || 1);
  const achievements = getAchievements();
  const progressPercentage = stats.totalLessons > 0 
    ? Math.round((stats.completedLessons / stats.totalLessons) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* ==================== MODAL EDITAR PERFIL ==================== */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Edit3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Editar Perfil</h2>
                <p className="text-gray-600 text-sm">Actualiza tu información</p>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-xl mb-6 ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editForm.nombre}
                  onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Idioma que estás aprendiendo
                </label>
                <select
                  value={editForm.idioma_objetivo}
                  onChange={(e) => setEditForm({ ...editForm, idioma_objetivo: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
                >
                  <option value="quechua">🏔️ Quechua</option>
                  <option value="aymara">🌙 Aymara</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Notificaciones por Email
                </label>
                <button
                  onClick={() => setEditForm({ ...editForm, notificaciones_email: !editForm.notificaciones_email })}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition ${
                    editForm.notificaciones_email
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {editForm.notificaciones_email ? (
                      <Bell className="w-5 h-5 text-green-600" />
                    ) : (
                      <BellOff className="w-5 h-5 text-gray-400" />
                    )}
                    <span className={editForm.notificaciones_email ? 'text-green-700' : 'text-gray-600'}>
                      {editForm.notificaciones_email ? 'Activadas' : 'Desactivadas'}
                    </span>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition ${
                    editForm.notificaciones_email ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    <div className={`w-4 h-4 rounded-full bg-white transition transform ${
                      editForm.notificaciones_email ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </div>
                </button>
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL CAMBIAR CONTRASEÑA ==================== */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowPasswordModal(false);
                setMessage(null);
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
              }}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {!passwordInfo.hasPassword ? 'Crear Contraseña' : 'Cambiar Contraseña'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {!passwordInfo.hasPassword 
                    ? 'Crea una contraseña para iniciar con email' 
                    : 'Actualiza tu contraseña'}
                </p>
              </div>
            </div>

            {/* Aviso para usuarios de Google */}
            {passwordInfo.isGoogleUser && !passwordInfo.hasPassword && (
              <div className="p-4 rounded-xl mb-6 bg-blue-50 text-blue-800 border border-blue-200">
                <p className="text-sm">
                  <strong>🔐 Cuenta de Google:</strong> Al crear una contraseña, podrás iniciar sesión con tu email y contraseña además de Google.
                </p>
              </div>
            )}

            {message && (
              <div className={`p-4 rounded-xl mb-6 ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-5">
              {/* Solo mostrar si YA tiene contraseña */}
              {passwordInfo.hasPassword && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    {!passwordInfo.hasPassword ? 'Crear Contraseña' : 'Cambiar Contraseña'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== HEADER PREMIUM ==================== */}
      <header className="bg-white/95 backdrop-blur-xl shadow-xl sticky top-0 z-40 border-b-2 border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="group p-3 hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 rounded-2xl transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
              </button>
              
              <div className="flex items-center gap-4">
                <img 
                  src={logo} 
                  alt="SimiAru" 
                  className="h-12 w-auto rounded-xl shadow-md"
                />
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                    Mi Perfil
                  </h1>
                  <p className="text-sm text-gray-600 font-semibold">Tu Trayectoria de Aprendizaje</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Editar Perfil</span>
              </button>
              
              <Link
                to="/dashboard"
                className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Mountain className="w-5 h-5" />
                Continuar
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10 max-w-7xl">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
              <img src={logo} alt="SimiAru" className="absolute inset-2 w-20 h-20 rounded-full object-cover" />
            </div>
            <p className="text-2xl font-bold text-gray-700">Cargando tu perfil...</p>
          </div>
        ) : (
          <>
            {/* ==================== HERO BANNER CON AVATAR ==================== */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-[2.5rem] shadow-2xl p-10 md:p-12 mb-10 overflow-hidden">
              
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
              
              <div className="relative z-10">
                <div className="grid md:grid-cols-[auto_1fr] gap-8 items-center">
                  
                  <div className="flex justify-center md:justify-start">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 rounded-[2rem] blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="relative w-36 h-36 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-[2rem] flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-500 border-4 border-white/30">
                        <User className="w-20 h-20 text-white drop-shadow-lg" />
                      </div>
                      
                      <div className={`absolute -bottom-3 -right-3 w-16 h-16 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center border-4 border-white shadow-xl`}>
                        <div className="text-center">
                          <Crown className="w-7 h-7 text-white mx-auto" />
                          <p className="text-xs font-black text-white">{user?.nivel_actual || 1}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center md:text-left text-white">
                    <h2 className="text-5xl font-black mb-4 drop-shadow-lg">{user?.nombre || 'Usuario'}</h2>
                    
                    <div className="flex flex-col md:flex-row items-center gap-3 mb-5">
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30">
                        <Mail className="w-5 h-5" />
                        <span className="font-semibold">{user?.email}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30">
                        <Globe className="w-5 h-5" />
                        <span className="font-semibold capitalize">{user?.idioma_objetivo || 'Quechua'}</span>
                      </div>

                      {/* Badge de Google */}
                      {passwordInfo.isGoogleUser && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl border border-white/30">
                          <span className="text-lg">🔗</span>
                          <span className="font-semibold">Google</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={`inline-flex items-center gap-4 bg-gradient-to-r ${level.color} px-8 py-4 rounded-2xl shadow-2xl border-2 border-white/50`}>
                      <Trophy className="w-10 h-10 text-white" />
                      <div className="text-left">
                        <p className="text-sm font-bold text-white/90">Tu Nivel Actual</p>
                        <p className="text-2xl font-black">{level.name}</p>
                        <p className="text-sm font-semibold text-white/90">{level.subtitle}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="text-sm font-semibold">Editar Perfil</span>
                      </button>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl hover:bg-white/30 transition"
                      >
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-semibold">
                          {!passwordInfo.hasPassword ? 'Crear Contraseña' : 'Cambiar Contraseña'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== ESTADÍSTICAS EN GRID ==================== */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              
              <div className="group relative bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 text-white">
                  <Flame className="w-14 h-14 mb-4 animate-pulse drop-shadow-lg" />
                  <p className="text-6xl font-black mb-2">{user?.racha_actual || 0}</p>
                  <p className="text-lg font-bold opacity-90">Días Consecutivos</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 text-white">
                  <Star className="w-14 h-14 mb-4 fill-white drop-shadow-lg" />
                  <p className="text-6xl font-black mb-2">{user?.puntos_totales || 0}</p>
                  <p className="text-lg font-bold opacity-90">Ayni Points</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 text-white">
                  <BookOpen className="w-14 h-14 mb-4 drop-shadow-lg" />
                  <p className="text-6xl font-black mb-2">{stats.completedLessons}</p>
                  <p className="text-lg font-bold opacity-90">Lecciones</p>
                </div>
              </div>

              <div className="group relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10 text-white">
                  <Target className="w-14 h-14 mb-4 drop-shadow-lg" />
                  <p className="text-6xl font-black mb-2">{stats.averageScore}%</p>
                  <p className="text-lg font-bold opacity-90">Precisión</p>
                </div>
              </div>
            </div>

            {/* ==================== CONFIGURACIÓN RÁPIDA ==================== */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-gray-700 to-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800">Configuración</h2>
                  <p className="text-gray-600 font-semibold">Administra tu cuenta</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition">
                    <Edit3 className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Editar Perfil</p>
                    <p className="text-sm text-gray-600">Nombre, idioma, notificaciones</p>
                  </div>
                </button>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center gap-4 p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border-2 border-orange-100 hover:border-orange-300 hover:shadow-lg transition-all group"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition">
                    <Lock className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">
                      {!passwordInfo.hasPassword ? 'Crear Contraseña' : 'Cambiar Contraseña'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {!passwordInfo.hasPassword ? 'Añade acceso con email' : 'Actualiza tu contraseña'}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                    {user?.notificaciones_email !== false ? (
                      <Bell className="w-7 h-7 text-white" />
                    ) : (
                      <BellOff className="w-7 h-7 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Notificaciones</p>
                    <p className="text-sm text-gray-600">
                      {user?.notificaciones_email !== false ? '✓ Activadas' : '✗ Desactivadas'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== PROGRESO GENERAL ==================== */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800">Progreso General</h2>
                  <p className="text-gray-600 font-semibold">Tu camino hacia la maestría</p>
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-700">
                    {stats.completedLessons} de {stats.totalLessons} lecciones completadas
                  </span>
                  <span className="text-4xl font-black bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {progressPercentage}%
                  </span>
                </div>
                
                <div className="relative w-full bg-gradient-to-r from-gray-100 to-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 rounded-full transition-all duration-1000 flex items-center justify-end pr-3 shadow-lg"
                    style={{ width: `${progressPercentage}%` }}
                  >
                    {progressPercentage > 15 && (
                      <Zap className="w-5 h-5 text-white animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-800">{stats.completedLessons}</p>
                    <p className="text-sm text-gray-600 font-semibold">Completadas</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                    <Clock className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-800">{stats.totalLessons - stats.completedLessons}</p>
                    <p className="text-sm text-gray-600 font-semibold">Pendientes</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-800">{stats.averageScore}%</p>
                    <p className="text-sm text-gray-600 font-semibold">Precisión</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==================== LOGROS ==================== */}
            {achievements.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 mb-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-800">Logros Desbloqueados</h2>
                    <p className="text-gray-600 font-semibold">{achievements.length} insignias ganadas</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 text-center border-2 border-gray-200 hover:border-yellow-400 hover:shadow-2xl transition-all duration-300 hover:-translate-y-3"
                    >
                      <div className="text-6xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                        {achievement.icon}
                      </div>
                      <p className="font-black text-gray-800 text-sm mb-1">{achievement.name}</p>
                      <p className="text-xs text-gray-600 font-semibold">{achievement.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== HISTORIAL ==================== */}
            <div className="bg-white rounded-[2rem] shadow-xl p-8 md:p-10 mb-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-800">Historial de Lecciones</h2>
                  <p className="text-gray-600 font-semibold">Últimas 10 lecciones completadas</p>
                </div>
              </div>

              {progress.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <BookOpen className="w-14 h-14 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-700 mb-3">
                    Aún no has completado ninguna lección
                  </h3>
                  <p className="text-gray-500 mb-8 text-lg">¡Es hora de comenzar tu aventura!</p>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    <Play className="w-6 h-6" />
                    Comenzar Ahora
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {progress
                    .sort((a, b) => new Date(b.fecha_completado) - new Date(a.fecha_completado))
                    .slice(0, 10)
                    .map((p, index) => (
                      <div
                        key={index}
                        className="group flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-5">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                            p.completado
                              ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                              : 'bg-gradient-to-br from-gray-400 to-gray-500'
                          }`}>
                            {p.completado ? (
                              <CheckCircle className="w-8 h-8 text-white" />
                            ) : (
                              <Clock className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-black text-xl text-gray-800 mb-1">
                              Lección #{p.leccion_id}
                            </p>
                            <div className="flex items-center gap-3 text-sm">
                              <div className="flex items-center gap-1.5 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="font-semibold">
                                  {new Date(p.fecha_completado).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'short'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className={`text-4xl font-black ${
                          p.porcentaje_aciertos >= 80
                            ? 'text-green-600'
                            : p.porcentaje_aciertos >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                          {p.porcentaje_aciertos}%
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* ==================== CTA FINAL ==================== */}
            <div className="relative bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 rounded-[2rem] shadow-2xl p-12 text-white text-center overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
              
              <div className="relative z-10">
                <Sparkles className="w-20 h-20 mx-auto mb-6 animate-pulse drop-shadow-lg" />
                <h3 className="text-4xl font-black mb-4">¡Sigue Aprendiendo!</h3>
                <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8">
                  Cada día de práctica te acerca más a dominar las lenguas andinas. ¡Tú puedes!
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-white text-purple-600 font-black text-xl rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
                >
                  Continuar Mi Viaje
                  <ArrowRight className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Profile;