// Ilustración de un niño andino (SVG propio, de frente) con puntos que se pueden tocar en cada parte del cuerpo.
// La camisa lleva el color de la lengua (verde quechua, azul aimara) y una franja de rombos como un tejido.
// Props: parts (con x, y en el viewBox 0 0 400 760), active, flash = { id, ok }, onPick, showDots, label(part).
import { useId } from 'react';
import * as m from 'motion/react-m';
import { AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';

const SKIN = '#c68a5c';
const SKIN_SHADE = '#a96f45';
const HAIR = '#24160f';

const BodyFigure = ({ parts, active, flash, onPick, showDots = true, label, color = '#15803d', className = '' }) => {
  const uid = useId().replace(/:/g, '');
  const pick = (p) => onPick?.(p);
  const activePart = parts.find((p) => p.id === active);

  return (
    <div className={`relative mx-auto aspect-[400/760] w-full max-w-[22rem] select-none ${className}`}>
      <m.svg
        viewBox="0 0 400 760"
        className="absolute inset-0 h-full w-full overflow-visible"
        animate={{ scaleY: [1, 1.008, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ originY: 1 }}
        role="img"
        aria-label="Ilustración de un niño de frente para aprender las partes del cuerpo"
      >
        <defs>
          <radialGradient id={`piel-${uid}`} cx="45%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#d9a074" />
            <stop offset="100%" stopColor={SKIN} />
          </radialGradient>
          <linearGradient id={`camisa-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.82" />
          </linearGradient>
          <pattern id={`rombos-${uid}`} width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#facc15" />
            <path d="M9 1 L17 9 L9 17 L1 9 Z" fill="#dc2626" />
            <path d="M9 5 L13 9 L9 13 L5 9 Z" fill="#fff7ed" />
          </pattern>
          <clipPath id={`torso-${uid}`}>
            <path d="M128 236 Q200 216 272 236 L292 262 L300 332 L262 340 L262 432 L138 432 L138 340 L100 332 L108 262 Z" />
          </clipPath>
          <filter id={`sombra-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#1c1917" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* Sombra en el suelo */}
        <ellipse cx="200" cy="736" rx="120" ry="14" fill="#1c1917" opacity="0.12" />

        <g filter={`url(#sombra-${uid})`}>
          {/* Piernas */}
          <rect x="152" y="508" width="40" height="190" rx="18" fill={`url(#piel-${uid})`} />
          <rect x="208" y="508" width="40" height="190" rx="18" fill={`url(#piel-${uid})`} />
          <ellipse cx="172" cy="600" rx="16" ry="10" fill={SKIN_SHADE} opacity="0.35" />
          <ellipse cx="228" cy="600" rx="16" ry="10" fill={SKIN_SHADE} opacity="0.35" />
          {/* Pies con ojotas */}
          <ellipse cx="170" cy="708" rx="30" ry="14" fill={`url(#piel-${uid})`} />
          <ellipse cx="230" cy="708" rx="30" ry="14" fill={`url(#piel-${uid})`} />
          <path d="M142 716 Q170 728 198 716 L198 722 Q170 734 142 722 Z" fill="#3f2a1d" />
          <path d="M202 716 Q230 728 258 716 L258 722 Q230 734 202 722 Z" fill="#3f2a1d" />
          <path d="M160 700 L170 712 L182 700" stroke="#3f2a1d" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M218 700 L230 712 L242 700" stroke="#3f2a1d" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Pantalón corto */}
          <path d="M136 424 L264 424 L270 524 L210 524 L200 474 L190 524 L130 524 Z" fill="#1e293b" />
          <path d="M200 432 L200 474" stroke="#0f172a" strokeWidth="3" />

          {/* Brazos */}
          <path d="M104 326 L134 336 L122 452 L96 454 Z" fill={`url(#piel-${uid})`} />
          <path d="M296 326 L266 336 L278 452 L304 454 Z" fill={`url(#piel-${uid})`} />
          <ellipse cx="296" cy="382" rx="10" ry="7" fill={SKIN_SHADE} opacity="0.35" />
          {/* Manos y dedos */}
          <circle cx="104" cy="470" r="20" fill={`url(#piel-${uid})`} />
          <circle cx="296" cy="470" r="20" fill={`url(#piel-${uid})`} />
          {[-12, -4, 4, 12].map((dx) => (
            <rect key={`i${dx}`} x={104 + dx - 3.5} y="478" width="7" height="20" rx="3.5" fill={SKIN} />
          ))}
          {[-12, -4, 4, 12].map((dx) => (
            <rect key={`d${dx}`} x={296 + dx - 3.5} y="478" width="7" height="20" rx="3.5" fill={SKIN} />
          ))}
          <rect x="314" y="462" width="7" height="16" rx="3.5" fill={SKIN} transform="rotate(-35 317 470)" />
          <rect x="79" y="462" width="7" height="16" rx="3.5" fill={SKIN} transform="rotate(35 82 470)" />

          {/* Camisa con franja de rombos */}
          <path d="M128 236 Q200 216 272 236 L292 262 L300 332 L262 340 L262 432 L138 432 L138 340 L100 332 L108 262 Z" fill={`url(#camisa-${uid})`} />
          <g clipPath={`url(#torso-${uid})`}>
            <rect x="90" y="262" width="220" height="20" fill={`url(#rombos-${uid})`} />
            <rect x="90" y="284" width="220" height="5" fill="#fff" opacity="0.85" />
            <rect x="90" y="257" width="220" height="5" fill="#fff" opacity="0.85" />
            <rect x="90" y="404" width="220" height="10" fill={`url(#rombos-${uid})`} />
          </g>
          {/* Cuello de la camisa */}
          <path d="M178 230 Q200 250 222 230" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.9" />

          {/* Cuello */}
          <rect x="185" y="194" width="30" height="40" rx="10" fill={SKIN_SHADE} />

          {/* Orejas */}
          <ellipse cx="136" cy="136" rx="13" ry="19" fill={SKIN} />
          <ellipse cx="264" cy="136" rx="13" ry="19" fill={SKIN} />
          <ellipse cx="137" cy="137" rx="6" ry="10" fill={SKIN_SHADE} opacity="0.5" />
          <ellipse cx="263" cy="137" rx="6" ry="10" fill={SKIN_SHADE} opacity="0.5" />

          {/* Cabeza */}
          <ellipse cx="200" cy="130" rx="64" ry="72" fill={`url(#piel-${uid})`} />
          {/* Cabello */}
          <path d="M136 124 C130 66 168 46 202 46 C240 46 272 66 264 124 C258 98 242 86 222 90 C206 78 182 74 166 88 C150 96 140 108 136 124 Z" fill={HAIR} />
          <path d="M150 92 C158 104 170 108 184 100" stroke="#3b2618" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Cejas */}
          <path d="M163 110 Q176 103 189 109" stroke={HAIR} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M211 109 Q224 103 237 110" stroke={HAIR} strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Ojos (parpadean) */}
          <m.g animate={{ scaleY: [1, 1, 0.1, 1] }} transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.9, 0.95, 1] }} style={{ originY: '126px' }}>
            <ellipse cx="176" cy="126" rx="12" ry="9" fill="#fff" />
            <ellipse cx="224" cy="126" rx="12" ry="9" fill="#fff" />
            <circle cx="177" cy="127" r="6" fill="#3b2416" />
            <circle cx="225" cy="127" r="6" fill="#3b2416" />
            <circle cx="179" cy="125" r="1.8" fill="#fff" />
            <circle cx="227" cy="125" r="1.8" fill="#fff" />
          </m.g>
          {/* Nariz */}
          <path d="M200 134 Q207 150 199 154 Q194 155 192 152" stroke={SKIN_SHADE} strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Mejillas */}
          <circle cx="160" cy="158" r="11" fill="#f472b6" opacity="0.28" />
          <circle cx="240" cy="158" r="11" fill="#f472b6" opacity="0.28" />
          {/* Boca */}
          <path d="M182 170 Q200 190 218 170 Q200 178 182 170 Z" fill="#7f1d1d" />
          <path d="M188 172 Q200 178 212 172 L211 175 Q200 180 189 175 Z" fill="#fff" />
        </g>

        {/* El corazón aparece y late cuando se elige */}
        <AnimatePresence>
          {active === 'corazon' && (
            <m.g key="corazon" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [1, 1.18, 1], opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ scale: { duration: 0.8, repeat: Infinity } }} style={{ originX: '172px', originY: '296px' }}>
              <path d="M172 312 C150 296 152 280 164 280 C170 280 172 285 172 287 C172 285 174 280 180 280 C192 280 194 296 172 312 Z" fill="#e11d48" stroke="#fff" strokeWidth="3" />
            </m.g>
          )}
        </AnimatePresence>

        {/* Puntos que se pueden tocar */}
        {showDots &&
          parts.map((p) => {
            const isActive = p.id === active;
            const fl = flash?.id === p.id ? (flash.ok ? '#16a34a' : '#dc2626') : null;
            return (
              <g
                key={p.id}
                role="button"
                tabIndex={0}
                aria-label={label ? label(p) : p.es}
                className="cursor-pointer focus:outline-none [&:focus-visible>circle:last-child]:stroke-amber-400"
                onClick={() => pick(p)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), pick(p))}
              >
                {/* Área grande para tocar con el dedo */}
                <circle cx={p.x} cy={p.y} r={Math.max(p.r, 22)} fill="transparent" />
                {(isActive || fl) && (
                  <m.circle cx={p.x} cy={p.y} r={p.r} fill="none" stroke={fl || color} strokeWidth="4" initial={{ r: 8, opacity: 0.9 }} animate={{ r: 8 + p.r, opacity: 0 }} transition={{ duration: 1.1, repeat: fl ? 0 : Infinity }} />
                )}
                <m.circle
                  cx={p.x}
                  cy={p.y}
                  fill={fl || (isActive ? color : '#ffffff')}
                  fillOpacity={isActive || fl ? 1 : 0.92}
                  stroke={fl ? '#fff' : color}
                  strokeWidth="3"
                  initial={{ r: 5 }}
                  animate={isActive || fl ? { r: 9 } : { r: [5, 6.5, 5] }}
                  transition={isActive || fl ? { type: 'spring', bounce: 0.6 } : { duration: 2.2, repeat: Infinity, delay: ((p.x + p.y) % 7) * 0.2 }}
                />
              </g>
            );
          })}
      </m.svg>

      {/* Etiqueta de la parte elegida */}
      <AnimatePresence>
        {activePart && label && (
          <m.div
            key={activePart.id}
            className="pointer-events-none absolute z-10"
            style={{ left: `${(activePart.x / 400) * 100}%`, top: `${(activePart.y / 760) * 100}%` }}
            initial={{ opacity: 0, y: 6, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', bounce: 0.45, duration: 0.45 }}
          >
            <span
              className={`absolute ${activePart.x > 200 ? 'right-5' : 'left-5'} -top-5 whitespace-nowrap rounded-2xl bg-white px-3 py-1.5 text-lg font-black shadow-xl ring-2`}
              style={{ color, '--tw-ring-color': color }}
            >
              {activePart.id === 'corazon' && <Heart className="mr-1 inline h-4 w-4 fill-rose-500 text-rose-500" aria-hidden="true" />}
              {label(activePart)}
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BodyFigure;
