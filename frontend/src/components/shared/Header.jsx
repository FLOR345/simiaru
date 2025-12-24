import { Link, useNavigate } from 'react-router-dom';
import { User, BookOpen, Heart, LogOut } from 'lucide-react';
import logo from '../../assets/logo.jpg';

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <img 
              src={logo} 
              alt="SimiAru Logo" 
              className="w-12 h-12 object-contain transform group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
            />
            <h1 className="text-2xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">SimiAru</h1>
          </Link>

          <nav className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span className="hidden md:inline">Lecciones</span>
            </Link>
            <Link to="/dictionary" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors">
              <BookOpen className="w-5 h-5" />
              <span className="hidden md:inline">Diccionario</span>
            </Link>
            <Link to="/culture" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors">
              <Heart className="w-5 h-5" />
              <span className="hidden md:inline">Cultura</span>
            </Link>
            <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">{user?.nombre || 'Perfil'}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;