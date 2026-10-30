// Contenedor de notificaciones (React-Toastify): arriba a la derecha, debajo del encabezado.
// Cada tipo lleva a la llamita sticker con su pose: celebra los logros, se lamenta en los errores.
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LlamaImage } from './Mascot';

const POSES = { success: 'celebrando', error: 'reintentar', warning: 'pensando', info: 'alegre', default: 'alegre' };

const LlamaIcon = ({ type }) => (
  <span className="block w-11 h-11 shrink-0" aria-hidden="true">
    <LlamaImage pose={POSES[type] ?? 'alegre'} sticker sizes="3rem" />
  </span>
);

const Notifications = () => (
  <ToastContainer
    position="top-right"
    newestOnTop
    limit={4}
    closeOnClick={false}
    pauseOnHover
    pauseOnFocusLoss
    draggable
    draggablePercent={40}
    transition={Slide}
    icon={LlamaIcon}
    theme="light"
    style={{ top: '5rem' }}
    toastClassName="simiaru-toast"
  />
);

export default Notifications;
