// Selector de idioma: una tarjeta por lengua (de los paquetes de idioma), con su llamita sticker.
// El fondo de color se desliza a la tarjeta elegida (Motion layoutId).
import * as m from 'motion/react-m';
import { Check, MapPin } from 'lucide-react';
import { LANGUAGES, languageStyle } from '../languages';
import { LlamaImage } from './Mascot';
import { playTap } from '../utils/sounds';

const POSES = ['bienvenida', 'hablando', 'escuchando', 'leyendo'];

const LanguagePicker = ({ value, onChange }) => (
  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Idioma">
    {LANGUAGES.map((lang, i) => {
      const selected = lang.id === value;
      const theme = languageStyle(lang.id);
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
          className={`group relative isolate overflow-hidden rounded-3xl border-2 p-4 sm:p-5 pr-28 sm:pr-32 text-left min-h-[7.5rem] transition-colors ${
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
          {selected && <span className="tejido-andino absolute inset-x-0 bottom-0 h-2 opacity-80" aria-hidden="true" />}
          <span className={`block text-xs font-black uppercase tracking-widest ${selected ? 'text-white/80' : theme.text}`}>{lang.nombreNativo}</span>
          <span className="block text-2xl sm:text-3xl font-black">{lang.nombre}</span>
          <span className={`mt-1 flex items-center gap-1 text-sm font-semibold ${selected ? 'text-white/85' : 'text-stone-600'}`}>
            <MapPin className="w-4 h-4 shrink-0" aria-hidden="true" />
            {lang.variedad} · {lang.region}
          </span>
          {selected && (
            <m.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.6 }}
              className="absolute top-3 left-3 sm:static sm:mt-2 sm:inline-flex hidden items-center gap-1 rounded-full bg-white/25 px-2.5 py-0.5 text-xs font-black"
            >
              <Check className="w-3.5 h-3.5" strokeWidth={3} aria-hidden="true" /> Aprendiendo
            </m.span>
          )}
          <span
            className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-24 sm:w-28 aspect-square transition-transform duration-300 ${selected ? 'scale-105' : 'grayscale-[40%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100'}`}
            aria-hidden="true"
          >
            <span className={`block w-full h-full ${selected ? 'llama llama-reposo' : ''}`}>
              <LlamaImage pose={POSES[i % POSES.length]} sticker sizes="7rem" />
            </span>
          </span>
        </m.button>
      );
    })}
  </div>
);

export default LanguagePicker;
