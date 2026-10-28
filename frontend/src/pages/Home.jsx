import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { API_URL } from '../config';
import logo from '../assets/logo.jpg';
import fotoTiticaca from '../assets/fotos/titicaca-amanecer.jpg';
import fotoPuno from '../assets/fotos/puno-titicaca.jpg';
import fotoTari from '../assets/fotos/tari-aymara.jpg';
import fotoSikuris from '../assets/fotos/sikuris-puno.jpg';
import fotoPapas from '../assets/fotos/papas-nativas.jpg';
import fotoLlamas from '../assets/fotos/llamas-litografia.jpg';
import videoLago from '../assets/video/titicaca-timelapse.webm';
import posterLago from '../assets/video/titicaca-timelapse.jpg';
import './Home.css';

// Idea de la página: el nombre SimiAru ("palabra" en quechua y en aymara) se vuelve la frase,
// y dentro de la frase hay fotos y una palabra que el visitante escribe.
// Paleta (PRODUCT.md): verde = quechua y acción principal, azul lago = aymara, neutros cálidos para el resto.

const REPO = 'https://github.com/FLOR345/simiaru';

// Palabras de ejemplo: se muestran al instante, sin esperar al servidor
const EJEMPLOS = {
  agua: ['yaku', 'uma'],
  sol: ['inti', 'inti'],
  casa: ['wasi', 'uta'],
  lago: ['qucha', 'quta'],
  palabra: ['simi', 'aru'],
  papa: ['papa', "ch'uqi"],
};

const PASOS = [
  ['Primero eliges quechua o aymara.', 'Cada lengua tiene 6 unidades y 13 lecciones, de los saludos a los colores, los animales y las comidas.'],
  ['Luego practicas unos minutos.', 'Ejercicios cortos con voz sintetizada; si te equivocas, ves la respuesta correcta al momento.'],
  ['Después lees su cultura.', 'Cuentos, proverbios, adivinanzas y canciones con su traducción al castellano.'],
  ['Y tu avance queda guardado.', 'Ganas Ayni Points, mantienes tu racha diaria y desbloqueas 7 insignias.'],
];

const LENGUAS = [
  {
    id: 'quechua',
    nombre: 'Quechua',
    region: 'Variedad Cusco-Collao, la que se habla en Puno',
    texto: 'La lengua del Tahuantinsuyo, hablada hoy por millones de personas en los Andes.',
    cifras: '6 unidades, 13 lecciones, 507 palabras y 31 textos culturales',
    unidades: [
      ['Saludos y presentaciones', 'Rimaykullayki'],
      ['La familia', 'tayta, mama, wawqiy, ñaña'],
      ['Números del 1 al 20', 'huk, iskay, kimsa…'],
      ['Colores, animales y comidas', 'puka, kuntur, sara'],
    ],
  },
  {
    id: 'aymara',
    nombre: 'Aymara',
    region: 'Aymara central, el del altiplano puneño',
    texto: 'La lengua del lago Titicaca, hablada por cerca de 2 millones de personas en Perú, Bolivia y Chile.',
    cifras: '6 unidades, 13 lecciones, 996 palabras y 38 textos culturales',
    unidades: [
      ['Saludos y presentaciones', 'Kamisaraki'],
      ['La familia', 'awki, tayka, jilata, kullaka'],
      ['Números del 1 al 10', 'maya, paya, kimsa…'],
      ['Colores, animales y comidas', "qarwa, kunturi, ch'uqi"],
    ],
  },
];

// Quita tildes y mayúsculas para comparar lo escrito con el diccionario
const normalizar = (texto) =>
  String(texto ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/(?!̃)[̀-ͯ]/g, '')
    .normalize('NFC')
    .trim();

// De todas las coincidencias, la palabra exacta primero; si no, la que empieza igual
const elegirTraduccion = (palabras, termino) => {
  if (!Array.isArray(palabras) || palabras.length === 0) return null;
  const t = normalizar(termino);
  const exacta = palabras.find((p) => normalizar(p.palabra_espanol) === t);
  const empieza = palabras.find((p) => normalizar(p.palabra_espanol).startsWith(t));
  return (exacta || empieza || palabras[0]).palabra_objetivo || null;
};

// ==================== LA PALABRA VIVA ====================
// El visitante escribe una palabra en castellano y la frase la devuelve en quechua y en aymara.
const PalabraViva = () => {
  const [palabra, setPalabra] = useState('agua');
  const [resultado, setResultado] = useState({ estado: 'listo', quechua: 'yaku', aymara: 'uma' });
  const consulta = useRef(0);

  useEffect(() => {
    const termino = normalizar(palabra);
    const id = ++consulta.current;

    if (EJEMPLOS[termino]) {
      const [quechua, aymara] = EJEMPLOS[termino];
      setResultado({ estado: 'listo', quechua, aymara });
      return undefined;
    }
    if (termino.length < 2) {
      setResultado({ estado: 'vacio' });
      return undefined;
    }

    setResultado((previo) => ({ ...previo, estado: 'buscando' }));
    // El servidor gratuito se duerme: si tarda más de 10 s, se avisa en vez de dejar esperando
    const corte = new AbortController();
    let limite;
    const espera = setTimeout(async () => {
      limite = setTimeout(() => corte.abort(), 10000);
      try {
        const buscar = async (idioma) => {
          const url = `${API_URL}/api/dictionary/search?query=${encodeURIComponent(termino)}&idioma=${idioma}`;
          const respuesta = await fetch(url, { signal: corte.signal });
          if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
          const datos = await respuesta.json();
          return elegirTraduccion(datos.words, termino);
        };
        const [quechua, aymara] = await Promise.all([buscar('quechua'), buscar('aymara')]);
        if (id !== consulta.current) return;
        setResultado(quechua || aymara ? { estado: 'listo', quechua, aymara } : { estado: 'sin-resultado' });
      } catch {
        if (id === consulta.current) setResultado({ estado: 'error' });
      } finally {
        clearTimeout(limite);
      }
    }, 450);

    return () => {
      clearTimeout(espera);
      clearTimeout(limite);
      corte.abort();
    };
  }, [palabra]);

  const sinDato = <span className="viva-falta">(aún no está)</span>;

  return (
    <div className="viva" data-entra>
      <p className="viva-frase">
        <label htmlFor="palabra-viva" className="sr-only">
          Escribe una palabra en castellano
        </label>
        <input
          id="palabra-viva"
          className="viva-campo"
          type="text"
          value={palabra}
          maxLength={24}
          autoComplete="off"
          spellCheck="false"
          onChange={(e) => setPalabra(e.target.value)}
          style={{ width: `${Math.max(palabra.length, 3) + 1.5}ch` }}
        />{' '}
        <span aria-live="polite" aria-atomic="true">
          {resultado.estado === 'listo' && (
            <>
              en quechua es <strong lang="qu">{resultado.quechua || sinDato}</strong>; en aymara,{' '}
              <strong lang="ay">{resultado.aymara || sinDato}</strong>.
            </>
          )}
          {resultado.estado === 'buscando' && <span className="viva-suave">lo busco en el diccionario…</span>}
          {resultado.estado === 'vacio' && <span className="viva-suave">escribe una palabra en castellano.</span>}
          {resultado.estado === 'sin-resultado' && (
            <span className="viva-suave">no está en el diccionario todavía. Prueba otra.</span>
          )}
          {resultado.estado === 'error' && (
            <span className="viva-suave">no pude consultar el diccionario; el servidor puede tardar en despertar. Prueba de nuevo en un momento, o con agua, sol o casa.</span>
          )}
        </span>
      </p>
      <p className="viva-nota">
        Prueba con{' '}
        {Object.keys(EJEMPLOS).map((ejemplo, i, todos) => (
          <span key={ejemplo}>
            <button type="button" className="viva-ejemplo" onClick={() => setPalabra(ejemplo)}>
              {ejemplo}
            </button>
            {i < todos.length - 2 ? ', ' : i === todos.length - 2 ? ' o ' : ''}
          </span>
        ))}
        . Las traducciones salen del diccionario de SimiAru, con 1 503 palabras.
      </p>
    </div>
  );
};

// ==================== EL LAGO DENTRO DE LA FRASE ====================
// Un time-lapse del Titicaca en miniatura. Con movimiento reducido queda quieto en su primer cuadro.
const MiniaturaLago = () => {
  const video = useRef(null);

  useEffect(() => {
    const consulta = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const aplicar = () => {
      const el = video.current;
      if (!el) return;
      if (consulta?.matches) el.pause();
      else el.play?.().catch(() => {});
    };
    aplicar();
    consulta?.addEventListener?.('change', aplicar);
    return () => consulta?.removeEventListener?.('change', aplicar);
  }, []);

  return (
    <video
      ref={video}
      className="miniatura"
      src={videoLago}
      poster={posterLago}
      width="854"
      height="480"
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
    />
  );
};

// ==================== UNA FOTO, TRES DISTANCIAS ====================
// Al bajar, la misma foto de Puno se acerca al lago y luego a la ciudad.
const TresDistancias = () => {
  const envoltura = useRef(null);
  const [etapa, setEtapa] = useState(0);

  useEffect(() => {
    let cuadro = 0;
    const medir = () => {
      cuadro = 0;
      const caja = envoltura.current?.getBoundingClientRect();
      if (!caja) return;
      const recorrido = caja.height - window.innerHeight;
      const avance = recorrido > 0 ? -caja.top / recorrido : 0;
      setEtapa(avance < 0.3 ? 0 : avance < 0.65 ? 1 : 2);
    };
    const alDesplazar = () => {
      if (!cuadro) cuadro = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    window.addEventListener('resize', alDesplazar);
    return () => {
      window.removeEventListener('scroll', alDesplazar);
      window.removeEventListener('resize', alDesplazar);
      cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <div ref={envoltura} className="distancias" data-etapa={etapa}>
      <div className="distancias-escena">
        <h2 id="titulo-idiomas" className="distancias-titulo">
          <span className="distancias-arriba">Dos lenguas,</span>{' '}
          <span className="distancias-abajo">un mismo lago</span>
        </h2>
        <figure className="distancias-marco">
          <img
            src={fotoPuno}
            alt="Puno desde un cerro: casas de ladrillo hasta la orilla del lago Titicaca y los cerros al fondo"
            width="1600"
            height="642"
            loading="lazy"
            decoding="async"
          />
        </figure>
        <p className="distancias-nota">
          Alrededor del Titicaca se hablan el quechua y el aymara. En Puno conviven en la misma calle, a veces en la misma familia.
        </p>
      </div>
    </div>
  );
};

const Home = ({ enableGuestMode }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();
  const raiz = useRef(null);

  // Escape cierra el menú del celular
  useEffect(() => {
    if (!menuAbierto) return undefined;
    const alTeclear = (e) => {
      if (e.key === 'Escape') setMenuAbierto(false);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [menuAbierto]);

  // Entradas al aparecer en pantalla (con movimiento reducido todo está visible desde el inicio)
  useEffect(() => {
    const elementos = raiz.current?.querySelectorAll('[data-entra]') ?? [];
    if (!('IntersectionObserver' in window)) {
      elementos.forEach((el) => el.classList.add('visto'));
      return undefined;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('visto');
            observador.unobserve(entrada.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    elementos.forEach((el) => observador.observe(el));
    return () => observador.disconnect();
  }, []);

  // Entrar como invitado: avisa a App (estado) y lo recuerda para la próxima visita
  const probarSinCuenta = useCallback(() => {
    enableGuestMode?.();
    try {
      localStorage.setItem('isGuest', 'true');
    } catch {
      // Navegación privada o almacenamiento bloqueado: el modo invitado dura solo esta visita
    }
    navigate('/dashboard');
  }, [enableGuestMode, navigate]);

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div className="inicio" ref={raiz}>
      <a href="#contenido" className="saltar">
        Saltar al contenido
      </a>

      {/* ==================== ENCABEZADO ==================== */}
      <header className="cabecera">
        <Link to="/" className="marca" aria-label="SimiAru, inicio">
          <img src={logo} alt="" width="253" height="299" />
          <span>SimiAru</span>
        </Link>

        <nav className="cabecera-enlaces" aria-label="Principal">
          <a href="#idiomas">Idiomas</a>
          <button type="button" onClick={probarSinCuenta}>
            Probar sin cuenta
          </button>
          <Link to="/login">Iniciar sesión</Link>
        </nav>

        <Link to="/register" className="boton boton-papel cabecera-accion">
          Empezar gratis
        </Link>

        <button
          type="button"
          className="cabecera-menu"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
        >
          {menuAbierto ? 'Cerrar' : 'Menú'}
        </button>

        {menuAbierto && (
          <nav id="menu-movil" className="menu-movil" aria-label="Menú">
            <a href="#pasos" onClick={cerrarMenu}>Cómo funciona</a>
            <a href="#idiomas" onClick={cerrarMenu}>Idiomas</a>
            <a href="#cultura" onClick={cerrarMenu}>Cultura</a>
            <a href="#proyecto" onClick={cerrarMenu}>El proyecto</a>
            <Link to="/login">Iniciar sesión</Link>
            <button type="button" className="boton boton-tinta" onClick={probarSinCuenta}>
              Probar sin cuenta
            </button>
          </nav>
        )}
      </header>

      <main id="contenido">
        {/* ==================== PORTADA: título en el cielo, frase en el horizonte ==================== */}
        <section className="portada" aria-labelledby="titulo-portada">
          <div className="portada-foto">
            <img
              src={fotoTiticaca}
              alt="Amanecer sobre el lago Titicaca, con los totorales de Puno en sombra"
              width="1920"
              height="929"
              fetchpriority="high"
            />
          </div>
          <h1 id="titulo-portada" className="portada-titulo">
            <span className="linea"><span>Una palabra,</span></span>
            <span className="linea"><span>dos lenguas</span></span>
          </h1>
          <p className="portada-frase">
            <span className="mitad-a">SimiAru te enseña quechua y aymara</span>{' '}
            <span className="mitad-b">gratis, desde las orillas del Titicaca.</span>
          </p>
          <div className="portada-banda">
            <Link to="/register" className="boton boton-papel">
              Empezar gratis
            </Link>
          </div>
        </section>

        {/* ==================== LA PALABRA: frase con fotos y la palabra viva ==================== */}
        <section id="palabra" className="seccion intro" aria-labelledby="titulo-intro">
          <h2 id="titulo-intro" className="sr-only">La palabra viva</h2>
          <p className="intro-frase" data-entra>
            {/* Cada miniatura va pegada a su palabra para que nunca abra una línea */}
            Aprende las palabras del{' '}
            <span className="junto">lago<MiniaturaLago />,</span> del{' '}
            <span className="junto">tejido<img className="miniatura" src={fotoTari} alt="" width="900" height="1599" loading="lazy" />,</span> de la{' '}
            <span className="junto">chacra<img className="miniatura" src={fotoPapas} alt="" width="1300" height="747" loading="lazy" /></span> y de la{' '}
            <span className="junto">fiesta<img className="miniatura solo-ancho" src={fotoSikuris} alt="" width="1100" height="875" loading="lazy" />,</span> en quechua y en aymara.
          </p>
          <PalabraViva />
        </section>

        {/* ==================== CÓMO FUNCIONA: escalera ==================== */}
        <section id="pasos" className="seccion pasos" aria-labelledby="titulo-pasos">
          <h2 id="titulo-pasos" className="sr-only">Cómo funciona</h2>
          <ol className="pasos-lista">
            {PASOS.map(([linea, detalle], i) => (
              <li key={linea} className={`paso paso-${i + 1}`} data-entra>
                <h3>{linea}</h3>
                <p>{detalle}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ==================== IDIOMAS: una foto, tres distancias + las dos lenguas ==================== */}
        <section id="idiomas" className="idiomas" aria-labelledby="titulo-idiomas">
          <TresDistancias />
          <div className="lenguas">
            {LENGUAS.map((lengua) => (
              <article key={lengua.id} className={`lengua lengua-${lengua.id}`} lang="es" data-entra>
                <h3>{lengua.nombre}</h3>
                <p className="lengua-region">{lengua.region}</p>
                <p className="lengua-texto">{lengua.texto}</p>
                <p className="lengua-cifras">{lengua.cifras}.</p>
                <h4>Lo que aprenderás primero</h4>
                <ul>
                  {lengua.unidades.map(([tema, ejemplo]) => (
                    <li key={tema}>
                      <span>{tema}</span>
                      <span className="lengua-ejemplo" lang={lengua.id === 'quechua' ? 'qu' : 'ay'}>{ejemplo}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ==================== CULTURA: fotos sobre el titular ==================== */}
        <section id="cultura" className="cultura" aria-labelledby="titulo-cultura">
          <h2 id="titulo-cultura" className="cultura-titulo">
            <span>Cultura</span>
            <span>viva</span>
          </h2>
          <div className="mesa">
            <figure className="copia copia-1" data-entra>
              <img src={fotoSikuris} alt="Sikuris con zampoñas y bombo bailando en una fiesta de Puno" width="1100" height="875" loading="lazy" decoding="async" />
            </figure>
            <figure className="copia copia-2" data-entra>
              <img src={fotoTari} alt="Tari, una bolsa tejida aymara, sobre una piedra junto a una laguna de altura" width="900" height="1599" loading="lazy" decoding="async" />
            </figure>
            <figure className="copia copia-3" data-entra>
              <img src={fotoLlamas} alt="Litografía de 1853: llamas cargadas cruzando los Andes" width="1260" height="640" loading="lazy" decoding="async" />
            </figure>
          </div>
          <p className="cultura-nota">
            69 cuentos, proverbios, adivinanzas y canciones, en quechua y en aymara, cada uno con su traducción.
          </p>
        </section>

        {/* ==================== EL PROYECTO: retrato como capitular ==================== */}
        <section id="proyecto" className="seccion proyecto" aria-labelledby="titulo-proyecto">
          <h2 id="titulo-proyecto" className="sr-only">El proyecto</h2>
          <ul className="proyecto-datos" data-entra>
            <li><span>Hecho en</span> Puno, Perú</li>
            <li><span>Licencia</span> MIT, libre</li>
            <li><span>Código</span> <a href={REPO} target="_blank" rel="noopener noreferrer">en GitHub</a></li>
          </ul>
          <div className="proyecto-texto" data-entra>
            <p>
              <img className="capitular" src={logo} alt="Mascota de SimiAru: una llama con chullo y chalina" width="253" height="299" loading="lazy" />
              <strong>SimiAru</strong> es una herramienta libre para aprender las dos lenguas que se hablan alrededor del
              Titicaca. Reúne un diccionario de 1 503 palabras, 26 lecciones con 285 ejercicios y 69 textos culturales. Es
              gratis, no tiene publicidad y su mascota es una llama con chullo y chalina.
            </p>
            <p className="proyecto-suave">
              El código está abierto en{' '}
              <a href={REPO} target="_blank" rel="noopener noreferrer">GitHub</a>{' '}
              con licencia MIT. Las voces de las lecciones son sintetizadas; si encuentras una palabra mal escrita o una
              traducción dudosa,{' '}
              <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">avísanos</a> para corregirla.
            </p>
          </div>
        </section>

        {/* ==================== LLAMADA FINAL: la pregunta en los dos bordes ==================== */}
        <section className="pregunta" aria-labelledby="titulo-pregunta">
          <h2 id="titulo-pregunta" className="pregunta-titulo">
            <span className="pregunta-uno" data-entra>¿Con cuenta</span>
            <span className="pregunta-dos" data-entra>o sin ella?</span>
          </h2>
          <div className="pregunta-centro">
            <div className="pregunta-botones">
              <Link to="/register" className="boton boton-acento">
                Crear cuenta gratis
              </Link>
              <span className="pregunta-o">o</span>
              <button type="button" className="boton boton-papel" onClick={probarSinCuenta}>
                Probar sin cuenta
              </button>
            </div>
            <p className="pregunta-nota">
              Con cuenta guardas tu progreso y tu racha. Sin cuenta exploras la Unidad 1 completa.
            </p>
          </div>
        </section>
      </main>

      {/* ==================== PIE: invitación sobre el nombre recortado ==================== */}
      <footer className="pie">
        <div className="pie-arriba">
          <div className="pie-invitacion">
            <h2>Unos minutos al día bastan</h2>
            <Link to="/register" className="boton boton-papel">
              Empezar gratis
            </Link>
          </div>
          <nav className="pie-enlaces" aria-label="Más de SimiAru">
            <Link to="/dictionary">Diccionario</Link>
            <a href={REPO} target="_blank" rel="noopener noreferrer">Código en GitHub</a>
            <a href={`${REPO}/issues`} target="_blank" rel="noopener noreferrer">Reportar un problema</a>
            <a href={`${REPO}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">Licencia MIT</a>
          </nav>
        </div>
        <div className="pie-legal">
          <p className="creditos">
            Fotos de Wikimedia Commons, recortadas para esta página:{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Amanecer_en_el_lago_Titicaca,_Puno,_Per%C3%BA,_2015-08-01,_DD_01.JPG">amanecer en el Titicaca</a> y{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Vista_de_Puno_y_el_Titicaca,_Per%C3%BA,_2015-08-01,_DD_53-54_PAN.JPG">vista de Puno</a>, de Diego Delso;{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Tari_textil_Aymara.jpg">tari aymara</a>, de Jhulis (las tres{' '}
            <a href="https://creativecommons.org/licenses/by-sa/4.0">CC BY-SA 4.0</a>);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Types_of_Potatoes_in_Peru.jpg">papas nativas</a>, de Cathetovar (
            <a href="https://creativecommons.org/licenses/by/4.0">CC BY 4.0</a>);{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Sikuris,_Puno-Peru.jpg">sikuris de Puno</a> (CC0) y{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Llamas_traversing_the_Andes_laden_with_silver_Titicaca_balsa_off_Puno_-_-_sketched_by_L._Gibbon_;_JQ_;_lith._of_P.S._Duval_%26_Co._Philada._LCCN2014649307.tif">litografía de L. Gibbon, 1853</a> (dominio público). Video:{' '}
            <a href="https://commons.wikimedia.org/wiki/File:Lake_Titicaca_time-lapse.webm">time-lapse del Titicaca</a>, de Jemma Saunders (
            <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>).
          </p>
          <p>© 2026 SimiAru</p>
        </div>
        <p className="pie-nombre" aria-hidden="true">SimiAru</p>
      </footer>
    </div>
  );
};

export default Home;
