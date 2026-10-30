// Biblioteca: catálogo de libros en quechua y aimara con enlaces a la fuente oficial.
// No se copian portadas ni se guardan PDF: cada tarjeta lleva un ícono de libro sobre un fondo de color.
import { useMemo, useState } from 'react';
import * as m from 'motion/react-m';
import { BookOpen, BookMarked, Feather, Music2, Library, ExternalLink, Download, Landmark, Scale, CalendarDays, Search } from 'lucide-react';
import BIBLIOTECA from '../data/biblioteca';
import { getLanguage } from '../languages';

// Fondo e ícono de cada tarjeta, según el tipo de libro
const STYLE_BY_TYPE = {
  Poesía: { Icon: Feather, bg: 'from-fuchsia-500 via-pink-500 to-rose-500' },
  'Relatos y canciones': { Icon: Music2, bg: 'from-violet-500 via-purple-500 to-indigo-600' },
  Literatura: { Icon: BookMarked, bg: 'from-emerald-500 via-green-600 to-teal-700' },
  Relatos: { Icon: Library, bg: 'from-amber-400 via-orange-500 to-red-500' },
  Cuento: { Icon: BookOpen, bg: 'from-sky-400 via-blue-500 to-indigo-600' },
  Cuentos: { Icon: BookOpen, bg: 'from-cyan-500 via-sky-600 to-blue-700' },
};

const BookCard = ({ libro, index }) => {
  const { Icon, bg } = STYLE_BY_TYPE[libro.tipo] ?? { Icon: BookOpen, bg: 'from-stone-500 to-stone-700' };
  const lang = getLanguage(libro.idioma);
  return (
    <m.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', bounce: 0.3, duration: 0.6, delay: Math.min(index, 6) * 0.06 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm hover:shadow-xl transition-shadow"
    >
      {/* Portada oficial sobre un fondo de color con el tejido andino (si no hay portada, un ícono de libro) */}
      <div className={`relative ${libro.portada ? 'h-72 pt-10' : 'h-40'} bg-gradient-to-br ${bg} flex items-center justify-center overflow-hidden [perspective:900px]`}>
        <span className="absolute inset-0 opacity-20 [background:repeating-linear-gradient(135deg,#fff_0_6px,transparent_6px_22px)]" aria-hidden="true" />
        <span className="tejido-andino absolute inset-x-0 bottom-0 h-2.5 opacity-90" aria-hidden="true" />
        {libro.portada ? (
          <img
            src={libro.portada}
            alt={`Portada de «${libro.titulo}»`}
            loading="lazy"
            decoding="async"
            width="480"
            height="680"
            className="relative h-48 w-auto max-w-[70%] object-contain rounded-r-lg rounded-l-sm shadow-[6px_10px_24px_rgba(0,0,0,0.35)] ring-1 ring-black/10 transition-transform duration-500 ease-out group-hover:[transform:rotateY(-14deg)_scale(1.06)]"
          />
        ) : (
          <span className="relative w-20 h-20 rounded-3xl bg-white/20 ring-2 ring-white/40 backdrop-blur-sm flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" aria-hidden="true">
            <Icon className="w-10 h-10 text-white" strokeWidth={2} />
          </span>
        )}
        <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-stone-800">{lang?.nombre ?? libro.idioma}</span>
        <span className="absolute top-3 right-3 rounded-full bg-black/25 px-3 py-1 text-xs font-bold text-white">{libro.tipo}</span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-xl font-black leading-tight" lang={lang?.lang}>
          {libro.titulo}
        </h3>
        {libro.subtitulo && <p className="mt-0.5 text-sm font-semibold text-stone-500">{libro.subtitulo}</p>}
        <p className="mt-3 text-stone-700">{libro.descripcion}</p>

        <dl className="mt-4 space-y-1.5 text-sm text-stone-600">
          <div className="flex gap-2">
            <dt className="sr-only">Autor</dt>
            <Feather className="w-4 h-4 mt-0.5 shrink-0 text-stone-400" aria-hidden="true" />
            <dd>{libro.autor}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="sr-only">Fuente</dt>
            <Landmark className="w-4 h-4 mt-0.5 shrink-0 text-stone-400" aria-hidden="true" />
            <dd>{libro.fuente}</dd>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-stone-400" aria-hidden="true" />
              {libro.anio} · {libro.variedad}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-stone-400" aria-hidden="true" />
              Licencia {libro.licencia}
            </span>
          </div>
        </dl>

        {libro.creditoPortada && <p className="mt-3 text-xs text-stone-500">{libro.creditoPortada} · {libro.licencia}</p>}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:mt-auto sm:pt-5">
          <a
            href={libro.ficha}
            target="_blank"
            rel="noopener noreferrer"
            className="ficha flex-1 inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl border-green-800 bg-green-600 hover:bg-green-500 text-white text-sm font-black"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" /> Leer en la fuente oficial
          </a>
          {libro.descarga && (
            <a
              href={libro.descarga}
              target="_blank"
              rel="noopener noreferrer"
              className="ficha flex-1 inline-flex items-center justify-center gap-2 min-h-11 px-4 rounded-xl border-stone-300 bg-white hover:bg-stone-50 text-sm font-bold text-stone-800"
            >
              <Download className="w-4 h-4" aria-hidden="true" /> Descargar desde la fuente oficial
              {libro.peso && <span className="text-stone-500 font-semibold">({libro.peso})</span>}
            </a>
          )}
        </div>
      </div>
    </m.li>
  );
};

const BookLibrary = ({ idioma }) => {
  const [filter, setFilter] = useState('idioma'); // 'idioma' (la lengua elegida) o 'todos'
  const [query, setQuery] = useState('');
  const books = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BIBLIOTECA.filter((b) => (filter === 'todos' || b.idioma === idioma) && (!q || [b.titulo, b.subtitulo, b.autor, b.tipo, b.descripcion].some((f) => f?.toLowerCase().includes(q))));
  }, [filter, idioma, query]);
  const lang = getLanguage(idioma);

  return (
    <section className="mt-12" aria-labelledby="biblioteca-titulo">
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-6 sm:p-8 text-white mb-6">
        <span className="tejido-andino absolute inset-x-0 top-0 h-2" aria-hidden="true" />
        <Library className="pointer-events-none absolute -right-6 -bottom-8 w-44 h-44 text-white/10" aria-hidden="true" />
        <p className="text-xs font-black uppercase tracking-widest text-amber-300">Biblioteca</p>
        <h2 id="biblioteca-titulo" className="text-2xl sm:text-3xl font-black">
          Libros para seguir leyendo
        </h2>
        <p className="mt-1 max-w-2xl text-stone-300">
          Libros en quechua y aimara publicados con acceso abierto por fuentes oficiales. Los lees o descargas directamente desde su sitio: SimiAru solo te lleva hasta ellos.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="flex rounded-full bg-white/10 p-1" role="group" aria-label="Qué libros mostrar">
            {[
              ['idioma', `En ${lang?.nombre?.toLowerCase() ?? idioma}`],
              ['todos', 'Todos'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                aria-pressed={filter === id}
                onClick={() => setFilter(id)}
                className={`min-h-10 px-4 rounded-full text-sm font-bold transition-colors ${filter === id ? 'bg-white text-stone-900' : 'text-white/80 hover:text-white'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="relative flex-1 max-w-sm">
            <span className="sr-only">Buscar en la biblioteca</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar libro, autor o tipo"
              className="w-full min-h-10 pl-9 pr-3 rounded-full bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </label>
        </div>
      </div>

      {books.length > 0 ? (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {books.map((libro, i) => (
            <BookCard key={libro.id} libro={libro} index={i} />
          ))}
        </ul>
      ) : (
        <p className="rounded-3xl bg-white border border-stone-200 p-8 text-center text-stone-600">No encontramos libros con esa búsqueda.</p>
      )}
      <p className="mt-4 text-xs text-stone-500">
        Datos y portadas tomados de cada ficha oficial del Ministerio de Educación del Perú, que los publica con acceso abierto bajo las licencias indicadas. Se muestran sin modificar, solo reducidas de tamaño.
      </p>
    </section>
  );
};

export default BookLibrary;
