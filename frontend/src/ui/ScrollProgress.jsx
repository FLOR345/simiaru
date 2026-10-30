// Barra fina arriba que se llena al bajar por la página (Motion). Mismo degradado verde → azul → morado.
// Con "reducir movimiento" no se muestra.
import * as m from 'motion/react-m';
import { useScroll, useSpring, useReducedMotion } from 'motion/react';

const ScrollProgress = () => {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  if (reduce) return null;
  return (
    <m.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed inset-x-0 top-0 z-[60] h-1 pointer-events-none bg-gradient-to-r from-green-600 via-blue-600 to-purple-600"
    />
  );
};

export default ScrollProgress;
