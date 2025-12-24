import { useState, useEffect } from 'react';
import { Volume2, Check, X, RotateCcw } from 'lucide-react';

const ExerciseTypes = ({ exercise, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [matchingPairs, setMatchingPairs] = useState({});
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [fillBlanks, setFillBlanks] = useState({});
  const [selectedWords, setSelectedWords] = useState([]);

  // Reset state when exercise changes
  useEffect(() => {
    setSelected(null);
    setUserAnswer('');
    setMatchingPairs({});
    setSelectedLeft(null);
    setFillBlanks({});
    setSelectedWords([]);
  }, [exercise?.id]);

  // Helper function to safely parse JSON
  const safeJsonParse = (value, defaultValue = []) => {
    if (!value) return defaultValue;
    if (typeof value === 'object') return value;
    try {
      return JSON.parse(value);
    } catch (e) {
      // If it's not valid JSON, return as single item array or the value itself
      if (Array.isArray(defaultValue)) {
        return [value];
      }
      return value;
    }
  };

  const handleSubmit = () => {
    if (!exercise) return;
    
    switch (exercise.tipo) {
      case 'multiple_choice':
        if (selected === null) return;
        onAnswer(selected === exercise.respuesta_correcta);
        break;
        
      case 'listen_write':
        if (!userAnswer.trim()) return;
        onAnswer(userAnswer.toLowerCase().trim() === exercise.respuesta_correcta.toLowerCase().trim());
        break;
        
      case 'true_false':
        if (selected === null) return;
        const correctBool = exercise.respuesta_correcta === 'true' || exercise.respuesta_correcta === true;
        onAnswer(selected === correctBool);
        break;
        
      case 'fill_blanks':
        const answers = Object.values(fillBlanks);
        if (answers.length === 0) return;
        const correctAnswers = safeJsonParse(exercise.respuesta_correcta, []);
        const isCorrect = answers.every((ans, idx) => 
          ans.toLowerCase().trim() === (correctAnswers[idx] || '').toLowerCase().trim()
        );
        onAnswer(isCorrect);
        break;
        
      case 'matching':
        const correctPairs = safeJsonParse(exercise.respuesta_correcta, {});
        const isMatch = Object.keys(correctPairs).every(key => 
          matchingPairs[key] === correctPairs[key]
        );
        onAnswer(isMatch && Object.keys(matchingPairs).length === Object.keys(correctPairs).length);
        break;
        
      case 'word_order':
      case 'drag_words':
        // Handle both array format ["word1", "word2"] and single word "word1"
        let correctOrder = safeJsonParse(exercise.respuesta_correcta, []);
        
        // If it's a single word (not array), wrap it
        if (!Array.isArray(correctOrder)) {
          correctOrder = [correctOrder];
        }
        
        // Compare selected words with correct order
        const isOrderCorrect = selectedWords.length === correctOrder.length &&
          selectedWords.every((word, idx) => 
            word.toLowerCase().trim() === (correctOrder[idx] || '').toLowerCase().trim()
          );
        onAnswer(isOrderCorrect);
        break;
        
      case 'translate':
        if (!userAnswer.trim()) return;
        const userAns = userAnswer.toLowerCase().trim();
        const correctAns = exercise.respuesta_correcta.toLowerCase().trim();
        onAnswer(userAns === correctAns);
        break;
        
      default:
        console.log('Tipo de ejercicio no manejado:', exercise.tipo);
    }
  };

  // Text-to-Speech para pronunciar palabras
  const speakWord = (word) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'es-PE';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const playAudio = () => {
    if (exercise.audio_url) {
      setIsPlaying(true);
      const audio = new Audio(exercise.audio_url);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        speakWord(exercise.respuesta_correcta);
      };
      audio.play().catch(() => {
        setIsPlaying(false);
        speakWord(exercise.respuesta_correcta);
      });
    } else {
      setIsPlaying(true);
      speakWord(exercise.respuesta_correcta);
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (!exercise) {
    return <div className="text-center text-gray-500 p-6">No hay ejercicio disponible</div>;
  }

  // =====================================================
  // 1. OPCIÓN MÚLTIPLE
  // =====================================================
  if (exercise.tipo === 'multiple_choice') {
    const opciones = safeJsonParse(exercise.opciones, []);
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {exercise.pregunta}
        </h2>
        <div className="space-y-3 mb-6">
          {opciones.map((opcion, index) => (
            <button
              key={index}
              onClick={() => setSelected(opcion)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                selected === opcion
                  ? 'border-green-600 bg-green-50 shadow-md'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{opcion}</span>
            </button>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
            selected === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
          }`}
        >
          Verificar
        </button>
      </div>
    );
  }

  // =====================================================
  // 2. ESCUCHAR Y ESCRIBIR
  // =====================================================
  if (exercise.tipo === 'listen_write') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🎧 Escucha y escribe lo que oyes
        </h2>
        <button
          onClick={playAudio}
          disabled={isPlaying}
          className={`flex items-center gap-3 mx-auto mb-6 px-8 py-4 rounded-full transition-all ${
            isPlaying
              ? 'bg-blue-400 text-white'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
          }`}
        >
          <Volume2 className={`w-6 h-6 ${isPlaying ? 'animate-pulse' : ''}`} />
          {isPlaying ? 'Reproduciendo...' : 'Escuchar 🔊'}
        </button>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe aquí lo que escuchaste..."
          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none mb-6 text-lg"
        />
        <button
          onClick={handleSubmit}
          disabled={!userAnswer.trim()}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
            !userAnswer.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
          }`}
        >
          Verificar
        </button>
      </div>
    );
  }

  // =====================================================
  // 3. VERDADERO O FALSO
  // =====================================================
  if (exercise.tipo === 'true_false') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {exercise.pregunta}
        </h2>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelected(true)}
            className={`flex-1 p-6 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
              selected === true
                ? 'border-green-600 bg-green-50 shadow-md'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <Check className="w-8 h-8 text-green-600" />
            <span className="text-xl font-bold">Verdadero</span>
          </button>
          <button
            onClick={() => setSelected(false)}
            className={`flex-1 p-6 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
              selected === false
                ? 'border-red-600 bg-red-50 shadow-md'
                : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <X className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold">Falso</span>
          </button>
        </div>
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
            selected === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
          }`}
        >
          Verificar
        </button>
      </div>
    );
  }

  // =====================================================
  // 4. COMPLETAR ESPACIOS (FILL BLANKS)
  // =====================================================
  if (exercise.tipo === 'fill_blanks') {
    const parts = exercise.pregunta.split('___');
    
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          ✏️ Completa los espacios en blanco
        </h2>
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl mb-6 text-lg border-2 border-blue-200">
          {parts.map((part, index) => (
            <span key={index}>
              {part}
              {index < parts.length - 1 && (
                <input
                  type="text"
                  value={fillBlanks[index] || ''}
                  onChange={(e) => setFillBlanks({...fillBlanks, [index]: e.target.value})}
                  onKeyPress={handleKeyPress}
                  className="inline-block mx-2 px-4 py-2 border-b-2 border-blue-600 bg-white focus:outline-none focus:border-green-600 min-w-[120px] rounded-lg"
                  placeholder="..."
                />
              )}
            </span>
          ))}
        </div>
        <button
          onClick={handleSubmit}
          disabled={Object.keys(fillBlanks).length === 0 || Object.values(fillBlanks).some(v => !v.trim())}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
            Object.keys(fillBlanks).length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
          }`}
        >
          Verificar
        </button>
      </div>
    );
  }

  // =====================================================
  // 5. EMPAREJAR (MATCHING)
  // =====================================================
  if (exercise.tipo === 'matching') {
    let leftItems = [];
    let rightItems = [];
    
    try {
      const opciones = safeJsonParse(exercise.opciones, {});
      leftItems = opciones.columna_izquierda || [];
      rightItems = opciones.columna_derecha || [];
      
      // If no columns found, try to get from respuesta_correcta
      if (leftItems.length === 0) {
        const correct = safeJsonParse(exercise.respuesta_correcta, {});
        leftItems = Object.keys(correct);
        rightItems = Object.values(correct);
      }
    } catch (e) {
      console.error('Error parsing matching data:', e);
    }

    const handleLeftClick = (item) => {
      setSelectedLeft(item);
    };

    const handleRightClick = (item) => {
      if (selectedLeft) {
        setMatchingPairs(prev => ({...prev, [selectedLeft]: item}));
        setSelectedLeft(null);
      }
    };

    const resetPairs = () => {
      setMatchingPairs({});
      setSelectedLeft(null);
    };

    const isRightMatched = (rightItem) => Object.values(matchingPairs).includes(rightItem);

    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          🔗 {exercise.pregunta}
        </h2>
        <p className="text-gray-600 mb-6">Selecciona un elemento de la izquierda y luego su pareja de la derecha</p>
        
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Columna Izquierda */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-700 text-center mb-2">Quechua</h3>
            {leftItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleLeftClick(item)}
                disabled={!!matchingPairs[item]}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  matchingPairs[item]
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : selectedLeft === item
                    ? 'bg-blue-100 border-blue-600 shadow-md'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                <span className="font-medium">{item}</span>
                {matchingPairs[item] && (
                  <span className="ml-2 text-green-600">→ {matchingPairs[item]}</span>
                )}
              </button>
            ))}
          </div>
          
          {/* Columna Derecha */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-700 text-center mb-2">Español</h3>
            {rightItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleRightClick(item)}
                disabled={isRightMatched(item) || !selectedLeft}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                  isRightMatched(item)
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : selectedLeft && !isRightMatched(item)
                    ? 'bg-white border-orange-400 hover:bg-orange-50 cursor-pointer'
                    : 'bg-gray-100 border-gray-300 cursor-not-allowed'
                }`}
              >
                <span className="font-medium">{item}</span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={resetPairs}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
          <span className="text-gray-600 py-2">
            Emparejados: {Object.keys(matchingPairs).length} de {leftItems.length}
          </span>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={Object.keys(matchingPairs).length !== leftItems.length}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
            Object.keys(matchingPairs).length !== leftItems.length
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
          }`}
        >
          Verificar
        </button>
      </div>
    );
  }

  // =====================================================
  // 6. ORDENAR PALABRAS (WORD ORDER / DRAG WORDS)
  // =====================================================
  if (exercise.tipo === 'word_order' || exercise.tipo === 'drag_words') {
    let words = [];
    
    try {
      const opciones = safeJsonParse(exercise.opciones, {});
      words = opciones.palabras || [];
      
      // If no palabras found, try to parse opciones as array
      if (words.length === 0 && Array.isArray(opciones)) {
        words = opciones;
      }
    } catch (e) {
      console.error('Error parsing word_order options:', e);
    }

    const availableWords = words.filter(w => !selectedWords.includes(w));

    const addWord = (word) => {
      setSelectedWords([...selectedWords, word]);
    };

    const removeWord = (index) => {
      setSelectedWords(selectedWords.filter((_, i) => i !== index));
    };

    const resetWords = () => {
      setSelectedWords([]);
    };

    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📝 {exercise.pregunta}
        </h2>
        
        {/* Área de respuesta */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Tu respuesta:</p>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-dashed border-blue-300 min-h-[80px] flex flex-wrap gap-2 items-center">
            {selectedWords.length === 0 ? (
              <span className="text-gray-400 italic">Selecciona las palabras en orden...</span>
            ) : (
              selectedWords.map((word, index) => (
                <button
                  key={index}
                  onClick={() => removeWord(index)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md transition"
                >
                  {word} ✕
                </button>
              ))
            )}
          </div>
        </div>
        
        {/* Palabras disponibles */}
        <div className="mb-6">
          <p className="text-gray-600 mb-2">Palabras disponibles:</p>
          <div className="flex flex-wrap gap-2">
            {availableWords.map((word, index) => (
              <button
                key={index}
                onClick={() => addWord(word)}
                className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition font-medium"
              >
                {word}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex gap-4 mb-4">
          <button
            onClick={resetWords}
            className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            Reiniciar
          </button>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={selectedWords.length === 0}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
            selectedWords.length === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
          }`}
        >
          Verificar
        </button>
      </div>
    );
  }

  // =====================================================
  // 7. TRADUCIR
  // =====================================================
  if (exercise.tipo === 'translate') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🌐 Traduce la siguiente palabra o frase
        </h2>
        <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl mb-6 text-center border-2 border-blue-200">
          <p className="text-2xl font-bold text-gray-800">{exercise.pregunta}</p>
          <button
            onClick={() => speakWord(exercise.pregunta)}
            className="mt-3 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition"
            title="Escuchar pronunciación"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Escribe tu traducción aquí..."
          className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-600 focus:border-green-600 focus:outline-none mb-6 text-lg"
        />
        <button
          onClick={handleSubmit}
          disabled={!userAnswer.trim()}
          className={`w-full py-4 px-6 rounded-xl font-bold transition-all ${
            !userAnswer.trim()
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg'
          }`}
        >
          Verificar
        </button>
      </div>
    );
  }

  // =====================================================
  // TIPO NO SOPORTADO
  // =====================================================
  return (
    <div className="text-center p-6">
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
        <p className="text-red-600 font-bold">Tipo de ejercicio no soportado: {exercise.tipo}</p>
      </div>
    </div>
  );
};

export default ExerciseTypes;