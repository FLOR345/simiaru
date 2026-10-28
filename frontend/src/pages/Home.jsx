import { Link, useNavigate } from 'react-router-dom';
import { Mountain, Heart, BookOpen, Globe, Trophy, Zap, Target, CheckCircle, ArrowRight, Play, Shield, UserX, Github, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.jpg';

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

const Home = ({ enableGuestMode }) => {
  const [activeTab, setActiveTab] = useState('quechua');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Escape cierra el menú de celular
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
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
      <header className="fixed top-0 w-full bg-white z-50 border-b border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center gap-3">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="" width="253" height="299" className="h-10 sm:h-12 w-auto" />
              <span className="text-xl sm:text-2xl font-extrabold text-green-800">SimiAru</span>
            </Link>

            <nav className="hidden xl:flex items-center gap-8 whitespace-nowrap">
              {NAV_LINKS.map(([href, label]) => (
                <a key={href} href={href} className="text-stone-700 hover:text-green-800 font-semibold transition-colors">
                  {label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* En escritorio: invitado e inicio de sesión a la vista; en celular y tablet van en el menú */}
              <button
                type="button"
                onClick={handleGuestMode}
                className="hidden lg:flex items-center gap-2 px-5 py-2.5 whitespace-nowrap text-stone-700 font-semibold hover:text-orange-800 hover:bg-orange-50 rounded-full transition-colors"
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
                className="min-h-11 px-4 py-2.5 text-sm sm:px-7 sm:py-3 sm:text-base whitespace-nowrap bg-green-700 hover:bg-green-800 text-white font-bold rounded-full transition-colors flex items-center gap-2"
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
                className="xl:hidden w-11 h-11 flex items-center justify-center rounded-full text-stone-700 hover:bg-stone-100 transition-colors"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Menú de celular y tablet */}
          {menuOpen && (
            <nav id="menu-movil" aria-label="Menú" className="menu-entrada xl:hidden mt-3 pt-2 pb-2 border-t border-stone-200">
              <ul>
                {NAV_LINKS.map(([href, label]) => (
                  <li key={href}>
                    <a
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center min-h-12 px-2 text-stone-800 font-semibold rounded-lg hover:bg-stone-50"
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
                  className="min-h-12 px-3 flex items-center justify-center gap-2 border-2 border-orange-700 text-orange-800 text-sm font-bold whitespace-nowrap rounded-xl"
                >
                  <UserX className="w-4 h-4" />
                  Probar sin cuenta
                </button>
                <Link
                  to="/login"
                  className="min-h-12 px-3 flex items-center justify-center border-2 border-stone-300 text-stone-800 text-sm font-bold whitespace-nowrap rounded-xl"
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
                    className="group px-9 py-4 bg-green-700 hover:bg-green-800 text-white font-bold rounded-2xl transition-colors text-center text-lg flex items-center justify-center gap-3"
                  >
                    Empezar gratis
                    <ArrowRight className="w-6 h-6 motion-safe:group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleGuestMode}
                    className="px-9 py-4 bg-white border-2 border-orange-700 text-orange-800 font-bold rounded-2xl hover:bg-orange-50 transition-colors text-center text-lg flex items-center justify-center gap-3"
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

              <div>
                <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12">
                  <img
                    src={logo}
                    alt="Mascota de SimiAru: una llama con chullo y chalina andina"
                    width="253"
                    height="299"
                    className="w-full max-w-sm h-auto mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== CÓMO FUNCIONA ==================== */}
        <section id="how-it-works" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
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
        <section id="features" className="py-24 bg-stone-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Qué incluye <span className="text-green-700">SimiAru</span>
              </h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">
                Vocabulario, ejercicios y cultura del altiplano en un solo lugar, gratis y sin publicidad
              </p>
            </div>

            <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map(([Icon, title, text, tag]) => (
                <li key={title} className="bg-white rounded-2xl p-7 border border-stone-200">
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

              <li className="bg-white rounded-2xl p-7 border-2 border-orange-700">
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
                  className="min-h-11 flex items-center gap-2 text-orange-800 font-bold text-sm hover:text-orange-900 transition-colors"
                >
                  <Play className="w-5 h-5" />
                  <span>Probar sin cuenta <span aria-hidden="true">→</span></span>
                </button>
              </li>
            </ul>
          </div>
        </section>

        {/* ==================== IDIOMAS ==================== */}
        <section id="languages" className="py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Elige tu idioma</h2>
              <p className="text-xl text-stone-600 max-w-3xl mx-auto">Dos lenguas del altiplano, cada una con 6 unidades y 13 lecciones</p>
            </div>

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
                    className={`px-8 py-3.5 rounded-2xl font-bold text-lg border-2 transition-colors ${
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
                  className="max-w-5xl mx-auto rounded-3xl overflow-hidden border border-stone-200 animate-fade-in"
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
                        <Link to="/register" className={`px-6 py-3 bg-white ${lang.primaryText} font-bold rounded-xl hover:bg-stone-100 transition-colors`}>
                          Empezar <span aria-hidden="true">→</span>
                        </Link>
                        <button
                          type="button"
                          onClick={handleGuestMode}
                          className={`px-6 py-3 ${lang.secondaryBtn} text-white font-bold rounded-xl transition-colors flex items-center gap-2`}
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

        {/* ==================== EL PROYECTO ==================== */}
        <section id="proyecto" className="py-24 bg-stone-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
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
              <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Empieza con la <span className="text-green-200">Unidad 1</span>
              </h2>
              <p className="text-xl md:text-2xl text-green-50 leading-relaxed">
                Crea tu cuenta para guardar tu progreso, o pruébala sin registrarte
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link
                  to="/register"
                  className="px-10 py-5 bg-white text-green-800 font-bold rounded-2xl hover:bg-green-50 transition-colors text-xl"
                >
                  Empezar gratis
                </Link>
                <button
                  type="button"
                  onClick={handleGuestMode}
                  className="px-10 py-5 border-2 border-white text-white font-bold rounded-2xl hover:bg-green-700 transition-colors text-xl flex items-center gap-3"
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
                className="inline-flex w-11 h-11 bg-stone-800 hover:bg-stone-700 rounded-full items-center justify-center transition-colors"
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
        /* Cambio de pestaña: lo justo para notar el cambio */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 200ms ease-out;
        }
        /* Menú del celular */
        @keyframes menu-entrada {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-entrada {
          animation: menu-entrada 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        /* Movimiento reducido: sin desplazamientos; se conservan color y opacidad */
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
          .lengua-subrayado::after {
            animation: none;
          }
          .menu-entrada {
            animation: fade-in 150ms ease-out;
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
