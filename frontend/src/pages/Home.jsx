import { Link, useNavigate } from 'react-router-dom';
import { Mountain, Heart, BookOpen, Globe, Trophy, Zap, Target, CheckCircle, ArrowRight, Play, Shield, UserX, Github, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { API_URL } from '../config';
import logo from '../assets/logo.jpg';
import fotoTiticaca from '../assets/fotos/titicaca-amanecer.jpg';
import fotoPuno from '../assets/fotos/puno-titicaca.jpg';
import fotoTari from '../assets/fotos/tari-aymara.jpg';
import fotoSikuris from '../assets/fotos/sikuris-puno.jpg';
import fotoPapas from '../assets/fotos/papas-nativas.jpg';
import fotoLlamas from '../assets/fotos/llamas-litografia.jpg';
import videoLago from '../assets/video/titicaca-timelapse.webm';
import posterLago from '../assets/video/titicaca-timelapse.jpg';

// Paleta con significado (ver PRODUCT.md):
// - verde = quechua y acción principal, azul lago = aymara, terracota = probar sin cuenta
// - neutros cálidos (stone) para todo lo demás

const LANGUAGES = {
  quechua: {
    label: 'Quechua',
    region: 'Cusco - Puno (Collao)',
    Icon: Globe,
    description:
      'La lengua del Tahuantinsuyo, hablada hoy por millones de personas en los Andes. SimiAru enseña la variedad Cusco-Collao, la que se habla en Puno.',
    facts: ['6 unidades temáticas', '13 lecciones interactivas', 'Voz sintetizada', '31 textos culturales'],
    units: [
      ['Saludos y presentaciones', 'Rimaykullayki (hola)'],
      ['La familia', 'Tayta, Mama, Wawqiy, Ñaña'],
      ['Números del 1 al 20', 'Huk, Iskay, Kimsa...'],
      ['Colores, animales y comidas', 'Puka, Kuntur, Sara'],
    ],
    tabOn: 'bg-green-700 border-green-700 text-white',
    panel: 'bg-green-800',
    soft: 'text-green-100',
    secondaryBtn: 'bg-green-700 hover:bg-green-600',
    primaryText: 'text-green-800',
    dot: 'bg-green-100 text-green-800',
  },
  aymara: {
    label: 'Aymara',
    region: 'Altiplano puneño',
    Icon: Mountain,
    description:
      'La lengua del lago Titicaca, hablada por alrededor de 2 millones de personas en Perú, Bolivia y Chile. SimiAru enseña el aymara central.',
    facts: ['6 unidades temáticas', '13 lecciones interactivas', 'Voz sintetizada', '38 textos culturales'],
    units: [
      ['Saludos y presentaciones', 'Kamisaraki (¿cómo estás?)'],
      ['La familia', 'Awki, Tayka, Jilata, Kullaka'],
      ['Números del 1 al 10', 'Maya, Paya, Kimsa...'],
      ['Colores, animales y comidas', "Qarwa, Kunturi, Ch'uqi"],
    ],
    tabOn: 'bg-blue-800 border-blue-800 text-white',
    panel: 'bg-blue-900',
    soft: 'text-blue-100',
    secondaryBtn: 'bg-blue-800 hover:bg-blue-700',
    primaryText: 'text-blue-900',
    dot: 'bg-blue-100 text-blue-900',
  },
};

const STEPS = [
  ['Elige tu idioma', 'Comienza con Quechua o Aymara, con vocabulario y contenido cultural de fuentes documentadas'],
  ['Practica diariamente', 'Unos minutos al día bastan para mantener tu racha, ganar puntos y avanzar de lección'],
  ['Conecta con la cultura', 'Suma vocabulario mientras lees cuentos, proverbios, adivinanzas y canciones'],
];

const HIGHLIGHTS = [
  [CheckCircle, 'Progreso guardado', 'Retoma donde lo dejaste'],
  [Zap, 'Lecciones cortas', 'Vocabulario por temas cotidianos'],
  [Heart, 'Contenido cultural', 'Cuentos, proverbios y canciones'],
  [UserX, 'Sin cuenta', 'Prueba la Unidad 1 sin registrarte'],
];

const FEATURES = [
  [BookOpen, 'Lecciones interactivas', 'Ejercicios con voz sintetizada y corrección al instante', '26 lecciones disponibles'],
  [Heart, 'Cultura viva', 'Cuentos, proverbios, adivinanzas y canciones en quechua y aymara, con su traducción', '69 contenidos culturales'],
  [Trophy, 'Rachas e insignias', 'Gana Ayni Points por cada lección, mantén tu racha diaria y desbloquea insignias', '7 insignias desbloqueables'],
  [Target, 'Tu progreso, guardado', 'Cada lección registra tus aciertos para que veas tu avance y retomes donde lo dejaste', 'Progreso por lección'],
  [Shield, 'Sin publicidad', 'Aprende sin anuncios ni interrupciones', 'Gratis y de código abierto'],
];

const PROJECT_STATS = [
  ['26', 'Lecciones'],
  ['1,500+', 'Palabras en el diccionario'],
  ['285', 'Ejercicios'],
  ['69', 'Contenidos culturales'],
];

const NAV_LINKS = [
  ['#how-it-works', 'Cómo funciona'],
  ['#features', 'Qué incluye'],
  ['#languages', 'Idiomas'],
  ['#proyecto', 'El proyecto'],
];

const REPO = 'https://github.com/FLOR345/simiaru';

// Fotos y video de Wikimedia Commons (créditos en el pie de página)
const FOTOS_CULTURA = [
  [fotoSikuris, 'Sikuris con zampoñas y bombo bailando en una fiesta de Puno', 'Sikuris en Puno', 1100, 875, '-rotate-3'],
  [fotoTari, 'Tari, una bolsa tejida aymara, junto a una laguna de altura', 'Tari aymara', 900, 1599, 'rotate-2'],
  [fotoLlamas, 'Litografía de 1853: llamas cargadas cruzando los Andes', 'Llamas en los Andes, 1853', 1260, 640, '-rotate-1'],
];

// ==================== LA PALABRA VIVA ====================
// Palabras de ejemplo: se muestran al instante, sin esperar al servidor
const EJEMPLOS = {
  agua: ['yaku', 'uma'],
  sol: ['inti', 'inti'],
  casa: ['wasi', 'uta'],
  lago: ['qucha', 'quta'],
  palabra: ['simi', 'aru'],
  papa: ['papa', "ch'uqi"],
};

// Quita tildes y mayúsculas para comparar lo escrito con el diccionario (conserva la ñ)
const normalizar = (texto) =>
  String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/(?!̃)[̀-ͯ]/g, '')
    .normalize('NFC')
    .trim();

// De todas las coincidencias, la palabra exacta primero; si no, la que empieza igual
const elegirTraduccion = (palabras, termino) => {
  if (!Array.isArray(palabras) || palabras.length === 0) return null;
  const t = normalizar(termino);
  const exacta = palabras.find((p) => normalizar(p.palabra_espanol) === t);
  const empieza = palabras.find((p) => normalizar(p.palabra_espanol).startsWith(t));
  return (exacta || empieza || palabras[0]).palabra_objetivo || null;
};

const PalabraViva = () => {
  const [palabra, setPalabra] = useState('agua');
  const [resultado, setResultado] = useState({ estado: 'listo', quechua: 'yaku', aymara: 'uma' });
  const consulta = useRef(0);

  useEffect(() => {
    const termino = normalizar(palabra);
    const id = ++consulta.current;

    if (EJEMPLOS[termino]) {
      const [quechua, aymara] = EJEMPLOS[termino];
      setResultado({ estado: 'listo', quechua, aymara });
      return undefined;
    }
    if (termino.length < 2) {
      setResultado({ estado: 'vacio' });
      return undefined;
    }

    setResultado((previo) => ({ ...previo, estado: 'buscando' }));
    // El servidor gratuito se duerme: si tarda más de 10 s, se avisa en vez de dejar esperando
    const corte = new AbortController();
    let limite;
    const espera = setTimeout(async () => {
      limite = setTimeout(() => corte.abort(), 10000);
      try {
        const buscar = async (idioma) => {
          const url = `${API_URL}/api/dictionary/search?query=${encodeURIComponent(termino)}&idioma=${idioma}`;
          const respuesta = await fetch(url, { signal: corte.signal });
          if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
          const datos = await respuesta.json();
          return elegirTraduccion(datos.words, termino);
        };
        const [quechua, aymara] = await Promise.all([buscar('quechua'), buscar('aymara')]);
        if (id !== consulta.current) return;
        setResultado(quechua || aymara ? { estado: 'listo', quechua, aymara } : { estado: 'sin-resultado' });
      } catch {
        if (id === consulta.current) setResultado({ estado: 'error' });
      } finally {
        clearTimeout(limite);
      }
    }, 300);

    return () => {
      clearTimeout(espera);
      clearTimeout(limite);
      corte.abort();
    };
  }, [palabra]);

  const sinDato = <span className="text-stone-500 font-semibold">(aún no está)</span>;

  return (
    <div className="max-w-4xl mx-auto bg-stone-50 border border-stone-200 rounded-3xl p-6 sm:p-12 text-center">
      <p className="text-2xl sm:text-4xl font-bold leading-snug">
        <label htmlFor="palabra-viva" className="sr-only">
          Escribe una palabra en castellano
        </label>
        <input
          id="palabra-viva"
          type="text"
          value={palabra}
          maxLength={24}
          autoComplete="off"
          spellCheck="false"
          onChange={(e) => setPalabra(e.target.value)}
          style={{ width: `${Math.max(palabra.length, 3) + 1.5}ch` }}
          className="max-w-full px-2 text-center font-extrabold text-stone-900 bg-white border-b-4 border-green-700 rounded-t-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-green-200"
        />{' '}
        <span aria-live="polite" aria-atomic="true">
          {resultado.estado === 'listo' && (
            <>
              en quechua es{' '}
              <strong lang="qu" className="text-green-700">{resultado.quechua || sinDato}</strong>; en aymara,{' '}
              <strong lang="ay" className="text-blue-800">{resultado.aymara || sinDato}</strong>.
            </>
          )}
          {resultado.estado === 'buscando' && <span className="text-stone-500">lo busco en el diccionario…</span>}
          {resultado.estado === 'vacio' && <span className="text-stone-500">escribe una palabra en castellano.</span>}
          {resultado.estado === 'sin-resultado' && (
            <span className="text-stone-500">no está en el diccionario todavía. Prueba otra.</span>
          )}
          {resultado.estado === 'error' && (
            <span className="text-stone-500 text-xl sm:text-2xl">
              no pude consultar el diccionario; el servidor puede tardar en despertar. Prueba de nuevo en un momento.
            </span>
          )}
        </span>
      </p>

      <div className="mt-8 flex flex-wrap justify-center items-center gap-2">
        <span className="text-stone-600 font-semibold mr-1">Prueba con:</span>
        {Object.keys(EJEMPLOS).map((ejemplo) => (
          <button
            key={ejemplo}
            type="button"
            onClick={() => setPalabra(ejemplo)}
            className={`toque min-h-11 px-4 rounded-full border-2 font-semibold ${
              normalizar(palabra) === ejemplo
                ? 'bg-green-700 border-green-700 text-white'
                : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
            }`}
          >
            {ejemplo}
          </button>
        ))}
      </div>
      <p className="mt-6 text-sm text-stone-600">
        Las traducciones salen del diccionario de SimiAru, con más de 1,500 palabras.
      </p>
    </div>
  );
};

// Time-lapse del Titicaca en miniatura, dentro de la frase. Con movimiento reducido queda quieto.
const MiniaturaLago = ({ className }) => {
  const video = useRef(null);

  useEffect(() => {
    const consulta = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const aplicar = () => {
      const el = video.current;
      if (!el) return;
      if (consulta?.matches) el.pause();
      else el.play?.().catch(() => {});
    };
    aplicar();
    consulta?.addEventListener?.('change', aplicar);
    return () => consulta?.removeEventListener?.('change', aplicar);
  }, []);

  return (
    <video
      ref={video}
      className={className}
      src={videoLago}
      poster={posterLago}
      width="854"
      height="480"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
};

// Miniatura en línea con el texto, pegada a su palabra para que nunca abra una línea
const miniatura = 'inline-block h-[0.95em] w-[1.5em] mx-1 align-[-0.15em] object-cover rounded-md';

const Home = ({ enableGuestMode }) => {
  const [activeTab, setActiveTab] = useState('quechua');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  // El borde del encabezado aparece solo cuando hay contenido pasando por debajo
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // ¿Dónde estoy? El menú marca la sección que ocupa el centro de la pantalla
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // El menú de celular se cierra con Escape, al tocar fuera del encabezado
  // y si la ventana crece hasta mostrar el menú de escritorio
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    const onPointerDown = (e) => {
      if (!headerRef.current?.contains(e.target)) setMenuOpen(false);
    };
    const desktop = window.matchMedia('(min-width: 1280px)');
    const onDesktop = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointerDown);
    desktop.addEventListener?.('change', onDesktop);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointerDown);
      desktop.removeEventListener?.('change', onDesktop);
    };
  }, [menuOpen]);

  // Entrar como invitado: avisa a App (estado) y lo recuerda para la próxima visita
  const handleGuestMode = () => {
    enableGuestMode?.();
    try {
      localStorage.setItem('isGuest', 'true');
    } catch {
      // Navegación privada o almacenamiento bloqueado: el modo invitado dura solo esta visita
    }
    navigate('/dashboard');
  };

  // Pestañas de idioma: flechas izquierda/derecha cambian de pestaña (patrón ARIA tabs)
  const languageKeys = Object.keys(LANGUAGES);
  const handleTabKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const next = languageKeys[(languageKeys.indexOf(activeTab) + 1) % languageKeys.length];
    setActiveTab(next);
    document.getElementById(`tab-${next}`)?.focus();
  };

  const footerLink = 'inline-flex items-center min-h-11 text-stone-400 hover:text-white transition-colors';

  return (
    <div className="min-h-screen bg-white text-stone-900 overflow-hidden">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-3 focus:bg-white focus:text-stone-900 focus:font-bold focus:rounded-lg focus:shadow-lg"
      >
        Saltar al contenido
      </a>

      {/* ==================== ENCABEZADO ==================== */}
      {/* Material translúcido: el contenido pasa por debajo; el borde aparece solo cuando hay contenido detrás */}
      <header ref={headerRef} data-scrolled={scrolled} className="material-cabecera fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="" width="253" height="299" className="h-10 sm:h-12 w-auto" />
              <span className="text-xl sm:text-2xl font-extrabold text-green-800">SimiAru</span>
            </Link>

            <nav className="hidden xl:flex items-center gap-8 whitespace-nowrap">
              {NAV_LINKS.map(([href, label]) => {
                const current = activeSection === href.slice(1);
                return (
                  <a
                    key={href}
                    href={href}
                    aria-current={current ? 'location' : undefined}
                    className={`enlace-seccion font-semibold transition-colors ${
                      current ? 'text-green-800' : 'text-stone-700 hover:text-green-800'
                    }`}
                  >
                    {label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* En escritorio: invitado e inicio de sesión a la vista; en celular y tablet van en el menú */}
              <button
                type="button"
                onClick={handleGuestMode}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 whitespace-nowrap text-stone-700 font-semibold hover:text-orange-800 hover:bg-orange-50 rounded-full toque"
              >
                <UserX className="w-4 h-4" />
                Probar sin cuenta
              </button>
              <Link
                to="/login"
                className="hidden lg:block px-6 py-2.5 whitespace-nowrap text-stone-700 font-bold hover:text-green-800 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="min-h-11 px-4 py-2.5 text-sm sm:px-7 sm:py-3 sm:text-base whitespace-nowrap bg-green-700 hover:bg-green-800 text-white font-bold rounded-full toque flex items-center gap-2"
              >
                Empezar gratis
                <ArrowRight className="hidden sm:block w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-controls="menu-movil"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                className="xl:hidden w-11 h-11 flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 toque"
              >
                {/* key: el ícono nuevo entra con un cambio corto en vez de saltar */}
                {menuOpen ? (
                  <X key="cerrar" className="icono-cambio w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu key="abrir" className="icono-cambio w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Menú de celular y tablet */}
          {menuOpen && (
            <nav id="menu-movil" aria-label="Menú" className="menu-entrada xl:hidden mt-3 pt-2 pb-2 border-t border-stone-900/10">
              <ul>
                {NAV_LINKS.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={activeSection === href.slice(1) ? 'location' : undefined}
                      className={`toque flex items-center min-h-12 px-2 font-semibold rounded-lg ${
                        activeSection === href.slice(1) ? 'text-green-800 bg-green-50' : 'text-stone-800 hover:bg-stone-50'
                      }`}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleGuestMode}
                  className="toque min-h-12 px-3 flex items-center justify-center gap-2 border-2 border-orange-700 text-orange-800 text-sm font-bold whitespace-nowrap rounded-xl"
                >
                  <UserX className="w-4 h-4" />
                  Probar sin cuenta
                </button>
                <Link
                  to="/login"
                  className="toque min-h-12 px-3 flex items-center justify-center border-2 border-stone-300 text-stone-800 text-sm font-bold whitespace-nowrap rounded-xl"
                >
                  Iniciar sesión
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <main id="contenido">
        {/* ==================== INICIO ==================== */}
        <section className="relative pt-32 pb-24 bg-stone-50">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <p className="inline-flex items-center px-4 py-2 border border-stone-300 rounded-full text-sm font-semibold text-stone-700">
                  Gratis • Sin publicidad • Código abierto
                </p>

                <div className="space-y-5">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                    Aprende
                    <br />
                    <span className="lengua-subrayado text-green-700">Quechua</span> y <span className="lengua-subrayado lengua-segunda text-blue-800">Aymara</span>
                  </h1>
                  <p className="text-xl sm:text-2xl text-stone-600 leading-relaxed max-w-xl">
                    Lecciones cortas, un diccionario y textos culturales para empezar a aprender las lenguas del altiplano
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/register"
                    className="group px-9 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-2xl toque text-center text-lg flex items-center justify-center gap-3"
                  >
                    Empezar gratis
                    <ArrowRight className="w-6 h-6 motion-safe:group-hover:translate-x-1 transition-transform duration-200 ease-out" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleGuestMode}
                    className="px-9 py-4 bg-white border-2 border-orange-700 text-orange-800 font-bold rounded-2xl hover:bg-orange-50 toque text-center text-lg flex items-center justify-center gap-3"
                  >
                    <UserX className="w-6 h-6" />
                    Probar sin cuenta
                  </button>
                </div>

                <p className="flex items-center gap-2 text-sm text-stone-600">
                  <CheckCircle className="w-4 h-4 text-orange-700 shrink-0" />
                  El modo invitado te permite explorar la Unidad 1 sin crear una cuenta
                </p>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-stone-200">
                  {[['100%', 'Gratis'], ['2', 'Idiomas'], ['26', 'Lecciones']].map(([value, label]) => (
                    <div key={label}>
                      <div className="text-2xl min-[375px]:text-3xl sm:text-4xl font-extrabold text-stone-900 mb-1">{value}</div>
                      <div className="text-sm text-stone-600 font-semibold">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Foto del Titicaca con la mascota encima */}
              <div className="relative pb-10 lg:pb-0">
                <figure className="foto-entrada rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-[4/3] lg:aspect-[4/5]">
                  <img
                    src={fotoTiticaca}
                    alt="Amanecer sobre el lago Titicaca, con los totorales de Puno en sombra"
                    width="1920"
                    height="929"
                    fetchpriority="high"
                    className="w-full h-full object-cover"
                  />
                </figure>
                <div className="absolute -bottom-2 left-4 sm:left-6 lg:-left-8 lg:bottom-8 bg-white rounded-3xl border border-stone-200 p-3 sm:p-4 shadow-xl">
                  <img
                    src={logo}
                    alt="Mascota de SimiAru: una llama con chullo y chalina andina"
                    width="253"
                    height="299"
                    className="w-24 sm:w-32 h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== LA PALABRA VIVA ==================== */}
        <section id="palabra" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Prueba una <span className="text-green-700">palabra</span>
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto leading-relaxed">
                Aprende las palabras del{' '}
                <span className="whitespace-nowrap">lago<MiniaturaLago className={miniatura} />,</span> del{' '}
                <span className="whitespace-nowrap">tejido<img className={miniatura} src={fotoTari} alt="" width="900" height="1599" loading="lazy" />,</span> de la{' '}
                <span className="whitespace-nowrap">chacra<img className={miniatura} src={fotoPapas} alt="" width="1300" height="747" loading="lazy" /></span> y de la{' '}
                <span className="whitespace-nowrap">fiesta<img className={miniatura} src={fotoSikuris} alt="" width="1100" height="875" loading="lazy" />,</span> en quechua y en aymara
              </p>
            </div>
            <PalabraViva />
          </div>
        </section>

        {/* ==================== CÓMO FUNCIONA ==================== */}
        <section id="how-it-works" className="py-24 bg-stone-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Aprende en <span className="text-green-700">3 pasos</span>
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">Tu viaje hacia las lenguas andinas comienza aquí</p>
            </div>

            <ol className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="text-center">
                  <div className="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                    {i + 1}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{title}</h3>
                  <p className="text-stone-600 leading-relaxed">{text}</p>
                </li>
              ))}
            </ol>

            <ul className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {HIGHLIGHTS.map(([Icon, title, text]) => (
                <li key={title} className="flex items-start gap-3">
                  <Icon className="w-6 h-6 text-green-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold mb-1">{title}</h3>
                    <p className="text-sm text-stone-600">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ==================== QUÉ INCLUYE ==================== */}
        <section id="features" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Qué incluye <span className="text-green-700">SimiAru</span>
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                Vocabulario, ejercicios y cultura del altiplano en un solo lugar, gratis y sin publicidad
              </p>
            </div>

            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(([Icon, title, text, tag]) => (
                <li key={title} className="bg-stone-50 rounded-2xl p-7 border border-stone-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-6 h-6 text-green-700 shrink-0" aria-hidden="true" />
                    <h3 className="text-xl font-bold">{title}</h3>
                  </div>
                  <p className="text-stone-700 leading-relaxed mb-4">{text}</p>
                  <p className="flex items-center gap-2 text-green-800 font-semibold text-sm">
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    {tag}
                  </p>
                </li>
              ))}

              <li className="bg-stone-50 rounded-2xl p-7 border-2 border-orange-700">
                <div className="flex items-center gap-3 mb-3">
                  <UserX className="w-6 h-6 text-orange-700 shrink-0" aria-hidden="true" />
                  <h3 className="text-xl font-bold">Prueba sin cuenta</h3>
                </div>
                <p className="text-stone-700 leading-relaxed mb-4">
                  Explora la Unidad 1 sin crear una cuenta. Para guardar tu progreso, regístrate gratis
                </p>
                <button
                  type="button"
                  onClick={handleGuestMode}
                  className="toque min-h-11 flex items-center gap-2 text-orange-800 font-bold text-sm hover:text-orange-900"
                >
                  <Play className="w-5 h-5" />
                  <span>Probar sin cuenta <span aria-hidden="true">→</span></span>
                </button>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== IDIOMAS ==================== */}
        <section id="languages" className="py-24 bg-stone-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">Elige tu idioma</h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">Dos lenguas del altiplano, cada una con 6 unidades y 13 lecciones</p>
            </div>

            <figure className="max-w-5xl mx-auto mb-12">
              <div className="rounded-3xl overflow-hidden aspect-[16/9] sm:aspect-[21/9]">
                <img
                  src={fotoPuno}
                  alt="Puno desde un cerro: casas de ladrillo hasta la orilla del lago Titicaca y los cerros al fondo"
                  width="1600"
                  height="642"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>
              <figcaption className="mt-4 text-center text-stone-600">
                <strong className="text-stone-900">Dos lenguas, un mismo lago.</strong> En Puno, el quechua y el aymara
                conviven en la misma calle, a veces en la misma familia.
              </figcaption>
            </figure>

            <div className="flex justify-center gap-4 mb-10" role="tablist" aria-label="Idioma">
              {languageKeys.map((key) => {
                const selected = activeTab === key;
                return (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    id={`tab-${key}`}
                    aria-selected={selected}
                    aria-controls={`panel-${key}`}
                    tabIndex={selected ? 0 : -1}
                    onKeyDown={handleTabKey}
                    onClick={() => setActiveTab(key)}
                    className={`px-8 py-3.5 rounded-2xl font-bold text-lg border-2 toque ${
                      selected ? LANGUAGES[key].tabOn : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    {LANGUAGES[key].label}
                  </button>
                );
              })}
            </div>

            {languageKeys.map((key) => {
              const lang = LANGUAGES[key];
              const { Icon } = lang;
              return (
                <div
                  key={key}
                  id={`panel-${key}`}
                  role="tabpanel"
                  aria-labelledby={`tab-${key}`}
                  hidden={activeTab !== key}
                  className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-stone-200"
                >
                  <div className="grid md:grid-cols-2">
                    <div className={`${lang.panel} p-8 sm:p-12 text-white`}>
                      <div className="flex items-center gap-4 mb-8">
                        <Icon className="w-14 h-14" aria-hidden="true" />
                        <div>
                          <h3 className="text-4xl font-bold">{lang.label}</h3>
                          <p className={`${lang.soft} text-lg`}>{lang.region}</p>
                        </div>
                      </div>
                      <p className={`text-xl ${lang.soft} mb-8 leading-relaxed`}>{lang.description}</p>
                      <ul className="space-y-4">
                        {lang.facts.map((fact) => (
                          <li key={fact} className="flex items-center gap-3">
                            <CheckCircle className="w-6 h-6" aria-hidden="true" />
                            <span className="text-lg">{fact}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-3 mt-8">
                        <Link to="/register" className={`px-6 py-3 bg-white ${lang.primaryText} font-bold rounded-xl hover:bg-stone-100 toque`}>
                          Empezar <span aria-hidden="true">→</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleGuestMode}
                          className={`px-6 py-3 ${lang.secondaryBtn} text-white font-bold rounded-xl toque flex items-center gap-2`}
                        >
                          <UserX className="w-4 h-4" />
                          Probar
                        </button>
                      </div>
                    </div>
                    <div className="p-8 sm:p-12 bg-white">
                      <h4 className="text-2xl font-bold mb-6">Lo que aprenderás</h4>
                      <ol className="space-y-5">
                        {lang.units.map(([title, examples], i) => (
                          <li key={title} className="flex items-start gap-3">
                            <span className={`w-8 h-8 rounded-full ${lang.dot} flex items-center justify-center shrink-0 font-bold`}>{i + 1}</span>
                            <div>
                              <h5 className="font-bold">{title}</h5>
                              <p className="text-stone-600 text-sm">{examples}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================== CULTURA VIVA ==================== */}
        <section id="cultura" className="py-24 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Cultura <span className="text-green-700">viva</span>
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                69 cuentos, proverbios, adivinanzas y canciones, en quechua y en aymara, cada uno con su traducción
              </p>
            </div>

            <ul className="grid sm:grid-cols-3 gap-10 sm:gap-6 max-w-5xl mx-auto items-center">
              {FOTOS_CULTURA.map(([src, alt, caption, width, height, giro]) => (
                <li key={caption}>
                  <figure className={`copia ${giro} bg-white p-3 pb-4 rounded-xl border border-stone-200 shadow-lg`}>
                    <div className="aspect-[4/3] overflow-hidden rounded-lg">
                      <img src={src} alt={alt} width={width} height={height} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                    <figcaption className="mt-3 text-center font-semibold text-stone-700">{caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ==================== EL PROYECTO ==================== */}
        <section id="proyecto" className="py-24 bg-stone-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Una herramienta <span className="text-green-700">abierta</span> para lenguas originarias
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                SimiAru es un proyecto gratuito y de código abierto para aprender quechua y aymara. Su contenido sigue creciendo y cualquier persona puede revisar y mejorar el código.
              </p>
            </div>

            <ul className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
              {PROJECT_STATS.map(([value, label]) => (
                <li key={label}>
                  <div className="text-4xl sm:text-5xl font-extrabold text-stone-900 mb-2">{value}</div>
                  <div className="text-stone-600 font-semibold">{label}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ==================== LLAMADA FINAL ==================== */}
        <section className="py-24 bg-green-800">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
                Empieza con la <span className="text-green-200">Unidad 1</span>
              </h2>
              <p className="text-xl md:text-2xl text-green-50 leading-relaxed">
                Crea tu cuenta para guardar tu progreso, o pruébala sin registrarte
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link
                  to="/register"
                  className="px-10 py-5 bg-white text-green-800 font-bold rounded-2xl hover:bg-green-50 toque text-xl"
                >
                  Empezar gratis
                </Link>
                <button
                  type="button"
                  onClick={handleGuestMode}
                  className="px-10 py-5 border-2 border-white text-white font-bold rounded-2xl hover:bg-green-700 toque text-xl flex items-center gap-3"
                >
                  <UserX className="w-6 h-6" />
                  Probar sin cuenta
                </button>
              </div>
              <ul className="text-green-50 text-sm pt-2 space-y-2">
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-200" aria-hidden="true" />
                  <span className="font-semibold">Gratis y sin publicidad</span>
                </li>
                <li className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-200" aria-hidden="true" />
                  <span className="font-semibold">Sin cuenta, explora la Unidad 1 completa</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== PIE DE PÁGINA ==================== */}
      <footer className="bg-stone-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img src={logo} alt="" width="253" height="299" loading="lazy" decoding="async" className="h-12 w-auto rounded-lg" />
                <span className="text-2xl font-extrabold">SimiAru</span>
              </div>
              <p className="text-stone-400 leading-relaxed">
                Preservando y difundiendo las lenguas ancestrales de los Andes para las futuras generaciones.
              </p>
              <a
                href={REPO}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Código de SimiAru en GitHub (se abre en otra pestaña)"
                className="inline-flex w-11 h-11 bg-stone-800 hover:bg-stone-700 rounded-full items-center justify-center toque"
              >
                <Github className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>

            <nav aria-label="Aprende">
              <h2 className="text-lg font-bold mb-2">Aprende</h2>
              <ul>
                <li><a href="#languages" className={footerLink}>Quechua y aymara</a></li>
                <li><a href="#how-it-works" className={footerLink}>Cómo funciona</a></li>
                <li><Link to="/dictionary" className={footerLink}>Diccionario</Link></li>
                <li>
                  <button type="button" onClick={handleGuestMode} className={footerLink}>
                    Probar sin cuenta
                  </button>
                </li>
              </ul>
            </nav>

            <nav aria-label="Proyecto">
              <h2 className="text-lg font-bold mb-2">Proyecto</h2>
              <ul>
                <li><a href="#proyecto" className={footerLink}>Sobre SimiAru</a></li>
                <li><a href={REPO} target="_blank" rel="noopener noreferrer" className={footerLink}>Código en GitHub</a></li>
                <li><a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer" className={footerLink}>Reportar un problema</a></li>
                <li><a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className={footerLink}>Licencia MIT</a></li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-stone-400 text-sm">© 2026 SimiAru</p>
            <p className="text-stone-400 text-sm">Hecho para preservar lenguas ancestrales</p>
          </div>

          <p className="mt-8 text-stone-400 text-sm leading-relaxed max-w-4xl [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-white">
            Fotos y video de Wikimedia Commons, recortados para esta página:{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Amanecer_en_el_lago_Titicaca,_Puno,_Per%C3%BA,_2015-08-01,_DD_01.JPG">amanecer en el Titicaca</a> y{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Vista_de_Puno_y_el_Titicaca,_Per%C3%BA,_2015-08-01,_DD_53-54_PAN.JPG">vista de Puno</a>, de Diego Delso;{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Tari_textil_Aymara.jpg">tari aymara</a>, de Jhulis (las tres{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Types_of_Potatoes_in_Peru.jpg">papas nativas</a>, de Cathetovar (
            <a href="https://creativecommons.org/licenses/by/4.0">CC BY 4.0</a>);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Sikuris,_Puno-Peru.jpg">sikuris de Puno</a> (CC0);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Llamas_traversing_the_Andes_laden_with_silver_Titicaca_balsa_off_Puno_-_-_sketched_by_L._Gibbon_;_JQ_;_lith._of_P.S._Duval_%26_Co._Philada._LCCN2014649307.tif">litografía de L. Gibbon, 1853</a> (dominio público) y{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Lake_Titicaca_time-lapse.webm">time-lapse del Titicaca</a>, de Jemma Saunders (
            <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>).
          </p>
        </div>
      </footer>

      <style>{`
        html {
          scroll-behavior: smooth;
        }
        p {
          text-wrap: pretty;
        }
        h1, h2, h3 {
          text-wrap: balance;
        }
        /* Momento propio: una línea "tejida" bajo cada lengua, en su color */
        .lengua-subrayado {
          position: relative;
          display: inline-block;
        }
        .lengua-subrayado::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -0.04em;
          height: 0.09em;
          border-radius: 999px;
          background: currentColor;
          opacity: 0.35;
          animation: tejido 700ms cubic-bezier(0.16, 1, 0.3, 1) 150ms both;
        }
        .lengua-segunda::after {
          animation-delay: 330ms;
        }
        @keyframes tejido {
          from { clip-path: inset(0 100% 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        /* El cambio de pestaña es instantáneo: también se hace con las flechas del teclado */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        /* Encabezado como material translúcido (Apple): el contenido se ve pasar por debajo */
        .material-cabecera {
          background: rgba(255, 255, 255, 0.72);
          -webkit-backdrop-filter: saturate(180%) blur(20px);
          backdrop-filter: saturate(180%) blur(20px);
          box-shadow: 0 1px 0 rgba(28, 25, 23, 0);
          transition: box-shadow 200ms ease, background-color 200ms ease;
        }
        /* Borde de desplazamiento: solo cuando hay contenido detrás */
        .material-cabecera[data-scrolled='true'] {
          box-shadow: 0 1px 0 rgba(28, 25, 23, 0.08), 0 10px 24px -18px rgba(28, 25, 23, 0.35);
        }
        /* Navegadores sin desenfoque: fondo casi sólido para que el texto siga legible */
        @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
          .material-cabecera {
            background: rgba(255, 255, 255, 0.97);
          }
        }
        @media (prefers-reduced-transparency: reduce) {
          .material-cabecera {
            background: #fff;
            -webkit-backdrop-filter: none;
            backdrop-filter: none;
          }
        }
        @media (prefers-contrast: more) {
          .material-cabecera {
            background: #fff;
            -webkit-backdrop-filter: none;
            backdrop-filter: none;
            box-shadow: 0 1px 0 #44403c;
          }
        }
        /* Dónde estoy: una línea corta bajo la sección actual del menú */
        .enlace-seccion {
          position: relative;
          display: inline-flex;
          align-items: center;
          min-height: 44px;
        }
        .enlace-seccion::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 6px;
          height: 2px;
          border-radius: 999px;
          background: currentColor;
          transform: scaleX(0);
          transition: transform 250ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        .enlace-seccion[aria-current]::after {
          transform: scaleX(1);
        }
        /* Menú del celular: baja desde el encabezado y se materializa (desenfoque + posición) */
        @keyframes menu-entrada {
          from { opacity: 0; transform: translateY(-8px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .menu-entrada {
          transform-origin: top;
          animation: menu-entrada 180ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        /* Foto de inicio: se abre de abajo hacia arriba una sola vez, al cargar */
        @keyframes foto-entrada {
          from { clip-path: inset(100% 0 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        .foto-entrada {
          animation: foto-entrada 900ms cubic-bezier(0.77, 0, 0.175, 1) 100ms both;
        }
        /* Fotos de cultura: con mouse, la copia se endereza y sube un poco */
        .copia {
          transition: transform 200ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        @media (hover: hover) and (pointer: fine) {
          .copia:hover {
            transform: rotate(0deg) translateY(-4px);
          }
        }
        /* Ícono de menú / cerrar: entra un poco más pequeño, nunca desde cero */
        @keyframes icono-cambio {
          from { opacity: 0; transform: scale(0.9) rotate(-45deg); }
          to { opacity: 1; transform: none; }
        }
        .icono-cambio {
          animation: icono-cambio 160ms cubic-bezier(0.23, 1, 0.32, 1);
        }
        /* Movimiento reducido: sin desplazamientos; se conservan color y opacidad */
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          .lengua-subrayado::after {
            animation: none;
          }
          .menu-entrada,
          .icono-cambio,
          .foto-entrada {
            animation: fade-in 150ms ease-out;
          }
          .copia {
            transition: none;
          }
          .enlace-seccion::after {
            transition: opacity 150ms ease;
          }
          .enlace-seccion:not([aria-current])::after {
            opacity: 0;
          }
        }
        /* Ajuste para el encabezado fijo */
        section {
          scroll-margin-top: 80px;
        }
      `}</style>
    </div>
  );
};

export default Home;
