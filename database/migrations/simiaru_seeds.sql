-- =====================================================
-- SIMIARU - SEEDS DE CONTENIDO EDUCATIVO
-- Quechua y Aymara - Contenido Auténtico
-- =====================================================

-- Limpiar datos existentes (en orden correcto por foreign keys)
DELETE FROM usuario_insignias;
DELETE FROM progreso_usuario;
DELETE FROM ejercicios;
DELETE FROM vocabulario;
DELETE FROM lecciones;
DELETE FROM unidades;
DELETE FROM insignias;
DELETE FROM contenido_cultural;

-- =====================================================
-- UNIDADES - QUECHUA
-- =====================================================
INSERT INTO unidades (numero, nombre, descripcion, idioma, orden, icono_url) VALUES
(1, 'Napaykuna', 'Saludos y presentaciones básicas en Quechua', 'quechua', 1, '👋'),
(2, 'Ayllu', 'La familia y relaciones familiares', 'quechua', 2, '👨‍👩‍👧‍👦'),
(3, 'Yupana', 'Números y conteo del 1 al 20', 'quechua', 3, '🔢'),
(4, 'Llinphikuna', 'Los colores en Quechua', 'quechua', 4, '🎨'),
(5, 'Uywakuna', 'Animales de los Andes', 'quechua', 5, '🦙'),
(6, 'Mikhuna', 'Comidas y alimentos andinos', 'quechua', 6, '🌽'),
(7, 'Pachakuna', 'El tiempo y la naturaleza', 'quechua', 7, '🌄'),
(8, 'Ukhu', 'El cuerpo humano', 'quechua', 8, '🧍');

-- =====================================================
-- UNIDADES - AYMARA
-- =====================================================
INSERT INTO unidades (numero, nombre, descripcion, idioma, orden, icono_url) VALUES
(1, 'Aruntanaka', 'Saludos y presentaciones en Aymara', 'aymara', 1, '👋'),
(2, 'Jatha', 'La familia en Aymara', 'aymara', 2, '👨‍👩‍👧‍👦'),
(3, 'Jakhu', 'Números y conteo', 'aymara', 3, '🔢'),
(4, 'Samikuna', 'Los colores', 'aymara', 4, '🎨'),
(5, 'Uywanaka', 'Animales andinos', 'aymara', 5, '🦙'),
(6, 'Manq''a', 'Comidas tradicionales', 'aymara', 6, '🌽');

-- =====================================================
-- LECCIONES - QUECHUA UNIDAD 1: SALUDOS
-- =====================================================
INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES
-- Unidad 1: Saludos (asumiendo id=1)
(1, 1, 'Saludos del día', 
'En Quechua, los saludos varían según el momento del día. "Allillanchu" es el saludo más común y significa "¿Estás bien?". La respuesta es "Allillanmi" (Estoy bien).

Los saludos matutinos usan "Allin punchay" (Buen día), mientras que en la tarde se dice "Allin sukha" y en la noche "Allin tuta".', 1),

(1, 2, 'Presentaciones personales', 
'Para presentarte en Quechua usamos la estructura: "[Nombre]-mi sutiy" que significa "Mi nombre es [Nombre]".

Para preguntar el nombre: "¿Iman sutiyki?" (¿Cuál es tu nombre?)
Para decir de dónde eres: "[Lugar]-manta kani" (Soy de [Lugar])', 2),

(1, 3, 'Despedidas', 
'Las despedidas en Quechua son muy expresivas:
- "Tupananchikkama" - Hasta que nos volvamos a encontrar
- "Ratukama" - Hasta pronto
- "Q''ayakama" - Hasta mañana

Estas expresiones reflejan la importancia de los vínculos comunitarios en la cultura andina.', 3),

-- Unidad 2: Familia (id=2)
(2, 1, 'Padres y abuelos',
'La familia es el centro de la cultura andina. El concepto de "Ayllu" va más allá de la familia nuclear.

Vocabulario esencial:
- Tayta (Padre)
- Mama (Madre)  
- Hatun tayta (Abuelo)
- Hatun mama (Abuela)', 1),

(2, 2, 'Hermanos e hijos',
'En Quechua existen diferentes palabras según el género del hablante:
- Wawqi (Hermano, dicho por un hombre)
- Turi (Hermano, dicho por una mujer)
- Ñaña (Hermana, dicho por una mujer)
- Pani (Hermana, dicho por un hombre)
- Churi (Hijo/a)', 2),

(2, 3, 'La familia extendida',
'El Ayllu incluye a toda la comunidad:
- Tiyuy (Tío)
- Ipa (Tía)
- Mulla (Primo/a)
- Qatay (Yerno)
- Qhachun (Nuera)', 3),

-- Unidad 3: Números (id=3)
(3, 1, 'Números del 1 al 5',
'El sistema numérico Quechua es decimal. Aprende los primeros números:
- Huk (1)
- Iskay (2)
- Kimsa (3)
- Tawa (4)
- Pichqa (5)

Estos números son la base para contar en Quechua.', 1),

(3, 2, 'Números del 6 al 10',
'Continuamos con:
- Suqta (6)
- Qanchis (7)
- Pusaq (8)
- Isqun (9)
- Chunka (10)

"Chunka" significa diez y es la base para formar números mayores.', 2),

(3, 3, 'Números del 11 al 20',
'Los números compuestos se forman con chunka + unidad:
- Chunka hukniyuq (11) - Diez con uno
- Chunka iskayniyuq (12)
- Chunka kimsayuq (13)
- Iskay chunka (20) - Dos dieces', 3),

-- Unidad 4: Colores (id=4)
(4, 1, 'Colores primarios',
'Los colores en Quechua reflejan la naturaleza andina:
- Puka (Rojo) - Color de la tierra y festividades
- Q''illu (Amarillo) - Color del sol y el oro
- Anqas (Azul) - Color del cielo andino', 1),

(4, 2, 'Colores de la naturaleza',
'Más colores inspirados en el entorno:
- Q''umir (Verde) - Color de las plantas y montañas
- Yana (Negro) - Color de la noche
- Yuraq (Blanco) - Color de la nieve en las cumbres', 2),

(4, 3, 'Colores de la Wiphala',
'La Wiphala es la bandera de los pueblos andinos con 7 colores:
- Puka, Q''illu, Anqas, Q''umir, Yana, Yuraq, Chumpi (marrón)
Cada color representa elementos de la cosmovisión andina.', 3),

-- Unidad 5: Animales (id=5)
(5, 1, 'Animales domésticos',
'Los animales han sido fundamentales en la vida andina:
- Llama - Animal de carga sagrado
- Alpaka - Valorada por su lana
- Allqu - Perro, compañero fiel
- Michi - Gato', 1),

(5, 2, 'Animales silvestres',
'La fauna andina es rica y diversa:
- Kuntur (Cóndor) - Ave sagrada de los Andes
- Puma - Símbolo de fuerza
- Añas (Zorro) - Presente en muchos cuentos
- Ukuku (Oso andino)', 2),

(5, 3, 'Aves y otros animales',
'Más animales del mundo andino:
- Pisqu (Pájaro)
- Wallpa (Gallina)
- K''uchi (Cerdo)
- Challwa (Pez)
- Kirkinchu (Armadillo)', 3),

-- Unidad 6: Comida (id=6)
(6, 1, 'Tubérculos y granos',
'La base de la alimentación andina:
- Papa - La papa, originaria de los Andes
- Sara - Maíz, cereal sagrado
- Kinuwa - Quinua, grano de oro
- Uqa - Oca', 1),

(6, 2, 'Frutas y verduras',
'Productos de la tierra:
- Pallar - Frijol
- Tumpi - Tomate
- Uchu - Ají
- Chirimoya - Fruta andina', 2),

(6, 3, 'Platos tradicionales',
'Comidas típicas:
- Pachamanka - Cocción en tierra
- Chuño - Papa deshidratada
- Chicha - Bebida de maíz
- Humita - Tamal de maíz tierno', 3),

-- Unidad 7: Tiempo y naturaleza (id=7)
(7, 1, 'Los momentos del día',
'El tiempo en la cosmovisión andina:
- Punchay - Día
- Tuta - Noche
- Pacha - Tiempo/espacio
- Inti - Sol', 1),

(7, 2, 'Clima y estaciones',
'Fenómenos naturales:
- Para - Lluvia
- Rit''i - Nieve
- Wayra - Viento
- Chiri - Frío
- Ruphay - Calor', 2),

(7, 3, 'Elementos de la naturaleza',
'La Pachamama y sus elementos:
- Mayu - Río
- Qucha - Lago
- Urqu - Montaña/Cerro
- Sach''a - Árbol', 3),

-- Unidad 8: Cuerpo humano (id=8)
(8, 1, 'La cabeza',
'Partes de la cabeza:
- Uma - Cabeza
- Ñawi - Ojo
- Rinri - Oreja
- Sinqa - Nariz
- Simi - Boca', 1),

(8, 2, 'El cuerpo',
'Partes del cuerpo:
- Maki - Mano
- Chaki - Pie
- Sunqu - Corazón
- Wiksa - Estómago
- Kunka - Cuello', 2),

(8, 3, 'Expresiones corporales',
'Verbos relacionados:
- Qawaray - Mirar
- Uyariy - Escuchar
- Mikuy - Comer
- Puñuy - Dormir
- Puriy - Caminar', 3);

-- =====================================================
-- LECCIONES - AYMARA
-- =====================================================
INSERT INTO lecciones (unidad_id, numero, titulo, contenido_teorico, orden) VALUES
-- Unidad 1 Aymara: Saludos (id=9)
(9, 1, 'Saludos básicos',
'Los saludos en Aymara expresan respeto y comunidad:
- Kamisaki - ¿Cómo estás?
- Waliki - Estoy bien
- Kamisaraki - ¿Cómo están? (plural)
- Aski urukipan - Buenos días', 1),

(9, 2, 'Presentaciones',
'Para presentarte en Aymara:
- Nayan sutija [nombre] - Mi nombre es...
- Kunasa sutima? - ¿Cuál es tu nombre?
- [Lugar]tan jutatha - Vengo de [Lugar]', 2),

-- Unidad 2 Aymara: Familia (id=10)
(10, 1, 'La familia nuclear',
'Términos familiares en Aymara:
- Awki - Padre
- Tayka - Madre
- Yuqalla - Hijo (varón)
- Imilla - Hija (mujer)
- Jila - Hermano mayor', 1),

(10, 2, 'Familia extendida',
'Más relaciones familiares:
- Achachila - Abuelo
- Awicha - Abuela
- Lari - Tío materno
- Ipa - Tía', 2),

-- Unidad 3 Aymara: Números (id=11)
(11, 1, 'Números 1-10',
'Sistema numérico Aymara:
- Maya (1), Paya (2), Kimsa (3)
- Pusi (4), Phisqa (5), Suxta (6)
- Paqallqu (7), Kimsaqallqu (8)
- Llätunka (9), Tunka (10)', 1),

-- Unidad 4 Aymara: Colores (id=12)
(12, 1, 'Colores básicos',
'Colores en Aymara:
- Wila - Rojo
- Q''illu - Amarillo
- Larama - Azul
- Ch''uxña - Verde
- Ch''iyara - Negro
- Janq''u - Blanco', 1),

-- Unidad 5 Aymara: Animales (id=13)
(13, 1, 'Animales andinos',
'Fauna en Aymara:
- Qawra - Llama
- Allpachu - Alpaca
- Kunturi - Cóndor
- Anu - Perro
- Phisi - Gato
- Wank''u - Conejo', 1),

-- Unidad 6 Aymara: Comida (id=14)
(14, 1, 'Alimentos básicos',
'Comida en Aymara:
- Ch''uqi - Papa
- Tunqu - Maíz
- Jupha - Quinua
- Jallpa - Ají
- Uma - Agua', 1);

-- =====================================================
-- VOCABULARIO - QUECHUA UNIDAD 1
-- =====================================================
INSERT INTO vocabulario (leccion_id, palabra_español, palabra_objetivo, categoria, ejemplo_uso) VALUES
-- Lección 1: Saludos del día (id=1)
(1, 'Hola / ¿Cómo estás?', 'Allillanchu', 'saludo', 'Allillanchu, María'),
(1, 'Estoy bien', 'Allillanmi', 'respuesta', 'Allillanmi, qamri?'),
(1, 'Buenos días', 'Allin punchay', 'saludo', 'Allin punchay, tayta'),
(1, 'Buenas tardes', 'Allin sukha', 'saludo', 'Allin sukha, mama'),
(1, 'Buenas noches', 'Allin tuta', 'saludo', 'Allin tuta, wawqi'),
(1, 'Bienvenido', 'Allin hamusqa', 'saludo', 'Allin hamusqa wasiypi'),

-- Lección 2: Presentaciones (id=2)
(2, 'Mi nombre es', 'Sutiy ... -mi', 'presentación', 'Sutiy Pedrom'),
(2, '¿Cuál es tu nombre?', 'Iman sutiyki?', 'pregunta', 'Allillanchu, iman sutiyki?'),
(2, 'Soy de', '...-manta kani', 'presentación', 'Cuscomanta kani'),
(2, 'Mucho gusto', 'Ancha kusikuni', 'cortesía', 'Ancha kusikuni riqsirispa'),
(2, 'Igualmente', 'Kikillantataq', 'respuesta', 'Kikillantataq, panayta'),

-- Lección 3: Despedidas (id=3)
(3, 'Hasta luego', 'Tupananchikkama', 'despedida', 'Tupananchikkama, tayta'),
(3, 'Hasta pronto', 'Ratukama', 'despedida', 'Ratukama, ñuqa ripuni'),
(3, 'Hasta mañana', 'Q''ayakama', 'despedida', 'Q''ayakama, wawqi'),
(3, 'Adiós', 'Tinkunanchiskama', 'despedida', 'Tinkunanchiskama'),
(3, 'Que te vaya bien', 'Allin ripuy', 'despedida', 'Allin ripuy, panay'),

-- Vocabulario Unidad 2: Familia
(4, 'Padre', 'Tayta', 'familia', 'Taytay llamkaq'),
(4, 'Madre', 'Mama', 'familia', 'Mamay sumaq warmi'),
(4, 'Abuelo', 'Hatun tayta', 'familia', 'Hatun taytay yachaq'),
(4, 'Abuela', 'Hatun mama', 'familia', 'Hatun mamay t''anta ruwaq'),

(5, 'Hermano (dicho por hombre)', 'Wawqi', 'familia', 'Wawqiy escuelapi'),
(5, 'Hermano (dicho por mujer)', 'Turi', 'familia', 'Turiy llaqtapi'),
(5, 'Hermana (dicho por mujer)', 'Ñaña', 'familia', 'Ñañay wasipi'),
(5, 'Hermana (dicho por hombre)', 'Pani', 'familia', 'Paniy sumaq sipas'),
(5, 'Hijo/a', 'Churi', 'familia', 'Churiy yachakuq'),

(6, 'Tío', 'Tiyuy', 'familia', 'Tiyuy chakrapi'),
(6, 'Tía', 'Ipa', 'familia', 'Ipay q''atitu'),
(6, 'Primo/a', 'Mulla', 'familia', 'Mullay kusikuq'),

-- Vocabulario Unidad 3: Números
(7, 'Uno', 'Huk', 'número', 'Huk llama'),
(7, 'Dos', 'Iskay', 'número', 'Iskay ñawi'),
(7, 'Tres', 'Kimsa', 'número', 'Kimsa wawa'),
(7, 'Cuatro', 'Tawa', 'número', 'Tawa chaki'),
(7, 'Cinco', 'Pichqa', 'número', 'Pichqa ruk''ana'),

(8, 'Seis', 'Suqta', 'número', 'Suqta p''unchay'),
(8, 'Siete', 'Qanchis', 'número', 'Qanchis killa'),
(8, 'Ocho', 'Pusaq', 'número', 'Pusaq wata'),
(8, 'Nueve', 'Isqun', 'número', 'Isqun runa'),
(8, 'Diez', 'Chunka', 'número', 'Chunka llama'),

(9, 'Once', 'Chunka hukniyuq', 'número', 'Chunka hukniyuq papa'),
(9, 'Doce', 'Chunka iskayniyuq', 'número', 'Chunka iskayniyuq sara'),
(9, 'Veinte', 'Iskay chunka', 'número', 'Iskay chunka wata'),

-- Vocabulario Unidad 4: Colores
(10, 'Rojo', 'Puka', 'color', 'Puka t''ika'),
(10, 'Amarillo', 'Q''illu', 'color', 'Q''illu inti'),
(10, 'Azul', 'Anqas', 'color', 'Anqas hanaq pacha'),

(11, 'Verde', 'Q''umir', 'color', 'Q''umir sach''a'),
(11, 'Negro', 'Yana', 'color', 'Yana tuta'),
(11, 'Blanco', 'Yuraq', 'color', 'Yuraq rit''i'),

(12, 'Marrón', 'Chumpi', 'color', 'Chumpi allpa'),
(12, 'Naranja', 'Willapi', 'color', 'Willapi t''ika'),

-- Vocabulario Unidad 5: Animales
(13, 'Llama', 'Llama', 'animal', 'Llama q''ipiq'),
(13, 'Alpaca', 'Alpaka', 'animal', 'Alpaka sumaq millwa'),
(13, 'Perro', 'Allqu', 'animal', 'Allqu wasiqhawa'),
(13, 'Gato', 'Michi', 'animal', 'Michi huk''uchamanta'),

(14, 'Cóndor', 'Kuntur', 'animal', 'Kuntur hanaq pachapi'),
(14, 'Puma', 'Puma', 'animal', 'Puma urqupi'),
(14, 'Zorro', 'Añas', 'animal', 'Añas tutapi'),
(14, 'Oso andino', 'Ukuku', 'animal', 'Ukuku sach''api'),

(15, 'Pájaro', 'Pisqu', 'animal', 'Pisqu takiq'),
(15, 'Gallina', 'Wallpa', 'animal', 'Wallpa runtuta'),
(15, 'Pez', 'Challwa', 'animal', 'Challwa mayupi'),

-- Vocabulario Unidad 6: Comida
(16, 'Papa', 'Papa', 'alimento', 'Papa allpa ukhupi'),
(16, 'Maíz', 'Sara', 'alimento', 'Sara q''illu'),
(16, 'Quinua', 'Kinuwa', 'alimento', 'Kinuwa sumaq mikhuna'),
(16, 'Oca', 'Uqa', 'alimento', 'Uqa misk''i'),

(17, 'Frijol', 'Pallar', 'alimento', 'Pallar wayk''usqa'),
(17, 'Tomate', 'Tumpi', 'alimento', 'Tumpi puka'),
(17, 'Ají', 'Uchu', 'alimento', 'Uchu q''uñi'),

(18, 'Chicha', 'Chicha', 'bebida', 'Chicha saraman'),
(18, 'Papa deshidratada', 'Chuño', 'alimento', 'Chuño ch''iriyasqa'),

-- Vocabulario Unidad 7: Tiempo
(19, 'Día', 'Punchay', 'tiempo', 'Allin punchay'),
(19, 'Noche', 'Tuta', 'tiempo', 'Tuta yana'),
(19, 'Sol', 'Inti', 'naturaleza', 'Inti taytanchis'),

(20, 'Lluvia', 'Para', 'clima', 'Para hamuchkan'),
(20, 'Nieve', 'Rit''i', 'clima', 'Rit''i urqupi'),
(20, 'Viento', 'Wayra', 'clima', 'Wayra sinchi'),
(20, 'Frío', 'Chiri', 'clima', 'Chiri pacha'),
(20, 'Calor', 'Ruphay', 'clima', 'Ruphay punchay'),

(21, 'Río', 'Mayu', 'naturaleza', 'Hatun mayu'),
(21, 'Lago', 'Qucha', 'naturaleza', 'Titicaca qucha'),
(21, 'Montaña', 'Urqu', 'naturaleza', 'Urqu hatun'),
(21, 'Árbol', 'Sach''a', 'naturaleza', 'Q''umir sach''a'),

-- Vocabulario Unidad 8: Cuerpo
(22, 'Cabeza', 'Uma', 'cuerpo', 'Umay nanawan'),
(22, 'Ojo', 'Ñawi', 'cuerpo', 'Iskay ñawi'),
(22, 'Oreja', 'Rinri', 'cuerpo', 'Rinriywan uyarini'),
(22, 'Nariz', 'Sinqa', 'cuerpo', 'Sinqay hatun'),
(22, 'Boca', 'Simi', 'cuerpo', 'Simiwan rimani'),

(23, 'Mano', 'Maki', 'cuerpo', 'Makiywan llamk''ani'),
(23, 'Pie', 'Chaki', 'cuerpo', 'Chakiywan purini'),
(23, 'Corazón', 'Sunqu', 'cuerpo', 'Sunquy kusisqa'),
(23, 'Estómago', 'Wiksa', 'cuerpo', 'Wiksay yarqasqa'),

(24, 'Mirar', 'Qawaray', 'verbo', 'Qawarariy ñuqata'),
(24, 'Escuchar', 'Uyariy', 'verbo', 'Uyariy taytata'),
(24, 'Comer', 'Mikuy', 'verbo', 'Mikuy papata'),
(24, 'Dormir', 'Puñuy', 'verbo', 'Puñuy allin'),
(24, 'Caminar', 'Puriy', 'verbo', 'Puriy llaqtaman');

-- =====================================================
-- VOCABULARIO - AYMARA
-- =====================================================
INSERT INTO vocabulario (leccion_id, palabra_español, palabra_objetivo, categoria, ejemplo_uso) VALUES
-- Aymara Saludos (lección 25)
(25, '¿Cómo estás?', 'Kamisaki', 'saludo', 'Kamisaki, jilata'),
(25, 'Estoy bien', 'Waliki', 'respuesta', 'Waliki, jumarusti'),
(25, 'Buenos días', 'Aski urukipan', 'saludo', 'Aski urukipan, tayka'),

(26, 'Mi nombre es', 'Nayan sutija', 'presentación', 'Nayan sutija María'),
(26, '¿Cómo te llamas?', 'Kunasa sutima?', 'pregunta', 'Kunasa sutima, jilata?'),

-- Aymara Familia (lección 27-28)
(27, 'Padre', 'Awki', 'familia', 'Awkija utankiwa'),
(27, 'Madre', 'Tayka', 'familia', 'Taykaja wali munata'),
(27, 'Hijo', 'Yuqalla', 'familia', 'Yuqallaja yatiqaskiwa'),
(27, 'Hija', 'Imilla', 'familia', 'Imillaja wawawa'),

(28, 'Abuelo', 'Achachila', 'familia', 'Achachilaja yatiri'),
(28, 'Abuela', 'Awicha', 'familia', 'Awichaja t''ant''a luri'),
(28, 'Tío', 'Lari', 'familia', 'Larija yapuchirina'),

-- Aymara Números (lección 29)
(29, 'Uno', 'Maya', 'número', 'Maya uta'),
(29, 'Dos', 'Paya', 'número', 'Paya nayra'),
(29, 'Tres', 'Kimsa', 'número', 'Kimsa wawa'),
(29, 'Cuatro', 'Pusi', 'número', 'Pusi kayu'),
(29, 'Cinco', 'Phisqa', 'número', 'Phisqa luk''ana'),
(29, 'Seis', 'Suxta', 'número', 'Suxta uru'),
(29, 'Siete', 'Paqallqu', 'número', 'Paqallqu phaxsi'),
(29, 'Ocho', 'Kimsaqallqu', 'número', 'Kimsaqallqu mara'),
(29, 'Nueve', 'Llätunka', 'número', 'Llätunka jaqi'),
(29, 'Diez', 'Tunka', 'número', 'Tunka qawra'),

-- Aymara Colores (lección 30)
(30, 'Rojo', 'Wila', 'color', 'Wila panqara'),
(30, 'Amarillo', 'Q''illu', 'color', 'Q''illu inti'),
(30, 'Azul', 'Larama', 'color', 'Larama alaxpacha'),
(30, 'Verde', 'Ch''uxña', 'color', 'Ch''uxña quqa'),
(30, 'Negro', 'Ch''iyara', 'color', 'Ch''iyara aruma'),
(30, 'Blanco', 'Janq''u', 'color', 'Janq''u khunu'),

-- Aymara Animales (lección 31)
(31, 'Llama', 'Qawra', 'animal', 'Qawra q''ipiwa apiri'),
(31, 'Alpaca', 'Allpachu', 'animal', 'Allpachu t''arwa'),
(31, 'Cóndor', 'Kunturi', 'animal', 'Kunturi jach''a'),
(31, 'Perro', 'Anu', 'animal', 'Anu utankirakiwa'),
(31, 'Gato', 'Phisi', 'animal', 'Phisi achaku katjiri'),

-- Aymara Comida (lección 32)
(32, 'Papa', 'Ch''uqi', 'alimento', 'Ch''uqi manq''a'),
(32, 'Maíz', 'Tunqu', 'alimento', 'Tunqu q''illu'),
(32, 'Quinua', 'Jupha', 'alimento', 'Jupha suma manq''a'),
(32, 'Ají', 'Jallpa', 'alimento', 'Jallpa k''ataki'),
(32, 'Agua', 'Uma', 'bebida', 'Uma umiri');

-- =====================================================
-- EJERCICIOS - QUECHUA
-- =====================================================
INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES
-- Ejercicios Lección 1: Saludos
(1, 'multiple_choice', '¿Cómo se dice "Hola, ¿cómo estás?" en Quechua?', 'Allillanchu', 
'["Allillanchu", "Allin punchay", "Tupananchikkama", "Ratukama"]'),

(1, 'multiple_choice', '¿Qué significa "Allillanmi"?', 'Estoy bien', 
'["Estoy bien", "Buenos días", "Hasta luego", "Mucho gusto"]'),

(1, 'multiple_choice', '¿Cuál es el saludo para la mañana?', 'Allin punchay', 
'["Allin punchay", "Allin tuta", "Allillanchu", "Allin sukha"]'),

(1, 'drag_words', 'Ordena: __ punchay (Buenos días)', 'Allin', 
'["Allin", "Yana", "Puka", "Hatun"]'),

(1, 'listen_write', 'Escribe el saludo que escuchas', 'Allillanchu', NULL),

-- Ejercicios Lección 2: Presentaciones
(2, 'multiple_choice', '¿Cómo preguntas "¿Cuál es tu nombre?" en Quechua?', 'Iman sutiyki?', 
'["Iman sutiyki?", "Allillanchu?", "Maymantan kanki?", "Imatan ruranki?"]'),

(2, 'drag_words', 'Completa: __ sutiy (Mi nombre es Pedro)', 'Pedrom', 
'["Pedrom", "Pedrota", "Pedromanta", "Pedropi"]'),

(2, 'multiple_choice', 'Para decir "Soy de Cusco" dices:', 'Cuscomanta kani', 
'["Cuscomanta kani", "Cuscopi kani", "Cuscoman rini", "Cusco sutiy"]'),

-- Ejercicios Lección 3: Despedidas
(3, 'multiple_choice', '¿Qué significa "Tupananchikkama"?', 'Hasta que nos encontremos', 
'["Hasta que nos encontremos", "Buenos días", "Mucho gusto", "¿Cómo estás?"]'),

(3, 'multiple_choice', '¿Cómo dices "Hasta mañana"?', 'Q''ayakama', 
'["Q''ayakama", "Ratukama", "Tupananchikkama", "Allin ripuy"]'),

-- Ejercicios Unidad 2: Familia
(4, 'multiple_choice', '¿Cómo se dice "padre" en Quechua?', 'Tayta', 
'["Tayta", "Mama", "Wawqi", "Churi"]'),

(4, 'multiple_choice', '¿Qué significa "Hatun mama"?', 'Abuela', 
'["Abuela", "Madre", "Tía", "Hermana"]'),

(5, 'multiple_choice', 'Un hombre dice "hermano" como:', 'Wawqi', 
'["Wawqi", "Turi", "Pani", "Ñaña"]'),

(5, 'multiple_choice', 'Una mujer dice "hermana" como:', 'Ñaña', 
'["Ñaña", "Pani", "Wawqi", "Turi"]'),

-- Ejercicios Unidad 3: Números
(7, 'multiple_choice', '¿Cuánto es "Iskay"?', '2', 
'["2", "1", "3", "5"]'),

(7, 'multiple_choice', '¿Cómo se dice "5" en Quechua?', 'Pichqa', 
'["Pichqa", "Tawa", "Kimsa", "Suqta"]'),

(7, 'drag_words', 'Ordena del 1 al 3', 'Huk, Iskay, Kimsa', 
'["Huk", "Iskay", "Kimsa", "Tawa"]'),

(8, 'multiple_choice', '¿Cuánto es "Chunka"?', '10', 
'["10", "7", "8", "9"]'),

(8, 'multiple_choice', '¿Cómo se dice "7"?', 'Qanchis', 
'["Qanchis", "Suqta", "Pusaq", "Isqun"]'),

-- Ejercicios Unidad 4: Colores
(10, 'multiple_choice', '¿De qué color es "Puka"?', 'Rojo', 
'["Rojo", "Azul", "Verde", "Amarillo"]'),

(10, 'multiple_choice', '¿Cómo se dice "amarillo"?', 'Q''illu', 
'["Q''illu", "Puka", "Anqas", "Q''umir"]'),

(11, 'multiple_choice', '¿Qué color es "Yana"?', 'Negro', 
'["Negro", "Blanco", "Verde", "Azul"]'),

(11, 'drag_words', 'El color de la nieve es ___', 'Yuraq', 
'["Yuraq", "Yana", "Q''umir", "Puka"]'),

-- Ejercicios Unidad 5: Animales
(13, 'multiple_choice', '¿Cómo se dice "perro" en Quechua?', 'Allqu', 
'["Allqu", "Michi", "Llama", "Kuntur"]'),

(14, 'multiple_choice', '¿Qué animal es el "Kuntur"?', 'Cóndor', 
'["Cóndor", "Puma", "Zorro", "Oso"]'),

(14, 'multiple_choice', 'El "Puma" simboliza:', 'Fuerza', 
'["Fuerza", "Sabiduría", "Velocidad", "Paz"]'),

(15, 'drag_words', 'El ___ vive en el río', 'Challwa', 
'["Challwa", "Kuntur", "Wallpa", "Pisqu"]'),

-- Ejercicios Unidad 6: Comida
(16, 'multiple_choice', '¿Cómo se dice "maíz"?', 'Sara', 
'["Sara", "Papa", "Kinuwa", "Uqa"]'),

(16, 'multiple_choice', '¿Qué es "Kinuwa"?', 'Quinua', 
'["Quinua", "Papa", "Maíz", "Frijol"]'),

(17, 'multiple_choice', '¿Qué significa "Uchu"?', 'Ají', 
'["Ají", "Tomate", "Frijol", "Papa"]'),

-- Ejercicios Unidad 7: Naturaleza
(19, 'multiple_choice', '¿Cómo se dice "sol"?', 'Inti', 
'["Inti", "Killa", "Qucha", "Mayu"]'),

(20, 'multiple_choice', '¿Qué significa "Para"?', 'Lluvia', 
'["Lluvia", "Nieve", "Viento", "Sol"]'),

(20, 'drag_words', 'Hace frío = Pacha ___', 'Chiri', 
'["Chiri", "Ruphay", "Wayra", "Para"]'),

(21, 'multiple_choice', '¿Cómo se dice "montaña"?', 'Urqu', 
'["Urqu", "Mayu", "Qucha", "Sach''a"]'),

-- Ejercicios Unidad 8: Cuerpo
(22, 'multiple_choice', '¿Qué parte del cuerpo es "Uma"?', 'Cabeza', 
'["Cabeza", "Mano", "Pie", "Ojo"]'),

(22, 'multiple_choice', '¿Cómo se dice "ojo"?', 'Ñawi', 
'["Ñawi", "Rinri", "Sinqa", "Simi"]'),

(23, 'multiple_choice', '¿Qué significa "Maki"?', 'Mano', 
'["Mano", "Pie", "Cabeza", "Corazón"]'),

(24, 'multiple_choice', '¿Qué verbo es "Mikuy"?', 'Comer', 
'["Comer", "Dormir", "Caminar", "Mirar"]'),

(24, 'drag_words', 'Voy a ___ (dormir)', 'Puñuy', 
'["Puñuy", "Mikuy", "Puriy", "Uyariy"]');

-- =====================================================
-- EJERCICIOS - AYMARA
-- =====================================================
INSERT INTO ejercicios (leccion_id, tipo, pregunta, respuesta_correcta, opciones) VALUES
(25, 'multiple_choice', '¿Cómo se saluda en Aymara?', 'Kamisaki', 
'["Kamisaki", "Waliki", "Janiwa", "Ukhamaraki"]'),

(25, 'multiple_choice', '¿Qué significa "Waliki"?', 'Estoy bien', 
'["Estoy bien", "Buenos días", "Hola", "Adiós"]'),

(27, 'multiple_choice', '¿Cómo se dice "madre" en Aymara?', 'Tayka', 
'["Tayka", "Awki", "Awicha", "Imilla"]'),

(29, 'multiple_choice', '¿Cuánto es "Paya"?', '2', 
'["2", "1", "3", "4"]'),

(29, 'multiple_choice', '¿Cómo se dice "10" en Aymara?', 'Tunka', 
'["Tunka", "Phisqa", "Paqallqu", "Suxta"]'),

(30, 'multiple_choice', '¿Qué color es "Wila"?', 'Rojo', 
'["Rojo", "Azul", "Verde", "Blanco"]'),

(30, 'multiple_choice', '¿Cómo se dice "blanco"?', 'Janq''u', 
'["Janq''u", "Ch''iyara", "Larama", "Wila"]'),

(31, 'multiple_choice', '¿Cómo se dice "llama" en Aymara?', 'Qawra', 
'["Qawra", "Allpachu", "Kunturi", "Anu"]'),

(32, 'multiple_choice', '¿Qué alimento es "Ch''uqi"?', 'Papa', 
'["Papa", "Maíz", "Quinua", "Ají"]'),

(32, 'multiple_choice', '¿Cómo se dice "agua"?', 'Uma', 
'["Uma", "Jupha", "Tunqu", "Jallpa"]');

-- =====================================================
-- INSIGNIAS (GAMIFICACIÓN)
-- =====================================================
INSERT INTO insignias (nombre, descripcion, icono_url, condicion) VALUES
('Primer Paso', 'Completaste tu primera lección', '🎯', 'complete_first_lesson'),
('Explorador de Saludos', 'Dominaste la unidad de saludos', '👋', 'complete_unit_1'),
('Guardián del Ayllu', 'Aprendiste todo sobre la familia', '👨‍👩‍👧‍👦', 'complete_unit_2'),
('Maestro de Números', 'Dominas los números del 1 al 20', '🔢', 'complete_unit_3'),
('Artista de Colores', 'Conoces todos los colores', '🎨', 'complete_unit_4'),
('Amigo de los Animales', 'Aprendiste los animales andinos', '🦙', 'complete_unit_5'),
('Chef Andino', 'Dominas el vocabulario de comidas', '🌽', 'complete_unit_6'),
('Hijo del Sol', 'Completaste la unidad de naturaleza', '🌄', 'complete_unit_7'),
('Conocedor del Cuerpo', 'Aprendiste las partes del cuerpo', '🧍', 'complete_unit_8'),
('Racha de Fuego', 'Estudiaste 7 días seguidos', '🔥', 'streak_7_days'),
('Racha Legendaria', 'Estudiaste 30 días seguidos', '⚡', 'streak_30_days'),
('Bilingüe', 'Estudias Quechua y Aymara', '🌎', 'study_both_languages'),
('Perfeccionista', 'Obtuviste 100% en una lección', '⭐', 'perfect_lesson'),
('Sabio Andino', 'Completaste todas las unidades', '🏆', 'complete_all_units'),
('Guardián Cultural', 'Leíste 10 contenidos culturales', '📚', 'read_10_culture');

-- =====================================================
-- CONTENIDO CULTURAL
-- =====================================================
INSERT INTO contenido_cultural (tipo, idioma, titulo, contenido_original, traduccion, imagen_url) VALUES
-- Proverbios Quechua
('proverbio', 'quechua', 'Ama Sua, Ama Llulla, Ama Quella', 
'Ama Sua, Ama Llulla, Ama Quella', 
'No robes, No mientas, No seas perezoso. Los tres mandamientos incas que guían la vida moral andina.', 
'🏔️'),

('proverbio', 'quechua', 'Sobre el trabajo', 
'Llamk''ayqa kawsaymi', 
'El trabajo es vida. Refleja la importancia del trabajo comunitario en la cultura andina.', 
'💪'),

('proverbio', 'quechua', 'Sobre la unidad', 
'Huk makillawan mana atinichu', 
'Con una sola mano no se puede. Enfatiza la importancia de la comunidad y el trabajo en equipo.', 
'🤝'),

('proverbio', 'quechua', 'Sobre la sabiduría', 
'Yachayqa qullqimanta aswan chaniyuq', 
'El conocimiento vale más que el dinero.', 
'📖'),

('proverbio', 'quechua', 'Sobre la Pachamama', 
'Pachamamanchisqa kawsaqmi', 
'Nuestra Madre Tierra está viva. Expresa el respeto por la naturaleza.', 
'🌍'),

-- Adivinanzas Quechua
('adivinanza', 'quechua', 'Adivinanza del cielo', 
'Imasmari, imasmari? Tutapi rikukun, punchaypi chinkan.', 
'¿Qué será, qué será? De noche se ve, de día desaparece. (Las estrellas)', 
'⭐'),

('adivinanza', 'quechua', 'Adivinanza del maíz', 
'Imasmari? Sach''api wiñan, p''achayuq, uma q''illuyuq.', 
'¿Qué será? Crece en planta, tiene ropa, cabeza amarilla. (El maíz)', 
'🌽'),

('adivinanza', 'quechua', 'Adivinanza del río', 
'Puriq mana sayk''uspa, parlan mana simiyniyuq.', 
'Camina sin cansarse, habla sin tener boca. (El río)', 
'🌊'),

-- Proverbios Aymara
('proverbio', 'aymara', 'Janiw tukuskanti', 
'Janiw tukuskanti qhipharuxa', 
'No termines de comer para mañana. Aprovecha las oportunidades del presente.', 
'🌅'),

('proverbio', 'aymara', 'Sobre la comunidad', 
'Maynin mayniw jiwasax sapxaraktanxa', 
'Unidos somos fuertes, separados caemos.', 
'🤲'),

-- Cuentos cortos
('cuento', 'quechua', 'El Cóndor y el Zorro', 
'Huk p''unchay kunturwan añaswan tupanakurqanku. Kunturqa hanaq pachaman pawaspa kawsarqan, añastaq kay pachapi purispa.', 
'Un día el cóndor y el zorro se encontraron. El cóndor vivía volando en el cielo, mientras el zorro caminaba por la tierra. Esta historia enseña sobre la diversidad y el respeto.', 
'🦅'),

('cuento', 'quechua', 'La Quinua Sagrada', 
'Ñawpa pachaqa kinuwata Pachamamaq churin karqan. Payqa runata qallpata qurqan, kallpata qurqan.', 
'En tiempos antiguos, la quinua era hija de la Pachamama. Ella daba fuerza y energía a las personas.', 
'🌾'),

-- Canciones tradicionales (fragmentos)
('cancion', 'quechua', 'Valicha', 
'Valicha, Valichita, urqupi t''ika, mayupi sisa, sonqoypi k''anchay.', 
'Valicha, Valichita, flor de la montaña, flor del río, luz de mi corazón. (Canción tradicional cusqueña)', 
'🎵'),

('cancion', 'aymara', 'Canto a la Pachamama', 
'Pachamama, taykasa, qamaw jakaña churista.', 
'Pachamama, madre nuestra, tú nos das la vida. (Canto ceremonial)', 
'🎶');

-- =====================================================
-- VERIFICACIÓN
-- =====================================================
-- Ejecuta estas consultas para verificar la inserción:
-- SELECT COUNT(*) as total_unidades FROM unidades;
-- SELECT COUNT(*) as total_lecciones FROM lecciones;
-- SELECT COUNT(*) as total_vocabulario FROM vocabulario;
-- SELECT COUNT(*) as total_ejercicios FROM ejercicios;
-- SELECT COUNT(*) as total_insignias FROM insignias;
-- SELECT COUNT(*) as total_cultura FROM contenido_cultural;
