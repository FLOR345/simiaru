import { useState, useEffect, useMemo } from 'react';
import { Volume2, Check, X, RotateCcw } from 'lucide-react';
import { classifyAnswer } from '../../utils/normalizer';

// ==================== COMPARACIÓN DE RESPUESTAS ====================
// Acepta diferencias de escritura que no cambian la palabra:
// - mayúsculas, espacios y signos de puntuación al inicio o al final;
// - cualquier tipo de apóstrofo (' ’ ‘ ´ `), muy común en quechua y aymara (p'unchay, ch'uqi);
// - tildes en vocales (mamá = mama). La ñ se conserva porque es otra letra.
export const normalizeAnswer = (value) =>
  String(value ?? '')
    .toLowerCase()
    .replace(/[’‘´`ʼ]/g, "'")
    .replace(/[áàäâ]/g, 'a')
    .replace(/[éèëê]/g, 'e')
    .replace(/[íìïî]/g, 'i')
    .replace(/[óòöô]/g, 'o')
    .replace(/[úùüû]/g, 'u')
    .replace(/^[\s¿¡.,;:!?"]+|[\s¿¡.,;:!?"]+$/g, '')
    .replace(/\s+/g, ' ');

const sameAnswer = (a, b) => normalizeAnswer(a) === normalizeAnswer(b);

// Convierte JSON guardado como texto sin romperse si no lo es
const safeJsonParse = (value, defaultValue = []) => {
  if (!value) return defaultValue;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return Array.isArray(defaultValue) ? [value] : value;
  }
};

// Mezcla una copia de la lista (Fisher-Yates) para que la respuesta no esté siempre en la misma posición
const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Pronunciación con la voz del navegador (síntesis en español; ver PRODUCT.md)
const speakWord = (word) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = 'es-PE';
  utterance.rate = 0.8;
  window.speechSynthesis.speak(utterance);
};

const optionClass = (active) =>
  `w-full p-4 text-left rounded-xl border-2 toque ${
    active ? 'border-green-700 bg-green-50' : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50'
  }`;

const textInputClass =
  'w-full px-4 py-4 border-2 border-stone-300 rounded-xl focus:ring-2 focus:ring-green-700 focus:border-green-700 focus:outline-none text-lg';

const VerifyButton = ({ disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="w-full min-h-12 py-4 px-6 rounded-xl font-bold toque bg-green-700 hover:bg-green-800 text-white disabled:bg-stone-200 disabled:text-stone-500 disabled:cursor-not-allowed"
  >
    Verificar
  </button>
);

const ResetButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-2 px-4 min-h-11 text-stone-700 hover:bg-stone-100 rounded-lg toque font-semibold"
  >
    <RotateCcw className="w-4 h-4" aria-hidden="true" />
    Reiniciar
  </button>
);

/**
 * Muestra un ejercicio y llama a onAnswer(esCorrecta, respuestaCorrectaLegible, detalle).
 * detalle = { resultado: 'correcto' | 'variante' | 'incorrecto', fenomenos, respuesta } (normalizador dialectal).
 * Con answered=true queda bloqueado mientras se muestra la corrección.
 */
const ExerciseTypes = ({ exercise, onAnswer, onSkip, answered = false, languageLabel = 'Quechua', languageId = 'quechua' }) => {
  const [selected, setSelected] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [matchingPairs, setMatchingPairs] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [fillBlanks, setFillBlanks] = useState({});
  const [selectedWords, setSelectedWords] = useState([]);

  // Reiniciar al cambiar de ejercicio
  useEffect(() => {
    setSelected(null);
    setUserAnswer('');
    setMatchingPairs({});
    setSelectedLeft(null);
    setFillBlanks({});
    setSelectedWords([]);
  }, [exercise?.id]);

  // Orden aleatorio, fijo mientras dure cada ejercicio
  const shuffled = useMemo(() => {
    if (!exercise) return {};
    const opciones = safeJsonParse(exercise.opciones, exercise.tipo === 'multiple_choice' ? [] : {});
    if (exercise.tipo === 'multiple_choice') return { options: shuffle(Array.isArray(opciones) ? opciones : []) };
    if (exercise.tipo === 'matching') {
      let right = opciones.columna_derecha || [];
      if (right.length === 0) right = Object.values(safeJsonParse(exercise.respuesta_correcta, {}));
      return { right: shuffle(right) };
    }
    if (exercise.tipo === 'word_order' || exercise.tipo === 'drag_words') {
      const words = opciones.palabras || (Array.isArray(opciones) ? opciones : []);
      return { words: shuffle(words) };
    }
    return {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exercise?.id]);

  if (!exercise) {
    return <p className="text-center text-stone-600 p-6">No hay ejercicio disponible</p>;
  }

  const answer = (isCorrect, correctText, detail = {}) => {
    if (answered) return;
    onAnswer(isCorrect, correctText, { resultado: isCorrect ? 'correcto' : 'incorrecto', fenomenos: [], ...detail });
  };

  // Respuestas escritas: el normalizador dialectal acepta variantes (glotalizadas, q/k, e/o...) como correctas
  const answerWritten = (given, expected) => {
    const r = classifyAnswer(given, expected, languageId);
    answer(r.resultado !== 'incorrecto', expected, { resultado: r.resultado, fenomenos: r.fenomenos, respuesta: given });
  };

  const handleSubmit = () => {
    switch (exercise.tipo) {
      case 'multiple_choice':
        if (selected === null) return;
        answer(sameAnswer(selected, exercise.respuesta_correcta), exercise.respuesta_correcta, { respuesta: selected });
        break;

      case 'listen_write':
      case 'translate':
        if (!userAnswer.trim()) return;
        answerWritten(userAnswer, exercise.respuesta_correcta);
        break;

      case 'true_false': {
        if (selected === null) return;
        const correctBool = exercise.respuesta_correcta === 'true' || exercise.respuesta_correcta === true;
        answer(selected === correctBool, correctBool ? 'Verdadero' : 'Falso', { respuesta: selected ? 'Verdadero' : 'Falso' });
        break;
      }

      case 'fill_blanks': {
        const answers = Object.values(fillBlanks);
        if (answers.length === 0) return;
        const correctAnswers = safeJsonParse(exercise.respuesta_correcta, []);
        const results = answers.map((ans, idx) => classifyAnswer(ans, correctAnswers[idx] || '', languageId));
        const resultado = results.some((r) => r.resultado === 'incorrecto')
          ? 'incorrecto'
          : results.some((r) => r.resultado === 'variante')
            ? 'variante'
            : 'correcto';
        answer(resultado !== 'incorrecto', correctAnswers.join(', '), {
          resultado,
          fenomenos: [...new Set(results.flatMap((r) => r.fenomenos))],
          respuesta: answers.join(', '),
        });
        break;
      }

      case 'matching': {
        const correctPairs = safeJsonParse(exercise.respuesta_correcta, {});
        const keys = Object.keys(correctPairs);
        const isMatch = keys.length === Object.keys(matchingPairs).length && keys.every((key) => matchingPairs[key] === correctPairs[key]);
        answer(isMatch, keys.map((key) => `${key} = ${correctPairs[key]}`).join('; '));
        break;
      }

      case 'word_order':
      case 'drag_words': {
        let correctOrder = safeJsonParse(exercise.respuesta_correcta, []);
        if (!Array.isArray(correctOrder)) correctOrder = [correctOrder];
        const isOrderCorrect =
          selectedWords.length === correctOrder.length && selectedWords.every((word, idx) => sameAnswer(word, correctOrder[idx] || ''));
        answer(isOrderCorrect, correctOrder.join(' '), { respuesta: selectedWords.join(' ') });
        break;
      }

      default:
        break;
    }
  };

  // Enter envía la respuesta en los campos de texto
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const playAudio = () => {
    setIsPlaying(true);
    const fallback = () => {
      setIsPlaying(false);
      speakWord(exercise.respuesta_correcta);
    };
    if (exercise.audio_url) {
      const audio = new Audio(exercise.audio_url);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = fallback;
      audio.play().catch(fallback);
    } else {
      speakWord(exercise.respuesta_correcta);
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  const questionId = `pregunta-${exercise.id}`;

  // 1. OPCIÓN MÚLTIPLE
  if (exercise.tipo === 'multiple_choice') {
    const opciones = shuffled.options || [];
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 id={questionId} className="text-2xl font-bold mb-6">{exercise.pregunta}</h2>
        <div className="space-y-3 mb-6" role="group" aria-labelledby={questionId}>
          {opciones.map((opcion, index) => (
            <button
              key={index}
              type="button"
              aria-pressed={selected === opcion}
              disabled={answered}
              onClick={() => setSelected(opcion)}
              className={`${optionClass(selected === opcion)} anim-entra`}
              style={{ "--i": index }}
            >
              <span className="font-semibold">{opcion}</span>
            </button>
          ))}
        </div>
        {!answered && <VerifyButton onClick={handleSubmit} disabled={selected === null} />}
      </div>
    );
  }

  // 2. ESCUCHAR Y ESCRIBIR
  if (exercise.tipo === 'listen_write') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 id={questionId} className="text-2xl font-bold mb-6">Escucha y escribe lo que oyes</h2>
        <button
          type="button"
          onClick={playAudio}
          disabled={isPlaying}
          className="flex items-center gap-3 mx-auto mb-6 px-8 min-h-12 rounded-full bg-green-700 hover:bg-green-800 text-white font-bold toque disabled:bg-green-600"
        >
          <Volume2 className="w-6 h-6" aria-hidden="true" />
          {isPlaying ? 'Reproduciendo…' : 'Escuchar'}
        </button>
        <input
          type="text"
          aria-labelledby={questionId}
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={userAnswer}
          disabled={answered}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe aquí lo que escuchaste"
          className={`${textInputClass} mb-6`}
        />
        {!answered && <VerifyButton onClick={handleSubmit} disabled={!userAnswer.trim()} />}
      </div>
    );
  }

  // 3. VERDADERO O FALSO
  if (exercise.tipo === 'true_false') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 id={questionId} className="text-2xl font-bold mb-6">{exercise.pregunta}</h2>
        <div className="grid grid-cols-1 min-[440px]:grid-cols-2 gap-3 sm:gap-4 mb-6" role="group" aria-labelledby={questionId}>
          {[
            [true, 'Verdadero', Check, 'text-green-700'],
            [false, 'Falso', X, 'text-red-700'],
          ].map(([value, label, Icon, iconClass], index) => (
            <button
              key={label}
              type="button"
              aria-pressed={selected === value}
              disabled={answered}
              onClick={() => setSelected(value)}
              style={{ "--i": index }}
              className={`anim-entra min-w-0 p-5 sm:p-6 rounded-xl border-2 toque flex items-center justify-center gap-3 ${
                selected === value ? 'border-green-700 bg-green-50' : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-8 h-8 ${iconClass}`} aria-hidden="true" />
              <span className="text-xl font-bold">{label}</span>
            </button>
          ))}
        </div>
        {!answered && <VerifyButton onClick={handleSubmit} disabled={selected === null} />}
      </div>
    );
  }

  // 4. COMPLETAR ESPACIOS
  if (exercise.tipo === 'fill_blanks') {
    const parts = exercise.pregunta.split('___');
    const blanks = parts.length - 1;
    const incomplete = Object.keys(fillBlanks).length < blanks || Object.values(fillBlanks).some((v) => !v.trim());
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Completa los espacios en blanco</h2>
        <p className="bg-stone-50 p-6 rounded-xl mb-6 text-lg border-2 border-stone-200 leading-loose">
          {parts.map((part, index) => (
            <span key={index}>
              {part}
              {index < blanks && (
                <input
                  type="text"
                  aria-label={`Espacio ${index + 1} de ${blanks}`}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={fillBlanks[index] || ''}
                  disabled={answered}
                  onChange={(e) => setFillBlanks({ ...fillBlanks, [index]: e.target.value })}
                  onKeyDown={handleKeyDown}
                  className="inline-block mx-2 px-3 py-1.5 border-b-2 border-green-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-700 min-w-[120px] rounded-lg"
                />
              )}
            </span>
          ))}
        </p>
        {!answered && <VerifyButton onClick={handleSubmit} disabled={incomplete} />}
      </div>
    );
  }

  // 5. EMPAREJAR
  if (exercise.tipo === 'matching') {
    const opciones = safeJsonParse(exercise.opciones, {});
    let leftItems = opciones.columna_izquierda || [];
    let rightItems = opciones.columna_derecha || [];
    if (leftItems.length === 0) {
      const correct = safeJsonParse(exercise.respuesta_correcta, {});
      leftItems = Object.keys(correct);
      rightItems = Object.values(correct);
    }
    rightItems = shuffled.right || rightItems;

    const isRightMatched = (rightItem) => Object.values(matchingPairs).includes(rightItem);
    const allMatched = Object.keys(matchingPairs).length === leftItems.length;

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-2">{exercise.pregunta}</h2>
        <p className="text-stone-600 mb-6">Elige una palabra de la izquierda y luego su pareja de la derecha</p>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-6">
          <div className="space-y-3">
            <h3 className="font-bold text-stone-700 text-center mb-2">{languageLabel}</h3>
            {leftItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedLeft(item)}
                aria-pressed={selectedLeft === item}
                disabled={answered || !!matchingPairs[item]}
                className={`w-full p-4 rounded-xl border-2 toque text-left ${
                  matchingPairs[item]
                    ? 'bg-green-50 border-green-700 text-green-900'
                    : selectedLeft === item
                      ? 'bg-stone-100 border-stone-900'
                      : 'bg-white border-stone-300 hover:border-stone-500'
                }`}
              >
                <span className="font-semibold">{item}</span>
                {matchingPairs[item] && <span className="block text-sm text-green-800 anim-despliega">= {matchingPairs[item]}</span>}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-stone-700 text-center mb-2">Español</h3>
            {rightItems.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (!selectedLeft) return;
                  setMatchingPairs((prev) => ({ ...prev, [selectedLeft]: item }));
                  setSelectedLeft(null);
                }}
                disabled={answered || isRightMatched(item) || !selectedLeft}
                className={`w-full p-4 rounded-xl border-2 toque text-left ${
                  isRightMatched(item)
                    ? 'bg-green-50 border-green-700 text-green-900'
                    : selectedLeft
                      ? 'bg-white border-orange-700 hover:bg-orange-50'
                      : 'bg-stone-50 border-stone-200 text-stone-600 cursor-not-allowed'
                }`}
              >
                <span className="font-semibold">{item}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4">
          {!answered && (
            <ResetButton
              onClick={() => {
                setMatchingPairs({});
                setSelectedLeft(null);
              }}
            />
          )}
          <span className="text-stone-600" aria-live="polite">
            Emparejadas: {Object.keys(matchingPairs).length} de {leftItems.length}
          </span>
        </div>

        {!answered && <VerifyButton onClick={handleSubmit} disabled={!allMatched} />}
      </div>
    );
  }

  // 6. ORDENAR PALABRAS
  if (exercise.tipo === 'word_order' || exercise.tipo === 'drag_words') {
    const words = shuffled.words || [];
    const availableWords = words.filter((w) => !selectedWords.includes(w));

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">{exercise.pregunta}</h2>

        <p className="text-stone-600 mb-2" id={`${questionId}-respuesta`}>Tu respuesta</p>
        <div
          className="p-4 bg-stone-50 rounded-xl border-2 border-dashed border-stone-300 min-h-[80px] flex flex-wrap gap-2 items-center mb-6"
          aria-labelledby={`${questionId}-respuesta`}
          aria-live="polite"
        >
          {selectedWords.length === 0 ? (
            <span className="text-stone-600">Toca las palabras en orden</span>
          ) : (
            selectedWords.map((word, index) => (
              <button
                key={index}
                type="button"
                disabled={answered}
                onClick={() => setSelectedWords(selectedWords.filter((_, i) => i !== index))}
                aria-label={`Quitar ${word}`}
                className="anim-pop inline-flex items-center gap-1.5 px-4 min-h-11 bg-green-700 text-white rounded-lg hover:bg-green-800 toque font-semibold"
              >
                {word}
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            ))
          )}
        </div>

        <p className="text-stone-600 mb-2">Palabras disponibles</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {availableWords.map((word, index) => (
            <button
              key={index}
              type="button"
              disabled={answered}
              onClick={() => setSelectedWords([...selectedWords, word])}
              className="px-4 min-h-11 bg-white border-2 border-stone-300 rounded-lg hover:border-green-700 toque font-semibold"
            >
              {word}
            </button>
          ))}
        </div>

        {!answered && (
          <div className="mb-4">
            <ResetButton onClick={() => setSelectedWords([])} />
          </div>
        )}

        {!answered && <VerifyButton onClick={handleSubmit} disabled={selectedWords.length === 0} />}
      </div>
    );
  }

  // 7. TRADUCIR
  if (exercise.tipo === 'translate') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Traduce la siguiente palabra o frase</h2>
        <div className="p-6 bg-stone-50 rounded-xl mb-6 text-center border-2 border-stone-200">
          <p id={questionId} className="text-2xl font-bold">{exercise.pregunta}</p>
          <button
            type="button"
            onClick={() => speakWord(exercise.pregunta)}
            aria-label={`Escuchar ${exercise.pregunta}`}
            className="mt-3 w-11 h-11 inline-flex items-center justify-center text-green-800 hover:bg-green-50 rounded-full toque"
          >
            <Volume2 className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
        <label htmlFor={`${questionId}-traduccion`} className="block font-bold mb-2">
          Tu traducción
        </label>
        <input
          id={`${questionId}-traduccion`}
          type="text"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          value={userAnswer}
          disabled={answered}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${textInputClass} mb-6`}
        />
        {!answered && <VerifyButton onClick={handleSubmit} disabled={!userAnswer.trim()} />}
      </div>
    );
  }

  // TIPO NO SOPORTADO
  return (
    <div className="p-6">
      <p className="bg-red-50 border border-red-300 rounded-xl p-6 text-red-800 font-bold mb-4" role="alert">
        Este tipo de ejercicio todavía no se puede mostrar ({exercise.tipo}).
      </p>
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="w-full min-h-12 border-2 border-stone-300 rounded-xl font-bold hover:bg-stone-50 toque"
        >
          Saltar este ejercicio
        </button>
      )}
    </div>
  );
};

export default ExerciseTypes;
