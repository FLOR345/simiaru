import { pool } from '../config/database.js';
import cloudinary from '../config/cloudinary.js';

export const searchWord = async (req, res) => {
  try {
    const { query, idioma } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.json({ success: true, words: [] });
    }
    
    const result = await pool.query(
      `SELECT v.*, l.titulo as leccion_nombre, u.nombre as unidad_nombre
       FROM vocabulario v 
       JOIN lecciones l ON v.leccion_id = l.id
       JOIN unidades u ON l.unidad_id = u.id
       WHERE (v.palabra_espanol ILIKE $1 OR v.palabra_objetivo ILIKE $1) 
       AND u.idioma = $2
       ORDER BY v.palabra_espanol
       LIMIT 50`,
      [`%${query}%`, idioma]
    );
    
    res.json({ success: true, words: result.rows });
  } catch (error) {
    console.error('Error en searchWord:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const { idioma } = req.query;
    
    const result = await pool.query(
      `SELECT v.categoria, COUNT(*) as count
       FROM vocabulario v
       JOIN lecciones l ON v.leccion_id = l.id
       JOIN unidades u ON l.unidad_id = u.id
       WHERE u.idioma = $1 AND v.categoria IS NOT NULL
       GROUP BY v.categoria
       ORDER BY count DESC`,
      [idioma]
    );
    
    res.json({ success: true, categories: result.rows });
  } catch (error) {
    console.error('Error en getCategories:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getWordsByCategory = async (req, res) => {
  try {
    const { categoria, idioma } = req.query;
    
    const result = await pool.query(
      `SELECT v.*
       FROM vocabulario v
       JOIN lecciones l ON v.leccion_id = l.id
       JOIN unidades u ON l.unidad_id = u.id
       WHERE v.categoria = $1 AND u.idioma = $2
       ORDER BY v.palabra_espanol`,
      [categoria, idioma]
    );
    
    res.json({ success: true, words: result.rows });
  } catch (error) {
    console.error('Error en getWordsByCategory:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllWords = async (req, res) => {
  try {
    const { idioma } = req.query;
    
    const result = await pool.query(
      `SELECT v.*, l.titulo as leccion_nombre, u.nombre as unidad_nombre
       FROM vocabulario v 
       JOIN lecciones l ON v.leccion_id = l.id
       JOIN unidades u ON l.unidad_id = u.id
       WHERE u.idioma = $1
       ORDER BY v.palabra_espanol
       LIMIT 200`,
      [idioma]
    );
    
    res.json({ success: true, words: result.rows });
  } catch (error) {
    console.error('Error en getAllWords:', error);
    res.status(500).json({ message: error.message });
  }
};

// ==================== NUEVAS FUNCIONES PARA AUDIO ====================

// Subir audio para una palabra
export const uploadAudio = async (req, res) => {
  try {
    const { wordId } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se envió ningún archivo de audio' });
    }

    // Subir a Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Cloudinary usa 'video' para audios
          folder: 'simiaru/audios',
          public_id: `palabra_${wordId}_${Date.now()}`,
          format: 'mp3'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Actualizar la base de datos con la URL del audio
    await pool.query(
      'UPDATE vocabulario SET audio_url = $1 WHERE id = $2',
      [result.secure_url, wordId]
    );

    res.json({ 
      success: true, 
      message: 'Audio subido correctamente',
      audioUrl: result.secure_url 
    });
  } catch (error) {
    console.error('Error al subir audio:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar audio de una palabra
export const deleteAudio = async (req, res) => {
  try {
    const { wordId } = req.params;

    // Obtener la URL actual del audio
    const word = await pool.query('SELECT audio_url FROM vocabulario WHERE id = $1', [wordId]);
    
    if (word.rows[0]?.audio_url) {
      // Extraer el public_id de la URL de Cloudinary
      const urlParts = word.rows[0].audio_url.split('/');
      const publicId = urlParts.slice(-2).join('/').replace('.mp3', '');
      
      // Eliminar de Cloudinary
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    }

    // Actualizar la base de datos
    await pool.query('UPDATE vocabulario SET audio_url = NULL WHERE id = $1', [wordId]);

    res.json({ success: true, message: 'Audio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar audio:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener audio de una palabra específica
export const getWordAudio = async (req, res) => {
  try {
    const { wordId } = req.params;
    
    const result = await pool.query(
      'SELECT id, palabra_objetivo, audio_url FROM vocabulario WHERE id = $1',
      [wordId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Palabra no encontrada' });
    }

    res.json({ success: true, word: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener audio:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};