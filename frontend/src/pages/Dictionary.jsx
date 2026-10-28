import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Volume2, BookOpen, ArrowLeft, Tag, X, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.jpg';
import { API_URL } from '../config.js';

// Misma paleta que el resto de la app: verde = quechua, azul lago = aymara
const LANGUAGES = {
  quechua: { label: 'Quechua', lang: 'qu', detail: 'Variedad Cusco-Collao', accent: 'text-green-800', selected: 'border-green-700 bg-green-50', solid: 'bg-green-700 hover:bg-green-800' },
  aymara: { label: 'Aymara', lang: 'ay', detail: 'Aymara central', accent: 'text-blue-900', selected: 'border-blue-800 bg-blue-50', solid: 'bg-blue-800 hover:bg-blue-900' },
};

// Apóstrofos del teclado del celular (’ ´) se buscan como el apóstrofo simple de la base
const cleanQuery = (text) => text.replace(/[’‘´`ʼ]/g, "'").trim();

// Pronunciación con la voz del navegador (síntesis en español; ver PRODUCT.md)
const speak = (word, onEnd) => {
  if (!('speechSynthesis' in window)) return onEnd();
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'es-PE';
  utterance.rate = 0.8;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
  return undefined;
};

const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('quechua');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [stats, setStats] = useState({ totalWords: 0 });
  const requestId = useRef(0); // ignora respuestas que llegan tarde de búsquedas anteriores

  const lang = LANGUAGES[selectedLanguage];

  // Con cuenta o en modo invitado se vuelve al panel; si no, a la portada
  let backTo = '/';
  try {
    if (localStorage.getItem('token') || localStorage.getItem('isGuest') === 'true') backTo = '/dashboard';
  } catch {
    // almacenamiento bloqueado: se queda la portada
  }

  useEffect(() => {
    const idioma = encodeURIComponent(selectedLanguage);
    axios.get(`${API_URL}/api/dictionary/stats?idioma=${idioma}`).then(({ data }) => setStats(data)).catch(() => {});
    axios.get(`${API_URL}/api/dictionary/categories?idioma=${idioma}`).then(({ data }) => setCategories(data.categories || [])).catch(() => setCategories([]));
  }, [selectedLanguage]);

  const runRequest = async (url) => {
    const id = ++requestId.current;
    setLoading(true);
    setError(false);
    try {
      const { data } = await axios.get(url);
      if (id === requestId.current) setResults(data.words || []);
    } catch (err) {
      console.error('Error en el diccionario:', err);
      if (id === requestId.current) {
        setResults([]);
        setError(true);
      }
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  };

  const search = () =>
    runRequest(`${API_URL}/api/dictionary/search?query=${encodeURIComponent(cleanQuery(searchTerm))}&idioma=${encodeURIComponent(selectedLanguage)}`);

  useEffect(() => {
    if (cleanQuery(searchTerm).length >= 2) {
      const debounce = setTimeout(search, 300);
      return () => clearTimeout(debounce);
    }
    if (!selectedCategory) {
      requestId.current++;
      setResults([]);
      setError(false);
      setLoading(false);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedLanguage]);

  const loadCategory = (categoria) =>
    runRequest(`${API_URL}/api/dictionary/category?categoria=${encodeURIComponent(categoria)}&idioma=${encodeURIComponent(selectedLanguage)}`);

  // Pulsar una categoría la abre; pulsarla de nuevo quita el filtro
  const openCategory = (categoria) => {
    if (selectedCategory === categoria) {
      clearSearch();
      return;
    }
    setSelectedCategory(categoria);
    setSearchTerm('');
    loadCategory(categoria);
  };

  const clearSearch = () => {
    requestId.current++;
    setSearchTerm('');
    setSelectedCategory('');
    setResults([]);
    setError(false);
    setLoading(false);
  };

  const retry = () => (selectedCategory ? loadCategory(selectedCategory) : search());

  const hasQuery = cleanQuery(searchTerm).length >= 2;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* ==================== ENCABEZADO ==================== */}
      <header className="bg-white sticky top-0 z-50 border-b border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link
            to={backTo}
            aria-label={backTo === '/' ? 'Volver a la portada' : 'Volver al panel'}
            className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </Link>
          <img src={logo} alt="" width="253" height="299" className="h-10 w-auto" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Diccionario</h1>
            <p className="text-sm text-stone-600">
              {stats.totalWords || 0} palabras · {categories.length} categorías
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 max-w-5xl">
        {/* ==================== IDIOMA ==================== */}
        <section className="mb-6" aria-label="Idioma">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {Object.entries(LANGUAGES).map(([key, style]) => {
              const selected = selectedLanguage === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setSelectedLanguage(key);
                    clearSearch();
                  }}
                  className={`text-left p-4 sm:p-6 rounded-2xl border-2 transition-colors ${selected ? style.selected : 'border-stone-200 bg-white hover:border-stone-400'}`}
                >
                  <span className="flex items-center justify-between">
                    <span className={`text-xl sm:text-2xl font-bold ${style.accent}`}>{style.label}</span>
                    {selected && <CheckCircle className={`w-6 h-6 ${style.accent}`} aria-hidden="true" />}
                  </span>
                  <span className="block text-sm sm:text-base text-stone-600">{style.detail}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ==================== BÚSQUEDA ==================== */}
        <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 mb-6" role="search">
          <label htmlFor="buscar-palabra" className="block text-lg font-bold mb-3">
            Buscar en {lang.label.toLowerCase()} o en español
          </label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" aria-hidden="true" />
            <input
              id="buscar-palabra"
              type="search"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (selectedCategory) setSelectedCategory('');
              }}
              aria-describedby="buscar-ayuda"
              placeholder="hola, familia, yaku…"
              className="w-full min-h-14 pl-12 pr-14 border-2 border-stone-300 rounded-2xl focus:ring-2 focus:ring-green-700 focus:border-green-700 focus:outline-none text-lg [&::-webkit-search-cancel-button]:hidden"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Borrar búsqueda"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center hover:bg-stone-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5 text-stone-600" aria-hidden="true" />
              </button>
            )}
          </div>
          <p id="buscar-ayuda" className="mt-3 text-sm text-stone-600">
            Escribe al menos 2 letras. Puedes usar cualquier apóstrofo: p'unchay o p’unchay.
          </p>
        </section>

        {/* ==================== CATEGORÍAS ==================== */}
        {categories.length > 0 && (
          <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 mb-6" aria-labelledby="categorias-titulo">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 id="categorias-titulo" className="text-xl font-bold">
                Categorías
              </h2>
              {selectedCategory && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="inline-flex items-center gap-2 px-4 min-h-11 text-stone-700 hover:bg-stone-100 rounded-xl font-semibold transition-colors"
                >
                  <X className="w-4 h-4" aria-hidden="true" />
                  Quitar filtro
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.categoria;
                return (
                  <button
                    key={cat.categoria}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => openCategory(cat.categoria)}
                    className={`inline-flex items-center gap-2 px-4 min-h-11 rounded-full border-2 font-semibold transition-colors ${
                      isSelected ? `${lang.selected} ${lang.accent}` : 'border-stone-200 bg-white hover:border-stone-400'
                    }`}
                  >
                    <span className="capitalize">{cat.categoria}</span>
                    <span className="text-sm text-stone-600">{cat.count}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ==================== RESULTADOS ==================== */}
        <section aria-live="polite" aria-busy={loading}>
          {loading ? (
            <p className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-lg font-semibold text-stone-700" role="status">
              Buscando…
            </p>
          ) : error ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center" role="alert">
              <AlertCircle className="w-10 h-10 text-red-700 mx-auto mb-3" aria-hidden="true" />
              <p className="text-lg font-semibold mb-1">No pudimos buscar en el diccionario</p>
              <p className="text-stone-600 mb-5">Revisa tu conexión. Si es tu primera visita del día, el servidor puede tardar hasta un minuto.</p>
              <button
                type="button"
                onClick={retry}
                className={`inline-flex items-center gap-2 px-6 min-h-11 ${lang.solid} text-white font-bold rounded-lg transition-colors`}
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                Reintentar
              </button>
            </div>
          ) : results.length > 0 ? (
            <div>
              <h2 className="text-xl font-bold mb-4">
                {selectedCategory ? (
                  <>
                    Categoría <span className="capitalize">{selectedCategory}</span>: {results.length} palabras
                  </>
                ) : (
                  `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'} para “${searchTerm.trim()}”`
                )}
              </h2>
              <ul className="grid gap-4">
                {results.map((word) => (
                  <WordCard key={word.id} word={word} lang={lang} />
                ))}
              </ul>
            </div>
          ) : hasQuery ? (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center">
              <Search className="w-10 h-10 text-stone-400 mx-auto mb-3" aria-hidden="true" />
              <h2 className="text-xl font-bold mb-2">Sin resultados para “{searchTerm.trim()}”</h2>
              <p className="text-stone-600 mb-5">Prueba con otra palabra, en español o en {lang.label.toLowerCase()}, o elige una categoría.</p>
              <button type="button" onClick={clearSearch} className="px-6 min-h-11 border-2 border-stone-300 font-bold rounded-xl hover:bg-stone-50 transition-colors">
                Borrar búsqueda
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center">
              <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" aria-hidden="true" />
              <h2 className="text-xl font-bold mb-2">Explora el vocabulario de {lang.label.toLowerCase()}</h2>
              <p className="text-stone-600">Busca una palabra o elige una categoría para empezar.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

// ==================== TARJETA DE PALABRA ====================
const WordCard = ({ word, lang }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const playTTS = () => {
    setIsPlaying(true);
    speak(word.palabra_objetivo, () => setIsPlaying(false));
  };

  const handlePlayAudio = () => {
    if (word.audio_url && audioRef.current) {
      setIsPlaying(true);
      audioRef.current.src = word.audio_url;
      audioRef.current.play().catch(playTTS);
    } else {
      playTTS();
    }
  };

  return (
    <li className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6">
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} onError={() => setIsPlaying(false)} />

      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className={`text-2xl sm:text-3xl font-bold ${lang.accent} break-words`} lang={lang.lang}>
            {word.palabra_objetivo}
          </p>
          {word.pronunciacion && <p className="text-stone-600 mt-1">/{word.pronunciacion}/</p>}
          <p className="text-xl font-semibold mt-1">{word.palabra_espanol}</p>

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {word.categoria && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-700 text-sm font-semibold rounded-full capitalize">
                <Tag className="w-3.5 h-3.5" aria-hidden="true" />
                {word.categoria}
              </span>
            )}
            {word.tipo && <span className="px-3 py-1 bg-stone-100 text-stone-700 text-sm font-semibold rounded-full">{word.tipo}</span>}
            {word.audio_url && <span className="px-3 py-1 bg-green-50 text-green-800 text-sm font-semibold rounded-full">Audio grabado</span>}
          </div>
        </div>

        <button
          type="button"
          onClick={handlePlayAudio}
          disabled={isPlaying}
          aria-label={`Escuchar ${word.palabra_objetivo}${word.audio_url ? ' (audio grabado)' : ' (voz sintetizada)'}`}
          className={`w-12 h-12 shrink-0 flex items-center justify-center ${lang.solid} text-white rounded-xl transition-colors disabled:opacity-70`}
        >
          <Volume2 className={`w-6 h-6 ${isPlaying ? 'motion-safe:animate-pulse' : ''}`} aria-hidden="true" />
        </button>
      </div>

      {word.ejemplo_uso && (
        <div className="mt-4 p-4 bg-stone-50 rounded-xl">
          <p className="text-sm font-bold text-stone-600 mb-1">Ejemplo de uso</p>
          <p className="italic" lang={lang.lang}>
            “{word.ejemplo_uso}”
          </p>
          {word.traduccion_ejemplo && <p className="text-stone-600 mt-1">{word.traduccion_ejemplo}</p>}
        </div>
      )}

      {word.leccion_nombre && (
        <p className="mt-4 flex items-center gap-2 text-sm text-stone-600">
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          De la lección <span className="font-semibold text-stone-800">{word.leccion_nombre}</span>
        </p>
      )}
    </li>
  );
};

export default Dictionary;
