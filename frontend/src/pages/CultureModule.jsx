import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Volume2, Heart, Search, ArrowLeft, AlertCircle, RefreshCw, BookOpen, Lightbulb, Quote, Music, Dices, Eye, Languages, Minus, Plus, Check, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { LANGUAGES, getLanguage, languageStyle } from '../languages';
import { playTap, playCorrect, playWrong } from '../utils/sounds';
import { speak } from '../utils/speech';
import Mascot from '../components/Mascot';

const TYPES = [
  { value: 'adivinanza', label: 'Adivinanzas', singular: 'adivinanza', pose: 'pensando', Icon: Lightbulb, color: 'from-amber-400 to-orange-600', hint: '¿Adivinas qué es? Escribe tu respuesta y descúbrela.' },
  { value: 'proverbio', label: 'Proverbios', singular: 'proverbio', pose: 'leyendo', Icon: Quote, color: 'from-purple-500 to-indigo-700', hint: 'Lee el proverbio, piensa qué enseña y luego descubre su significado.' },
  { value: 'cancion', label: 'Canciones', singular: 'canción', pose: 'hablando', Icon: Music, color: 'from-pink-500 to-rose-700', hint: 'Cada verso con su traducción al lado. ¡Anímate a cantarla!' },
  { value: 'cuento', label: 'Cuentos', singular: 'cuento', pose: 'leyendo', Icon: BookOpen, color: 'from-green-500 to-teal-700', hint: 'Elige un cuento y léelo con la traducción a tu lado.' },
];

const FAVORITES_KEY = 'cultureFavorites';

const readFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
  } catch {
    return [];
  }
};

// Compara sin tildes, mayúsculas ni signos
const simplify = (t) =>
  String(t ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zñ' ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

// En las adivinanzas la respuesta va en el título ("El ojo") y al inicio de la explicación ("Respuesta: Ñawi (El ojo)")
const riddleAnswers = (item) => {
  const answers = new Set();
  const title = simplify(item.titulo).replace(/^(el|la|los|las|un|una) /, '');
  if (title) answers.add(title);
  const m = /respuesta:\s*([^.]+)/i.exec(item.explicacion || '');
  if (m) {
    m[1]
      .split(/[()/,]/)
      .map((p) => simplify(p).replace(/^(el|la|los|las|un|una) /, ''))
      .filter(Boolean)
      .forEach((p) => answers.add(p));
  }
  return [...answers];
};

const FavoriteButton = ({ isFavorite, onToggle, name }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-pressed={isFavorite}
    aria-label={`${isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}: ${name}`}
    className={`ficha w-11 h-11 flex items-center justify-center rounded-xl shrink-0 ${isFavorite ? 'border-rose-600 bg-rose-500 text-white' : 'border-stone-300 bg-white text-stone-500 hover:text-rose-600'}`}
  >
    <Heart key={isFavorite ? 'si' : 'no'} className={`w-5 h-5 ${isFavorite ? 'fill-white anim-latido' : ''}`} aria-hidden="true" />
  </button>
);

const ListenButton = ({ text, language, label = 'Escuchar' }) => (
  <button
    type="button"
    onClick={() => speak(text, { lang: language.voz?.respaldo })}
    className="inline-flex items-center gap-2 min-h-10 px-3 rounded-xl bg-white/80 border border-stone-200 text-sm font-bold text-stone-700 hover:bg-white toque"
  >
    <Volume2 className="w-4 h-4" aria-hidden="true" /> {label}
  </button>
);

// ==================== Adivinanza ====================
const RiddleCard = ({ item, index, language, theme, fav, onAnswered }) => {
  const [guess, setGuess] = useState('');
  const [state, setState] = useState('idle'); // idle | right | wrong | shown
  const answers = useMemo(() => riddleAnswers(item), [item]);

  const check = (e) => {
    e.preventDefault();
    const g = simplify(guess).replace(/^(el|la|los|las|un|una) /, '');
    if (!g) return;
    const ok = answers.some((a) => a === g || (g.length >= 3 && (a.includes(g) || g.includes(a))));
    if (ok) {
      playCorrect();
      setState('right');
      onAnswered?.(true);
    } else {
      playWrong();
      setState('wrong');
      onAnswered?.(false);
    }
  };
  const revealed = state === 'right' || state === 'shown';

  return (
    <li id={`cultura-${item.id}`} className="tarjeta-viva anim-entra bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden" style={{ '--i': Math.min(index, 8) }}>
      <div className={`bg-gradient-to-br ${theme.gradient} text-white p-5 sm:p-6`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <p className="font-black uppercase tracking-widest text-sm opacity-85">Adivinanza {index + 1}</p>
          <FavoriteButton {...fav} />
        </div>
        <p className="text-xl sm:text-2xl font-bold leading-snug" lang={language.lang}>
          {item.contenido_original}
        </p>
        {item.traduccion && <p className="mt-2 text-white/85 italic">{item.traduccion}</p>}
        <div className="mt-3">
          <ListenButton text={item.contenido_original} language={language} />
        </div>
      </div>
      <div className="p-5 sm:p-6">
        {revealed ? (
          <div className={`rounded-2xl p-4 anim-pop ${state === 'right' ? 'bg-green-50 border-2 border-green-500' : 'bg-amber-50 border-2 border-amber-400'}`}>
            <p className={`font-black text-lg mb-1 ${state === 'right' ? 'text-green-800' : 'text-amber-900'}`}>
              {state === 'right' ? '¡Adivinaste! 🎉' : 'La respuesta es…'} {item.titulo}
            </p>
            {item.explicacion && <p className="text-stone-800">{item.explicacion}</p>}
          </div>
        ) : (
          <form onSubmit={check} className="space-y-3">
            <label htmlFor={`adivina-${item.id}`} className="font-bold block">
              ¿Qué es?
            </label>
            <div className="flex gap-2">
              <input
                id={`adivina-${item.id}`}
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  if (state === 'wrong') setState('idle');
                }}
                autoComplete="off"
                placeholder="Escribe tu respuesta (en español o en la lengua)"
                className={`flex-1 min-w-0 min-h-12 px-4 rounded-xl border-2 bg-stone-50 font-semibold focus:outline-none focus:bg-white ${state === 'wrong' ? 'border-red-400 anim-sacude' : 'border-stone-300 focus:border-stone-500'}`}
              />
              <button type="submit" className="ficha min-h-12 px-5 rounded-xl border-green-800 bg-green-600 text-white font-black hover:bg-green-500">
                <Check className="w-5 h-5" aria-hidden="true" />
                <span className="sr-only">Comprobar</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-red-700 min-h-5" aria-live="polite">
                {state === 'wrong' ? 'Casi… ¡inténtalo otra vez!' : ''}
              </p>
              <button type="button" onClick={() => setState('shown')} className="inline-flex items-center gap-1 text-sm font-bold text-stone-600 hover:text-stone-900 min-h-10">
                <Eye className="w-4 h-4" aria-hidden="true" /> Ver respuesta
              </button>
            </div>
          </form>
        )}
      </div>
    </li>
  );
};

// ==================== Proverbio ====================
const ProverbCard = ({ item, index, language, theme, fav }) => {
  const [open, setOpen] = useState(false);
  return (
    <li id={`cultura-${item.id}`} className="tarjeta-viva anim-entra bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-6" style={{ '--i': Math.min(index, 8) }}>
      <div className="flex items-start justify-between gap-3">
        <Quote className={`w-10 h-10 ${theme.text} opacity-30 shrink-0`} aria-hidden="true" />
        <FavoriteButton {...fav} />
      </div>
      <p className="mt-2 text-2xl font-black leading-snug" lang={language.lang}>
        {item.contenido_original}
      </p>
      {item.titulo && <p className="mt-1 text-sm font-bold text-stone-500">{item.titulo}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        <ListenButton text={item.contenido_original} language={language} />
      </div>
      {open ? (
        <div className="mt-4 space-y-3 anim-despliega">
          {item.traduccion && <p className="text-lg italic text-stone-800">“{item.traduccion}”</p>}
          {item.explicacion && (
            <div className="rounded-2xl bg-amber-50 border-l-4 border-amber-500 p-4">
              <p className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">Lo que enseña</p>
              <p className="text-stone-800">{item.explicacion}</p>
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            playTap();
            setOpen(true);
          }}
          className={`ficha mt-4 w-full min-h-12 rounded-xl ${theme.border} ${theme.soft} ${theme.text} font-black`}
        >
          ¿Qué significará? Descúbrelo
        </button>
      )}
    </li>
  );
};

// ==================== Canción ====================
const SongCard = ({ item, index, language, theme, fav }) => {
  const original = (item.contenido_original || '').split('\n').filter((l) => l.trim());
  const translated = (item.traduccion || '').split('\n').filter((l) => l.trim());
  const sameLength = original.length > 1 && original.length === translated.length;
  const [line, setLine] = useState(-1);
  return (
    <li id={`cultura-${item.id}`} className="anim-entra bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden" style={{ '--i': Math.min(index, 8) }}>
      <div className="flex items-start justify-between gap-3 p-5 sm:p-6 border-b border-stone-100">
        <div className="flex items-center gap-3">
          <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-700 flex items-center justify-center shadow-md" aria-hidden="true">
            <Music className="w-6 h-6 text-white" />
          </span>
          <div>
            <h3 className="text-xl font-black">{item.titulo || 'Canción'}</h3>
            {item.region && (
              <p className="text-sm text-stone-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" aria-hidden="true" /> {item.region}
              </p>
            )}
          </div>
        </div>
        <FavoriteButton {...fav} />
      </div>
      <div className="p-5 sm:p-6">
        {sameLength ? (
          <ol className="space-y-1">
            {original.map((l, i) => (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => {
                    setLine(i);
                    speak(l, { lang: language.voz?.respaldo });
                  }}
                  className={`w-full grid sm:grid-cols-2 gap-1 sm:gap-6 rounded-xl px-3 py-2 text-left toque ${line === i ? `${theme.soft} ring-2 ${theme.ring}` : 'hover:bg-stone-50'}`}
                >
                  <span className="font-bold text-lg" lang={language.lang}>
                    {l}
                  </span>
                  <span className="text-stone-600 italic">{translated[i]}</span>
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            <p className="text-lg font-semibold whitespace-pre-line leading-relaxed" lang={language.lang}>
              {item.contenido_original}
            </p>
            <p className="text-stone-700 italic whitespace-pre-line leading-relaxed">{item.traduccion}</p>
          </div>
        )}
        {sameLength && <p className="mt-3 text-sm text-stone-500">Toca un verso para escucharlo.</p>}
        {item.explicacion && (
          <div className="mt-4 rounded-2xl bg-amber-50 border-l-4 border-amber-500 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">Significado cultural</p>
            <p className="text-stone-800">{item.explicacion}</p>
          </div>
        )}
      </div>
    </li>
  );
};

// ==================== Lector de cuentos ====================
const SIZES = ['text-base', 'text-lg', 'text-xl', 'text-2xl'];

const StoryReader = ({ story, language, theme, fav, onBack, headingRef }) => {
  const [size, setSize] = useState(1);
  const [showTranslation, setShowTranslation] = useState(true);
  const paragraphs = (story.contenido_original || '').split(/\n\s*\n|\n/).filter((p) => p.trim());
  const translations = (story.traduccion || '').split(/\n\s*\n|\n/).filter((p) => p.trim());
  const aligned = paragraphs.length === translations.length;

  return (
    <article className="bg-white rounded-[2rem] border border-stone-200 shadow-sm overflow-hidden" aria-labelledby="cuento-titulo">
      <div className={`relative overflow-hidden bg-gradient-to-br ${theme.gradient} text-white p-6 sm:p-8`}>
        <span className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10" aria-hidden="true" />
        <button type="button" onClick={onBack} className="relative inline-flex items-center gap-2 min-h-11 mb-3 font-bold text-white/90 hover:text-white">
          <ArrowLeft className="w-5 h-5" aria-hidden="true" /> Volver a los cuentos
        </button>
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <h2 id="cuento-titulo" ref={headingRef} tabIndex={-1} className="text-3xl sm:text-4xl font-black focus:outline-none">
              {story.titulo}
            </h2>
            <p className="mt-1 font-semibold text-white/85">
              Cuento en {language.nombre.toLowerCase()}
              {story.region ? ` · ${story.region}` : ''}
            </p>
          </div>
          <FavoriteButton {...fav} />
        </div>
      </div>

      {/* Herramientas de lectura */}
      <div className="sticky top-[4.5rem] z-10 flex flex-wrap items-center gap-2 border-b border-stone-200 bg-white/95 backdrop-blur px-6 py-3">
        <span className="text-sm font-bold text-stone-600 mr-1">Tamaño</span>
        <button type="button" onClick={() => setSize((s) => Math.max(0, s - 1))} disabled={size === 0} aria-label="Letra más pequeña" className="ficha w-10 h-10 rounded-xl border-stone-300 bg-white flex items-center justify-center disabled:opacity-40">
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => setSize((s) => Math.min(SIZES.length - 1, s + 1))} disabled={size === SIZES.length - 1} aria-label="Letra más grande" className="ficha w-10 h-10 rounded-xl border-stone-300 bg-white flex items-center justify-center disabled:opacity-40">
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-pressed={showTranslation}
          onClick={() => setShowTranslation((v) => !v)}
          className={`ficha ml-auto inline-flex items-center gap-2 min-h-10 px-4 rounded-xl font-bold ${showTranslation ? `${theme.border} ${theme.soft} ${theme.text}` : 'border-stone-300 bg-white text-stone-700'}`}
        >
          <Languages className="w-4 h-4" aria-hidden="true" /> Traducción
        </button>
      </div>

      <div className="p-6 sm:p-8">
        {aligned ? (
          <div className="space-y-5">
            {paragraphs.map((p, i) => (
              <div key={i} className={`grid gap-2 ${showTranslation ? 'lg:grid-cols-2 lg:gap-10' : ''}`}>
                <p className={`${SIZES[size]} leading-relaxed font-medium`} lang={language.lang}>
                  {p}
                </p>
                {showTranslation && <p className={`${SIZES[size]} leading-relaxed text-stone-600 italic`}>{translations[i]}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div className={`grid gap-8 ${showTranslation ? 'lg:grid-cols-2' : ''}`}>
            <p className={`${SIZES[size]} leading-relaxed font-medium whitespace-pre-line`} lang={language.lang}>
              {story.contenido_original}
            </p>
            {showTranslation && story.traduccion && <p className={`${SIZES[size]} leading-relaxed text-stone-600 italic whitespace-pre-line`}>{story.traduccion}</p>}
          </div>
        )}
        {story.explicacion && (
          <div className="mt-8 rounded-2xl bg-amber-50 border-l-4 border-amber-500 p-5">
            <p className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">Lo que nos enseña</p>
            <p className="text-stone-800 leading-relaxed">{story.explicacion}</p>
          </div>
        )}
      </div>
    </article>
  );
};

const CultureModule = ({ user }) => {
  const [content, setContent] = useState([]);
  const [selectedType, setSelectedType] = useState('adivinanza');
  const [selectedLanguage, setSelectedLanguage] = useState(user?.idioma_objetivo && getLanguage(user.idioma_objetivo) ? user.idioma_objetivo : 'quechua');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(readFavorites);
  const [showFavorites, setShowFavorites] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [mood, setMood] = useState({ mood: 'idle', beat: 0 });
  // Tras celebrar o lamentarse, la llamita vuelve a su pose de la sección
  useEffect(() => {
    if (mood.mood === 'idle') return undefined;
    const t = setTimeout(() => setMood((m0) => ({ ...m0, mood: 'idle' })), 1800);
    return () => clearTimeout(t);
  }, [mood]);
  const [solved, setSolved] = useState(0);
  const storyHeadingRef = useRef(null);
  const highlightRef = useRef(null);

  const language = getLanguage(selectedLanguage) ?? LANGUAGES[0];
  const theme = languageStyle(selectedLanguage);
  const type = TYPES.find((t) => t.value === selectedType);

  useEffect(() => {
    loadContent();
    setSelectedStory(null);
    setSolved(0);
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

  const fav = (item) => ({
    isFavorite: favorites.includes(item.id),
    onToggle: () => toggleFavorite(item.id),
    name: item.titulo || type.singular,
  });

  // Sorpréndeme: abre un cuento al azar o lleva a una tarjeta al azar
  const surprise = () => {
    if (filteredContent.length === 0) return;
    playTap();
    const pick = filteredContent[Math.floor(Math.random() * filteredContent.length)];
    if (selectedType === 'cuento') {
      setSelectedStory(pick);
      return;
    }
    const el = document.getElementById(`cultura-${pick.id}`);
    el?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    highlightRef.current?.classList.remove('ring-4', 'ring-amber-400');
    el?.classList.add('ring-4', 'ring-amber-400');
    highlightRef.current = el;
  };

  const onRiddle = (ok) => {
    setMood((m0) => ({ mood: ok ? 'cheer' : 'sad', beat: m0.beat + 1 }));
    if (ok) setSolved((n) => n + 1);
  };

  const renderResults = () => {
    if (loading) {
      return (
        <ul className="grid gap-5 md:grid-cols-2" aria-label="Cargando contenido cultural">
          {Array.from({ length: 4 }, (_, i) => (
            <li key={i} className="h-56 rounded-3xl bg-white/70 border border-white animate-pulse motion-reduce:animate-none" />
          ))}
        </ul>
      );
    }

    if (loadError) {
      return (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center" role="alert">
          <AlertCircle className="w-10 h-10 text-red-700 mx-auto mb-3" aria-hidden="true" />
          <p className="text-lg font-semibold mb-1">No pudimos cargar el contenido cultural</p>
          <p className="text-stone-600 mb-5">Revisa tu conexión. Si es tu primera visita del día, el servidor puede tardar hasta un minuto.</p>
          <button type="button" onClick={loadContent} className={`inline-flex items-center gap-2 px-6 min-h-11 ${theme.solid} ${theme.hover} text-white font-bold rounded-lg toque`}>
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            Reintentar
          </button>
        </div>
      );
    }

    if (content.length === 0) {
      return (
        <div className="bg-white rounded-3xl border border-stone-200 p-10 text-center">
          <Mascot pose="descansando" size="w-32" className="justify-center mb-3" />
          <h2 className="text-xl font-bold mb-2">
            Todavía no hay {type.label.toLowerCase()} en {language.nombre.toLowerCase()}
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

    if (selectedType === 'cuento' && selectedStory) {
      return <StoryReader story={selectedStory} language={language} theme={theme} fav={fav(selectedStory)} onBack={() => setSelectedStory(null)} headingRef={storyHeadingRef} />;
    }

    if (selectedType === 'cuento') {
      return (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filteredContent.map((story, i) => (
            <li key={story.id} id={`cultura-${story.id}`} className="anim-entra" style={{ '--i': Math.min(i, 8) }}>
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setSelectedStory(story);
                }}
                className="group tarjeta-viva w-full h-full text-left rounded-3xl bg-white border border-stone-200 shadow-sm overflow-hidden"
              >
                <span className={`relative block h-24 bg-gradient-to-br ${theme.gradient}`}>
                  <span className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(135deg,#fff_0_8px,transparent_8px_22px)]" aria-hidden="true" />
                  <BookOpen className="absolute bottom-3 left-5 w-9 h-9 text-white transition-transform duration-200 group-hover:-rotate-6" aria-hidden="true" />
                  {favorites.includes(story.id) && <Heart className="absolute top-3 right-4 w-5 h-5 fill-white text-white" aria-label="En favoritos" />}
                </span>
                <span className="block p-5">
                  <span className="block font-black text-xl">{story.titulo || 'Sin título'}</span>
                  <span className="block mt-2 text-sm text-stone-600 line-clamp-3" lang={language.lang}>
                    {story.contenido_original}
                  </span>
                  <span className={`block mt-4 text-sm font-black ${theme.text}`}>
                    Leer cuento <span aria-hidden="true">→</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      );
    }

    const Card = selectedType === 'adivinanza' ? RiddleCard : selectedType === 'proverbio' ? ProverbCard : SongCard;
    return (
      <ul className={`grid gap-5 ${selectedType === 'cancion' ? '' : 'md:grid-cols-2'}`}>
        {filteredContent.map((item, i) => (
          <Card key={item.id} item={item} index={i} language={language} theme={theme} fav={fav(item)} onAnswered={onRiddle} />
        ))}
      </ul>
    );
  };

  return (
    <div className="fondo-burbujas min-h-screen text-stone-900">
      <span className="burbuja burbuja-verde" aria-hidden="true" />
      <span className="burbuja burbuja-morada" aria-hidden="true" />
      {/* ==================== ENCABEZADO ==================== */}
      <header className="bg-white/90 backdrop-blur sticky top-0 z-50 border-b border-stone-200">
        <div className="container mx-auto max-w-7xl py-3 flex items-center gap-3">
          <Link to="/dashboard" aria-label="Volver al panel" className="w-11 h-11 flex items-center justify-center rounded-xl text-stone-700 hover:bg-stone-100 toque">
            <ArrowLeft className="w-6 h-6" aria-hidden="true" />
          </Link>
          <div className="mr-auto min-w-0">
            <h1 className="text-xl sm:text-2xl font-black">Cultura viva</h1>
            <p className="text-sm text-stone-600 truncate">Adivinanzas, proverbios, canciones y cuentos andinos</p>
          </div>
          <div className="flex rounded-full bg-stone-100 p-1" role="group" aria-label="Idioma">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                type="button"
                aria-pressed={l.id === selectedLanguage}
                onClick={() => {
                  setSelectedLanguage(l.id);
                  resetFilters();
                }}
                className={`min-h-9 px-3 sm:px-4 rounded-full text-sm font-bold toque ${l.id === selectedLanguage ? `${languageStyle(l.id).solid} text-white` : 'text-stone-600 hover:text-stone-900'}`}
              >
                {l.nombre}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl py-8 relative">
        <div className="grid gap-8 lg:grid-cols-[19rem_minmax(0,1fr)] items-start">
          {/* ==================== COLUMNA LATERAL ==================== */}
          <aside className="space-y-5 lg:sticky lg:top-24">
            <div className="hidden lg:block">
              <Mascot
                mood={mood.mood}
                pose={mood.mood === 'idle' ? type.pose : undefined}
                beat={mood.beat}
                bubble="top"
                size="w-44"
                eager
                say={
                  <p className="font-semibold">
                    {type.hint}
                    {selectedType === 'adivinanza' && solved > 0 && <strong className="block mt-1">¡Llevas {solved} adivinadas!</strong>}
                  </p>
                }
              />
            </div>

            <nav aria-label="Tipo de contenido" className="grid grid-cols-2 lg:grid-cols-1 gap-2">
              {TYPES.map((t) => {
                const selected = selectedType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => {
                      playTap();
                      setSelectedType(t.value);
                      resetFilters();
                    }}
                    className={`ficha flex items-center gap-3 rounded-2xl px-3 min-h-14 text-left font-black ${selected ? 'border-stone-800 bg-stone-900 text-white' : 'border-stone-200 bg-white hover:bg-stone-50'}`}
                  >
                    <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shrink-0`} aria-hidden="true">
                      <t.Icon className="w-5 h-5 text-white" />
                    </span>
                    {t.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ==================== CONTENIDO ==================== */}
          <div className="min-w-0">
            {!selectedStory && (
              <section className="mb-6 flex flex-col sm:flex-row gap-3" aria-label="Filtros">
                <div className="relative flex-1">
                  <label htmlFor="buscar-cultura" className="sr-only">
                    Buscar en {type.label.toLowerCase()}
                  </label>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" aria-hidden="true" />
                  <input
                    id="buscar-cultura"
                    type="search"
                    autoComplete="off"
                    placeholder={`Buscar en ${type.label.toLowerCase()}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full min-h-12 pl-12 pr-4 rounded-2xl border-2 border-stone-200 bg-white focus:outline-none focus:border-stone-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFavorites(!showFavorites)}
                  aria-pressed={showFavorites}
                  className={`ficha px-4 min-h-12 rounded-2xl font-bold whitespace-nowrap flex items-center justify-center gap-2 ${
                    showFavorites ? 'border-rose-600 bg-rose-50 text-rose-800' : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${showFavorites ? 'fill-rose-600 text-rose-600' : ''}`} aria-hidden="true" />
                  Favoritos ({favorites.length})
                </button>
                <button type="button" onClick={surprise} className="ficha px-4 min-h-12 rounded-2xl border-amber-400 bg-amber-50 text-amber-900 font-black whitespace-nowrap flex items-center justify-center gap-2 hover:bg-amber-100">
                  <Dices className="w-5 h-5" aria-hidden="true" /> Sorpréndeme
                </button>
              </section>
            )}
            {!loading && !loadError && content.length > 0 && !selectedStory && (
              <p className="text-sm font-semibold text-stone-600 mb-4" aria-live="polite">
                {filteredContent.length} de {content.length} {type.label.toLowerCase()}
              </p>
            )}

            {renderResults()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CultureModule;
