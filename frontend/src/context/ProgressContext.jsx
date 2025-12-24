import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState([]);
  const [streak, setStreak] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    try {
      const { data } = await axios.get('/api/progress');
      setProgress(data.progress);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (leccionId, porcentajeAciertos) => {
    try {
      await axios.post('/api/progress/save', { leccionId, porcentajeAciertos });
      await loadProgress();
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const updateStreak = async () => {
    try {
      const { data } = await axios.post('/api/progress/streak');
      setStreak(data.streak);
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return progress.some(p => p.leccion_id === lessonId && p.completado);
  };

  return (
    <ProgressContext.Provider value={{ 
      progress, 
      streak, 
      saveProgress, 
      updateStreak, 
      isLessonCompleted 
    }}>
      {children}
    </ProgressContext.Provider>
  );
};