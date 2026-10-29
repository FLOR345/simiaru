import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Volume2, Heart, Search, ArrowLeft, CheckCircle, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import logo from '../assets/logo.jpg';

// Misma paleta que el resto de la app: verde = quechua, azul lago = aymara
const LANGUAGES = {
  quechua: { label: 'Quechua', lang: 'qu', detail: 'Variedad Cusco-Collao', accent: 'text-green-800', selected: 'border-green-700 bg-green-50', solid: 'bg-green-700 hover:bg-green-800', bar: 'border-green-700', soft: 'bg-green-50' },
  aymara: { label: 'Aymara', lang: 'ay', detail: 'Aymara central', accent: 'text-blue-900', selected: 'border-blue-800 bg-blue-50', solid: 'bg-blue-800 hover:bg-blue-900', bar: 'border-blue-800', soft: 'bg-blue-50' },
};

const TYPES = [
  { value: 'adivinanza', label: 'Adivinanzas', singular: 'adivinanza' },
  { value: 'proverbio', label: 'Proverbios', singular: 'proverbio' },
  { value: 'cancion', label: 'Canciones', singular: 'canción' },
  { value: 'cuento', label: 'Cuentos', singular: 'cuento' },
];

const FAVORITES_KEY = 'cultureFavorites';

const readFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
};

// Fuera del componente principal para que no se vuelvan a crear en cada cambio
// (si no, el botón pierde el foco del teclado al marcar un favorito)
const FavoriteButton = ({ isFavorite, onToggle, name }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={isFavorite}
    aria-label={`${isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${name}`}
    className="w-11 h-11 flex items-center justify-center rounded-full toque shrink-0 text-stone-600 hover:bg-stone-100"
  >
    {/* key: al guardarlo, el corazón late una vez */}
    <Heart key={isFavorite ? 'si' : 'no'} className={`w-6 h-6 ${isFavorite ? 'fill-red-600 text-red-600 anim-latido' : ''}`} aria-hidden="true" />
  </button>
);

// Texto original, traducción y explicación: igual en cuentos y en el resto
const ContentBody = ({ item, lang }) => (
  <div className="space-y-4">
    <div className={`${lang.soft} p-5 rounded-xl border-l-4 ${lang.bar}`}>
      <p className={`text-sm font-bold ${lang.accent} mb-2`}>{lang.label}</p>
      <p className="text-lg leading-relaxed whitespace-pre-line font-medium" lang={lang.lang}>
        {item.contenido_original}
      </p>
    </div>
    {item.traduccion && (
      <div className="bg-stone-50 p-5 rounded-xl border-l-4 border-stone-300">
        <p className="text-sm font-bold text-stone-600 mb-2">Traducción al español</p>
        <p className="text-stone-800 italic leading-relaxed whitespace-pre-line">{item.traduccion}</p>
      </div>
    )}
    {item.explicacion && (
      <div className="bg-amber-50 p-5 rounded-xl border-l-4 border-amber-500">
        <p className="text-sm font-bold text-amber-900 mb-2">Significado cultural</p>
        <p className="text-stone-800 leading-relaxed">{item.explicacion}</p>
      </div>
    )}
    {item.audio_url && (
      <button
        type="button"
        onClick={() => new Audio(item.audio_url).play().catch((err) => console.error('Error playing audio:', err))}
        className={`w-full flex items-center justify-center gap-2 px-5 min-h-12 ${lang.solid} text-white rounded-xl font-bold toque`}
      >
        <Volume2 className="w-5 h-5" aria-hidden="true" />
        Escuchar
      </button>
    )}
  </div>
);

const CultureModule = ({ user }) => {
  const [content, setContent] = useState([]);
  const [selectedType, setSelectedType] = useState('adivinanza');
  const [selectedLanguage, setSelectedLanguage] = useState(user?.idioma_objetivo === 'aymara' ? 'aymara' : 'quechua');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(readFavorites);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const storyHeadingRef = useRef(null);

  const lang = LANGUAGES[selectedLanguage];
  const type = TYPES.find((t) => t.value === selectedType);

  useEffect(() => {
    loadContent();
    setSelectedStory(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedLanguage]);

  // Al abrir un cuento, el foco va a su título
  useEffect(() => {
    if (selectedStory) storyHeadingRef.current?.focus();
  }, [selectedStory]);

  const loadContent = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await api.getCulturalContent(selectedType, selectedLanguage);
      setContent(response?.data?.content || []);
    } catch (error) {
      console.error('Error loading cultural content:', error);
      setContent([]);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  // Los favoritos se guardan en este dispositivo (sirve también en modo invitado)
  const setFavorite = (itemId, favorite) => {
    setFavorites((prev) => {
      const next = favorite ? (prev.includes(itemId) ? prev : [...prev, itemId]) : prev.filter((id) => id !== itemId);
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {
        // almacenamiento bloqueado: los favoritos duran solo esta visita
      }
      return next;
    });
  };

  // Confirmación con "Deshacer": un toque accidental se corrige sin buscar el texto otra vez
  const toggleFavorite = (itemId) => {
    const wasFavorite = favorites.includes(itemId);
    setFavorite(itemId, !wasFavorite);
    toast(wasFavorite ? 'Quitado de favoritos' : 'Guardado en favoritos', {
      id: `favorito-${itemId}`,
      action: { label: 'Deshacer', onClick: () => setFavorite(itemId, wasFavorite) },
    });
  };


  const search = searchTerm.trim().toLowerCase();
  const filteredContent = content.filter((item) => {
    if (showFavorites && !favorites.includes(item.id)) return false;
    if (!search) return true;
    return [item.titulo, item.contenido_original, item.traduccion].some((field) => field?.toLowerCase().includes(search));
  });

  const resetFilters = () => {
    setSearchTerm('');
    setShowFavorites(false);
  };

  const favoriteProps = (item) => ({
    isFavorite: favorites.includes(item.id),
    onToggle: () => toggleFavorite(item.id),
    name: item.titulo || type.singular,
  });

  const renderResults = () => {
    if (loading) {
      return (
        <p className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-lg font-semibold text-stone-700" role="status">
          Cargando contenido cultural…
        </p>
      );
    }

    if (loadError) {
      return (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center" role="alert">
          <AlertCircle className="w-10 h-10 text-red-700 mx-auto mb-3" aria-hidden="true" />
          <p className="text-lg font-semibold mb-1">No pudimos cargar el contenido cultural</p>
          <p className="text-stone-600 mb-5">Revisa tu conexión. Si es tu primera visita del día, el servidor puede tardar hasta un minuto.</p>
          <button type="button" onClick={loadContent} className={`inline-flex items-center gap-2 px-6 min-h-11 ${lang.solid} text-white font-bold rounded-lg toque`}>
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      );
    }

    if (content.length === 0) {
      return (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center">
          <BookOpen className="w-10 h-10 text-stone-400 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-xl font-bold mb-2">
            Todavía no hay {type.label.toLowerCase()} en {lang.label.toLowerCase()}
          </h2>
          <p className="text-stone-600">Prueba con otro tipo de contenido o con la otra lengua.</p>
        </div>
      );
    }

    if (filteredContent.length === 0) {
      return (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center">
          <Search className="w-10 h-10 text-stone-400 mx-auto mb-3" aria-hidden="true" />
          <h2 className="text-xl font-bold mb-2">{showFavorites ? 'Aún no guardaste favoritos aquí' : `Sin resultados para “${searchTerm.trim()}”`}</h2>
          <button type="button" onClick={resetFilters} className="mt-3 px-6 min-h-11 border-2 border-stone-300 font-bold rounded-xl hover:bg-stone-50 toque">
            Ver todo el contenido
          </button>
        </div>
      );
    }

    // ----- Cuento abierto -----
    if (selectedType === 'cuento' && selectedStory) {
      return (
        <article className="bg-white rounded-3xl border border-stone-200 overflow-hidden" aria-labelledby="cuento-titulo">
          <div className="p-6 border-b border-stone-200">
            <button
              type="button"
              onClick={() => setSelectedStory(null)}
              className="inline-flex items-center gap-2 min-h-11 mb-3 text-stone-700 hover:text-stone-900 font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              Volver a los cuentos
            </button>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="cuento-titulo" ref={storyHeadingRef} tabIndex={-1} className="text-3xl font-bold focus:outline-none">
                  {selectedStory.titulo}
                </h2>
                <p className={`${lang.accent} font-semibold mt-1`}>Cuento en {lang.label.toLowerCase()}</p>
              </div>
              <FavoriteButton {...favoriteProps(selectedStory)} />
            </div>
          </div>
          <div className="p-6">
            <ContentBody item={selectedStory} lang={lang} />
          </div>
        </article>
      );
    }

    // ----- Lista de cuentos -----
    if (selectedType === 'cuento') {
      return (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((story) => (
            <li key={story.id}>
              <button
                type="button"
                onClick={() => setSelectedStory(story)}
                className="w-full h-full text-left p-5 rounded-2xl bg-white border-2 border-stone-200 hover:border-stone-400 toque"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="font-bold text-lg">{story.titulo || 'Sin título'}</span>
                  {favorites.includes(story.id) && <Heart className="w-5 h-5 fill-red-600 text-red-600 shrink-0" aria-label="En favoritos" />}
                </span>
                <span className="block mt-2 text-sm text-stone-600 line-clamp-2" lang={lang.lang}>
                  {story.contenido_original}
                </span>
                <span className={`block mt-3 text-sm font-bold ${lang.accent}`}>
                  Leer cuento <span aria-hidden="true">→</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      );
    }

    // ----- Adivinanzas, proverbios y canciones -----
    return (
      <ul className="grid gap-5">
        {filteredContent.map((item) => (
          <li key={item.id} className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold">{item.titulo || type.label}</h2>
              <FavoriteButton {...favoriteProps(item)} />
            </div>
            <ContentBody item={item} lang={lang} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* ==================== ENCABEZADO ==================== */}
      <header className="bg-white sticky top-0 z-50 border-b border-stone-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center gap-3">
          <Link to="/dashboard" aria-label="Volver al panel" className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-700 hover:bg-stone-100 toque">
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </Link>
          <img src={logo} alt="" width="253" height="299" className="h-10 w-auto" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Cultura viva</h1>
            <p className="text-sm text-stone-600">Adivinanzas, proverbios, canciones y cuentos andinos</p>
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
                    resetFilters();
                  }}
                  className={`text-left p-4 sm:p-6 rounded-2xl border-2 toque ${selected ? style.selected : 'border-stone-200 bg-white hover:border-stone-400'}`}
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

        {/* ==================== TIPO, BÚSQUEDA Y FAVORITOS ==================== */}
        {!selectedStory && (
          <section className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-6 mb-6" aria-label="Filtros">
            <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Tipo de contenido">
              {TYPES.map((t) => {
                const selected = selectedType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      setSelectedType(t.value);
                      resetFilters();
                    }}
                    className={`px-5 min-h-11 rounded-full border-2 font-semibold toque ${selected ? `${lang.selected} ${lang.accent}` : 'border-stone-200 bg-white hover:border-stone-400'}`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label htmlFor="buscar-cultura" className="sr-only">
                  Buscar en {type.label.toLowerCase()}
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" aria-hidden="true" />
                  <input
                    id="buscar-cultura"
                    type="search"
                    autoComplete="off"
                    placeholder={`Buscar en ${type.label.toLowerCase()}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-h-12 pl-12 pr-4 rounded-xl border-2 border-stone-300 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowFavorites(!showFavorites)}
                aria-pressed={showFavorites}
                className={`px-5 min-h-12 rounded-xl font-semibold whitespace-nowrap toque flex items-center justify-center gap-2 border-2 ${
                  showFavorites ? 'border-red-700 bg-red-50 text-red-800' : 'border-stone-200 bg-white hover:border-stone-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${showFavorites ? 'fill-red-600 text-red-600' : ''}`} aria-hidden="true" />
                Solo favoritos ({favorites.length})
              </button>
            </div>
            {!loading && !loadError && content.length > 0 && (
              <p className="text-sm text-stone-600 mt-3" aria-live="polite">
                {filteredContent.length} de {content.length} {type.label.toLowerCase()}
              </p>
            )}
          </section>
        )}

        {renderResults()}
      </main>
    </div>
  );
};

export default CultureModule;
