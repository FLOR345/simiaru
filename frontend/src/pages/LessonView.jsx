import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExerciseTypes from "../components/lessons/ExerciseTypes";
import { Volume2, X, Check, ArrowLeft, BookOpen, Trophy, Star, Sparkles } from 'lucide-react';

const LessonView = ({ user, isGuest }) => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [vocabulary, setVocabulary] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [score, setScore] = useState(0);
  const [showVocab, setShowVocab] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [learnedWords, setLearnedWords] = useState([]);

  // Detectar idioma
  const isAymara = lesson?.idioma === 'aymara';
  
  // Tema según idioma
  const theme = isAymara 
    ? {
        gradient: 'from-blue-500 to-indigo-600',
        lightGradient: 'from-blue-50 to-indigo-50',
        accent: 'blue',
        flag: '🌙',
        emoji: '⛰️',
        name: 'Aymara'
      }
    : {
        gradient: 'from-orange-500 to-red-500',
        lightGradient: 'from-orange-50 to-yellow-50',
        accent: 'orange',
        flag: '☀️',
        emoji: '🏔️',
        name: 'Quechua'
      };

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const { data } = await axios.get(`/api/lessons/lessons/${lessonId}`, config);
      console.log('Datos recibidos:', data);
      
      setLesson(data.lesson);
      setVocabulary(data.vocabulary || []);
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  // Text-to-Speech
  const speakWord = (word) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'es-PE';
    utterance.rate = 0.8;
    window.speechSynthesis.speak(utterance);
  };

  const playAudio = (url, word) => {
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(() => speakWord(word));
    } else {
      speakWord(word);
    }
  };

  const toggleLearnedWord = (wordId) => {
    setLearnedWords(prev => 
      prev.includes(wordId) 
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
  };

  const handleAnswer = (isCorrect) => {
  setFeedback(isCorrect ? 'correct' : 'incorrect');
  if (isCorrect) {
    setScore(score + 1);
  }

  setTimeout(() => {
    setFeedback(null);
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      window.scrollTo(0, 0);  // <-- AGREGAR AQUÍ
    } else {
      setShowResults(true);
      window.scrollTo(0, 0);  // <-- AGREGAR AQUÍ
    }
  }, 1500);
};

  const finishLesson = async () => {
    const percentage = exercises.length > 0 
      ? Math.round((score / exercises.length) * 100) 
      : 100;
    
    if (!isGuest && user) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/progress/save', {
          leccionId: parseInt(lessonId),
          porcentajeAciertos: percentage
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Error guardando progreso:', error);
      }
    }
    
    navigate('/dashboard', {
      state: { 
        completed: true, 
        score: percentage,
        message: percentage >= 80 
          ? isAymara ? '¡Wali luratawa!' : '¡Allin rurasqayki!' 
          : 'Sigue practicando'
      }
    });
  };

  // ==================== PANTALLA DE CARGA ====================
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.lightGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl">
              {theme.flag}
            </span>
          </div>
          <p className="text-gray-600 font-medium mt-4">Cargando lección...</p>
        </div>
      </div>
    );
  }

  // ==================== PANTALLA DE RESULTADOS ====================
  if (showResults) {
    const percentage = exercises.length > 0 
      ? Math.round((score / exercises.length) * 100) 
      : 100;
    const passed = percentage >= 80;

    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.lightGradient} py-8`}>
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            {/* Icono de resultado */}
            <div className={`w-28 h-28 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'
            } shadow-lg`}>
              <Trophy className="w-14 h-14 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {passed ? '¡Felicitaciones! 🎉' : '¡Buen intento! 💪'}
            </h2>
            <p className="text-gray-600 mb-6">
              {passed 
                ? isAymara ? '¡Wali luratawa! (¡Bien hecho!)' : '¡Allin rurasqayki! (¡Bien hecho!)'
                : 'Sigue practicando para mejorar'}
            </p>

            {/* Porcentaje */}
            <div className={`bg-gradient-to-r ${passed ? 'from-green-50 to-emerald-50' : 'from-orange-50 to-amber-50'} rounded-2xl p-6 mb-6`}>
              <div className={`text-6xl font-black mb-2 ${passed ? 'text-green-600' : 'text-orange-600'}`}>
                {percentage}%
              </div>
              <p className="text-gray-600 text-lg">
                {score} de {exercises.length} respuestas correctas
              </p>
              <div className="flex justify-center gap-1 mt-3">
                {Array.from({ length: exercises.length }).map((_, i) => (
                  <div 
                    key={i}
                    className={`w-3 h-3 rounded-full ${i < score ? 'bg-green-500' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            {/* Advertencia modo invitado */}
            {isGuest && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 mb-6">
                <p className="text-orange-800 font-medium">
                  ⚠️ Modo Invitado: Tu progreso no se guardará
                </p>
                <button
                  onClick={() => navigate('/register')}
                  className="mt-2 text-orange-600 font-bold hover:underline"
                >
                  Crear cuenta gratis →
                </button>
              </div>
            )}

            {/* Botones */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-4 px-6 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Volver
              </button>
              <button
                onClick={finishLesson}
                className={`flex-1 py-4 px-6 bg-gradient-to-r ${theme.gradient} text-white font-bold rounded-xl hover:shadow-lg transition`}
              >
                {passed ? 'Continuar' : 'Finalizar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== PANTALLA DE VOCABULARIO ====================
  if (showVocab) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.lightGradient}`}>
        {/* Header */}
        <div className={`bg-gradient-to-r ${theme.gradient} text-white`}>
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            <button
              onClick={() => navigate('/dashboard')}
              className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al Dashboard</span>
            </button>
            
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
                <span className="text-4xl">{theme.emoji}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{theme.flag}</span>
                  <span className="text-white/80 font-medium">{theme.name}</span>
                </div>
                <h1 className="text-3xl font-bold">{lesson?.titulo}</h1>
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-white/80 text-sm">Vocabulario</div>
                <div className="text-2xl font-bold">{vocabulary.length} palabras</div>
              </div>
            </div>
          </div>
          
          {/* Onda decorativa */}
          <svg className="w-full h-6 -mb-1" viewBox="0 0 1200 30" preserveAspectRatio="none">
            <path d="M0,30 C300,10 600,25 900,10 C1050,0 1150,15 1200,10 L1200,30 L0,30 Z" 
              fill="currentColor" 
              className={isAymara ? 'text-blue-50' : 'text-orange-50'} 
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Contenido teórico */}
          {lesson?.contenido_teorico && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-amber-400">
              <div className="flex items-start gap-3">
                <BookOpen className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">💡 ¿Qué aprenderás?</h3>
                  <p className="text-gray-600 leading-relaxed">{lesson.contenido_teorico}</p>
                </div>
              </div>
            </div>
          )}

          {/* Progreso de palabras */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Star className="w-6 h-6 text-amber-500" />
                <span className="font-medium text-gray-700">
                  {learnedWords.length} de {vocabulary.length} palabras marcadas
                </span>
              </div>
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${theme.gradient} transition-all duration-500`}
                  style={{ width: `${vocabulary.length > 0 ? (learnedWords.length / vocabulary.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Lista de vocabulario */}
          <div className="space-y-4 mb-8">
            {vocabulary.map((word, index) => (
              <div
                key={word.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  learnedWords.includes(word.id) ? 'ring-2 ring-green-400' : ''
                }`}
              >
                <div className="flex items-center p-4">
                  {/* Número */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${theme.gradient} rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4`}>
                    {index + 1}
                  </div>
                  
                  {/* Contenido */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-gray-800">{word.palabra_objetivo}</h3>
                      <span>{theme.flag}</span>
                    </div>
                    <p className="text-gray-600">{word.palabra_espanol} 🇪🇸</p>
                    {word.ejemplo_uso && (
                      <p className="text-sm text-blue-600 mt-1 italic">"{word.ejemplo_uso}"</p>
                    )}
                  </div>
                  
                  {/* Botones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playAudio(word.audio_url, word.palabra_objetivo)}
                      className={`p-3 bg-gradient-to-r ${theme.gradient} text-white rounded-full hover:shadow-lg transition transform hover:scale-110`}
                      title="Escuchar"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => toggleLearnedWord(word.id)}
                      className={`p-3 rounded-full transition transform hover:scale-110 ${
                        learnedWords.includes(word.id)
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                      title="Marcar como aprendida"
                    >
                      <Star className={`w-5 h-5 ${learnedWords.includes(word.id) ? 'fill-white' : ''}`} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Botón comenzar ejercicios */}
          <div className="sticky bottom-4">
            <button
                onClick={() => {
                  console.log('Comenzando ejercicios, total:', exercises.length);
                  if (exercises.length > 0) {
                    setShowVocab(false);
                    window.scrollTo(0, 0);  // <-- AGREGAR AQUÍ
                  } else {
                    finishLesson();
                  }
                }}
              disabled={exercises.length === 0}
              className={`w-full py-5 bg-gradient-to-r ${theme.gradient} text-white font-bold text-lg rounded-2xl hover:shadow-2xl transition transform hover:scale-[1.02] flex items-center justify-center gap-3 ${
                exercises.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Sparkles className="w-6 h-6" />
              {exercises.length > 0 
                ? `¡Comenzar Ejercicios! (${exercises.length} preguntas)` 
                : 'No hay ejercicios disponibles'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== PANTALLA DE EJERCICIOS ====================
  const exercise = exercises[currentExercise];
  console.log('Ejercicio actual:', exercise, 'Index:', currentExercise);

  if (!exercise) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.lightGradient} flex items-center justify-center`}>
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-red-600 mb-4 font-medium">Error: No se encontró el ejercicio</p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className={`px-6 py-3 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-bold`}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.lightGradient} py-8`}>
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowVocab(true)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver al vocabulario</span>
          </button>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <span className="font-bold text-gray-800">{score}/{exercises.length}</span>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium flex items-center gap-2">
              <span className="text-xl">{theme.flag}</span>
              Pregunta {currentExercise + 1} de {exercises.length}
            </span>
            <span>{Math.round(((currentExercise + 1) / exercises.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`bg-gradient-to-r ${theme.gradient} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Tarjeta del ejercicio */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 flex items-center justify-center gap-3 ${
                feedback === 'correct' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
              }`}
            >
              {feedback === 'correct' ? (
                <>
                  <Check className="w-6 h-6" />
                  <span className="font-bold text-lg">¡Correcto! 🎉</span>
                </>
              ) : (
                <>
                  <X className="w-6 h-6" />
                  <span className="font-bold text-lg">Incorrecto 😕</span>
                </>
              )}
            </div>
          )}

          {/* Componente de ejercicios - AQUÍ USA ExerciseTypes */}
          <ExerciseTypes exercise={exercise} onAnswer={handleAnswer} />
        </div>
      </div>
    </div>
  );
};

export default LessonView;