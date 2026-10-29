// La llamita de SimiAru: 16 poses (assets/llama) y animaciones CSS ("llama-*" en index.css).
// La pose dice QUÉ hace (escucha, lee, celebra…); el ánimo (mood) dice CÓMO se mueve.
// Las animaciones son CSS: no frenan las transiciones de Motion y con "reducir movimiento" se quedan quietas.

const WEBP = import.meta.glob('../assets/llama/*.webp', { eager: true, import: 'default' });
const PNG = import.meta.glob('../assets/llama/*.png', { eager: true, import: 'default' });
const byName = (files) => Object.fromEntries(Object.entries(files).map(([path, url]) => [path.split('/').pop().replace(/\.\w+$/, ''), url]));
const POSES_WEBP = byName(WEBP);
const POSES_PNG = byName(PNG);

export const POSES = Object.keys(POSES_WEBP);

const MOOD_CLASS = {
  idle: 'llama-reposo',
  happy: 'llama-salta',
  cheer: 'llama-celebra',
  sad: 'llama-triste',
  think: 'llama-piensa',
  wow: 'llama-sorpresa',
};

// Pose por defecto según el ánimo
const MOOD_POSE = {
  idle: 'alegre',
  happy: 'alegre',
  cheer: 'celebrando',
  sad: 'reintentar',
  think: 'pensando',
  wow: 'sorprendida',
};

export const LlamaImage = ({ pose = 'alegre', className = '', eager = false }) => {
  const name = POSES_WEBP[pose] ? pose : 'alegre';
  return (
    <picture className="block w-full h-full">
      <source srcSet={POSES_WEBP[name]} type="image/webp" />
      <img
        key={name}
        src={POSES_PNG[name]}
        alt=""
        width="560"
        height="560"
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable="false"
        className={`anim-pose select-none w-full h-full object-contain object-bottom ${className}`}
      />
    </picture>
  );
};

/**
 * mood: idle | happy | cheer | sad | think | wow  (cómo se mueve)
 * pose: una de POSES (qué está haciendo); si falta, se elige según el ánimo
 * beat: cambia este número para repetir la animación del mismo ánimo
 * say: texto (o nodos) del globo de diálogo
 * bubble: 'right' (globo a la derecha) o 'top' (globo arriba)
 */
const Mascot = ({ mood = 'idle', pose, beat = 0, say, size = 'w-24 sm:w-28', bubble = 'right', className = '', eager = false }) => (
  <div className={`flex ${bubble === 'top' ? 'flex-col-reverse items-center' : 'items-end'} gap-3 ${className}`}>
    <div key={`${mood}-${beat}`} className={`${size} aspect-square shrink-0 origin-bottom llama ${MOOD_CLASS[mood] ?? MOOD_CLASS.idle}`} aria-hidden="true">
      <LlamaImage pose={pose ?? MOOD_POSE[mood] ?? 'alegre'} eager={eager} />
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
