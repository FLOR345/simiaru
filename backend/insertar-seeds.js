// insertar-seeds.js
// Ejecutar con: node insertar-seeds.js

import pg from 'pg';

const { Pool } = pg;

// Usar la misma configuracion que tu database.js
const pool = new Pool({
  user: 'postgres',
  password: 'simiaru123',
  host: 'localhost',
  port: 5432,
  database: 'simiaru'
});

async function insertSeeds() {
  const client = await pool.connect();
  
  try {
    await client.query('SET client_encoding = UTF8');
    
    console.log('Limpiando datos existentes...');
    await client.query('DELETE FROM ejercicios');
    await client.query('DELETE FROM vocabulario');
    await client.query('DELETE FROM lecciones');
    await client.query('DELETE FROM unidades');
    await client.query('DELETE FROM contenido_cultural');
    await client.query('DELETE FROM insignias');
    
    console.log('Insertando unidades...');
    
    // UNIDADES QUECHUA
    const unidadesQuechua = [
      [1, 'Napaykuna', 'Saludos y presentaciones basicas en Quechua', 'quechua', 1, '👋'],
      [2, 'Ayllu', 'La familia y relaciones familiares', 'quechua', 2, '👨‍👩‍👧‍👦'],
      [3, 'Yupana', 'Numeros y conteo del 1 al 20', 'quechua', 3, '🔢'],
      [4, 'Llinphikuna', 'Los colores en Quechua', 'quechua', 4, '🎨'],
      [5, 'Uywakuna', 'Animales de los Andes', 'quechua', 5, '🦙'],
      [6, 'Mikhuna', 'Comidas y alimentos andinos', 'quechua', 6, '🌽'],
    ];
    
    for (const u of unidadesQuechua) {
      await client.query(
        'INSERT INTO unidades (numero, nombre, descripcion, idioma, orden, icono_url) VALUES ($1, $2, $3, $4, $5, $6)',
        u
      );
    }
    
    // UNIDADES AYMARA
    const unidadesAymara = [
      [1, 'Aruntanaka', 'Saludos y presentaciones en Aymara', 'aymara', 1, '👋'],
      [2, 'Jatha', 'La familia en Aymara', 'aymara', 2, '👨‍👩‍👧‍👦'],
      [3, 'Jakhu', 'Numeros y conteo', 'aymara', 3, '🔢'],
    ];
    
    for (const u of unidadesAymara) {
      await client.query(
        'INSERT INTO unidades (numero, nombre, descripcion, idioma, orden, icono_url) VALUES ($1, $2, $3, $4, $5, $6)',
        u
      );
    }
    
    const unidadesResult = await client.query('SELECT id, numero, idioma FROM unidades ORDER BY id');
    const unidades = unidadesResult.rows;
    
    console.log('Insertando lecciones...');
    
    // LECCIONES QUECHUA - Unidad 1 (Saludos)
    const unidad1 = unidades.find(u => u.numero === 1 && u.idioma === 'quechua');
    
    const leccionesU1 = [
      [unidad1.id, 1, 'Saludos del dia', 'En Quechua, los saludos varian segun el momento del dia. Allillanchu es el saludo mas comun y significa Como estas. La respuesta es Allillanmi (Estoy bien).', 1],
      [unidad1.id, 2, 'Presentaciones personales', 'Para presentarte en Quechua usamos la estructura: Nombre-mi sutiy que significa Mi nombre es.', 2],
      [unidad1.id, 3, 'Despedidas', 'Las despedidas en Quechua: Tupananchikkama - Hasta que nos volvamos a encontrar. Ratukama - Hasta pronto.', 3],
    ];
    
    for (const l of leccionesU1) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // LECCIONES QUECHUA - Unidad 2 (Familia)
    const unidad2 = unidades.find(u => u.numero === 2 && u.idioma === 'quechua');
    
    const leccionesU2 = [
      [unidad2.id, 1, 'Padres y abuelos', 'La familia es el centro de la cultura andina. Tayta (Padre), Mama (Madre), Hatun tayta (Abuelo), Hatun mama (Abuela).', 1],
      [unidad2.id, 2, 'Hermanos e hijos', 'Wawqi (Hermano, dicho por hombre), Turi (Hermano, dicho por mujer), Pani (Hermana, dicho por hombre), Churi (Hijo/a).', 2],
    ];
    
    for (const l of leccionesU2) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // LECCIONES QUECHUA - Unidad 3 (Numeros)
    const unidad3 = unidades.find(u => u.numero === 3 && u.idioma === 'quechua');
    
    const leccionesU3 = [
      [unidad3.id, 1, 'Numeros del 1 al 5', 'Huk (1), Iskay (2), Kimsa (3), Tawa (4), Pichqa (5).', 1],
      [unidad3.id, 2, 'Numeros del 6 al 10', 'Suqta (6), Qanchis (7), Pusaq (8), Isqun (9), Chunka (10).', 2],
    ];
    
    for (const l of leccionesU3) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // LECCIONES QUECHUA - Unidad 4 (Colores)
    const unidad4 = unidades.find(u => u.numero === 4 && u.idioma === 'quechua');
    
    const leccionesU4 = [
      [unidad4.id, 1, 'Colores primarios', 'Puka (Rojo), Qillu (Amarillo), Anqas (Azul).', 1],
      [unidad4.id, 2, 'Colores de la naturaleza', 'Qumir (Verde), Yana (Negro), Yuraq (Blanco).', 2],
    ];
    
    for (const l of leccionesU4) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // LECCIONES QUECHUA - Unidad 5 (Animales)
    const unidad5 = unidades.find(u => u.numero === 5 && u.idioma === 'quechua');
    
    const leccionesU5 = [
      [unidad5.id, 1, 'Animales domesticos', 'Llama, Alpaka (Alpaca), Allqu (Perro), Michi (Gato).', 1],
      [unidad5.id, 2, 'Animales silvestres', 'Kuntur (Condor), Puma, Anas (Zorro), Ukuku (Oso andino).', 2],
    ];
    
    for (const l of leccionesU5) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // LECCIONES QUECHUA - Unidad 6 (Comida)
    const unidad6 = unidades.find(u => u.numero === 6 && u.idioma === 'quechua');
    
    const leccionesU6 = [
      [unidad6.id, 1, 'Tuberculos y granos', 'Papa, Sara (Maiz), Kinuwa (Quinua).', 1],
      [unidad6.id, 2, 'Frutas y verduras', 'Pallar (Frijol), Uchu (Aji).', 2],
    ];
    
    for (const l of leccionesU6) {
      await client.query(
        'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
        l
      );
    }
    
    // LECCIONES AYMARA
    const unidadAy1 = unidades.find(u => u.numero === 1 && u.idioma === 'aymara');
    
    await client.query(
      'INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES ($1, $2, $3, $4, $5)',
      [unidadAy1.id, 1, 'Saludos basicos', 'Kamisaki (Como estas), Waliki (Estoy bien), Aski urukipan (Buenos dias).', 1]
    );
    
    const leccionesResult = await client.query('SELECT id, unidad_id, numero FROM lecciones ORDER BY id');
    const lecciones = leccionesResult.rows;
    
    console.log('Insertando vocabulario...');
    
    // VOCABULARIO - Leccion 1 (Saludos del dia)
    const leccion1 = lecciones.find(l => l.numero === 1 && l.unidad_id === unidad1.id);
    
    const vocab1 = [
      [leccion1.id, 'Hola, Como estas', 'Allillanchu', 'saludo', 'Allillanchu, Maria'],
      [leccion1.id, 'Estoy bien', 'Allillanmi', 'respuesta', 'Allillanmi, qamri?'],
      [leccion1.id, 'Buenos dias', 'Allin punchay', 'saludo', 'Allin punchay, tayta'],
      [leccion1.id, 'Buenas tardes', 'Allin sukha', 'saludo', 'Allin sukha, mama'],
      [leccion1.id, 'Buenas noches', 'Allin tuta', 'saludo', 'Allin tuta, wawqi'],
      [leccion1.id, 'Bienvenido', 'Allin hamusqa', 'saludo', 'Allin hamusqa wasiypi'],
    ];
    
    for (const v of vocab1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // VOCABULARIO - Leccion 2 (Presentaciones)
    const leccion2 = lecciones.find(l => l.numero === 2 && l.unidad_id === unidad1.id);
    
    const vocab2 = [
      [leccion2.id, 'Mi nombre es', 'Sutiy', 'presentacion', 'Sutiy Pedrom'],
      [leccion2.id, 'Cual es tu nombre', 'Iman sutiyki', 'pregunta', 'Iman sutiyki?'],
      [leccion2.id, 'Soy de', 'manta kani', 'presentacion', 'Cuscomanta kani'],
      [leccion2.id, 'Mucho gusto', 'Ancha kusikuni', 'cortesia', 'Ancha kusikuni'],
    ];
    
    for (const v of vocab2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // VOCABULARIO - Leccion 3 (Despedidas)
    const leccion3 = lecciones.find(l => l.numero === 3 && l.unidad_id === unidad1.id);
    
    const vocab3 = [
      [leccion3.id, 'Hasta luego', 'Tupananchikkama', 'despedida', 'Tupananchikkama, tayta'],
      [leccion3.id, 'Hasta pronto', 'Ratukama', 'despedida', 'Ratukama'],
      [leccion3.id, 'Hasta manana', 'Qayakama', 'despedida', 'Qayakama, wawqi'],
      [leccion3.id, 'Que te vaya bien', 'Allin ripuy', 'despedida', 'Allin ripuy, panay'],
    ];
    
    for (const v of vocab3) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // VOCABULARIO - Familia
    const leccionFam1 = lecciones.find(l => l.numero === 1 && l.unidad_id === unidad2.id);
    
    const vocabFam1 = [
      [leccionFam1.id, 'Padre', 'Tayta', 'familia', 'Taytay llamkaq'],
      [leccionFam1.id, 'Madre', 'Mama', 'familia', 'Mamay sumaq warmi'],
      [leccionFam1.id, 'Abuelo', 'Hatun tayta', 'familia', 'Hatun taytay yachaq'],
      [leccionFam1.id, 'Abuela', 'Hatun mama', 'familia', 'Hatun mamay'],
    ];
    
    for (const v of vocabFam1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // VOCABULARIO - Numeros
    const leccionNum1 = lecciones.find(l => l.numero === 1 && l.unidad_id === unidad3.id);
    
    const vocabNum1 = [
      [leccionNum1.id, 'Uno', 'Huk', 'numero', 'Huk llama'],
      [leccionNum1.id, 'Dos', 'Iskay', 'numero', 'Iskay nawi'],
      [leccionNum1.id, 'Tres', 'Kimsa', 'numero', 'Kimsa wawa'],
      [leccionNum1.id, 'Cuatro', 'Tawa', 'numero', 'Tawa chaki'],
      [leccionNum1.id, 'Cinco', 'Pichqa', 'numero', 'Pichqa rukana'],
    ];
    
    for (const v of vocabNum1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    const leccionNum2 = lecciones.find(l => l.numero === 2 && l.unidad_id === unidad3.id);
    
    const vocabNum2 = [
      [leccionNum2.id, 'Seis', 'Suqta', 'numero', 'Suqta punchay'],
      [leccionNum2.id, 'Siete', 'Qanchis', 'numero', 'Qanchis killa'],
      [leccionNum2.id, 'Ocho', 'Pusaq', 'numero', 'Pusaq wata'],
      [leccionNum2.id, 'Nueve', 'Isqun', 'numero', 'Isqun runa'],
      [leccionNum2.id, 'Diez', 'Chunka', 'numero', 'Chunka llama'],
    ];
    
    for (const v of vocabNum2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // VOCABULARIO - Colores
    const leccionCol1 = lecciones.find(l => l.numero === 1 && l.unidad_id === unidad4.id);
    
    const vocabCol1 = [
      [leccionCol1.id, 'Rojo', 'Puka', 'color', 'Puka tika'],
      [leccionCol1.id, 'Amarillo', 'Qillu', 'color', 'Qillu inti'],
      [leccionCol1.id, 'Azul', 'Anqas', 'color', 'Anqas hanaq pacha'],
    ];
    
    for (const v of vocabCol1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    const leccionCol2 = lecciones.find(l => l.numero === 2 && l.unidad_id === unidad4.id);
    
    const vocabCol2 = [
      [leccionCol2.id, 'Verde', 'Qumir', 'color', 'Qumir sacha'],
      [leccionCol2.id, 'Negro', 'Yana', 'color', 'Yana tuta'],
      [leccionCol2.id, 'Blanco', 'Yuraq', 'color', 'Yuraq riti'],
    ];
    
    for (const v of vocabCol2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    // VOCABULARIO - Animales
    const leccionAni1 = lecciones.find(l => l.numero === 1 && l.unidad_id === unidad5.id);
    
    const vocabAni1 = [
      [leccionAni1.id, 'Llama', 'Llama', 'animal', 'Llama qipiq'],
      [leccionAni1.id, 'Alpaca', 'Alpaka', 'animal', 'Alpaka sumaq millwa'],
      [leccionAni1.id, 'Perro', 'Allqu', 'animal', 'Allqu wasiqhawa'],
      [leccionAni1.id, 'Gato', 'Michi', 'animal', 'Michi hukuchamanta'],
    ];
    
    for (const v of vocabAni1) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    const leccionAni2 = lecciones.find(l => l.numero === 2 && l.unidad_id === unidad5.id);
    
    const vocabAni2 = [
      [leccionAni2.id, 'Condor', 'Kuntur', 'animal', 'Kuntur hanaq pachapi'],
      [leccionAni2.id, 'Puma', 'Puma', 'animal', 'Puma urqupi'],
      [leccionAni2.id, 'Zorro', 'Anas', 'animal', 'Anas tutapi'],
      [leccionAni2.id, 'Oso andino', 'Ukuku', 'animal', 'Ukuku sachapi'],
    ];
    
    for (const v of vocabAni2) {
      await client.query(
        'INSERT INTO vocabulario (leccion_id, palabra_espanol, palabra_objetivo, categoria, ejemplo_uso) VALUES ($1, $2, $3, $4, $5)',
        v
      );
    }
    
    console.log('Insertando ejercicios...');
    
    // EJERCICIOS - Leccion 1
    const ejercicios1 = [
      [leccion1.id, 'multiple_choice', 'Como se dice Hola en Quechua?', 'Allillanchu', JSON.stringify(['Allillanchu', 'Allin punchay', 'Tupananchikkama', 'Ratukama'])],
      [leccion1.id, 'multiple_choice', 'Que significa Allillanmi?', 'Estoy bien', JSON.stringify(['Estoy bien', 'Buenos dias', 'Hasta luego', 'Mucho gusto'])],
      [leccion1.id, 'multiple_choice', 'Cual es el saludo para la manana?', 'Allin punchay', JSON.stringify(['Allin punchay', 'Allin tuta', 'Allillanchu', 'Allin sukha'])],
      [leccion1.id, 'multiple_choice', 'Como dices Buenas noches?', 'Allin tuta', JSON.stringify(['Allin tuta', 'Allin punchay', 'Allin sukha', 'Allillanmi'])],
      [leccion1.id, 'drag_words', 'Completa: ___ punchay (Buenos dias)', 'Allin', JSON.stringify(['Allin', 'Yana', 'Puka', 'Hatun'])],
    ];
    
    for (const e of ejercicios1) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // EJERCICIOS - Leccion 2 (Presentaciones)
    const ejercicios2 = [
      [leccion2.id, 'multiple_choice', 'Como preguntas Cual es tu nombre?', 'Iman sutiyki', JSON.stringify(['Iman sutiyki', 'Allillanchu', 'Maymantan kanki', 'Imatan ruranki'])],
      [leccion2.id, 'multiple_choice', 'Para decir Soy de Cusco dices:', 'Cuscomanta kani', JSON.stringify(['Cuscomanta kani', 'Cuscopi kani', 'Cuscoman rini', 'Cusco sutiy'])],
      [leccion2.id, 'multiple_choice', 'Que significa Ancha kusikuni?', 'Mucho gusto', JSON.stringify(['Mucho gusto', 'Hasta luego', 'Buenos dias', 'Como estas'])],
      [leccion2.id, 'drag_words', 'Mi nombre es Pedro: ___ Pedrom', 'Sutiy', JSON.stringify(['Sutiy', 'Kani', 'Manta', 'Rini'])],
    ];
    
    for (const e of ejercicios2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // EJERCICIOS - Leccion 3 (Despedidas)
    const ejercicios3 = [
      [leccion3.id, 'multiple_choice', 'Que significa Tupananchikkama?', 'Hasta que nos encontremos', JSON.stringify(['Hasta que nos encontremos', 'Buenos dias', 'Mucho gusto', 'Como estas'])],
      [leccion3.id, 'multiple_choice', 'Como dices Hasta manana?', 'Qayakama', JSON.stringify(['Qayakama', 'Ratukama', 'Tupananchikkama', 'Allin ripuy'])],
      [leccion3.id, 'multiple_choice', 'Cual es una forma de decir Hasta pronto?', 'Ratukama', JSON.stringify(['Ratukama', 'Allin punchay', 'Allillanmi', 'Iman sutiyki'])],
    ];
    
    for (const e of ejercicios3) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // EJERCICIOS - Familia
    const ejerciciosFam = [
      [leccionFam1.id, 'multiple_choice', 'Como se dice padre en Quechua?', 'Tayta', JSON.stringify(['Tayta', 'Mama', 'Wawqi', 'Churi'])],
      [leccionFam1.id, 'multiple_choice', 'Que significa Hatun mama?', 'Abuela', JSON.stringify(['Abuela', 'Madre', 'Tia', 'Hermana'])],
      [leccionFam1.id, 'multiple_choice', 'Como se dice madre?', 'Mama', JSON.stringify(['Mama', 'Tayta', 'Pani', 'Turi'])],
      [leccionFam1.id, 'drag_words', 'Mi ___ (padre) trabaja', 'Tayta', JSON.stringify(['Tayta', 'Mama', 'Wawqi', 'Churi'])],
    ];
    
    for (const e of ejerciciosFam) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // EJERCICIOS - Numeros
    const ejerciciosNum = [
      [leccionNum1.id, 'multiple_choice', 'Cuanto es Iskay?', '2', JSON.stringify(['2', '1', '3', '5'])],
      [leccionNum1.id, 'multiple_choice', 'Como se dice 5 en Quechua?', 'Pichqa', JSON.stringify(['Pichqa', 'Tawa', 'Kimsa', 'Suqta'])],
      [leccionNum1.id, 'multiple_choice', 'Que numero es Huk?', '1', JSON.stringify(['1', '2', '3', '4'])],
      [leccionNum1.id, 'drag_words', 'Tres en Quechua es ___', 'Kimsa', JSON.stringify(['Kimsa', 'Iskay', 'Tawa', 'Huk'])],
    ];
    
    for (const e of ejerciciosNum) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    const ejerciciosNum2 = [
      [leccionNum2.id, 'multiple_choice', 'Cuanto es Chunka?', '10', JSON.stringify(['10', '7', '8', '9'])],
      [leccionNum2.id, 'multiple_choice', 'Como se dice 7?', 'Qanchis', JSON.stringify(['Qanchis', 'Suqta', 'Pusaq', 'Isqun'])],
      [leccionNum2.id, 'multiple_choice', 'Que numero es Pusaq?', '8', JSON.stringify(['8', '6', '7', '9'])],
    ];
    
    for (const e of ejerciciosNum2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // EJERCICIOS - Colores
    const ejerciciosCol = [
      [leccionCol1.id, 'multiple_choice', 'De que color es Puka?', 'Rojo', JSON.stringify(['Rojo', 'Azul', 'Verde', 'Amarillo'])],
      [leccionCol1.id, 'multiple_choice', 'Como se dice amarillo?', 'Qillu', JSON.stringify(['Qillu', 'Puka', 'Anqas', 'Qumir'])],
      [leccionCol1.id, 'multiple_choice', 'Que color es Anqas?', 'Azul', JSON.stringify(['Azul', 'Rojo', 'Verde', 'Negro'])],
    ];
    
    for (const e of ejerciciosCol) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    const ejerciciosCol2 = [
      [leccionCol2.id, 'multiple_choice', 'Que color es Yana?', 'Negro', JSON.stringify(['Negro', 'Blanco', 'Verde', 'Azul'])],
      [leccionCol2.id, 'multiple_choice', 'Como se dice blanco?', 'Yuraq', JSON.stringify(['Yuraq', 'Yana', 'Qumir', 'Puka'])],
      [leccionCol2.id, 'drag_words', 'El color de la nieve es ___', 'Yuraq', JSON.stringify(['Yuraq', 'Yana', 'Qumir', 'Puka'])],
    ];
    
    for (const e of ejerciciosCol2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    // EJERCICIOS - Animales
    const ejerciciosAni = [
      [leccionAni1.id, 'multiple_choice', 'Como se dice perro en Quechua?', 'Allqu', JSON.stringify(['Allqu', 'Michi', 'Llama', 'Kuntur'])],
      [leccionAni1.id, 'multiple_choice', 'Que animal es Michi?', 'Gato', JSON.stringify(['Gato', 'Perro', 'Llama', 'Alpaca'])],
      [leccionAni1.id, 'multiple_choice', 'Como se dice alpaca?', 'Alpaka', JSON.stringify(['Alpaka', 'Llama', 'Allqu', 'Kuntur'])],
    ];
    
    for (const e of ejerciciosAni) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    const ejerciciosAni2 = [
      [leccionAni2.id, 'multiple_choice', 'Que animal es el Kuntur?', 'Condor', JSON.stringify(['Condor', 'Puma', 'Zorro', 'Oso'])],
      [leccionAni2.id, 'multiple_choice', 'Como se dice zorro?', 'Anas', JSON.stringify(['Anas', 'Puma', 'Kuntur', 'Ukuku'])],
      [leccionAni2.id, 'multiple_choice', 'Que animal es Ukuku?', 'Oso andino', JSON.stringify(['Oso andino', 'Condor', 'Puma', 'Zorro'])],
    ];
    
    for (const e of ejerciciosAni2) {
      await client.query(
        'INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES ($1, $2, $3, $4, $5)',
        e
      );
    }
    
    console.log('Insertando insignias...');
    
    const insignias = [
      ['Primer Paso', 'Completaste tu primera leccion', '🎯', 'complete_first_lesson'],
      ['Explorador de Saludos', 'Dominaste la unidad de saludos', '👋', 'complete_unit_1'],
      ['Guardian del Ayllu', 'Aprendiste todo sobre la familia', '👨‍👩‍👧‍👦', 'complete_unit_2'],
      ['Maestro de Numeros', 'Dominas los numeros del 1 al 10', '🔢', 'complete_unit_3'],
      ['Artista de Colores', 'Conoces todos los colores', '🎨', 'complete_unit_4'],
      ['Amigo de los Animales', 'Aprendiste los animales andinos', '🦙', 'complete_unit_5'],
      ['Chef Andino', 'Dominas el vocabulario de comidas', '🌽', 'complete_unit_6'],
      ['Racha de Fuego', 'Estudiaste 7 dias seguidos', '🔥', 'streak_7_days'],
      ['Perfeccionista', 'Obtuviste 100% en una leccion', '⭐', 'perfect_lesson'],
      ['Sabio Andino', 'Completaste todas las unidades', '🏆', 'complete_all_units'],
    ];
    
    for (const i of insignias) {
      await client.query(
        'INSERT INTO insignias (nombre, descripcion, icono_url, condicion) VALUES ($1, $2, $3, $4)',
        i
      );
    }
    
    console.log('Insertando contenido cultural...');
    
    const cultura = [
      ['proverbio', 'quechua', 'Ama Sua, Ama Llulla, Ama Quella', 'Ama Sua, Ama Llulla, Ama Quella', 'No robes, No mientas, No seas perezoso.', '🏔️'],
      ['proverbio', 'quechua', 'Sobre el trabajo', 'Llamkayqa kawsaymi', 'El trabajo es vida.', '💪'],
      ['proverbio', 'quechua', 'Sobre la unidad', 'Huk makillawan mana atinichu', 'Con una sola mano no se puede.', '🤝'],
    ];
    
    for (const c of cultura) {
      await client.query(
        'INSERT INTO contenido_cultural (tipo, idioma, titulo, contenido_original, traduccion, imagen_url) VALUES ($1, $2, $3, $4, $5, $6)',
        c
      );
    }
    
    const counts = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM unidades) as unidades,
        (SELECT COUNT(*) FROM lecciones) as lecciones,
        (SELECT COUNT(*) FROM vocabulario) as vocabulario,
        (SELECT COUNT(*) FROM ejercicios) as ejercicios,
        (SELECT COUNT(*) FROM insignias) as insignias,
        (SELECT COUNT(*) FROM contenido_cultural) as cultura
    `);
    
    console.log('\n=== SEEDS INSERTADOS ===');
    console.log('Unidades:', counts.rows[0].unidades);
    console.log('Lecciones:', counts.rows[0].lecciones);
    console.log('Vocabulario:', counts.rows[0].vocabulario);
    console.log('Ejercicios:', counts.rows[0].ejercicios);
    console.log('Insignias:', counts.rows[0].insignias);
    console.log('Contenido Cultural:', counts.rows[0].cultura);
    
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

insertSeeds()
  .then(() => {
    console.log('\nProceso completado!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error fatal:', err);
    process.exit(1);
  });