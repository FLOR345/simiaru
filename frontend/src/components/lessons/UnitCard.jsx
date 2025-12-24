// frontend/src/components/lessons/UnitCard.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, Lock, Star, Trophy, Zap, Users, Target, Mountain, Award, ChevronRight } from 'lucide-react';

const UnitCard = ({ unit, index, isLocked, userProgress }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const getUnitColor = (unitNumber) => {
    const colors = [
      'from-green-500 to-emerald-600',
      'from-blue-500 to-cyan-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-yellow-500 to-amber-600',
      'from-indigo-500 to-purple-600',
      'from-teal-500 to-green-600',
      'from-rose-500 to-pink-600',
    ];
    return colors[(unitNumber - 1) % colors.length];
  };

  const getUnitIcon = (theme) => {
    const icons = {
      'greetings': Users,
      'family': Users,
      'numbers': Target,
      'colors': Award,
      'food': Award,
      'nature': Mountain,
      'animals': Trophy,
      'culture': Award,
      'default': Book
    };
    const IconComponent = icons[theme] || icons.default;
    return <IconComponent className="w-16 h-16 text-white" />;
  };

  const handleClick = () => {
    if (isLocked) {
      alert('¡Completa las unidades anteriores para desbloquear esta!');
      return;
    }
    // Navegar a las lecciones de la unidad
    navigate(`/lessons?unit=${unit.id}`);
  };

  const progress = userProgress || unit.progress || 0;
  const isCompleted = unit.completed || progress >= 100;

  return (
    <div
      className={`relative ${index % 2 === 0 ? 'ml-0 md:ml-20' : 'ml-0 md:mr-20 md:ml-auto'} max-w-md`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        onClick={handleClick}
        className={`
          relative group cursor-pointer
          ${isLocked ? 'opacity-60' : 'hover:scale-105'}
          transition-all duration-300
        `}
      >
        {/* Card */}
        <div className={`
          bg-white rounded-3xl shadow-xl overflow-hidden
          ${!isLocked && isHovered && 'shadow-2xl'}
          border-4 ${isCompleted ? 'border-green-400' : isLocked ? 'border-gray-300' : 'border-purple-300'}
        `}>
          {/* Header with Gradient */}
          <div className={`
            h-32 bg-gradient-to-br ${getUnitColor(unit.unit_number)}
            flex items-center justify-center relative overflow-hidden
          `}>
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.1) 10px, rgba(255,255,255,.1) 20px)`
              }}></div>
            </div>
            
            {/* Unit Icon */}
            <div className="relative z-10">
              {isLocked ? (
                <Lock className="w-16 h-16 text-white/80" />
              ) : isCompleted ? (
                <Trophy className="w-16 h-16 text-yellow-300 animate-pulse" />
              ) : (
                getUnitIcon(unit.theme)
              )}
            </div>
            
            {/* Unit Number Badge */}
            <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-white font-black text-sm">Unidad {unit.unit_number}</span>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <h3 className="text-2xl font-black text-gray-800 mb-2">
              {unit.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{unit.description}</p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4 text-purple-500" />
                <span className="text-sm text-gray-600">
                  {unit.lesson_count || 0} lecciones
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-600">
                  {unit.xp_reward || 100} XP
                </span>
              </div>
            </div>
            
            {/* Progress Bar */}
            {!isLocked && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-600">Progreso</span>
                  <span className="text-sm font-bold text-purple-600">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            
            {/* Action Button */}
            <button
              className={`
                w-full mt-4 py-3 px-6 rounded-2xl font-bold
                flex items-center justify-center gap-2
                transition-all duration-300
                ${isLocked 
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg transform hover:scale-105'
                }
              `}
              disabled={isLocked}
            >
              {isLocked ? (
                <>
                  <Lock className="w-5 h-5" />
                  Bloqueado
                </>
              ) : isCompleted ? (
                <>
                  <Trophy className="w-5 h-5" />
                  Repasar
                </>
              ) : (
                <>
                  Comenzar
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Completion Star */}
        {isCompleted && (
          <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg transform rotate-12 animate-pulse">
            <Star className="w-7 h-7 text-white fill-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitCard;