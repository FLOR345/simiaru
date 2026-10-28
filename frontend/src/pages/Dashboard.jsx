import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Flame, Star, TrendingUp, BookOpen, Lock, CheckCircle, Sparkles, Award, ChevronDown, Play, UserX, AlertCircle, RefreshCw, XCircle } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.jpg';

// URL del backend
import { API_URL } from '../config.js';
import { getLevel } from '../utils/levels.js';

// Misma paleta que la portada: verde = quechua, azul lago = aymara, terracota = invitado
const LANGUAGE_STYLE = {
  quechua: {
    label: 'Quechua',
    region: 'Variedad Cusco-Collao, la de Puno',
    accent: 'text-green-700',
    selected: 'border-green-700 bg-green-50',
    badge: 'bg-green-700',
    bar: 'bg-green-700',
  },
  aymara: {
    label: 'Aymara',
    region: 'Aymara central del altiplano puneño',
    accent: 'text-blue-800',
    selected: 'border-blue-800 bg-blue-50',
    badge: 'bg-blue-800',
    bar: 'bg-blue-800',
  },
};

const Dashboard = ({ user, setUser, isGuest, setIsGuest }) => {
  const [units, setUnits] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('quechua');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  const loadData = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      // Si es invitado, solo cargar unidades sin autenticación
      if (isGuest) {
        const unitsRes = await axios.get(`${API_URL}/api/lessons/units?idioma=${selectedLanguage}`);
        setUnits(unitsRes.data.units);
        setProgress([]); // Invitados no tienen progreso
      } else {
        const token = localStorage.getItem('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        const [unitsRes, progressRes, profileRes] = await Promise.all([
          axios.get(`${API_URL}/api/lessons/units?idioma=${selectedLanguage}`),
          axios.get(`${API_URL}/api/progress`),
          // Racha, puntos y nivel actualizados (los guardados al iniciar sesión pueden estar viejos)
          axios.get(`${API_URL}/api/auth/profile`).catch(() => null),
        ]);

        setUnits(unitsRes.data.units);
        setProgress(progressRes.data.progress);
        const fresh = profileRes?.data?.user;
        // Solo se avisa a App si algo cambió (evita volver a dibujar todo sin motivo)
        if (fresh && setUser && JSON.stringify({ ...user, ...fresh }) !== JSON.stringify(user)) {
          const merged = { ...user, ...fresh };
          setUser(merged);
          try {
            localStorage.setItem('user', JSON.stringify(merged));
          } catch {
            // almacenamiento bloqueado: se usa solo en esta visita
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401 && !isGuest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isGuest');
    if (setUser) setUser(null);
    if (setIsGuest) setIsGuest(false);
    navigate('/');
  };

  const isLessonCompleted = (lessonId) => {
    if (isGuest) return false; // Invitados nunca tienen lecciones completadas
    return progress.some((p) => p.leccion_id === lessonId && p.completado);
  };

  const completedLessons = progress.filter((p) => p.completado).length;
  const totalLessons = units.reduce((acc, unit) => acc + (unit.lecciones_count || 0), 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const displayUser = isGuest ? { nombre: 'Invitado', racha_actual: 0, puntos_totales: 0, nivel_actual: 1 } : user;
  const lang = LANGUAGE_STYLE[selectedLanguage];
  const lockedUnits = Math.max(units.length - 1, 0);

  const stats = [
    {
      Icon: Flame,
      iconClass: 'text-orange-700',
      label: 'Racha',
      value: displayUser?.racha_actual || 0,
      detail: isGuest ? 'Regístrate para guardar tu racha' : 'días seguidos',
    },
    {
      Icon: Star,
      iconClass: 'text-amber-600',
      label: 'Ayni Points',
      value: displayUser?.puntos_totales || 0,
      detail: isGuest ? 'Regístrate para ganar puntos' : 'puntos ganados',
    },
    {
      Icon: TrendingUp,
      iconClass: 'text-green-700',
      label: 'Progreso',
      value: isGuest ? '—' : `${overallProgress}%`,
      detail: isGuest ? 'Regístrate para guardarlo' : `${completedLessons} de ${totalLessons} lecciones`,
    },
    {
      Icon: Award,
      iconClass: 'text-blue-800',
      label: 'Nivel',
      value: getLevel(displayUser).number,
      detail: isGuest ? 'Modo invitado' : `${getLevel(displayUser).name} (${getLevel(displayUser).subtitle.toLowerCase()})`,
    },
  ];

  const navLink = 'flex items-center gap-2 min-h-11 px-2 text-stone-700 hover:text-green-800 font-semibold rounded-lg transition-colors';

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* ==================== AVISO MODO INVITADO ==================== */}
      {isGuest && (
        <div className="bg-orange-800 text-white py-3 px-4 sm:px-6">
          <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="flex items-center gap-3 font-semibold">
              <UserX className="w-5 h-5 shrink-0" aria-hidden="true" />
              Estás en modo invitado: solo puedes acceder a la Unidad 1
            </p>
            <div className="flex items-center gap-3">
              <Link to="/register" className="px-4 py-2 min-h-11 inline-flex items-center bg-white text-orange-800 font-bold rounded-lg hover:bg-orange-50 transition-colors">
                Crear cuenta gratis
              </Link>
              <Link to="/login" className="px-4 py-2 min-h-11 inline-flex items-center border-2 border-white text-white font-bold rounded-lg hover:bg-orange-900 transition-colors">
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ==================== ENCABEZADO ==================== */}
      <header className="bg-white sticky top-0 z-50 border-b border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center gap-3">
            <Link to="/dashboard" className="flex items-center gap-3" aria-label="SimiAru, ir al panel">
              <img src={logo} alt="" width="253" height="299" className="h-10 w-auto" />
              <span className="text-2xl font-extrabold text-green-800 hidden md:block">SimiAru</span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-3" aria-label="Principal">
              <Link to="/dictionary" className={navLink} aria-label="Diccionario">
                <BookOpen className="w-5 h-5" aria-hidden="true" />
                <span className="hidden lg:inline">Diccionario</span>
              </Link>
              <Link to="/culture" className={navLink} aria-label="Cultura">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
                <span className="hidden lg:inline">Cultura</span>
              </Link>

              {!isGuest ? (
                <Link to="/profile" className={navLink} aria-label={`Tu perfil, ${displayUser?.nombre || ''}`}>
                  <span className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-bold" aria-hidden="true">
                    {displayUser?.nombre?.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden xl:inline">{displayUser?.nombre}</span>
                </Link>
              ) : (
                <span className="flex items-center gap-2 text-orange-800 font-semibold">
                  <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center" aria-hidden="true">
                    <UserX className="w-5 h-5" />
                  </span>
                  <span className="hidden xl:inline">Invitado</span>
                </span>
              )}

              <button
                type="button"
                onClick={handleLogout}
                aria-label={isGuest ? 'Salir del modo invitado' : 'Cerrar sesión'}
                title={isGuest ? 'Salir del modo invitado' : 'Cerrar sesión'}
                className="w-11 h-11 flex items-center justify-center text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
        {/* ==================== SALUDO ==================== */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            {isGuest ? '¡Bienvenido!' : `¡Rimaykullayki, ${displayUser?.nombre}!`}
          </h1>
          <p className="text-lg sm:text-xl text-stone-600">
            {isGuest
              ? 'Explora la Unidad 1 gratis. Regístrate para guardar tu progreso.'
              : completedLessons === 0
                ? 'Empieza con la primera lección de la Unidad 1.'
                : `Llevas ${completedLessons} ${completedLessons === 1 ? 'lección completada' : 'lecciones completadas'}.`}
          </p>
        </div>

        {/* ==================== QUÉ INCLUYE EL MODO INVITADO ==================== */}
        {isGuest && (
          <section className="mb-8 bg-white border-2 border-orange-700 rounded-2xl p-6" aria-labelledby="invitado-titulo">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-orange-700 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <h2 id="invitado-titulo" className="text-lg font-bold mb-3">Qué puedes hacer como invitado</h2>
                <ul className="space-y-2 mb-5">
                  {[
                    [true, 'Explorar la Unidad 1 de quechua y de aymara'],
                    [true, 'Usar el diccionario y la sección de cultura'],
                    [false, 'Guardar tu progreso'],
                    [false, `Acceder a las otras ${lockedUnits || 5} unidades`],
                    [false, 'Ganar puntos e insignias'],
                  ].map(([ok, text]) => (
                    <li key={text} className="flex items-center gap-2 text-stone-700">
                      {ok ? (
                        <CheckCircle className="w-5 h-5 text-green-700 shrink-0" aria-label="Sí:" />
                      ) : (
                        <XCircle className="w-5 h-5 text-stone-500 shrink-0" aria-label="No:" />
                      )}
                      {text}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Link to="/register" className="px-6 min-h-11 inline-flex items-center bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition-colors">
                    Crear cuenta gratis <span aria-hidden="true">&nbsp;→</span>
                  </Link>
                  <Link to="/login" className="px-6 min-h-11 inline-flex items-center border-2 border-stone-300 text-stone-800 font-bold rounded-lg hover:bg-stone-50 transition-colors">
                    Ya tengo cuenta
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==================== ESTADÍSTICAS ==================== */}
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {stats.map(({ Icon, iconClass, label, value, detail }) => (
            <li key={label} className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`w-6 h-6 ${isGuest ? 'text-stone-400' : iconClass}`} aria-hidden="true" />
                <span className="text-sm font-bold text-stone-600">{label}</span>
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold mb-1">{value}</p>
              <p className="text-sm text-stone-600">{detail}</p>
            </li>
          ))}
        </ul>

        {/* ==================== IDIOMA ==================== */}
        <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 mb-8" aria-labelledby="idioma-titulo">
          <h2 id="idioma-titulo" className="text-2xl font-bold">Idioma</h2>
          <p className="text-stone-600 mb-6">Cambia entre quechua y aymara cuando quieras</p>

          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(LANGUAGE_STYLE).map(([key, style]) => {
              const selected = selectedLanguage === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedLanguage(key)}
                  className={`text-left p-6 rounded-2xl border-2 transition-colors ${selected ? style.selected : 'border-stone-200 bg-white hover:border-stone-400'}`}
                >
                  <span className="flex items-center justify-between mb-2">
                    <span className={`text-2xl font-bold ${style.accent}`}>{style.label}</span>
                    {selected && <CheckCircle className={`w-7 h-7 ${style.accent}`} aria-hidden="true" />}
                  </span>
                  <span className="block text-stone-600">{style.region}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================== RUTA DE APRENDIZAJE ==================== */}
        <section className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8" aria-labelledby="ruta-titulo" aria-busy={loading}>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div>
              <h2 id="ruta-titulo" className="text-2xl font-bold">Tu ruta de aprendizaje</h2>
              <p className="text-stone-600">Aprende {lang.label.toLowerCase()} paso a paso</p>
            </div>

            {!isGuest && overallProgress > 0 && (
              <div className="w-48">
                <p className="text-right text-2xl font-extrabold mb-1">{overallProgress}%</p>
                <div
                  className="w-full bg-stone-200 rounded-full h-3"
                  role="progressbar"
                  aria-label={`Progreso en ${lang.label}`}
                  aria-valuenow={overallProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div className={`${lang.bar} h-3 rounded-full transition-all duration-500`} style={{ width: `${overallProgress}%` }} />
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-16" role="status">
              <div className="w-14 h-14 mx-auto mb-6 border-4 border-stone-200 border-t-green-700 rounded-full animate-spin motion-reduce:animate-none" aria-hidden="true" />
              <p className="text-lg font-semibold text-stone-700">Cargando tus unidades…</p>
              <p className="text-sm text-stone-600 mt-1">La primera vez puede tardar hasta un minuto mientras el servidor se activa.</p>
            </div>
          ) : loadError ? (
            <div className="text-center py-16" role="alert">
              <AlertCircle className="w-12 h-12 text-red-700 mx-auto mb-4" aria-hidden="true" />
              <p className="text-lg font-semibold mb-1">No pudimos cargar tus unidades</p>
              <p className="text-stone-600 mb-6">Revisa tu conexión. Si es tu primera visita del día, el servidor puede tardar en responder.</p>
              <button
                type="button"
                onClick={loadData}
                className="inline-flex items-center gap-2 px-6 min-h-11 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                Reintentar
              </button>
            </div>
          ) : units.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-4" aria-hidden="true" />
              <p className="text-lg font-semibold">Todavía no hay unidades de {lang.label.toLowerCase()}</p>
            </div>
          ) : (
            <ol className="space-y-4">
              {units.map((unit, index) => (
                <UnitCard
                  key={unit.id}
                  unit={unit}
                  index={index}
                  isLessonCompleted={isLessonCompleted}
                  style={lang}
                  isGuest={isGuest}
                />
              ))}
            </ol>
          )}
        </section>

        {/* ==================== CIERRE ==================== */}
        {!isGuest && completedLessons > 0 && (
          <section className="mt-8 bg-green-800 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">¡Sigue así!</h2>
            <p className="text-lg text-green-50">
              Has completado {completedLessons} {completedLessons === 1 ? 'lección' : 'lecciones'}. La siguiente te espera cuando quieras.
            </p>
          </section>
        )}

        {isGuest && (
          <section className="mt-8 bg-green-800 rounded-3xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-2">¿Te gustó la experiencia?</h2>
            <p className="text-lg text-green-50 mb-6">
              Crea tu cuenta gratis para guardar tu progreso, ganar puntos y acceder a todas las unidades
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register" className="px-8 min-h-12 inline-flex items-center bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors">
                Crear cuenta gratis
              </Link>
              <Link to="/login" className="px-8 min-h-12 inline-flex items-center border-2 border-white text-white font-bold rounded-xl hover:bg-green-700 transition-colors">
                Ya tengo cuenta
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

// ==================== TARJETA DE UNIDAD ====================
const UnitCard = ({ unit, index, isLessonCompleted, style, isGuest }) => {
  const [expanded, setExpanded] = useState(false);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Los invitados solo pueden acceder a la Unidad 1 (index === 0)
  const isLockedForGuest = isGuest && index > 0;
  const panelId = `unidad-${unit.id}-lecciones`;

  const loadLessons = async () => {
    if (lessons.length > 0 || isLockedForGuest) return;
    setLoading(true);
    setError(false);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.get(`${API_URL}/api/lessons/units/${unit.id}/lessons`, { headers });
      setLessons(data.lessons);
    } catch (err) {
      console.error('Error loading lessons:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (isLockedForGuest) return;
    if (!expanded) loadLessons();
    setExpanded(!expanded);
  };

  const completedCount = lessons.filter((l) => isLessonCompleted(l.id)).length;
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  const header = (
    <>
      <span
        className={`w-14 h-14 ${isLockedForGuest ? 'bg-stone-300 text-stone-600' : `${style.badge} text-white`} rounded-2xl flex items-center justify-center font-extrabold text-2xl shrink-0`}
        aria-hidden="true"
      >
        {isLockedForGuest ? <Lock className="w-7 h-7" /> : index + 1}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-xl font-bold">
          <span className="sr-only">Unidad {index + 1}: </span>
          {unit.nombre}
        </span>
        <span className="block text-stone-600">{unit.descripcion}</span>
        {isLockedForGuest && (
          <span className="flex items-center gap-1.5 text-orange-800 text-sm font-semibold mt-2">
            <Lock className="w-4 h-4" aria-hidden="true" />
            Regístrate gratis para acceder a esta unidad
          </span>
        )}
        {!isLockedForGuest && lessons.length > 0 && (
          <span className="block mt-3">
            <span className="flex items-center justify-between text-sm font-semibold text-stone-600 mb-1.5">
              <span>
                {completedCount} de {lessons.length} completadas
              </span>
              <span>{progress}%</span>
            </span>
            <span className="block w-full bg-stone-200 rounded-full h-2" aria-hidden="true">
              <span className={`block ${style.bar} h-2 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
            </span>
          </span>
        )}
      </span>
      {!isLockedForGuest && (
        <ChevronDown
          className={`w-6 h-6 text-stone-500 shrink-0 transition-transform duration-200 motion-reduce:transition-none ${expanded ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      )}
    </>
  );

  return (
    <li className={`border-2 rounded-2xl overflow-hidden bg-white ${isLockedForGuest ? 'border-stone-200 bg-stone-50' : 'border-stone-200 hover:border-stone-300'} transition-colors`}>
      {isLockedForGuest ? (
        <div className="flex items-center gap-4 sm:gap-6 p-5 sm:p-6">{header}</div>
      ) : (
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
          className="w-full text-left flex items-center gap-4 sm:gap-6 p-5 sm:p-6"
        >
          {header}
        </button>
      )}

      {expanded && !isLockedForGuest && (
        <div id={panelId} className="border-t-2 border-stone-100 bg-stone-50 p-4 sm:p-6">
          {loading ? (
            <p className="text-center py-8 text-stone-600" role="status">
              Cargando lecciones…
            </p>
          ) : error ? (
            <div className="text-center py-6" role="alert">
              <p className="font-semibold mb-3">No pudimos cargar las lecciones.</p>
              <button
                type="button"
                onClick={loadLessons}
                className="inline-flex items-center gap-2 px-5 min-h-11 border-2 border-stone-300 font-bold rounded-lg hover:bg-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Reintentar
              </button>
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-center text-stone-600 py-8">Esta unidad todavía no tiene lecciones</p>
          ) : (
            <ol className="space-y-3">
              {lessons.map((lesson, lessonIndex) => {
                const completed = isLessonCompleted(lesson.id);
                // Los invitados pueden hacer cualquier lección de la Unidad 1; los registrados, en orden
                const locked = !isGuest && lessonIndex > 0 && !isLessonCompleted(lessons[lessonIndex - 1].id);
                const status = locked ? 'Completa la lección anterior' : completed ? 'Completada' : isGuest ? 'Probar lección' : 'Comenzar lección';
                const StatusIcon = locked ? Lock : completed ? CheckCircle : Play;

                const content = (
                  <>
                    <span
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        locked ? 'bg-stone-200 text-stone-500' : completed ? `${style.badge} text-white` : 'bg-stone-100 text-stone-700'
                      }`}
                      aria-hidden="true"
                    >
                      <StatusIcon className="w-6 h-6" />
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block font-bold text-lg">{lesson.titulo}</span>
                      <span className="block text-sm text-stone-600">{status}</span>
                    </span>
                    {!locked && !isGuest && (
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 font-bold text-sm shrink-0">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500" aria-hidden="true" />+{lesson.puntos_recompensa || 100}
                      </span>
                    )}
                  </>
                );

                return (
                  <li key={lesson.id}>
                    {locked ? (
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-stone-100 text-stone-500" aria-disabled="true">
                        {content}
                      </div>
                    ) : (
                      <Link
                        to={`/lesson/${lesson.id}`}
                        className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                          completed ? 'bg-white border-stone-200 hover:border-stone-400' : 'bg-white border-stone-200 hover:border-green-700'
                        }`}
                      >
                        {content}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </li>
  );
};

export default Dashboard;
