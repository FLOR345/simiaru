// Entrada al hacer scroll con Motion: el bloque sube un poco y aparece una sola vez.
// Usa los componentes livianos "m" (el motor llega con LazyMotion, ver App.jsx).
// Con "reducir movimiento" solo aparece (sin desplazarse).
import * as m from 'motion/react-m';
import { useReducedMotion } from 'motion/react';

const EASE_OUT = [0.23, 1, 0.32, 1];

const Reveal = ({ as = 'div', children, delay = 0, y = 24, className, ...rest }) => {
  const reduce = useReducedMotion();
  // Acceso estático (m.li / m.div): así Vite incluye solo esos dos y no todos los elementos de Motion
  const Component = as === 'li' ? m.li : m.div;
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: reduce ? 0.2 : 0.6, delay, ease: EASE_OUT }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Reveal;
