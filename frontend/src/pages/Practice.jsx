import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import * as m from 'motion/react-m';
import { ArrowLeft, Zap, Layers, Volume2, Timer, Trophy, RotateCcw, Check, X, RefreshCw, Hand, Brain, Ear, Heart, Snail } from 'lucide-react';
import { api } from '../services/api';
import { LANGUAGES, getLanguage, languageStyle } from '../languages';
import { playTap, playMatch, playWrong, playComplete, playCorrect } from '../utils/sounds';
import { speak } from '../utils/speech';
import Mascot, { LlamaImage } from '../components/Mascot';

// ==================== Juegos de práctica ====================
// Repasan las palabras de las lecciones que la persona ya completó (o de la Unidad 1 si aún no hay).
// No guardan nada en el servidor: los récords viven en este dispositivo.

const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const readBest = (key) => {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
};
const writeBest = (key, value) => {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // sin almacenamiento: el récord dura esta visita
  }
};
const bestKey = (game, idioma) => `simiaru-record-${game}-${idioma}`;

// Palabras de las lecciones completadas; si no hay, de las primeras lecciones
const loadWords = async (idioma, isGuest) => {
  const { data } = await api.getUnits(idioma);
  const units = data.units || [];
  const lessonLists = await Promise.all(
    units.map((u) =>
      api
        .getLessonsByUnit(u.id)
        .then((r) => r.data.lessons || [])
        .catch(() => [])
    )
  );
  const lessons = lessonLists.flat();
  let completed = new Set();
  if (!isGuest) {
    try {
      const p = await api.getProgress();
      completed = new Set((p.data.progress || []).filter((x) => x.completado).map((x) => x.leccion_id));
    } catch {
      // sin sesión o sin conexión: se usan las primeras lecciones
    }
  }
  let chosen = lessons.filter((l) => completed.has(l.id));
  const fromCompleted = chosen.length > 0;
  if (!fromCompleted) chosen = (lessonLists[0]?.length ? lessonLists[0] : lessons).slice(0, 3);
  chosen = shuffle(chosen).slice(0, 6);
  const lists = await Promise.all(
    chosen.map((l) =>
      api
        .getLessonContent(l.id)
        .then((r) => r.data.vocabulary || [])
        .catch(() => [])
    )
  );
  const seenTarget = new Set();
  const seenSpanish = new Set();
  const words = [];
  lists.flat().forEach((w) => {
    const target = w.palabra_objetivo?.trim();
    const spanish = w.palabra_espanol?.trim();
    if (!target || !spanish || target.length > 28 || spanish.length > 28) return;
    const kt = target.toLowerCase();
    const ks = spanish.toLowerCase();
    if (seenTarget.has(kt) || seenSpanish.has(ks)) return;
    seenTarget.add(kt);
    seenSpanish.add(ks);
    words.push({ id: w.id, target, spanish, audio: w.audio_url, example: w.ejemplo_uso });
  });
  return { words, fromCompleted };
};

// ==================== Piezas compartidas ====================
const primaryBtn = 'ficha min-h-14 px-8 rounded-2xl border-green-800 bg-green-600 hover:bg-green-500 text-white text-lg font-black uppercase tracking-wide inline-flex items-center justify-center gap-2';
const secondaryBtn = 'ficha min-h-14 px-8 rounded-2xl border-stone-300 bg-white font-bold text-stone-700 hover:bg-stone-50';

// Marco de cada juego: la llamita reacciona a un lado y el tablero ocupa el resto
const GameFrame = ({ mood, beat, say, children }) => (
  <div className="grid gap-6 lg:gap-10 lg:grid-cols-[15rem_minmax(0,1fr)] items-start">
    <aside className="hidden lg:flex lg:sticky lg:top-24 flex-col items-center">
      <Mascot mood={mood} beat={beat} bubble="top" size="w-44" eager say={say} />
    </aside>
    <div className="min-w-0">{children}</div>
  </div>
);

const useMood = () => {
  const [mood, setMood] = useState({ mood: 'idle', beat: 0 });
  const react = useCallback((value) => setMood((m0) => ({ mood: value, beat: m0.beat + 1 })), []);
  return [mood, react];
};

const ResultScreen = ({ great, title, big, unit, note, language, onAgain, onExit, againLabel = 'Otra vez', children }) => (
  <div className="max-w-xl mx-auto text-center py-6">
    <Mascot
      mood={great ? 'cheer' : 'happy'}
      bubble="top"
      size="w-36"
      className="mx-auto"
      eager
      say={<p className="font-black text-xl">{title ?? (great ? language.frases?.felicitacion ?? '¡Muy bien!' : language.frases?.animo ?? '¡Ánimo!')}</p>}
    />
    <p className="mt-6 text-6xl font-black tabular-nums">{big}</p>
    <p className="text-stone-600 font-semibold">{unit}</p>
    {note && <p className="mt-2 text-sm font-bold text-amber-700">{note}</p>}
    {children}
    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
      <button type="button" onClick={onAgain} className={primaryBtn}>
        <RotateCcw className="w-5 h-5" aria-hidden="true" /> {againLabel}
      </button>
      <button type="button" onClick={onExit} className={secondaryBtn}>
        Elegir otro juego
      </button>
    </div>
  </div>
);

const StartScreen = ({ text, best, bestLabel, onStart, onExit }) => (
  <div className="max-w-xl mx-auto text-center py-6">
    <Mascot bubble="top" size="w-36" className="mx-auto" eager say={<p className="font-semibold max-w-sm">{text}</p>} />
    {best > 0 && (
      <p className="mt-4 inline-flex items-center gap-2 font-bold text-amber-700">
        <Trophy className="w-5 h-5" aria-hidden="true" /> {bestLabel}
      </p>
    )}
    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
      <button type="button" onClick={onStart} className={primaryBtn}>
        ¡Jugar!
      </button>
      <button type="button" onClick={onExit} className={secondaryBtn}>
        Elegir otro juego
      </button>
    </div>
  </div>
);

// ==================== 1. Parejas relámpago ====================
const DURATION = 60;
const BONUS_EVERY = 5;
const BONUS_SECONDS = 3;

const tile = (state, theme) => {
  const base = 'ficha w-full min-h-14 sm:min-h-16 rounded-2xl px-3 py-2 flex items-center justify-center gap-2 text-center font-bold text-base sm:text-lg disabled:cursor-default';
  if (state === 'selected') return `${base} ${theme.border} ${theme.soft} ${theme.text}`;
  if (state === 'flash') return `${base} border-green-600 bg-green-100 text-green-900 anim-pop`;
  if (state === 'wrong') return `${base} border-red-500 bg-red-50 text-red-900 anim-sacude`;
  return `${base} border-stone-300 bg-white text-stone-800 hover:bg-stone-50`;
};

const PairsGame = ({ words, language, theme, idioma, onExit }) => {
  const key = bestKey('parejas', idioma);
  const rows = Math.min(5, words.length);
  const [status, setStatus] = useState('ready'); // ready | playing | over
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [pick, setPick] = useState(null);
  const [flash, setFlash] = useState(null);
  const [wrong, setWrong] = useState(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [bonus, setBonus] = useState(null);
  const [best, setBest] = useState(() => readBest(key));
  const [record, setRecord] = useState(false);
  const [mood, react] = useMood();
  const endAt = useRef(0);
  const pool = useRef([]);
  const scoreRef = useRef(0);

  const nextWord = (onBoard) => {
    if (pool.current.length === 0) pool.current = shuffle(words.filter((w) => !onBoard.some((b) => b?.id === w.id)));
    return pool.current.shift();
  };

  const start = () => {
    pool.current = shuffle(words);
    const first = pool.current.splice(0, rows);
    setLeft(first);
    setRight(shuffle(first));
    setPick(null);
    setFlash(null);
    setWrong(null);
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    setRecord(false);
    endAt.current = Date.now() + DURATION * 1000;
    setTimeLeft(DURATION);
    setStatus('playing');
  };

  // Reloj: cuenta hacia atrás; al llegar a cero termina la partida
  useEffect(() => {
    if (status !== 'playing') return undefined;
    const timer = setInterval(() => {
      const remaining = Math.max(0, (endAt.current - Date.now()) / 1000);
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
        setStatus('over');
        playComplete();
        const final = scoreRef.current;
        if (final > readBest(key)) {
          writeBest(key, final);
          setBest(final);
          setRecord(true);
        }
      }
    }, 100);
    return () => clearInterval(timer);
  }, [status, key]);

  const tap = (side, index) => {
    if (status !== 'playing' || flash || wrong) return;
    const word = side === 'L' ? left[index] : right[index];
    if (!word) return;
    if (!pick || pick.side === side) {
      playTap();
      setPick(pick?.side === side && pick.index === index ? null : { side, index });
      return;
    }
    const li = side === 'L' ? index : pick.index;
    const ri = side === 'R' ? index : pick.index;
    setPick(null);
    if (left[li].id === right[ri].id) {
      playMatch();
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setScore((s) => s + 1);
      scoreRef.current += 1;
      react(nextCombo % BONUS_EVERY === 0 ? 'cheer' : 'happy');
      if (nextCombo % BONUS_EVERY === 0) {
        endAt.current += BONUS_SECONDS * 1000;
        setBonus(Date.now());
      }
      setFlash({ L: li, R: ri });
      setTimeout(() => {
        // Las fichas no se pueden tocar durante el destello, así que left/right siguen vigentes
        const fresh = nextWord(left.filter((_, i) => i !== li));
        const nl = [...left];
        const nr = [...right];
        nl[li] = fresh;
        nr[ri] = fresh;
        // La palabra nueva cae en otra fila de la derecha, para que no sea obvia
        const k = Math.floor(Math.random() * nr.length);
        [nr[ri], nr[k]] = [nr[k], nr[ri]];
        setLeft(nl);
        setRight(nr);
        setFlash(null);
      }, 260);
    } else {
      playWrong();
      setCombo(0);
      react('sad');
      setWrong({ L: li, R: ri });
      setTimeout(() => setWrong(null), 500);
    }
  };

  // Teclado: 1-5 columna izquierda, 6-0 derecha
  useEffect(() => {
    if (status !== 'playing') return undefined;
    const onKey = (e) => {
      const n = e.key === '0' ? 10 : Number(e.key);
      if (!(n >= 1 && n <= 10)) return;
      if (n <= rows) tap('L', n - 1);
      else if (n > 5 && n - 6 < rows) tap('R', n - 6);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const stateOf = (side, i) => {
    if (flash && flash[side] === i) return 'flash';
    if (wrong && wrong[side] === i) return 'wrong';
    if (pick?.side === side && pick.index === i) return 'selected';
    return 'idle';
  };

  if (status === 'ready') {
    return (
      <StartScreen
        text={
          <>
            Une cada palabra con su significado antes de que se acabe el tiempo. Cada {BONUS_EVERY} seguidas te dan <strong>+{BONUS_SECONDS} s</strong>.
          </>
        }
        best={best}
        bestLabel={`Tu récord: ${best} parejas`}
        onStart={start}
        onExit={onExit}
      />
    );
  }

  if (status === 'over') {
    return (
      <ResultScreen
        great={record || score >= 10}
        title={record ? '¡Nuevo récord!' : undefined}
        big={score}
        unit={`parejas en ${DURATION} segundos`}
        note={!record && best > 0 ? `Récord: ${best}` : null}
        language={language}
        onAgain={start}
        onExit={onExit}
      />
    );
  }

  const fraction = Math.min(1, timeLeft / DURATION);
  return (
    <GameFrame mood={mood.mood} beat={mood.beat} say={<p className="font-black">{combo >= 2 ? `¡${combo} seguidas!` : '¡Rápido, rápido!'}</p>}>
      <div className="flex items-center gap-3 mb-6">
        <Timer className={`w-6 h-6 shrink-0 ${timeLeft < 10 ? 'text-red-600 anim-latido' : 'text-stone-500'}`} aria-hidden="true" />
        <div className="relative flex-1 h-4 rounded-full bg-stone-200 overflow-hidden" role="timer" aria-label={`Quedan ${Math.ceil(timeLeft)} segundos`}>
          <div
            className={`h-full w-full origin-left rounded-full ${timeLeft < 10 ? 'bg-red-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
            style={{ transform: `scaleX(${fraction})`, transition: 'transform 100ms linear' }}
          />
        </div>
        <span className="relative w-12 text-right font-black tabular-nums">
          {Math.ceil(timeLeft)}s
          {bonus && (
            <span key={bonus} className="anim-xp absolute -top-5 right-0 text-sm text-green-600" aria-hidden="true">
              +{BONUS_SECONDS}s
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="font-black text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500 fill-amber-400" aria-hidden="true" />
          <span className="tabular-nums">{score}</span> parejas
        </p>
        {combo >= 2 && (
          <p key={combo} className="anim-pop font-black text-orange-600 lg:hidden">
            ¡{combo} seguidas!
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5">
        <div className="space-y-3" lang={language.lang}>
          {left.map((w, i) => (
            <button key={`${w?.id}-${i}`} type="button" onClick={() => tap('L', i)} className={tile(stateOf('L', i), theme)} aria-pressed={stateOf('L', i) === 'selected'}>
              {w?.target}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {right.map((w, i) => (
            <button key={`${w?.id}-${i}`} type="button" onClick={() => tap('R', i)} className={tile(stateOf('R', i), theme)} aria-pressed={stateOf('R', i) === 'selected'}>
              {w?.spanish}
            </button>
          ))}
        </div>
      </div>
    </GameFrame>
  );
};

// ==================== 2. Tarjetas ====================
// Toca la tarjeta para voltearla; arrástrala a la derecha si la sabías y a la izquierda para repasarla
const SWIPE = 110;

const FlashCard = ({ word, language, theme, flipped, onFlip, onDecide }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-14, 14]);
  const knowOpacity = useTransform(x, [20, SWIPE], [0, 1]);
  const againOpacity = useTransform(x, [-SWIPE, -20], [1, 0]);

  return (
    <m.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-pan-y"
      style={{ x, rotate }}
      drag="x"
      dragSnapToOrigin
      dragElastic={0.8}
      onDragEnd={(_, info) => {
        if (info.offset.x > SWIPE) onDecide(true);
        else if (info.offset.x < -SWIPE) onDecide(false);
      }}
      initial={{ scale: 0.92, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      variants={{ exit: (dir) => ({ x: dir > 0 ? 420 : -420, opacity: 0, rotate: dir > 0 ? 18 : -18, transition: { duration: 0.3 } }) }}
      exit="exit"
      transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
    >
      <m.span style={{ opacity: knowOpacity }} className="absolute top-5 left-5 z-10 rotate-[-12deg] rounded-xl border-4 border-green-600 px-3 py-1 font-black uppercase text-green-700 bg-white/90">
        ¡La sé!
      </m.span>
      <m.span style={{ opacity: againOpacity }} className="absolute top-5 right-5 z-10 rotate-[12deg] rounded-xl border-4 border-orange-600 px-3 py-1 font-black uppercase text-orange-700 bg-white/90">
        Repasar
      </m.span>

      <div className="h-full w-full [perspective:1200px]">
        <m.button
          type="button"
          onClick={onFlip}
          aria-label={flipped ? `Significado: ${word.spanish}. Toca para volver` : `${word.target}. Toca para ver el significado`}
          className="relative h-full w-full rounded-[2rem] [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
        >
          <span
            className={`absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[2rem] bg-gradient-to-br ${theme.gradient} p-6 text-white shadow-2xl [backface-visibility:hidden]`}
          >
            <span className="text-sm font-black uppercase tracking-widest opacity-80">{language.nombre}</span>
            <span className="text-4xl sm:text-5xl font-black text-center break-words" lang={language.lang}>
              {word.target}
            </span>
            <span className="text-sm font-semibold opacity-80 flex items-center gap-1">
              <Hand className="w-4 h-4" aria-hidden="true" /> Toca para voltear
            </span>
          </span>
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[2rem] border-4 border-stone-200 bg-white p-6 text-stone-900 shadow-2xl [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-sm font-black uppercase tracking-widest text-stone-500">Español</span>
            <span className="text-4xl sm:text-5xl font-black text-center break-words">{word.spanish}</span>
            <span className={`text-lg font-bold ${theme.text}`} lang={language.lang}>
              {word.target}
            </span>
            {word.example && <span className="text-sm italic text-stone-600 text-center">“{word.example}”</span>}
          </span>
        </m.button>
      </div>
    </m.div>
  );
};

const CardsGame = ({ words, language, theme, onExit }) => {
  const newDeck = () => shuffle(words).slice(0, 12).map((w) => ({ ...w, repeat: false }));
  const [deck, setDeck] = useState(newDeck);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [review, setReview] = useState([]);
  const [dir, setDir] = useState(1);
  const [mood, react] = useMood();
  const total = Math.min(12, words.length);
  const done = index >= deck.length;
  const card = deck[index];

  const restart = () => {
    setDeck(newDeck());
    setIndex(0);
    setFlipped(false);
    setKnown(0);
    setReview([]);
  };

  const decide = useCallback(
    (knew) => {
      if (!card) return;
      setDir(knew ? 1 : -1);
      react(knew ? 'happy' : 'think');
      if (knew) {
        playCorrect();
        if (!card.repeat) setKnown((k) => k + 1);
      } else {
        playWrong();
        // La tarjeta vuelve una vez al final del mazo
        if (!card.repeat) {
          setReview((r) => [...r, card]);
          setDeck((d) => [...d, { ...card, repeat: true }]);
        }
      }
      setFlipped(false);
      setIndex((i) => i + 1);
      if (index + 1 >= deck.length + (knew || card.repeat ? 0 : 1)) playComplete();
    },
    [card, index, deck.length, react]
  );

  const flip = useCallback(() => {
    if (!card) return;
    playTap();
    setFlipped((f) => {
      if (!f) speak(card.target, { url: card.audio, lang: language.voz?.respaldo });
      return !f;
    });
  }, [card, language]);

  // Teclado: espacio voltea, → la sé, ← repasar
  useEffect(() => {
    if (done) return undefined;
    const onKey = (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        if (e.target?.tagName === 'BUTTON' && !e.target.closest('[data-tarjeta]')) return;
        e.preventDefault();
        flip();
      } else if (e.key === 'ArrowRight') decide(true);
      else if (e.key === 'ArrowLeft') decide(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [done, flip, decide]);

  if (done) {
    return (
      <ResultScreen great={known >= total * 0.8} big={`${known}/${total}`} unit="palabras que ya te sabías" language={language} onAgain={restart} onExit={onExit} againLabel="Otro mazo">
        {review.length > 0 && (
          <section className="mt-6 text-left bg-orange-50 border border-orange-200 rounded-2xl p-4" aria-labelledby="tarjetas-repasar">
            <h2 id="tarjetas-repasar" className="font-bold text-orange-900 mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" aria-hidden="true" /> Para repasar
            </h2>
            <ul className="flex flex-wrap gap-2">
              {review.map((w) => (
                <li key={w.id} className="px-3 py-1 bg-white rounded-full border border-orange-200 text-sm font-semibold">
                  <span lang={language.lang}>{w.target}</span> · {w.spanish}
                </li>
              ))}
            </ul>
          </section>
        )}
      </ResultScreen>
    );
  }

  return (
    <GameFrame mood={mood.mood} beat={mood.beat} say={<p className="font-semibold">Arrastra a la <strong>derecha</strong> si la sabes y a la <strong>izquierda</strong> para repasar.</p>}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-3 rounded-full bg-stone-200 overflow-hidden" aria-hidden="true">
            <div className={`barra h-full w-full rounded-full ${theme.solid}`} style={{ transform: `scaleX(${index / deck.length})` }} />
          </div>
          <span className="text-sm font-bold text-stone-600 tabular-nums">
            {Math.min(index + 1, deck.length)} / {deck.length}
          </span>
        </div>

        <div className="relative mx-auto h-80 sm:h-96 w-full" data-tarjeta>
          {/* La siguiente tarjeta asoma detrás, como un mazo */}
          {deck[index + 1] && <div className="absolute inset-x-4 -bottom-3 top-3 rounded-[2rem] bg-stone-200" aria-hidden="true" />}
          <AnimatePresence custom={dir} initial={false}>
            <FlashCard key={`${card.id}-${index}`} word={card} language={language} theme={theme} flipped={flipped} onFlip={flip} onDecide={decide} />
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={() => decide(false)}
            className="ficha min-h-14 px-4 sm:px-6 rounded-2xl border-orange-300 bg-white text-orange-700 font-black inline-flex items-center gap-2 whitespace-nowrap hover:bg-orange-50"
          >
            <X className="w-5 h-5" strokeWidth={3} aria-hidden="true" /> Repasar
          </button>
          <button
            type="button"
            onClick={() => speak(card.target, { url: card.audio, lang: language.voz?.respaldo })}
            aria-label={`Escuchar ${card.target}`}
            className={`ficha w-14 h-14 shrink-0 rounded-2xl ${theme.solid} border-black/25 text-white flex items-center justify-center`}
          >
            <Volume2 className="w-6 h-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => decide(true)}
            className="ficha min-h-14 px-4 sm:px-6 rounded-2xl border-green-700 bg-green-600 text-white font-black inline-flex items-center gap-2 whitespace-nowrap hover:bg-green-500"
          >
            <Check className="w-5 h-5" strokeWidth={3} aria-hidden="true" /> ¡La sé!
          </button>
        </div>
        <p className="mt-4 hidden md:block text-center text-sm text-stone-500">Espacio para voltear · ← repasar · → la sé · o arrastra la tarjeta</p>
      </div>
    </GameFrame>
  );
};

// ==================== 3. Memoria ====================
// Tarjetas boca abajo: voltea dos; si son la palabra y su significado, se quedan descubiertas
const MEMORY_PAIRS = 6;

const MemoryGame = ({ words, language, theme, idioma, onExit }) => {
  const key = bestKey('memoria', idioma);
  const build = () =>
    shuffle(
      shuffle(words)
        .slice(0, Math.min(MEMORY_PAIRS, words.length))
        .flatMap((w) => [
          { uid: `${w.id}-t`, id: w.id, text: w.target, side: 't', word: w },
          { uid: `${w.id}-s`, id: w.id, text: w.spanish, side: 's', word: w },
        ])
    );
  const [cards, setCards] = useState(build);
  const [open, setOpen] = useState([]); // uids volteadas ahora (máx. 2)
  const [found, setFound] = useState([]); // ids encontrados
  const [moves, setMoves] = useState(0);
  const [miss, setMiss] = useState(null);
  const [best, setBest] = useState(() => readBest(key));
  const [record, setRecord] = useState(false);
  const [mood, react] = useMood();
  const pairs = cards.length / 2;
  const done = found.length === pairs && pairs > 0;

  const restart = () => {
    setCards(build());
    setOpen([]);
    setFound([]);
    setMoves(0);
    setRecord(false);
  };

  const flip = (card) => {
    if (open.length === 2 || open.includes(card.uid) || found.includes(card.id)) return;
    playTap();
    if (card.side === 't') speak(card.text, { url: card.word.audio, lang: language.voz?.respaldo });
    const next = [...open, card.uid];
    setOpen(next);
    if (next.length < 2) return;
    const total = moves + 1;
    setMoves(total);
    const [a, b] = next.map((u) => cards.find((c) => c.uid === u));
    if (a.id === b.id) {
      playMatch();
      react('happy');
      const nowFound = [...found, a.id];
      setTimeout(() => {
        setFound(nowFound);
        setOpen([]);
        if (nowFound.length === pairs) {
          playComplete();
          // Récord = menos intentos
          if (!best || total < best) {
            writeBest(key, total);
            setBest(total);
            setRecord(true);
          }
        }
      }, 350);
    } else {
      playWrong();
      react('sad');
      setMiss(next);
      setTimeout(() => {
        setOpen([]);
        setMiss(null);
      }, 950);
    }
  };

  if (done) {
    return (
      <ResultScreen
        great={moves <= pairs + 3}
        title={record ? '¡Nuevo récord!' : undefined}
        big={moves}
        unit={`intentos para encontrar ${pairs} parejas`}
        note={!record && best ? `Récord: ${best} intentos` : null}
        language={language}
        onAgain={restart}
        onExit={onExit}
      />
    );
  }

  return (
    <GameFrame mood={mood.mood} beat={mood.beat} say={<p className="font-semibold">Encuentra cada palabra y su significado. ¡Recuerda dónde estaban!</p>}>
      <div className="flex items-center justify-between mb-5">
        <p className="font-black text-lg flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-600" aria-hidden="true" />
          {found.length} de {pairs} parejas
        </p>
        <p className="font-bold text-stone-600 tabular-nums">
          {moves} intentos{best ? ` · récord ${best}` : ''}
        </p>
      </div>
      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {cards.map((card, i) => {
          const isFound = found.includes(card.id);
          const isOpen = isFound || open.includes(card.uid);
          const isMiss = miss?.includes(card.uid);
          return (
            <li key={card.uid} className="aspect-[4/5] [perspective:900px] anim-entra" style={{ '--i': i }}>
              <m.button
                type="button"
                onClick={() => flip(card)}
                disabled={isFound}
                aria-label={isOpen ? card.text : `Tarjeta ${i + 1}, boca abajo`}
                className="relative h-full w-full [transform-style:preserve-3d] disabled:cursor-default"
                animate={{ rotateY: isOpen ? 180 : 0 }}
                transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
              >
                {/* Dorso: un tejido de colores con la llamita */}
                <span className={`absolute inset-0 rounded-2xl border-4 border-white shadow-md bg-gradient-to-br ${theme.gradient} flex items-center justify-center overflow-hidden [backface-visibility:hidden]`}>
                  <span className="absolute inset-0 opacity-25 [background:repeating-linear-gradient(45deg,#fff_0_6px,transparent_6px_18px)]" aria-hidden="true" />
                  <span className="relative w-1/2 opacity-90" aria-hidden="true">
                    <LlamaImage />
                  </span>
                </span>
                {/* Frente */}
                <span
                  className={`absolute inset-0 rounded-2xl border-4 p-2 flex flex-col items-center justify-center text-center font-black break-words text-sm sm:text-lg [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    isFound ? 'border-green-500 bg-green-50 text-green-900' : isMiss ? 'border-red-400 bg-red-50 text-red-900 anim-sacude' : 'border-stone-200 bg-white text-stone-900'
                  }`}
                  lang={card.side === 't' ? language.lang : undefined}
                >
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-stone-500 mb-1">{card.side === 't' ? language.nombre : 'Español'}</span>
                  {card.text}
                </span>
              </m.button>
            </li>
          );
        })}
      </ul>
    </GameFrame>
  );
};

// ==================== 4. Escucha y elige ====================
// Suena una palabra; hay que elegir cómo se escribe. 10 rondas y 3 vidas.
const ROUNDS = 10;
const LIVES = 3;

const ListenGame = ({ words, language, theme, idioma, onExit }) => {
  const key = bestKey('escucha', idioma);
  const makeRounds = () =>
    shuffle(words)
      .slice(0, Math.min(ROUNDS, words.length))
      .map((w) => ({ word: w, options: shuffle([w, ...shuffle(words.filter((o) => o.id !== w.id)).slice(0, 3)]) }));
  const [rounds, setRounds] = useState(makeRounds);
  const [index, setIndex] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [score, setScore] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [best, setBest] = useState(() => readBest(key));
  const [mood, react] = useMood();
  const round = rounds[index];
  const over = lives === 0 || index >= rounds.length;

  const play = useCallback((slow = false) => round && speak(round.word.target, { url: round.word.audio, lang: language.voz?.respaldo, slow }), [round, language]);

  // Cada ronda suena sola al aparecer
  useEffect(() => {
    if (over || chosen) return undefined;
    const t = setTimeout(() => play(), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, over]);

  useEffect(() => {
    if (!over) return;
    playComplete();
    if (score > best) {
      writeBest(key, score);
      setBest(score);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [over]);

  const choose = (opt) => {
    if (chosen) return;
    setChosen(opt);
    if (opt.id === round.word.id) {
      playCorrect();
      react('happy');
      setScore((s) => s + 1);
    } else {
      playWrong();
      react('sad');
      setLives((l) => l - 1);
    }
  };
  const next = () => {
    setChosen(null);
    setIndex((i) => i + 1);
  };

  useEffect(() => {
    if (over) return undefined;
    const onKey = (e) => {
      const n = Number(e.key);
      if (!chosen && n >= 1 && n <= 4 && round?.options[n - 1]) choose(round.options[n - 1]);
      else if (chosen && e.key === 'Enter') {
        e.preventDefault();
        next();
      } else if (e.key === ' ') {
        e.preventDefault();
        play();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const restart = () => {
    setRounds(makeRounds());
    setIndex(0);
    setLives(LIVES);
    setScore(0);
    setChosen(null);
  };

  if (over) {
    return (
      <ResultScreen
        great={score >= rounds.length * 0.8}
        title={lives === 0 ? '¡Se acabaron las vidas!' : undefined}
        big={`${score}/${rounds.length}`}
        unit="palabras reconocidas al oído"
        note={best ? `Récord: ${best}` : null}
        language={language}
        onAgain={restart}
        onExit={onExit}
      />
    );
  }

  return (
    <GameFrame mood={mood.mood} beat={mood.beat} say={<p className="font-semibold">Escucha con atención y elige la palabra que suena.</p>}>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <p className="font-bold text-stone-600 tabular-nums">
            Ronda {index + 1} de {rounds.length}
          </p>
          <p className="flex items-center gap-1" aria-label={`${lives} vidas`}>
            {Array.from({ length: LIVES }, (_, i) => (
              <Heart key={`${i}-${i < lives}`} className={`w-6 h-6 ${i < lives ? 'text-red-500 fill-red-500' : 'text-stone-300 anim-sacude'}`} aria-hidden="true" />
            ))}
          </p>
        </div>

        <div className="flex items-end justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => play()}
            aria-label="Escuchar la palabra"
            className={`ficha w-32 h-32 rounded-3xl ${theme.solid} border-black/25 text-white flex items-center justify-center shadow-lg`}
          >
            <Volume2 className="w-16 h-16" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => play(true)} aria-label="Escuchar despacio" className={`ficha w-16 h-16 rounded-2xl border-stone-300 bg-white ${theme.text} flex items-center justify-center`}>
            <Snail className="w-8 h-8" aria-hidden="true" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Opciones" lang={language.lang}>
          {round.options.map((opt, i) => {
            const right = chosen && opt.id === round.word.id;
            const wrong = chosen && chosen.id === opt.id && !right;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={!!chosen}
                onClick={() => choose(opt)}
                className={`ficha min-h-16 rounded-2xl px-4 flex items-center gap-3 text-left text-xl font-black disabled:cursor-default ${
                  right ? 'border-green-600 bg-green-50 text-green-900' : wrong ? 'border-red-500 bg-red-50 text-red-900 anim-sacude' : chosen ? 'border-stone-200 text-stone-400 bg-white' : 'border-stone-300 bg-white hover:bg-stone-50'
                }`}
              >
                <span className="hidden sm:inline-flex w-7 h-7 shrink-0 items-center justify-center rounded-lg border-2 border-stone-200 text-xs text-stone-500" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="flex-1">{opt.target}</span>
                {chosen && <span className="text-sm font-semibold text-stone-500">{opt.spanish}</span>}
              </button>
            );
          })}
        </div>

        {chosen && (
          <div className="mt-6 flex justify-end">
            <button type="button" onClick={next} className={primaryBtn}>
              Siguiente
            </button>
          </div>
        )}
      </div>
    </GameFrame>
  );
};

// ==================== Página ====================
const GAMES = [
  {
    id: 'parejas',
    Icon: Zap,
    title: 'Parejas relámpago',
    text: '60 segundos para unir todas las palabras que puedas.',
    color: 'from-amber-400 to-orange-600',
    shadow: 'shadow-orange-100',
    best: (b) => `${b} parejas`,
  },
  {
    id: 'tarjetas',
    Icon: Layers,
    title: 'Tarjetas',
    text: 'Voltea, escucha y decide: ¿la sabes o la repasas?',
    color: 'from-purple-500 to-blue-700',
    shadow: 'shadow-purple-100',
  },
  {
    id: 'memoria',
    Icon: Brain,
    title: 'Memoria',
    text: 'Voltea tarjetas y encuentra cada palabra con su significado.',
    color: 'from-pink-500 to-rose-700',
    shadow: 'shadow-rose-100',
    best: (b) => `${b} intentos`,
  },
  {
    id: 'escucha',
    Icon: Ear,
    title: 'Escucha y elige',
    text: 'Oye la palabra y elige cómo se escribe. ¡Tienes 3 vidas!',
    color: 'from-green-500 to-teal-700',
    shadow: 'shadow-green-100',
    best: (b) => `${b} de 10`,
  },
];

const Practice = ({ user, isGuest }) => {
  const [params, setParams] = useSearchParams();
  const idioma = getLanguage(params.get('idioma')) ? params.get('idioma') : user?.idioma_objetivo && getLanguage(user.idioma_objetivo) ? user.idioma_objetivo : 'quechua';
  const language = getLanguage(idioma);
  const theme = languageStyle(idioma);
  const [game, setGame] = useState(null);
  const [state, setState] = useState({ loading: true, error: false, words: [], fromCompleted: false });
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: false }));
    loadWords(idioma, isGuest)
      .then(({ words, fromCompleted }) => !cancelled && setState({ loading: false, error: false, words, fromCompleted }))
      .catch(() => !cancelled && setState({ loading: false, error: true, words: [], fromCompleted: false }));
    return () => {
      cancelled = true;
    };
  }, [idioma, isGuest, reload]);

  const enough = state.words.length >= 4;
  // Se recalcula al volver de un juego, para mostrar el récord nuevo
  const records = useMemo(() => GAMES.filter((g) => g.best).map((g) => ({ ...g, value: readBest(bestKey(g.id, idioma)) })), [idioma, game]);
  const exit = () => setGame(null);
  const props = { words: state.words, language, theme, idioma, onExit: exit };

  return (
    <div className="fondo-burbujas min-h-screen text-stone-900">
      <span className="burbuja burbuja-verde" aria-hidden="true" />
      <span className="burbuja burbuja-azul" aria-hidden="true" />
      <span className="burbuja burbuja-morada" aria-hidden="true" />
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="container mx-auto max-w-7xl py-3 flex items-center gap-3">
          {game ? (
            <button type="button" onClick={exit} className="inline-flex items-center gap-2 min-h-11 px-2 font-bold text-stone-700 hover:bg-stone-100 rounded-lg toque">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" /> Juegos
            </button>
          ) : (
            <Link to="/dashboard" className="inline-flex items-center gap-2 min-h-11 px-2 font-bold text-stone-700 hover:bg-stone-100 rounded-lg toque">
              <ArrowLeft className="w-5 h-5" aria-hidden="true" /> Panel
            </Link>
          )}
          <h1 className="text-lg sm:text-xl font-black mr-auto truncate">{game ? GAMES.find((g) => g.id === game)?.title : 'Juegos'}</h1>
          {!game && (
            <div className="flex rounded-full bg-stone-100 p-1" role="group" aria-label="Idioma">
              {LANGUAGES.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  aria-pressed={l.id === idioma}
                  onClick={() => setParams({ idioma: l.id })}
                  className={`min-h-9 px-3 rounded-full text-sm font-bold toque ${l.id === idioma ? `${languageStyle(l.id).solid} text-white` : 'text-stone-600 hover:text-stone-900'}`}
                >
                  {l.nombre}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-7xl py-8 relative">
        {state.loading ? (
          <div className="flex flex-col items-center py-16" role="status">
            <Mascot mood="think" size="w-32" eager />
            <p className="mt-4 font-bold text-stone-700">Buscando tus palabras…</p>
          </div>
        ) : state.error ? (
          <div className="text-center py-12" role="alert">
            <Mascot mood="sad" size="w-32" className="justify-center" eager />
            <p className="mt-4 font-bold">No pudimos cargar las palabras.</p>
            <button type="button" onClick={() => setReload((r) => r + 1)} className="mt-4 inline-flex items-center gap-2 px-6 min-h-11 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl toque">
              <RefreshCw className="w-5 h-5" aria-hidden="true" /> Reintentar
            </button>
          </div>
        ) : !enough ? (
          <div className="text-center py-12">
            <Mascot size="w-32" className="justify-center" eager />
            <p className="mt-4 font-bold">Todavía no hay palabras suficientes para jugar en {language.nombre}.</p>
          </div>
        ) : game === 'parejas' ? (
          <PairsGame key={idioma} {...props} />
        ) : game === 'tarjetas' ? (
          <CardsGame key={idioma} {...props} />
        ) : game === 'memoria' ? (
          <MemoryGame key={idioma} {...props} />
        ) : game === 'escucha' ? (
          <ListenGame key={idioma} {...props} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] items-start">
            {/* Lado: la llamita invita y muestra tus récords */}
            <aside className="space-y-5 lg:sticky lg:top-24">
              <Mascot
                eager
                bubble="top"
                size="w-36 sm:w-44"
                say={
                  <p className="font-semibold">
                    <span className="font-black">¿A qué jugamos?</span> Practicarás {state.words.length} palabras{' '}
                    {state.fromCompleted ? 'de las lecciones que ya completaste.' : 'de las primeras lecciones (completa lecciones para sumar más).'}
                  </p>
                }
              />
              <section className="rounded-3xl bg-white/80 backdrop-blur border border-white shadow-sm p-5" aria-labelledby="records-titulo">
                <h2 id="records-titulo" className="font-black mb-3 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" aria-hidden="true" /> Tus récords en {language.nombre}
                </h2>
                <ul className="space-y-2">
                  {records.map(({ id, title, Icon, color, value, best }) => (
                    <li key={id} className="flex items-center gap-3">
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`} aria-hidden="true">
                        <Icon className="w-5 h-5 text-white" />
                      </span>
                      <span className="flex-1 font-semibold">{title}</span>
                      <span className="font-black tabular-nums text-stone-700">{value ? best(value) : '—'}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>

            <ul className="grid gap-5 sm:grid-cols-2">
              {GAMES.map(({ id, Icon, title, text, color, shadow, best }, i) => {
                const value = best ? readBest(bestKey(id, idioma)) : 0;
                return (
                  <li key={id} className="anim-entra" style={{ '--i': i }}>
                    <button
                      type="button"
                      onClick={() => {
                        playTap();
                        setGame(id);
                      }}
                      className={`group ficha tarjeta-viva relative overflow-hidden w-full h-full min-h-56 text-left rounded-3xl border-stone-200 bg-white p-6 sm:p-7 shadow-lg ${shadow} hover:border-stone-300`}
                    >
                      <span className={`pointer-events-none absolute -right-10 -top-10 w-40 h-40 rounded-full bg-gradient-to-br ${color} opacity-10 transition-transform duration-300 group-hover:scale-125`} aria-hidden="true" />
                      <span className={`relative mb-5 w-16 h-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-md transition-transform duration-200 group-hover:-rotate-6`} aria-hidden="true">
                        <Icon className="w-8 h-8 text-white" />
                      </span>
                      <span className="relative block text-2xl font-black mb-1">{title}</span>
                      <span className="relative block text-stone-600">{text}</span>
                      <span className="relative mt-4 flex items-center justify-between gap-2">
                        {value > 0 ? (
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-amber-700">
                            <Trophy className="w-4 h-4" aria-hidden="true" /> Récord: {best(value)}
                          </span>
                        ) : (
                          <span className="text-sm font-bold text-stone-500">{best ? '¡Aún sin récord!' : 'Sin reloj, a tu ritmo'}</span>
                        )}
                        <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-black text-white bg-gradient-to-r ${color}`}>Jugar</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
};

export default Practice;
