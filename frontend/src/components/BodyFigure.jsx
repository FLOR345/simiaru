// Ilustración del cuerpo de frente y de espalda, como una tarjeta que gira en 3D.
// - Puntos que se pueden tocar en cada parte; la elegida se ilumina con un foco (el resto se oscurece).
// - Se da la vuelta con el botón o deslizando el dedo a un lado.
// - Las etiquetas "pegadas" (juego de arrastrar) quedan sobre el cuerpo.
import { forwardRef } from 'react';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { RotateCw, Heart } from 'lucide-react';
import frente from '../assets/cuerpo/frente.webp';
import espalda from '../assets/cuerpo/espalda.webp';
import { VISTAS } from '../data/cuerpoNumeros';

const IMG = { frente, espalda };
const pct = (p) => ({ left: `${(p.x / VISTAS[p.vista].w) * 100}%`, top: `${(p.y / VISTAS[p.vista].h) * 100}%` });

const Face = forwardRef(({ vista, parts, active, flash, onPick, label, color, showDots, spotlight, placed, back }, ref) => {
  const activePart = parts.find((p) => p.id === active);
  return (
    <div ref={ref} className="absolute inset-0 [backface-visibility:hidden]" style={back ? { transform: 'rotateY(180deg)' } : undefined}>
      <img src={IMG[vista]} alt={vista === 'frente' ? 'Niño de frente' : 'Niño de espalda'} className="h-full w-full object-contain select-none" draggable={false} />

      {/* Foco: se oscurece todo menos la parte elegida */}
      <AnimatePresence>
        {spotlight && activePart && (
          <m.div
            key={activePart.id}
            className="pointer-events-none absolute inset-0 rounded-[1.5rem]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              background: `radial-gradient(circle at ${pct(activePart).left} ${pct(activePart).top}, transparent 0, transparent 2.6rem, rgba(15,23,42,0.5) 5.5rem)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Etiquetas ya pegadas */}
      {placed &&
        parts
          .filter((p) => placed[p.id])
          .map((p) => (
            <m.span
              key={`pegada-${p.id}`}
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl px-2.5 py-1 text-sm font-black text-white shadow-lg ring-2 ring-white"
              style={{ ...pct(p), background: color }}
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', bounce: 0.6 }}
            >
              {placed[p.id]}
            </m.span>
          ))}

      {/* Puntos */}
      {showDots &&
        parts.map((p) => {
          const isActive = p.id === active;
          const fl = flash?.id === p.id ? (flash.ok ? '#16a34a' : '#e11d48') : null;
          if (placed?.[p.id]) return null;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onPick?.(p)}
              aria-label={label ? label(p) : p.es}
              className="group absolute z-20 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center focus-visible:outline-none"
              style={pct(p)}
            >
              {(isActive || fl) && (
                <m.span
                  className="absolute inset-0 rounded-full border-4"
                  style={{ borderColor: fl || color }}
                  initial={{ scale: 0.5, opacity: 1 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 1.1, repeat: fl ? 0 : Infinity }}
                />
              )}
              <m.span
                className="block rounded-full border-[3px] shadow-md group-hover:scale-125 group-focus-visible:ring-4 group-focus-visible:ring-amber-300 transition-transform"
                style={{ borderColor: fl ? '#fff' : color, background: fl || (isActive ? color : 'rgba(255,255,255,0.95)') }}
                animate={isActive || fl ? { width: 20, height: 20 } : { width: [12, 15, 12], height: [12, 15, 12] }}
                transition={isActive || fl ? { type: 'spring', bounce: 0.6 } : { duration: 2.2, repeat: Infinity, delay: ((p.x + p.y) % 7) * 0.2 }}
              />
            </button>
          );
        })}

      {/* Nombre de la parte elegida, con una línea hacia ella */}
      <AnimatePresence>
        {activePart && label && (
          <m.div key={`et-${activePart.id}`} className="pointer-events-none absolute z-30" style={pct(activePart)} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ type: 'spring', bounce: 0.45, duration: 0.45 }}>
            <span className={`absolute top-0 h-0.5 w-8 ${activePart.x > VISTAS[activePart.vista].w / 2 ? 'left-2' : 'right-2'}`} style={{ background: color }} />
            <span
              className={`absolute -top-5 ${activePart.x > VISTAS[activePart.vista].w / 2 ? 'left-10' : 'right-10'} whitespace-nowrap rounded-2xl bg-white px-3 py-1.5 text-lg font-black shadow-xl ring-2`}
              style={{ color, '--tw-ring-color': color }}
            >
              {activePart.id === 'corazon' && <Heart className="mr-1 inline h-4 w-4 fill-rose-500 text-rose-500 anim-latido" aria-hidden="true" />}
              {label(activePart)}
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
});
Face.displayName = 'Face';

const BodyFigure = forwardRef(({ parts, vista = 'frente', onFlip, active, flash, onPick, label, color = '#15803d', showDots = true, spotlight = true, placed, className = '', hint }, ref) => {
  const flip = () => onFlip?.(vista === 'frente' ? 'espalda' : 'frente');
  return (
    <div className={`relative mx-auto w-full max-w-[20rem] ${className}`}>
      {/* Halo de color detrás del cuerpo */}
      <m.span className="pointer-events-none absolute left-1/2 top-1/2 h-[80%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: color, opacity: 0.18 }} animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} aria-hidden="true" />
      <m.div className="relative aspect-[290/577] w-full [perspective:1400px]" onPanEnd={(e, info) => Math.abs(info.offset.x) > 70 && Math.abs(info.offset.y) < 60 && flip()}>
        <m.div className="absolute inset-0 [transform-style:preserve-3d]" animate={{ rotateY: vista === 'frente' ? 0 : 180 }} transition={{ type: 'spring', stiffness: 70, damping: 14 }}>
          <Face ref={vista === 'frente' ? ref : undefined} vista="frente" parts={parts.filter((p) => p.vista === 'frente')} active={active} flash={flash} onPick={onPick} label={label} color={color} showDots={showDots} spotlight={spotlight} placed={placed} />
          <Face ref={vista === 'espalda' ? ref : undefined} vista="espalda" back parts={parts.filter((p) => p.vista === 'espalda')} active={active} flash={flash} onPick={onPick} label={label} color={color} showDots={showDots} spotlight={spotlight} placed={placed} />
        </m.div>
      </m.div>
      {/* Sombra en el suelo */}
      <span className="pointer-events-none mx-auto -mt-3 block h-4 w-2/3 rounded-full bg-stone-900/15 blur-sm" aria-hidden="true" />
      {onFlip && (
        <div className="mt-4 flex justify-center">
          <m.button
            type="button"
            onClick={flip}
            whileTap={{ scale: 0.92 }}
            animate={hint ? { scale: [1, 1.08, 1] } : { scale: 1 }}
            transition={hint ? { duration: 0.9, repeat: Infinity } : undefined}
            className={`ficha inline-flex items-center gap-2 min-h-11 px-5 rounded-full font-black ${hint ? 'border-amber-500 bg-amber-400 text-amber-950' : 'border-stone-300 bg-white text-stone-800'}`}
          >
            <RotateCw className="w-5 h-5" aria-hidden="true" /> {vista === 'frente' ? 'Ver de espalda' : 'Ver de frente'}
          </m.button>
        </div>
      )}
    </div>
  );
});
BodyFigure.displayName = 'BodyFigure';

export default BodyFigure;
