import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Header from '../components/shared/Header';
import { Volume2, BookOpen, Sparkles, Heart, Search, Globe, ArrowLeft, Image } from 'lucide-react';

const CultureModule = ({ user, setUser }) => {
  const [content, setContent] = useState([]);
  const [selectedType, setSelectedType] = useState('adivinanza');
  const [selectedLanguage, setSelectedLanguage] = useState(user?.idioma_objetivo || 'quechua');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  
  // Estado para manejar la vista de detalle de cuentos
  const [selectedStory, setSelectedStory] = useState(null);

  const types = [
    { value: 'adivinanza', label: 'Adivinanzas', icon: '❓' },
    { value: 'proverbio', label: 'Proverbios', icon: '💭' },
    { value: 'cancion', label: 'Canciones', icon: '🎵' },
    { value: 'cuento', label: 'Cuentos', icon: '📖' }
  ];

  const languages = [
    { 
      value: 'quechua', 
      name: 'Quechua',
      flag: '☀️',
      region: 'Andes Centrales',
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      emoji: '🏔️'
    },
    { 
      value: 'aymara', 
      name: 'Aymara',
      flag: '🌙',
      region: 'Altiplano',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-600',
      emoji: '⛰️'
    }
  ];

  useEffect(() => {
    loadContent();
    loadFavorites();
    // Resetear el cuento seleccionado al cambiar tipo o idioma
    setSelectedStory(null);
  }, [selectedType, selectedLanguage]);

  const loadFavorites = async () => {
    try {
      const stored = localStorage.getItem('cultureFavorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const toggleFavorite = (itemId) => {
    const newFavorites = favorites.includes(itemId)
      ? favorites.filter(id => id !== itemId)
      : [...favorites, itemId];
    
    setFavorites(newFavorites);
    localStorage.setItem('cultureFavorites', JSON.stringify(newFavorites));
  };

  const loadContent = async () => {
    setLoading(true);
    try {
      console.log('🔍 Cargando contenido:', { tipo: selectedType, idioma: selectedLanguage });
      
      const response = await api.getCulturalContent(selectedType, selectedLanguage);
      console.log('📦 Respuesta completa:', response);
      
      const contentData = response?.data?.content || response?.content || [];
      console.log('✅ Contenido recibido:', contentData);
      
      setContent(contentData);
    } catch (error) {
      console.error('❌ Error loading cultural content:', error);
      console.error('Error completo:', error.response || error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (url) => {
    if (url) {
      const audio = new Audio(url);
      audio.play().catch(err => console.error('Error playing audio:', err));
    }
  };

  const getLanguageInfo = () => {
    return languages.find(lang => lang.value === selectedLanguage) || languages[0];
  };

  const filteredContent = content.filter(item => {
    if (showFavorites && !favorites.includes(item.id)) return false;
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      item.titulo?.toLowerCase().includes(search) ||
      item.contenido_original?.toLowerCase().includes(search) ||
      item.traduccion?.toLowerCase().includes(search)
    );
  });

  const langInfo = getLanguageInfo();

  // Función para abrir un cuento
  const openStory = (story) => {
    setSelectedStory(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Función para volver a la lista de cuentos
  const backToStoryList = () => {
    setSelectedStory(null);
  };

  // Renderizar vista de detalle de cuento
  const renderStoryDetail = () => {
    if (!selectedStory) return null;

    return (
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
        {/* Header del cuento */}
        <div className={`bg-gradient-to-r ${langInfo.gradient} p-6 text-white`}>
          <button
            onClick={backToStoryList}
            className="flex items-center gap-2 mb-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Volver a Cuentos</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">📖</span>
              <div>
                <h2 className="text-3xl font-bold">{selectedStory.titulo}</h2>
                <p className="text-white/80 mt-1 flex items-center gap-2">
                  <span>{langInfo.flag}</span>
                  <span>Cuento en {langInfo.name}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleFavorite(selectedStory.id)}
              className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-all"
              title={favorites.includes(selectedStory.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              <Heart 
                className={`w-7 h-7 transition-colors ${
                  favorites.includes(selectedStory.id) 
                    ? 'fill-red-400 text-red-400' 
                    : 'text-white'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Contenido del cuento */}
        <div className="p-6 space-y-6">
          {/* Contenido Original */}
          <div className={`bg-gradient-to-br from-${langInfo.color}-50 to-yellow-50 p-6 rounded-xl border-l-4 border-${langInfo.color}-500`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold text-gray-600 uppercase flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg shadow-sm">
                {langInfo.flag} {langInfo.name}
              </span>
            </div>
            <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-medium">
              {selectedStory.contenido_original}
            </p>
          </div>

          {/* Traducción */}
          {selectedStory.traduccion && (
            <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-gray-300">
              <p className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
                📝 <span>Traducción al Español</span>
              </p>
              <p className="text-gray-700 italic leading-relaxed whitespace-pre-line text-lg">
                {selectedStory.traduccion}
              </p>
            </div>
          )}

          {/* Explicación / Significado Cultural */}
          {selectedStory.explicacion && (
            <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-400">
              <p className="text-sm font-semibold text-blue-700 mb-2 flex items-center gap-2">
                📚 <span>Significado Cultural</span>
              </p>
              <p className="text-gray-700 leading-relaxed">
                {selectedStory.explicacion}
              </p>
            </div>
          )}

          {/* Imagen del cuento */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-orange-200">
            <div className="flex items-center gap-2 mb-4">
              <Image className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Ilustración del Cuento</span>
            </div>
            <div className="flex justify-center">
              <img 
                src="/logo.jpg" 
                alt={`Ilustración: ${selectedStory.titulo}`}
                className="max-w-full h-auto rounded-xl shadow-lg border-4 border-white"
                style={{ maxHeight: '400px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/frontend/src/assets/culture-bg.jpg'; // Ruta alternativa
                }}
              />
            </div>
            <p className="text-center text-sm text-gray-500 mt-3 italic">
              Ilustración representativa del cuento "{selectedStory.titulo}"
            </p>
          </div>

          {/* Botón de audio si existe */}
          {selectedStory.audio_url && (
            <button
              onClick={() => playAudio(selectedStory.audio_url)}
              className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r ${langInfo.gradient} text-white rounded-xl hover:shadow-lg transition-all shadow-md text-lg font-semibold`}
            >
              <Volume2 className="w-6 h-6" />
              🎧 Escuchar el cuento narrado
            </button>
          )}

          {/* Botón para volver */}
          <button
            onClick={backToStoryList}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver a la lista de cuentos
          </button>
        </div>
      </div>
    );
  };

  // Renderizar lista de cuentos como botones
  const renderStoryList = () => {
    if (filteredContent.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No hay cuentos disponibles
          </h3>
          <p className="text-gray-600">
            Aún no hay cuentos en {langInfo.name}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">📖</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Cuentos Ancestrales</h2>
            <p className="text-gray-600">Selecciona un cuento para leer</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredContent.map((story) => (
            <button
              key={story.id}
              onClick={() => openStory(story)}
              className={`group relative p-5 rounded-xl text-left transition-all duration-300 border-2 border-gray-200 hover:border-transparent hover:shadow-xl bg-gradient-to-br from-white to-gray-50 hover:from-${langInfo.color}-50 hover:to-yellow-50 transform hover:scale-105`}
            >
              {/* Indicador de favorito */}
              {favorites.includes(story.id) && (
                <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
              )}

              {/* Icono y título */}
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${langInfo.gradient} text-white text-xl shadow-md group-hover:scale-110 transition-transform`}>
                  📖
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 text-lg truncate group-hover:text-orange-700 transition-colors">
                    {story.titulo || 'Sin título'}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    {langInfo.flag} {langInfo.name}
                  </p>
                </div>
              </div>

              {/* Preview del contenido */}
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                {story.contenido_original?.substring(0, 100)}...
              </p>

              {/* Indicador visual de "click para leer" */}
              <div className={`mt-4 text-sm font-medium text-${langInfo.color}-600 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                <span>Leer cuento</span>
                <span className="transform group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Renderizar contenido normal (para otros tipos que no son cuentos)
  const renderNormalContent = () => {
    if (filteredContent.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-600 mb-4">
            {showFavorites 
              ? 'No tienes favoritos guardados aún'
              : 'Intenta con otros términos de búsqueda'
            }
          </p>
          {(showFavorites || searchTerm) && (
            <button
              onClick={() => {
                setShowFavorites(false);
                setSearchTerm('');
              }}
              className={`px-6 py-2 bg-gradient-to-r ${langInfo.gradient} text-white rounded-lg hover:shadow-lg transition-all`}
            >
              Ver todo el contenido
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="grid gap-6">
        {filteredContent.map((item) => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
          >
            <div className="p-6">
              {item.titulo && (
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{types.find(t => t.value === selectedType)?.icon}</span>
                    <h3 className="text-2xl font-bold text-gray-800">{item.titulo}</h3>
                  </div>
                  <button
                    onClick={() => toggleFavorite(item.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title={favorites.includes(item.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  >
                    <Heart 
                      className={`w-6 h-6 transition-colors ${
                        favorites.includes(item.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-gray-400'
                      }`}
                    />
                  </button>
                </div>
              )}
              
              {/* Contenido Original en idioma nativo */}
              <div className={`bg-gradient-to-br from-${langInfo.color}-50 to-yellow-50 p-5 rounded-xl mb-4 border-l-4 border-${langInfo.color}-500`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-gray-600 uppercase flex items-center gap-1 bg-white/80 px-2 py-1 rounded">
                    {langInfo.flag} {langInfo.name}
                  </span>
                </div>
                <p className="text-gray-800 text-lg leading-relaxed whitespace-pre-line font-medium">
                  {item.contenido_original}
                </p>
              </div>

              {/* Traducción */}
              {item.traduccion && (
                <div className="bg-gray-50 p-5 rounded-xl mb-4 border-l-4 border-gray-300">
                  <p className="text-sm font-semibold text-gray-500 mb-2">📝 Traducción al Español:</p>
                  <p className="text-gray-700 italic leading-relaxed whitespace-pre-line">
                    {item.traduccion}
                  </p>
                </div>
              )}

              {/* Explicación */}
              {item.explicacion && (
                <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-400 mb-4">
                  <p className="text-sm font-semibold text-blue-700 mb-1">📚 Significado Cultural:</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {item.explicacion}
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {/* Audio Button */}
                {item.audio_url && (
                  <button
                    onClick={() => playAudio(item.audio_url)}
                    className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r ${langInfo.gradient} text-white rounded-xl hover:shadow-lg transition-all shadow-md`}
                  >
                    <Volume2 className="w-5 h-5" />
                    Escuchar pronunciación
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-yellow-50">
      <Header user={user} setUser={setUser} />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border-t-4 border-orange-500 relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <div className="text-9xl transform rotate-12">🏔️⛰️☀️🌙</div>
          </div>
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-gradient-to-br ${langInfo.gradient} rounded-xl shadow-lg transform hover:scale-105 transition-transform`}>
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                  Cultura Viva
                  <span className="text-2xl">{langInfo.emoji}</span>
                </h1>
                <p className="text-gray-600">Explora la sabiduría ancestral andina</p>
              </div>
            </div>
            <div className="text-6xl animate-pulse">{langInfo.flag}</div>
          </div>

          {/* Selector de Idioma */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-5 mb-4 relative z-10 border border-orange-100">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800">Selecciona el idioma ancestral:</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => {
                    setSelectedLanguage(lang.value);
                    setSearchTerm('');
                    setShowFavorites(false);
                    setSelectedStory(null);
                  }}
                  className={`relative px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    selectedLanguage === lang.value
                      ? `bg-gradient-to-r ${lang.gradient} text-white shadow-xl scale-105 border-2 border-white`
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-4xl">{lang.flag}</span>
                    <div className="text-center">
                      <div className="font-bold text-lg">{lang.name}</div>
                      <div className={`text-sm ${selectedLanguage === lang.value ? 'text-white/90' : 'text-gray-500'}`}>
                        {lang.region}
                      </div>
                    </div>
                  </div>
                  {selectedLanguage === lang.value && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info del idioma actual */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 relative z-10">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Explorando: <strong className={`text-${langInfo.color}-600 capitalize`}>{langInfo.name}</strong></span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-600">{langInfo.region}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 rounded-full font-semibold">
                {content.length} {content.length === 1 ? 'elemento' : 'elementos'}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs de Tipo de Contenido - Solo mostrar si no estamos viendo un cuento */}
        {!selectedStory && (
          <>
            <div className="flex justify-center gap-3 mb-6 overflow-x-auto pb-2">
              {types.map((type) => (
                <button
                  key={type.value}
                  onClick={() => {
                    setSelectedType(type.value);
                    setShowFavorites(false);
                    setSelectedStory(null);
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all shadow-md ${
                    selectedType === type.value && !showFavorites
                      ? `bg-gradient-to-r ${langInfo.gradient} text-white scale-105 shadow-lg`
                      : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-lg'
                  }`}
                >
                  <span className="mr-2">{type.icon}</span>
                  {type.label}
                </button>
              ))}
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder={`Buscar ${selectedType === 'cuento' ? 'cuentos' : 'contenido cultural'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                </div>
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                    showFavorites
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${showFavorites ? 'fill-white' : ''}`} />
                  Favoritos ({favorites.length})
                </button>
              </div>
            </div>
          </>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Cargando contenido cultural...</p>
          </div>
        ) : content.length > 0 ? (
          // Si es tipo cuento, mostrar vista especial
          selectedType === 'cuento' ? (
            selectedStory ? renderStoryDetail() : renderStoryList()
          ) : (
            // Para otros tipos, mostrar contenido normal
            renderNormalContent()
          )
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No hay contenido disponible
            </h3>
            <p className="text-gray-600">
              Aún no hay {types.find(t => t.value === selectedType)?.label.toLowerCase()} en {langInfo.name}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Prueba seleccionando otro tipo de contenido o idioma
            </p>
          </div>
        )}
      </main>

      {/* Estilos CSS adicionales para animaciones */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default CultureModule;