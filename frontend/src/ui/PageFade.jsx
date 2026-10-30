// Al cambiar de pantalla el contenido se funde suavemente (solo opacidad: no crea un bloque
// de contención que rompa los elementos fijos). Motion; con "reducir movimiento" ya es solo fundido.
import * as m from 'motion/react-m';
import { useLocation } from 'react-router-dom';

const PageFade = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <m.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
      {children}
    </m.div>
  );
};

export default PageFade;
