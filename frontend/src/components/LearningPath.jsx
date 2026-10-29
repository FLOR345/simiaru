// Camino de aprendizaje al estilo Duolingo: cada lección es un botón redondo en un sendero que serpentea.
// Completadas = dorado con check; la siguiente = rebota con "¡Empieza!"; bloqueadas = gris con candado.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Check, Lock, Star, RefreshCw, Trophy } from 'lucide-react';
import { Tooltip } from '@mantine/core';
import * as m from 'motion/react-m';
import { useReducedMotion } from 'motion/react';
import { API_URL } from '../config.js';
import Mascot from './Mascot';
import { languageStyle } from '../languages';
import { LessonView, preloadOn } from '../routes';

// Desplazamiento horizontal de cada botón: dibuja la curva del sendero
const OFFSETS = [0, 56, 84, 56, 0, -56, -84, -56];

const authHeaders = () => {
  try {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

const LessonNode = ({ lesson, state, offset, styleSet, isFirstAvailable, reduceMotion }) => {
  const base = 'relative w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-150 ease-out';
  const visuals = {
    done: `${base} bg-gradient-to-b from-amber-300 to-amber-500 text-white shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_2px_0_#b45309]`,
    current: `${base} bg-gradient-to-b ${styleSet.gradient} text-white shadow-[0_6px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.25)]`,
    open: `${base} bg-gradient-to-b ${styleSet.gradient} text-white opacity-90 shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1`,
    locked: `${base} bg-stone-200 text-stone-400 shadow-[0_6px_0_#a8a29e] cursor-not-allowed`,
  };
  const Icon = state === 'done' ? Check : state === 'locked' ? Lock : Star;
  const label = `${lesson.titulo}: ${state === 'done' ? 'completada' : state === 'locked' ? 'bloqueada' : 'disponible'}`;

  const node = (
    <span className={visuals[state]}>
      {/* Anillo que late alrededor de la lección que toca hacer */}
      {state === 'current' && !reduceMotion && (
        <m.span
          className={`absolute -inset-2 rounded-full border-4 ${styleSet.border} opacity-60`}
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        />
      )}
      <Icon className="w-9 h-9" strokeWidth={state === 'done' ? 3.5 : 2.5} fill={state === 'current' || state === 'open' ? 'currentColor' : 'none'} aria-hidden="true" />
    </span>
  );

  return (
    <li className="relative flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      {isFirstAvailable && (
        <m.span
          className="mb-3 px-4 py-2 rounded-2xl bg-white border-2 border-stone-200 font-black text-sm uppercase tracking-wide shadow-md relative"
          animate={reduceMotion ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className={styleSet.text}>¡Empieza!</span>
          <span className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 rotate-45 bg-white border-r-2 border-b-2 border-stone-200" aria-hidden="true" />
        </m.span>
      )}
      <Tooltip label={lesson.titulo} withArrow position="right" openDelay={150}>
        {state === 'locked' ? (
          <span role="img" aria-label={label} tabIndex={0} className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-300">
            {node}
          </span>
        ) : (
          <Link to={`/lesson/${lesson.id}`} aria-label={label} {...preloadOn(LessonView)} className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300">
            {node}
          </Link>
        )}
      </Tooltip>
      <span className="mt-3 max-w-[9rem] text-center text-sm font-bold text-stone-700 leading-tight">{lesson.titulo}</span>
      {/* La llamita espera junto a la lección que toca */}
      {isFirstAvailable && (
        <div className={`pointer-events-none absolute bottom-6 ${offset > 0 ? 'right-full -mr-2' : 'left-full -ml-2'} w-20 sm:w-24`}>
          <Mascot pose="ayuda" size="w-20 sm:w-24" />
        </div>
      )}
    </li>
  );
};

const LearningPath = ({ units, langId, isGuest, isLessonCompleted }) => {
  const styleSet = languageStyle(langId);
  const reduceMotion = useReducedMotion();
  const [lessonsByUnit, setLessonsByUnit] = useState({});
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);

  // Todas las lecciones de una vez: el sendero necesita saber cuál toca
  useEffect(() => {
    let cancelled = false;
    setError(false);
    Promise.all(
      units.map((unit) =>
        axios
          .get(`${API_URL}/api/lessons/units/${unit.id}/lessons`, { headers: authHeaders() })
          .then(({ data }) => [unit.id, data.lessons || []])
          .catch(() => [unit.id, null])
      )
    ).then((entries) => {
      if (cancelled) return;
      if (entries.some(([, lessons]) => lessons === null)) setError(true);
      setLessonsByUnit(Object.fromEntries(entries.map(([id, lessons]) => [id, lessons || []])));
    });
    return () => {
      cancelled = true;
    };
  }, [units, reload]);

  // Orden global para saber cuál es la siguiente lección (las cuentas avanzan en orden; invitados, toda la Unidad 1)
  const ordered = units.flatMap((unit, unitIndex) => (lessonsByUnit[unit.id] || []).map((lesson) => ({ lesson, unitIndex })));
  const firstPending = ordered.find(({ lesson, unitIndex }) => !isLessonCompleted(lesson.id) && (!isGuest || unitIndex === 0));

  const stateOf = (lesson, unitIndex, indexInOrder) => {
    if (isLessonCompleted(lesson.id)) return 'done';
    if (isGuest) return unitIndex === 0 ? (firstPending?.lesson.id === lesson.id ? 'current' : 'open') : 'locked';
    const previous = ordered[indexInOrder - 1];
    if (!previous || isLessonCompleted(previous.lesson.id)) return firstPending?.lesson.id === lesson.id ? 'current' : 'open';
    return 'locked';
  };

  let globalIndex = -1;
  return (
    <div>
      {error && (
        <p role="alert" className="mb-4 flex flex-wrap items-center gap-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-xl p-3">
          No pudimos cargar algunas lecciones.
          <button type="button" onClick={() => setReload((r) => r + 1)} className="inline-flex items-center gap-1 font-bold underline underline-offset-4">
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Reintentar
          </button>
        </p>
      )}
      <ol className="space-y-10">
        {units.map((unit, unitIndex) => {
          const lessons = lessonsByUnit[unit.id];
          const done = (lessons || []).filter((l) => isLessonCompleted(l.id)).length;
          const lockedUnit = isGuest && unitIndex > 0;
          return (
            <li key={unit.id} aria-labelledby={`unidad-${unit.id}-titulo`}>
              {/* Cabecera de la unidad, como la banda de color de cada sección en Duolingo */}
              <div className={`rounded-3xl p-5 sm:p-6 text-white shadow-lg ${lockedUnit ? 'bg-stone-400' : `bg-gradient-to-br ${styleSet.gradient}`}`}>
                <p className="text-sm font-bold uppercase tracking-wide opacity-90">Unidad {unitIndex + 1}</p>
                <h3 id={`unidad-${unit.id}-titulo`} className="text-2xl font-black">
                  {unit.nombre}
                </h3>
                {unit.descripcion && <p className="opacity-90">{unit.descripcion}</p>}
                {lessons && lessons.length > 0 && (
                  <p className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-sm font-bold">
                    {done === lessons.length ? <Trophy className="w-4 h-4" aria-hidden="true" /> : <Check className="w-4 h-4" aria-hidden="true" />}
                    {done} de {lessons.length} lecciones
                  </p>
                )}
                {lockedUnit && <p className="mt-3 inline-flex items-center gap-2 text-sm font-bold"><Lock className="w-4 h-4" aria-hidden="true" /> Regístrate gratis para desbloquearla</p>}
              </div>

              {lessons === undefined ? (
                <p className="text-center text-stone-600 py-8" role="status">Cargando lecciones…</p>
              ) : lessons.length === 0 ? (
                <p className="text-center text-stone-600 py-8">Esta unidad todavía no tiene lecciones.</p>
              ) : (
                <ol className="flex flex-col items-center gap-8 pt-8" aria-label={`Lecciones de ${unit.nombre}`}>
                  {lessons.map((lesson, i) => {
                    globalIndex += 1;
                    const state = stateOf(lesson, unitIndex, globalIndex);
                    return (
                      <LessonNode
                        key={lesson.id}
                        lesson={lesson}
                        state={state}
                        offset={OFFSETS[i % OFFSETS.length]}
                        styleSet={styleSet}
                        isFirstAvailable={firstPending?.lesson.id === lesson.id}
                        reduceMotion={reduceMotion}
                      />
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default LearningPath;
