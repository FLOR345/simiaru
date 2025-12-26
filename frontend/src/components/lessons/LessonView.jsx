import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ExerciseTypes from './ExerciseTypes';
import { Volume2, X, Check, ArrowLeft, BookOpen, Trophy } from 'lucide-react';

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

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      
      const { data } = await axios.get(`/api/lessons/${lessonId}`, config);
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

  // Text-to-Speech para pronunciar palabras
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
      audio.play().catch(() => {
        // Si falla el audio, usar TTS
        speakWord(word);
      });
    } else {
      // Si no hay URL, usar TTS
      speakWord(word);
    }
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
    
    // Solo guardar progreso si NO es invitado
    if (!isGuest && user) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('/api/progress/save', {
          leccionId: lessonId,
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
        message: percentage >= 80 ? '¡Allin rurasqayki! (¡Bien hecho!)' : 'Sigue practicando'
      }
    });
  };

  // Pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Cargando lección...</p>
        </div>
      </div>
    );
  }

  // Pantalla de resultados
  if (showResults) {
    const percentage = exercises.length > 0 
      ? Math.round((score / exercises.length) * 100) 
      : 100;
    const passed = percentage >= 80;

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-green-100' : 'bg-orange-100'
            }`}>
              <Trophy className={`w-12 h-12 ${passed ? 'text-green-600' : 'text-orange-600'}`} />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {passed ? '¡Felicitaciones!' : '¡Buen intento!'}
            </h2>
            <p className="text-gray-600 mb-6">
              {passed 
                ? '¡Allin rurasqayki! (¡Bien hecho!)' 
                : 'Sigue practicando para mejorar'}
            </p>

            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
              <div className="text-5xl font-black mb-2" style={{
                color: passed ? '#16a34a' : '#ea580c'
              }}>
                {percentage}%
              </div>
              <p className="text-gray-600">
                {score} de {exercises.length} respuestas correctas
              </p>
            </div>

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

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 py-4 px-6 border-2 border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Volver al Dashboard
              </button>
              <button
                onClick={finishLesson}
                className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg transition"
              >
                {passed ? 'Continuar' : 'Finalizar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla de vocabulario
  if (showVocab) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-white rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{lesson?.titulo}</h1>
              <p className="text-gray-600">{lesson?.unidad_nombre}</p>
            </div>
          </div>

          {/* Contenido teórico */}
          {lesson?.contenido_teorico && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-800">Introducción</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{lesson.contenido_teorico}</p>
            </div>
          )}

          {/* Vocabulario */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              📚 Vocabulario ({vocabulary.length} palabras)
            </h2>
            <div className="space-y-3">
              {vocabulary.map((word) => (
                <div 
                  key={word.id} 
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <p className="text-xl font-bold text-gray-800">{word.palabra_objetivo}</p>
                    <p className="text-gray-600">{word.palabra_espanol}</p>
                    {word.ejemplo_uso && (
                      <p className="text-sm text-blue-600 mt-1 italic">"{word.ejemplo_uso}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => playAudio(word.audio_url, word.palabra_objetivo)}
                    className="ml-4 p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:shadow-lg transition"
                    title="Escuchar pronunciación"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Botón comenzar */}
          <button
            onClick={() => setShowVocab(false)}
            disabled={exercises.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              exercises.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl'
            }`}
          >
            {exercises.length === 0 
              ? 'No hay ejercicios disponibles' 
              : `Comenzar Ejercicios (${exercises.length} preguntas)`}
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de ejercicios
  // Pantalla de ejercicios
const exercise = exercises[currentExercise];
console.log('Exercise actual:', exercise, 'Index:', currentExercise, 'Total:', exercises.length);
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-8">
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
          <div className="text-right">
            <p className="text-sm text-gray-600">Puntuación</p>
            <p className="text-2xl font-bold text-green-600">{score}/{exercises.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">Pregunta {currentExercise + 1} de {exercises.length}</span>
            <span>{Math.round(((currentExercise + 1) / exercises.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Exercise Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 flex items-center justify-center gap-3 ${
                feedback === 'correct' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-red-500 text-white'
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

          {/* Exercise Component */}
          <ExerciseTypes exercise={exercise} onAnswer={handleAnswer} />
        </div>
      </div>
    </div>
  );
};

export default LessonView;