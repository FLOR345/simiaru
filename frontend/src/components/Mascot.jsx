import llamaPng from '../assets/llamita.png';
import llamaWebp from '../assets/llamita.webp';

// La llamita de SimiAru acompaña al estudiante: respira en reposo, salta al acertar,
// se agacha al fallar y celebra las rachas. Las animaciones son CSS (index.css, "llama-*"):
// no frenan las transiciones de Motion y con "reducir movimiento" se quedan quietas.
const MOOD_CLASS = {
  idle: 'llama-reposo',
  happy: 'llama-salta',
  cheer: 'llama-celebra',
  sad: 'llama-triste',
  think: 'llama-piensa',
};

export const LlamaImage = ({ className = '', eager = false }) => (
  <picture>
    <source srcSet={llamaWebp} type="image/webp" />
    <img
      src={llamaPng}
      alt=""
      width="513"
      height="640"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable="false"
      className={`select-none w-full h-auto ${className}`}
    />
  </picture>
);

/**
 * mood: idle | happy | cheer | sad | think
 * beat: cambia este número para repetir la animación del mismo ánimo
 * say: texto (o nodos) del globo de diálogo
 * bubble: 'right' (globo a la derecha) o 'top' (globo arriba)
 */
const Mascot = ({ mood = 'idle', beat = 0, say, size = 'w-24 sm:w-28', bubble = 'right', className = '', eager = false }) => (
  <div className={`flex ${bubble === 'top' ? 'flex-col-reverse items-center' : 'items-end'} gap-3 ${className}`}>
    <div key={`${mood}-${beat}`} className={`${size} shrink-0 origin-bottom llama ${MOOD_CLASS[mood] ?? MOOD_CLASS.idle}`} aria-hidden="true">
      <LlamaImage eager={eager} />
    </div>
    {say && (
      <div
        className={`globo anim-globo ${bubble === 'top' ? 'globo-abajo origin-bottom' : 'globo-izquierda origin-bottom-left mb-6'} relative min-w-0 rounded-2xl border-2 border-stone-200 bg-white px-4 py-3 text-stone-900 shadow-sm`}
      >
        {say}
      </div>
    )}
  </div>
);

export default Mascot;
