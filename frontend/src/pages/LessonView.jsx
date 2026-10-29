import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import { api } from '../services/api';
import ExerciseTypes from '../components/lessons/ExerciseTypes';
import { Volume2, X, Check, ArrowLeft, ArrowRight, Star, Trophy, AlertCircle, RefreshCw, UserX } from 'lucide-react';

// Misma paleta que el resto de la app: verde = quechua, azul lago = aymara
const THEMES = {
  quechua: { name: 'Quechua', solid: 'bg-green-700', hover: 'hover:bg-green-800', text: 'text-green-800', soft: 'bg-green-50', ring: 'ring-green-700', header: 'bg-green-800', headerSoft: 'text-green-100' },
  aymara: { name: 'Aymara', solid: 'bg-blue-800', hover: 'hover:bg-blue-900', text: 'text-blue-900', soft: 'bg-blue-50', ring: 'ring-blue-800', header: 'bg-blue-900', headerSoft: 'text-blue-100' },
};

const PASS_PERCENT = 80;

// Colores de la celebración: los de la app (verde quechua, azul aymara) y el dorado de las estrellas
const CONFETTI_COLORS = ['#15803d', '#1e40af', '#f59e0b', '#c2410c', '#16a34a', '#2563eb'];
// Trayectorias fijas (no aleatorias): la misma celebración cada vez, sin saltos al volver a renderizar
const CONFETTI = Array.from({ length: 24 }, (_, i) => {
  const angle = (i / 24) * Math.PI * 2;
  const distance = 90 + (i % 4) * 28;
  return {
    x: `${Math.round(Math.cos(angle) * distance)}px`,
    y: `${Math.round(Math.sin(angle) * distance * 0.8 + 60)}px`,
    r: `${(i % 2 ? 1 : -1) * (180 + i * 15)}deg`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});

// El porcentaje sube de 0 a su valor (count-up) una sola vez, al ver los resultados.
// Con movimiento reducido aparece directamente el número final.
const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return undefined;
    }
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3)))); // ease-out cúbico
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);
  return value;
};

// Pantalla de resultados en su propio componente para poder usar el contador
const ResultsScore = ({ percentage, passed, theme }) => {
  const shown = useCountUp(percentage);
  return (
    <p className={`text-6xl font-black mb-2 tabular-nums ${passed ? 'texto-degradado' : 'text-orange-800'}`}>
      <span aria-hidden="true">{shown}%</span>
      <span className="sr-only">{percentage}%</span>
    </p>
  );
};

// Pronunciación con la voz del navegador (síntesis en español; ver PRODUCT.md)
const speakWord = (word) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'es-PE';
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
};

const playAudio = (url, word) => {
  if (url) {
    const audio = new Audio(url);
    audio.play().catch(() => speakWord(word));
  } else {
    speakWord(word);
  }
};

const LessonView = ({ user, isGuest }) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [showVocab, setShowVocab] = useState(true);
  const [feedback, setFeedback] = useState(null); // { correct, correctText }
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [learnedWords, setLearnedWords] = useState([]);
  const [saveState, setSaveState] = useState('idle'); // idle | saving | saved | error
  const savedRef = useRef(false);
  const continueRef = useRef(null);

  const theme = lesson?.idioma === 'aymara' ? THEMES.aymara : THEMES.quechua;
  const percentage = exercises.length > 0 ? Math.round((score / exercises.length) * 100) : 100;

  useEffect(() => {
    loadLesson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  const loadLesson = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const { data } = await api.getLessonContent(lessonId);
      setLesson(data.lesson);
      setVocabulary(data.vocabulary || []);
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error loading lesson:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  // El progreso se guarda en cuanto aparecen los resultados, pulse el botón que pulse la persona
  const saveProgress = async () => {
    if (isGuest || !user) return;
    setSaveState('saving');
    try {
      const { data } = await api.saveProgress({ leccionId: parseInt(lessonId, 10), porcentajeAciertos: percentage });
      setSaveState('saved');
      // Confirmación con lo que se ganó: puntos y, si hubo, cada insignia nueva
      if (data?.puntos > 0) {
        toast.success(`+${data.puntos} Ayni Points`, { description: 'Tu progreso quedó guardado.' });
      }
      (data?.insignias || []).forEach((insignia, i) => {
        setTimeout(() => toast(`¡Nueva insignia! ${insignia}`, { description: 'Mírala en tu perfil.' }), 500 + i * 400);
      });
    } catch (error) {
      console.error('Error saving progress:', error);
      setSaveState('error');
    }
  };

  useEffect(() => {
    if (showResults && !savedRef.current) {
      savedRef.current = true;
      saveProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showResults]);

  // Al corregir, el foco pasa a "Continuar" para seguir con el teclado
  useEffect(() => {
    if (feedback) continueRef.current?.focus();
  }, [feedback]);

  const toggleLearnedWord = (wordId) => {
    setLearnedWords((prev) => (prev.includes(wordId) ? prev.filter((id) => id !== wordId) : [...prev, wordId]));
  };

  const handleAnswer = (isCorrect, correctText) => {
    setFeedback({ correct: isCorrect, correctText });
    if (isCorrect) setScore((s) => s + 1);
  };

  const goToNext = () => {
    setFeedback(null);
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      setShowResults(true);
    }
    window.scrollTo(0, 0);
  };

  const repeatLesson = () => {
    savedRef.current = false;
    setSaveState('idle');
    setScore(0);
    setCurrentExercise(0);
    setFeedback(null);
    setShowResults(false);
    setShowVocab(true);
    window.scrollTo(0, 0);
  };

  const backLink = (
    <Link to="/dashboard" className="inline-flex items-center gap-2 min-h-11 font-semibold transition-colors">
      <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      Volver al panel
    </Link>
  );

  // ==================== CARGANDO ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center" role="status">
          <div className="w-14 h-14 border-4 border-stone-200 border-t-green-700 rounded-full animate-spin motion-reduce:animate-none mx-auto" aria-hidden="true" />
          <p className="text-stone-700 font-semibold mt-4">Cargando lección…</p>
        </div>
      </div>
    );
  }

  // ==================== ERROR AL CARGAR ====================
  if (loadError || !lesson) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center bg-white border border-stone-200 p-8 rounded-3xl max-w-md" role="alert">
          <AlertCircle className="w-12 h-12 text-red-700 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-xl font-bold mb-2">No pudimos cargar esta lección</h1>
          <p className="text-stone-600 mb-6">Revisa tu conexión. Si es tu primera visita del día, el servidor puede tardar hasta un minuto.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={loadLesson}
              className="inline-flex items-center gap-2 px-6 min-h-11 bg-green-700 hover:bg-green-800 text-white font-bold rounded-lg toque"
            >
              <RefreshCw className="w-5 h-5" aria-hidden="true" />
              Reintentar
            </button>
            <Link to="/dashboard" className="inline-flex items-center px-6 min-h-11 border-2 border-stone-300 font-bold rounded-lg hover:bg-stone-50 toque">
              Volver al panel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==================== RESULTADOS ====================
  if (showResults) {
    const passed = percentage >= PASS_PERCENT;
    return (
      <div className="fondo-burbujas min-h-screen text-stone-900 py-8">
        <span className="burbuja burbuja-verde" aria-hidden="true" />
        <span className="burbuja burbuja-azul" aria-hidden="true" />
        <span className="burbuja burbuja-morada" aria-hidden="true" />
        <main className="container mx-auto max-w-2xl">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-white shadow-2xl p-6 sm:p-8 text-center anim-entra">
            {/* Pop in del trofeo; si aprobó, papelitos que salen de él */}
            <div className="relative w-24 h-24 mx-auto mb-6" aria-hidden="true">
              {passed &&
                CONFETTI.map((piece, i) => (
                  <span
                    key={i}
                    className="papelito"
                    style={{ '--x': piece.x, '--y': piece.y, '--r': piece.r, '--i': i, background: piece.color }}
                  />
                ))}
              <div
                className={`anim-pop relative w-24 h-24 rounded-full flex items-center justify-center ${passed ? theme.solid : 'bg-orange-700'}`}
                style={{ '--i': 2 }}
              >
                <Trophy className="w-12 h-12 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-black mb-2 anim-entra" style={{ '--i': 3 }}>
              {passed ? <span className="texto-degradado texto-vivo">¡Felicitaciones!</span> : '¡Buen intento!'}
            </h1>
            <p className="text-stone-600 mb-6 anim-entra" style={{ '--i': 4 }}>
              {passed
                ? lesson.idioma === 'aymara'
                  ? '¡Wali luratawa! (¡Bien hecho!)'
                  : '¡Allin rurasqayki! (¡Bien hecho!)'
                : `Con ${PASS_PERCENT}% o más se considera aprobada. Puedes repetirla cuando quieras.`}
            </p>

            <div className={`${passed ? theme.soft : 'bg-orange-50'} rounded-2xl p-6 mb-6 anim-entra`} style={{ '--i': 5 }}>
              <ResultsScore percentage={percentage} passed={passed} theme={theme} />
              <p className="text-stone-700 text-lg">
                {score} de {exercises.length} respuestas correctas
              </p>
            </div>

            {isGuest ? (
              <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 mb-6 text-left flex items-start gap-3">
                <UserX className="w-5 h-5 text-orange-800 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-orange-900 font-semibold">Estás en modo invitado: tu progreso no se guarda.</p>
                  <Link to="/register" className="inline-flex items-center min-h-11 text-orange-900 font-bold underline underline-offset-4">
                    Crear cuenta gratis
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mb-6 text-sm font-semibold min-h-5" role="status">
                {saveState === 'saving' && <span className="text-stone-600">Guardando tu progreso…</span>}
                {saveState === 'saved' && <span className="text-green-800">Progreso guardado</span>}
                {saveState === 'error' && (
                  <span className="text-red-800">
                    No pudimos guardar tu progreso.{' '}
                    <button type="button" onClick={saveProgress} className="underline underline-offset-4 min-h-11">
                      Intentar de nuevo
                    </button>
                  </span>
                )}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 anim-entra" style={{ '--i': 7 }}>
              <button
                type="button"
                onClick={repeatLesson}
                className="flex-1 min-h-12 px-6 border-2 border-stone-300 rounded-xl font-bold hover:bg-stone-50 toque"
              >
                Repetir lección
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className={`flex-1 min-h-12 px-6 ${theme.solid} ${theme.hover} text-white font-bold rounded-xl toque`}
              >
                Volver al panel
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==================== VOCABULARIO ====================
  if (showVocab) {
    const learnedPercent = vocabulary.length > 0 ? Math.round((learnedWords.length / vocabulary.length) * 100) : 0;
    return (
      <div className="min-h-screen bg-stone-50 text-stone-900">
        <header className={`${theme.header} text-white`}>
          <div className="container mx-auto py-6 max-w-4xl">
            <div className={`mb-4 ${theme.headerSoft} hover:text-white`}>{backLink}</div>
            <p className={`${theme.headerSoft} font-semibold`}>{theme.name}</p>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h1 className="text-3xl font-bold">{lesson.titulo}</h1>
              <p className={theme.headerSoft}>
                <span className="text-2xl font-bold text-white">{vocabulary.length}</span> palabras
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto py-8 max-w-4xl">
          {lesson.contenido_teorico && (
            <section className="bg-white rounded-2xl border border-stone-200 p-6 mb-6" aria-labelledby="teoria-titulo">
              <h2 id="teoria-titulo" className="font-bold mb-2">Qué aprenderás</h2>
              <p className="text-stone-700 leading-relaxed">{lesson.contenido_teorico}</p>
            </section>
          )}

          <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6 flex items-center justify-between gap-4">
            <p className="flex items-center gap-3 font-semibold text-stone-700">
              <Star className="w-6 h-6 text-amber-600" aria-hidden="true" />
              {learnedWords.length} de {vocabulary.length} palabras marcadas como aprendidas
            </p>
            <div className="w-32 h-3 bg-stone-200 rounded-full overflow-hidden shrink-0" aria-hidden="true">
              <div className={`barra h-full w-full ${theme.solid}`} style={{ transform: `scaleX(${learnedPercent / 100})` }} />
            </div>
          </div>

          <p className="text-sm text-stone-600 mb-4">
            La pronunciación usa la voz sintetizada del navegador y puede no reflejar con exactitud la de un hablante.
          </p>

          <ol className="space-y-3 mb-8">
            {vocabulary.map((word, index) => {
              const learned = learnedWords.includes(word.id);
              return (
                <li key={word.id} className={`bg-white rounded-2xl border border-stone-200 ${learned ? `ring-2 ${theme.ring}` : ''}`}>
                  <div className="flex items-center gap-4 p-4">
                    <span className={`w-11 h-11 ${theme.solid} rounded-xl flex items-center justify-center text-white font-bold shrink-0`} aria-hidden="true">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xl font-bold" lang={lesson.idioma === 'aymara' ? 'ay' : 'qu'}>
                        {word.palabra_objetivo}
                      </p>
                      <p className="text-stone-700">{word.palabra_espanol}</p>
                      {word.ejemplo_uso && <p className="text-sm text-stone-600 mt-1 italic">“{word.ejemplo_uso}”</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => playAudio(word.audio_url, word.palabra_objetivo)}
                        aria-label={`Escuchar ${word.palabra_objetivo}`}
                        className={`w-11 h-11 flex items-center justify-center ${theme.solid} ${theme.hover} text-white rounded-full toque`}
                      >
                        <Volume2 className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleLearnedWord(word.id)}
                        aria-pressed={learned}
                        aria-label={`Marcar ${word.palabra_objetivo} como aprendida`}
                        className={`w-11 h-11 flex items-center justify-center rounded-full toque ${
                          learned ? 'bg-amber-500 text-white' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {/* key: al marcarla, la estrella late una vez */}
                        <Star key={learned ? 'si' : 'no'} className={`w-5 h-5 ${learned ? 'fill-white anim-latido' : ''}`} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="sticky bottom-4">
            {exercises.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setShowVocab(false);
                  window.scrollTo(0, 0);
                }}
                className={`w-full min-h-14 ${theme.solid} ${theme.hover} text-white font-bold text-lg rounded-2xl toque flex items-center justify-center gap-3`}
              >
                Comenzar ejercicios ({exercises.length} preguntas)
                <ArrowRight className="w-6 h-6" aria-hidden="true" />
              </button>
            ) : (
              <p className="text-center bg-white border border-stone-200 rounded-2xl p-4 text-stone-700">Esta lección todavía no tiene ejercicios.</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // ==================== EJERCICIOS ====================
  const exercise = exercises[currentExercise];
  const questionPercent = Math.round(((currentExercise + 1) / exercises.length) * 100);
  const isLast = currentExercise === exercises.length - 1;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 py-6 sm:py-8">
      <main className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            type="button"
            onClick={() => setShowVocab(true)}
            className="inline-flex items-center gap-2 min-h-11 text-stone-700 hover:text-stone-900 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Volver al vocabulario
          </button>
          <p className="flex items-center gap-2 bg-white border border-stone-200 px-4 py-2 rounded-full font-bold">
            {/* Cada acierto hace latir la estrella del marcador */}
            <Star key={score} className={`w-5 h-5 text-amber-500 fill-amber-500 ${score > 0 ? 'anim-latido' : ''}`} aria-hidden="true" />
            <span className="sr-only">Respuestas correctas: </span>
            {score}/{exercises.length}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-4 mb-6">
          <div className="flex justify-between text-sm text-stone-700 font-semibold mb-2">
            <span>
              {theme.name} · Pregunta {currentExercise + 1} de {exercises.length}
            </span>
            <span aria-hidden="true">{questionPercent}%</span>
          </div>
          <div
            className="w-full bg-stone-200 rounded-full h-3"
            role="progressbar"
            aria-label="Avance de la lección"
            aria-valuenow={currentExercise + 1}
            aria-valuemin={1}
            aria-valuemax={exercises.length}
          >
            <div className="h-3 rounded-full overflow-hidden">
              <div className={`barra h-full w-full rounded-full ${theme.solid}`} style={{ transform: `scaleX(${questionPercent / 100})` }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          {/* key: cada pregunta nueva entra desde un poco más abajo en vez de reemplazar a la anterior de golpe */}
          <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={currentExercise}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          >
          <ExerciseTypes
            exercise={exercise}
            onAnswer={handleAnswer}
            onSkip={goToNext}
            answered={!!feedback}
            languageLabel={theme.name}
          />
          </m.div>
          </AnimatePresence>

          {/* Corrección: se anuncia y espera a que la persona pulse Continuar.
              Entra desde abajo; si es correcta el ícono hace pop, si no, el mensaje se sacude suave */}
          <div role="status" aria-live="polite">
            {feedback && (
              <div className={`anim-entra p-5 sm:p-6 border-t-2 ${feedback.correct ? 'bg-green-50 border-green-700' : 'bg-red-50 border-red-700'}`}>
                <p className={`flex items-center gap-3 font-bold text-lg ${feedback.correct ? 'text-green-900' : 'text-red-900 anim-sacude'}`}>
                  {feedback.correct ? (
                    <span className="anim-pop w-8 h-8 rounded-full bg-green-700 text-white flex items-center justify-center" style={{ '--i': 2 }} aria-hidden="true">
                      <Check className="w-5 h-5" strokeWidth={3} />
                    </span>
                  ) : (
                    <span className="w-8 h-8 rounded-full bg-red-700 text-white flex items-center justify-center" aria-hidden="true">
                      <X className="w-5 h-5" strokeWidth={3} />
                    </span>
                  )}
                  {feedback.correct ? '¡Correcto!' : 'No es correcto'}
                </p>
                {!feedback.correct && feedback.correctText && (
                  <p className="mt-2 text-red-900">
                    Respuesta correcta: <strong>{feedback.correctText}</strong>
                  </p>
                )}
              </div>
            )}
          </div>

          {feedback && (
            <div className="px-5 sm:px-6 pb-6 pt-2 bg-white anim-entra" style={{ '--i': 2 }}>
              <button
                ref={continueRef}
                type="button"
                onClick={goToNext}
                className={`w-full min-h-12 ${theme.solid} ${theme.hover} text-white font-bold rounded-xl toque flex items-center justify-center gap-2`}
              >
                {isLast ? 'Ver resultados' : 'Continuar'}
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LessonView;
