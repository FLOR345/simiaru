// Galería de la portada: la llamita en sus momentos. Al tocar una, salta y cuenta qué hace.
import { useState } from 'react';
import { LlamaImage } from './Mascot';
import { playTap } from '../utils/sounds';

const MOMENTS = [
  ['bienvenida', 'Te recibe', 'Cada día te saluda en quechua o aymara: «¡Rimaykullayki!»'],
  ['escuchando', 'Escucha contigo', 'Oyes cada palabra y puedes repetirla despacio.'],
  ['leyendo', 'Lee contigo', 'Cuentos, proverbios y canciones con su traducción al lado.'],
  ['escribiendo', 'Practica contigo', 'Escribe, ordena y empareja palabras en ejercicios cortos.'],
  ['pensando', 'Piensa contigo', 'Adivinanzas andinas para pensar antes de responder.'],
  ['reintentar', 'Te anima', 'Si fallas, la pregunta vuelve al final para repasarla.'],
  ['celebrando', 'Celebra contigo', 'Rachas, puntos y confeti cuando aciertas seguido.'],
  ['logro', 'Premia tu esfuerzo', 'Insignias y récords en los juegos de práctica.'],
];

const LlamaGallery = () => {
  const [active, setActive] = useState(null);
  const [beat, setBeat] = useState(0);
  return (
    <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto">
      {MOMENTS.map(([pose, title, text], i) => {
        const on = active === pose;
        return (
          <li key={pose} className="anim-entra" style={{ '--i': i }}>
            <button
              type="button"
              aria-pressed={on}
              onClick={() => {
                playTap();
                setActive(on ? null : pose);
                setBeat((b) => b + 1);
              }}
              className={`group tarjeta-viva relative w-full h-full rounded-3xl border-2 p-4 sm:p-5 text-center transition-colors ${
                on ? 'border-green-600 bg-gradient-to-b from-green-50 to-white shadow-xl' : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <span
                key={on ? `on-${beat}` : 'off'}
                className={`block mx-auto w-28 sm:w-36 aspect-square origin-bottom llama ${on ? 'llama-salta' : 'transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-2'}`}
                aria-hidden="true"
              >
                <LlamaImage pose={pose} />
              </span>
              <span className="mt-3 block text-lg font-black">{title}</span>
              <span className={`block text-sm text-stone-600 transition-all duration-300 ${on ? 'opacity-100 max-h-24 mt-1' : 'opacity-0 max-h-0 sm:opacity-100 sm:max-h-24 sm:mt-1'}`}>{text}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default LlamaGallery;
