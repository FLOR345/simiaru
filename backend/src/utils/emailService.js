// backend/src/utils/emailService.js
// Servicio de notificaciones por email para SIMIARU

import nodemailer from 'nodemailer';

// Configurar transporter de Gmail
// Configurar transporter de Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'flormelany01@gmail.com',
    pass: 'vybywwadtwozjvkw'
  }
});

// Verificar conexión al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Error configurando email:', error.message);
  } else {
    console.log('✅ Servicio de email configurado correctamente');
  }
});

// 🔥 Recordatorio de racha diaria
export const sendStreakReminder = async (usuario) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.email,
    subject: `🔥 ¡${usuario.nombre}, no pierdas tu racha de ${usuario.racha_actual} días!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 30px; text-align: center;">
            <div style="font-size: 50px;">🔥</div>
            <h1 style="color: white; margin: 0;">¡No pierdas tu racha!</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p style="color: #4b5563; font-size: 16px;">¡Hola <strong>${usuario.nombre}</strong>!</p>
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 48px; font-weight: bold; color: #d97706;">${usuario.racha_actual}</div>
              <div style="color: #92400e; font-size: 14px;">DÍAS DE RACHA</div>
            </div>
            <p style="color: #4b5563; font-size: 16px;">
              Llevas <strong>${usuario.racha_actual} días</strong> consecutivos aprendiendo. 
              ¡No dejes que se rompa!
            </p>
            <a href="http://localhost:5173/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; margin: 20px 0;">
              🎯 Continuar Aprendiendo
            </a>
            <p style="color: #dc2626; font-style: italic; font-size: 16px;">
              "Ama qunqaychu yachayniykita" - No olvides tu aprendizaje
            </p>
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>SimiAru - Aprende Quechua y Aymara</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
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
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.email,
    subject: esExcelente 
      ? `🎉 ¡Excelente ${usuario.nombre}! Completaste "${leccion.titulo}" con ${porcentaje}%`
      : `✅ ${usuario.nombre}, completaste "${leccion.titulo}"`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, ${esExcelente ? '#10b981, #059669' : '#3b82f6, #1d4ed8'}); padding: 30px; text-align: center;">
            <div style="font-size: 50px;">${esExcelente ? '🏆' : '✅'}</div>
            <h1 style="color: white; margin: 0;">${esExcelente ? '¡Excelente trabajo!' : '¡Lección completada!'}</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p>¡Felicidades <strong>${usuario.nombre}</strong>!</p>
            <p>Has completado: <strong>"${leccion.titulo}"</strong></p>
            <div style="background: ${esExcelente ? '#d1fae5' : '#dbeafe'}; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 48px; font-weight: bold; color: ${esExcelente ? '#059669' : '#1d4ed8'};">${porcentaje}%</div>
              <div style="font-size: 14px;">DE ACIERTOS</div>
            </div>
            <a href="http://localhost:5173/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold;">
              🚀 Siguiente Lección
            </a>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Felicitación enviada a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};

// 😢 Alerta de racha perdida
export const sendStreakLost = async (usuario, rachaAnterior) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.email,
    subject: `😢 ${usuario.nombre}, tu racha de ${rachaAnterior} días se reinició`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6b7280, #4b5563); padding: 30px; text-align: center;">
            <div style="font-size: 50px;">😢</div>
            <h1 style="color: white; margin: 0;">Tu racha se reinició</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p>Hola <strong>${usuario.nombre}</strong>,</p>
            <div style="background: #fee2e2; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <div style="font-size: 48px; font-weight: bold; color: #dc2626; text-decoration: line-through;">${rachaAnterior}</div>
              <div style="color: #991b1b; font-size: 14px;">DÍAS PERDIDOS</div>
            </div>
            <p>¡Pero no te desanimes! Cada día es una nueva oportunidad.</p>
            <a href="http://localhost:5173/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold;">
              🔥 ¡Empezar nueva racha!
            </a>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Alerta de racha perdida enviada a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};

// 🎊 Bienvenida a nuevo usuario
export const sendWelcome = async (usuario) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.email,
    subject: `🎊 ¡Bienvenido a SimiAru, ${usuario.nombre}! - Allillanchu!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #f97316, #dc2626); padding: 40px; text-align: center;">
            <div style="font-size: 60px;">🏔️</div>
            <h1 style="color: white; margin: 0;">¡Bienvenido a SimiAru!</h1>
            <p style="color: rgba(255,255,255,0.9);">Tu viaje al mundo andino comienza ahora</p>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p>¡Hola <strong>${usuario.nombre}</strong>!</p>
            <div style="background: #fef3c7; padding: 20px; border-radius: 12px; margin: 20px 0;">
              <p style="color: #dc2626; font-style: italic; font-size: 20px;">"Allillanchu" - ¿Cómo estás?</p>
              <p style="color: #92400e; font-size: 14px;">Esta será una de las primeras frases que aprenderás</p>
            </div>
            <p>Estás a punto de descubrir la riqueza de las lenguas <strong>Quechua</strong> y <strong>Aymara</strong>.</p>
            <a href="http://localhost:5173/dashboard" style="display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 18px 50px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 18px; margin: 25px 0;">
              🚀 ¡Comenzar mi primera lección!
            </a>
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
            <p>SimiAru - Preservando las lenguas ancestrales de los Andes 🏔️</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email de bienvenida enviado a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};

// 🏆 Nueva insignia obtenida
export const sendBadgeEarned = async (usuario, insignia) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: usuario.email,
    subject: `🏆 ¡${usuario.nombre}, ganaste la insignia "${insignia.nombre}"!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #eab308, #ca8a04); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">🏆 ¡Nueva Insignia!</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <p>¡Felicidades <strong>${usuario.nombre}</strong>!</p>
            <div style="background: #fef9c3; padding: 30px; border-radius: 16px; margin: 20px 0; border: 3px solid #eab308;">
              <div style="font-size: 80px;">🏅</div>
              <div style="font-size: 24px; font-weight: bold; color: #854d0e;">${insignia.nombre}</div>
              <div style="color: #a16207; font-size: 14px; margin-top: 10px;">${insignia.descripcion}</div>
            </div>
            <a href="http://localhost:5173/profile" style="display: inline-block; background: linear-gradient(135deg, #f97316, #dc2626); color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold;">
              👤 Ver mi perfil
            </a>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Notificación de insignia enviada a: ${usuario.email}`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviando email a ${usuario.email}:`, error.message);
    return false;
  }
};