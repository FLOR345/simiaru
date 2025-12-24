import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Header from './shared/Header';
import { Search, Volume2 } from 'lucide-react';

const Dictionary = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await api.getCategories(user?.idioma_objetivo || 'quechua');
      setCategories(data.categories);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const { data } = await api.searchWord(searchTerm, user?.idioma_objetivo || 'quechua');
      setResults(data.words);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (url) => {
    if (url) {
      const audio = new Audio(url);
      audio.play();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="card mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Diccionario Interactivo</h1>
          
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar palabra en español o quechua/aymara..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-wiphala-green focus:outline-none"
            />
            <button type="submit" className="btn-primary flex items-center gap-2">
              <Search className="w-5 h-5" />
              Buscar
            </button>
          </form>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="card mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Categorías</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.categoria}
                  onClick={() => {
                    setSearchTerm(cat.categoria);
                    handleSearch({ preventDefault: () => {} });
                  }}
                  className="px-4 py-2 bg-wiphala-blue/10 text-wiphala-blue rounded-lg hover:bg-wiphala-blue/20 transition-colors"
                >
                  {cat.categoria} ({cat.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Buscando...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            {results.map((word) => (
              <div key={word.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{word.palabra_objetivo}</h3>
                      {word.audio_url && (
                        <button
                          onClick={() => playAudio(word.audio_url)}
                          className="p-2 bg-wiphala-blue text-white rounded-full hover:bg-blue-600"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-lg text-gray-600 mb-2">{word.palabra_español}</p>
                    {word.categoria && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                        {word.categoria}
                      </span>
                    )}
                    {word.ejemplo_uso && (
                      <p className="mt-3 text-gray-600 italic">
                        <strong>Ejemplo:</strong> {word.ejemplo_uso}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : searchTerm && !loading ? (
          <div className="card text-center py-8">
            <p className="text-gray-600">No se encontraron resultados para "{searchTerm}"</p>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Dictionary;