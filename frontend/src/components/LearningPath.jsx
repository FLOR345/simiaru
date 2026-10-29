// Camino de aprendizaje al estilo Duolingo: las lecciones son botones redondos sobre un sendero que serpentea.
// - Un trazo punteado une las lecciones; el tramo ya recorrido se pinta con el color de la lengua.
// - Completadas: doradas con estrellas y un brillo; la siguiente: anillos que laten y "¡Empieza!";
//   bloqueadas: grises con candado (al tocarlas tiemblan y avisan qué falta).
// - Al final de cada unidad, un trofeo que se enciende cuando la terminas.
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Check, Lock, Star, RefreshCw, Trophy, Cloud, Sparkle, Mountain } from 'lucide-react';
import { Tooltip } from '@mantine/core';
import * as m from 'motion/react-m';
import { useReducedMotion } from 'motion/react';
import { API_URL } from '../config.js';
import Mascot, { LlamaImage } from './Mascot';
import { languageStyle } from '../languages';
import { LessonView, preloadOn } from '../routes';
import { playTap, playWrong } from '../utils/sounds';

// Geometría del sendero (en px): ancho del carril, alto de cada fila y desplazamiento lateral de cada botón
const ROW = 168;
const NODE = 80;
// Desplazamientos como fracción del medio carril: el sendero se ensancha en pantallas grandes
const OFFSETS = [0, 0.42, 0.62, 0.42, 0, -0.42, -0.62, -0.42];

// Ancho del carril: el del contenedor, entre 300 y 560 px
const useLaneWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(320);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setWidth(Math.max(300, Math.min(560, el.clientWidth)));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
};
// Un consejo distinto cada día
const TIPS = [
  'Unos minutos cada día valen más que una hora una vez a la semana.',
  'Repite en voz alta cada palabra después de escucharla.',
  'Usa los juegos para repasar las palabras de las lecciones que ya hiciste.',
  'En quechua, el apóstrofo cambia el sonido: p\'unchay no es lo mismo que punchay.',
  'Las adivinanzas de Cultura son una forma divertida de aprender vocabulario.',
  'Si fallas, la pregunta vuelve al final de la lección: ¡es para repasarla!',
];

const UNIT_POSES = ['bienvenida', 'carino', 'escuchando', 'leyendo', 'escribiendo', 'hablando', 'pensando', 'buscando'];

const authHeaders = () => {
  try {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
};

// Curva suave que pasa por el centro de cada botón
const trailPath = (points) =>
  points.reduce((d, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = points[i - 1];
    const midY = (prev.y + p.y) / 2;
    return `${d} C ${prev.x} ${midY}, ${p.x} ${midY}, ${p.x} ${p.y}`;
  }, '');

const LessonNode = ({ lesson, state, styleSet, isFirstAvailable, reduceMotion, index }) => {
  const [shake, setShake] = useState(0);
  const base = 'relative w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-150 ease-out hover:-translate-y-1';
  const visuals = {
    done: `${base} bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 text-white shadow-[0_6px_0_#b45309] active:translate-y-1 active:shadow-[0_2px_0_#b45309] overflow-hidden`,
    current: `${base} bg-gradient-to-b ${styleSet.gradient} text-white shadow-[0_6px_0_rgba(0,0,0,0.25)] active:translate-y-1 active:shadow-[0_2px_0_rgba(0,0,0,0.25)]`,
    open: `${base} bg-gradient-to-b ${styleSet.gradient} text-white opacity-90 shadow-[0_6px_0_rgba(0,0,0,0.2)] active:translate-y-1`,
    locked: `${base} bg-gradient-to-b from-stone-200 to-stone-300 text-stone-400 shadow-[0_6px_0_#a8a29e] cursor-not-allowed`,
  };
  const Icon = state === 'done' ? Check : state === 'locked' ? Lock : Star;
  const label = `${lesson.titulo}: ${state === 'done' ? 'completada' : state === 'locked' ? 'bloqueada' : 'disponible'}`;

  const node = (
    <span key={shake} className={`${visuals[state]} ${shake ? 'anim-sacude' : ''}`}>
      {/* Anillos que laten alrededor de la lección que toca hacer */}
      {state === 'current' && !reduceMotion && (
        <>
          <m.span
            className={`absolute -inset-2 rounded-full border-4 ${styleSet.border}`}
            animate={{ scale: [1, 1.18, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
          />
          <m.span
            className={`absolute -inset-2 rounded-full border-4 ${styleSet.border}`}
            animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            aria-hidden="true"
          />
        </>
      )}
      {state === 'done' && <span className="brillo-nodo" aria-hidden="true" />}
      <Icon className="relative w-9 h-9 drop-shadow" strokeWidth={state === 'done' ? 3.5 : 2.5} fill={state === 'current' || state === 'open' ? 'currentColor' : 'none'} aria-hidden="true" />
    </span>
  );

  return (
    <m.div
      className="relative flex flex-col items-center"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.4, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', bounce: 0.5, duration: 0.6, delay: Math.min(index, 4) * 0.06 }}
    >
      {/* Estrellas sobre las lecciones completadas */}
      {state === 'done' && (
        <span className="absolute -top-4 flex gap-0.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <Star key={i} className={`w-4 h-4 text-amber-400 fill-amber-400 ${i === 1 ? '-mt-1.5' : ''}`} />
          ))}
        </span>
      )}
      <Tooltip label={state === 'locked' ? 'Completa la lección anterior' : lesson.titulo} withArrow position="right" openDelay={150}>
        {state === 'locked' ? (
          <button
            type="button"
            aria-label={label}
            onClick={() => {
              playWrong();
              setShake((s) => s + 1);
              toast('Esta lección aún está bloqueada', { id: 'bloqueada', description: 'Completa la lección anterior para abrirla.' });
            }}
            className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-stone-300"
          >
            {node}
          </button>
        ) : (
          <Link
            to={`/lesson/${lesson.id}`}
            aria-label={label}
            onClick={playTap}
            {...preloadOn(LessonView)}
            className="rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-300"
          >
            {node}
          </Link>
        )}
      </Tooltip>
      {/* Nombre de la lección; la que toca rebota y dice "¡Empieza!" */}
      <m.span
        className={`mt-3 w-max max-w-[10rem] rounded-2xl px-3 py-1 text-center text-sm font-bold leading-tight shadow-sm ${
          isFirstAvailable
            ? `bg-gradient-to-r ${styleSet.gradient} text-white shadow-md`
            : state === 'locked'
              ? 'bg-white/70 text-stone-400'
              : state === 'done'
                ? 'bg-amber-50 text-amber-900'
                : 'bg-white text-stone-800'
        }`}
        animate={isFirstAvailable && !reduceMotion ? { y: [0, -4, 0] } : undefined}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        {isFirstAvailable && <span className="block text-[10px] font-black uppercase tracking-widest opacity-90">¡Empieza aquí!</span>}
        {lesson.titulo}
      </m.span>
    </m.div>
  );
};

// Decoración a los costados del sendero: nubes, destellos y montañas que flotan
const SideDecor = ({ rows }) => {
  // (se dibuja dentro del carril, a los lados del sendero)
  const items = [];
  for (let i = 0; i < rows; i++) {
    const left = i % 2 === 0;
    const Icon = [Cloud, Sparkle, Mountain][i % 3];
    items.push(
      <Icon
        key={i}
        className={`absolute anim-flotar ${i % 3 === 1 ? 'w-6 h-6 text-amber-300 fill-amber-200' : i % 3 === 0 ? 'w-12 h-12 text-sky-200 fill-sky-100' : 'w-10 h-10 text-green-200 fill-green-100'}`}
        style={{ top: i * ROW + 30, [left ? 'left' : 'right']: `${4 + (i % 3) * 5}%`, animationDelay: `${-i * 0.9}s` }}
        aria-hidden="true"
      />
    );
  }
  return <div className="pointer-events-none absolute inset-0 hidden sm:block">{items}</div>;
};

const UnitTrail = ({ unit, lessons, unitIndex, lockedUnit, styleSet, stateOf, firstPending, reduceMotion, startIndex }) => {
  const [laneRef, LANE] = useLaneWidth();
  const half = LANE / 2 - NODE / 2 - 8;
  const done = lessons.filter((l, i) => stateOf(l, unitIndex, startIndex + i) === 'done').length;
  const complete = done === lessons.length && lessons.length > 0;
  const points = [...lessons.map((_, i) => ({ x: LANE / 2 + OFFSETS[i % OFFSETS.length] * half, y: i * ROW + NODE / 2 + 16 })), { x: LANE / 2, y: lessons.length * ROW + NODE / 2 + 16 }];
  const height = (lessons.length + 1) * ROW;
  // Tramo recorrido: hasta la lección actual (o hasta el trofeo si la unidad está completa)
  const reached = complete ? points.length : Math.max(1, done + (firstPending && lessons.some((l) => l.id === firstPending.lesson.id) ? 1 : 0));
  const gradientId = `sendero-${unit.id}`;

  return (
    <div ref={laneRef} className="relative mx-auto pt-12 w-full max-w-[560px]" style={{ height: height + 48 }}>
      <SideDecor rows={lessons.length + 1} />
      <svg className="absolute left-0 top-12 overflow-visible" width={LANE} height={height} aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor={styleSet.hex} />
          </linearGradient>
        </defs>
        {/* Camino de tierra con línea central punteada */}
        <path d={trailPath(points)} fill="none" stroke="#e7e5e4" strokeWidth="22" strokeLinecap="round" />
        <path d={trailPath(points)} fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 16" />
        {reached > 1 && (
          <m.path
            d={trailPath(points.slice(0, reached))}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth="22"
            strokeLinecap="round"
            opacity="0.9"
            initial={reduceMotion ? false : { pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
          />
        )}
      </svg>

      {lessons.map((lesson, i) => {
        const state = stateOf(lesson, unitIndex, startIndex + i);
        const p = points[i];
        const isFirst = firstPending?.lesson.id === lesson.id;
        return (
          <div key={lesson.id} className="absolute" style={{ left: p.x - NODE / 2, top: p.y + 48 - NODE / 2, width: NODE }}>
            <LessonNode lesson={lesson} state={state} styleSet={styleSet} isFirstAvailable={isFirst} reduceMotion={reduceMotion} index={i} />
            {/* La llamita (sticker) espera junto a la lección que toca */}
            {isFirst && (
              <div className={`pointer-events-none absolute -top-4 ${OFFSETS[i % OFFSETS.length] > 0 ? 'right-full mr-2' : 'left-full ml-2'} w-24 sm:w-32`}>
                <Mascot pose="ayuda" sticker size="w-24 sm:w-32" />
              </div>
            )}
          </div>
        );
      })}

      {/* Trofeo al final de la unidad */}
      <m.div
        className="absolute flex flex-col items-center"
        style={{ left: LANE / 2 - 48, top: points[points.length - 1].y, width: 96 }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', bounce: 0.5, duration: 0.7 }}
      >
        <span
          className={`relative w-24 h-24 rounded-[1.75rem] rotate-3 flex items-center justify-center ${
            complete ? 'bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_6px_0_#c2410c] text-white' : lockedUnit ? 'bg-stone-200 text-stone-400 shadow-[0_6px_0_#a8a29e]' : 'bg-white border-4 border-dashed border-amber-300 text-amber-400'
          }`}
          role="img"
          aria-label={complete ? `Unidad ${unitIndex + 1} completada` : `Trofeo de la unidad ${unitIndex + 1}: termina sus lecciones`}
        >
          {complete && <span className="brillo-nodo" aria-hidden="true" />}
          {complete ? (
            <span className="block w-20 aspect-square -rotate-3" aria-hidden="true">
              <LlamaImage pose="logro" sticker sizes="5rem" />
            </span>
          ) : (
            <Trophy className="w-11 h-11" aria-hidden="true" />
          )}
        </span>
        <span className={`mt-3 text-xs font-black uppercase tracking-wider ${complete ? 'text-amber-700' : 'text-stone-400'}`}>{complete ? '¡Unidad lista!' : 'Trofeo'}</span>
      </m.div>
    </div>
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

  let globalIndex = 0;
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
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_17rem] items-start">
      <ol className="space-y-12 min-w-0">
        {units.map((unit, unitIndex) => {
          const lessons = lessonsByUnit[unit.id];
          const startIndex = globalIndex;
          globalIndex += lessons?.length || 0;
          const done = (lessons || []).filter((l) => isLessonCompleted(l.id)).length;
          const total = lessons?.length || 0;
          const lockedUnit = isGuest && unitIndex > 0;
          const pct = total ? done / total : 0;
          return (
            <li key={unit.id} id={`unidad-${unit.id}`} className="scroll-mt-24" aria-labelledby={`unidad-${unit.id}-titulo`}>
              {/* Cabecera de la unidad: banda de color con tejido andino, avance y la llamita */}
              <m.div
                className={`relative overflow-hidden rounded-[2rem] p-5 sm:p-7 pr-24 sm:pr-44 text-white shadow-lg ${lockedUnit ? 'bg-gradient-to-br from-stone-400 to-stone-500' : `bg-gradient-to-br ${styleSet.gradient}`}`}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ type: 'spring', bounce: 0.25, duration: 0.6 }}
              >
                <span className="tejido-andino absolute inset-x-0 bottom-0 h-3 opacity-80" aria-hidden="true" />
                <span className="pointer-events-none absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/10 blur-sm" aria-hidden="true" />
                <span className="pointer-events-none absolute right-24 -bottom-20 w-40 h-40 rounded-full bg-white/10" aria-hidden="true" />
                <p className="relative text-sm font-black uppercase tracking-widest opacity-90">Unidad {unitIndex + 1}</p>
                <h3 id={`unidad-${unit.id}-titulo`} className="relative text-2xl sm:text-3xl font-black">
                  {unit.nombre}
                </h3>
                {unit.descripcion && <p className="relative opacity-90">{unit.descripcion}</p>}
                {total > 0 && !lockedUnit && (
                  <div className="relative mt-4 max-w-xs">
                    <div className="flex items-center justify-between gap-2 text-sm font-bold mb-1 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5">
                        {done === total ? <Trophy className="w-4 h-4" aria-hidden="true" /> : <Check className="w-4 h-4" aria-hidden="true" />}
                        {done} de {total} lecciones
                      </span>
                      <span>{Math.round(pct * 100)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/25 overflow-hidden" aria-hidden="true">
                      <m.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-200"
                        initial={reduceMotion ? false : { width: 0 }}
                        whileInView={{ width: `${pct * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
                      />
                    </div>
                  </div>
                )}
                {lockedUnit && (
                  <p className="relative mt-3 inline-flex items-center gap-2 text-sm font-bold">
                    <Lock className="w-4 h-4" aria-hidden="true" /> Regístrate gratis para desbloquearla
                  </p>
                )}
                <span className="pointer-events-none absolute right-1 sm:right-4 -bottom-1 w-24 sm:w-40 aspect-square" aria-hidden="true">
                  <LlamaImage pose={lockedUnit ? 'descansando' : UNIT_POSES[unitIndex % UNIT_POSES.length]} sticker sizes="10rem" />
                </span>
              </m.div>

              {lessons === undefined ? (
                <p className="text-center text-stone-600 py-8" role="status">
                  Cargando lecciones…
                </p>
              ) : lessons.length === 0 ? (
                <p className="text-center text-stone-600 py-8">Esta unidad todavía no tiene lecciones.</p>
              ) : (
                <div>
                  <UnitTrail
                    unit={unit}
                    lessons={lessons}
                    unitIndex={unitIndex}
                    lockedUnit={lockedUnit}
                    styleSet={styleSet}
                    stateOf={stateOf}
                    firstPending={firstPending}
                    reduceMotion={reduceMotion}
                    startIndex={startIndex}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Mapa de la ruta: todas las unidades con su avance; tocar una lleva hasta ella */}
      <aside className="hidden xl:block sticky top-24 space-y-5" aria-label="Mapa de tu ruta">
        <div className="rounded-3xl border border-stone-200 bg-gradient-to-b from-white to-stone-50 p-5 shadow-sm">
          <h3 className="font-black mb-3">Mapa de tu ruta</h3>
          <ol className="space-y-2">
            {units.map((unit, unitIndex) => {
              const lessons = lessonsByUnit[unit.id] || [];
              const done = lessons.filter((l) => isLessonCompleted(l.id)).length;
              const pct = lessons.length ? done / lessons.length : 0;
              const locked = isGuest && unitIndex > 0;
              const here = firstPending?.unitIndex === unitIndex;
              return (
                <li key={unit.id}>
                  <button
                    type="button"
                    onClick={() => {
                      playTap();
                      document.getElementById(`unidad-${unit.id}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
                    }}
                    className={`group w-full flex items-center gap-3 rounded-2xl px-2 py-2 text-left transition-colors ${here ? `${styleSet.soft} ring-2 ${styleSet.ring}` : 'hover:bg-stone-100'}`}
                  >
                    <span
                      className={`w-9 h-9 shrink-0 rounded-xl flex items-center justify-center text-sm font-black text-white transition-transform group-hover:scale-110 ${
                        locked ? 'bg-stone-300' : pct === 1 ? 'bg-gradient-to-br from-amber-300 to-orange-500' : `bg-gradient-to-br ${styleSet.gradient}`
                      }`}
                    >
                      {locked ? <Lock className="w-4 h-4" aria-hidden="true" /> : pct === 1 ? <Trophy className="w-4 h-4" aria-hidden="true" /> : unitIndex + 1}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-bold truncate">{unit.nombre}</span>
                      <span className="mt-1 block h-1.5 rounded-full bg-stone-200 overflow-hidden" aria-hidden="true">
                        <span className={`block h-full rounded-full ${pct === 1 ? 'bg-amber-400' : styleSet.solid}`} style={{ width: `${pct * 100}%` }} />
                      </span>
                    </span>
                    <span className="text-xs font-bold text-stone-500 tabular-nums">
                      {done}/{lessons.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
        <div className="relative rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 pt-4 shadow-sm overflow-hidden">
          <span className="block w-24 aspect-square mx-auto llama llama-reposo" aria-hidden="true">
            <LlamaImage pose="ayuda" sticker sizes="6rem" />
          </span>
          <p className="mt-2 text-sm font-semibold text-amber-950 text-center">{TIPS[Math.floor(Date.now() / 86400000) % TIPS.length]}</p>
        </div>
      </aside>
      </div>
    </div>
  );
};

export default LearningPath;
