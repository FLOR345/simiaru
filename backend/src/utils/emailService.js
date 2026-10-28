// backend/src/utils/emailService.js
// Servicio de notificaciones por email para SIMIARU usando Brevo API

import SibApiV3Sdk from 'sib-api-v3-sdk';

// URL del frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://simiaru-3j6b.vercel.app';

// Configurar Brevo API
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Email desde
const SENDER = {
  name: 'SimiAru',
  email: 'flormelany01@gmail.com'
};

console.log('✅ Servicio de email Brevo API configurado');

// Función helper para enviar email
const sendEmail = async (to, subject, htmlContent) => {
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.sender = SENDER;
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`📧 Email enviado a: ${to}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${to}:`, error.message);
    return false;
  }
};

// 🔥 Recordatorio de racha diaria
export const sendStreakReminder = async (usuario) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
        <div style="font-size: 50px;">🔥</div>
        <h1 style="color: white; margin: 0;">¡No pierdas tu racha!</h1>
      </div>
      <div style="padding: 30px; background: white; text-align: center; border: 1px solid #eee; border-radius: 0 0 16px 16px;">
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
  `;
  return sendEmail(usuario.email, `🔥 ¡${usuario.nombre}, no pierdas tu racha de ${usuario.racha_actual} días!`, html);
};

// 🎉 Felicitación por completar lección
export const sendLessonCompleted = async (usuario, leccion, porcentaje) => {
  const esExcelente = porcentaje >= 80;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, ${esExcelente ? '#10b981, #059669' : '#3b82f6, #1d4ed8'}); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
        <div style="font-size: 50px;">${esExcelente ? '🏆' : '✅'}</div>
        <h1 style="color: white; margin: 0;">${esExcelente ? '¡Excelente trabajo!' : '¡Lección completada!'}</h1>
      </div>
      <div style="padding: 30px; background: white; text-align: center; border: 1px solid #eee; border-radius: 0 0 16px 16px;">
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
  `;
  const subject = esExcelente 
    ? `🎉 ¡Excelente ${usuario.nombre}! Completaste "${leccion.titulo}" con ${porcentaje}%`
    : `✅ ${usuario.nombre}, completaste "${leccion.titulo}"`;
  return sendEmail(usuario.email, subject, html);
};

// 😢 Alerta de racha perdida
export const sendStreakLost = async (usuario, rachaAnterior) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #6b7280, #4b5563); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
        <div style="font-size: 50px;">😢</div>
        <h1 style="color: white; margin: 0;">Tu racha se reinició</h1>
      </div>
      <div style="padding: 30px; background: white; text-align: center; border: 1px solid #eee; border-radius: 0 0 16px 16px;">
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
  `;
  return sendEmail(usuario.email, `😢 ${usuario.nombre}, tu racha de ${rachaAnterior} días se reinició`, html);
};

// 🎊 Bienvenida a nuevo usuario
export const sendWelcome = async (usuario) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 40px; text-align: center; border-radius: 16px 16px 0 0;">
        <div style="font-size: 60px;">🏔️</div>
        <h1 style="color: white; margin: 0;">¡Bienvenido a SimiAru!</h1>
        <p style="color: rgba(255,255,255,0.9);">Tu viaje al mundo andino comienza ahora</p>
      </div>
      <div style="padding: 30px; background: white; text-align: center; border: 1px solid #eee; border-radius: 0 0 16px 16px;">
        <p>¡Hola <strong>${usuario.nombre}</strong>!</p>
        <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0;">
          <p style="color: #dc2626; font-style: italic; font-size: 20px; margin: 0;">"Allillanchu" - ¿Cómo estás?</p>
          <p style="color: #92400e; font-size: 14px; margin: 10px 0 0 0;">Esta será una de las primeras frases que aprenderás</p>
        </div>
        <p>Estás a punto de descubrir la riqueza de las lenguas <strong>Quechua</strong> y <strong>Aymara</strong>.</p>
        <a href="${FRONTEND_URL}/dashboard" style="display: inline-block; background: #f97316; color: white; padding: 18px 50px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px; margin: 25px 0;">
          🚀 ¡Comenzar mi primera lección!
        </a>
      </div>
    </div>
  `;
  return sendEmail(usuario.email, `🎊 ¡Bienvenido a SimiAru, ${usuario.nombre}! - Allillanchu!`, html);
};

// 🏆 Nueva insignia obtenida
export const sendBadgeEarned = async (usuario, insignia) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #eab308, #ca8a04); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
        <h1 style="color: white; margin: 0;">🏆 ¡Nueva Insignia!</h1>
      </div>
      <div style="padding: 30px; background: white; text-align: center; border: 1px solid #eee; border-radius: 0 0 16px 16px;">
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
  `;
  return sendEmail(usuario.email, `🏆 ¡${usuario.nombre}, ganaste la insignia "${insignia.nombre}"!`, html);
};