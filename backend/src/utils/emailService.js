// backend/src/utils/emailService.js
// Servicio de notificaciones por email para SIMIARU usando Resend

import { Resend } from 'resend';

// URL del frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://simiaru-3j6b.vercel.app';

// Configurar Resend
// Si no hay clave, el servidor arranca igual y solo los correos quedan desactivados
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : { emails: { send: async () => { throw new Error('RESEND_API_KEY no configurada: correo no enviado'); } } };

// Email desde (Resend requiere verificar dominio, por ahora usa el de prueba)
const EMAIL_FROM = 'SimiAru <onboarding@resend.dev>';

console.log(process.env.RESEND_API_KEY
  ? '✅ Servicio de email configurado con Resend'
  : '⚠️ RESEND_API_KEY no configurada: los correos están desactivados');

// 🔥 Recordatorio de racha diaria
export const sendStreakReminder = async (usuario) => {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: usuario.email,
      subject: `🔥 ¡${usuario.nombre}, no pierdas tu racha de ${usuario.racha_actual} días!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="font-size: 50px;">🔥</div>
            <h1 style="color: white; margin: 0;">¡No pierdas tu racha!</h1>
          </div>
          <div style="padding: 30px; background: white; text-align: center;">
            <p>¡Hola <strong>${usuario.nombre}</strong>!</p>
            <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 48px; font-weight: bold; color: #d97706;">${usuario.racha_actual}</div>
              <div style="color: #92400e;">DÍAS DE RACHA</div>
            </div>
            <a href="${FRONTEND_URL}/dashboard" style="display: inline-block; background: #f97316; color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold;">
              🎯 Continuar Aprendiendo
            </a>
          </div>
        </div>
      `
    });
    console.log(`📧 Recordatorio de racha enviado a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};

// 🎉 Felicitación por completar lección
export const sendLessonCompleted = async (usuario, leccion, porcentaje) => {
  const esExcelente = porcentaje >= 80;
  
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: usuario.email,
      subject: esExcelente 
        ? `🎉 ¡Excelente ${usuario.nombre}! Completaste "${leccion.titulo}" con ${porcentaje}%`
        : `✅ ${usuario.nombre}, completaste "${leccion.titulo}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, ${esExcelente ? '#10b981, #059669' : '#3b82f6, #1d4ed8'}); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="font-size: 50px;">${esExcelente ? '🏆' : '✅'}</div>
            <h1 style="color: white; margin: 0;">${esExcelente ? '¡Excelente trabajo!' : '¡Lección completada!'}</h1>
          </div>
          <div style="padding: 30px; background: white; text-align: center;">
            <p>¡Felicidades <strong>${usuario.nombre}</strong>!</p>
            <p>Has completado: <strong>"${leccion.titulo}"</strong></p>
            <div style="background: ${esExcelente ? '#d1fae5' : '#dbeafe'}; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 48px; font-weight: bold; color: ${esExcelente ? '#059669' : '#1d4ed8'};">${porcentaje}%</div>
              <div>DE ACIERTOS</div>
            </div>
            <a href="${FRONTEND_URL}/dashboard" style="display: inline-block; background: #f97316; color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold;">
              🚀 Siguiente Lección
            </a>
          </div>
        </div>
      `
    });
    console.log(`📧 Felicitación enviada a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};

// 😢 Alerta de racha perdida
export const sendStreakLost = async (usuario, rachaAnterior) => {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: usuario.email,
      subject: `😢 ${usuario.nombre}, tu racha de ${rachaAnterior} días se reinició`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #6b7280, #4b5563); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="font-size: 50px;">😢</div>
            <h1 style="color: white; margin: 0;">Tu racha se reinició</h1>
          </div>
          <div style="padding: 30px; background: white; text-align: center;">
            <p>Hola <strong>${usuario.nombre}</strong>,</p>
            <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 48px; font-weight: bold; color: #dc2626; text-decoration: line-through;">${rachaAnterior}</div>
              <div style="color: #991b1b;">DÍAS PERDIDOS</div>
            </div>
            <p>¡Pero no te desanimes! Cada día es una nueva oportunidad.</p>
            <a href="${FRONTEND_URL}/dashboard" style="display: inline-block; background: #f97316; color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold;">
              🔥 ¡Empezar nueva racha!
            </a>
          </div>
        </div>
      `
    });
    console.log(`📧 Alerta de racha perdida enviada a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};

// 🎊 Bienvenida a nuevo usuario
export const sendWelcome = async (usuario) => {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: usuario.email,
      subject: `🎊 ¡Bienvenido a SimiAru, ${usuario.nombre}! - Allillanchu!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="font-size: 60px;">🏔️</div>
            <h1 style="color: white; margin: 0;">¡Bienvenido a SimiAru!</h1>
            <p style="color: rgba(255,255,255,0.9);">Tu viaje al mundo andino comienza ahora</p>
          </div>
          <div style="padding: 30px; background: white; text-align: center;">
            <p>¡Hola <strong>${usuario.nombre}</strong>!</p>
            <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="color: #dc2626; font-style: italic; font-size: 20px;">"Allillanchu" - ¿Cómo estás?</p>
              <p style="color: #92400e; font-size: 14px;">Esta será una de las primeras frases que aprenderás</p>
            </div>
            <p>Estás a punto de descubrir la riqueza de las lenguas <strong>Quechua</strong> y <strong>Aymara</strong>.</p>
            <a href="${FRONTEND_URL}/dashboard" style="display: inline-block; background: #f97316; color: white; padding: 18px 50px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px; margin: 25px 0;">
              🚀 ¡Comenzar mi primera lección!
            </a>
          </div>
        </div>
      `
    });
    console.log(`📧 Email de bienvenida enviado a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};

// 🏆 Nueva insignia obtenida
export const sendBadgeEarned = async (usuario, insignia) => {
  try {
    await resend.emails.send({
      from: EMAIL_FROM,
      to: usuario.email,
      subject: `🏆 ¡${usuario.nombre}, ganaste la insignia "${insignia.nombre}"!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #eab308, #ca8a04); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
            <h1 style="color: white; margin: 0;">🏆 ¡Nueva Insignia!</h1>
          </div>
          <div style="padding: 30px; background: white; text-align: center;">
            <p>¡Felicidades <strong>${usuario.nombre}</strong>!</p>
            <div style="background: #fef9c3; padding: 30px; border-radius: 16px; margin: 20px 0; border: 3px solid #eab308;">
              <div style="font-size: 80px;">🏅</div>
              <div style="font-size: 24px; font-weight: bold; color: #854d0e;">${insignia.nombre}</div>
              <div style="color: #a16207; font-size: 14px; margin-top: 10px;">${insignia.descripcion}</div>
            </div>
            <a href="${FRONTEND_URL}/profile" style="display: inline-block; background: #f97316; color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold;">
              👤 Ver mi perfil
            </a>
          </div>
        </div>
      `
    });
    console.log(`📧 Notificación de insignia enviada a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};