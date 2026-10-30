// Entrada escalonada con GSAP: los hijos directos suben y aparecen uno tras otro al montarse.
// Con "reducir movimiento" no hace nada (el contenido ya está visible).
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const StaggerIn = ({ as: Tag = 'div', children, stagger = 0.07, y = 18, delay = 0, className, ...rest }) => {
  const ref = useRef(null);
  useGSAP(
    () => {
      const items = ref.current?.children;
      if (!items?.length) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      gsap.from(items, { opacity: 0, y, duration: 0.6, delay, stagger, ease: 'power3.out', clearProps: 'opacity,transform' });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
};

export default StaggerIn;
