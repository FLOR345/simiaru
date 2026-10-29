// Modo aula para docentes: crear aulas, compartir el código, ver el avance por alias y exportar los datos.
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Copy, Download, RefreshCw, School, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '../services/api';
import { LANGUAGES } from '../languages';

const formatDate = (value) => (value ? new Date(value).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' }) : '—');

const ClassroomCard = ({ aula }) => {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.getClassroomProgress(aula.id);
      setDetail(data);
    } catch {
      toast.error('No pudimos cargar el avance del aula');
    } finally {
      setLoading(false);
    }
  }, [aula.id]);

  useEffect(() => {
    if (open && !detail) load();
  }, [open, detail, load]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(aula.codigo);
      toast.success(`Código ${aula.codigo} copiado`);
    } catch {
      toast(`El código es ${aula.codigo}`);
    }
  };

  const download = (format) =>
    api
      .download(`/api/classroom/${aula.id}/export?format=${format}`, `simiaru-aula-${aula.codigo}.${format}`)
      .catch(() => toast.error('No pudimos descargar los datos'));

  return (
    <li className="anim-entra bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 flex flex-wrap items-center gap-4">
        <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-600 to-blue-700 flex items-center justify-center shadow-md" aria-hidden="true">
          <School className="w-6 h-6 text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black">{aula.nombre}</h3>
          <p className="text-stone-600 text-sm">
            {aula.idioma === 'aymara' ? 'Aymara' : 'Quechua'} · {aula.estudiantes} {aula.estudiantes === 1 ? 'estudiante' : 'estudiantes'}
          </p>
        </div>
        <button type="button" onClick={copy} className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 font-black tracking-widest toque" aria-label={`Copiar código del aula ${aula.codigo}`}>
          {aula.codigo}
          <Copy className="w-4 h-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="min-h-11 px-4 rounded-xl border-2 border-stone-300 font-bold hover:bg-stone-50 toque">
          {open ? 'Ocultar avance' : 'Ver avance'}
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-100 bg-stone-50 p-5 sm:p-6 anim-despliega">
          {loading && <p className="text-stone-600" role="status">Cargando…</p>}
          {detail && (
            <>
              {detail.estudiantes.length === 0 ? (
                <p className="text-stone-700">
                  Todavía no hay estudiantes. Compárteles el código <strong>{aula.codigo}</strong> y la dirección <strong>/aula</strong> de SimiAru.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-stone-600">
                        <th className="py-2 pr-4 font-bold">Alias</th>
                        <th className="py-2 pr-4 font-bold">Lecciones</th>
                        <th className="py-2 pr-4 font-bold">Ayni Points</th>
                        <th className="py-2 pr-4 font-bold">Racha</th>
                        <th className="py-2 pr-4 font-bold">Última vez</th>
                        <th className="py-2 font-bold">Datos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detail.estudiantes.map((s, i) => (
                        <tr key={`${s.alias}-${i}`} className="border-t border-stone-200">
                          <td className="py-2 pr-4 font-semibold">{s.alias}</td>
                          <td className="py-2 pr-4 tabular-nums">{s.lecciones_completadas}</td>
                          <td className="py-2 pr-4 tabular-nums">{Number(s.puntos_totales || 0).toLocaleString('es-PE')}</td>
                          <td className="py-2 pr-4 tabular-nums">{s.racha_actual || 0}</td>
                          <td className="py-2 pr-4">{formatDate(s.ultima_actividad)}</td>
                          <td className="py-2">{s.consentimiento_datos ? 'Aceptó' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 mt-5">
                <button type="button" onClick={() => download('csv')} className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-white border-2 border-stone-300 font-bold hover:bg-stone-50 toque">
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Exportar CSV
                </button>
                <button type="button" onClick={() => download('json')} className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl bg-white border-2 border-stone-300 font-bold hover:bg-stone-50 toque">
                  <Download className="w-4 h-4" aria-hidden="true" />
                  Exportar JSON
                </button>
                <button type="button" onClick={load} className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl font-bold text-stone-700 hover:bg-white toque">
                  <RefreshCw className="w-4 h-4" aria-hidden="true" />
                  Actualizar
                </button>
              </div>
              <p className="text-xs text-stone-600 mt-3 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                La exportación solo incluye a quienes aceptaron compartir sus datos, con un seudónimo en lugar del alias.
              </p>
            </>
          )}
        </div>
      )}
    </li>
  );
};

const Teacher = () => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [nombre, setNombre] = useState('');
  const [idioma, setIdioma] = useState('quechua');
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.getMyClassrooms();
      setAulas(data.aulas || []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.createClassroom({ nombre: nombre.trim(), idioma });
      setAulas((list) => [{ ...data.aula, estudiantes: 0 }, ...list]);
      setNombre('');
      toast.success(`Aula creada: ${data.aula.codigo}`, { description: 'Comparte este código con tus estudiantes.' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'No pudimos crear el aula');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50/70 via-stone-50 to-purple-50/70 text-stone-900">
      <main className="container mx-auto py-8 max-w-4xl">
        <Link to="/profile" className="inline-flex items-center gap-2 min-h-11 font-semibold text-stone-700 hover:text-stone-900">
          <ArrowLeft className="w-5 h-5" aria-hidden="true" />
          Volver al perfil
        </Link>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
          <span className="texto-degradado">Modo aula</span> para docentes
        </h1>
        <p className="text-stone-700 mt-2 mb-8 max-w-2xl">
          Crea un aula y comparte su código. Tus estudiantes entran en <strong>/aula</strong> con un alias, sin correo ni datos personales.
        </p>

        <form onSubmit={create} className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-6 mb-8 flex flex-col sm:flex-row gap-3 sm:items-end">
          <div className="flex-1">
            <label htmlFor="nombre-aula" className="block font-bold mb-2">
              Nombre del aula
            </label>
            <input
              id="nombre-aula"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              maxLength={80}
              placeholder="Por ejemplo: Quechua I — Grupo B"
              className="w-full min-h-12 px-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-green-700 focus:border-green-700 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="idioma-aula" className="block font-bold mb-2">
              Idioma
            </label>
            <select
              id="idioma-aula"
              value={idioma}
              onChange={(e) => setIdioma(e.target.value)}
              className="w-full min-h-12 px-4 border-2 border-stone-300 rounded-xl bg-white focus:ring-2 focus:ring-green-700 focus:outline-none"
            >
              {LANGUAGES.filter((l) => ['quechua', 'aymara'].includes(l.id)).map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nombre}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={creating || !nombre.trim()} className="min-h-12 px-6 boton-degradado font-bold rounded-xl shadow-lg inline-flex items-center justify-center gap-2 disabled:opacity-60">
            <Plus className="w-5 h-5" aria-hidden="true" />
            Crear aula
          </button>
        </form>

        <h2 className="text-xl font-black mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" aria-hidden="true" />
          Tus aulas
        </h2>
        {loading ? (
          <p className="text-stone-600" role="status">Cargando…</p>
        ) : error ? (
          <div role="alert" className="bg-white rounded-2xl border border-stone-200 p-6">
            <p className="font-semibold mb-3">No pudimos cargar tus aulas.</p>
            <button type="button" onClick={load} className="inline-flex items-center gap-2 min-h-11 px-4 rounded-xl border-2 border-stone-300 font-bold toque">
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Reintentar
            </button>
          </div>
        ) : aulas.length === 0 ? (
          <p className="text-stone-600">Todavía no creaste ningún aula.</p>
        ) : (
          <ul className="space-y-4">
            {aulas.map((aula) => (
              <ClassroomCard key={aula.id} aula={aula} />
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Teacher;
