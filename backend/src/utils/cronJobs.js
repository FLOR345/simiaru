// backend/src/utils/cronJobs.js
// Tareas programadas para notificaciones automáticas

import cron from 'node-cron';
import { pool } from '../config/database.js';
import * as emailService from './emailService.js';

// ==================== INICIAR TAREAS PROGRAMADAS ====================

export const initCronJobs = () => {
  console.log('⏰ Iniciando tareas programadas...');

  // ====================================================================
  // 📧 RECORDATORIO DE RACHA - Todos los días a las 8:00 PM
  // ====================================================================
  cron.schedule('0 20 * * *', async () => {
    console.log('\n📧 [CRON] Ejecutando: Recordatorios de racha diarios...');
    
    try {
      const query = `
        SELECT u.id, u.nombre, u.email, u.racha_actual
        FROM usuarios u
        WHERE u.racha_actual > 0
        AND NOT EXISTS (
          SELECT 1 FROM progreso_usuario p
          WHERE p.usuario_id = u.id
          AND DATE(p.fecha_completado) = CURRENT_DATE
        )
      `;
      
      const { rows: usuarios } = await pool.query(query);
      
      console.log(`   Encontrados ${usuarios.length} usuarios con racha en riesgo`);
      
      let enviados = 0;
      for (const usuario of usuarios) {
        const success = await emailService.sendStreakReminder(usuario);
        if (success) enviados++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`   ✅ Recordatorios enviados: ${enviados}/${usuarios.length}`);
      
    } catch (error) {
      console.error('   ❌ Error en cron de recordatorios:', error.message);
    }
  }, {
    timezone: "America/Lima"
  });

  // ====================================================================
  // 🔄 VERIFICAR RACHAS PERDIDAS - Todos los días a las 12:01 AM
  // ====================================================================
  cron.schedule('1 0 * * *', async () => {
    console.log('\n🔄 [CRON] Ejecutando: Verificación de rachas perdidas...');
    
    try {
      const query = `
        SELECT u.id, u.nombre, u.email, u.racha_actual
        FROM usuarios u
        WHERE u.racha_actual > 0
        AND u.ultima_actividad < CURRENT_DATE - INTERVAL '1 day'
      `;
      
      const { rows: usuarios } = await pool.query(query);
      
      console.log(`   Encontrados ${usuarios.length} usuarios con racha perdida`);
      
      let procesados = 0;
      for (const usuario of usuarios) {
        const rachaAnterior = usuario.racha_actual;
        
        await pool.query(
          'UPDATE usuarios SET racha_actual = 0 WHERE id = $1',
          [usuario.id]
        );
        
        await emailService.sendStreakLost(usuario, rachaAnterior);
        procesados++;
        
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      console.log(`   ✅ Rachas reiniciadas: ${procesados}`);
      
    } catch (error) {
      console.error('   ❌ Error en cron de rachas:', error.message);
    }
  }, {
    timezone: "America/Lima"
  });

  // ====================================================================
  // 📊 REPORTE SEMANAL - Domingos a las 10:00 AM
  // ====================================================================
  cron.schedule('0 10 * * 0', async () => {
    console.log('\n📊 [CRON] Ejecutando: Estadísticas semanales...');
    
    try {
      const stats = await pool.query(`
        SELECT 
          COUNT(DISTINCT usuario_id) as usuarios_activos,
          COUNT(*) as lecciones_completadas
        FROM progreso_usuario
        WHERE fecha_completado >= CURRENT_DATE - INTERVAL '7 days'
      `);
      
      console.log(`   📊 Usuarios activos esta semana: ${stats.rows[0].usuarios_activos}`);
      console.log(`   📊 Lecciones completadas: ${stats.rows[0].lecciones_completadas}`);
      
    } catch (error) {
      console.error('   ❌ Error en cron de estadísticas:', error.message);
    }
  }, {
    timezone: "America/Lima"
  });

  console.log('✅ Tareas programadas iniciadas:');
  console.log('   - 📧 Recordatorio de racha: 8:00 PM diario');
  console.log('   - 🔄 Verificar rachas perdidas: 12:01 AM diario');
  console.log('   - 📊 Estadísticas semanales: Domingos 10:00 AM');
};