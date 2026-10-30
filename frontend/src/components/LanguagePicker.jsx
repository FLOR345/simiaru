// Selector de idioma: una tarjeta por lengua (de los paquetes de idioma), sin imágenes:
// ícono del paisaje de cada lengua, tejido andino, y tu avance real en cada una.
// El fondo de color se desliza a la tarjeta elegida (Motion layoutId).
import * as m from 'motion/react-m';
import { Check, MapPin, Mountain, Waves, Sun, Sparkles } from 'lucide-react';
import { LANGUAGES, languageStyle } from '../languages';
import { playTap } from '../utils/sounds';

// Quechua: las montañas; aymara: el lago Titicaca. Lenguas nuevas: sol o destellos.
const ICONS = { quechua: Mountain, aymara: Waves };
const FALLBACK_ICONS = [Sun, Sparkles];

const LanguagePicker = ({ value, onChange, stats = {} }) => (
  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Idioma">
    {LANGUAGES.map((lang, i) => {
      const selected = lang.id === value;
      const theme = languageStyle(lang.id);
      const Icon = ICONS[lang.id] ?? FALLBACK_ICONS[i % FALLBACK_ICONS.length];
      const st = stats[lang.id];
      const pct = st?.total ? Math.round((st.done / st.total) * 100) : 0;
      return (
        <m.button
          key={lang.id}
          type="button"
          role="radio"
          aria-checked={selected}
          onClick={() => {
            if (selected) return;
            playTap();
            onChange(lang.id);
          }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.98 }}
          className={`group relative isolate overflow-hidden rounded-3xl border-2 p-5 sm:p-6 text-left transition-colors ${
            selected ? 'border-transparent text-white shadow-xl' : 'border-stone-200 bg-white text-stone-900 hover:border-stone-300'
          }`}
        >
          {selected && (
            <m.span
              layoutId="idioma-elegido"
              className={`absolute inset-0 -z-10 bg-gradient-to-br ${theme.gradient}`}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              aria-hidden="true"
            />
          )}
          {/* Tejido andino a la izquierda y un gran ícono del paisaje como marca de agua */}
          <span className={`tejido-andino absolute inset-y-0 left-0 w-2 ${selected ? 'opacity-90' : 'opacity-60'}`} aria-hidden="true" />
          <Icon
            className={`pointer-events-none absolute -right-4 -bottom-6 w-36 h-36 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${selected ? 'text-white/15' : `${theme.text} opacity-[0.07]`}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />

          <span className="relative flex items-start gap-4">
            <span
              className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:rotate-6 ${
                selected ? 'bg-white/20 ring-2 ring-white/40' : `bg-gradient-to-br ${theme.gradient} text-white`
              }`}
              aria-hidden="true"
            >
              <Icon className="w-7 h-7" />
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-xs font-black uppercase tracking-widest ${selected ? 'text-white/80' : theme.text}`}>{lang.nombreNativo}</span>
              <span className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black">{lang.nombre}</span>
                {selected && (
                  <m.span
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', bounce: 0.6 }}
                    className="w-6 h-6 rounded-full bg-white text-green-700 flex items-center justify-center"
                    aria-hidden="true"
                  >
                    <Check className="w-4 h-4" strokeWidth={3.5} />
                  </m.span>
                )}
              </span>
              <span className={`mt-0.5 flex items-center gap-1 text-sm font-semibold ${selected ? 'text-white/85' : 'text-stone-600'}`}>
                <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">
                  {lang.variedad} · {lang.region}
                </span>
              </span>
            </span>
          </span>

          {/* Avance en esta lengua */}
          <span className="relative mt-4 block">
            <span className={`flex items-center justify-between text-sm font-bold ${selected ? 'text-white' : 'text-stone-700'}`}>
              <span>{st ? `${st.done} de ${st.total} lecciones` : 'Cargando avance…'}</span>
              <span className="tabular-nums">{pct}%</span>
            </span>
            <span className={`mt-1.5 block h-2.5 rounded-full overflow-hidden ${selected ? 'bg-white/25' : 'bg-stone-200'}`} aria-hidden="true">
              <m.span
                className={`block h-full rounded-full ${selected ? 'bg-gradient-to-r from-amber-300 to-yellow-200' : `bg-gradient-to-r ${theme.gradient}`}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
              />
            </span>
          </span>
        </m.button>
      );
    })}
  </div>
);

export default LanguagePicker;
