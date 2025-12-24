import { useProgress } from '../../context/ProgressContext';

const ProgressBar = () => {
  const { progress } = useProgress();
  
  const totalLessons = 15; // Esto debería venir de la API
  const completedLessons = progress.filter(p => p.completado).length;
  const percentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Progreso General</h3>
        <span className="text-sm text-gray-600">
          {completedLessons} / {totalLessons} lecciones
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-gradient-to-r from-wiphala-green to-wiphala-blue h-4 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-center text-sm text-gray-600 mt-2">
        {Math.round(percentage)}% completado
      </p>
    </div>
  );
};

export default ProgressBar;