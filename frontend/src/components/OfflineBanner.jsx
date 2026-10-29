// Aviso discreto cuando no hay conexión, y sincronización del progreso guardado al volver.
import { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import { syncProgress } from '../services/offlineSync';
import { flush } from '../services/telemetry';

const OfflineBanner = () => {
  const [online, setOnline] = useState(() => (typeof navigator === 'undefined' ? true : navigator.onLine));

  useEffect(() => {
    const goOnline = async () => {
      setOnline(true);
      const sent = await syncProgress();
      flush();
      if (sent > 0) toast.success('Progreso sincronizado', { description: `Se envió el resultado de ${sent} ${sent === 1 ? 'lección' : 'lecciones'} que hiciste sin conexión.` });
    };
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    // Al abrir la app, por si quedó algo pendiente de una visita anterior
    if (navigator.onLine) syncProgress();
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  if (online) return null;
  return (
    <div role="status" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 anim-entra flex items-center gap-2 px-4 py-2.5 rounded-full bg-stone-900 text-white text-sm font-semibold shadow-xl max-w-[calc(100%-2rem)]">
      <WifiOff className="w-4 h-4 shrink-0" aria-hidden="true" />
      Sin conexión: puedes repetir las lecciones que ya abriste
    </div>
  );
};

export default OfflineBanner;
