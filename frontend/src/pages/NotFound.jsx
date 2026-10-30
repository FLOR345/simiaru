// Página no encontrada: la llamita busca con su lupa y ofrece volver.
import { Link } from 'react-router-dom';
import * as m from 'motion/react-m';
import { Home, BookOpen, Gamepad2 } from 'lucide-react';
import Mascot from '../components/Mascot';
import Decor from '../components/Decor';

const NotFound = () => {
  let logged = false;
  try {
    logged = Boolean(localStorage.getItem('token') || localStorage.getItem('isGuest') === 'true');
  } catch {
    // almacenamiento bloqueado
  }
  return (
    <main className="fondo-burbujas relative isolate min-h-screen flex items-center justify-center px-4 py-12 text-stone-900">
      <Decor />
      <div className="max-w-xl text-center">
        <Mascot pose="buscando" sticker mood="think" size="w-44 sm:w-52" bubble="top" className="mx-auto" eager say={<p className="font-black text-lg">¿Mana kanchu? ¡No la encuentro!</p>} />
        <p className="mt-6 flex justify-center text-7xl sm:text-8xl font-black texto-degradado" aria-label="404">
          {['4', '0', '4'].map((d, i) => (
            <m.span
              key={i}
              aria-hidden="true"
              initial={{ opacity: 0, y: -40, rotate: -12 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.2 + i * 0.12 }}
              whileHover={{ y: -10, rotate: i === 1 ? 0 : i === 0 ? -8 : 8, scale: 1.1 }}
              className="inline-block cursor-default"
            >
              {d}
            </m.span>
          ))}
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-black">Esta página no existe</h1>
        <p className="mt-2 text-stone-600">Puede que el enlace esté mal escrito o que la página se haya movido.</p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <Link to={logged ? '/dashboard' : '/'} className="ficha inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-2xl border-green-800 bg-green-600 hover:bg-green-500 text-white font-black">
            <Home className="w-5 h-5" aria-hidden="true" /> {logged ? 'Ir a mi panel' : 'Ir al inicio'}
          </Link>
          <Link to="/dictionary" className="ficha inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-2xl border-stone-300 bg-white font-bold hover:bg-stone-50">
            <BookOpen className="w-5 h-5" aria-hidden="true" /> Diccionario
          </Link>
          {logged && (
            <Link to="/practica" className="ficha inline-flex items-center justify-center gap-2 min-h-12 px-6 rounded-2xl border-amber-300 bg-amber-50 font-bold text-amber-900 hover:bg-amber-100">
              <Gamepad2 className="w-5 h-5" aria-hidden="true" /> Juegos
            </Link>
          )}
        </div>
      </div>
    </main>
  );
};

export default NotFound;
