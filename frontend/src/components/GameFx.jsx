// Efectos compartidos de los juegos y las lecciones: chispas, texto que flota,
// cuenta regresiva, estrellas de resultado y confeti. Todo con CSS (index.css).
import { useEffect, useLayoutEffect, useState } from 'react';
import * as m from 'motion/react-m';
import { Star } from 'lucide-react';
import { playTick, playGo, playStar } from '../utils/sounds';

const SPARK_COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ec4899', '#a855f7', '#f97316'];

// Chispas desde el centro del elemento padre (que debe ser "relative"). Cambia "trigger" para repetirlas.
export const Burst = ({ trigger, count = 10, distance = 46 }) =>
  trigger ? (
    <span key={trigger} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span key={i} className="chispa" style={{ '--a': `${(360 / count) * i}deg`, '--d': `${distance + (i % 3) * 10}px`, background: SPARK_COLORS[i % SPARK_COLORS.length] }} />
      ))}
    </span>
  ) : null;

// Texto que sube y desaparece (por ejemplo "+1"). El padre debe ser "relative".
export const FloatText = ({ trigger, children, className = 'text-green-600' }) =>
  trigger ? (
    <span key={trigger} className={`flota ${className}`} aria-hidden="true">
      {children}
    </span>
  ) : null;

// Confeti que estalla desde el centro (trayectorias fijas: igual cada vez)
const CONFETTI_COLORS = ['#15803d', '#1e40af', '#f59e0b', '#c2410c', '#16a34a', '#db2777', '#7c3aed'];
const CONFETTI = Array.from({ length: 28 }, (_, i) => {
  const angle = (i / 28) * Math.PI * 2;
  const dist = 100 + (i % 4) * 30;
  return {
    x: `${Math.round(Math.cos(angle) * dist)}px`,
    y: `${Math.round(Math.sin(angle) * dist * 0.8 + 50)}px`,
    r: `${(i % 2 ? 1 : -1) * (180 + i * 15)}deg`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  };
});
export const Confetti = () => (
  <span className="pointer-events-none absolute inset-0" aria-hidden="true">
    {CONFETTI.map((p, i) => (
      <span key={i} className="papelito" style={{ '--x': p.x, '--y': p.y, '--r': p.r, '--i': i, background: p.color }} />
    ))}
  </span>
);

// 3, 2, 1, ¡Ya! y luego onDone()
export const Countdown = ({ onDone }) => {
  const steps = ['3', '2', '1', '¡Ya!'];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i < steps.length - 1) playTick();
    else playGo();
    const t = setTimeout(() => (i < steps.length - 1 ? setI(i + 1) : onDone()), i < steps.length - 1 ? 650 : 500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);
  return (
    <div className="flex items-center justify-center min-h-[22rem]" role="status" aria-live="assertive">
      <span key={i} className={`anim-cuenta text-8xl sm:text-9xl font-black ${i === steps.length - 1 ? 'texto-degradado' : 'text-stone-800'}`}>
        {steps[i]}
      </span>
    </div>
  );
};

// De 0 a 3 estrellas, que caen una tras otra con su sonido
export const Stars = ({ count }) => {
  useEffect(() => {
    const timers = Array.from({ length: count }, (_, i) => setTimeout(() => playStar(i), 250 + i * 220 + 200));
    return () => timers.forEach(clearTimeout);
  }, [count]);
  return (
    <div className="flex items-end justify-center gap-2" role="img" aria-label={`${count} de 3 estrellas`}>
      {[0, 1, 2].map((i) => (
        <Star
          key={i}
          className={`anim-estrella ${i === 1 ? 'w-16 h-16 -mt-3' : 'w-12 h-12'} ${i < count ? 'text-amber-400 fill-amber-400 drop-shadow-[0_4px_6px_rgba(217,119,6,0.4)]' : 'text-stone-300 fill-stone-200'}`}
          style={{ '--i': i }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

// Caja de un elemento relativa a un contenedor, sin contar transformaciones (offsetLeft/Top):
// las animaciones de entrada o el "pop" de una ficha no la mueven.
export const layoutBox = (el, box) => {
  let x = 0;
  let y = 0;
  let node = el;
  while (node && node !== box) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
};

// Línea curva que une dos fichas de un tablero (el contenedor debe ser "relative").
// from/to: selectores dentro del contenedor; trigger: cambia para volver a dibujarla.
export const LinkLine = ({ boxRef, from, to, color = '#16a34a', trigger, dashed = false }) => {
  const [line, setLine] = useState(null);
  useLayoutEffect(() => {
    const box = boxRef.current;
    const a = box?.querySelector(from);
    const b = box?.querySelector(to);
    if (!a || !b) {
      setLine(null);
      return;
    }
    const A = layoutBox(a, box);
    const B = layoutBox(b, box);
    setLine({ x1: A.x + A.w, y1: A.y + A.h / 2, x2: B.x, y2: B.y + B.h / 2 });
  }, [boxRef, from, to, trigger]);
  if (!line) return null;
  const mx = (line.x1 + line.x2) / 2;
  return (
    <svg className="pointer-events-none absolute inset-0 w-full h-full overflow-visible z-10" aria-hidden="true">
      <m.path
        key={trigger}
        d={`M ${line.x1} ${line.y1} C ${mx} ${line.y1}, ${mx} ${line.y2}, ${line.x2} ${line.y2}`}
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={dashed ? '2 10' : undefined}
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
      />
      <circle cx={line.x1} cy={line.y1} r="7" fill={color} />
      <circle cx={line.x2} cy={line.y2} r="7" fill={color} />
    </svg>
  );
};
