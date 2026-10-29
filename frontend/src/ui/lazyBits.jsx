// Componentes de React Bits que van debajo de la primera pantalla: se descargan aparte.
// Mientras llegan se muestra el contenido normal (el número final, la tarjeta, la foto),
// así nunca hay un hueco ni un salto.
import { lazy, Suspense } from 'react';

const CountUpLazy = lazy(() => import('../components/reactbits/CountUp'));
const SpotlightCardLazy = lazy(() => import('../components/reactbits/SpotlightCard'));
const TiltedCardLazy = lazy(() => import('../components/reactbits/TiltedCard'));

const formatNumber = (value, separator) =>
  separator ? String(value).replace(/\B(?=(\d{3})+(?!\d))/g, separator) : String(value);

export const CountUp = (props) => (
  <Suspense fallback={<span>{`${props.prefix ?? ''}${formatNumber(props.to, props.separator)}${props.suffix ?? ''}`}</span>}>
    <CountUpLazy {...props} />
  </Suspense>
);

// Mismo aspecto que la tarjeta final, sin el foco de luz
export const SpotlightCard = ({ children, className = '', ...props }) => (
  <Suspense fallback={<div className={`relative isolate overflow-hidden rounded-3xl bg-white ${className}`}>{children}</div>}>
    <SpotlightCardLazy className={className} {...props}>
      {children}
    </SpotlightCardLazy>
  </Suspense>
);

export const TiltedCard = (props) => (
  <Suspense
    fallback={
      <img
        src={props.imageSrc}
        alt={props.altText}
        loading="lazy"
        className="w-full object-cover"
        style={{ height: props.imageHeight, borderRadius: props.radius }}
      />
    }
  >
    <TiltedCardLazy {...props} />
  </Suspense>
);
