import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Volume2, BookOpen, Home, Tag, Sparkles, Filter, X, ArrowRight, Globe, Star, TrendingUp, Zap, CheckCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.jpg';
// URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const Dictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('quechua');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({ totalWords: 0, categories: 0 });

  useEffect(() => {
    loadCategories();
    loadStats();
  }, [selectedLanguage]);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const debounce = setTimeout(() => {
        handleSearch();
      }, 300);
      return () => clearTimeout(debounce);
    } else {
      setResults([]);
    }
  }, [searchTerm, selectedLanguage]);

  const loadStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/dictionary/stats?idioma=${selectedLanguage}`);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadCategories = async () => {
    try {
     const { data } = await axios.get(`${API_URL}/api/dictionary/categories?idioma=${selectedLanguage}`);
      setCategories(data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/dictionary/search?query=${searchTerm}&idioma=${selectedLanguage}`);
      setResults(data.words);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = async (categoria) => {
    if (selectedCategory === categoria) {
      setSelectedCategory('');
      setResults([]);
      setSearchTerm('');
      return;
    }
    
    setSelectedCategory(categoria);
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/dictionary/category?categoria=${categoria}&idioma=${selectedLanguage}`);
      setResults(data.words);
      setSearchTerm('');
    } catch (error) {
      console.error('Error loading category:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setResults([]);
  };

  const categoryIcons = {
    'saludos': '👋',
    'familia': '👨‍👩‍👧‍👦',
    'numeros': '🔢',
    'comida': '🍲',
    'animales': '🦙',
    'naturaleza': '🏔️',
    'colores': '🎨',
    'verbos': '⚡',
    'default': '📚'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* ==================== HEADER PREMIUM ==================== */}
      <header className="bg-white/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            
            {/* Logo y Título */}
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <Home className="w-6 h-6 text-gray-600 hover:text-blue-600" />
              </Link>
              
              <div className="flex items-center gap-3">
                <img 
                  src={logo} 
                  alt="SimiAru" 
                  className="h-10 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Diccionario SimiAru
                  </h1>
                  <p className="text-sm text-gray-600">
                    {stats.totalWords || 0} palabras • {categories.length} categorías
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Rápidas */}
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600 font-semibold">
                  {selectedLanguage === 'quechua' ? 'Quechua' : 'Aymara'}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-xl">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 font-bold">{results.length} resultados</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-7xl">
        
        {/* ==================== SELECCIÓN DE IDIOMA ==================== */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Selecciona el idioma</h2>
              <p className="text-gray-600">Explora vocabulario en Quechua o Aymara</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Quechua */}
            <button
              onClick={() => {
                setSelectedLanguage('quechua');
                clearSearch();
              }}
              className={`group relative p-8 rounded-2xl border-3 transition-all duration-300 overflow-hidden ${
                selectedLanguage === 'quechua'
                  ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    Q
                  </div>
                  {selectedLanguage === 'quechua' && (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Quechua</h3>
                <p className="text-gray-600 font-semibold">Idioma de los Andes</p>
              </div>
            </button>

            {/* Aymara */}
            <button
              onClick={() => {
                setSelectedLanguage('aymara');
                clearSearch();
              }}
              className={`group relative p-8 rounded-2xl border-3 transition-all duration-300 overflow-hidden ${
                selectedLanguage === 'aymara'
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    A
                  </div>
                  {selectedLanguage === 'aymara' && (
                    <CheckCircle className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                <h3 className="text-2xl font-black text-gray-800 mb-2">Aymara</h3>
                <p className="text-gray-600 font-semibold">Lengua del Altiplano</p>
              </div>
            </button>
          </div>
        </div>

        {/* ==================== BARRA DE BÚSQUEDA PREMIUM ==================== */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Buscar palabras</h2>
              <p className="text-gray-600">Encuentra el vocabulario que necesitas</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 z-10" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar en ${selectedLanguage === 'quechua' ? 'Quechua' : 'Aymara'}... (español o idioma nativo)`}
              className="w-full pl-16 pr-16 py-5 border-3 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-all text-lg font-semibold"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3 text-sm text-gray-500">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold">
              Tip: Escribe al menos 2 caracteres para buscar. Prueba con "hola", "familia" o "agua"
            </span>
          </div>
        </div>

        {/* ==================== CATEGORÍAS ==================== */}
        {categories.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-800">Categorías</h2>
                  <p className="text-gray-600">Explora por temas</p>
                </div>
              </div>
              
              {selectedCategory && (
                <button
                  onClick={clearSearch}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-xl font-bold hover:bg-red-200 transition-all flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Limpiar
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => {
                const emoji = categoryIcons[cat.categoria.toLowerCase()] || categoryIcons.default;
                const isSelected = selectedCategory === cat.categoria;
                
                return (
                  <button
                    key={cat.categoria}
                    onClick={() => handleCategoryClick(cat.categoria)}
                    className={`group relative p-6 rounded-2xl transition-all duration-300 border-2 ${
                      isSelected
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md hover:scale-105'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-3">{emoji}</div>
                      <h3 className={`font-black text-lg mb-1 capitalize ${
                        isSelected ? 'text-blue-700' : 'text-gray-800'
                      }`}>
                        {cat.categoria}
                      </h3>
                      <p className="text-sm text-gray-600 font-semibold">
                        {cat.count} palabras
                      </p>
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== RESULTADOS ==================== */}
        {loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-xl font-bold text-gray-600">Buscando palabras...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-gray-800">
                  {selectedCategory ? `📚 Categoría: ${selectedCategory}` : `🔍 ${results.length} resultados`}
                </h3>
                <p className="text-gray-600">
                  {searchTerm && `Búsqueda: "${searchTerm}"`}
                </p>
              </div>
            </div>
            
            <div className="grid gap-6">
              {results.map((word, index) => (
                <WordCard 
                  key={word.id} 
                  word={word} 
                  index={index}
                  selectedLanguage={selectedLanguage}
                />
              ))}
            </div>
          </div>
        ) : searchTerm.length >= 2 && !loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">
              No se encontraron resultados
            </h3>
            <p className="text-gray-600 mb-6">
              No hay palabras que coincidan con "<span className="font-bold">{searchTerm}</span>"
            </p>
            <button
              onClick={clearSearch}
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-purple-500 via-pink-600 to-red-600 rounded-3xl shadow-2xl p-16 text-center text-white">
            <BookOpen className="w-24 h-24 mx-auto mb-6 opacity-90" />
            <h3 className="text-3xl font-black mb-4">
              Explora el vocabulario {selectedLanguage === 'quechua' ? 'Quechua' : 'Aymara'}
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Busca palabras o selecciona una categoría para comenzar
            </p>
            <div className="flex gap-4 justify-center">
              <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-bold">
                📝 {stats.totalWords || 0} palabras
              </div>
              <div className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-bold">
                📚 {categories.length} categorías
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Estilos */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

// ==================== WORD CARD COMPONENT CON AUDIO ====================
const WordCard = ({ word, index, selectedLanguage }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef(null);

  // Función para reproducir audio
  const handlePlayAudio = () => {
    // Si tiene audio de Cloudinary, reproducirlo
    if (word.audio_url) {
      playCloudinaryAudio();
    } else {
      // Fallback: usar Text-to-Speech del navegador
      playTTS();
    }
  };

  // Reproducir audio de Cloudinary
  const playCloudinaryAudio = () => {
    setIsPlaying(true);
    setAudioError(false);
    
    if (audioRef.current) {
      audioRef.current.src = word.audio_url;
      audioRef.current.play()
        .then(() => {
          // Audio playing
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          setAudioError(true);
          // Fallback a TTS si falla el audio
          playTTS();
        });
    }
  };

  // Fallback: Text-to-Speech del navegador
  const playTTS = () => {
    if ('speechSynthesis' in window) {
      setIsPlaying(true);
      const utterance = new SpeechSynthesisUtterance(word.palabra_objetivo);
      utterance.lang = selectedLanguage === 'quechua' ? 'es-PE' : 'es-BO';
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  const gradients = [
    'from-blue-500 to-cyan-600',
    'from-green-500 to-emerald-600',
    'from-purple-500 to-pink-600',
    'from-orange-500 to-red-600',
    'from-yellow-500 to-orange-600',
    'from-pink-500 to-rose-600',
  ];

  const gradient = gradients[index % gradients.length];

  return (
    <div className="group relative bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl transition-all duration-300">
      
      {/* Audio element oculto */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        onError={() => {
          setAudioError(true);
          setIsPlaying(false);
        }}
      />

      {/* Decoración de fondo */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}></div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-3">
              <h3 className={`text-4xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
                {word.palabra_objetivo}
              </h3>
              
              {/* Botón de audio mejorado */}
              <button
                onClick={handlePlayAudio}
                disabled={isPlaying}
                className={`group/btn relative p-3 bg-gradient-to-br ${gradient} rounded-xl hover:shadow-lg transition-all duration-300 ${
                  isPlaying ? 'scale-110' : 'hover:scale-110'
                } disabled:opacity-70`}
                title={word.audio_url ? "Escuchar pronunciación (audio real)" : "Escuchar pronunciación (TTS)"}
              >
                {isPlaying ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
                {isPlaying && (
                  <div className="absolute inset-0 rounded-xl bg-white/30 animate-ping"></div>
                )}
              </button>

              {/* Indicador de audio real vs TTS */}
              {word.audio_url && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                  🎙️ Audio real
                </span>
              )}
            </div>

            {word.pronunciacion && (
              <p className="text-lg text-gray-600 font-semibold mb-3">
                🗣️ /{word.pronunciacion}/
              </p>
            )}

            <div className="flex items-center gap-3 mb-4">
              <ArrowRight className="w-5 h-5 text-gray-400" />
              <p className="text-2xl text-gray-800 font-bold">{word.palabra_espanol}</p>
            </div>

            {/* Categoría */}
            {word.categoria && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-200 rounded-xl">
                <Tag className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700 font-black text-sm uppercase">
                  {word.categoria}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tipo de palabra */}
        {word.tipo && (
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-lg">
              {word.tipo}
            </span>
          </div>
        )}

        {/* Ejemplo de uso */}
        {word.ejemplo_uso && (
          <div className="mt-6 p-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              <p className="text-sm font-black text-yellow-800 uppercase">Ejemplo de uso</p>
            </div>
            <p className="text-gray-800 font-semibold italic mb-2">
              "{word.ejemplo_uso}"
            </p>
            {word.traduccion_ejemplo && (
              <p className="text-gray-600">
                💬 {word.traduccion_ejemplo}
              </p>
            )}
          </div>
        )}

        {/* Info de lección */}
        {word.leccion_nombre && (
          <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
            <BookOpen className="w-4 h-4" />
            <span>
              De la lección: <span className="font-bold text-gray-700">{word.leccion_nombre}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;