// Meta diaria y semana de estudio (como en Duolingo):
// - un anillo con las lecciones de hoy frente a la meta que eliges (1, 2, 3 o 5 al día);
// - los 7 días de esta semana, con una llama encendida en los días que estudiaste.
// Se calcula con el progreso que ya trae el panel (fecha de cada lección completada), en hora de Perú.
import { useState } from 'react';
import * as m from 'motion/react-m';
import { Flame, Target, Check } from 'lucide-react';
import { playTap, playCorrect } from '../utils/sounds';

const GOALS = [1, 2, 3, 5];
const KEY = 'simiaru-meta-diaria';
const DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const DAY_NAMES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const limaDate = (d) => new Date(d).toLocaleDateString('en-CA', { timeZone: 'America/Lima' }); // AAAA-MM-DD

const readGoal = () => {
  try {
    return Number(localStorage.getItem(KEY)) || 1;
  } catch {
    return 1;
  }
};

const WeekActivity = ({ progress = [], theme }) => {
  const [goal, setGoal] = useState(readGoal);
  const today = limaDate(Date.now());
  const counts = {};
  progress.forEach((p) => {
    if (!p.fecha_completado) return;
    const day = limaDate(p.fecha_completado);
    counts[day] = (counts[day] || 0) + 1;
  });
  const doneToday = counts[today] || 0;
  const ratio = Math.min(1, doneToday / goal);

  // Lunes de esta semana (en hora de Perú)
  const [y, mo, d] = today.split('-').map(Number);
  const base = new Date(Date.UTC(y, mo - 1, d));
  const weekday = (base.getUTCDay() + 6) % 7; // 0 = lunes
  const week = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(base);
    day.setUTCDate(base.getUTCDate() - weekday + i);
    const key = day.toISOString().slice(0, 10);
    return { key, label: DAYS[i], name: DAY_NAMES[i], count: counts[key] || 0, isToday: key === today, future: i > weekday };
  });
  const activeDays = week.filter((w) => w.count > 0).length;

  const choose = (g) => {
    playTap();
    if (doneToday >= g && doneToday < goal) playCorrect();
    setGoal(g);
    try {
      localStorage.setItem(KEY, String(g));
    } catch {
      // sin almacenamiento: vale para esta visita
    }
  };

  const R = 42;
  const C = 2 * Math.PI * R;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur border border-white shadow-sm p-5 sm:p-6" aria-labelledby="meta-titulo">
      <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
        {/* Anillo de la meta de hoy */}
        <div className="relative w-28 h-28 shrink-0 mx-auto sm:mx-0" role="img" aria-label={`Hoy: ${doneToday} de ${goal} lecciones`}>
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            <circle cx="50" cy="50" r={R} fill="none" stroke="#e7e5e4" strokeWidth="10" />
            <m.circle
              cx="50"
              cy="50"
              r={R}
              fill="none"
              stroke={ratio >= 1 ? '#f59e0b' : theme?.hex ?? '#15803d'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: C * (1 - ratio) }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            {ratio >= 1 ? (
              <m.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className="w-10 h-10 rounded-full bg-amber-400 text-white flex items-center justify-center">
                <Check className="w-6 h-6" strokeWidth={3.5} aria-hidden="true" />
              </m.span>
            ) : (
              <>
                <span className="text-3xl font-black tabular-nums leading-none">{doneToday}</span>
                <span className="text-xs font-bold text-stone-500">de {goal}</span>
              </>
            )}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 id="meta-titulo" className="text-xl font-black flex items-center gap-2">
            <Target className="w-5 h-5 text-rose-500" aria-hidden="true" />
            {ratio >= 1 ? '¡Meta de hoy cumplida!' : 'Tu meta de hoy'}
          </h2>
          <p className="text-sm text-stone-600 mb-3">
            {ratio >= 1 ? 'Vuelve mañana para mantener tu racha.' : `Completa ${goal - doneToday} ${goal - doneToday === 1 ? 'lección más' : 'lecciones más'} hoy.`}
          </p>
          <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Lecciones por día">
            <span className="text-xs font-black uppercase tracking-wider text-stone-500 mr-1">Meta</span>
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={goal === g}
                onClick={() => choose(g)}
                className={`ficha min-w-10 min-h-9 px-2 rounded-xl text-sm font-black ${goal === g ? 'border-stone-800 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'}`}
              >
                {g}
              </button>
            ))}
            <span className="text-xs font-semibold text-stone-500">al día</span>
          </div>
        </div>
      </div>

      {/* Esta semana */}
      <div className="mt-5 pt-4 border-t border-stone-100">
        <p className="mb-2 flex items-center justify-between text-sm font-bold text-stone-700">
          <span>Esta semana</span>
          <span className="text-stone-500">
            {activeDays} {activeDays === 1 ? 'día' : 'días'} de estudio
          </span>
        </p>
        <ol className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {week.map((w, i) => (
            <li key={w.key} className="flex flex-col items-center gap-1">
              <m.span
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.5, delay: i * 0.05 }}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                  w.count > 0 ? 'bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-md' : w.future ? 'bg-stone-50 border-2 border-dashed border-stone-200' : 'bg-stone-100 text-stone-300'
                } ${w.isToday ? 'ring-4 ring-amber-300' : ''}`}
                title={`${w.name}: ${w.count} ${w.count === 1 ? 'lección' : 'lecciones'}`}
                aria-label={`${w.name}${w.isToday ? ' (hoy)' : ''}: ${w.count} ${w.count === 1 ? 'lección' : 'lecciones'}`}
              >
                {w.count > 0 ? <Flame className="w-5 h-5 fill-white/60" aria-hidden="true" /> : null}
              </m.span>
              <span className={`text-xs font-black ${w.isToday ? 'text-amber-700' : 'text-stone-500'}`} aria-hidden="true">
                {w.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default WeekActivity;
