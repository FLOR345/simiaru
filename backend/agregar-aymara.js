// agregar-aymara.js
// Ejecutar con: node agregar-aymara.js

import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  password: 'simiaru123',
  host: 'localhost',
  port: 5432,
  database: 'simiaru'
});

async function agregarAymara() {
  const client = await pool.connect();
  
  try {
    await client.query('SET client_encoding = UTF8');
    
    console.log('Limpiando datos anteriores de Aymara...');
    
    // Obtener IDs de unidades Aymara
    const unidadesAymara = await client.query("SELECT id FROM unidades WHERE idioma = 'aymara'");
    
    for (const u of unidadesAymara.rows) {
      // Eliminar ejercicios de lecciones de esta unidad
      await client.query(`
        DELETE FROM ejercicios WHERE leccion_id IN 
        (SELECT id FROM lecciones WHERE unidad_id = $1)
      `, [u.id]);
      
      // Eliminar vocabulario de lecciones de esta unidad
      await client.query(`
        DELETE FROM vocabulario WHERE leccion_id IN 
        (SELECT id FROM lecciones WHERE unidad_id = $1)
      `, [u.id]);
      
      // Eliminar lecciones de esta unidad
      await client.query('DELETE FROM lecciones WHERE unidad_id = $1', [u.id]);
    }
    
    // Eliminar unidades Aymara
    await client.query("DELETE FROM unidades WHERE idioma = 'aymara'");
    
    console.log('Insertando unidades Aymara...');
    
    // UNIDADES AYMARA
    const unidades = [
      [1, 'Aruntanaka', 'Saludos y presentaciones en Aymara', 'aymara', 1, '👋'],
      [2, 'Jatha', 'La familia en Aymara', 'aymara', 2, '👨‍👩‍👧‍👦'],
      [3, 'Jakhu', 'Numeros y conteo del 1 al 10', 'aymara', 3, '🔢'],
      [4, 'Samikuna', 'Los colores en Aymara', 'aymara', 4, '🎨'],
      [5, 'Uywanaka', 'Animales andinos', 'aymara', 5, '🦙'],
      [6, 'Manqa', 'Comidas tradicionales', 'aymara', 6, '🌽'],
    ];
    
    for (const u of unidades) {
      await client.query(
        'INSERT INTO unidades (numero, nombre, descripcion, idioma, orden, icono_url) VALUES ($1, $2, $3, $4, $5, $6)',
        u
      );
    }
    
    // Obtener IDs de las nuevas unidades
    const unidadesResult = await client.query("SELECT id, numero FROM unidades WHERE idioma = 'aymara' ORDER BY numero");
    const unidadesMap = {};
    for (const u of unidadesResult.rows) {
      unidadesMap[u.numero] = u.id;
    }
    
    console.log('Insertando lecciones Aymara...');
    
    // LECCIONES AYMARA
    
    // Unidad 1: Saludos
    const leccionesU1 = [
      [unidadesMap[1], 1, 'Saludos basicos', 'En Aymara, Kamisaki significa Como estas y Waliki significa Estoy bien. Aski urukipan es Buenos dias.', 1],
      [unidadesMap[1], 2, 'Presentaciones', 'Para presentarte dices Nayan sutija seguido de tu nombre. Para preguntar el nombre dices Kunasa sutima.', 2],
      [unidadesMap[1], 3, 'Despedidas', 'Jakisiñkama significa Hasta luego. Qharurukama es Hasta manana. Yuspajaray es Gracias.', 3],
    ];
    
    for (const l of leccionesU1) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // Unidad 2: Familia
    const leccionesU2 = [
      [unidadesMap[2], 1, 'Padres y abuelos', 'Awki significa Padre, Tayka es Madre. Achachila es Abuelo y Awicha es Abuela.', 1],
      [unidadesMap[2], 2, 'Hermanos e hijos', 'Jila es Hermano mayor, Sullka es Hermano menor. Yuqalla es Hijo varon e Imilla es Hija mujer.', 2],
    ];
    
    for (const l of leccionesU2) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // Unidad 3: Numeros
    const leccionesU3 = [
      [unidadesMap[3], 1, 'Numeros del 1 al 5', 'Maya (1), Paya (2), Kimsa (3), Pusi (4), Phisqa (5).', 1],
      [unidadesMap[3], 2, 'Numeros del 6 al 10', 'Suxta (6), Paqallqu (7), Kimsaqallqu (8), Llatunka (9), Tunka (10).', 2],
    ];
    
    for (const l of leccionesU3) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // Unidad 4: Colores
    const leccionesU4 = [
      [unidadesMap[4], 1, 'Colores basicos', 'Wila (Rojo), Qillu (Amarillo), Larama (Azul), Chuxna (Verde).', 1],
      [unidadesMap[4], 2, 'Mas colores', 'Chiyara (Negro), Janqu (Blanco), Chumpi (Marron).', 2],
    ];
    
    for (const l of leccionesU4) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // Unidad 5: Animales
    const leccionesU5 = [
      [unidadesMap[5], 1, 'Animales domesticos', 'Qawra (Llama), Allpachu (Alpaca), Anu (Perro), Phisi (Gato).', 1],
      [unidadesMap[5], 2, 'Animales silvestres', 'Kunturi (Condor), Puma, Qamaqi (Zorro), Jukumari (Oso andino).', 2],
    ];
    
    for (const l of leccionesU5) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // Unidad 6: Comida
    const leccionesU6 = [
      [unidadesMap[6], 1, 'Alimentos basicos', 'Chuqi (Papa), Tunqu (Maiz), Jupha (Quinua), Uma (Agua).', 1],
      [unidadesMap[6], 2, 'Mas alimentos', 'Aycha (Carne), Challwa (Pescado), Tanta (Pan), Jallpa (Aji).', 2],
    ];
    
    for (const l of leccionesU6) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // Obtener IDs de lecciones
    const leccionesResult = await client.query(`
      SELECT l.id, l.numero, l.unidad_id, u.numero as unidad_numero 
      FROM lecciones l 
      JOIN unidades u ON l.unidad_id = u.id 
      WHERE u.idioma = 'aymara' 
      ORDER BY u.numero, l.numero
    `);
    
    const getLeccionId = (unidadNum, leccionNum) => {
      const leccion = leccionesResult.rows.find(
        l => l.unidad_numero === unidadNum && l.numero === leccionNum
      );
      return leccion ? leccion.id : null;
    };
    
    console.log('Insertando vocabulario Aymara...');
    
    // VOCABULARIO
    
    // Unidad 1 - Leccion 1: Saludos basicos
    const vocab1_1 = [
      [getLeccionId(1, 1), 'Como estas', 'Kamisaki', 'saludo', 'Kamisaki, jilata'],
      [getLeccionId(1, 1), 'Estoy bien', 'Waliki', 'respuesta', 'Waliki, jumarusti'],
      [getLeccionId(1, 1), 'Buenos dias', 'Aski urukipan', 'saludo', 'Aski urukipan, tayka'],
      [getLeccionId(1, 1), 'Buenas tardes', 'Aski jayp ukipan', 'saludo', 'Aski jayp ukipan'],
      [getLeccionId(1, 1), 'Buenas noches', 'Aski arumankipan', 'saludo', 'Aski arumankipan'],
      [getLeccionId(1, 1), 'Hola', 'Laphi', 'saludo', 'Laphi, kamisaki'],
    ];
    
    for (const v of vocab1_1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 1 - Leccion 2: Presentaciones
    const vocab1_2 = [
      [getLeccionId(1, 2), 'Mi nombre es', 'Nayan sutija', 'presentacion', 'Nayan sutija Maria'],
      [getLeccionId(1, 2), 'Cual es tu nombre', 'Kunasa sutima', 'pregunta', 'Kunasa sutima, jilata'],
      [getLeccionId(1, 2), 'Soy de', 'Nayax jutatha', 'presentacion', 'Nayax La Pazta jutatha'],
      [getLeccionId(1, 2), 'Mucho gusto', 'Kusisita', 'cortesia', 'Kusisita unanaqata'],
    ];
    
    for (const v of vocab1_2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 1 - Leccion 3: Despedidas
    const vocab1_3 = [
      [getLeccionId(1, 3), 'Hasta luego', 'Jakisiñkama', 'despedida', 'Jakisiñkama, jilata'],
      [getLeccionId(1, 3), 'Hasta manana', 'Qharurukama', 'despedida', 'Qharurukama, tayka'],
      [getLeccionId(1, 3), 'Gracias', 'Yuspajaray', 'cortesia', 'Yuspajaray, awki'],
      [getLeccionId(1, 3), 'De nada', 'Janiwa kunasa', 'cortesia', 'Janiwa kunasa, waliki'],
    ];
    
    for (const v of vocab1_3) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 2 - Leccion 1: Padres y abuelos
    const vocab2_1 = [
      [getLeccionId(2, 1), 'Padre', 'Awki', 'familia', 'Awkija irnaqiri'],
      [getLeccionId(2, 1), 'Madre', 'Tayka', 'familia', 'Taykaja suma warmi'],
      [getLeccionId(2, 1), 'Abuelo', 'Achachila', 'familia', 'Achachilaja yatiri'],
      [getLeccionId(2, 1), 'Abuela', 'Awicha', 'familia', 'Awichaja tanta luri'],
    ];
    
    for (const v of vocab2_1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 2 - Leccion 2: Hermanos e hijos
    const vocab2_2 = [
      [getLeccionId(2, 2), 'Hermano mayor', 'Jila', 'familia', 'Jilaja yatiqiri'],
      [getLeccionId(2, 2), 'Hermano menor', 'Sullka', 'familia', 'Sullkaja jiska'],
      [getLeccionId(2, 2), 'Hijo varon', 'Yuqalla', 'familia', 'Yuqallaja anata'],
      [getLeccionId(2, 2), 'Hija mujer', 'Imilla', 'familia', 'Imillaja yatiqaski'],
    ];
    
    for (const v of vocab2_2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 3 - Leccion 1: Numeros 1-5
    const vocab3_1 = [
      [getLeccionId(3, 1), 'Uno', 'Maya', 'numero', 'Maya qawra'],
      [getLeccionId(3, 1), 'Dos', 'Paya', 'numero', 'Paya nayra'],
      [getLeccionId(3, 1), 'Tres', 'Kimsa', 'numero', 'Kimsa wawa'],
      [getLeccionId(3, 1), 'Cuatro', 'Pusi', 'numero', 'Pusi kayu'],
      [getLeccionId(3, 1), 'Cinco', 'Phisqa', 'numero', 'Phisqa lukana'],
    ];
    
    for (const v of vocab3_1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 3 - Leccion 2: Numeros 6-10
    const vocab3_2 = [
      [getLeccionId(3, 2), 'Seis', 'Suxta', 'numero', 'Suxta uru'],
      [getLeccionId(3, 2), 'Siete', 'Paqallqu', 'numero', 'Paqallqu phaxsi'],
      [getLeccionId(3, 2), 'Ocho', 'Kimsaqallqu', 'numero', 'Kimsaqallqu mara'],
      [getLeccionId(3, 2), 'Nueve', 'Llatunka', 'numero', 'Llatunka jaqi'],
      [getLeccionId(3, 2), 'Diez', 'Tunka', 'numero', 'Tunka qawra'],
    ];
    
    for (const v of vocab3_2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 4 - Leccion 1: Colores basicos
    const vocab4_1 = [
      [getLeccionId(4, 1), 'Rojo', 'Wila', 'color', 'Wila panqara'],
      [getLeccionId(4, 1), 'Amarillo', 'Qillu', 'color', 'Qillu inti'],
      [getLeccionId(4, 1), 'Azul', 'Larama', 'color', 'Larama alaxpacha'],
      [getLeccionId(4, 1), 'Verde', 'Chuxna', 'color', 'Chuxna quqa'],
    ];
    
    for (const v of vocab4_1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 4 - Leccion 2: Mas colores
    const vocab4_2 = [
      [getLeccionId(4, 2), 'Negro', 'Chiyara', 'color', 'Chiyara aruma'],
      [getLeccionId(4, 2), 'Blanco', 'Janqu', 'color', 'Janqu khunu'],
      [getLeccionId(4, 2), 'Marron', 'Chumpi', 'color', 'Chumpi laka'],
    ];
    
    for (const v of vocab4_2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 5 - Leccion 1: Animales domesticos
    const vocab5_1 = [
      [getLeccionId(5, 1), 'Llama', 'Qawra', 'animal', 'Qawra qipi apiri'],
      [getLeccionId(5, 1), 'Alpaca', 'Allpachu', 'animal', 'Allpachu suma tara'],
      [getLeccionId(5, 1), 'Perro', 'Anu', 'animal', 'Anu utankiri'],
      [getLeccionId(5, 1), 'Gato', 'Phisi', 'animal', 'Phisi achaku katjiri'],
    ];
    
    for (const v of vocab5_1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 5 - Leccion 2: Animales silvestres
    const vocab5_2 = [
      [getLeccionId(5, 2), 'Condor', 'Kunturi', 'animal', 'Kunturi alaxpachana'],
      [getLeccionId(5, 2), 'Puma', 'Puma', 'animal', 'Puma qulluna'],
      [getLeccionId(5, 2), 'Zorro', 'Qamaqi', 'animal', 'Qamaqi arumana'],
      [getLeccionId(5, 2), 'Oso andino', 'Jukumari', 'animal', 'Jukumari quchana'],
    ];
    
    for (const v of vocab5_2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 6 - Leccion 1: Alimentos basicos
    const vocab6_1 = [
      [getLeccionId(6, 1), 'Papa', 'Chuqi', 'alimento', 'Chuqi manqa'],
      [getLeccionId(6, 1), 'Maiz', 'Tunqu', 'alimento', 'Tunqu qillu'],
      [getLeccionId(6, 1), 'Quinua', 'Jupha', 'alimento', 'Jupha suma manqa'],
      [getLeccionId(6, 1), 'Agua', 'Uma', 'bebida', 'Uma umiri'],
    ];
    
    for (const v of vocab6_1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // Unidad 6 - Leccion 2: Mas alimentos
    const vocab6_2 = [
      [getLeccionId(6, 2), 'Carne', 'Aycha', 'alimento', 'Aycha phayata'],
      [getLeccionId(6, 2), 'Pescado', 'Challwa', 'alimento', 'Challwa qutana'],
      [getLeccionId(6, 2), 'Pan', 'Tanta', 'alimento', 'Tanta lurata'],
      [getLeccionId(6, 2), 'Aji', 'Jallpa', 'alimento', 'Jallpa kataki'],
    ];
    
    for (const v of vocab6_2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    console.log('Insertando ejercicios Aymara...');
    
    // EJERCICIOS
    
    // Unidad 1 - Leccion 1: Saludos basicos
    const ejer1_1 = [
      [getLeccionId(1, 1), 'multiple_choice', 'Como se dice Como estas en Aymara?', 'Kamisaki', JSON.stringify(['Kamisaki', 'Waliki', 'Aski urukipan', 'Yuspajaray'])],
      [getLeccionId(1, 1), 'multiple_choice', 'Que significa Waliki?', 'Estoy bien', JSON.stringify(['Estoy bien', 'Buenos dias', 'Gracias', 'Hola'])],
      [getLeccionId(1, 1), 'multiple_choice', 'Como dices Buenos dias en Aymara?', 'Aski urukipan', JSON.stringify(['Aski urukipan', 'Aski arumankipan', 'Kamisaki', 'Waliki'])],
      [getLeccionId(1, 1), 'multiple_choice', 'Cual es el saludo de la noche?', 'Aski arumankipan', JSON.stringify(['Aski arumankipan', 'Aski urukipan', 'Aski jayp ukipan', 'Laphi'])],
      [getLeccionId(1, 1), 'drag_words', 'Completa: ___ urukipan (Buenos dias)', 'Aski', JSON.stringify(['Aski', 'Waliki', 'Kamisaki', 'Laphi'])],
    ];
    
    for (const e of ejer1_1) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 1 - Leccion 2: Presentaciones
    const ejer1_2 = [
      [getLeccionId(1, 2), 'multiple_choice', 'Como dices Mi nombre es en Aymara?', 'Nayan sutija', JSON.stringify(['Nayan sutija', 'Kunasa sutima', 'Kamisaki', 'Waliki'])],
      [getLeccionId(1, 2), 'multiple_choice', 'Como preguntas Cual es tu nombre?', 'Kunasa sutima', JSON.stringify(['Kunasa sutima', 'Nayan sutija', 'Kamisaki', 'Kusisita'])],
      [getLeccionId(1, 2), 'multiple_choice', 'Que significa Kusisita?', 'Mucho gusto', JSON.stringify(['Mucho gusto', 'Gracias', 'Hola', 'Adios'])],
      [getLeccionId(1, 2), 'drag_words', 'Mi nombre es Maria: Nayan ___ Maria', 'sutija', JSON.stringify(['sutija', 'jutatha', 'kamisaki', 'waliki'])],
    ];
    
    for (const e of ejer1_2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 1 - Leccion 3: Despedidas
    const ejer1_3 = [
      [getLeccionId(1, 3), 'multiple_choice', 'Como se dice Hasta luego en Aymara?', 'Jakisiñkama', JSON.stringify(['Jakisiñkama', 'Qharurukama', 'Yuspajaray', 'Waliki'])],
      [getLeccionId(1, 3), 'multiple_choice', 'Que significa Yuspajaray?', 'Gracias', JSON.stringify(['Gracias', 'Hasta luego', 'Hola', 'De nada'])],
      [getLeccionId(1, 3), 'multiple_choice', 'Como dices Hasta manana?', 'Qharurukama', JSON.stringify(['Qharurukama', 'Jakisiñkama', 'Yuspajaray', 'Waliki'])],
    ];
    
    for (const e of ejer1_3) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 2 - Leccion 1: Padres y abuelos
    const ejer2_1 = [
      [getLeccionId(2, 1), 'multiple_choice', 'Como se dice Padre en Aymara?', 'Awki', JSON.stringify(['Awki', 'Tayka', 'Achachila', 'Awicha'])],
      [getLeccionId(2, 1), 'multiple_choice', 'Que significa Tayka?', 'Madre', JSON.stringify(['Madre', 'Padre', 'Abuela', 'Hermana'])],
      [getLeccionId(2, 1), 'multiple_choice', 'Como se dice Abuelo?', 'Achachila', JSON.stringify(['Achachila', 'Awicha', 'Awki', 'Tayka'])],
      [getLeccionId(2, 1), 'drag_words', 'Mi ___ (madre) es buena', 'Tayka', JSON.stringify(['Tayka', 'Awki', 'Achachila', 'Awicha'])],
    ];
    
    for (const e of ejer2_1) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 2 - Leccion 2: Hermanos e hijos
    const ejer2_2 = [
      [getLeccionId(2, 2), 'multiple_choice', 'Como se dice Hermano mayor?', 'Jila', JSON.stringify(['Jila', 'Sullka', 'Yuqalla', 'Imilla'])],
      [getLeccionId(2, 2), 'multiple_choice', 'Que significa Yuqalla?', 'Hijo varon', JSON.stringify(['Hijo varon', 'Hija mujer', 'Hermano', 'Padre'])],
      [getLeccionId(2, 2), 'multiple_choice', 'Como se dice Hija mujer?', 'Imilla', JSON.stringify(['Imilla', 'Yuqalla', 'Sullka', 'Jila'])],
    ];
    
    for (const e of ejer2_2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 3 - Leccion 1: Numeros 1-5
    const ejer3_1 = [
      [getLeccionId(3, 1), 'multiple_choice', 'Cuanto es Maya?', '1', JSON.stringify(['1', '2', '3', '4'])],
      [getLeccionId(3, 1), 'multiple_choice', 'Como se dice 3 en Aymara?', 'Kimsa', JSON.stringify(['Kimsa', 'Paya', 'Pusi', 'Phisqa'])],
      [getLeccionId(3, 1), 'multiple_choice', 'Que numero es Phisqa?', '5', JSON.stringify(['5', '4', '3', '2'])],
      [getLeccionId(3, 1), 'drag_words', 'Dos en Aymara es ___', 'Paya', JSON.stringify(['Paya', 'Maya', 'Kimsa', 'Pusi'])],
    ];
    
    for (const e of ejer3_1) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 3 - Leccion 2: Numeros 6-10
    const ejer3_2 = [
      [getLeccionId(3, 2), 'multiple_choice', 'Cuanto es Tunka?', '10', JSON.stringify(['10', '9', '8', '7'])],
      [getLeccionId(3, 2), 'multiple_choice', 'Como se dice 7 en Aymara?', 'Paqallqu', JSON.stringify(['Paqallqu', 'Suxta', 'Kimsaqallqu', 'Llatunka'])],
      [getLeccionId(3, 2), 'multiple_choice', 'Que numero es Suxta?', '6', JSON.stringify(['6', '7', '8', '9'])],
    ];
    
    for (const e of ejer3_2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 4 - Leccion 1: Colores basicos
    const ejer4_1 = [
      [getLeccionId(4, 1), 'multiple_choice', 'Que color es Wila?', 'Rojo', JSON.stringify(['Rojo', 'Azul', 'Verde', 'Amarillo'])],
      [getLeccionId(4, 1), 'multiple_choice', 'Como se dice Azul en Aymara?', 'Larama', JSON.stringify(['Larama', 'Wila', 'Qillu', 'Chuxna'])],
      [getLeccionId(4, 1), 'multiple_choice', 'Que color es Chuxna?', 'Verde', JSON.stringify(['Verde', 'Rojo', 'Azul', 'Amarillo'])],
    ];
    
    for (const e of ejer4_1) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 4 - Leccion 2: Mas colores
    const ejer4_2 = [
      [getLeccionId(4, 2), 'multiple_choice', 'Que color es Chiyara?', 'Negro', JSON.stringify(['Negro', 'Blanco', 'Marron', 'Rojo'])],
      [getLeccionId(4, 2), 'multiple_choice', 'Como se dice Blanco?', 'Janqu', JSON.stringify(['Janqu', 'Chiyara', 'Chumpi', 'Wila'])],
      [getLeccionId(4, 2), 'drag_words', 'La nieve es de color ___', 'Janqu', JSON.stringify(['Janqu', 'Chiyara', 'Wila', 'Larama'])],
    ];
    
    for (const e of ejer4_2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 5 - Leccion 1: Animales domesticos
    const ejer5_1 = [
      [getLeccionId(5, 1), 'multiple_choice', 'Como se dice Llama en Aymara?', 'Qawra', JSON.stringify(['Qawra', 'Allpachu', 'Anu', 'Phisi'])],
      [getLeccionId(5, 1), 'multiple_choice', 'Que animal es Anu?', 'Perro', JSON.stringify(['Perro', 'Gato', 'Llama', 'Alpaca'])],
      [getLeccionId(5, 1), 'multiple_choice', 'Como se dice Gato?', 'Phisi', JSON.stringify(['Phisi', 'Anu', 'Qawra', 'Allpachu'])],
    ];
    
    for (const e of ejer5_1) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 5 - Leccion 2: Animales silvestres
    const ejer5_2 = [
      [getLeccionId(5, 2), 'multiple_choice', 'Que animal es Kunturi?', 'Condor', JSON.stringify(['Condor', 'Puma', 'Zorro', 'Oso'])],
      [getLeccionId(5, 2), 'multiple_choice', 'Como se dice Zorro en Aymara?', 'Qamaqi', JSON.stringify(['Qamaqi', 'Kunturi', 'Puma', 'Jukumari'])],
      [getLeccionId(5, 2), 'multiple_choice', 'Que animal es Jukumari?', 'Oso andino', JSON.stringify(['Oso andino', 'Condor', 'Puma', 'Zorro'])],
    ];
    
    for (const e of ejer5_2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 6 - Leccion 1: Alimentos basicos
    const ejer6_1 = [
      [getLeccionId(6, 1), 'multiple_choice', 'Como se dice Papa en Aymara?', 'Chuqi', JSON.stringify(['Chuqi', 'Tunqu', 'Jupha', 'Uma'])],
      [getLeccionId(6, 1), 'multiple_choice', 'Que alimento es Jupha?', 'Quinua', JSON.stringify(['Quinua', 'Papa', 'Maiz', 'Agua'])],
      [getLeccionId(6, 1), 'multiple_choice', 'Como se dice Agua?', 'Uma', JSON.stringify(['Uma', 'Chuqi', 'Tunqu', 'Jupha'])],
    ];
    
    for (const e of ejer6_1) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Unidad 6 - Leccion 2: Mas alimentos
    const ejer6_2 = [
      [getLeccionId(6, 2), 'multiple_choice', 'Como se dice Carne en Aymara?', 'Aycha', JSON.stringify(['Aycha', 'Challwa', 'Tanta', 'Jallpa'])],
      [getLeccionId(6, 2), 'multiple_choice', 'Que alimento es Tanta?', 'Pan', JSON.stringify(['Pan', 'Carne', 'Pescado', 'Aji'])],
      [getLeccionId(6, 2), 'multiple_choice', 'Como se dice Aji?', 'Jallpa', JSON.stringify(['Jallpa', 'Aycha', 'Challwa', 'Tanta'])],
    ];
    
    for (const e of ejer6_2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // Verificar conteos
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM unidades WHERE idioma = 'aymara') as unidades,
        (SELECT COUNT(*) FROM lecciones l JOIN unidades u ON l.unidad_id = u.id WHERE u.idioma = 'aymara') as lecciones,
        (SELECT COUNT(*) FROM vocabulario v JOIN lecciones l ON v.leccion_id = l.id JOIN unidades u ON l.unidad_id = u.id WHERE u.idioma = 'aymara') as vocabulario,
        (SELECT COUNT(*) FROM ejercicios e JOIN lecciones l ON e.leccion_id = l.id JOIN unidades u ON l.unidad_id = u.id WHERE u.idioma = 'aymara') as ejercicios
    `);
    
    console.log('\n=== AYMARA COMPLETADO ===');
    console.log('Unidades:', counts.rows[0].unidades);
    console.log('Lecciones:', counts.rows[0].lecciones);
    console.log('Vocabulario:', counts.rows[0].vocabulario);
    console.log('Ejercicios:', counts.rows[0].ejercicios);
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

agregarAymara()
  .then(() => {
    console.log('\nProceso completado!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
  });
