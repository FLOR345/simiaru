-- Contenido de SimiAru (sin datos de personas), generado con: npm run db:content
-- Generado: 2026-10-29T16:12:39.937Z
-- Aviso: parte del vocabulario aymara proviene de diccionarios del Ministerio de Educación de Chile;
-- su licencia de redistribución está pendiente de confirmar (ver README).

BEGIN;

-- unidades: 12 filas
INSERT INTO unidades ("id", "numero", "nombre", "descripcion", "idioma", "orden", "icono_url") VALUES
(16, 1, 'Napaykuna', 'Saludos y presentaciones basicas en Quechua', 'quechua', 1, '👋'),
(17, 2, 'Ayllu', 'La familia y relaciones familiares', 'quechua', 2, '👨‍👩‍👧‍👦'),
(18, 3, 'Yupana', 'Numeros y conteo del 1 al 20', 'quechua', 3, '🔢'),
(19, 4, 'Llinphikuna', 'Los colores en Quechua', 'quechua', 4, '🎨'),
(20, 5, 'Uywakuna', 'Animales de los Andes', 'quechua', 5, '🦙'),
(21, 6, 'Mikhuna', 'Comidas y alimentos andinos', 'quechua', 6, '🌽'),
(25, 1, 'Aruntanaka', 'Saludos y presentaciones en Aymara', 'aymara', 1, '👋'),
(26, 2, 'Jatha', 'La familia en Aymara', 'aymara', 2, '👨‍👩‍👧‍👦'),
(27, 3, 'Jakhu', 'Numeros y conteo del 1 al 10', 'aymara', 3, '🔢'),
(28, 4, 'Samikuna', 'Los colores en Aymara', 'aymara', 4, '🎨'),
(29, 5, 'Uywanaka', 'Animales andinos', 'aymara', 5, '🦙'),
(30, 6, 'Manqa', 'Comidas tradicionales', 'aymara', 6, '🌽')
ON CONFLICT DO NOTHING;
SELECT setval(pg_get_serial_sequence('unidades', 'id'), COALESCE((SELECT MAX(id) FROM unidades), 1));

-- lecciones: 26 filas
INSERT INTO lecciones ("id", "unidad_id", "numero", "titulo", "contenido_teorico", "orden") VALUES
(11, 16, 1, 'Saludos del dia', 'En Quechua, los saludos varian segun el momento del dia. Allillanchu es el saludo mas comun y significa Como estas. La respuesta es Allillanmi (Estoy bien).', 1),
(12, 16, 2, 'Presentaciones personales', 'Para presentarte en Quechua usamos la estructura: Nombre-mi sutiy que significa Mi nombre es.', 2),
(13, 16, 3, 'Despedidas', 'Las despedidas en Quechua: Tupananchikkama - Hasta que nos volvamos a encontrar. Ratukama - Hasta pronto.', 3),
(14, 17, 1, 'Padres y abuelos', 'La familia es el centro de la cultura andina. Tayta (Padre), Mama (Madre), Hatun tayta (Abuelo), Hatun mama (Abuela).', 1),
(15, 17, 2, 'Hermanos e hijos', 'Wawqi (Hermano, dicho por hombre), Turi (Hermano, dicho por mujer), Pani (Hermana, dicho por hombre), Churi (Hijo/a).', 2),
(16, 18, 1, 'Numeros del 1 al 5', 'Huk (1), Iskay (2), Kimsa (3), Tawa (4), Pichqa (5).', 1),
(17, 18, 2, 'Numeros del 6 al 10', 'Suqta (6), Qanchis (7), Pusaq (8), Isqun (9), Chunka (10).', 2),
(18, 19, 1, 'Colores primarios', 'Puka (Rojo), Qillu (Amarillo), Anqas (Azul).', 1),
(19, 19, 2, 'Colores de la naturaleza', 'Qumir (Verde), Yana (Negro), Yuraq (Blanco).', 2),
(20, 20, 1, 'Animales domesticos', 'Llama, Alpaka (Alpaca), Allqu (Perro), Michi (Gato).', 1),
(21, 20, 2, 'Animales silvestres', 'Kuntur (Condor), Puma, Anas (Zorro), Ukuku (Oso andino).', 2),
(22, 21, 1, 'Tuberculos y granos', 'Papa, Sara (Maiz), Kinuwa (Quinua).', 1),
(23, 21, 2, 'Frutas y verduras', 'Pallar (Frijol), Uchu (Aji).', 2),
(25, 25, 1, 'Saludos basicos', 'En Aymara, Kamisaki significa Como estas y Waliki significa Estoy bien. Aski urukipan es Buenos dias.', 1),
(26, 25, 2, 'Presentaciones', 'Para presentarte dices Nayan sutija seguido de tu nombre. Para preguntar el nombre dices Kunasa sutima.', 2),
(27, 25, 3, 'Despedidas', 'Jakisiñkama significa Hasta luego. Qharurukama es Hasta manana. Yuspajaray es Gracias.', 3),
(28, 26, 1, 'Padres y abuelos', 'Awki significa Padre, Tayka es Madre. Achachila es Abuelo y Awicha es Abuela.', 1),
(29, 26, 2, 'Hermanos e hijos', 'Jila es Hermano mayor, Sullka es Hermano menor. Yuqalla es Hijo varon e Imilla es Hija mujer.', 2),
(30, 27, 1, 'Numeros del 1 al 5', 'Maya (1), Paya (2), Kimsa (3), Pusi (4), Phisqa (5).', 1),
(31, 27, 2, 'Numeros del 6 al 10', 'Suxta (6), Paqallqu (7), Kimsaqallqu (8), Llatunka (9), Tunka (10).', 2),
(32, 28, 1, 'Colores basicos', 'Wila (Rojo), Qillu (Amarillo), Larama (Azul), Chuxna (Verde).', 1),
(33, 28, 2, 'Mas colores', 'Chiyara (Negro), Janqu (Blanco), Chumpi (Marron).', 2),
(34, 29, 1, 'Animales domesticos', 'Qawra (Llama), Allpachu (Alpaca), Anu (Perro), Phisi (Gato).', 1),
(35, 29, 2, 'Animales silvestres', 'Kunturi (Condor), Puma, Qamaqi (Zorro), Jukumari (Oso andino).', 2),
(36, 30, 1, 'Alimentos basicos', 'Chuqi (Papa), Tunqu (Maiz), Jupha (Quinua), Uma (Agua).', 1),
(37, 30, 2, 'Mas alimentos', 'Aycha (Carne), Challwa (Pescado), Tanta (Pan), Jallpa (Aji).', 2)
ON CONFLICT DO NOTHING;
SELECT setval(pg_get_serial_sequence('lecciones', 'id'), COALESCE((SELECT MAX(id) FROM lecciones), 1));

-- vocabulario: 1503 filas
INSERT INTO vocabulario ("id", "leccion_id", "palabra_espanol", "palabra_objetivo", "audio_url", "categoria", "ejemplo_uso") VALUES
(81, 14, 'Padre, señor, papá', 'Tata', NULL, 'familia', NULL),
(82, 14, 'Madre, mamá, señora', 'Mama', NULL, 'familia', NULL),
(83, 14, 'Abuelo', 'Jatun tata', NULL, 'familia', NULL),
(84, 14, 'Abuela', 'Jatun mama', NULL, 'familia', NULL),
(85, 14, 'Anciano, tratamiento respetuoso', 'Awki', NULL, 'familia', NULL),
(86, 14, 'Hombre mayor, viejo', 'Machu', NULL, 'familia', NULL),
(87, 14, 'Familia, pariente', 'Yawar masi', NULL, 'familia', NULL),
(88, 14, 'Comunidad, familia extendida', 'Ayllu', NULL, 'familia', NULL),
(89, 14, 'Autoridad de la comunidad', 'Kuraka', NULL, 'familia', NULL),
(90, 14, 'Esposa de la autoridad', 'Mama t''alla', NULL, 'familia', NULL),
(91, 14, 'Tía', 'Ipa', NULL, 'familia', NULL),
(92, 14, 'Tío', 'Kaka', NULL, 'familia', NULL),
(93, 14, 'Yerno', 'Tullqa', NULL, 'familia', NULL),
(94, 14, 'Nuera', 'Ñuqch''a', NULL, 'familia', NULL),
(95, 14, 'Esposo, marido', 'Qusa', NULL, 'familia', NULL),
(96, 14, 'Mujer, esposa', 'Warmi', NULL, 'familia', NULL),
(97, 14, 'Varón, hombre', 'Qhari', NULL, 'familia', NULL),
(98, 14, 'Casarse', 'Sawakuy', NULL, 'familia', NULL),
(99, 14, 'Matrimonio', 'Sawa', NULL, 'familia', NULL),
(100, 14, 'Matrimonio', 'Warmichakuy', NULL, 'familia', NULL),
(101, 14, 'Matrimonio', 'Qharichakuy', NULL, 'familia', NULL),
(102, 14, 'Matrimonio', 'Yanachakuy', NULL, 'familia', NULL),
(103, 14, 'Novio', 'Yanay', NULL, 'familia', NULL),
(104, 14, 'Pedir la mano', 'Maki mañay', NULL, 'familia', NULL),
(105, 14, 'Amigo, compañero', 'Masi', NULL, 'familia', NULL),
(106, 14, 'Hermandad', 'Masichay', NULL, 'familia', NULL),
(109, 15, 'Hermana (dicho por mujer)', 'Ñaña', NULL, 'familia', NULL),
(110, 15, 'Hermana (dicho por hombre)', 'Pana', NULL, 'familia', NULL),
(112, 15, 'Menor', 'Sullk''a', NULL, 'familia', NULL),
(113, 15, 'Hijo', 'Churi', NULL, 'familia', NULL),
(114, 15, 'Hija', 'Ususi', NULL, 'familia', NULL),
(115, 15, 'Hijo varón', 'Qhari wawa', NULL, 'familia', NULL),
(116, 15, 'Primogénito', 'Ñawpa churi', NULL, 'familia', NULL),
(117, 15, 'Niño pequeño, bebé', 'Wawa', NULL, 'familia', NULL),
(118, 15, 'Nieto', 'Allchhi', NULL, 'familia', NULL),
(119, 15, 'Niño, muchacho', 'Irqi', NULL, 'familia', NULL),
(120, 15, 'Muchacha, niña', 'Imilla', NULL, 'familia', NULL),
(121, 15, 'Muchacha, niña', 'Ch''ira', NULL, 'familia', NULL),
(122, 15, 'Niño pequeño', 'Ch''iti', NULL, 'familia', NULL),
(123, 15, 'Joven, adolescente', 'Maqt''a', NULL, 'familia', NULL),
(124, 15, 'Hombre joven', 'Wayna', NULL, 'familia', NULL),
(125, 15, 'Señorita, mujer joven', 'Sipas', NULL, 'familia', NULL),
(126, 15, 'Púber, adolescente', 'Lluqhalla', NULL, 'familia', NULL),
(127, 15, 'Princesa', 'Ñust''a', NULL, 'familia', NULL),
(128, 15, 'Reina, mujer del inca', 'Quya', NULL, 'familia', NULL),
(129, 15, 'Soberano, monarca', 'Inka', NULL, 'familia', NULL),
(130, 15, 'Huérfano, pobre', 'Waqcha', NULL, 'familia', NULL),
(131, 15, 'Persona alta, gigante', 'Jatun runa', NULL, 'familia', NULL),
(132, 15, 'Persona baja', 'Juch''uy runa', NULL, 'familia', NULL),
(133, 15, 'Persona', 'Jaqi', NULL, 'familia', NULL),
(134, 15, 'Vida', 'Kawsana', NULL, 'familia', NULL),
(135, 15, 'Vivir', 'Kawsay', NULL, 'familia', NULL),
(136, 15, 'Vivo', 'Kawsasqa', NULL, 'familia', NULL),
(137, 15, 'Nacer, amanecer', 'Paqariy', NULL, 'familia', NULL),
(138, 15, 'Nacimiento', 'Paqarina', NULL, 'familia', NULL),
(139, 15, 'Crecer, eterno', 'Wiñay', NULL, 'familia', NULL),
(140, 15, 'Morir, muerte', 'Wañuy', NULL, 'familia', NULL),
(141, 15, 'Difunto, muerto', 'Wañusqa', NULL, 'familia', NULL),
(142, 15, 'Difunto, cadáver', 'Aya', NULL, 'familia', NULL),
(143, 15, 'Embarazada', 'Chichu', NULL, 'familia', NULL),
(144, 15, 'Parir, dar a luz', 'Wachay', NULL, 'familia', NULL),
(145, 15, 'Matrona', 'Wachachiq', NULL, 'familia', NULL),
(146, 15, 'Feto', 'Sullu', NULL, 'familia', NULL),
(147, 15, 'Abortar', 'Sulluy', NULL, 'familia', NULL),
(148, 15, 'Criatura recién nacida', 'Uña wawa', NULL, 'familia', NULL),
(149, 15, 'Niño desnutrido', 'Tullu wawa', NULL, 'familia', NULL),
(150, 16, 'Uno', 'Uj', NULL, 'numeros', NULL),
(151, 16, 'Dos', 'Iskay', NULL, 'numeros', NULL),
(152, 16, 'Tres', 'Kinsa', NULL, 'numeros', NULL),
(153, 16, 'Cuatro', 'Tawa', NULL, 'numeros', NULL),
(154, 16, 'Cinco', 'Phishqa', NULL, 'numeros', NULL),
(155, 16, 'Primero', 'Uj ñiqi', NULL, 'numeros', NULL),
(156, 16, 'Contar, enumerar', 'Yupay', NULL, 'numeros', NULL),
(157, 16, 'Número', 'Yupana', NULL, 'numeros', NULL),
(158, 16, 'Medir', 'Tupuy', NULL, 'numeros', NULL),
(159, 16, 'Medida', 'Tupu', NULL, 'numeros', NULL),
(160, 16, 'Ambos, par', 'Iskaynin', NULL, 'numeros', NULL),
(161, 16, 'Impar', 'Ch''ulla', NULL, 'numeros', NULL),
(162, 16, 'Mitad, medio', 'Kuskan', NULL, 'numeros', NULL),
(163, 16, 'Centro, medio', 'Chawpi', NULL, 'numeros', NULL),
(164, 16, 'Todo, íntegro, total', 'Tukuy', NULL, 'numeros', NULL),
(165, 16, 'Solo, cada uno', 'Sapa', NULL, 'numeros', NULL),
(166, 16, 'Único', 'Sapalla', NULL, 'numeros', NULL),
(167, 16, 'Unidad', 'Ujlla', NULL, 'numeros', NULL),
(168, 16, 'Poco, escaso', 'Pisi', NULL, 'numeros', NULL),
(169, 16, 'Mucho, demasiado', 'Ancha', NULL, 'numeros', NULL),
(170, 16, 'Mucho, abundante', 'Ashkha', NULL, 'numeros', NULL),
(171, 16, 'Más', 'Astawan', NULL, 'numeros', NULL),
(172, 16, 'Además', 'Astawanpis', NULL, 'numeros', NULL),
(173, 16, 'Tanto', 'Chhika', NULL, 'numeros', NULL),
(174, 16, 'Un poco', 'Tumpa', NULL, 'numeros', NULL),
(175, 16, 'Puñado', 'Phuqtu', NULL, 'numeros', NULL),
(176, 16, 'Brazada', 'Marq''a', NULL, 'numeros', NULL),
(177, 16, 'Jeme (medida)', 'Jimi', NULL, 'numeros', NULL),
(178, 16, 'Palmo, cuarta', 'T''aqlla', NULL, 'numeros', NULL),
(179, 16, 'Paso (medida)', 'Thaski', NULL, 'numeros', NULL),
(180, 16, 'Metro', 'Thatki', NULL, 'numeros', NULL),
(181, 17, 'Seis', 'Suqta', NULL, 'numeros', NULL),
(182, 17, 'Siete', 'Qanchis', NULL, 'numeros', NULL),
(183, 17, 'Ocho', 'Pusaq', NULL, 'numeros', NULL),
(184, 17, 'Nueve', 'Isqun', NULL, 'numeros', NULL),
(185, 17, 'Diez', 'Chunka', NULL, 'numeros', NULL),
(186, 17, 'Once', 'Chunka ujniyuq', NULL, 'numeros', NULL),
(187, 17, 'Doce', 'Chunka iskayniyuq', NULL, 'numeros', NULL),
(188, 17, 'Trece', 'Chunka kinsayuq', NULL, 'numeros', NULL),
(189, 17, 'Catorce', 'Chunka tawayuq', NULL, 'numeros', NULL),
(190, 17, 'Quince', 'Chunka phishqayuq', NULL, 'numeros', NULL),
(191, 17, 'Dieciséis', 'Chunka suqtayuq', NULL, 'numeros', NULL),
(192, 17, 'Diecisiete', 'Chunka qanchisniyuq', NULL, 'numeros', NULL),
(193, 17, 'Dieciocho', 'Chunka pusaqniyuq', NULL, 'numeros', NULL),
(194, 17, 'Diecinueve', 'Chunka isqunniyuq', NULL, 'numeros', NULL),
(195, 17, 'Veinte', 'Iskay chunka', NULL, 'numeros', NULL),
(196, 17, 'Veintiuno', 'Iskay chunka ujniyuq', NULL, 'numeros', NULL),
(197, 17, 'Veintidós', 'Iskay chunka iskayniyuq', NULL, 'numeros', NULL),
(198, 17, 'Treinta', 'Kinsa chunka', NULL, 'numeros', NULL),
(199, 17, 'Cuarenta', 'Tawa chunka', NULL, 'numeros', NULL),
(200, 17, 'Cincuenta', 'Phishqa chunka', NULL, 'numeros', NULL),
(201, 17, 'Sesenta', 'Suqta chunka', NULL, 'numeros', NULL),
(202, 17, 'Setenta', 'Qanchis chunka', NULL, 'numeros', NULL),
(203, 17, 'Ochenta', 'Pusaq chunka', NULL, 'numeros', NULL),
(204, 17, 'Noventa', 'Isqun chunka', NULL, 'numeros', NULL),
(205, 17, 'Cien', 'Pachaq', NULL, 'numeros', NULL),
(206, 17, 'Doscientos', 'Iskay pachaq', NULL, 'numeros', NULL),
(207, 17, 'Trescientos', 'Kinsa pachaq', NULL, 'numeros', NULL),
(208, 17, 'Cuatrocientos', 'Tawa pachaq', NULL, 'numeros', NULL),
(209, 17, 'Quinientos', 'Phishqa pachaq', NULL, 'numeros', NULL),
(210, 17, 'Seiscientos', 'Suqta pachaq', NULL, 'numeros', NULL),
(211, 17, 'Setecientos', 'Qanchis pachaq', NULL, 'numeros', NULL),
(212, 17, 'Ochocientos', 'Pusaq pachaq', NULL, 'numeros', NULL),
(213, 17, 'Novecientos', 'Isqun pachaq', NULL, 'numeros', NULL),
(214, 17, 'Mil', 'Waranqa', NULL, 'numeros', NULL),
(215, 17, 'Diez mil', 'Chunka waranqa', NULL, 'numeros', NULL),
(216, 17, 'Cien mil', 'Pachaq waranqa', NULL, 'numeros', NULL),
(217, 17, 'Millón', 'Junu', NULL, 'numeros', NULL),
(218, 17, 'Siglo', 'Pachaq wata', NULL, 'numeros', NULL),
(219, 17, 'Triángulo', 'Kinsa k''uchu', NULL, 'numeros', NULL),
(220, 17, 'Cuadrado', 'Tawa k''uchu', NULL, 'numeros', NULL),
(221, 17, 'Tricolor', 'Kinsa llimp''iyuq', NULL, 'numeros', NULL),
(222, 17, 'Esférico, redondo, bola', 'Murq''u', NULL, 'numeros', NULL),
(223, 17, 'Circular, redondo', 'Muyu', NULL, 'numeros', NULL),
(224, 17, 'Largo, rectángulo', 'Sayt''u', NULL, 'numeros', NULL),
(225, 17, 'Alargado, ovalado', 'Ch''uytu', NULL, 'numeros', NULL),
(226, 17, 'Plano, ancho', 'P''allta', NULL, 'numeros', NULL),
(227, 18, 'Rojo', 'Puka', NULL, 'colores', NULL),
(228, 18, 'Amarillo', 'Q''illu', NULL, 'colores', NULL),
(229, 18, 'Azul', 'Anqas', NULL, 'colores', NULL),
(230, 18, 'Verde', 'Q''umir', NULL, 'colores', NULL),
(231, 18, 'Color', 'Llimph''i', NULL, 'colores', NULL),
(232, 18, 'Colorear, pintar', 'Llimph''iy', NULL, 'colores', NULL),
(233, 18, 'Luz, brillo', 'K''anchay', NULL, 'colores', NULL),
(234, 18, 'Iluminar, brillar', 'K''anchariy', NULL, 'colores', NULL),
(235, 18, 'Resplandecer', 'Lliphlliy', NULL, 'colores', NULL),
(236, 18, 'Claro (color)', 'Lliwi', NULL, 'colores', NULL),
(237, 18, 'Oscuro', 'Ch''iyar', NULL, 'colores', NULL),
(238, 18, 'Rojizo', 'Pukapuka', NULL, 'colores', NULL),
(239, 18, 'Anaranjado', 'Q''illupuka', NULL, 'colores', NULL),
(240, 18, 'Morado, lila', 'Sani', NULL, 'colores', NULL),
(241, 18, 'Morado, violeta', 'Kulli', NULL, 'colores', NULL),
(242, 18, 'Rosado', 'Sanipuka', NULL, 'colores', NULL),
(243, 18, 'Rosado claro', 'Chupika', NULL, 'colores', NULL),
(244, 18, 'Verde claro, pradera', 'Waylla', NULL, 'colores', NULL),
(245, 18, 'Verde oscuro', 'Q''uya', NULL, 'colores', NULL),
(246, 18, 'Verde azulado', 'Anqasq''umir', NULL, 'colores', NULL),
(247, 18, 'Verde (fruta no madura)', 'Llullu', NULL, 'colores', NULL),
(248, 18, 'Humo', 'Q''usñi', NULL, 'colores', NULL),
(249, 18, 'Ceniciento', 'Sunch''u', NULL, 'colores', NULL),
(250, 18, 'Bonito (color)', 'Sumaqnin', NULL, 'colores', NULL),
(251, 18, 'Tinte', 'Tintura', NULL, 'colores', NULL),
(252, 18, 'Teñir', 'Tintuy', NULL, 'colores', NULL),
(253, 19, 'Negro', 'Yana', NULL, 'colores', NULL),
(254, 19, 'Blanco', 'Yuraq', NULL, 'colores', NULL),
(255, 19, 'Gris, plomo', 'Uqi', NULL, 'colores', NULL),
(256, 19, 'Café, marrón', 'Ch''umpi', NULL, 'colores', NULL),
(257, 19, 'Gris ceniza', 'Oqe', NULL, 'colores', NULL),
(258, 19, 'Gris (negro y blanco)', 'Yanayuraq', NULL, 'colores', NULL),
(259, 19, 'Bicolor, manchado', 'Allqa', NULL, 'colores', NULL),
(260, 19, 'Jaspeado, manchado', 'Muru', NULL, 'colores', NULL),
(261, 19, 'Reluciente, brillante', 'Ch''aska', NULL, 'colores', NULL),
(262, 19, 'Dorado (oro)', 'Quri', NULL, 'colores', NULL),
(263, 19, 'Plateado (plata)', 'Qulqi', NULL, 'colores', NULL),
(264, 19, 'Multicolor, arcoíris', 'K''uychichi', NULL, 'colores', NULL),
(265, 19, 'Arcoíris', 'K''uychi', NULL, 'colores', NULL),
(266, 19, 'Pardo, bayo', 'Chiqchi', NULL, 'colores', NULL),
(267, 19, 'Marrón rojizo', 'Oqepuka', NULL, 'colores', NULL),
(268, 19, 'Negruzco, muy negro', 'Yanayana', NULL, 'colores', NULL),
(269, 19, 'Blanquísimo', 'Yuraqyuraq', NULL, 'colores', NULL),
(270, 19, 'Blanco puro', 'Janq''u', NULL, 'colores', NULL),
(271, 19, 'Color fuego', 'Nina', NULL, 'colores', NULL),
(272, 19, 'Color llama', 'Ninaq llimph''in', NULL, 'colores', NULL),
(273, 19, 'Color estrella', 'Warawaraq llimph''in', NULL, 'colores', NULL),
(274, 19, 'Color luna (plateado)', 'Killaq llimph''in', NULL, 'colores', NULL),
(275, 19, 'Color sol (dorado)', 'Intiq llimph''in', NULL, 'colores', NULL),
(276, 19, 'Color río (azul verdoso)', 'Mayuq llimph''in', NULL, 'colores', NULL),
(277, 19, 'Color lago', 'Quchaq llimph''in', NULL, 'colores', NULL),
(278, 19, 'Color bosque', 'Sachaq llimph''in', NULL, 'colores', NULL),
(279, 19, 'Color montaña', 'Urquq llimph''in', NULL, 'colores', NULL),
(280, 19, 'Color tierra', 'Allpaq llimph''in', NULL, 'colores', NULL),
(281, 19, 'Color manantial', 'Pukyu', NULL, 'colores', NULL),
(282, 19, 'Color nube', 'Phuyuq llimph''in', NULL, 'colores', NULL),
(283, 20, 'Animal doméstico, ganado', 'Uywa', NULL, 'animales', NULL)
ON CONFLICT DO NOTHING;
INSERT INTO vocabulario ("id", "leccion_id", "palabra_espanol", "palabra_objetivo", "audio_url", "categoria", "ejemplo_uso") VALUES
(284, 20, 'Criar animales', 'Uywana', NULL, 'animales', NULL),
(285, 20, 'Llama', 'Llama', NULL, 'animales', NULL),
(286, 20, 'Alpaca', 'Paquchi', NULL, 'animales', NULL),
(287, 20, 'Vicuña', 'Wik''uña', NULL, 'animales', NULL),
(288, 20, 'Guanaco', 'Wanaku', NULL, 'animales', NULL),
(289, 20, 'Perro', 'Allqu', NULL, 'animales', NULL),
(290, 20, 'Gato', 'Michi', NULL, 'animales', NULL),
(291, 20, 'Cuy, conejillo de Indias', 'Quwi', NULL, 'animales', NULL),
(292, 20, 'Gallina', 'Wallpa', NULL, 'animales', NULL),
(293, 20, 'Gallo', 'K''anka', NULL, 'animales', NULL),
(294, 20, 'Pollito', 'Chiuchi', NULL, 'animales', NULL),
(295, 20, 'Pato', 'Patu', NULL, 'animales', NULL),
(296, 20, 'Ganso, oca', 'Wachwa', NULL, 'animales', NULL),
(297, 20, 'Paloma', 'Urpi', NULL, 'animales', NULL),
(298, 20, 'Cabra', 'Kawra', NULL, 'animales', NULL),
(299, 20, 'Oveja', 'Uwija', NULL, 'animales', NULL),
(300, 20, 'Cerdo, chancho', 'Khuchi', NULL, 'animales', NULL),
(301, 20, 'Vaca', 'Wakra', NULL, 'animales', NULL),
(302, 20, 'Toro', 'Turu', NULL, 'animales', NULL),
(303, 20, 'Ternero', 'Malta wakra', NULL, 'animales', NULL),
(304, 20, 'Caballo', 'Kawallu', NULL, 'animales', NULL),
(305, 20, 'Burro, asno', 'Asnu', NULL, 'animales', NULL),
(306, 20, 'Mula', 'Mula', NULL, 'animales', NULL),
(307, 20, 'Lana', 'Millwa', NULL, 'animales', NULL),
(308, 20, 'Cuero, piel', 'Qara', NULL, 'animales', NULL),
(309, 20, 'Nido', 'Puñu', NULL, 'animales', NULL),
(310, 20, 'Huevo', 'Runtu', NULL, 'animales', NULL),
(311, 20, 'Venado, taruca', 'Taruka', NULL, 'animales', NULL),
(312, 20, 'Pastorear', 'Michiy', NULL, 'animales', NULL),
(313, 20, 'Pastor', 'Michiq', NULL, 'animales', NULL),
(314, 20, 'Corral', 'Kancha', NULL, 'animales', NULL),
(315, 20, 'Carga (de llama)', 'Q''ipi', NULL, 'animales', NULL),
(316, 20, 'Pata', 'Chaki', NULL, 'animales', NULL),
(317, 20, 'Cola', 'Chupa', NULL, 'animales', NULL),
(318, 20, 'Cuerno', 'Waqra', NULL, 'animales', NULL),
(319, 20, 'Oreja (de animal)', 'Ninri', NULL, 'animales', NULL),
(320, 21, 'Animal silvestre, salvaje', 'K''ita', NULL, 'animales', NULL),
(321, 21, 'Cóndor', 'Kuntur', NULL, 'animales', NULL),
(322, 21, 'Puma, león de montaña', 'Puma', NULL, 'animales', NULL),
(323, 21, 'Zorro', 'Atuq', NULL, 'animales', NULL),
(324, 21, 'Oso andino', 'Ukuku', NULL, 'animales', NULL),
(325, 21, 'Oso de anteojos', 'Ukumari', NULL, 'animales', NULL),
(326, 21, 'Zorrino, mofeta', 'Añas', NULL, 'animales', NULL),
(327, 21, 'Gato montés', 'Usqullu', NULL, 'animales', NULL),
(328, 21, 'Vizcacha', 'Wisk''acha', NULL, 'animales', NULL),
(329, 21, 'Chinchilla', 'Chinchilla', NULL, 'animales', NULL),
(330, 21, 'Ratón', 'Jukucha', NULL, 'animales', NULL),
(331, 21, 'Águila', 'Anka', NULL, 'animales', NULL),
(332, 21, 'Cernícalo, halcón', 'Killinchu', NULL, 'animales', NULL),
(333, 21, 'Halcón', 'Waman', NULL, 'animales', NULL),
(334, 21, 'Búho, lechuza', 'Juku', NULL, 'animales', NULL),
(335, 21, 'Lechuza', 'Ch''usiq', NULL, 'animales', NULL),
(336, 21, 'Flamenco andino', 'Pariwana', NULL, 'animales', NULL),
(337, 21, 'Perdiz', 'Puku puku', NULL, 'animales', NULL),
(338, 21, 'Perdiz de la puna', 'Yuthu', NULL, 'animales', NULL),
(339, 21, 'Colibrí, picaflor', 'Q''inti', NULL, 'animales', NULL),
(340, 21, 'Zorzal', 'Chiwaku', NULL, 'animales', NULL),
(341, 21, 'Codorniz', 'P''isaqa', NULL, 'animales', NULL),
(342, 21, 'Jilguero', 'Chuqllu', NULL, 'animales', NULL),
(343, 21, 'Pez, pescado', 'Challwa', NULL, 'animales', NULL),
(344, 21, 'Pez del Titicaca', 'Suche', NULL, 'animales', NULL),
(345, 21, 'Lagartija', 'K''arachupa', NULL, 'animales', NULL),
(346, 21, 'Serpiente', 'Machaqway', NULL, 'animales', NULL),
(347, 21, 'Víbora', 'Katari', NULL, 'animales', NULL),
(348, 21, 'Sapo', 'Jamp''atu', NULL, 'animales', NULL),
(349, 21, 'Rana', 'K''ayra', NULL, 'animales', NULL),
(350, 21, 'Oruga', 'Muru k''uru', NULL, 'animales', NULL),
(351, 21, 'Mariposa', 'Pillpintu', NULL, 'animales', NULL),
(352, 21, 'Mosca', 'Ch''uspi', NULL, 'animales', NULL),
(353, 21, 'Mosquito', 'Chuspi', NULL, 'animales', NULL),
(354, 21, 'Abeja', 'Mama kuru', NULL, 'animales', NULL),
(355, 21, 'Abejorro', 'Wanquyru', NULL, 'animales', NULL),
(356, 21, 'Hormiga', 'Sik''imira', NULL, 'animales', NULL),
(357, 21, 'Escarabajo', 'Khuchi kuru', NULL, 'animales', NULL),
(358, 21, 'Piojo', 'Usa', NULL, 'animales', NULL),
(359, 21, 'Garrapata', 'Laq''atu', NULL, 'animales', NULL),
(360, 21, 'Pulga', 'Piki', NULL, 'animales', NULL),
(361, 21, 'Araña', 'Ch''iñi', NULL, 'animales', NULL),
(362, 21, 'Araña grande', 'Apasanka', NULL, 'animales', NULL),
(363, 21, 'Caracara andino', 'Alaqamari', NULL, 'animales', NULL),
(364, 21, 'Ave carroñera', 'Allqamari', NULL, 'animales', NULL),
(365, 22, 'Comer, comida', 'Mikhuy', NULL, 'comida', NULL),
(366, 22, 'Alimento', 'Mikhuna', NULL, 'comida', NULL),
(367, 22, 'Papa, patata', 'Papa', NULL, 'comida', NULL),
(368, 22, 'Papa deshidratada', 'Chuñu', NULL, 'comida', NULL),
(369, 22, 'Chuño blanco', 'Tunta', NULL, 'comida', NULL),
(370, 22, 'Chuño blanco fino', 'Moraya', NULL, 'comida', NULL),
(371, 22, 'Papa dulce', 'Q''ayiwa', NULL, 'comida', NULL),
(372, 22, 'Oca', 'Uqa', NULL, 'comida', NULL),
(373, 22, 'Olluco', 'Ulluku', NULL, 'comida', NULL),
(374, 22, 'Mashua, isaño', 'Añu', NULL, 'comida', NULL),
(375, 22, 'Maíz', 'Sara', NULL, 'comida', NULL),
(376, 22, 'Maíz cocido, mote', 'Mut''i', NULL, 'comida', NULL),
(377, 22, 'Choclo, maíz tierno', 'Chuqllu', NULL, 'comida', NULL),
(378, 22, 'Maíz tostado', 'Jank''a', NULL, 'comida', NULL),
(379, 22, 'Cancha, maíz tostado', 'Kamcha', NULL, 'comida', NULL),
(380, 22, 'Mazamorra de maíz', 'Api', NULL, 'comida', NULL),
(381, 22, 'Quinua', 'Kinuwa', NULL, 'comida', NULL),
(382, 22, 'Cañihua', 'Kañiwa', NULL, 'comida', NULL),
(383, 22, 'Kiwicha, amaranto', 'Kiwicha', NULL, 'comida', NULL),
(384, 22, 'Tarwi, chocho', 'Tarwi', NULL, 'comida', NULL),
(385, 22, 'Frijol', 'Purutu', NULL, 'comida', NULL),
(386, 22, 'Pallar, haba grande', 'Pallar', NULL, 'comida', NULL),
(387, 22, 'Haba', 'Jawas', NULL, 'comida', NULL),
(388, 22, 'Arveja', 'Alwirja', NULL, 'comida', NULL),
(389, 22, 'Maní', 'Mani', NULL, 'comida', NULL),
(390, 22, 'Pan', 'T''anta', NULL, 'comida', NULL),
(391, 22, 'Harina', 'Jak''u', NULL, 'comida', NULL),
(392, 22, 'Sopa espesa', 'Lawa', NULL, 'comida', NULL),
(393, 22, 'Caldo claro', 'Ch''uwa', NULL, 'comida', NULL),
(394, 22, 'Ají', 'Uchu', NULL, 'comida', NULL),
(395, 22, 'Guiso, comida cocinada', 'Wayk''u', NULL, 'comida', NULL),
(396, 22, 'Cocinar', 'Wayk''uy', NULL, 'comida', NULL),
(397, 22, 'Asado', 'Kanka', NULL, 'comida', NULL),
(398, 22, 'Asar', 'Kankay', NULL, 'comida', NULL),
(399, 22, 'Hervido, sancochado', 'Thimpu', NULL, 'comida', NULL),
(400, 22, 'Sal', 'Kachi', NULL, 'comida', NULL),
(401, 22, 'Dulce, azúcar', 'Misk''i', NULL, 'comida', NULL),
(402, 22, 'Grasa, manteca', 'Wira', NULL, 'comida', NULL),
(403, 22, 'Harina tostada', 'Aku', NULL, 'comida', NULL),
(404, 22, 'Harina de cebada tostada', 'Pitu', NULL, 'comida', NULL),
(405, 23, 'Fruta, fruto', 'Ruru', NULL, 'comida', NULL),
(406, 23, 'Verdura', 'Q''umir yuyu', NULL, 'comida', NULL),
(407, 23, 'Hierba comestible, hortaliza', 'Yuyu', NULL, 'comida', NULL),
(408, 23, 'Chirimoya', 'Chirimoya', NULL, 'comida', NULL),
(409, 23, 'Tumbo', 'Tumpu', NULL, 'comida', NULL),
(410, 23, 'Papaya', 'Papaya', NULL, 'comida', NULL),
(411, 23, 'Palta, aguacate', 'Palta', NULL, 'comida', NULL),
(412, 23, 'Lúcuma', 'Lúkuma', NULL, 'comida', NULL),
(413, 23, 'Pacay, guaba', 'Pacay', NULL, 'comida', NULL),
(414, 23, 'Guayaba', 'Sawintu', NULL, 'comida', NULL),
(415, 23, 'Calabaza', 'P''uruña', NULL, 'comida', NULL),
(416, 23, 'Zapallo', 'Sapallu', NULL, 'comida', NULL),
(417, 23, 'Lacayote', 'Lakawiti', NULL, 'comida', NULL),
(418, 23, 'Zanahoria', 'Sanurya', NULL, 'comida', NULL),
(419, 23, 'Calabacín', 'Sikwas', NULL, 'comida', NULL),
(420, 23, 'Zapallito', 'Chuqllururu', NULL, 'comida', NULL),
(421, 23, 'Alga, cochayuyo', 'Quchayuyu', NULL, 'comida', NULL),
(422, 23, 'Tomate', 'Tumatiq', NULL, 'comida', NULL),
(423, 23, 'Ají dulce, pimiento', 'Sipas uchu', NULL, 'comida', NULL),
(424, 23, 'Rocoto', 'Rukutu', NULL, 'comida', NULL),
(425, 23, 'Ají molido', 'Llipht''a', NULL, 'comida', NULL),
(426, 23, 'Chicha de maíz', 'Aqha', NULL, 'comida', NULL),
(427, 23, 'Agua', 'Yaku', NULL, 'comida', NULL),
(428, 23, 'Agua (variante)', 'Unu', NULL, 'comida', NULL),
(429, 23, 'Leche', 'Ñuñu', NULL, 'comida', NULL),
(430, 23, 'Beber, tomar', 'Upyay', NULL, 'comida', NULL),
(431, 23, 'Hambre', 'Yarqay', NULL, 'comida', NULL),
(432, 23, 'Sed', 'Ch''akiy', NULL, 'comida', NULL),
(433, 23, 'Saciarse, llenarse', 'Saksay', NULL, 'comida', NULL),
(434, 23, 'Endulzar', 'Misk''iy', NULL, 'comida', NULL),
(435, 23, 'Oler, olfatear', 'Q''apay', NULL, 'comida', NULL),
(436, 23, 'Probar, saborear', 'Malliy', NULL, 'comida', NULL),
(437, 23, 'Sabor', 'Malliq', NULL, 'comida', NULL),
(438, 23, 'Masticar', 'Khalluy', NULL, 'comida', NULL),
(439, 23, 'Tragar', 'Millp''uy', NULL, 'comida', NULL),
(440, 23, 'Hornear', 'P''anpay', NULL, 'comida', NULL),
(441, 23, 'Servir comida', 'Chayachiy', NULL, 'comida', NULL),
(442, 23, 'Servir, repartir', 'Qaruy', NULL, 'comida', NULL),
(443, 23, 'Rodilla de cuy asado', 'Qunqur', NULL, 'comida', NULL),
(444, 23, 'Pachamanca, comida en tierra', 'Pachamanka', NULL, 'comida', NULL),
(445, 23, 'Huatia, papa al horno', 'Watia', NULL, 'comida', NULL),
(446, 23, 'Cocido en olla de barro', 'Qhaway', NULL, 'comida', NULL),
(577, 30, 'Uno', 'Maya', NULL, 'numeros', NULL),
(578, 30, 'Dos', 'Paya', NULL, 'numeros', NULL),
(579, 30, 'Tres', 'Kimsa', NULL, 'numeros', NULL),
(580, 30, 'Cuatro', 'Pusi', NULL, 'numeros', NULL),
(581, 30, 'Cinco', 'Phisqa', NULL, 'numeros', NULL),
(582, 30, 'Primero', 'Mayiri', NULL, 'numeros', NULL),
(583, 30, 'Segundo', 'Payiri', NULL, 'numeros', NULL),
(584, 30, 'Contar', 'Wakhuña', NULL, 'numeros', NULL),
(585, 30, 'Contar', 'Jakhuña', NULL, 'numeros', NULL),
(586, 30, 'Medir', 'Tupuña', NULL, 'numeros', NULL),
(587, 30, 'Mitad', 'Chikata', NULL, 'numeros', NULL),
(588, 30, 'Todo', 'Taqpacha', NULL, 'numeros', NULL),
(589, 30, 'Solo, uno', 'Sapa', NULL, 'numeros', NULL),
(590, 30, 'Poco, escaso', 'Pisi', NULL, 'numeros', NULL),
(591, 30, 'Poco, menos', 'Juk''a', NULL, 'numeros', NULL),
(592, 30, 'Más, algo más', 'Juk''ampi', NULL, 'numeros', NULL),
(593, 30, 'Mucho, demasiado', 'Ancha', NULL, 'numeros', NULL),
(594, 30, 'Bastante', 'Muspa', NULL, 'numeros', NULL),
(595, 30, 'Puñado', 'Jich''i', NULL, 'numeros', NULL),
(596, 30, 'Porción (dos manos)', 'Phuxtu', NULL, 'numeros', NULL),
(597, 30, 'Cantidad', 'Wakita', NULL, 'numeros', NULL),
(598, 30, 'Montón, cúmulo', 'Qutu', NULL, 'numeros', NULL),
(599, 30, 'Tropa, manada', 'Tama', NULL, 'numeros', NULL),
(600, 30, 'Unir en uno', 'Mayachaña', NULL, 'numeros', NULL),
(601, 30, 'Unido', 'Mayachasita', NULL, 'numeros', NULL),
(602, 30, 'Individual', 'Sapaqata', NULL, 'numeros', NULL),
(603, 31, 'Seis', 'Suxta', NULL, 'numeros', NULL),
(604, 31, 'Siete', 'Paqalqu', NULL, 'numeros', NULL),
(605, 31, 'Siete', 'Paqallqu', NULL, 'numeros', NULL),
(606, 31, 'Ocho', 'Kimsaqalqu', NULL, 'numeros', NULL),
(607, 31, 'Ocho', 'Kimsaqallqu', NULL, 'numeros', NULL),
(608, 31, 'Nueve', 'Llä tunka', NULL, 'numeros', NULL),
(609, 31, 'Nueve', 'Llatunka', NULL, 'numeros', NULL),
(610, 31, 'Diez', 'Tunka', NULL, 'numeros', NULL),
(611, 31, 'Once', 'Tunka mayani', NULL, 'numeros', NULL),
(612, 31, 'Doce', 'Tunka payani', NULL, 'numeros', NULL),
(613, 31, 'Trece', 'Tunka kimsani', NULL, 'numeros', NULL)
ON CONFLICT DO NOTHING;
INSERT INTO vocabulario ("id", "leccion_id", "palabra_espanol", "palabra_objetivo", "audio_url", "categoria", "ejemplo_uso") VALUES
(614, 31, 'Catorce', 'Tunka pusini', NULL, 'numeros', NULL),
(615, 31, 'Quince', 'Tunka phisqani', NULL, 'numeros', NULL),
(616, 31, 'Dieciseis', 'Tunka suxtani', NULL, 'numeros', NULL),
(617, 31, 'Diecisiete', 'Tunka paqalquni', NULL, 'numeros', NULL),
(618, 31, 'Dieciocho', 'Tunka kimsaqalquni', NULL, 'numeros', NULL),
(619, 31, 'Diecinueve', 'Tunka llatunkani', NULL, 'numeros', NULL),
(620, 31, 'Veinte', 'Pä tunka', NULL, 'numeros', NULL),
(621, 31, 'Veintiuno', 'Pä tunka mayani', NULL, 'numeros', NULL),
(622, 31, 'Veintidós', 'Pä tunka payani', NULL, 'numeros', NULL),
(623, 31, 'Veinticinco', 'Pä tunka phisqani', NULL, 'numeros', NULL),
(624, 31, 'Treinta', 'Kimsa tunka', NULL, 'numeros', NULL),
(625, 31, 'Treinta y uno', 'Kimsa tunka mayani', NULL, 'numeros', NULL),
(626, 31, 'Treinta y dos', 'Kimsa tunka payani', NULL, 'numeros', NULL),
(627, 31, 'Cuarenta', 'Pusi tunka', NULL, 'numeros', NULL),
(628, 31, 'Cincuenta', 'Phisqa tunka', NULL, 'numeros', NULL),
(629, 31, 'Sesenta', 'Suxta tunka', NULL, 'numeros', NULL),
(630, 31, 'Setenta', 'Paqalqu tunka', NULL, 'numeros', NULL),
(631, 31, 'Ochenta', 'Kimsaqalqu tunka', NULL, 'numeros', NULL),
(632, 31, 'Noventa', 'Llä tunka tunka', NULL, 'numeros', NULL),
(633, 31, 'Noventa y nueve', 'Llä tunka tunka llä tunkani', NULL, 'numeros', NULL),
(634, 31, 'Cien', 'Pataka', NULL, 'numeros', NULL),
(635, 31, 'Ciento uno', 'Pataka mayani', NULL, 'numeros', NULL),
(636, 31, 'Ciento veinticuatro', 'Pataka pä tunka pusini', NULL, 'numeros', NULL),
(637, 31, 'Doscientos', 'Pä pataka', NULL, 'numeros', NULL),
(638, 31, 'Trescientos', 'Kimsa pataka', NULL, 'numeros', NULL),
(639, 31, 'Mil', 'Waranqa', NULL, 'numeros', NULL),
(640, 31, 'Mil seis', 'Waranqa suxtani', NULL, 'numeros', NULL),
(641, 31, 'Mil cincuenta y siete', 'Waranqa phisqa tunka paqalquni', NULL, 'numeros', NULL),
(642, 31, 'Mil cuatrocientos', 'Waranqa pusi pataka', NULL, 'numeros', NULL),
(643, 31, 'Mil cuatrocientos treinta y dos', 'Waranqa pusi pataka kimsa tunka payani', NULL, 'numeros', NULL),
(644, 31, 'Diez mil', 'Tunka waranqa', NULL, 'numeros', NULL),
(645, 31, 'Aproximadamente diez', 'Tunkhama', NULL, 'numeros', NULL),
(646, 31, 'Exactamente diez', 'Tunka kawalpachawa', NULL, 'numeros', NULL),
(647, 31, 'Dos casas', 'Päuta', NULL, 'numeros', NULL),
(648, 31, 'Paso (medida)', 'Chilqi', NULL, 'numeros', NULL),
(649, 31, 'Cuarta, palmo', 'Chhiya', NULL, 'numeros', NULL),
(650, 31, 'Brazada (medida)', 'Iqa', NULL, 'numeros', NULL),
(651, 31, 'Pulgada', 'Wiku', NULL, 'numeros', NULL),
(688, 34, 'Llama', 'Qarwa', NULL, 'animales', NULL),
(689, 34, 'Llama', 'Qawra', NULL, 'animales', NULL),
(690, 34, 'Alpaca', 'Allpachu', NULL, 'animales', NULL),
(691, 34, 'Perro', 'Anuqara', NULL, 'animales', NULL),
(692, 34, 'Perro', 'Anu', NULL, 'animales', NULL),
(693, 34, 'Gato', 'Michi', NULL, 'animales', NULL),
(694, 34, 'Gato', 'Phisi', NULL, 'animales', NULL),
(695, 34, 'Oveja', 'Uwija', NULL, 'animales', NULL),
(696, 34, 'Oveja', 'Iwija', NULL, 'animales', NULL),
(697, 34, 'Cerdo', 'Khuchhi', NULL, 'animales', NULL),
(698, 34, 'Vaca', 'Waka', NULL, 'animales', NULL),
(699, 34, 'Conejo', 'Wank''u', NULL, 'animales', NULL),
(700, 34, 'Gallina', 'Wallpa', NULL, 'animales', NULL),
(701, 34, 'Pollo', 'Chiwchi', NULL, 'animales', NULL),
(702, 34, 'Pollito', 'Chhiwchhi', NULL, 'animales', NULL),
(703, 34, 'Ganado', 'Uywa', NULL, 'animales', NULL),
(704, 34, 'Animales', 'Uywanaja', NULL, 'animales', NULL),
(705, 34, 'Macho (animal)', 'Urqu', NULL, 'animales', NULL),
(706, 34, 'Hembra (animal)', 'Qachu', NULL, 'animales', NULL),
(707, 34, 'Cría', 'Qallu', NULL, 'animales', NULL),
(708, 34, 'Preñada', 'Wallq''i', NULL, 'animales', NULL),
(709, 34, 'Auquénido macho, semental', 'Jañachu', NULL, 'animales', NULL),
(710, 34, 'Camélido de manchas', 'Chullumpi', NULL, 'animales', NULL),
(711, 34, 'Llama con más lana', 'Saxsali', NULL, 'animales', NULL),
(712, 34, 'Criar animales', 'Uywaña', NULL, 'animales', NULL),
(713, 34, 'Ganadero', 'Uywachiri', NULL, 'animales', NULL),
(714, 34, 'Persona con mucho ganado', 'Uywani jaqi', NULL, 'animales', NULL),
(715, 34, 'Corral ritual del ganado', 'Uywa kancha', NULL, 'animales', NULL),
(716, 34, 'Marcación del ganado', 'Uywa k''illpha', NULL, 'animales', NULL),
(717, 34, 'Floreo de ganados', 'Uywa wayñu', NULL, 'animales', NULL),
(718, 34, 'Criar alpaca', 'Allpachu uywaña', NULL, 'animales', NULL),
(719, 34, 'Criar perro', 'Anuqara uywaña', NULL, 'animales', NULL),
(720, 34, 'Criar llamo', 'Qarwa uywaña', NULL, 'animales', NULL),
(721, 34, 'Criar cerdo', 'Khuchi uywaña', NULL, 'animales', NULL),
(722, 34, 'Criar gato', 'Michi uywaña', NULL, 'animales', NULL),
(723, 34, 'Pastorear', 'Awatiña', NULL, 'animales', NULL),
(724, 34, 'Pastor', 'Awatiri', NULL, 'animales', NULL),
(725, 34, 'Corral', 'Uyu', NULL, 'animales', NULL),
(726, 34, 'Corral pequeño', 'Chikiru', NULL, 'animales', NULL),
(727, 34, 'Corral rojo', 'Wiluyu', NULL, 'animales', NULL),
(728, 35, 'Cóndor', 'Kunturi', NULL, 'animales', NULL),
(729, 35, 'Autoridad del cóndor', 'Kunturi mallku', NULL, 'animales', NULL),
(730, 35, 'Puma', 'Puma', NULL, 'animales', NULL),
(731, 35, 'Zorro', 'Lari', NULL, 'animales', NULL),
(732, 35, 'Zorro', 'Qamaqi', NULL, 'animales', NULL),
(733, 35, 'Oso andino', 'Jukumari', NULL, 'animales', NULL),
(734, 35, 'Vicuña', 'Wari', NULL, 'animales', NULL),
(735, 35, 'Venado', 'Taruka', NULL, 'animales', NULL),
(736, 35, 'Guanaco', 'Wanaju', NULL, 'animales', NULL),
(737, 35, 'Avestruz', 'Suri', NULL, 'animales', NULL),
(738, 35, 'Lugar de avestruces', 'Suriri', NULL, 'animales', NULL),
(739, 35, 'Zorrillo', 'Añathuya', NULL, 'animales', NULL),
(740, 35, 'Vizcacha', 'Wisk''acha', NULL, 'animales', NULL),
(741, 35, 'Quirquincho', 'Khirkhinchu', NULL, 'animales', NULL),
(742, 35, 'Ratón', 'Achaku', NULL, 'animales', NULL),
(743, 35, 'Culebra', 'Asirru', NULL, 'animales', NULL),
(744, 35, 'Serpiente', 'Amaru', NULL, 'animales', NULL),
(745, 35, 'Sapo', 'Jamp''atu', NULL, 'animales', NULL),
(746, 35, 'Sapo', 'Xamp''atu', NULL, 'animales', NULL),
(747, 35, 'Lagarto', 'Jaririnkhu', NULL, 'animales', NULL),
(748, 35, 'Lagarto', 'Jararankhu', NULL, 'animales', NULL),
(749, 35, 'Pez', 'Challwa', NULL, 'animales', NULL),
(750, 35, 'Pez grande', 'Mayri', NULL, 'animales', NULL),
(751, 35, 'Renacuajo', 'Juqhulli', NULL, 'animales', NULL),
(752, 35, 'Halcón', 'Mamani', NULL, 'animales', NULL),
(753, 35, 'Búho, lechuza', 'Juku', NULL, 'animales', NULL),
(754, 35, 'Paloma', 'Urpila', NULL, 'animales', NULL),
(755, 35, 'Tórtola', 'Kukuli', NULL, 'animales', NULL),
(756, 35, 'Picaflor', 'Luli', NULL, 'animales', NULL),
(757, 35, 'Pájaro', 'Jamach''i', NULL, 'animales', NULL),
(758, 35, 'Ganso andino', 'Wallata', NULL, 'animales', NULL),
(759, 35, 'Gaviota andina', 'Liqi liqi', NULL, 'animales', NULL),
(760, 35, 'Gaviota andina', 'Qillwa', NULL, 'animales', NULL),
(761, 35, 'Codorniz andina', 'Puku puku', NULL, 'animales', NULL),
(762, 35, 'Perdiz', 'Kiwla', NULL, 'animales', NULL),
(763, 35, 'Perdiz', 'P''isaqa', NULL, 'animales', NULL),
(764, 35, 'Flamenco', 'Parina', NULL, 'animales', NULL),
(765, 35, 'Tipo de pato', 'Unkhalli', NULL, 'animales', NULL),
(766, 35, 'Buitre, ave de rapiña', 'Alqhamiri', NULL, 'animales', NULL),
(767, 35, 'Ave del altiplano', 'Yaka yaka', NULL, 'animales', NULL),
(768, 35, 'Mariposa', 'Pilpintu', NULL, 'animales', NULL),
(769, 35, 'Hormiga', 'K''isimiri', NULL, 'animales', NULL),
(770, 35, 'Mosca', 'Chichilinkha', NULL, 'animales', NULL),
(771, 35, 'Polilla', 'Thutha', NULL, 'animales', NULL),
(772, 35, 'Cola, rabo', 'Wich''inkha', NULL, 'animales', NULL),
(773, 35, 'Cuerno', 'Waxra', NULL, 'animales', NULL),
(774, 35, 'Ala, pluma', 'Ch''iqa', NULL, 'animales', NULL),
(775, 35, 'Pico de ave', 'Suru', NULL, 'animales', NULL),
(776, 35, 'Nido', 'Tapa', NULL, 'animales', NULL),
(777, 35, 'Lana', 'T''arwa', NULL, 'animales', NULL),
(778, 35, 'Cuero', 'Lip''ichi', NULL, 'animales', NULL),
(779, 36, 'Papa', 'Ch''uqi', NULL, 'alimentos', NULL),
(780, 36, 'Papa', 'Chuqi', NULL, 'alimentos', NULL),
(781, 36, 'Maíz', 'Tunqu', NULL, 'alimentos', NULL),
(782, 36, 'Quínoa', 'Juyra', NULL, 'alimentos', NULL),
(783, 36, 'Quínoa', 'Jupha', NULL, 'alimentos', NULL),
(784, 36, 'Agua', 'Uma', NULL, 'alimentos', NULL),
(785, 36, 'Comida', 'Manq''a', NULL, 'alimentos', NULL),
(786, 36, 'Comida', 'Maq''a', NULL, 'alimentos', NULL),
(787, 36, 'Papa deshidratada', 'Ch''uñu', NULL, 'alimentos', NULL),
(788, 36, 'Hacer chuños', 'Ch''uñuchaña', NULL, 'alimentos', NULL),
(789, 36, 'Habas', 'Xawasa', NULL, 'alimentos', NULL),
(790, 36, 'Semilla', 'Xatha', NULL, 'alimentos', NULL),
(791, 36, 'Quínoa silvestre', 'Ajara', NULL, 'alimentos', NULL),
(792, 36, 'Sal', 'Jayu', NULL, 'alimentos', NULL),
(793, 36, 'Harina', 'Jak''u', NULL, 'alimentos', NULL),
(794, 36, 'Caliente', 'Junt''u', NULL, 'alimentos', NULL),
(795, 36, 'Agua caliente, desayuno', 'Junt''uma', NULL, 'alimentos', NULL),
(796, 36, 'Calentar', 'Junt''uchaña', NULL, 'alimentos', NULL),
(797, 36, 'Dulce', 'Musq''a', NULL, 'alimentos', NULL),
(798, 36, 'Amargo', 'Xaru', NULL, 'alimentos', NULL),
(799, 36, 'Amargo', 'K''allk''u', NULL, 'alimentos', NULL),
(800, 36, 'Seco', 'Waña', NULL, 'alimentos', NULL),
(801, 36, 'Mojado', 'Llanch''u', NULL, 'alimentos', NULL),
(802, 36, 'Miel', 'Misk''i', NULL, 'alimentos', NULL),
(803, 36, 'Coca', 'Kuka', NULL, 'alimentos', NULL),
(804, 36, 'Ajo', 'Ajusa', NULL, 'alimentos', NULL),
(805, 36, 'Hambre', 'Awti', NULL, 'alimentos', NULL),
(806, 36, 'Hambre', 'Awtji', NULL, 'alimentos', NULL),
(807, 36, 'Escasez', 'Awtiwa', NULL, 'alimentos', NULL),
(808, 36, 'Época de escasez', 'Awtipacha', NULL, 'alimentos', NULL),
(809, 36, 'Chacra', 'Yapu', NULL, 'alimentos', NULL),
(810, 36, 'Cosechar', 'Yapuchaña', NULL, 'alimentos', NULL),
(811, 36, 'Agricultor', 'Yapuchiri', NULL, 'alimentos', NULL),
(812, 36, 'Siembra', 'Sata', NULL, 'alimentos', NULL),
(813, 36, 'Siembra', 'Ch''aja', NULL, 'alimentos', NULL),
(814, 36, 'Sembrar', 'Sataña', NULL, 'alimentos', NULL),
(815, 36, 'Sembrar papa', 'Ch''uqi sataña', NULL, 'alimentos', NULL),
(816, 36, 'Sembrar maíz', 'Tunqu sataña', NULL, 'alimentos', NULL),
(817, 36, 'Cosecha', 'Puquya', NULL, 'alimentos', NULL),
(818, 36, 'Cosechar', 'Puquyaña', NULL, 'alimentos', NULL),
(819, 36, 'Recoger la cosecha', 'Puquya apthapiña', NULL, 'alimentos', NULL),
(820, 36, 'Comer', 'Maq''aña', NULL, 'alimentos', NULL),
(821, 36, 'Beber', 'Umaña', NULL, 'alimentos', NULL),
(822, 36, 'Tragar', 'Mallantaña', NULL, 'alimentos', NULL),
(823, 36, 'Probar', 'Mallt''aña', NULL, 'alimentos', NULL),
(824, 37, 'Carne', 'Aycha', NULL, 'alimentos', NULL),
(825, 37, 'Pescado', 'Challwa', NULL, 'alimentos', NULL),
(826, 37, 'Pan', 'T''ant''a', NULL, 'alimentos', NULL),
(827, 37, 'Pan', 'Tanta', NULL, 'alimentos', NULL),
(828, 37, 'Ají', 'Jallpa', NULL, 'alimentos', NULL),
(829, 37, 'Charqui, carne seca', 'Ch''arkhi', NULL, 'alimentos', NULL),
(830, 37, 'Grasa, sebo', 'Lik''i', NULL, 'alimentos', NULL),
(831, 37, 'Grasa de llamo', 'Untu', NULL, 'alimentos', NULL),
(832, 37, 'Huevo', 'K''awna', NULL, 'alimentos', NULL),
(833, 37, 'Sopa de chuño y carne', 'Chayru', NULL, 'alimentos', NULL),
(834, 37, 'Sopa', 'Lawita', NULL, 'alimentos', NULL),
(835, 37, 'Sopa de maíz con piedra caliente', 'Qala phurk''a', NULL, 'alimentos', NULL),
(836, 37, 'Guiso de cordero', 'T''imphu', NULL, 'alimentos', NULL),
(837, 37, 'Carne asada', 'Kanka', NULL, 'alimentos', NULL),
(838, 37, 'Quínoa retostada', 'Phiri', NULL, 'alimentos', NULL),
(839, 37, 'Quínoa graneada', 'Phisara', NULL, 'alimentos', NULL),
(840, 37, 'Bocadillo de quínoa', 'K''ispiña', NULL, 'alimentos', NULL),
(841, 37, 'Comida de quínoa', 'P''isqi', NULL, 'alimentos', NULL),
(842, 37, 'Bollo de quínoa', 'Muk''una', NULL, 'alimentos', NULL),
(843, 37, 'Chicha de quínoa', 'K''usa', NULL, 'alimentos', NULL),
(844, 37, 'Trozo de carne para sopa', 'Jaxt''a', NULL, 'alimentos', NULL),
(845, 37, 'Greda comestible', 'Phasa', NULL, 'alimentos', NULL),
(846, 37, 'Guano, abono', 'Wanu', NULL, 'alimentos', NULL),
(847, 37, 'Panadero', 'T''ant''a luriri', NULL, 'alimentos', NULL),
(848, 37, 'Cocinar', 'Phayaña', NULL, 'alimentos', NULL),
(849, 37, 'Cocinero/a', 'Phayiri', NULL, 'alimentos', NULL)
ON CONFLICT DO NOTHING;
INSERT INTO vocabulario ("id", "leccion_id", "palabra_espanol", "palabra_objetivo", "audio_url", "categoria", "ejemplo_uso") VALUES
(850, 37, 'Cocer', 'Qhathiña', NULL, 'alimentos', NULL),
(851, 37, 'Freír', 'Thixiña', NULL, 'alimentos', NULL),
(852, 37, 'Hervir', 'Wallaqiña', NULL, 'alimentos', NULL),
(853, 37, 'Amasar', 'Ñatuña', NULL, 'alimentos', NULL),
(854, 37, 'Olla', 'Phukhu', NULL, 'alimentos', NULL),
(855, 37, 'Fuego', 'Nina', NULL, 'alimentos', NULL),
(856, 37, 'Fogón', 'Nina chhaqha', NULL, 'alimentos', NULL),
(857, 37, 'Leña', 'Lawa', NULL, 'alimentos', NULL),
(858, 37, 'Leñas', 'Lawanaja', NULL, 'alimentos', NULL),
(859, 37, 'Elemento para tostar maíz', 'Jiwk''i', NULL, 'alimentos', NULL),
(860, 37, 'Humo', 'Jiwq''i', NULL, 'alimentos', NULL),
(861, 37, 'Granear arroz o quínoa', 'K''ajayaña', NULL, 'alimentos', NULL),
(862, 37, 'Feria, mercado', 'Qhathu', NULL, 'alimentos', NULL),
(863, 37, 'Comprar', 'Alaña', NULL, 'alimentos', NULL),
(864, 37, 'Vender', 'Alxaña', NULL, 'alimentos', NULL),
(865, 37, 'Comprador', 'Aliri', NULL, 'alimentos', NULL),
(866, 37, 'Comerciante', 'Alxiri', NULL, 'alimentos', NULL),
(867, 37, 'Vendido', 'Alxata', NULL, 'alimentos', NULL),
(868, 37, 'Trueque', 'Alxakipasiña', NULL, 'alimentos', NULL),
(869, 36, 'Sol', 'Inti', NULL, 'naturaleza', NULL),
(870, 36, 'Sol sagrado', 'Wilka', NULL, 'naturaleza', NULL),
(871, 36, 'Padre Sol', 'Tata Inti', NULL, 'naturaleza', NULL),
(872, 36, 'Luna, mes', 'Phaxsi', NULL, 'naturaleza', NULL),
(873, 36, 'Estrella', 'Wara wara', NULL, 'naturaleza', NULL),
(874, 36, 'Mayor de las estrellas', 'Achichi wara wara', NULL, 'naturaleza', NULL),
(875, 36, 'Cerro', 'Qullu', NULL, 'naturaleza', NULL),
(876, 36, 'Cerro protector', 'Qullu mallku', NULL, 'naturaleza', NULL),
(877, 36, 'Conjunto de cerros', 'Qullu qullu', NULL, 'naturaleza', NULL),
(878, 36, 'Río', 'Jawira', NULL, 'naturaleza', NULL),
(879, 36, 'Lago', 'Quta', NULL, 'naturaleza', NULL),
(880, 36, 'Lugar de pequeñas lagunas', 'Quta quta', NULL, 'naturaleza', NULL),
(881, 36, 'Orilla del lago', 'Quta thiya', NULL, 'naturaleza', NULL),
(882, 36, 'Vertiente', 'Phuju', NULL, 'naturaleza', NULL),
(883, 36, 'Bofedal, potrero', 'Juqhu', NULL, 'naturaleza', NULL),
(884, 36, 'Bofedal', 'Xuqhu', NULL, 'naturaleza', NULL),
(885, 36, 'Quebrada', 'Q''awa', NULL, 'naturaleza', NULL),
(886, 36, 'Quebrada blanca (Aconcagua)', 'Janq''u q''awa', NULL, 'naturaleza', NULL),
(887, 36, 'Quebrada naranja', 'Jaruma q''awa', NULL, 'naturaleza', NULL),
(888, 36, 'Piedra', 'Qala', NULL, 'naturaleza', NULL),
(889, 36, 'Lugar pedregoso', 'Qala qala', NULL, 'naturaleza', NULL),
(890, 36, 'Cerro pedregoso', 'Qala qala qullu', NULL, 'naturaleza', NULL),
(891, 36, 'Camino pedregoso', 'Qala qala thakhi', NULL, 'naturaleza', NULL),
(892, 36, 'Piedra reventada', 'Qala t''aqata', NULL, 'naturaleza', NULL),
(893, 36, 'Peñasco, rocas', 'Xaqhi', NULL, 'naturaleza', NULL),
(894, 36, 'Lugar de peñascos', 'Xaqhi xaqhi', NULL, 'naturaleza', NULL),
(895, 36, 'Viento', 'Thaya', NULL, 'naturaleza', NULL),
(896, 36, 'Viento del norte', 'Araxa thaya', NULL, 'naturaleza', NULL),
(897, 36, 'Viento suave y abrigador', 'Junt''u thaya', NULL, 'naturaleza', NULL),
(898, 36, 'Nube de viento', 'Thaya ch''iju', NULL, 'naturaleza', NULL),
(899, 36, 'Silbido del viento', 'Thayana khuyupa', NULL, 'naturaleza', NULL),
(900, 36, 'Tiempo de vientos', 'Thayapacha', NULL, 'naturaleza', NULL),
(901, 36, 'Lluvia', 'Xallu', NULL, 'naturaleza', NULL),
(902, 36, 'Nube de lluvia', 'Xallu ch''iju', NULL, 'naturaleza', NULL),
(903, 36, 'Tiempo de lluvia', 'Xallupacha', NULL, 'naturaleza', NULL),
(904, 36, 'Tiempo de lluvia', 'Jallu pacha', NULL, 'naturaleza', NULL),
(905, 36, 'Lluvia en el tiempo medio', 'Chika jallu', NULL, 'naturaleza', NULL),
(906, 36, 'Lluvia antes de tiempo', 'Layra jallu', NULL, 'naturaleza', NULL),
(907, 36, 'Lluvia atrasada', 'Qhipha jallu', NULL, 'naturaleza', NULL),
(908, 36, 'Nieve', 'Khunu', NULL, 'naturaleza', NULL),
(909, 36, 'Granizo', 'Chhijchi', NULL, 'naturaleza', NULL),
(910, 36, 'Hielo', 'Chhulluncaya', NULL, 'naturaleza', NULL),
(911, 36, 'Escarcha, helada', 'Juyphi', NULL, 'naturaleza', NULL),
(912, 36, 'Tiempo de escarcha', 'Juyphipacha', NULL, 'naturaleza', NULL),
(913, 36, 'Helada', 'Ch''iwi', NULL, 'naturaleza', NULL),
(914, 36, 'Helada, frío', 'Ch''iji', NULL, 'naturaleza', NULL),
(915, 36, 'Tiempo de heladas', 'Ch''ijipacha', NULL, 'naturaleza', NULL),
(916, 36, 'Rayo', 'Illapa', NULL, 'naturaleza', NULL),
(917, 36, 'Trueno', 'Arnaxa', NULL, 'naturaleza', NULL),
(918, 36, 'Trueno', 'Q''axu q''axu', NULL, 'naturaleza', NULL),
(919, 36, 'Nube, sombra', 'Ch''iju', NULL, 'naturaleza', NULL),
(920, 36, 'Nube', 'Urpi', NULL, 'naturaleza', NULL),
(921, 36, 'Nube que anuncia lluvia', 'Qinaya', NULL, 'naturaleza', NULL),
(922, 36, 'Arcoíris', 'Kurmi', NULL, 'naturaleza', NULL),
(923, 36, 'Cordillera', 'Suni', NULL, 'naturaleza', NULL),
(924, 36, 'Cerca de la cordillera', 'Suni jak''a', NULL, 'naturaleza', NULL),
(925, 36, 'En la cordillera', 'Sunina', NULL, 'naturaleza', NULL),
(926, 36, 'Sobre la cordillera', 'Suni patxa', NULL, 'naturaleza', NULL),
(927, 36, 'Valle, precordillera', 'Qhirwa', NULL, 'naturaleza', NULL),
(928, 36, 'Tierra, territorio', 'Uraqi', NULL, 'naturaleza', NULL),
(929, 36, 'Territorio', 'Uraji', NULL, 'naturaleza', NULL),
(930, 36, 'Territorio en planicie', 'Pampa uraji', NULL, 'naturaleza', NULL),
(931, 36, 'Límite, frontera', 'Qurpa', NULL, 'naturaleza', NULL),
(932, 36, 'Orilla', 'Thiya', NULL, 'naturaleza', NULL),
(933, 36, 'Pantano', 'Sinija', NULL, 'naturaleza', NULL),
(934, 36, 'Barro negro del pantano', 'Juri', NULL, 'naturaleza', NULL),
(935, 36, 'Greda, barro', 'Ñiq''i', NULL, 'naturaleza', NULL),
(936, 36, 'Tierra movediza', 'Luq''isa', NULL, 'naturaleza', NULL),
(937, 36, 'Arbusto', 'T''ula', NULL, 'naturaleza', NULL),
(938, 36, 'Lugar de muchos arbustos', 'T''ula t''ula', NULL, 'naturaleza', NULL),
(939, 36, 'Flor del arbusto', 'T''ula phaxalli', NULL, 'naturaleza', NULL),
(940, 36, 'Arbusto a orillas del río', 'Uma t''ula', NULL, 'naturaleza', NULL),
(941, 36, 'Arbusto del altiplano', 'Añawaya t''ula', NULL, 'naturaleza', NULL),
(942, 36, 'Arbusto del altiplano', 'K''ipha t''ula', NULL, 'naturaleza', NULL),
(943, 36, 'Arbusto del altiplano', 'Ñak''a t''ula', NULL, 'naturaleza', NULL),
(944, 36, 'Yareta', 'Llarita', NULL, 'naturaleza', NULL),
(945, 36, 'Queñua (árbol andino)', 'Qiñwa', NULL, 'naturaleza', NULL),
(946, 36, 'Flor', 'Phaxalli', NULL, 'naturaleza', NULL),
(947, 36, 'Flor', 'Panqara', NULL, 'naturaleza', NULL),
(948, 36, 'Paja del bofedal', 'Waylla', NULL, 'naturaleza', NULL),
(949, 36, 'Paja brava', 'Iruwichhu', NULL, 'naturaleza', NULL),
(950, 36, 'Paja brava', 'Wichhu', NULL, 'naturaleza', NULL),
(951, 36, 'Pasto, forraje', 'Qura', NULL, 'naturaleza', NULL),
(952, 36, 'Pasto del año', 'Llapa', NULL, 'naturaleza', NULL),
(953, 36, 'Pasto pequeño del bofedal', 'Chhichha', NULL, 'naturaleza', NULL),
(954, 36, 'Espina', 'Ch''aphi', NULL, 'naturaleza', NULL),
(955, 36, 'Tronco', 'Khullu', NULL, 'naturaleza', NULL),
(1065, 14, 'Hola', 'Rimaykullayki', NULL, 'saludos', 'Rimaykullayki, imaynalla'),
(1066, 14, 'Buenos días', 'Allin punchaw', NULL, 'saludos', 'Allin punchaw, mamay'),
(1067, 14, 'Buenas tardes', 'Allin sukha', NULL, 'saludos', 'Allin sukha, taytay'),
(1068, 14, 'Buenas noches', 'Allin tuta', NULL, 'saludos', 'Allin tuta, wawqiy'),
(1069, 14, '¿Cómo estás?', 'Imaynalla kashanki?', NULL, 'saludos', 'Rimaykullayki, imaynalla kashanki?'),
(1070, 15, 'Mi nombre es', 'Sutiy ... kan', NULL, 'presentaciones', 'Sutiy María kan'),
(1071, 15, 'Yo soy', 'Ñuqa ... kani', NULL, 'presentaciones', 'Ñuqa estudiante kani'),
(1072, 15, 'Mucho gusto', 'Anchata kusikuni', NULL, 'presentaciones', 'Anchata kusikuni riqsiykuspa'),
(1073, 15, '¿Cuál es tu nombre?', 'Ima sutiyki?', NULL, 'presentaciones', 'Ima sutiyki, wawqiy?'),
(1074, 15, 'Soy de', '... manta kani', NULL, 'presentaciones', 'Cusco manta kani'),
(1075, 16, 'Adiós', 'Tupananchikkama', NULL, 'despedidas', 'Tupananchikkama, mamay'),
(1076, 16, 'Hasta luego', 'Ratukama', NULL, 'despedidas', 'Ratukama, riqsiyki'),
(1077, 16, 'Hasta mañana', 'Paqarinkama', NULL, 'despedidas', 'Paqarinkama, taytay'),
(1078, 16, 'Nos vemos', 'Rikunakusunchik', NULL, 'despedidas', 'Rikunakusunchik wasipi'),
(1079, 16, 'Cuídate', 'Allinta kakunki', NULL, 'despedidas', 'Allinta kakunki, wawqiy'),
(1080, 17, 'Padre', 'Tayta', NULL, 'familia', 'Taytay llankaq'),
(1081, 17, 'Madre', 'Mama', NULL, 'familia', 'Mamay wayk''uq'),
(1082, 17, 'Abuelo', 'Machu', NULL, 'familia', 'Machuy yachaq'),
(1083, 17, 'Abuela', 'Paya', NULL, 'familia', 'Payay munakuq'),
(1084, 17, 'Padres', 'Taytamama', NULL, 'familia', 'Taytamamay munakuwanku'),
(1085, 18, 'Hermano', 'Wawqiy', NULL, 'familia', 'Wawqiy hatun'),
(1086, 18, 'Hermana', 'Ñañay', NULL, 'familia', 'Ñañay sumaq'),
(1087, 18, 'Hijo', 'Churi', NULL, 'familia', 'Churiy llank''aq'),
(1088, 18, 'Hija', 'Warmi wawa', NULL, 'familia', 'Warmi waway estudiante'),
(1089, 18, 'Hijos', 'Wawakuna', NULL, 'familia', 'Wawakunay kusisqa'),
(1090, 19, 'Uno', 'Huk', NULL, 'numeros', 'Huk runa'),
(1091, 19, 'Dos', 'Iskay', NULL, 'numeros', 'Iskay wawa'),
(1092, 19, 'Tres', 'Kimsa', NULL, 'numeros', 'Kimsa llama'),
(1093, 19, 'Cuatro', 'Tawa', NULL, 'numeros', 'Tawa wasi'),
(1094, 19, 'Cinco', 'Pichqa', NULL, 'numeros', 'Pichqa papa'),
(1095, 20, 'Seis', 'Suqta', NULL, 'numeros', 'Suqta allqu'),
(1096, 20, 'Siete', 'Qanchis', NULL, 'numeros', 'Qanchis punchaw'),
(1097, 20, 'Ocho', 'Pusaq', NULL, 'numeros', 'Pusaq killa'),
(1098, 20, 'Nueve', 'Isqun', NULL, 'numeros', 'Isqun wata'),
(1099, 20, 'Diez', 'Chunka', NULL, 'numeros', 'Chunka runa'),
(1100, 21, 'Rojo', 'Puka', NULL, 'colores', 'Puka t''ika'),
(1101, 21, 'Azul', 'Anqas', NULL, 'colores', 'Anqas qocha'),
(1102, 21, 'Amarillo', 'Q''illu', NULL, 'colores', 'Q''illu inti'),
(1103, 21, 'Verde', 'Q''umir', NULL, 'colores', 'Q''umir sach''a'),
(1104, 21, 'Blanco', 'Yuraq', NULL, 'colores', 'Yuraq rit''i'),
(1105, 22, 'Negro', 'Yana', NULL, 'colores', 'Yana allqu'),
(1106, 22, 'Marrón', 'Ch''umpi', NULL, 'colores', 'Ch''umpi llama'),
(1107, 22, 'Naranja', 'Willapi', NULL, 'colores', 'Willapi wayta'),
(1108, 22, 'Rosado', 'Puka yuraq', NULL, 'colores', 'Puka yuraq t''ika'),
(1109, 22, 'Gris', 'Uqi', NULL, 'colores', 'Uqi phuyu'),
(1110, 23, 'Perro', 'Allqu', NULL, 'animales', 'Allquy hatun'),
(1111, 23, 'Gato', 'Michi', NULL, 'animales', 'Michiy huch''uy'),
(1112, 23, 'Llama', 'Llama', NULL, 'animales', 'Llamay millwasapa'),
(1113, 23, 'Alpaca', 'Paqocha', NULL, 'animales', 'Paqocha sumaq'),
(1114, 23, 'Cuy', 'Quwi', NULL, 'animales', 'Quwiy hatun'),
(1867, 11, 'Hola, Como estas', 'Allillanchu', 'https://res.cloudinary.com/dcuvavycy/video/upload/v1766339224/allillanchu_n5wnjx.ogg', 'saludo', 'Allillanchu, Maria'),
(1868, 11, 'Estoy bien', 'Allillanmi', 'https://res.cloudinary.com/dcuvavycy/video/upload/v1766339318/allillanmi_jjt2xn.ogg', 'respuesta', 'Allillanmi, qamri?'),
(1869, 11, 'Buenos dias', 'Allin punchay', NULL, 'saludo', 'Allin punchay, tayta'),
(1870, 11, 'Buenas tardes', 'Allin sukha', NULL, 'saludo', 'Allin sukha, mama'),
(1871, 11, 'Buenas noches', 'Allin tuta', NULL, 'saludo', 'Allin tuta, wawqi'),
(1872, 11, 'Bienvenido', 'Allin hamusqa', NULL, 'saludo', 'Allin hamusqa wasiypi'),
(1873, 12, 'Mi nombre es', 'Sutiy', NULL, 'presentacion', 'Sutiy Pedrom'),
(1874, 12, 'Cual es tu nombre', 'Iman sutiyki', NULL, 'pregunta', 'Iman sutiyki?'),
(1875, 12, 'Soy de', 'manta kani', NULL, 'presentacion', 'Cuscomanta kani'),
(1876, 12, 'Mucho gusto', 'Ancha kusikuni', NULL, 'cortesia', 'Ancha kusikuni'),
(1877, 13, 'Hasta luego', 'Tupananchikkama', NULL, 'despedida', 'Tupananchikkama, tayta'),
(1878, 13, 'Hasta pronto', 'Ratukama', NULL, 'despedida', 'Ratukama'),
(1879, 13, 'Hasta manana', 'Qayakama', NULL, 'despedida', 'Qayakama, wawqi'),
(1880, 13, 'Que te vaya bien', 'Allin ripuy', NULL, 'despedida', 'Allin ripuy, panay'),
(1881, 25, 'Como estas', 'Kamisaki', NULL, 'saludo', 'Kamisaki, jilata'),
(1882, 25, 'Estoy bien', 'Waliki', NULL, 'respuesta', 'Waliki, jumarusti'),
(1883, 25, 'Buenos dias', 'Aski urukipan', NULL, 'saludo', 'Aski urukipan, tayka'),
(1884, 25, 'Buenas tardes', 'Aski jayp ukipan', NULL, 'saludo', 'Aski jayp ukipan'),
(1885, 25, 'Buenas noches', 'Aski arumankipan', NULL, 'saludo', 'Aski arumankipan'),
(1886, 25, 'Hola', 'Laphi', NULL, 'saludo', 'Laphi, kamisaki'),
(1887, 26, 'Mi nombre es', 'Nayan sutija', NULL, 'presentacion', 'Nayan sutija Maria'),
(1888, 26, 'Cual es tu nombre', 'Kunasa sutima', NULL, 'pregunta', 'Kunasa sutima, jilata'),
(1889, 26, 'Soy de', 'Nayax jutatha', NULL, 'presentacion', 'Nayax La Pazta jutatha'),
(1890, 26, 'Mucho gusto', 'Kusisita', NULL, 'cortesia', 'Kusisita unanaqata'),
(1891, 27, 'Hasta luego', 'Jakisiñkama', NULL, 'despedida', 'Jakisiñkama, jilata'),
(1892, 27, 'Hasta manana', 'Qharurukama', NULL, 'despedida', 'Qharurukama, tayka'),
(1893, 27, 'Gracias', 'Yuspajaray', NULL, 'cortesia', 'Yuspajaray, awki'),
(1894, 27, 'De nada', 'Janiwa kunasa', NULL, 'cortesia', 'Janiwa kunasa, waliki'),
(1895, 28, 'Padre', 'Awki', NULL, 'familia', 'Awkija irnaqiri'),
(1896, 28, 'Madre', 'Tayka', NULL, 'familia', 'Taykaja suma warmi'),
(1897, 28, 'Abuelo', 'Achachila', NULL, 'familia', 'Achachilaja yatiri'),
(1898, 28, 'Abuela', 'Awicha', NULL, 'familia', 'Awichaja tanta luri'),
(1899, 29, 'Hermano mayor', 'Jila', NULL, 'familia', 'Jilaja yatiqiri'),
(1900, 29, 'Hermano menor', 'Sullka', NULL, 'familia', 'Sullkaja jiska'),
(1901, 29, 'Hijo varon', 'Yuqalla', NULL, 'familia', 'Yuqallaja anata'),
(1902, 29, 'Hija mujer', 'Imilla', NULL, 'familia', 'Imillaja yatiqaski'),
(1903, 32, 'Rojo', 'Wila', NULL, 'color', 'Wila panqara'),
(1904, 32, 'Amarillo', 'Qillu', NULL, 'color', 'Qillu inti'),
(1905, 32, 'Azul', 'Larama', NULL, 'color', 'Larama alaxpacha'),
(1906, 32, 'Verde', 'Chuxna', NULL, 'color', 'Chuxna quqa'),
(1907, 33, 'Negro', 'Chiyara', NULL, 'color', 'Chiyara aruma'),
(1908, 33, 'Blanco', 'Janqu', NULL, 'color', 'Janqu khunu'),
(1909, 33, 'Marron', 'Chumpi', NULL, 'color', 'Chumpi laka'),
(1910, 25, 'Saludar', 'Aruntaña', NULL, 'saludos', NULL)
ON CONFLICT DO NOTHING;
INSERT INTO vocabulario ("id", "leccion_id", "palabra_espanol", "palabra_objetivo", "audio_url", "categoria", "ejemplo_uso") VALUES
(1911, 25, 'Cómo estás', 'Kamisaraki', NULL, 'saludos', NULL),
(1912, 25, 'Estoy bien', 'Walikiwa', NULL, 'saludos', NULL),
(1913, 25, 'Bien', 'Wali', NULL, 'saludos', NULL),
(1914, 25, 'Buen día', 'Suma uru', NULL, 'saludos', NULL),
(1915, 25, 'Buena noche', 'Suma arama', NULL, 'saludos', NULL),
(1916, 25, 'Buenas tardes', 'Aski jayp''ukipan', NULL, 'saludos', NULL),
(1917, 25, 'Buenas noches', 'Aski arumakipan', NULL, 'saludos', NULL),
(1918, 25, 'Salud (agradecimiento)', 'Jallalla', NULL, 'saludos', NULL),
(1919, 25, 'Muchas gracias', 'Yuspajarpan', NULL, 'saludos', NULL),
(1920, 25, 'Gracias', 'Yuspajaray', NULL, 'saludos', NULL),
(1921, 25, 'No', 'Jani', NULL, 'saludos', NULL),
(1922, 25, 'No es', 'Janiwa', NULL, 'saludos', NULL),
(1923, 25, 'Así es', 'Ukhamawa', NULL, 'saludos', NULL),
(1924, 25, 'Así es siempre', 'Ukhamapiniwa', NULL, 'saludos', NULL),
(1925, 25, 'Muy bien', 'Khusa', NULL, 'saludos', NULL),
(1926, 25, 'Quizás, tal vez', 'Inasa', NULL, 'saludos', NULL),
(1927, 25, 'Sí', 'Ari', NULL, 'saludos', NULL),
(1928, 25, 'Así', 'Ukhama', NULL, 'saludos', NULL),
(1929, 26, 'Yo', 'Naya', NULL, 'presentaciones', NULL),
(1930, 26, 'Tú', 'Juma', NULL, 'presentaciones', NULL),
(1931, 26, 'Él, ella', 'Jupha', NULL, 'presentaciones', NULL),
(1932, 26, 'Nosotros', 'Jiwasa', NULL, 'presentaciones', NULL),
(1933, 26, 'Nombre', 'Suti', NULL, 'presentaciones', NULL),
(1934, 26, 'Mi nombre', 'Sutija', NULL, 'presentaciones', NULL),
(1935, 26, 'Tu nombre', 'Sutima', NULL, 'presentaciones', NULL),
(1936, 26, 'Su nombre', 'Sutipa', NULL, 'presentaciones', NULL),
(1937, 26, 'De dónde eres', 'Kawkinkiritasa', NULL, 'presentaciones', NULL),
(1938, 26, 'Quién', 'Khisti', NULL, 'presentaciones', NULL),
(1939, 26, 'Qué', 'Kuna', NULL, 'presentaciones', NULL),
(1940, 26, 'Dónde', 'Kawki', NULL, 'presentaciones', NULL),
(1941, 26, 'Cómo', 'Kunama', NULL, 'presentaciones', NULL),
(1942, 26, 'Cuándo', 'Kunapacha', NULL, 'presentaciones', NULL),
(1943, 26, 'Hablar', 'Arusiña', NULL, 'presentaciones', NULL),
(1944, 26, 'Dialogar', 'Parlaña', NULL, 'presentaciones', NULL),
(1945, 26, 'Decir', 'Saña', NULL, 'presentaciones', NULL),
(1946, 26, 'Nombrar', 'Sutichaña', NULL, 'presentaciones', NULL),
(1947, 26, 'Pueblo', 'Marka', NULL, 'presentaciones', NULL),
(1948, 26, 'Mi pueblo', 'Markanha', NULL, 'presentaciones', NULL),
(1949, 26, 'Comunidad', 'Ayllu', NULL, 'presentaciones', NULL),
(1950, 26, 'Mi comunidad', 'Ayllunha', NULL, 'presentaciones', NULL),
(1951, 27, 'Hasta vernos', 'Jikisiñkama', NULL, 'despedidas', NULL),
(1952, 27, 'Vamos a irnos', 'Sarxañani', NULL, 'despedidas', NULL),
(1953, 27, 'Regresar', 'Kutiña', NULL, 'despedidas', NULL),
(1954, 27, 'Retorno', 'Kuti', NULL, 'despedidas', NULL),
(1955, 27, 'Ir', 'Saraña', NULL, 'despedidas', NULL),
(1956, 27, 'Venir, llegar', 'Puriña', NULL, 'despedidas', NULL),
(1957, 27, 'Salir', 'Mistuña', NULL, 'despedidas', NULL),
(1958, 27, 'Entrar', 'Mantaña', NULL, 'despedidas', NULL),
(1959, 27, 'Caminar', 'Sarnaqaña', NULL, 'despedidas', NULL),
(1960, 27, 'Salida', 'Jalsu', NULL, 'despedidas', NULL),
(1961, 27, 'Entrada', 'Jalanta', NULL, 'despedidas', NULL),
(1962, 27, 'Camino', 'Thakhi', NULL, 'despedidas', NULL),
(1963, 27, 'Ir de viaje', 'Thakhi saraña', NULL, 'despedidas', NULL),
(1964, 27, 'Buen viaje', 'Suma thakhiru', NULL, 'despedidas', NULL),
(1965, 28, 'Madre', 'Mama', NULL, 'familia', NULL),
(1966, 28, 'Abuelo', 'Jach''a tata', NULL, 'familia', NULL),
(1967, 28, 'Abuela', 'Jach''a mama', NULL, 'familia', NULL),
(1968, 28, 'Señor, padre', 'Tata', NULL, 'familia', NULL),
(1969, 28, 'Padres', 'Tatamama', NULL, 'familia', NULL),
(1970, 28, 'Los padres', 'Awkinaja', NULL, 'familia', NULL),
(1971, 28, 'Con los padres', 'Awkinajanti', NULL, 'familia', NULL),
(1972, 28, 'Mi padre', 'Awkinha', NULL, 'familia', NULL),
(1973, 28, 'A mi padre', 'Awkinharu', NULL, 'familia', NULL),
(1974, 28, 'Tu padre', 'Awkima', NULL, 'familia', NULL),
(1975, 28, 'Su padre', 'Awkipa', NULL, 'familia', NULL),
(1976, 28, 'Al padre', 'Awkiru', NULL, 'familia', NULL),
(1977, 28, 'Nuestro padre', 'Awkisa', NULL, 'familia', NULL),
(1978, 28, 'A mi abuela', 'Jach''a mamanharu', NULL, 'familia', NULL),
(1979, 28, 'De la abuela', 'Jach''a mamata', NULL, 'familia', NULL),
(1980, 28, 'Y tu abuelo', 'Jach''a tatamasti', NULL, 'familia', NULL),
(1981, 28, 'Del abuelo', 'Jach''a tatana', NULL, 'familia', NULL),
(1982, 28, 'Viejo', 'Achachi', NULL, 'familia', NULL),
(1983, 28, 'Vieja', 'Apachi', NULL, 'familia', NULL),
(1984, 28, 'Suegro', 'Awkch''i', NULL, 'familia', NULL),
(1985, 28, 'Suegra', 'Taykch''i', NULL, 'familia', NULL),
(1986, 28, 'Padrino', 'Ichu tata', NULL, 'familia', NULL),
(1987, 28, 'Tía mayor', 'Jilirimama', NULL, 'familia', NULL),
(1988, 28, 'Tío mayor', 'Jiliri tata', NULL, 'familia', NULL),
(1989, 28, 'Tía menor', 'Pichumama', NULL, 'familia', NULL),
(1990, 28, 'Tío menor', 'Pichutata', NULL, 'familia', NULL),
(1991, 28, 'Tío', 'Tiyu', NULL, 'familia', NULL),
(1992, 29, 'Hermano', 'Jilalla', NULL, 'familia', NULL),
(1993, 29, 'Hermano', 'Jilata', NULL, 'familia', NULL),
(1994, 29, 'Hermana', 'Kullalla', NULL, 'familia', NULL),
(1995, 29, 'Hermana', 'Kullaka', NULL, 'familia', NULL),
(1996, 29, 'Hermano menor', 'Sullkiri', NULL, 'familia', NULL),
(1997, 29, 'Hijo joven', 'Yuqa', NULL, 'familia', NULL),
(1998, 29, 'Hija joven', 'Phuchha', NULL, 'familia', NULL),
(1999, 29, 'Nieto', 'Allchhi', NULL, 'familia', NULL),
(2000, 29, 'Bebé, hijo pequeño', 'Wawa', NULL, 'familia', NULL),
(2001, 29, 'Bebecito', 'Waway', NULL, 'familia', NULL),
(2002, 29, 'Hombre, esposo', 'Chacha', NULL, 'familia', NULL),
(2003, 29, 'Mujer, esposa', 'Warmi', NULL, 'familia', NULL),
(2004, 29, 'Joven hombre', 'Wayna', NULL, 'familia', NULL),
(2005, 29, 'Señorita', 'Tawaxu', NULL, 'familia', NULL),
(2006, 29, 'Adolescente', 'Maxt''a', NULL, 'familia', NULL),
(2007, 29, 'Niño pequeño', 'Ch''iti', NULL, 'familia', NULL),
(2008, 29, 'Primogénito', 'Tayna', NULL, 'familia', NULL),
(2009, 29, 'Yerno', 'Tullqa', NULL, 'familia', NULL),
(2010, 29, 'Nuera', 'Yuxch''a', NULL, 'familia', NULL),
(2011, 29, 'Nuera', 'Lluxch''a', NULL, 'familia', NULL),
(2012, 29, 'Huérfano', 'Wajcha', NULL, 'familia', NULL),
(2013, 29, 'Familia, parentesco', 'Wila masi', NULL, 'familia', NULL),
(2014, 29, 'Coterráneo', 'Marka masi', NULL, 'familia', NULL),
(2015, 29, 'Persona íntegra', 'Jaqi', NULL, 'familia', NULL),
(2016, 29, 'Gentío', 'Jaqi jaqi', NULL, 'familia', NULL),
(2017, 29, 'Persona varón', 'Chacha jaqi', NULL, 'familia', NULL),
(2018, 29, 'Pareja hombre mujer', 'Chacha warmi', NULL, 'familia', NULL),
(2019, 29, 'Casarse', 'Jaqichasiña', NULL, 'familia', NULL),
(2020, 29, 'Casado/a', 'Jaqichasita', NULL, 'familia', NULL),
(2021, 29, 'Divorciado', 'Jaljtata', NULL, 'familia', NULL),
(2022, 29, 'Autoridad de la comunidad', 'Jilaqata', NULL, 'familia', NULL),
(2023, 29, 'Mayor, autoridad', 'Jiliri', NULL, 'familia', NULL),
(2024, 29, 'Con los mayores', 'Jilirinakanti', NULL, 'familia', NULL),
(2025, 29, 'Con los hermanos', 'Jilatanakampi', NULL, 'familia', NULL),
(2026, 29, 'A la hermana', 'Kullallaru', NULL, 'familia', NULL),
(2027, 29, 'A mi hermano', 'Jilanharu', NULL, 'familia', NULL),
(2028, 32, 'Amarillo', 'Q''illu', NULL, 'colores', NULL),
(2029, 32, 'Verde', 'Ch''uxña', NULL, 'colores', NULL),
(2030, 32, 'Color', 'Phana', NULL, 'colores', NULL),
(2031, 32, 'Color', 'Sami', NULL, 'colores', NULL),
(2032, 32, 'Colorear', 'Phanachaña', NULL, 'colores', NULL),
(2033, 32, 'De todo color', 'Taqikisa', NULL, 'colores', NULL),
(2034, 32, 'Degradación de colores', 'Kisa', NULL, 'colores', NULL),
(2035, 32, 'Figuras ornamentales en tejidos', 'Salta', NULL, 'colores', NULL),
(2036, 32, 'Bicolor', 'Allqa', NULL, 'colores', NULL),
(2037, 32, 'Celeste', 'Janq''u larama', NULL, 'colores', NULL),
(2038, 32, 'Rosado', 'Janq''u wila', NULL, 'colores', NULL),
(2039, 32, 'Verde oscuro', 'Ch''ara ch''uxña', NULL, 'colores', NULL),
(2040, 32, 'Verde claro', 'Janq''u ch''uxña', NULL, 'colores', NULL),
(2041, 33, 'Negro', 'Ch''ara', NULL, 'colores', NULL),
(2042, 33, 'Blanco', 'Janq''u', NULL, 'colores', NULL),
(2043, 33, 'Café, marrón', 'Ch''umphi', NULL, 'colores', NULL),
(2044, 33, 'Plomo, gris', 'Uqi', NULL, 'colores', NULL),
(2045, 33, 'Naranjo', 'Arumi', NULL, 'colores', NULL),
(2046, 33, 'Naranjo', 'Xaruma', NULL, 'colores', NULL),
(2047, 33, 'Violeta', 'Murturiya', NULL, 'colores', NULL),
(2048, 33, 'Violeta', 'Nakara', NULL, 'colores', NULL),
(2049, 33, 'Oscuro', 'Ch''amaka', NULL, 'colores', NULL),
(2050, 33, 'Oscuro', 'Ch''amaja', NULL, 'colores', NULL),
(2051, 33, 'Claridad', 'Qhana', NULL, 'colores', NULL),
(2052, 33, 'Iluminado', 'Qhanaki', NULL, 'colores', NULL),
(2053, 33, 'Estrellado', 'Wara wara', NULL, 'colores', NULL),
(2054, 33, 'Diamante, ojo zarco', 'Qhispi', NULL, 'colores', NULL),
(2055, 33, 'Arcoíris', 'Kurmi', NULL, 'colores', NULL),
(2056, 33, 'Recogida del arcoíris', 'Kurmita apthapita', NULL, 'colores', NULL),
(2057, 33, 'Bandera multicolor andina', 'Wiphala', NULL, 'colores', NULL),
(2058, 28, 'Cabeza', 'P''iqi', NULL, 'cuerpo', NULL),
(2059, 28, 'Ojo', 'Nayra', NULL, 'cuerpo', NULL),
(2060, 28, 'Ceja', 'Nayra phichu', NULL, 'cuerpo', NULL),
(2061, 28, 'Oreja, oído', 'Jinchu', NULL, 'cuerpo', NULL),
(2062, 28, 'Nariz', 'Nasa', NULL, 'cuerpo', NULL),
(2063, 28, 'Boca', 'Laka', NULL, 'cuerpo', NULL),
(2064, 28, 'Lengua', 'Laxra', NULL, 'cuerpo', NULL),
(2065, 28, 'Diente', 'Laka ch''akha', NULL, 'cuerpo', NULL),
(2066, 28, 'Diente', 'K''achu', NULL, 'cuerpo', NULL),
(2067, 28, 'Muela', 'K''ama', NULL, 'cuerpo', NULL),
(2068, 28, 'Muela del juicio', 'Aqu', NULL, 'cuerpo', NULL),
(2069, 28, 'Bigote', 'Chhunkha', NULL, 'cuerpo', NULL),
(2070, 28, 'Pelo, cabello', 'Lak''uta', NULL, 'cuerpo', NULL),
(2071, 28, 'Pelo, cabello', 'Ñak''uta', NULL, 'cuerpo', NULL),
(2072, 28, 'Frente', 'Para', NULL, 'cuerpo', NULL),
(2073, 28, 'Cara', 'Uñaxa', NULL, 'cuerpo', NULL),
(2074, 28, 'Nuca', 'Ati', NULL, 'cuerpo', NULL),
(2075, 28, 'Cuello', 'Kunka', NULL, 'cuerpo', NULL),
(2076, 28, 'Hombro', 'Kallachi', NULL, 'cuerpo', NULL),
(2077, 28, 'Mano', 'Ampara', NULL, 'cuerpo', NULL),
(2078, 28, 'Manito', 'Amparalla', NULL, 'cuerpo', NULL),
(2079, 28, 'Dedo', 'Luk''ana', NULL, 'cuerpo', NULL),
(2080, 28, 'Uña', 'Sillu', NULL, 'cuerpo', NULL),
(2081, 28, 'Codo', 'Mujlli', NULL, 'cuerpo', NULL),
(2082, 28, 'Espalda', 'Jikhina', NULL, 'cuerpo', NULL),
(2083, 28, 'Estómago', 'Puraja', NULL, 'cuerpo', NULL),
(2084, 28, 'Cadera', 'Thixni', NULL, 'cuerpo', NULL),
(2085, 28, 'Glúteo', 'Ch''ina', NULL, 'cuerpo', NULL),
(2086, 28, 'Pierna', 'Chara', NULL, 'cuerpo', NULL),
(2087, 28, 'Rodilla', 'Qunqura', NULL, 'cuerpo', NULL),
(2088, 28, 'Pie', 'Kayu', NULL, 'cuerpo', NULL),
(2089, 28, 'Corazón', 'Lluqu', NULL, 'cuerpo', NULL),
(2090, 28, 'Corazón', 'Chuyma', NULL, 'cuerpo', NULL),
(2091, 28, 'Hueso', 'Ch''akha', NULL, 'cuerpo', NULL),
(2092, 28, 'Sangre', 'Wila', NULL, 'cuerpo', NULL),
(2093, 28, 'Nervio', 'Anku', NULL, 'cuerpo', NULL),
(2094, 28, 'Pulmón, bofe', 'Chima', NULL, 'cuerpo', NULL),
(2095, 28, 'Hígado', 'K''iwcha', NULL, 'cuerpo', NULL),
(2096, 28, 'Tripa, intestino', 'Jiphilla', NULL, 'cuerpo', NULL),
(2097, 28, 'Riñón', 'Mayruru', NULL, 'cuerpo', NULL),
(2098, 28, 'Seso', 'Lixwi', NULL, 'cuerpo', NULL),
(2099, 28, 'Costilla', 'Xarapi', NULL, 'cuerpo', NULL),
(2100, 28, 'Ombligo', 'Kururu', NULL, 'cuerpo', NULL),
(2101, 28, 'Pezón, teta', 'Ñuñu', NULL, 'cuerpo', NULL),
(2102, 28, 'Esófago', 'Mallq''a', NULL, 'cuerpo', NULL),
(2103, 28, 'Testículo', 'Q''uruta', NULL, 'cuerpo', NULL),
(2104, 28, 'Feto', 'Sullu', NULL, 'cuerpo', NULL),
(2105, 28, 'Útero', 'Jakaña', NULL, 'cuerpo', NULL),
(2106, 28, 'Orina', 'Llaq''a', NULL, 'cuerpo', NULL),
(2107, 28, 'Orina', 'Yaq''a', NULL, 'cuerpo', NULL),
(2108, 28, 'Saliva', 'Llawsa', NULL, 'cuerpo', NULL),
(2109, 28, 'Vómito', 'Axru', NULL, 'cuerpo', NULL),
(2110, 25, 'Tiempo, espacio, mundo', 'Pacha', NULL, 'tiempo', NULL)
ON CONFLICT DO NOTHING;
INSERT INTO vocabulario ("id", "leccion_id", "palabra_espanol", "palabra_objetivo", "audio_url", "categoria", "ejemplo_uso") VALUES
(2111, 25, 'Día', 'Uru', NULL, 'tiempo', NULL),
(2112, 25, 'Noche', 'Arama', NULL, 'tiempo', NULL),
(2113, 25, 'Noche', 'Aruma', NULL, 'tiempo', NULL),
(2114, 25, 'Año', 'Mara', NULL, 'tiempo', NULL),
(2115, 25, 'Hoy', 'Jichhuru', NULL, 'tiempo', NULL),
(2116, 25, 'Ayer', 'Masuru', NULL, 'tiempo', NULL),
(2117, 25, 'Mañana', 'Qharuru', NULL, 'tiempo', NULL),
(2118, 25, 'Antes de ayer', 'Waruru', NULL, 'tiempo', NULL),
(2119, 25, 'Pasado mañana', 'Jurpi uru', NULL, 'tiempo', NULL),
(2120, 25, 'Amanecer', 'Qhantati', NULL, 'tiempo', NULL),
(2121, 25, 'Tarde', 'Jayp''u', NULL, 'tiempo', NULL),
(2122, 25, 'Anochecer', 'Chhaphu', NULL, 'tiempo', NULL),
(2123, 25, 'Medianoche', 'Chika arama', NULL, 'tiempo', NULL),
(2124, 25, 'Medio día', 'Taypi uru', NULL, 'tiempo', NULL),
(2125, 25, 'Ahora', 'Jichha', NULL, 'tiempo', NULL),
(2126, 25, 'Cada día', 'Sapüru', NULL, 'tiempo', NULL),
(2127, 25, 'Antiguo, antes', 'Nayra', NULL, 'tiempo', NULL),
(2128, 25, 'Antiguo', 'Layra', NULL, 'tiempo', NULL),
(2129, 25, 'Atrás, después', 'Qhipha', NULL, 'tiempo', NULL),
(2130, 25, 'Día anterior', 'Qhipha uru', NULL, 'tiempo', NULL),
(2131, 25, 'Salida del sol, Este', 'Inti jalsu', NULL, 'tiempo', NULL),
(2132, 25, 'Puesta del sol, Oeste', 'Inti jalanta', NULL, 'tiempo', NULL),
(2133, 25, 'Salida de la luna', 'Phaxsi jalsu', NULL, 'tiempo', NULL),
(2134, 25, 'Luna llena', 'Urt''a', NULL, 'tiempo', NULL),
(2135, 25, 'Solsticio de invierno', 'Mara t''aqaxta', NULL, 'tiempo', NULL),
(2136, 25, 'Retorno del sol', 'Wilka kutixta', NULL, 'tiempo', NULL),
(2137, 25, 'Día grande', 'Jach''uru', NULL, 'tiempo', NULL),
(2138, 25, 'Día de sol', 'Lupi uru', NULL, 'tiempo', NULL),
(2139, 25, 'Día nublado', 'Ch''ijuni uru', NULL, 'tiempo', NULL),
(2140, 25, 'Día friolento', 'Ch''uñuri uru', NULL, 'tiempo', NULL),
(2141, 25, 'Nuevo', 'Machaxa', NULL, 'tiempo', NULL),
(2142, 25, 'Viejo, usado', 'Thantha', NULL, 'tiempo', NULL),
(2143, 27, 'Arriba, norte', 'Araxa', NULL, 'ubicacion', NULL),
(2144, 27, 'Arriba, norte', 'Alaxa', NULL, 'ubicacion', NULL),
(2145, 27, 'Abajo, sur', 'Aynacha', NULL, 'ubicacion', NULL),
(2146, 27, 'Derecha', 'Kupi', NULL, 'ubicacion', NULL),
(2147, 27, 'Izquierda', 'Ch''iqa', NULL, 'ubicacion', NULL),
(2148, 27, 'Atrás', 'Qhipha', NULL, 'ubicacion', NULL),
(2149, 27, 'Adelante', 'Nayra', NULL, 'ubicacion', NULL),
(2150, 27, 'Cerca', 'Jak''a', NULL, 'ubicacion', NULL),
(2151, 27, 'Lejos', 'Jaya', NULL, 'ubicacion', NULL),
(2152, 27, 'Debajo, adentro', 'Manqha', NULL, 'ubicacion', NULL),
(2153, 27, 'Arriba, encima', 'Patxa', NULL, 'ubicacion', NULL),
(2154, 27, 'Centro, medio', 'Taypi', NULL, 'ubicacion', NULL),
(2155, 27, 'Orilla', 'Thiya', NULL, 'ubicacion', NULL),
(2156, 27, 'Dónde', 'Kawki', NULL, 'ubicacion', NULL),
(2157, 27, 'Hasta dónde', 'Kawkitpacha', NULL, 'ubicacion', NULL),
(2158, 27, 'Los de arriba, parcialidad norte', 'Araxsaya', NULL, 'ubicacion', NULL),
(2159, 27, 'Parcialidad de abajo', 'Manqhasaya', NULL, 'ubicacion', NULL),
(2160, 27, 'Parcialidad de un territorio', 'Saya', NULL, 'ubicacion', NULL),
(2161, 27, 'Región oriental, Este', 'Antisuyu', NULL, 'ubicacion', NULL),
(2162, 27, 'Región poniente', 'Kuntisuyu', NULL, 'ubicacion', NULL),
(2163, 27, 'Región del Tawantinsuyu', 'Chinchaysuyu', NULL, 'ubicacion', NULL),
(2164, 27, 'Región sur', 'Qullasuyu', NULL, 'ubicacion', NULL),
(2165, 27, 'Estado incaico, cuatro regiones', 'Tawantinsuyu', NULL, 'ubicacion', NULL),
(2166, 28, 'Casa', 'Uta', NULL, 'hogar', NULL),
(2167, 28, 'Construir casa', 'Utachaña', NULL, 'hogar', NULL),
(2168, 28, 'Constructor de casas', 'Utachiri', NULL, 'hogar', NULL),
(2169, 28, 'Comunidad', 'Ayllu', NULL, 'hogar', NULL),
(2170, 28, 'En la comunidad', 'Aylluna', NULL, 'hogar', NULL),
(2171, 28, 'Comunidades', 'Ayllunaja', NULL, 'hogar', NULL),
(2172, 28, 'Vivir en comunidad', 'Aylluna qamaña', NULL, 'hogar', NULL),
(2173, 28, 'Pueblo', 'Marka', NULL, 'hogar', NULL),
(2174, 28, 'En el pueblo', 'Markana', NULL, 'hogar', NULL),
(2175, 28, 'Pueblo grande', 'Jach''a Marka', NULL, 'hogar', NULL),
(2176, 28, 'Pueblo pequeño', 'Jisk''a Marka', NULL, 'hogar', NULL),
(2177, 28, 'Pueblo antiguo', 'Layra Marka', NULL, 'hogar', NULL),
(2178, 28, 'Pueblo lejano', 'Jaya Marka', NULL, 'hogar', NULL),
(2179, 28, 'Ir al pueblo', 'Markaru saraña', NULL, 'hogar', NULL),
(2180, 28, 'Fundador de pueblo', 'Markachiri', NULL, 'hogar', NULL),
(2181, 28, 'Territorio familiar', 'Sayaña', NULL, 'hogar', NULL),
(2182, 28, 'Estancia', 'Istanhsa', NULL, 'hogar', NULL),
(2183, 28, 'Majada, campo', 'Anta', NULL, 'hogar', NULL),
(2184, 28, 'En la vivienda de campo', 'Anta utana', NULL, 'hogar', NULL),
(2185, 28, 'Ramada', 'Chhujlla', NULL, 'hogar', NULL),
(2186, 28, 'Corral', 'Uyu', NULL, 'hogar', NULL),
(2187, 28, 'Camino', 'Thakhi', NULL, 'hogar', NULL),
(2188, 28, 'Camino grande', 'Jach''a thakhi', NULL, 'hogar', NULL),
(2189, 28, 'Camino corto', 'Jisk''a thakhi', NULL, 'hogar', NULL),
(2190, 28, 'Camino lejano', 'Jaya thakhi', NULL, 'hogar', NULL),
(2191, 28, 'Constructor de caminos', 'Thakhichiri', NULL, 'hogar', NULL),
(2192, 28, 'Puente', 'Chaka', NULL, 'hogar', NULL),
(2193, 28, 'Olla', 'Phukhu', NULL, 'hogar', NULL),
(2194, 28, 'Frazada', 'Ikiña', NULL, 'hogar', NULL),
(2195, 28, 'Telar', 'Sawu', NULL, 'hogar', NULL),
(2196, 28, 'Huso para hilar', 'Qapu', NULL, 'hogar', NULL),
(2197, 28, 'Canal de regadío', 'Ñiwi', NULL, 'hogar', NULL),
(2198, 28, 'Feria, mercado', 'Qhathu', NULL, 'hogar', NULL),
(2199, 28, 'Reuniones', 'Kawiltu', NULL, 'hogar', NULL),
(2200, 28, 'Libro', 'Panka', NULL, 'hogar', NULL),
(2201, 28, 'Libro', 'Liwru', NULL, 'hogar', NULL),
(2202, 25, 'Madre naturaleza', 'Pachamama', NULL, 'cultura', NULL),
(2203, 25, 'Vivir en la madre naturaleza', 'Pachamamana qamaña', NULL, 'cultura', NULL),
(2204, 25, 'La madre naturaleza habla', 'Pachamama arusiriwa', NULL, 'cultura', NULL),
(2205, 25, 'Se debe escuchar a la madre naturaleza', 'Pachamama ist''añawa', NULL, 'cultura', NULL),
(2206, 25, 'Regazo de la madre naturaleza', 'Pachamama jirphi', NULL, 'cultura', NULL),
(2207, 25, 'Lectura de la naturaleza', 'Pachamama uñaqaña', NULL, 'cultura', NULL),
(2208, 25, 'Cultura', 'Pacha qamasa', NULL, 'cultura', NULL),
(2209, 25, 'Tiempo y espacio cíclico', 'Pachakuti', NULL, 'cultura', NULL),
(2210, 25, 'Este mundo, la naturaleza', 'Akapacha', NULL, 'cultura', NULL),
(2211, 25, 'Mundo de arriba, universo', 'Araqpacha', NULL, 'cultura', NULL),
(2212, 25, 'Mundo de abajo, subsuelo', 'Manqhapacha', NULL, 'cultura', NULL),
(2213, 25, 'Espíritu de antepasados', 'Achachila', NULL, 'cultura', NULL),
(2214, 25, 'Con el espíritu de los antepasados', 'Achachilanajanti', NULL, 'cultura', NULL),
(2215, 25, 'Espíritu, alma', 'Ajayu', NULL, 'cultura', NULL),
(2216, 25, 'Alma', 'Axayu', NULL, 'cultura', NULL),
(2217, 25, 'Espíritu que captura espíritus', 'Ajayu katjiri', NULL, 'cultura', NULL),
(2218, 25, 'Autoridad, ser protector', 'Mallku', NULL, 'cultura', NULL),
(2219, 25, 'Autoridad mayor', 'Jach''a mallku', NULL, 'cultura', NULL),
(2220, 25, 'De las autoridades', 'Mallkunajata', NULL, 'cultura', NULL),
(2221, 25, 'A la autoridad', 'Mallkuru', NULL, 'cultura', NULL),
(2222, 25, 'Autoridad dual hombre/mujer', 'Mallku T''alla', NULL, 'cultura', NULL),
(2223, 25, 'Autoridad mujer', 'T''alla', NULL, 'cultura', NULL),
(2224, 25, 'Sabio', 'Amawta', NULL, 'cultura', NULL),
(2225, 25, 'Sabios', 'Amawtanaja', NULL, 'cultura', NULL),
(2226, 25, 'Sabio, curandero', 'Yatiri', NULL, 'cultura', NULL),
(2227, 25, 'Médico, curandero', 'Qulliri', NULL, 'cultura', NULL),
(2228, 25, 'Curandero andino', 'Chiriwanu', NULL, 'cultura', NULL),
(2229, 25, 'Bandera andina multicolor', 'Wiphala', NULL, 'cultura', NULL),
(2230, 25, 'Cruz andina escalonada', 'Chakana', NULL, 'cultura', NULL),
(2231, 25, 'Reciprocidad', 'Ayni', NULL, 'cultura', NULL),
(2232, 25, 'Buscando reciprocidad', 'Ayni thaqhawi', NULL, 'cultura', NULL),
(2233, 25, 'Persona que busca reciprocidad', 'Aynjasiri jaqi', NULL, 'cultura', NULL),
(2234, 25, 'Trabajo comunitario', 'Mink''a', NULL, 'cultura', NULL),
(2235, 25, 'Carnaval, juego', 'Anata', NULL, 'cultura', NULL),
(2236, 25, 'Reciprocidad en el carnaval', 'Anata ayni', NULL, 'cultura', NULL),
(2237, 25, 'En el carnaval', 'Anatana', NULL, 'cultura', NULL),
(2238, 25, 'Tiempo de carnaval', 'Anatapacha', NULL, 'cultura', NULL),
(2239, 25, 'Bailar carnaval', 'Anata thuqhuña', NULL, 'cultura', NULL),
(2240, 25, 'Música y fiesta', 'Wayñu', NULL, 'cultura', NULL),
(2241, 25, 'Fiesta del ganado', 'Uywa wayñu', NULL, 'cultura', NULL),
(2242, 25, 'Tiempo de festejar a los animales', 'Uywa wayñu pacha', NULL, 'cultura', NULL),
(2243, 25, 'Canción', 'Kirki', NULL, 'cultura', NULL),
(2244, 25, 'Cantar', 'Kirkiña', NULL, 'cultura', NULL),
(2245, 25, 'Bailar', 'Thuqhuña', NULL, 'cultura', NULL),
(2246, 25, 'Cuento, relato, fábula', 'Jawari', NULL, 'cultura', NULL),
(2247, 25, 'Escuchar fábula', 'Jawari ist''aña', NULL, 'cultura', NULL),
(2248, 25, 'Recopilar relatos', 'Jawarinaja apthapiña', NULL, 'cultura', NULL),
(2249, 25, 'Refrán', 'Sawi', NULL, 'cultura', NULL),
(2250, 25, 'Poema', 'Yarawi', NULL, 'cultura', NULL),
(2251, 25, 'Consejo', 'Iwxa', NULL, 'cultura', NULL),
(2252, 25, 'Aconsejar', 'Iwxaña', NULL, 'cultura', NULL),
(2253, 25, 'Consejero', 'Iwjiri', NULL, 'cultura', NULL),
(2254, 25, 'El consejo del mayor', 'Jiliri iwxa', NULL, 'cultura', NULL),
(2255, 25, 'Lugar sagrado del viajero', 'Apachita', NULL, 'cultura', NULL),
(2256, 25, 'Madre apacheta', 'Apachita mama', NULL, 'cultura', NULL),
(2257, 25, 'Hacia la apacheta', 'Apachitaru', NULL, 'cultura', NULL),
(2258, 25, 'Fortaleza sagrada', 'Pukara', NULL, 'cultura', NULL),
(2259, 25, 'Comunidad con lugar ceremonial', 'Pukarani ayllu', NULL, 'cultura', NULL),
(2260, 25, 'Lugar sagrado del agua', 'Juturi', NULL, 'cultura', NULL),
(2261, 25, 'Protector del ganado en bofedales', 'Juturi mallku', NULL, 'cultura', NULL),
(2262, 25, 'Espíritu protector ganadero', 'Uywiri', NULL, 'cultura', NULL),
(2263, 25, 'Autoridad de los espíritus', 'Uywiri mallku', NULL, 'cultura', NULL),
(2264, 25, 'Sacrificio ritual', 'Wilancha', NULL, 'cultura', NULL),
(2265, 25, 'Acto ritual', 'Ch''allaña', NULL, 'cultura', NULL),
(2266, 25, 'Ceremonia con hojas de coca', 'Phawa', NULL, 'cultura', NULL),
(2267, 25, 'Mesa ritual', 'Paqana', NULL, 'cultura', NULL),
(2268, 25, 'Ofrenda de licor', 'T''inkha', NULL, 'cultura', NULL),
(2269, 25, 'Ofrenda, regalo', 'Waxt''a', NULL, 'cultura', NULL),
(2270, 25, 'Ofrendar, regalar', 'Waxt''aña', NULL, 'cultura', NULL),
(2271, 25, 'Purificación ritual', 'Llumpaqasiña', NULL, 'cultura', NULL),
(2272, 25, 'Ceremonia de techado de casa', 'Achuqalla', NULL, 'cultura', NULL),
(2273, 25, 'Bailar en techado de casa', 'Achuqalla thuqhuña', NULL, 'cultura', NULL),
(2274, 25, 'Primer corte de pelo', 'Rutuchi', NULL, 'cultura', NULL),
(2275, 25, 'Canto del matrimonio', 'Kasarata', NULL, 'cultura', NULL),
(2276, 25, 'Celebrar, festejar', 'Uruyaña', NULL, 'cultura', NULL),
(2277, 25, 'Fiesta', 'Uruya', NULL, 'cultura', NULL),
(2278, 25, 'Buen vivir', 'Suma qamaña', NULL, 'cultura', NULL),
(2279, 25, 'Antepasados aymara', 'Chullpa', NULL, 'cultura', NULL),
(2280, 25, 'Petroglifo', 'Qillqata qala', NULL, 'cultura', NULL),
(2281, 25, 'Geoglifo', 'Qillqata uraji', NULL, 'cultura', NULL),
(2282, 25, 'Templo de Tiwanaku', 'Qalasasaya', NULL, 'cultura', NULL),
(2283, 25, 'Quipu', 'Kipu', NULL, 'cultura', NULL),
(2284, 25, 'Deidad de las melodías', 'Sirinu', NULL, 'cultura', NULL),
(2285, 25, 'Nombre de la cultura y lengua', 'Aymara', NULL, 'cultura', NULL),
(2286, 33, 'Ropa', 'Isi', NULL, 'ropa', NULL),
(2287, 33, 'Su forma de vestir', 'Isiñapa', NULL, 'ropa', NULL),
(2288, 33, 'Vestirse', 'Isisiña', NULL, 'ropa', NULL),
(2289, 33, 'Lucir vestimenta', 'Ist''asiña', NULL, 'ropa', NULL),
(2290, 33, 'Manta cuadrada', 'Awayu', NULL, 'ropa', NULL),
(2291, 33, 'Manta, tejido de colores', 'Jawayu', NULL, 'ropa', NULL),
(2292, 33, 'Bolso, manta', 'Xawayu', NULL, 'ropa', NULL),
(2293, 33, 'Poncho', 'Punchu', NULL, 'ropa', NULL),
(2294, 33, 'Gorro de lana', 'Ch''ullu', NULL, 'ropa', NULL),
(2295, 33, 'Bufanda', 'Chalina', NULL, 'ropa', NULL),
(2296, 33, 'Ojota, sandalia', 'Wiskhu', NULL, 'ropa', NULL),
(2297, 33, 'Bolsa para coca', 'Ch''uspa', NULL, 'ropa', NULL),
(2298, 33, 'Chuspa', 'Wistalla', NULL, 'ropa', NULL),
(2299, 33, 'Bolso tejido', 'Wayaqa', NULL, 'ropa', NULL),
(2300, 33, 'Faja de mujer', 'Wak''a', NULL, 'ropa', NULL),
(2301, 33, 'Falda', 'Jirphi', NULL, 'ropa', NULL),
(2302, 33, 'Pantalón', 'P''allqa', NULL, 'ropa', NULL),
(2303, 33, 'Lana', 'T''arwa', NULL, 'ropa', NULL),
(2304, 33, 'Cuero', 'Lip''ichi', NULL, 'ropa', NULL),
(2305, 33, 'Cordón', 'T''isnu', NULL, 'ropa', NULL),
(2306, 33, 'Cuerda para amarrar', 'Pichuña', NULL, 'ropa', NULL),
(2307, 33, 'Arete de lana', 'Sarsillu', NULL, 'ropa', NULL),
(2308, 33, 'Collar de lana', 'Anhu', NULL, 'ropa', NULL),
(2309, 33, 'Adorno de lana para floreo', 'Chimpu', NULL, 'ropa', NULL),
(2310, 33, 'Marca en oreja de animales', 'K''illpha', NULL, 'ropa', NULL)
ON CONFLICT DO NOTHING;
INSERT INTO vocabulario ("id", "leccion_id", "palabra_espanol", "palabra_objetivo", "audio_url", "categoria", "ejemplo_uso") VALUES
(2311, 33, 'Trenza', 'K''ana', NULL, 'ropa', NULL),
(2312, 33, 'Sombrero con plumas', 'Suri chuku', NULL, 'ropa', NULL),
(2313, 33, 'Tejer', 'Sawuña', NULL, 'ropa', NULL),
(2314, 33, 'Tejedora', 'Sawuri', NULL, 'ropa', NULL),
(2315, 33, 'Tejido', 'Sawuta', NULL, 'ropa', NULL),
(2316, 33, 'Hilar', 'Qapuña', NULL, 'ropa', NULL),
(2317, 33, 'Hilandero/a', 'Qapuri', NULL, 'ropa', NULL),
(2318, 33, 'Coser', 'Ch''ukuña', NULL, 'ropa', NULL),
(2319, 33, 'Costurera', 'Ch''ukuri', NULL, 'ropa', NULL),
(2320, 33, 'Madeja', 'Juñi', NULL, 'ropa', NULL),
(2321, 33, 'Ovillo de lana', 'Ch''ankha muruxu', NULL, 'ropa', NULL),
(2322, 33, 'Escritura en tejido', 'Qillqata isi', NULL, 'ropa', NULL),
(2323, 32, 'Zampoña', 'Siku', NULL, 'musica', NULL),
(2324, 32, 'Zampoña', 'Phusa', NULL, 'musica', NULL),
(2325, 32, 'Variedad de zampoña', 'Lakita', NULL, 'musica', NULL),
(2326, 32, 'Grupo musical aymara', 'Sikura', NULL, 'musica', NULL),
(2327, 32, 'Flauta grande', 'Pinkillu', NULL, 'musica', NULL),
(2328, 32, 'Quena', 'Qina', NULL, 'musica', NULL),
(2329, 32, 'Tambor pequeño', 'Wanqara', NULL, 'musica', NULL),
(2330, 32, 'Instrumento tipo guitarra', 'Wantula', NULL, 'musica', NULL),
(2331, 32, 'Baile nortino, cachimbo', 'Kachimpu', NULL, 'musica', NULL),
(2332, 32, 'Canción de marca de animales', 'Jaylli', NULL, 'musica', NULL),
(2333, 32, 'Canto al animal de manchas', 'Chullumpi kirki', NULL, 'musica', NULL),
(2334, 32, 'Canto al pastoreo', 'Awatiri kirki', NULL, 'musica', NULL),
(2335, 32, 'Canción del carnaval', 'Anata kirkiña', NULL, 'musica', NULL),
(2336, 32, 'Cantar a la papa', 'Ch''uqiru kirkiña', NULL, 'musica', NULL),
(2337, 32, 'Cantar a la quínoa', 'Juyraru kirkiña', NULL, 'musica', NULL),
(2338, 26, 'Caminar', 'Sarnaqaña', NULL, 'verbos', NULL),
(2339, 26, 'Ir', 'Saraña', NULL, 'verbos', NULL),
(2340, 26, 'Venir, llegar', 'Puriña', NULL, 'verbos', NULL),
(2341, 26, 'Regresar', 'Kutiña', NULL, 'verbos', NULL),
(2342, 26, 'Salir', 'Mistuña', NULL, 'verbos', NULL),
(2343, 26, 'Entrar', 'Mantaña', NULL, 'verbos', NULL),
(2344, 26, 'Correr', 'Taniña', NULL, 'verbos', NULL),
(2345, 26, 'Saltar', 'Thuqtaña', NULL, 'verbos', NULL),
(2346, 26, 'Caer', 'Tinkuña', NULL, 'verbos', NULL),
(2347, 26, 'Dormir', 'Ikiña', NULL, 'verbos', NULL),
(2348, 26, 'Soñar', 'Samkaña', NULL, 'verbos', NULL),
(2349, 26, 'Descansar', 'Samaraña', NULL, 'verbos', NULL),
(2350, 26, 'Escuchar', 'Ist''aña', NULL, 'verbos', NULL),
(2351, 26, 'Ver, mirar', 'Uñjaña', NULL, 'verbos', NULL),
(2352, 26, 'Observar', 'Uñaqaña', NULL, 'verbos', NULL),
(2353, 26, 'Leer', 'Ullaña', NULL, 'verbos', NULL),
(2354, 26, 'Escribir', 'Qillqaña', NULL, 'verbos', NULL),
(2355, 26, 'Copiar', 'Qillqaqaña', NULL, 'verbos', NULL),
(2356, 26, 'Saber', 'Yatiña', NULL, 'verbos', NULL),
(2357, 26, 'Aprender', 'Yatiqaña', NULL, 'verbos', NULL),
(2358, 26, 'Aprender', 'Yatintaña', NULL, 'verbos', NULL),
(2359, 26, 'Enseñar', 'Yatichaña', NULL, 'verbos', NULL),
(2360, 26, 'Recordar', 'Amtaña', NULL, 'verbos', NULL),
(2361, 26, 'Olvidar', 'Armaña', NULL, 'verbos', NULL),
(2362, 26, 'Olvidar', 'Armt''aña', NULL, 'verbos', NULL),
(2363, 26, 'Pensar, entender', 'Amuyaña', NULL, 'verbos', NULL),
(2364, 26, 'Reflexionar', 'Amayttasiña', NULL, 'verbos', NULL),
(2365, 26, 'Querer, amar', 'Munaña', NULL, 'verbos', NULL),
(2366, 26, 'Odiar', 'Uñisiña', NULL, 'verbos', NULL),
(2367, 26, 'Alegrarse', 'Kusisiña', NULL, 'verbos', NULL),
(2368, 26, 'Entristecerse', 'Llakisiña', NULL, 'verbos', NULL),
(2369, 26, 'Llorar', 'Jachaña', NULL, 'verbos', NULL),
(2370, 26, 'Reír', 'Laruña', NULL, 'verbos', NULL),
(2371, 26, 'Hacer, trabajar', 'Luraña', NULL, 'verbos', NULL),
(2372, 26, 'Vivir, morar', 'Qamaña', NULL, 'verbos', NULL),
(2373, 26, 'Nacer', 'Yuriña', NULL, 'verbos', NULL),
(2374, 26, 'Crecer', 'Jilaña', NULL, 'verbos', NULL),
(2375, 26, 'Morir', 'Jiwaña', NULL, 'verbos', NULL),
(2376, 26, 'Enfermar, dar a luz', 'Usuña', NULL, 'verbos', NULL),
(2377, 26, 'Curar', 'Qullaña', NULL, 'verbos', NULL),
(2378, 26, 'Dar', 'Churaña', NULL, 'verbos', NULL),
(2379, 26, 'Agarrar, recibir', 'Katuña', NULL, 'verbos', NULL),
(2380, 26, 'Recibir', 'Katuqaña', NULL, 'verbos', NULL),
(2381, 26, 'Coger', 'Katjaña', NULL, 'verbos', NULL),
(2382, 26, 'Llevar', 'Apaña', NULL, 'verbos', NULL),
(2383, 26, 'Traer', 'Apaniña', NULL, 'verbos', NULL),
(2384, 26, 'Quitar, arrebatar', 'Aparaña', NULL, 'verbos', NULL),
(2385, 26, 'Sacar', 'Apsuña', NULL, 'verbos', NULL),
(2386, 26, 'Comprar', 'Alaña', NULL, 'verbos', NULL),
(2387, 26, 'Vender', 'Alxaña', NULL, 'verbos', NULL),
(2388, 26, 'Ayudar', 'Yanapaña', NULL, 'verbos', NULL),
(2389, 26, 'Buscar', 'Thaqaña', NULL, 'verbos', NULL),
(2390, 26, 'Encontrar', 'Jiqhataña', NULL, 'verbos', NULL),
(2391, 26, 'Perder', 'Chhaqaña', NULL, 'verbos', NULL),
(2392, 26, 'Hacer perder, borrar', 'Chhaqhayaña', NULL, 'verbos', NULL),
(2393, 26, 'Guardar', 'Imaña', NULL, 'verbos', NULL),
(2394, 26, 'Esconder', 'Imantaña', NULL, 'verbos', NULL),
(2395, 26, 'Barrer, limpiar', 'Pichaña', NULL, 'verbos', NULL),
(2396, 26, 'Lavar', 'T''axsaña', NULL, 'verbos', NULL),
(2397, 26, 'Lavar', 'Q''apiña', NULL, 'verbos', NULL),
(2398, 26, 'Bañarse', 'Jarisiña', NULL, 'verbos', NULL),
(2399, 26, 'Bañarse', 'Phulluqiña', NULL, 'verbos', NULL),
(2400, 26, 'Pastorear', 'Awatiña', NULL, 'verbos', NULL),
(2401, 26, 'Criar animales', 'Uywaña', NULL, 'verbos', NULL),
(2402, 26, 'Arrear un animal', 'Jikhaña', NULL, 'verbos', NULL),
(2403, 26, 'Llevar arreando', 'Anakiña', NULL, 'verbos', NULL),
(2404, 26, 'Tirar animal con cuerda', 'Chhikhaña', NULL, 'verbos', NULL),
(2405, 26, 'Sembrar', 'Sataña', NULL, 'verbos', NULL),
(2406, 26, 'Cosechar', 'Yapuchaña', NULL, 'verbos', NULL),
(2407, 26, 'Cosechar', 'Puquyaña', NULL, 'verbos', NULL),
(2408, 26, 'Cosechar', 'Maq''achaña', NULL, 'verbos', NULL),
(2409, 26, 'Regar', 'Jawiyaña', NULL, 'verbos', NULL),
(2410, 26, 'Recoger granos', 'Pallaña', NULL, 'verbos', NULL),
(2411, 26, 'Construir casa', 'Utachaña', NULL, 'verbos', NULL),
(2412, 26, 'Bailar', 'Thuqhuña', NULL, 'verbos', NULL),
(2413, 26, 'Cantar', 'Kirkiña', NULL, 'verbos', NULL),
(2414, 26, 'Jugar', 'Anataña', NULL, 'verbos', NULL),
(2415, 26, 'Dibujar', 'Jamuqaña', NULL, 'verbos', NULL),
(2416, 26, 'Llamar', 'Jawsaña', NULL, 'verbos', NULL),
(2417, 26, 'Preguntar', 'Chhikhiña', NULL, 'verbos', NULL),
(2418, 26, 'Saludar', 'Aruntaña', NULL, 'verbos', NULL),
(2419, 26, 'Pedir', 'Mayiña', NULL, 'verbos', NULL),
(2420, 26, 'Rogar, suplicar', 'Achikaña', NULL, 'verbos', NULL),
(2421, 26, 'Ganar', 'Atipaña', NULL, 'verbos', NULL),
(2422, 26, 'Terminar', 'Tukuña', NULL, 'verbos', NULL),
(2423, 26, 'Comenzar', 'Qalltaña', NULL, 'verbos', NULL),
(2424, 26, 'Atar, anudar', 'Chinuña', NULL, 'verbos', NULL),
(2425, 26, 'Soltar', 'Chinuqaña', NULL, 'verbos', NULL),
(2426, 26, 'Cerrar', 'Jist''aña', NULL, 'verbos', NULL),
(2427, 26, 'Conocer, reconocer', 'Uñt''aña', NULL, 'verbos', NULL),
(2428, 26, 'Conocer', 'Iñt''aña', NULL, 'verbos', NULL),
(2429, 26, 'Cargar', 'Khumuña', NULL, 'verbos', NULL),
(2430, 26, 'Guiar', 'Irpaña', NULL, 'verbos', NULL),
(2431, 26, 'Visitar', 'Phult''aña', NULL, 'verbos', NULL),
(2432, 26, 'Acariciar', 'Q''ayachiña', NULL, 'verbos', NULL),
(2433, 26, 'Abrazar', 'Qhumaña', NULL, 'verbos', NULL),
(2434, 26, 'Pegar, golpear', 'Nuwaña', NULL, 'verbos', NULL),
(2435, 26, 'Robar', 'Lunthataña', NULL, 'verbos', NULL),
(2436, 26, 'Mentir', 'K''arisiña', NULL, 'verbos', NULL),
(2437, 26, 'Escoger', 'Ajlliña', NULL, 'verbos', NULL),
(2438, 26, 'Recoger, aglutinar', 'Apthapiña', NULL, 'verbos', NULL),
(2439, 26, 'Reunirse', 'Tantachasiña', NULL, 'verbos', NULL),
(2440, 26, 'Encontrarse', 'Jikhisiña', NULL, 'verbos', NULL),
(2441, 26, 'Separar', 'Lakiña', NULL, 'verbos', NULL),
(2442, 26, 'Calentar', 'Junt''uchaña', NULL, 'verbos', NULL),
(2443, 26, 'Callar', 'Amukt''aña', NULL, 'verbos', NULL),
(2444, 26, 'Hacer callar', 'Amuchaña', NULL, 'verbos', NULL),
(2445, 26, 'Unir', 'Mayachaña', NULL, 'verbos', NULL),
(2446, 26, 'Valorar, apreciar', 'Chanichaña', NULL, 'verbos', NULL),
(2447, 26, 'Compadecer', 'Khuyaña', NULL, 'verbos', NULL),
(2448, 26, 'Silbar', 'Khuyuña', NULL, 'verbos', NULL),
(2449, 26, 'Oler', 'Mukhiña', NULL, 'verbos', NULL),
(2450, 26, 'Soplar', 'Phusaña', NULL, 'verbos', NULL),
(2451, 26, 'Llenar', 'Phuqaña', NULL, 'verbos', NULL),
(2452, 26, 'Desinflar', 'Phisayaña', NULL, 'verbos', NULL),
(2453, 26, 'Girar', 'Muyuña', NULL, 'verbos', NULL),
(2454, 26, 'Dar vuelta', 'Muytayaña', NULL, 'verbos', NULL),
(2455, 26, 'Encerrar en círculo', 'Muyuyaña', NULL, 'verbos', NULL),
(2456, 26, 'Sacudir', 'Thalaña', NULL, 'verbos', NULL),
(2457, 26, 'Tributar, colectar', 'Ramaña', NULL, 'verbos', NULL),
(2458, 26, 'Aumentar', 'Yapaña', NULL, 'verbos', NULL),
(2459, 26, 'Probar, examinar', 'Yant''aña', NULL, 'verbos', NULL),
(2460, 29, 'Grande', 'Jach''a', NULL, 'caracteristicas', NULL),
(2461, 29, 'Pequeño', 'Jisk''a', NULL, 'caracteristicas', NULL),
(2462, 29, 'Bonito/a', 'Sumalla', NULL, 'caracteristicas', NULL),
(2463, 29, 'Feo', 'Jaxtaña', NULL, 'caracteristicas', NULL),
(2464, 29, 'Nuevo', 'Machaxa', NULL, 'caracteristicas', NULL),
(2465, 29, 'Viejo, usado', 'Thantha', NULL, 'caracteristicas', NULL),
(2466, 29, 'Caliente', 'Junt''u', NULL, 'caracteristicas', NULL),
(2467, 29, 'Frío', 'Ch''iji', NULL, 'caracteristicas', NULL),
(2468, 29, 'Seco', 'Waña', NULL, 'caracteristicas', NULL),
(2469, 29, 'Mojado', 'Llanch''u', NULL, 'caracteristicas', NULL),
(2470, 29, 'Duro', 'Ch''ikhi', NULL, 'caracteristicas', NULL),
(2471, 29, 'Blando', 'Xasa', NULL, 'caracteristicas', NULL),
(2472, 29, 'Grueso', 'Phathu', NULL, 'caracteristicas', NULL),
(2473, 29, 'Grueso', 'Lankhu', NULL, 'caracteristicas', NULL),
(2474, 29, 'Delgado', 'Sillp''a', NULL, 'caracteristicas', NULL),
(2475, 29, 'Delgado', 'Juch''usu', NULL, 'caracteristicas', NULL),
(2476, 29, 'Delgado', 'P''ili', NULL, 'caracteristicas', NULL),
(2477, 29, 'Flaco', 'Thuk''a', NULL, 'caracteristicas', NULL),
(2478, 29, 'Alegre', 'Kusisita', NULL, 'caracteristicas', NULL),
(2479, 29, 'Triste', 'Llakisita', NULL, 'caracteristicas', NULL),
(2480, 29, 'Enojado', 'Tiputa', NULL, 'caracteristicas', NULL),
(2481, 29, 'Flojo', 'Jayra', NULL, 'caracteristicas', NULL),
(2482, 29, 'Diligente', 'K''unchhi', NULL, 'caracteristicas', NULL),
(2483, 29, 'Ciego', 'Juykhu', NULL, 'caracteristicas', NULL),
(2484, 29, 'Tartamudo', 'Khakha', NULL, 'caracteristicas', NULL),
(2485, 29, 'Dormilón', 'Ikxara', NULL, 'caracteristicas', NULL),
(2486, 29, 'Llorón', 'Jachxara', NULL, 'caracteristicas', NULL),
(2487, 29, 'Llorón', 'Jachawalla', NULL, 'caracteristicas', NULL),
(2488, 29, 'Persona que habla mucho', 'Arusxara', NULL, 'caracteristicas', NULL),
(2489, 29, 'Peleador', 'Nuwasxara', NULL, 'caracteristicas', NULL),
(2490, 29, 'Juguetón', 'Anatxara', NULL, 'caracteristicas', NULL),
(2491, 29, 'Despeinado', 'Ch''aska', NULL, 'caracteristicas', NULL),
(2492, 29, 'Zurdo', 'Ch''iqachu', NULL, 'caracteristicas', NULL),
(2493, 29, 'Crespo', 'Phuru', NULL, 'caracteristicas', NULL),
(2494, 29, 'Pelado', 'Q''ara', NULL, 'caracteristicas', NULL),
(2495, 29, 'Calvicie', 'P''iqi q''ara', NULL, 'caracteristicas', NULL),
(2496, 29, 'Desnudo', 'Q''alatu', NULL, 'caracteristicas', NULL),
(2497, 29, 'Cachetón', 'P''axpaku', NULL, 'caracteristicas', NULL),
(2498, 29, 'Hinchazón', 'P''usuta', NULL, 'caracteristicas', NULL),
(2499, 29, 'Adulador', 'Llunk''u', NULL, 'caracteristicas', NULL),
(2500, 29, 'Charlatán', 'Llawlli', NULL, 'caracteristicas', NULL),
(2501, 29, 'Ladrón', 'Lunthata', NULL, 'caracteristicas', NULL),
(2502, 29, 'Mentira', 'K''ari', NULL, 'caracteristicas', NULL),
(2503, 29, 'Mentiroso', 'K''arisiri', NULL, 'caracteristicas', NULL),
(2504, 29, 'Travieso', 'Chhujraru', NULL, 'caracteristicas', NULL),
(2505, 29, 'Pícaro', 'Paxpuru', NULL, 'caracteristicas', NULL),
(2506, 29, 'Astuto, farsante', 'Sallqa', NULL, 'caracteristicas', NULL),
(2507, 29, 'Indomable', 'Chukara', NULL, 'caracteristicas', NULL),
(2508, 29, 'Inquieto', 'Xalanqachu', NULL, 'caracteristicas', NULL),
(2509, 29, 'Inteligente', 'Patxa p''iqini', NULL, 'caracteristicas', NULL),
(2510, 29, 'Persona inteligente', 'P''iqini jaqi', NULL, 'caracteristicas', NULL)
ON CONFLICT DO NOTHING;
INSERT INTO vocabulario ("id", "leccion_id", "palabra_espanol", "palabra_objetivo", "audio_url", "categoria", "ejemplo_uso") VALUES
(2511, 29, 'De buen corazón', 'Chuymani', NULL, 'caracteristicas', NULL),
(2512, 29, 'Rico, adinerado', 'Qamiri', NULL, 'caracteristicas', NULL),
(2513, 29, 'Inútil', 'Inamaya', NULL, 'caracteristicas', NULL),
(2514, 29, 'Verdad', 'Chiqa', NULL, 'caracteristicas', NULL),
(2515, 29, 'Justo', 'Chiqpa', NULL, 'caracteristicas', NULL),
(2516, 29, 'Culpable', 'Juchani', NULL, 'caracteristicas', NULL),
(2517, 29, 'Inocente', 'Inurinti', NULL, 'caracteristicas', NULL),
(2518, 29, 'Querido', 'Munata', NULL, 'caracteristicas', NULL),
(2519, 29, 'Hediondo', 'Thuska', NULL, 'caracteristicas', NULL),
(2520, 29, 'Malo, peligroso', 'Ñaxu', NULL, 'caracteristicas', NULL),
(2521, 29, 'Tieso', 'Tisi', NULL, 'caracteristicas', NULL),
(2522, 29, 'Resbaloso', 'Llusk''i', NULL, 'caracteristicas', NULL),
(2523, 29, 'Pegajoso', 'Llink''i', NULL, 'caracteristicas', NULL),
(2524, 29, 'Culebroso', 'Link''u link''u', NULL, 'caracteristicas', NULL),
(2525, 29, 'Corredizo', 'Suquri', NULL, 'caracteristicas', NULL),
(2526, 29, 'Desportillado', 'Q''asa', NULL, 'caracteristicas', NULL),
(2527, 29, 'Podredumbre', 'Ñusa', NULL, 'caracteristicas', NULL),
(2528, 29, 'Podrido', 'Ñusata', NULL, 'caracteristicas', NULL),
(2529, 29, 'Rancio', 'Ransu', NULL, 'caracteristicas', NULL),
(2530, 29, 'Animal de pezuña deforme', 'Tala', NULL, 'caracteristicas', NULL),
(2531, 29, 'Infinito', 'Jani tukusiri', NULL, 'caracteristicas', NULL),
(2532, 29, 'Imprevisto, sorpresa', 'Akatamata', NULL, 'caracteristicas', NULL),
(2533, 29, 'Urgente, pronto', 'Jink''a', NULL, 'caracteristicas', NULL),
(2534, 11, 'Saludar', 'Napay', 'https://res.cloudinary.com/dcuvavycy/video/upload/v1766338492/napay_rlmevq.ogg', 'saludos', NULL),
(2535, 11, 'Saludo', 'Napaykuy', 'https://res.cloudinary.com/dcuvavycy/video/upload/v1766338617/napaykuy_c0umnt.ogg', 'saludos', NULL),
(2536, 11, 'Saludos', 'Napaykuna', 'https://res.cloudinary.com/dcuvavycy/video/upload/v1766338716/napaykuna_eyrx6f.ogg', 'saludos', NULL),
(2537, 11, 'Cómo estás', 'Allillanchu', 'https://res.cloudinary.com/dcuvavycy/video/upload/v1766339224/allillanchu_n5wnjx.ogg', 'saludos', NULL),
(2538, 11, 'Estoy bien', 'Allillanmi', 'https://res.cloudinary.com/dcuvavycy/video/upload/v1766339318/allillanmi_jjt2xn.ogg', 'saludos', NULL),
(2539, 11, 'Bien, bueno', 'Allin', NULL, 'saludos', NULL),
(2540, 11, 'Bienestar, salud', 'Allin kay', NULL, 'saludos', NULL),
(2541, 11, 'Sí', 'Ari', NULL, 'saludos', NULL),
(2542, 11, 'No (negación)', 'Mana', NULL, 'saludos', NULL),
(2543, 11, 'No (prohibitivo)', 'Ama', NULL, 'saludos', NULL),
(2544, 11, 'Aceptar, asentir', 'Arí niy', NULL, 'saludos', NULL),
(2545, 11, 'Bueno, bonito, hermoso', 'Sumaq', NULL, 'saludos', NULL),
(2546, 11, 'Bueno, bien', 'Waliq', NULL, 'saludos', NULL),
(2547, 11, 'Bueno', 'Kusa', NULL, 'saludos', NULL),
(2548, 11, 'Gracias', 'Yuspajaray', NULL, 'saludos', NULL),
(2549, 11, 'Muchas gracias', 'Yuspajarpan', NULL, 'saludos', NULL),
(2550, 11, 'Perdón', 'Pampachay', NULL, 'saludos', NULL),
(2551, 11, 'Cuidado', 'Allillawan', NULL, 'saludos', NULL),
(2552, 11, 'Así', 'Jina', NULL, 'saludos', NULL),
(2553, 11, 'Verdadero, cierto', 'Chiqa', NULL, 'saludos', NULL),
(2554, 12, 'Yo', 'Ñuqa', NULL, 'presentaciones', NULL),
(2555, 12, 'Tú, usted', 'Qan', NULL, 'presentaciones', NULL),
(2556, 12, 'Él, ella', 'Pay', NULL, 'presentaciones', NULL),
(2557, 12, 'Nosotros (excluyente)', 'Ñuqayku', NULL, 'presentaciones', NULL),
(2558, 12, 'Nosotros (incluyente)', 'Ñuqanchiq', NULL, 'presentaciones', NULL),
(2559, 12, 'Ellos, ellas', 'Paykuna', NULL, 'presentaciones', NULL),
(2560, 12, 'Nombre', 'Suti', NULL, 'presentaciones', NULL),
(2561, 12, 'Mi nombre', 'Sutiy', NULL, 'presentaciones', NULL),
(2562, 12, 'Nombrar', 'Sutichay', NULL, 'presentaciones', NULL),
(2563, 12, 'Mío', 'Ñuqaq', NULL, 'presentaciones', NULL),
(2564, 12, 'Tuyo', 'Qanpaqta', NULL, 'presentaciones', NULL),
(2565, 12, 'Suyo', 'Paypaqta', NULL, 'presentaciones', NULL),
(2566, 12, 'Nuestro', 'Ñuqaykuq', NULL, 'presentaciones', NULL),
(2567, 12, 'Conmigo', 'Ñuqawan', NULL, 'presentaciones', NULL),
(2568, 12, 'Contigo', 'Qanwan', NULL, 'presentaciones', NULL),
(2569, 12, 'Quién', 'Pi', NULL, 'presentaciones', NULL),
(2570, 12, 'Qué, algo', 'Ima', NULL, 'presentaciones', NULL),
(2571, 12, 'Dónde', 'May', NULL, 'presentaciones', NULL),
(2572, 12, 'Adónde', 'Mayman', NULL, 'presentaciones', NULL),
(2573, 12, 'Cómo', 'Imayna', NULL, 'presentaciones', NULL),
(2574, 12, 'Cuándo', 'Jayk''aq', NULL, 'presentaciones', NULL),
(2575, 12, 'Cuánto', 'Mashkha', NULL, 'presentaciones', NULL),
(2576, 12, 'Cuál', 'Mayqin', NULL, 'presentaciones', NULL),
(2577, 12, 'Cualquier', 'Mayqinllapis', NULL, 'presentaciones', NULL),
(2578, 12, 'Alguien', 'Pipis', NULL, 'presentaciones', NULL),
(2579, 12, 'Hablar, expresar', 'Rimay', NULL, 'presentaciones', NULL),
(2580, 12, 'Dialogar, conversar', 'Rimanakuy', NULL, 'presentaciones', NULL),
(2581, 12, 'Conversar, dialogar', 'Parlay', NULL, 'presentaciones', NULL),
(2582, 12, 'Palabra', 'Rimana', NULL, 'presentaciones', NULL),
(2583, 12, 'Lenguaje, idioma, palabra', 'Simi', NULL, 'presentaciones', NULL),
(2584, 12, 'Idioma quechua', 'Runa simi', NULL, 'presentaciones', NULL),
(2585, 12, 'Pueblo', 'Llaqta', NULL, 'presentaciones', NULL),
(2586, 12, 'Ciudad', 'Jatun llaqta', NULL, 'presentaciones', NULL),
(2587, 12, 'Persona, gente', 'Runa', NULL, 'presentaciones', NULL),
(2588, 12, 'Extranjero', 'Jawa runa', NULL, 'presentaciones', NULL),
(2589, 13, 'Hasta encontrarnos', 'Tupananchikkama', NULL, 'despedidas', NULL),
(2590, 13, 'Hasta pronto', 'Ratukama', NULL, 'despedidas', NULL),
(2591, 13, 'Despedida', 'Kacharpaya', NULL, 'despedidas', NULL),
(2592, 13, 'Despedir', 'Kacharpayay', NULL, 'despedidas', NULL),
(2593, 13, 'Ir', 'Riy', NULL, 'despedidas', NULL),
(2594, 13, 'Andar, caminar', 'Puriy', NULL, 'despedidas', NULL),
(2595, 13, 'Pasear', 'Puriykachay', NULL, 'despedidas', NULL),
(2596, 13, 'Partir, emprender camino', 'Puririy', NULL, 'despedidas', NULL),
(2597, 13, 'Venir', 'Jamuy', NULL, 'despedidas', NULL),
(2598, 13, 'Volver, regresar', 'Kutiy', NULL, 'despedidas', NULL),
(2599, 13, 'Regresar, retornar', 'Kutimuy', NULL, 'despedidas', NULL),
(2600, 13, 'Llegar', 'Chayay', NULL, 'despedidas', NULL),
(2601, 13, 'Salir', 'Lluqsiy', NULL, 'despedidas', NULL),
(2602, 13, 'Salida', 'Lluqsina', NULL, 'despedidas', NULL),
(2603, 13, 'Entrar', 'Yaykuy', NULL, 'despedidas', NULL),
(2604, 13, 'Entrada', 'Yayku', NULL, 'despedidas', NULL),
(2605, 13, 'Camino, ruta', 'Ñan', NULL, 'despedidas', NULL),
(2606, 13, 'Paz', 'Thak', NULL, 'despedidas', NULL),
(2607, 13, 'Descansar, respirar', 'Samay', NULL, 'despedidas', NULL),
(2608, 13, 'Descanso', 'Samana', NULL, 'despedidas', NULL),
(2609, 13, 'Esperar', 'Suyay', NULL, 'despedidas', NULL),
(2610, 13, 'Espera', 'Suya', NULL, 'despedidas', NULL),
(2611, 13, 'Visitar', 'Watukuy', NULL, 'despedidas', NULL),
(2612, 13, 'Encontrarse', 'Tinkunakuy', NULL, 'despedidas', NULL),
(2613, 13, 'Encuentro', 'Tinku', NULL, 'despedidas', NULL)
ON CONFLICT DO NOTHING;
SELECT setval(pg_get_serial_sequence('vocabulario', 'id'), COALESCE((SELECT MAX(id) FROM vocabulario), 1));

-- ejercicios: 285 filas
INSERT INTO ejercicios ("id", "leccion_id", "tipo", "pregunta", "respuesta_correcta", "opciones", "audio_url") VALUES
(59, 21, 'multiple_choice', '¿Qué animal es "Kuntur"?', 'Condor', '["Condor","Puma","Zorro","Oso"]'::jsonb, NULL),
(60, 21, 'multiple_choice', '¿Cómo se dice "Zorro"?', 'Anas', '["Anas","Puma","Kuntur","Ukuku"]'::jsonb, NULL),
(61, 21, 'translate', 'Kuntur', 'Cóndor', NULL, NULL),
(62, 21, 'translate', 'Ukuku', 'Oso andino', NULL, NULL),
(63, 21, 'true_false', '"Puma" es el mismo en Quechua y Español', 'true', NULL, NULL),
(64, 22, 'multiple_choice', '¿Cómo se dice "Papa"?', 'Papa', '["Papa","Sara","Kinuwa","Uchu"]'::jsonb, NULL),
(65, 22, 'multiple_choice', '¿Qué es "Sara"?', 'Maíz', '["Papa","Maíz","Quinua","Ají"]'::jsonb, NULL),
(66, 22, 'translate', 'Papa', 'Papa', NULL, NULL),
(67, 22, 'translate', 'Kinuwa', 'Quinua', NULL, NULL),
(68, 22, 'true_false', '"Sara" significa "Maíz"', 'true', NULL, NULL),
(69, 23, 'multiple_choice', '¿Cómo se dice "Ají"?', 'Uchu', '["Pallar","Uchu","Sara","Papa"]'::jsonb, NULL),
(70, 23, 'multiple_choice', '¿Qué es "Pallar"?', 'Frijol', '["Ají","Papa","Frijol","Maíz"]'::jsonb, NULL),
(71, 23, 'translate', 'Uchu', 'Ají', NULL, NULL),
(72, 23, 'true_false', '"Pallar" es un tipo de frijol', 'true', NULL, NULL),
(399, 11, 'multiple_choice', '¿Cómo se dice Hola en Quechua?', 'Allillanchu', '["Allillanchu","Allin punchay","Tupananchikkama","Ratukama"]'::jsonb, NULL),
(400, 11, 'multiple_choice', '¿Qué significa Allillanmi?', 'Estoy bien', '["Estoy bien","Buenos dias","Hasta luego","Mucho gusto"]'::jsonb, NULL),
(401, 11, 'multiple_choice', '¿Cuál es el saludo para la mañana?', 'Allin punchay', '["Allin punchay","Allin tuta","Allillanchu","Allin sukha"]'::jsonb, NULL),
(402, 11, 'multiple_choice', '¿Cómo dices Buenas noches?', 'Allin tuta', '["Allin tuta","Allin punchay","Allin sukha","Allillanmi"]'::jsonb, NULL),
(403, 11, 'word_order', 'Completa: ___ punchay (Buenos días)', 'Allin', '{"palabras":["Allin","Yana","Puka","Hatun"]}'::jsonb, NULL),
(404, 12, 'multiple_choice', '¿Cómo preguntas Cuál es tu nombre?', 'Iman sutiyki', '["Iman sutiyki","Allillanchu","Maymantan kanki","Imatan ruranki"]'::jsonb, NULL),
(405, 12, 'multiple_choice', 'Para decir Soy de Cusco dices:', 'Cuscomanta kani', '["Cuscomanta kani","Cuscopi kani","Cuscoman rini","Cusco sutiy"]'::jsonb, NULL),
(406, 12, 'multiple_choice', '¿Qué significa Ancha kusikuni?', 'Mucho gusto', '["Mucho gusto","Hasta luego","Buenos dias","Como estas"]'::jsonb, NULL),
(407, 12, 'word_order', 'Mi nombre es Pedro: ___ Pedrom', 'Sutiy', '{"palabras":["Sutiy","Kani","Manta","Rini"]}'::jsonb, NULL),
(408, 13, 'multiple_choice', '¿Qué significa Tupananchikkama?', 'Hasta que nos encontremos', '["Hasta que nos encontremos","Buenos dias","Mucho gusto","Como estas"]'::jsonb, NULL),
(409, 13, 'multiple_choice', '¿Cómo dices Hasta mañana?', 'Qayakama', '["Qayakama","Ratukama","Tupananchikkama","Allin ripuy"]'::jsonb, NULL),
(410, 13, 'multiple_choice', '¿Cuál es una forma de decir Hasta pronto?', 'Ratukama', '["Ratukama","Allin punchay","Allillanmi","Iman sutiyki"]'::jsonb, NULL),
(411, 14, 'multiple_choice', '¿Cómo se dice padre en Quechua?', 'Tayta', '["Tayta","Mama","Wawqi","Churi"]'::jsonb, NULL),
(412, 14, 'multiple_choice', '¿Qué significa Hatun mama?', 'Abuela', '["Abuela","Madre","Tia","Hermana"]'::jsonb, NULL),
(413, 14, 'multiple_choice', '¿Cómo se dice madre?', 'Mama', '["Mama","Tayta","Pani","Turi"]'::jsonb, NULL),
(414, 14, 'word_order', 'Mi ___ (padre) trabaja', 'Tayta', '{"palabras":["Tayta","Mama","Wawqi","Churi"]}'::jsonb, NULL),
(415, 16, 'multiple_choice', '¿Cuánto es Iskay?', '2', '["2","1","3","5"]'::jsonb, NULL),
(416, 16, 'multiple_choice', '¿Cómo se dice 5 en Quechua?', 'Pichqa', '["Pichqa","Tawa","Kimsa","Suqta"]'::jsonb, NULL),
(417, 16, 'multiple_choice', '¿Qué número es Huk?', '1', '["1","2","3","4"]'::jsonb, NULL),
(418, 16, 'word_order', 'Tres en Quechua es ___', 'Kimsa', '{"palabras":["Kimsa","Iskay","Tawa","Huk"]}'::jsonb, NULL),
(419, 17, 'multiple_choice', '¿Cuánto es Chunka?', '10', '["10","7","8","9"]'::jsonb, NULL),
(420, 17, 'multiple_choice', '¿Cómo se dice 7?', 'Qanchis', '["Qanchis","Suqta","Pusaq","Isqun"]'::jsonb, NULL),
(421, 17, 'multiple_choice', '¿Qué número es Pusaq?', '8', '["8","6","7","9"]'::jsonb, NULL),
(422, 18, 'multiple_choice', '¿De qué color es Puka?', 'Rojo', '["Rojo","Azul","Verde","Amarillo"]'::jsonb, NULL),
(423, 18, 'multiple_choice', '¿Cómo se dice amarillo?', 'Qillu', '["Qillu","Puka","Anqas","Qumir"]'::jsonb, NULL),
(424, 18, 'multiple_choice', '¿Qué color es Anqas?', 'Azul', '["Azul","Rojo","Verde","Negro"]'::jsonb, NULL),
(425, 19, 'multiple_choice', '¿Qué color es Yana?', 'Negro', '["Negro","Blanco","Verde","Azul"]'::jsonb, NULL),
(426, 19, 'multiple_choice', '¿Cómo se dice blanco?', 'Yuraq', '["Yuraq","Yana","Qumir","Puka"]'::jsonb, NULL),
(427, 19, 'word_order', 'El color de la nieve es ___', 'Yuraq', '{"palabras":["Yuraq","Yana","Qumir","Puka"]}'::jsonb, NULL),
(428, 20, 'multiple_choice', '¿Cómo se dice perro en Quechua?', 'Allqu', '["Allqu","Michi","Llama","Kuntur"]'::jsonb, NULL),
(429, 20, 'multiple_choice', '¿Qué animal es Michi?', 'Gato', '["Gato","Perro","Llama","Alpaca"]'::jsonb, NULL),
(430, 20, 'multiple_choice', '¿Cómo se dice alpaca?', 'Alpaka', '["Alpaka","Llama","Allqu","Kuntur"]'::jsonb, NULL),
(431, 25, 'multiple_choice', '¿Cómo se dice Cómo estás en Aymara?', 'Kamisaki', '["Kamisaki","Waliki","Aski urukipan","Yuspajaray"]'::jsonb, NULL),
(432, 25, 'multiple_choice', '¿Qué significa Waliki?', 'Estoy bien', '["Estoy bien","Buenos dias","Gracias","Hola"]'::jsonb, NULL),
(433, 25, 'multiple_choice', '¿Cómo dices Buenos días en Aymara?', 'Aski urukipan', '["Aski urukipan","Aski arumankipan","Kamisaki","Waliki"]'::jsonb, NULL),
(434, 25, 'multiple_choice', '¿Cuál es el saludo de la noche?', 'Aski arumankipan', '["Aski arumankipan","Aski urukipan","Aski jayp ukipan","Laphi"]'::jsonb, NULL),
(435, 25, 'word_order', 'Completa: ___ urukipan (Buenos días)', 'Aski', '{"palabras":["Aski","Waliki","Kamisaki","Laphi"]}'::jsonb, NULL),
(436, 26, 'multiple_choice', '¿Cómo dices Mi nombre es en Aymara?', 'Nayan sutija', '["Nayan sutija","Kunasa sutima","Kamisaki","Waliki"]'::jsonb, NULL),
(437, 26, 'multiple_choice', '¿Cómo preguntas Cuál es tu nombre?', 'Kunasa sutima', '["Kunasa sutima","Nayan sutija","Kamisaki","Kusisita"]'::jsonb, NULL),
(438, 26, 'multiple_choice', '¿Qué significa Kusisita?', 'Mucho gusto', '["Mucho gusto","Gracias","Hola","Adios"]'::jsonb, NULL),
(439, 26, 'word_order', 'Mi nombre es María: Nayan ___ María', 'sutija', '{"palabras":["sutija","jutatha","kamisaki","waliki"]}'::jsonb, NULL),
(440, 27, 'multiple_choice', '¿Cómo se dice Hasta luego en Aymara?', 'Jakisiñkama', '["Jakisiñkama","Qharurukama","Yuspajaray","Waliki"]'::jsonb, NULL),
(441, 27, 'multiple_choice', '¿Qué significa Yuspajaray?', 'Gracias', '["Gracias","Hasta luego","Hola","De nada"]'::jsonb, NULL),
(442, 27, 'multiple_choice', '¿Cómo dices Hasta mañana?', 'Qharurukama', '["Qharurukama","Jakisiñkama","Yuspajaray","Waliki"]'::jsonb, NULL),
(443, 28, 'multiple_choice', '¿Cómo se dice Padre en Aymara?', 'Awki', '["Awki","Tayka","Achachila","Awicha"]'::jsonb, NULL),
(444, 28, 'multiple_choice', '¿Qué significa Tayka?', 'Madre', '["Madre","Padre","Abuela","Hermana"]'::jsonb, NULL),
(445, 28, 'multiple_choice', '¿Cómo se dice Abuelo?', 'Achachila', '["Achachila","Awicha","Awki","Tayka"]'::jsonb, NULL),
(446, 28, 'word_order', 'Mi ___ (madre) es buena', 'Tayka', '{"palabras":["Tayka","Awki","Achachila","Awicha"]}'::jsonb, NULL),
(447, 29, 'multiple_choice', '¿Cómo se dice Hermano mayor?', 'Jila', '["Jila","Sullka","Yuqalla","Imilla"]'::jsonb, NULL),
(448, 29, 'multiple_choice', '¿Qué significa Yuqalla?', 'Hijo varon', '["Hijo varon","Hija mujer","Hermano","Padre"]'::jsonb, NULL),
(449, 29, 'multiple_choice', '¿Cómo se dice Hija mujer?', 'Imilla', '["Imilla","Yuqalla","Sullka","Jila"]'::jsonb, NULL),
(450, 30, 'multiple_choice', '¿Cuánto es Maya?', '1', '["1","2","3","4"]'::jsonb, NULL),
(451, 30, 'multiple_choice', '¿Cómo se dice 3 en Aymara?', 'Kimsa', '["Kimsa","Paya","Pusi","Phisqa"]'::jsonb, NULL),
(452, 30, 'multiple_choice', '¿Qué número es Phisqa?', '5', '["5","4","3","2"]'::jsonb, NULL),
(453, 30, 'word_order', 'Dos en Aymara es ___', 'Paya', '{"palabras":["Paya","Maya","Kimsa","Pusi"]}'::jsonb, NULL),
(454, 31, 'multiple_choice', '¿Cuánto es Tunka?', '10', '["10","9","8","7"]'::jsonb, NULL),
(455, 31, 'multiple_choice', '¿Cómo se dice 7 en Aymara?', 'Paqallqu', '["Paqallqu","Suxta","Kimsaqallqu","Llatunka"]'::jsonb, NULL),
(456, 31, 'multiple_choice', '¿Qué número es Suxta?', '6', '["6","7","8","9"]'::jsonb, NULL),
(457, 32, 'multiple_choice', '¿Qué color es Wila?', 'Rojo', '["Rojo","Azul","Verde","Amarillo"]'::jsonb, NULL),
(458, 32, 'multiple_choice', '¿Cómo se dice Azul en Aymara?', 'Larama', '["Larama","Wila","Qillu","Chuxna"]'::jsonb, NULL),
(459, 32, 'multiple_choice', '¿Qué color es Chuxna?', 'Verde', '["Verde","Rojo","Azul","Amarillo"]'::jsonb, NULL),
(460, 33, 'multiple_choice', '¿Qué color es Chiyara?', 'Negro', '["Negro","Blanco","Marron","Rojo"]'::jsonb, NULL),
(461, 33, 'multiple_choice', '¿Cómo se dice Blanco?', 'Janqu', '["Janqu","Chiyara","Chumpi","Wila"]'::jsonb, NULL),
(462, 33, 'word_order', 'La nieve es de color ___', 'Janqu', '{"palabras":["Janqu","Chiyara","Wila","Larama"]}'::jsonb, NULL),
(463, 34, 'multiple_choice', '¿Cómo se dice Llama en Aymara?', 'Qawra', '["Qawra","Allpachu","Anu","Phisi"]'::jsonb, NULL),
(464, 34, 'multiple_choice', '¿Qué animal es Anu?', 'Perro', '["Perro","Gato","Llama","Alpaca"]'::jsonb, NULL),
(465, 34, 'multiple_choice', '¿Cómo se dice Gato?', 'Phisi', '["Phisi","Anu","Qawra","Allpachu"]'::jsonb, NULL),
(466, 35, 'multiple_choice', '¿Qué animal es Kunturi?', 'Condor', '["Condor","Puma","Zorro","Oso"]'::jsonb, NULL),
(467, 35, 'multiple_choice', '¿Cómo se dice Zorro en Aymara?', 'Qamaqi', '["Qamaqi","Kunturi","Puma","Jukumari"]'::jsonb, NULL),
(468, 35, 'multiple_choice', '¿Qué animal es Jukumari?', 'Oso andino', '["Oso andino","Condor","Puma","Zorro"]'::jsonb, NULL),
(469, 36, 'multiple_choice', '¿Cómo se dice Papa en Aymara?', 'Chuqi', '["Chuqi","Tunqu","Jupha","Uma"]'::jsonb, NULL),
(470, 36, 'multiple_choice', '¿Qué alimento es Jupha?', 'Quinua', '["Quinua","Papa","Maiz","Agua"]'::jsonb, NULL),
(471, 36, 'multiple_choice', '¿Cómo se dice Agua?', 'Uma', '["Uma","Chuqi","Tunqu","Jupha"]'::jsonb, NULL),
(472, 37, 'multiple_choice', '¿Cómo se dice Carne en Aymara?', 'Aycha', '["Aycha","Challwa","Tanta","Jallpa"]'::jsonb, NULL),
(473, 37, 'multiple_choice', '¿Qué alimento es Tanta?', 'Pan', '["Pan","Carne","Pescado","Aji"]'::jsonb, NULL),
(474, 37, 'multiple_choice', '¿Cómo se dice Ají?', 'Jallpa', '["Jallpa","Aycha","Challwa","Tanta"]'::jsonb, NULL),
(475, 11, 'multiple_choice', '¿Cómo se dice "Buenos días" en Quechua?', 'Allin punchay', '["Allin tuta","Allin punchay","Allin sukha","Napaykullayki"]'::jsonb, NULL),
(476, 11, 'multiple_choice', '¿Qué significa "Allin sukha"?', 'Buenas tardes', '["Buenos días","Buenas noches","Buenas tardes","Hola"]'::jsonb, NULL),
(477, 11, 'multiple_choice', '¿Cuál es el saludo para la noche?', 'Allin tuta', '["Allin punchay","Allin sukha","Allin tuta","Allillanchu"]'::jsonb, NULL),
(478, 11, 'translate', 'Allin punchay', 'Buenos días', NULL, NULL),
(479, 11, 'translate', 'Allin tuta', 'Buenas noches', NULL, NULL),
(480, 11, 'translate', 'Allillanchu', 'Cómo estás', NULL, NULL),
(481, 11, 'true_false', '"Allin punchay" significa "Buenas noches"', 'false', NULL, NULL),
(482, 11, 'true_false', '"Allin sukha" es el saludo de la tarde', 'true', NULL, NULL),
(483, 11, 'true_false', '"Allillanmi" significa "Estoy bien"', 'true', NULL, NULL),
(484, 11, 'fill_blanks', 'Para decir buenos días decimos: Allin ___', '["punchay"]', NULL, NULL),
(485, 11, 'fill_blanks', 'Para responder "estoy bien" decimos: ___', '["Allillanmi"]', NULL, NULL),
(486, 11, 'matching', 'Une cada saludo con su significado', '{"Allin punchay": "Buenos días", "Allin sukha": "Buenas tardes", "Allin tuta": "Buenas noches"}', '{"columna_derecha":["Buenos días","Buenas tardes","Buenas noches"],"columna_izquierda":["Allin punchay","Allin sukha","Allin tuta"]}'::jsonb, NULL),
(487, 11, 'word_order', 'Ordena las palabras para decir "Buenos días, señor"', '["Allin", "punchay", "tayta"]', '{"palabras":["tayta","Allin","punchay"]}'::jsonb, NULL),
(488, 12, 'multiple_choice', '¿Cómo preguntas "¿Cómo te llamas?" en Quechua?', 'Imataq sutiyki?', '["Imataq sutiyki?","Maymantataq kanki?","Haykaq kanki?","Pitaq kanki?"]'::jsonb, NULL),
(489, 12, 'multiple_choice', '¿Qué significa "Nuqap sutiyqa ... kanmi"?', 'Mi nombre es...', '["¿Cómo te llamas?","Mi nombre es...","¿De dónde eres?","Mucho gusto"]'::jsonb, NULL),
(490, 12, 'translate', 'Imataq sutiyki?', 'Cómo te llamas', NULL, NULL),
(491, 12, 'translate', 'Nuqap sutiyqa Maria kanmi', 'Mi nombre es Maria', NULL, NULL),
(492, 12, 'true_false', '"Sutiyki" significa "tu nombre"', 'true', NULL, NULL),
(493, 12, 'true_false', '"Nuqa" significa "tú"', 'false', NULL, NULL),
(494, 12, 'fill_blanks', 'Para decir "Mi nombre es Juan": Nuqap sutiyqa ___ kanmi', '["Juan"]', NULL, NULL),
(495, 13, 'multiple_choice', '¿Cómo se dice "Adiós" en Quechua?', 'Tupananchikkama', '["Allillanchu","Tupananchikkama","Allin punchay","Yuspajaray"]'::jsonb, NULL),
(496, 13, 'multiple_choice', '¿Qué significa "Qhipaman"?', 'Hasta luego', '["Adiós","Hasta luego","Buenos días","Gracias"]'::jsonb, NULL),
(497, 13, 'translate', 'Tupananchikkama', 'Adiós', NULL, NULL),
(498, 13, 'translate', 'Qhipaman', 'Hasta luego', NULL, NULL),
(499, 13, 'true_false', '"Tupananchikkama" es una forma formal de despedirse', 'true', NULL, NULL),
(500, 13, 'matching', 'Une cada despedida con su significado', '{"Tupananchikkama": "Adiós", "Qhipaman": "Hasta luego", "Yuspajaray": "Gracias"}', '{"columna_derecha":["Adiós","Hasta luego","Gracias"],"columna_izquierda":["Tupananchikkama","Qhipaman","Yuspajaray"]}'::jsonb, NULL),
(501, 14, 'multiple_choice', '¿Cómo se dice "Padre" en Quechua?', 'Tayta', '["Mama","Tayta","Wawa","Turi"]'::jsonb, NULL),
(502, 14, 'multiple_choice', '¿Qué significa "Mama"?', 'Madre', '["Padre","Madre","Abuela","Hermana"]'::jsonb, NULL),
(503, 14, 'multiple_choice', '¿Cómo se dice "Abuelo" en Quechua?', 'Hatun tayta', '["Tayta","Hatun tayta","Hatun mama","Wawa"]'::jsonb, NULL),
(504, 14, 'translate', 'Tayta', 'Padre', NULL, NULL),
(505, 14, 'translate', 'Mama', 'Madre', NULL, NULL),
(506, 14, 'translate', 'Hatun mama', 'Abuela', NULL, NULL),
(507, 14, 'true_false', '"Hatun tayta" significa "Abuelo"', 'true', NULL, NULL),
(508, 14, 'true_false', '"Tayta" significa "Madre"', 'false', NULL, NULL),
(509, 14, 'matching', 'Une cada palabra con su significado', '{"Tayta": "Padre", "Mama": "Madre", "Hatun tayta": "Abuelo", "Hatun mama": "Abuela"}', '{"columna_derecha":["Padre","Madre","Abuelo","Abuela"],"columna_izquierda":["Tayta","Mama","Hatun tayta","Hatun mama"]}'::jsonb, NULL),
(510, 15, 'multiple_choice', '¿Cómo se dice "Hermano" (de varón a varón)?', 'Wawqi', '["Nana","Pana","Wawqi","Turi"]'::jsonb, NULL),
(511, 15, 'multiple_choice', '¿Qué significa "Wawa"?', 'Hijo o Bebe', '["Hermano","Padre","Hijo o Bebe","Abuelo"]'::jsonb, NULL),
(512, 15, 'translate', 'Wawqi', 'Hermano', NULL, NULL),
(513, 15, 'translate', 'Wawa', 'Hijo', NULL, NULL),
(514, 15, 'translate', 'Nana', 'Hermana', NULL, NULL),
(515, 15, 'true_false', '"Wawqi" es hermano de varón a varón', 'true', NULL, NULL),
(516, 16, 'multiple_choice', '¿Cómo se dice "Uno" en Quechua?', 'Huk', '["Iskay","Huk","Kimsa","Tawa"]'::jsonb, NULL),
(517, 16, 'multiple_choice', '¿Qué número es "Kimsa"?', '3', '["1","2","3","4"]'::jsonb, NULL),
(518, 16, 'multiple_choice', '¿Cómo se dice "Cinco" en Quechua?', 'Pichqa', '["Tawa","Pichqa","Suqta","Qanchis"]'::jsonb, NULL),
(519, 16, 'translate', 'Huk', '1', NULL, NULL),
(520, 16, 'translate', 'Iskay', '2', NULL, NULL),
(521, 16, 'translate', 'Kimsa', '3', NULL, NULL),
(522, 16, 'translate', 'Tawa', '4', NULL, NULL),
(523, 16, 'translate', 'Pichqa', '5', NULL, NULL),
(524, 16, 'true_false', '"Iskay" significa "Dos"', 'true', NULL, NULL),
(525, 16, 'true_false', '"Tawa" significa "Cinco"', 'false', NULL, NULL),
(526, 16, 'matching', 'Une cada número con su traducción', '{"Huk": "1", "Iskay": "2", "Kimsa": "3", "Tawa": "4", "Pichqa": "5"}', '{"columna_derecha":["1","2","3","4","5"],"columna_izquierda":["Huk","Iskay","Kimsa","Tawa","Pichqa"]}'::jsonb, NULL),
(527, 16, 'fill_blanks', 'Cuenta: Huk, Iskay, ___, Tawa, Pichqa', '["Kimsa"]', NULL, NULL),
(528, 17, 'multiple_choice', '¿Cómo se dice "Seis" en Quechua?', 'Suqta', '["Pichqa","Suqta","Qanchis","Pusaq"]'::jsonb, NULL),
(529, 17, 'multiple_choice', '¿Qué número es "Chunka"?', '10', '["7","8","9","10"]'::jsonb, NULL),
(530, 17, 'multiple_choice', '¿Cómo se dice "Ocho" en Quechua?', 'Pusaq', '["Qanchis","Pusaq","Isqun","Chunka"]'::jsonb, NULL),
(531, 17, 'translate', 'Suqta', '6', NULL, NULL),
(532, 17, 'translate', 'Qanchis', '7', NULL, NULL),
(533, 17, 'translate', 'Pusaq', '8', NULL, NULL),
(534, 17, 'translate', 'Isqun', '9', NULL, NULL),
(535, 17, 'translate', 'Chunka', '10', NULL, NULL),
(536, 17, 'true_false', '"Chunka" significa "Diez"', 'true', NULL, NULL),
(537, 17, 'matching', 'Une cada número con su traducción', '{"Suqta": "6", "Qanchis": "7", "Pusaq": "8", "Isqun": "9", "Chunka": "10"}', '{"columna_derecha":["6","7","8","9","10"],"columna_izquierda":["Suqta","Qanchis","Pusaq","Isqun","Chunka"]}'::jsonb, NULL),
(538, 18, 'multiple_choice', '¿Cómo se dice "Rojo" en Quechua?', 'Puka', '["Qillu","Puka","Anqas","Yana"]'::jsonb, NULL),
(539, 18, 'multiple_choice', '¿Qué color es "Qillu"?', 'Amarillo', '["Rojo","Azul","Amarillo","Verde"]'::jsonb, NULL),
(540, 18, 'multiple_choice', '¿Cómo se dice "Azul" en Quechua?', 'Anqas', '["Puka","Qillu","Anqas","Qumir"]'::jsonb, NULL),
(541, 18, 'translate', 'Puka', 'Rojo', NULL, NULL),
(542, 18, 'translate', 'Qillu', 'Amarillo', NULL, NULL),
(543, 18, 'translate', 'Anqas', 'Azul', NULL, NULL),
(544, 18, 'true_false', '"Puka" significa "Rojo"', 'true', NULL, NULL),
(545, 18, 'true_false', '"Qillu" significa "Azul"', 'false', NULL, NULL),
(546, 18, 'matching', 'Une cada color con su traducción', '{"Puka": "Rojo", "Qillu": "Amarillo", "Anqas": "Azul"}', '{"columna_derecha":["Rojo","Amarillo","Azul"],"columna_izquierda":["Puka","Qillu","Anqas"]}'::jsonb, NULL),
(547, 19, 'multiple_choice', '¿Cómo se dice "Verde" en Quechua?', 'Qumir', '["Yana","Yuraq","Qumir","Uqi"]'::jsonb, NULL),
(548, 19, 'multiple_choice', '¿Qué color es "Yana"?', 'Negro', '["Blanco","Negro","Marron","Gris"]'::jsonb, NULL),
(549, 19, 'multiple_choice', '¿Cómo se dice "Blanco" en Quechua?', 'Yuraq', '["Yana","Yuraq","Qumir","Puka"]'::jsonb, NULL),
(550, 19, 'translate', 'Qumir', 'Verde', NULL, NULL),
(551, 19, 'translate', 'Yana', 'Negro', NULL, NULL),
(552, 19, 'translate', 'Yuraq', 'Blanco', NULL, NULL),
(553, 19, 'true_false', '"Qumir" significa "Verde"', 'true', NULL, NULL),
(554, 19, 'true_false', '"Yuraq" significa "Negro"', 'false', NULL, NULL),
(555, 19, 'matching', 'Une cada color con su traducción', '{"Qumir": "Verde", "Yana": "Negro", "Yuraq": "Blanco"}', '{"columna_derecha":["Verde","Negro","Blanco"],"columna_izquierda":["Qumir","Yana","Yuraq"]}'::jsonb, NULL),
(556, 20, 'multiple_choice', '¿Cómo se dice "Perro" en Quechua?', 'Allqu', '["Michi","Allqu","Wallpa","Kuchi"]'::jsonb, NULL),
(557, 20, 'multiple_choice', '¿Qué animal es "Michi"?', 'Gato', '["Perro","Gato","Gallina","Chancho"]'::jsonb, NULL),
(558, 20, 'multiple_choice', '¿Cómo se dice "Llama" en Quechua?', 'Llama', '["Alpaka","Llama","Wikuna","Kuntur"]'::jsonb, NULL),
(559, 20, 'translate', 'Allqu', 'Perro', NULL, NULL),
(560, 20, 'translate', 'Michi', 'Gato', NULL, NULL),
(561, 20, 'translate', 'Wallpa', 'Gallina', NULL, NULL),
(562, 20, 'translate', 'Kuchi', 'Chancho', NULL, NULL),
(563, 20, 'true_false', '"Allqu" significa "Perro"', 'true', NULL, NULL),
(564, 20, 'true_false', '"Michi" significa "Perro"', 'false', NULL, NULL),
(565, 20, 'matching', 'Une cada animal con su traducción', '{"Allqu": "Perro", "Michi": "Gato", "Wallpa": "Gallina", "Kuchi": "Chancho"}', '{"columna_derecha":["Perro","Gato","Gallina","Chancho"],"columna_izquierda":["Allqu","Michi","Wallpa","Kuchi"]}'::jsonb, NULL),
(566, 25, 'translate', 'Kamisaki', 'Cómo estás', NULL, NULL),
(567, 25, 'translate', 'Waliki', 'Bien', NULL, NULL),
(568, 25, 'translate', 'Aski urukipan', 'Buenos días', NULL, NULL),
(569, 25, 'true_false', '"Kamisaki" significa "Buenos días"', 'false', NULL, NULL),
(570, 25, 'true_false', '"Waliki" significa "Bien"', 'true', NULL, NULL),
(571, 25, 'fill_blanks', 'Para decir "Cómo estás" en Aymara decimos: ___', '["Kamisaki"]', NULL, NULL),
(572, 25, 'matching', 'Une cada saludo con su significado', '{"Kamisaki": "Cómo estás", "Waliki": "Bien", "Aski urukipan": "Buenos días"}', '{"columna_derecha":["Cómo estás","Bien","Buenos días"],"columna_izquierda":["Kamisaki","Waliki","Aski urukipan"]}'::jsonb, NULL),
(573, 26, 'translate', 'Nayan sutija', 'Mi nombre es', NULL, NULL),
(574, 26, 'translate', 'Kunjamasktasa', 'Cómo te llamas', NULL, NULL),
(575, 26, 'true_false', '"Nayan sutija" significa "Mi nombre es"', 'true', NULL, NULL),
(576, 26, 'true_false', '"Kunjamasktasa" significa "Adiós"', 'false', NULL, NULL),
(577, 26, 'fill_blanks', 'Para decir "Mi nombre es Juan": Nayan ___ Juan', '["sutija"]', NULL, NULL),
(578, 26, 'matching', 'Une cada frase con su significado', '{"Nayan sutija": "Mi nombre es", "Kunjamasktasa": "Cómo te llamas"}', '{"columna_derecha":["Mi nombre es","Cómo te llamas"],"columna_izquierda":["Nayan sutija","Kunjamasktasa"]}'::jsonb, NULL),
(579, 27, 'translate', 'Jakisiñkama', 'Hasta luego', NULL, NULL),
(580, 27, 'translate', 'Jikisiñkama', 'Nos vemos', NULL, NULL),
(581, 27, 'true_false', '"Jakisiñkama" es una despedida en Aymara', 'true', NULL, NULL),
(582, 27, 'true_false', '"Jikisiñkama" significa "Hola"', 'false', NULL, NULL),
(583, 27, 'fill_blanks', 'Para despedirse decimos: ___', '["Jakisiñkama"]', NULL, NULL),
(584, 27, 'matching', 'Une cada despedida con su significado', '{"Jakisiñkama": "Hasta luego", "Jikisiñkama": "Nos vemos"}', '{"columna_derecha":["Hasta luego","Nos vemos"],"columna_izquierda":["Jakisiñkama","Jikisiñkama"]}'::jsonb, NULL)
ON CONFLICT DO NOTHING;
INSERT INTO ejercicios ("id", "leccion_id", "tipo", "pregunta", "respuesta_correcta", "opciones", "audio_url") VALUES
(585, 27, 'word_order', 'Selecciona "Hasta luego"', '["Jakisiñkama"]', '{"palabras":["Jakisiñkama","Waliki","Kamisaki"]}'::jsonb, NULL),
(586, 28, 'translate', 'Awki', 'Padre', NULL, NULL),
(587, 28, 'translate', 'Tayka', 'Madre', NULL, NULL),
(588, 28, 'translate', 'Achachila', 'Abuelo', NULL, NULL),
(589, 28, 'translate', 'Awicha', 'Abuela', NULL, NULL),
(590, 28, 'true_false', '"Awki" significa "Padre"', 'true', NULL, NULL),
(591, 28, 'true_false', '"Tayka" significa "Abuelo"', 'false', NULL, NULL),
(592, 28, 'fill_blanks', 'Mi padre en Aymara es: ___', '["Awki"]', NULL, NULL),
(593, 28, 'matching', 'Une cada palabra con su significado', '{"Awki": "Padre", "Tayka": "Madre", "Achachila": "Abuelo", "Awicha": "Abuela"}', '{"columna_derecha":["Padre","Madre","Abuelo","Abuela"],"columna_izquierda":["Awki","Tayka","Achachila","Awicha"]}'::jsonb, NULL),
(594, 29, 'translate', 'Jila', 'Hermano mayor', NULL, NULL),
(595, 29, 'translate', 'Kullaka', 'Hermana', NULL, NULL),
(596, 29, 'translate', 'Wawa', 'Hijo', NULL, NULL),
(597, 29, 'true_false', '"Jila" significa "Hermano mayor"', 'true', NULL, NULL),
(598, 29, 'true_false', '"Wawa" significa "Padre"', 'false', NULL, NULL),
(599, 29, 'fill_blanks', 'Mi hermana en Aymara es: ___', '["Kullaka"]', NULL, NULL),
(600, 29, 'matching', 'Une cada palabra con su significado', '{"Jila": "Hermano mayor", "Kullaka": "Hermana", "Wawa": "Hijo"}', '{"columna_derecha":["Hermano mayor","Hermana","Hijo"],"columna_izquierda":["Jila","Kullaka","Wawa"]}'::jsonb, NULL),
(601, 29, 'word_order', 'Selecciona "Hermana"', '["Kullaka"]', '{"palabras":["Kullaka","Jila","Wawa","Awki"]}'::jsonb, NULL),
(602, 30, 'translate', 'Maya', '1', NULL, NULL),
(603, 30, 'translate', 'Paya', '2', NULL, NULL),
(604, 30, 'translate', 'Kimsa', '3', NULL, NULL),
(605, 30, 'translate', 'Pusi', '4', NULL, NULL),
(606, 30, 'translate', 'Phisqa', '5', NULL, NULL),
(607, 30, 'true_false', '"Maya" significa "Uno"', 'true', NULL, NULL),
(608, 30, 'true_false', '"Paya" significa "Tres"', 'false', NULL, NULL),
(609, 30, 'fill_blanks', 'El número 3 en Aymara es: ___', '["Kimsa"]', NULL, NULL),
(610, 30, 'matching', 'Une cada número con su traducción', '{"Maya": "1", "Paya": "2", "Kimsa": "3", "Pusi": "4", "Phisqa": "5"}', '{"columna_derecha":["1","2","3","4","5"],"columna_izquierda":["Maya","Paya","Kimsa","Pusi","Phisqa"]}'::jsonb, NULL),
(611, 31, 'translate', 'Suxta', '6', NULL, NULL),
(612, 31, 'translate', 'Paqallqu', '7', NULL, NULL),
(613, 31, 'translate', 'Kimsaqallqu', '8', NULL, NULL),
(614, 31, 'translate', 'Llatunka', '9', NULL, NULL),
(615, 31, 'translate', 'Tunka', '10', NULL, NULL),
(616, 31, 'true_false', '"Tunka" significa "Diez"', 'true', NULL, NULL),
(617, 31, 'true_false', '"Suxta" significa "Ocho"', 'false', NULL, NULL),
(618, 31, 'fill_blanks', 'El número 10 en Aymara es: ___', '["Tunka"]', NULL, NULL),
(619, 31, 'matching', 'Une cada número con su traducción', '{"Suxta": "6", "Paqallqu": "7", "Kimsaqallqu": "8", "Llatunka": "9", "Tunka": "10"}', '{"columna_derecha":["6","7","8","9","10"],"columna_izquierda":["Suxta","Paqallqu","Kimsaqallqu","Llatunka","Tunka"]}'::jsonb, NULL),
(620, 31, 'word_order', 'Selecciona el número 7', '["Paqallqu"]', '{"palabras":["Paqallqu","Suxta","Tunka","Kimsa"]}'::jsonb, NULL),
(621, 32, 'translate', 'Wila', 'Rojo', NULL, NULL),
(622, 32, 'translate', 'Qillu', 'Amarillo', NULL, NULL),
(623, 32, 'translate', 'Larama', 'Azul', NULL, NULL),
(624, 32, 'true_false', '"Wila" significa "Rojo"', 'true', NULL, NULL),
(625, 32, 'true_false', '"Qillu" significa "Azul"', 'false', NULL, NULL),
(626, 32, 'fill_blanks', 'El color rojo en Aymara es: ___', '["Wila"]', NULL, NULL),
(627, 32, 'matching', 'Une cada color con su traducción', '{"Wila": "Rojo", "Qillu": "Amarillo", "Larama": "Azul"}', '{"columna_derecha":["Rojo","Amarillo","Azul"],"columna_izquierda":["Wila","Qillu","Larama"]}'::jsonb, NULL),
(628, 32, 'word_order', 'Selecciona el color amarillo', '["Qillu"]', '{"palabras":["Qillu","Wila","Larama","Janqu"]}'::jsonb, NULL),
(629, 33, 'translate', 'Chuxna', 'Verde', NULL, NULL),
(630, 33, 'translate', 'Chiyara', 'Negro', NULL, NULL),
(631, 33, 'translate', 'Janqu', 'Blanco', NULL, NULL),
(632, 33, 'true_false', '"Chuxna" significa "Verde"', 'true', NULL, NULL),
(633, 33, 'true_false', '"Janqu" significa "Negro"', 'false', NULL, NULL),
(634, 33, 'fill_blanks', 'El color blanco en Aymara es: ___', '["Janqu"]', NULL, NULL),
(635, 33, 'matching', 'Une cada color con su traducción', '{"Chuxna": "Verde", "Chiyara": "Negro", "Janqu": "Blanco"}', '{"columna_derecha":["Verde","Negro","Blanco"],"columna_izquierda":["Chuxna","Chiyara","Janqu"]}'::jsonb, NULL),
(636, 34, 'translate', 'Anu', 'Perro', NULL, NULL),
(637, 34, 'translate', 'Phisi', 'Gato', NULL, NULL),
(638, 34, 'translate', 'Wallpa', 'Gallina', NULL, NULL),
(639, 34, 'translate', 'Khuchi', 'Chancho', NULL, NULL),
(640, 34, 'true_false', '"Anu" significa "Perro"', 'true', NULL, NULL),
(641, 34, 'true_false', '"Phisi" significa "Gallina"', 'false', NULL, NULL),
(642, 34, 'fill_blanks', 'El perro en Aymara es: ___', '["Anu"]', NULL, NULL),
(643, 34, 'matching', 'Une cada animal con su traducción', '{"Anu": "Perro", "Phisi": "Gato", "Wallpa": "Gallina", "Khuchi": "Chancho"}', '{"columna_derecha":["Perro","Gato","Gallina","Chancho"],"columna_izquierda":["Anu","Phisi","Wallpa","Khuchi"]}'::jsonb, NULL),
(644, 34, 'word_order', 'Selecciona el gato', '["Phisi"]', '{"palabras":["Phisi","Anu","Wallpa","Khuchi"]}'::jsonb, NULL),
(645, 35, 'translate', 'Kunturi', 'Cóndor', NULL, NULL),
(646, 35, 'translate', 'Titi', 'Puma', NULL, NULL),
(647, 35, 'translate', 'Allpachu', 'Alpaca', NULL, NULL),
(648, 35, 'translate', 'Qarwa', 'Llama', NULL, NULL),
(649, 35, 'true_false', '"Kunturi" significa "Cóndor"', 'true', NULL, NULL),
(650, 35, 'true_false', '"Titi" significa "Llama"', 'false', NULL, NULL),
(651, 35, 'fill_blanks', 'El cóndor en Aymara es: ___', '["Kunturi"]', NULL, NULL),
(652, 35, 'matching', 'Une cada animal con su traducción', '{"Kunturi": "Cóndor", "Titi": "Puma", "Allpachu": "Alpaca", "Qarwa": "Llama"}', '{"columna_derecha":["Cóndor","Puma","Alpaca","Llama"],"columna_izquierda":["Kunturi","Titi","Allpachu","Qarwa"]}'::jsonb, NULL),
(653, 35, 'word_order', 'Selecciona la llama', '["Qarwa"]', '{"palabras":["Qarwa","Kunturi","Titi","Allpachu"]}'::jsonb, NULL),
(654, 36, 'translate', 'Chhuqi', 'Papa', NULL, NULL),
(655, 36, 'translate', 'Jupha', 'Quinua', NULL, NULL),
(656, 36, 'translate', 'Tunqu', 'Maíz', NULL, NULL),
(657, 36, 'true_false', '"Chhuqi" significa "Papa"', 'true', NULL, NULL),
(658, 36, 'true_false', '"Jupha" significa "Maíz"', 'false', NULL, NULL),
(659, 36, 'fill_blanks', 'La papa en Aymara es: ___', '["Chhuqi"]', NULL, NULL),
(660, 36, 'matching', 'Une cada alimento con su traducción', '{"Chhuqi": "Papa", "Jupha": "Quinua", "Tunqu": "Maíz"}', '{"columna_derecha":["Papa","Quinua","Maíz"],"columna_izquierda":["Chhuqi","Jupha","Tunqu"]}'::jsonb, NULL),
(661, 36, 'word_order', 'Selecciona la quinua', '["Jupha"]', '{"palabras":["Jupha","Chhuqi","Tunqu","Wila"]}'::jsonb, NULL),
(662, 37, 'translate', 'Aycha', 'Carne', NULL, NULL),
(663, 37, 'translate', 'Challwa', 'Pescado', NULL, NULL),
(664, 37, 'translate', 'Kawna', 'Huevo', NULL, NULL),
(665, 37, 'true_false', '"Aycha" significa "Carne"', 'true', NULL, NULL),
(666, 37, 'true_false', '"Challwa" significa "Huevo"', 'false', NULL, NULL),
(667, 37, 'fill_blanks', 'La carne en Aymara es: ___', '["Aycha"]', NULL, NULL),
(668, 37, 'matching', 'Une cada alimento con su traducción', '{"Aycha": "Carne", "Challwa": "Pescado", "Kawna": "Huevo"}', '{"columna_derecha":["Carne","Pescado","Huevo"],"columna_izquierda":["Aycha","Challwa","Kawna"]}'::jsonb, NULL),
(669, 37, 'word_order', 'Selecciona el pescado', '["Challwa"]', '{"palabras":["Challwa","Aycha","Kawna","Chhuqi"]}'::jsonb, NULL)
ON CONFLICT DO NOTHING;
SELECT setval(pg_get_serial_sequence('ejercicios', 'id'), COALESCE((SELECT MAX(id) FROM ejercicios), 1));

-- insignias: 7 filas
INSERT INTO insignias ("id", "nombre", "descripcion", "icono_url", "condicion", "codigo") VALUES
(1, 'Primer Paso', 'Completaste tu primera lección', '🎯', NULL, 'complete_first_lesson'),
(2, 'Perfeccionista', 'Obtuviste 100% en una lección', '⭐', NULL, 'perfect_lesson'),
(3, 'Racha de Fuego', 'Mantuviste una racha de 7 días', '🔥', NULL, 'streak_7_days'),
(4, 'Unidad 1 Completada', 'Completaste la primera unidad', '🏅', NULL, 'complete_unit_1'),
(5, 'Unidad 2 Completada', 'Completaste la segunda unidad', '🏅', NULL, 'complete_unit_2'),
(6, 'Unidad 3 Completada', 'Completaste la tercera unidad', '🏅', NULL, 'complete_unit_3'),
(7, 'Sabio Andino', 'Completaste todas las unidades', '🏆', NULL, 'complete_all_units')
ON CONFLICT DO NOTHING;
SELECT setval(pg_get_serial_sequence('insignias', 'id'), COALESCE((SELECT MAX(id) FROM insignias), 1));

-- contenido_cultural: 69 filas
INSERT INTO contenido_cultural ("id", "tipo", "idioma", "titulo", "contenido_original", "traduccion", "audio_url", "imagen_url", "created_at", "updated_at", "explicacion", "autor", "region", "dificultad", "tags") VALUES
(1, 'adivinanza', 'quechua', 'El ojo', 'Huk huchuy qucha, mana yaku chinkayniyuq. ¿Iman?', 'Un pequeño lago que nunca se seca. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Ñawi (El ojo). Esta adivinanza usa la metáfora del agua para describir el brillo del ojo.', NULL, 'Cusco', 'basico', ARRAY['adivinanza', 'cuerpo', 'ojo']::text[]),
(2, 'adivinanza', 'quechua', 'La lengua', 'Huk ukupi tiyaq, mana chaki, mana maki, ichaqa kuyuq. ¿Iman?', 'Vive adentro, no tiene pies ni manos, pero se mueve. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Qallu (La lengua). Describe la lengua como algo que vive en la boca y se mueve sin extremidades.', NULL, 'Puno', 'basico', ARRAY['adivinanza', 'cuerpo', 'lengua']::text[]),
(3, 'adivinanza', 'quechua', 'El huevo', 'Yuraq wasichapi huk quri qucha. ¿Iman?', 'En una casa blanca hay un lago dorado. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Runtu (El huevo). La casa blanca es la cáscara y el lago dorado es la yema.', NULL, 'Ayacucho', 'basico', ARRAY['adivinanza', 'comida', 'huevo']::text[]),
(4, 'adivinanza', 'quechua', 'El maíz', 'Huk mamitapa wawankuna, tukuy quri pachayuq. ¿Iman?', 'Los hijos de una mamita, todos con ropa dorada. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Sara (El maíz). Los granos son los hijos y su color amarillo es la ropa dorada.', NULL, 'Cusco', 'intermedio', ARRAY['adivinanza', 'comida', 'maiz']::text[]),
(5, 'adivinanza', 'quechua', 'La estrella', 'Tutapi rikukun, punchawpi chinkan. ¿Iman?', 'De noche se ve, de día desaparece. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Quyllur (La estrella). Las estrellas solo son visibles en la noche.', NULL, 'Andes', 'basico', ARRAY['adivinanza', 'cielo', 'estrella']::text[]),
(6, 'proverbio', 'quechua', 'No seas ladrón', 'Ama suwa, ama llulla, ama qilla.', 'No seas ladrón, no seas mentiroso, no seas ocioso.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Los tres principios fundamentales del Imperio Inca que guiaban la conducta moral de los ciudadanos.', NULL, 'Cusco', 'basico', ARRAY['proverbio', 'moral', 'inca']::text[]),
(7, 'proverbio', 'quechua', 'La unión hace la fuerza', 'Hukllachu kaspa, tukuy ima atipasunmi.', 'Estando unidos, todo lo podemos.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Refleja el valor de la comunidad y el trabajo colectivo en la cultura andina.', NULL, 'Andes', 'basico', ARRAY['proverbio', 'comunidad', 'union']::text[]),
(8, 'proverbio', 'quechua', 'El trabajo', 'Llamk''aqpaqqa mikhuyqa mana pisipanchu.', 'Para el que trabaja, la comida nunca falta.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Enseña el valor del trabajo como medio para asegurar el sustento.', NULL, 'Puno', 'intermedio', ARRAY['proverbio', 'trabajo', 'comida']::text[]),
(9, 'proverbio', 'quechua', 'La sabiduría', 'Yachaqqa mana ñanpi chinkanchu.', 'El que sabe no se pierde en el camino.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Destaca la importancia del conocimiento como guía en la vida.', NULL, 'Ayacucho', 'intermedio', ARRAY['proverbio', 'sabiduria', 'conocimiento']::text[]),
(10, 'proverbio', 'quechua', 'El respeto', 'Mayqin runatapas yupaychay, qamtapas yupaychasunkim.', 'Respeta a cualquier persona, y te respetarán a ti.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Principio de reciprocidad aplicado al respeto mutuo.', NULL, 'Cusco', 'basico', ARRAY['proverbio', 'respeto', 'reciprocidad']::text[]),
(11, 'cancion', 'quechua', 'Valicha', 'Valichay, Valichay, imatan ruwachkanki
Chay wayruru ñawiykiwan, suwawachkawanki
Valichay, Valichay, qan munasqay sipas
Sonqoyta suwawasqanki, kunanqa waqachkani', 'Valicha, Valicha, qué estás haciendo
Con esos ojos brillantes, me estás robando
Valicha, Valicha, mi amada joven
Me has robado el corazón, ahora estoy llorando', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Valicha es un huayno tradicional muy popular, compuesto por Miguel Ángel Hurtado. Representa el amor andino.', NULL, 'Cusco', 'intermedio', ARRAY['cancion', 'huayno', 'amor', 'valicha']::text[]),
(12, 'cancion', 'quechua', 'El Cóndor Pasa', 'Yaw kuntur llaqtay orqopi tiyaq
Maymantam qawamuwachkanki
Kuntur, kuntur apallaway
Llaqtanchikman kutipusun
Paqarinpi tutallamanta', 'Oh cóndor que vives en la montaña de mi pueblo
Desde dónde me estás mirando
Cóndor, cóndor llévame
Volvamos a nuestro pueblo
En la madrugada temprano', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'El Cóndor Pasa es una zarzuela compuesta por Daniel Alomía Robles en 1913. Es Patrimonio Cultural de la Nación.', NULL, 'Lima', 'avanzado', ARRAY['cancion', 'condor', 'patrimonio', 'zarzuela']::text[]),
(13, 'cancion', 'quechua', 'Urpillay', 'Urpillay, sonqollay, munasqay palomitay
Maypitaq kanki, maypitaq purinki
Tutayaqtin maskasqayki, punchaw lliqsiqtin waqasqayki
Urpillay, kutimuy ñuqaman', 'Palomita mía, corazón mío, mi amada palomita
Dónde estás, por dónde caminas
Al anochecer te buscaré, al amanecer lloraré
Palomita mía, regresa a mí', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Canción tradicional que usa la metáfora de la paloma para expresar el amor y la nostalgia.', NULL, 'Andes', 'basico', ARRAY['cancion', 'urpi', 'amor', 'paloma']::text[]),
(14, 'cuento', 'quechua', 'El zorro y el cóndor', 'Huk kutinsi atuqqa kunturwan tupasqa. Atuqqa nisqa: "Kuntur, munaymanmi hanaq pachata riqsiyta".
Kunturqa nisqa: "Ari, chantaqa silluypiman lloqay". 
Atuqqa lloqarqa, hanaq pachaman pawarqanku. Ichaqa atuqqa sinchita manchakurqa.
"Kuntur, uraykachiwayña!" nisqa.
Kunturqa atuqta huk qaqapi saqirqa. Chaymanta atuqqa mana hayk''aqpas hanaq pachata maskasqañachu.', 'Una vez el zorro se encontró con el cóndor. El zorro dijo: "Cóndor, quisiera conocer el cielo".
El cóndor dijo: "Sí, entonces sube a mis garras".
El zorro subió, volaron al cielo. Pero el zorro tuvo mucho miedo.
"¡Cóndor, bájame ya!" dijo.
El cóndor dejó al zorro en un precipicio. Desde entonces el zorro nunca más buscó el cielo.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Este cuento enseña que debemos ser humildes y no ambicionar lo que no nos corresponde. El zorro representa la ambición desmedida.', NULL, 'Cusco', 'intermedio', ARRAY['cuento', 'zorro', 'condor', 'moraleja']::text[]),
(15, 'cuento', 'quechua', 'El origen de la quinua', 'Ñawpa pachapiqa runakunaqa yarqaywan muchuchkarqanku. Pachamama chayta rikurqa, anchata llakikurqa.
Huk punchawsi hanaq pachamanta huk qolqe tamya hamuqta kachamurqa. 
Kay tamyaqa kinuwa murukuna karqa. 
Runakunaqa chayta tarpurqanku, sumaqta wiñarqa. Chaymantapacha kinuwaqa qori mikhuy kachkan.', 'En tiempos antiguos las personas sufrían de hambre. La Pachamama vio eso y se entristeció mucho.
Un día envió desde el cielo una lluvia plateada.
Esta lluvia eran semillas de quinua.
Las personas las sembraron y creció hermosamente. Desde entonces la quinua es alimento de oro.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Leyenda que explica el origen sagrado de la quinua como regalo de la Pachamama para combatir el hambre.', NULL, 'Puno', 'basico', ARRAY['cuento', 'quinua', 'pachamama', 'origen']::text[]),
(16, 'cuento', 'quechua', 'Los hermanos Ayar', 'Pacaritampu machaymantas tawa wawqekunas lloqsimurqanku: Ayar Manco, Ayar Cachi, Ayar Uchu, Ayar Auca.
Paykunaqa sumaq allpata maskaspa purirqanku. Ayar Cachiqa sinchi kallpayuq kasqa, wawqinkuna manchakurqanku.
Chaymi Ayar Cachita machay ukhupi wisq''arqanku.
Ayar Uchuqa rumimansi tukupurqa. Ayar Aucaqa raprayuqsi tukupurqa, pawaspa chinkapurqa.
Ayar Mancoqa sapallanña Qosqo llaqtata tarimusqa. Paysi ñawpaq Inka karqa.', 'De la cueva de Pacaritambo salieron cuatro hermanos: Ayar Manco, Ayar Cachi, Ayar Uchu, Ayar Auca.
Ellos caminaron buscando buena tierra. Ayar Cachi era muy fuerte, sus hermanos le temían.
Por eso encerraron a Ayar Cachi dentro de una cueva.
Ayar Uchu se convirtió en piedra. Ayar Auca le crecieron alas y voló, desapareciendo.
Ayar Manco, ya solo, encontró la ciudad del Cusco. Él fue el primer Inca.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Mito fundacional del Imperio Inca que explica el origen divino de los incas y la fundación de su capital.', NULL, 'Cusco', 'avanzado', ARRAY['cuento', 'ayar', 'inca', 'origen', 'cusco']::text[]),
(17, 'adivinanza', 'aymara', 'El sol', 'Uruxa puriwa, arumanxa sarawayxi. ¿Kunasa?', 'De día viene, de noche se va. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Inti (El sol). Describe el ciclo diario del sol.', NULL, 'Puno', 'basico', ARRAY['adivinanza', 'cielo', 'sol']::text[]),
(18, 'adivinanza', 'aymara', 'La cebolla', 'P''iqintañamataki jachayasiñamawa. ¿Kunasa?', 'Para comerlo tienes que llorar. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Cebolla. Hace referencia a las lágrimas al cortar cebolla.', NULL, 'La Paz', 'basico', ARRAY['adivinanza', 'comida', 'cebolla']::text[]),
(19, 'adivinanza', 'aymara', 'El camino', 'Jiwakiwa sarnaqañataki, janiwa sarxiti. ¿Kunasa?', 'Te ayuda a caminar, pero nunca camina. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Thaki (El camino). El camino nos guía pero permanece inmóvil.', NULL, 'Oruro', 'intermedio', ARRAY['adivinanza', 'naturaleza', 'camino']::text[]),
(20, 'adivinanza', 'aymara', 'La papa', 'Uraqi manqhana utji, janiwa qhanañapati. ¿Kunasa?', 'Vive debajo de la tierra, no ve la luz. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Ch''uqi (La papa). Crece bajo tierra.', NULL, 'Puno', 'basico', ARRAY['adivinanza', 'comida', 'papa']::text[]),
(21, 'adivinanza', 'aymara', 'El pensamiento', 'Janiwa uñjañati, janiwa llamk''añati, ukampisa utjiwa. ¿Kunasa?', 'No se puede ver, no se puede tocar, pero existe. ¿Qué es?', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Respuesta: Amuyu (El pensamiento). Reflexión sobre lo intangible.', NULL, 'Altiplano', 'intermedio', ARRAY['adivinanza', 'mente', 'pensamiento']::text[]),
(22, 'proverbio', 'aymara', 'La reciprocidad', 'Ayniqawa suma jakañaxa.', 'La reciprocidad es vivir bien.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Principio fundamental aymara que establece el equilibrio en las relaciones sociales.', NULL, 'Altiplano', 'basico', ARRAY['proverbio', 'ayni', 'reciprocidad']::text[]),
(23, 'proverbio', 'aymara', 'La verdad', 'Chiqaxa jan untasisa qhanawayiwa.', 'La verdad aunque no se vea, se hace luz.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Enseña que la verdad siempre sale a la luz.', NULL, 'La Paz', 'intermedio', ARRAY['proverbio', 'verdad', 'luz']::text[]),
(24, 'proverbio', 'aymara', 'El trabajo comunitario', 'Mayacht''asipxañani, taqi kunasa lurasipxañani.', 'Unidos todo lo podemos hacer.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Refleja la importancia del trabajo comunitario en la cultura aymara.', NULL, 'Oruro', 'basico', ARRAY['proverbio', 'comunidad', 'trabajo']::text[]),
(25, 'proverbio', 'aymara', 'La Pachamama', 'Pachamamampi suma qamañawa, jupawa manq''ayaxa churitu.', 'Vivir bien con la Pachamama, ella nos da de comer.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Expresa la relación de respeto con la Madre Tierra.', NULL, 'Puno', 'basico', ARRAY['proverbio', 'pachamama', 'tierra']::text[]),
(26, 'proverbio', 'aymara', 'La sabiduría ancestral', 'Nayra achachilanakana yatiwipawa thakhinchitu.', 'La sabiduría de nuestros ancestros nos guía.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Valora el conocimiento transmitido por las generaciones anteriores.', NULL, 'Altiplano', 'intermedio', ARRAY['proverbio', 'sabiduria', 'ancestros']::text[]),
(27, 'cancion', 'aymara', 'Canto a la Pachamama', 'Pachamama, Pachamama
Jumatakiwa ch''uwanchapxsma
Jumatakiwa jayllipxsma
Suma yapuchirinakamawa munasipxsma

Pachamama, Pachamama
Uraqimawa, qutamawa
Qullumawa, jawirawa
Jiwasanakampi wiñayatakiwa', 'Pachamama, Pachamama
A ti te ofrendamos
A ti te cantamos
Como buenos agricultores te amamos

Pachamama, Pachamama
Eres nuestra tierra, nuestro lago
Nuestra montaña, nuestro río
Con nosotros por siempre', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Canto ceremonial dedicado a la Madre Tierra, usado en rituales de agradecimiento y ofrenda.', NULL, 'Puno', 'intermedio', ARRAY['cancion', 'pachamama', 'ceremonial', 'ofrenda']::text[]),
(28, 'cancion', 'aymara', 'Sikuriada', 'Sikurinakawa jutapxi
Qhantati uruxa qhanataski
Wayna tawaqunakawa tuqisipxi
Anataña uruxa puriniwa

Sikuwa, sikuwa
Jaqinakana arupa
Sikuwa, sikuwa
Wiñaya wiñayataki', 'Los sikuris vienen
El amanecer está brillando
Jóvenes y señoritas bailan
El día de fiesta ha llegado

Zampoña, zampoña
Voz de los pueblos
Zampoña, zampoña
Por siempre jamás', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Canción tradicional que acompaña las danzas de sikuris, conjunto de músicos que tocan zampoña.', NULL, 'La Paz', 'basico', ARRAY['cancion', 'sikuri', 'zampoña', 'fiesta']::text[]),
(29, 'cancion', 'aymara', 'Wiñaya wiñayataki', 'Wiñaya wiñayataki jumaruwa munsmawa
Qutapa umanxa, qullunakapa thiyansa
Wiñaya wiñayataki, nayawa jumampiwa
Pachamamana ñuqanchik uywawatanxa', 'Por siempre jamás te amaré
En las aguas del lago, junto a las montañas
Por siempre jamás, yo estaré contigo
Somos hijos de la Pachamama', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Canción de amor aymara que expresa sentimientos eternos usando la naturaleza andina como testigo.', NULL, 'Altiplano', 'basico', ARRAY['cancion', 'amor', 'wiñaya', 'eterno']::text[]),
(30, 'cuento', 'aymara', 'El zorro y la perdiz', 'Mayuru qamaqi tiwulampiki jakaskatayna. Tiwulaxa p''isqi manq''aña munatayna. 
Qamaqi yatitayna, ukaxa qamaqi jiskt''atayna: "¿Kunjamataki aka p''isqi munta?"
Tiwulaxa sarakatayna: "P''isqi aycha muxsawa".
Qamaqi sarakatayna: "Nayaxa chhijchhi mantañawa yatsma, ukawa suma manq''awa".
Qamaqi tiwularu chhijchhiru apatayna. Tiwulaxa sinchita thayanakapana khathiyasitayna.
Ukatxa tiwulaxa p''isqina manq''añapa armasitayna.', 'Un día el zorro y la perdiz vivían cerca. El zorro quería comer perdiz.
La perdiz lo supo y le preguntó: "¿Por qué quieres esta perdiz?"
El zorro dijo: "La carne de perdiz es deliciosa".
La perdiz dijo: "Yo sé dónde hay granizo, esa es buena comida".
La perdiz llevó al zorro donde el granizo. El zorro se congeló mucho con el frío.
Desde entonces el zorro olvidó comer perdiz.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Cuento que enseña que la astucia puede vencer a la fuerza. La perdiz usa su inteligencia para salvarse.', NULL, 'La Paz', 'intermedio', ARRAY['cuento', 'zorro', 'perdiz', 'astucia']::text[]),
(31, 'cuento', 'aymara', 'La laguna encantada', 'Nayra pachanxa Titiqaqa qutana huk sirena utjatayna. Akha sirenawa suma aruni, musiqani.
Wayna masinakawa qutaruki sarnaqapxatayna sirenana arupawa ist''añataki.
Huk uruxa huk waynawa sirena uñjatayna. Sirenawa sarakatayna: "Nayana utajaruki sarama".
Waynawa quta manqharuki mantatayna. Ukata janiwa kutt''aniti.
Ukatpacha, jaqinakawa ch''usiruru qutaruki jani sarnaqapkiti.', 'En tiempos antiguos en el lago Titicaca vivía una sirena. Esta sirena tenía hermosa voz y música.
Los jóvenes iban al lago para escuchar la voz de la sirena.
Un día un joven vio a la sirena. La sirena le dijo: "Ven a mi casa".
El joven entró dentro del lago. Y nunca regresó.
Desde entonces, las personas no van al lago de noche.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Leyenda que explica por qué se evita ir al lago Titicaca de noche, relacionada con espíritus del agua.', NULL, 'Puno', 'intermedio', ARRAY['cuento', 'sirena', 'titicaca', 'leyenda']::text[]),
(32, 'cuento', 'aymara', 'El origen del Ekeko', 'Nayra pachanxa huk jisk''a jaqe utjatayna, sutipawa Ekeko.
Ekekoxa phuqha jaqetayna, taqi kunani: manq''a, qullqi, uywa.
Huk uruxa Ekekoxa marka tuqi sartatayna. Wakisiriru churañataki taqi kunapa apatayna.
Jaqinakaxa Ekekoru huk wawa lurañapa munta tayna, wakisiri yanapañataki.
Ukatpacha Ekekoxa Alasitana suma yapu churiri satayna.', 'En tiempos antiguos existía un hombre pequeño llamado Ekeko.
El Ekeko era un hombre próspero, tenía de todo: comida, dinero, animales.
Un día el Ekeko decidió ir al pueblo. Llevó todas sus cosas para dar a los necesitados.
Las personas quisieron hacer una figura del Ekeko, para que ayude a los necesitados.
Desde entonces el Ekeko es el que da buenas cosechas en la Alasita.', NULL, NULL, '2025-12-27T10:00:17.718Z', '2025-12-27T10:00:17.718Z', 'Leyenda sobre el origen del Ekeko, deidad de la abundancia celebrada en la fiesta de Alasitas.', NULL, 'La Paz', 'basico', ARRAY['cuento', 'ekeko', 'alasita', 'abundancia']::text[]),
(70, 'proverbio', 'quechua', 'Ama Sua, Ama Llulla, Ama Quella', 'Ama Sua, Ama Llulla, Ama Quella', 'No robes, No mientas, No seas perezoso.', NULL, '🏔️', '2025-11-25T19:57:57.869Z', '2025-11-25T19:57:57.869Z', NULL, NULL, NULL, 'intermedio', NULL),
(71, 'proverbio', 'quechua', 'Sobre el trabajo', 'Llamkayqa kawsaymi', 'El trabajo es vida.', NULL, '💪', '2025-11-25T19:57:57.875Z', '2025-11-25T19:57:57.875Z', NULL, NULL, NULL, 'intermedio', NULL),
(72, 'proverbio', 'quechua', 'Sobre la unidad', 'Huk makillawan mana atinichu', 'Con una sola mano no se puede.', NULL, '🤝', '2025-11-25T19:57:57.877Z', '2025-11-25T19:57:57.877Z', NULL, NULL, NULL, 'intermedio', NULL),
(73, 'adivinanza', 'quechua', 'Yuraq Yuraq', 'Yuraq yuraq, uchuy uchuy
Chayqa huk yana muyu', 'Blanco blanco, pequeñito pequeñito
Pero es un negro redondo', NULL, '👁️', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Esta adivinanza describe al ojo humano. El blanco representa la esclerótica y el negro redondo es la pupila. Refleja la observación detallada de la anatomía en la cultura quechua.', NULL, NULL, 'intermedio', NULL),
(74, 'adivinanza', 'quechua', 'Qaqa Qaqapi', 'Qaqa qaqapi purin
Mana zapatu churaspa', 'Camina sobre las rocas
Sin ponerse zapatos', NULL, '🌊', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'La respuesta es el río. Esta adivinanza muestra la conexión quechua con la naturaleza y el agua como elemento sagrado en la cosmovisión andina.', NULL, NULL, 'intermedio', NULL),
(75, 'adivinanza', 'quechua', 'Hanaq Pachapi', 'Hanaq pachapi chupan
Kay pachapi uyan', 'En el cielo tiene cola
En la tierra tiene cara', NULL, '🪁', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'La respuesta es la cometa (volantín). Representa el juego tradicional andino y la conexión entre el mundo celestial y terrenal.', NULL, NULL, 'intermedio', NULL),
(76, 'adivinanza', 'quechua', 'Imasmari', 'Imasmari, imasmari?
Tutapi rikukun, punchaypi chinkan', '¿Qué será, qué será?
De noche se ve, de día desaparece', NULL, '⭐', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'La respuesta son las estrellas. Esta adivinanza refleja la importancia de la astronomía en la cultura andina, donde las estrellas guiaban la agricultura.', NULL, NULL, 'intermedio', NULL),
(77, 'adivinanza', 'quechua', 'Sach''api Wiñan', 'Sach''api wiñan, p''achayuq, uma q''illuyuq', 'Crece en planta, tiene ropa, cabeza amarilla', NULL, '🌽', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'La respuesta es el maíz (sara). El maíz era considerado sagrado por los incas y esta adivinanza celebra su importancia cultural.', NULL, NULL, 'intermedio', NULL),
(78, 'adivinanza', 'aymara', 'Qullqi Qullqi', 'Qullqi qullqi, jisk''a jisk''a
Ukax mä ch''iyara tunu', 'Plata, plata, pequeñito pequeñito
Pero es un negro redondo', NULL, '👁️', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Esta adivinanza aymara describe al ojo humano, comparando el brillo de la esclerótica con la plata y la pupila oscura con algo negro y redondo.', NULL, NULL, 'intermedio', NULL),
(79, 'adivinanza', 'aymara', 'Qala Qalani', 'Qala qalani sarnaqixa
Janiw kuna lukasiñakiti', 'Camina sobre piedras
Sin ningún zapato', NULL, '🌊', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'La respuesta es el río. Esta adivinanza muestra la conexión aymara con la naturaleza y el agua, elemento sagrado en la cosmovisión andina.', NULL, NULL, 'intermedio', NULL),
(80, 'adivinanza', 'aymara', 'Alaxpachan Tukusisa', 'Alaxpachanx tukusisa
Akapachanx nayräsisa', 'En el cielo tiene cola
En la tierra tiene cara', NULL, '🪁', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Respuesta: La cometa (volantín). Representa el juego tradicional aymara y la conexión entre el mundo celestial (alaxpacha) y terrenal (akapacha).', NULL, NULL, 'intermedio', NULL),
(81, 'adivinanza', 'aymara', 'Arunx Janïw', 'Arunx janïw, sarnaqiraki
Purañ janïw, ch''allxtaraki', 'No habla pero camina
No camina pero suena', NULL, '💧', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'La respuesta es el río. El agua fluye constantemente produciendo sonido, pero no tiene pies ni boca.', NULL, NULL, 'intermedio', NULL),
(82, 'cancion', 'quechua', 'Inti Raymi', 'Inti Tayta, Inti Tayta
Qammi kawsayta qowanki
Pachamama, Mama Quilla
Qankunam ñuqanchista qhawanki', 'Padre Sol, Padre Sol
Tú nos das la vida
Madre Tierra, Madre Luna
Ustedes nos cuidan', NULL, '☀️', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Canto ceremonial del Inti Raymi, la fiesta del Sol. Esta celebración marca el solsticio de invierno y honra al Inti (Sol) como fuente de vida.', NULL, NULL, 'intermedio', NULL),
(83, 'cancion', 'quechua', 'Adiós Pueblo de Ayacucho', 'Adiós pueblo de Ayacucho
Adiós Cerrito de Acuchimay
Kachkaniraqmi wasinchaypi
Tuta p''unchay waqashaspa', 'Adiós pueblo de Ayacucho
Adiós Cerrito de Acuchimay
Todavía estoy en nuestra casa
Llorando noche y día', NULL, '🏔️', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Huayno tradicional ayacuchano que expresa la nostalgia y el amor por la tierra natal. Es un ejemplo de la profunda conexión del pueblo quechua con su territorio.', NULL, NULL, 'intermedio', NULL),
(84, 'cancion', 'quechua', 'Flor de Retama', 'Retamachay, retamachay
Q''umir urqupi wiñaq retama
Noqaq sonqoyta chayachispa
Qampi yuyarispa waqani', 'Retamita, retamita
Retama que creces en el cerro verde
Llegando a mi corazón
Lloro recordándote', NULL, '🌼', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Canción romántica quechua que usa la retama (flor amarilla andina) como metáfora del amor y la añoranza. La retama es una planta muy apreciada en los Andes.', NULL, NULL, 'intermedio', NULL),
(85, 'cancion', 'aymara', 'Tata Inti', 'Tata Inti, Tata Inti
Jumaw nayan luräwipa
Phaxsin qunita, q''asäw phaxsi
Jumax nayan yatichiri', 'Padre Sol, Padre Sol
Tú eres quien me cuida
Das cosecha, linda cosecha
Tú eres mi maestro', NULL, '☀️', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Himno al Inti (Sol), deidad central en la cosmovisión aymara. El Sol es visto como padre protector y maestro que enseña los ciclos de la vida y la agricultura.', NULL, NULL, 'intermedio', NULL),
(86, 'cancion', 'aymara', 'Arunakan Jawsäwipa', 'Arunakan jawsäwipa
Taqi jaqinakan jawsäwipa
Nayax muntha jaqïthwa
Aymara jaqïthwa', 'Con las palabras nos comunicamos
Con todas las personas nos comunicamos
Yo quiero ser persona
Ser persona aymara', NULL, '🗣️', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Canto que celebra la identidad aymara y la importancia de la lengua como vehículo de la cultura. Ser "jaqi" (persona) es un concepto profundo que implica responsabilidad comunitaria.', NULL, NULL, 'intermedio', NULL),
(87, 'cancion', 'aymara', 'Pachamama', 'Pachamama, taykasa
Qamaw jakäwi churista
Phaxsi, uma, jallp''a
Jumaw nayanak uywasita', 'Pachamama, madre nuestra
Tú nos das la vida
Cosecha, agua, tierra
Tú nos cuidas', NULL, '🌍', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Canto ceremonial de agradecimiento a la Pachamama (Madre Tierra). Se entona durante rituales agrícolas y celebraciones comunitarias para pedir abundancia.', NULL, NULL, 'intermedio', NULL),
(88, 'proverbio', 'aymara', 'Jaqi Jakañataki', 'Jaqi jakañatakix ayni, mink''a, ch''aman thakhi wakichañäwa', 'Para vivir como persona hay que practicar la ayni, la mink''a y preparar el camino de la fuerza', NULL, '🤝', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Este proverbio expresa los tres pilares de la vida comunitaria aymara: la reciprocidad (ayni), el trabajo colectivo (mink''a) y la fuerza espiritual (ch''ama). Es fundamental en la filosofía del suma qamaña (vivir bien).', NULL, NULL, 'intermedio', NULL),
(89, 'proverbio', 'aymara', 'Janiw Mä Khiti', 'Janiw mä khitix akhama sarnaqkaspati, taqi jaqiw akhama sarnaqañapawa', 'No es uno solo quien debe caminar así, todos debemos caminar así', NULL, '👥', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Refleja el valor comunitario aymara donde el bienestar individual depende del bienestar colectivo. Expresa la importancia de la unidad y el trabajo conjunto.', NULL, NULL, 'intermedio', NULL),
(90, 'proverbio', 'aymara', 'Pachamama Thaqhaña', 'Pachamaman sum thaqhañäni, jupax suma phaxsin qunitu', 'Hay que cuidar bien a la Pachamama, ella nos da buena cosecha', NULL, '🌍', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Expresa la relación de reciprocidad con la Madre Tierra. La Pachamama es una deidad viviente que debe ser honrada y cuidada para que continúe proveyendo.', NULL, NULL, 'intermedio', NULL),
(91, 'proverbio', 'aymara', 'Janiw Tukuskanti', 'Janiw tukuskanti qhipharuxa', 'No termines de comer para mañana', NULL, '🌅', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Este proverbio enseña a aprovechar las oportunidades del presente. Refleja la importancia de vivir el momento y no postergar las acciones importantes.', NULL, NULL, 'intermedio', NULL),
(92, 'proverbio', 'aymara', 'Maynin Mayniw', 'Maynin mayniw jiwasax sapxaraktanxa', 'Unidos somos fuertes, separados caemos', NULL, '💪', '2025-11-29T04:11:26.522Z', '2025-11-29T04:11:26.522Z', 'Proverbio que enfatiza el valor de la comunidad y la colaboración. En la cultura aymara, la fuerza está en la unión del ayllu (comunidad).', NULL, NULL, 'intermedio', NULL),
(93, 'cuento', 'quechua', 'Kunturwan Michiqmasi', 'Ñawpa pachakunapi, huk sumaq sipas pampapi llamata michishasqa. Paypa sutin Sumaq Tika karqan. Sapa punchay payqa orqoman seqay, llamakunata mikhuchispa, takishaspa kawsaq.

Huk punchay, paytaqa huk hatun kuntur qawarqan. Kunturqa hanaq pachapi pawaspa niq: "Maypis kay sumaq warmi? Noqaqa munakuniman paywan rimayta."

Kunturqa uraman urqhurqan, runaman tikuraspa. Payqa sumaq maqtaman tukupurqan, qori p''achayuq. Sumaq Tikaman aysakuspa ninku:

"Allillanchu, sumaq sipas. Noqaqa karumanta jamuni, qamta rikuq."

Sipasqa manchakuspa ninku: "Pichus kanki? Imapaqchus hamunki?"

"Noqaqa kuntur kani, hanaq pachapi kawsaq. Qanta apakuyta munani noqawan kawsanaykipaq, hanaq pachapi, maypi intiq k''anchaynin aswan k''anchaq, maypi wayrakunaqa k''acha k''achalla purinku."

Sumaq Tikaqa mana creesqa. Chaywanpas kunturqa paypa makinta hap''ispa, condorman tikurupusqa, paykunaqa hanaq pachaman phawarpurqanku.

Chayqa huk sumaq pacha kasqa. Qori qolqemanta wasikunam karqan, hanaq pachapi phawaqkunaqa sumaqta takishasqaku. Icha kunturqa paytan munakusqa, sumaqta qhawasqa.

Wakin killakunaqa pasarqanku. Sumaq Tikaqa paypa aylluyta yuyarispam waqaq. "Noqaqa kutiy munani" nispa ninku. Kunturqa llakikuspa ninku: "Riki, qanqa kutiyta atinki, ichaqa ñuqaqa qamwan sapa punchay kasqayta yuyarisaq."

Kunturqa paytan kutichirqan. Maypis paypa ayllu waqachkasqa, "Sumaq Tika chinkapusqa!" nispa. Paykunaqa kusikuspa tupanakurqanku.

Sumaq Tikaqa willarqan imaynatachus kunturwan kawsasqanta. Chaymantapacha, runakunaqa kunturta respetay qallarisqanku, payqa mana millay pisqu kasqanta, aswanqa allin sonqoyuq kasqanta yachaspa.', 'En tiempos antiguos, una hermosa joven pastaba llamas en el campo. Su nombre era Flor Hermosa. Cada día ella subía al cerro, dando de comer a las llamas, viviendo cantando.

Un día, un gran cóndor la vio. El cóndor volando por el cielo decía: "¿Dónde está esta mujer hermosa? Yo quisiera hablar con ella."

El cóndor bajó, transformándose en hombre. Se convirtió en un joven hermoso, con ropa de oro. Acercándose a Flor Hermosa le dice:

"Hola, hermosa joven. Yo vengo de lejos, para verte."

La joven asustada dice: "¿Quién eres? ¿Para qué vienes?"

"Yo soy el cóndor, habitante del cielo. Quiero llevarte conmigo para vivir conmigo, en el cielo, donde el brillo del sol es más luminoso, donde los vientos caminan claramente."

Flor Hermosa no creía. Sin embargo, el cóndor tomó su mano, transformándose en cóndor, y volaron al cielo.

Era un lugar hermoso. Las casas eran de oro y plata, los que volaban en el cielo cantaban hermosamente. Pero el cóndor la amaba, la cuidaba bien.

Algunos meses pasaron. Flor Hermosa lloraba recordando a su familia. "Yo quiero volver" dice. El cóndor triste dice: "Bien, tú puedes volver, pero yo recordaré cada día que estuve contigo."

El cóndor la devolvió. Donde su familia estaba llorando, "¡Flor Hermosa se perdió!" decían. Se reencontraron con alegría.

Flor Hermosa contó cómo vivió con el cóndor. Desde entonces, las personas comenzaron a respetar al cóndor, aprendiendo que no era un ave mala, sino que tenía buen corazón.', NULL, '🏔️', '2025-11-29T04:18:06.310Z', '2025-11-29T04:18:06.310Z', 'Este cuento enseña sobre el respeto a la naturaleza y los animales sagrados. El cóndor representa el mundo de arriba (Hanan Pacha), y su amor por la joven muestra que todos los seres, humanos y animales, pueden conectarse. La moraleja es no juzgar por las apariencias y respetar todas las formas de vida. En la cultura andina, el cóndor es mensajero entre el mundo terrenal y celestial.', NULL, NULL, 'intermedio', NULL),
(94, 'cuento', 'quechua', 'Sarapa Paqariyninmanta', 'Ñawpa timpupi, mana sara karqachu kay pachapi. Runakunaqa papallatan, uqatawan mikhurqanku. Ichaqa huk punchay, kay pachapi tukuy ima tikrakunan karqan.

Huk sipas, Quilla sutiyuq, hatun orqoman seqarpusqa, Pachamama maskhaspa. Payqa nispan: "Mama, ñuqanchisqa yarpay kashan. Mikhuna pisilla kashan. ¿Imataq ruwasunman?"

Tutaqa, Quilla puñuykuchaptin, huk musphaypi Pachamamaqa rikukurqan. Payqa warmiman tukusqa, qori samiyuq. Ninku:

"Churiy, qanqa kallpayuq sonqoyuq kanki. Kunantaq qanman huk rikch''ay mikhunata qosqayki. Kay mukhuta hap''iy."

Chaypi huk q''illu mukhuta qorqan, k''anchaqta, inti hina. Quillaman ninku:

"Kay mukhuqa sara sutiyuq kanqa. Qanqa kay mukuta allaypapi tarpunki. Payqa wiñamuspa, hatun yurachaqa kanqa. Chay yuraqa q''illu mukhukuna apanqa, chaymi qanpa aylluykipaq mikhuna kanqa."

Quesqa mask''asqa. Payqa qhelqata rikuspa, makimpi hap''irqan chaychantam mana imapas tarirqan. Ichaqa makimpi huk q''illu mukhuta sinch''ita hap''ishasqa kasqa.

Quilla orqumanta uraykamurqan. Paypa taytanmanpas willarqan. "Taytay, kay mukhuqa hatun bendición Pachamamaqmanta."

Tukuy aylluqa tantakurqan. Quillaq taytanqa nispan: "Kunantaq kay mukhuta tarpusunchis, Pachamamaq munayninta qhawasunchis."

Kimsa killata qhepamanta, allaypapi huk sumaq yuracha wiñamusqa. Hatun kasqa, lurakunayuq, q''illu mukhukuna hunt''asqa. Chay killa huntuchkaptinqa, runakunaqa sara tarpuy qallarisqanku tukuy allpakunapi.

Sara wiñasqa, runakunata kawsachirqan. Paykunaqa Pachamamatan yupaychasqanku, sarata "Mama Sara" sutiyachispa. Sapa wata runakunaqa huk raymita ruwaqku, sarapa paqariyninmanta yuyarispa, Pachamamaman haywarikuy, ujyay, takiymanta.', 'En tiempos antiguos, no había maíz en este mundo. Las personas solo comían papa y oca. Pero un día, todo en este mundo iba a cambiar.

Una joven llamada Quilla (Luna) subió a un gran cerro, buscando a la Pachamama. Ella decía: "Madre, nosotros tenemos hambre. La comida es poca. ¿Qué podríamos hacer?"

En la noche, mientras Quilla dormía, en un sueño la Pachamama apareció. Ella se había transformado en mujer, con color dorado. Dice:

"Hija, tú tienes corazón fuerte. Ahora te daré un alimento diferente. Toma esta semilla."

Ahí le dio una semilla amarilla, brillante, como el sol. A Quilla le dice:

"Esta semilla se llamará sara (maíz). Tú sembrarás esta semilla en la tierra. Creciendo, será una planta grande. Esa planta llevará semillas amarillas, y eso será comida para tu familia."

Quilla despertó. Mirando la ropa, con su mano agarró pero no encontró nada. Sin embargo, en su mano estaba agarrando fuertemente una semilla amarilla.

Quilla bajó del cerro. También contó a su padre. "Padre, esta semilla es una gran bendición de la Pachamama."

Toda la familia se reunió. El padre de Quilla decía: "Ahora sembraremos esta semilla, veremos el deseo de la Pachamama."

Tres meses después, en el campo creció una hermosa planta. Era grande, con hojas, llena de semillas amarillas. Cuando esa luna se llenó, las personas comenzaron a sembrar maíz en todas las tierras.

El maíz creció, hizo vivir a las personas. Ellos agradecían a la Pachamama, llamando al maíz "Mama Sara" (Madre Maíz). Cada año las personas hacían una fiesta, recordando el nacimiento del maíz, con ofrenda a la Pachamama, bebiendo, cantando.', NULL, '🏔️', '2025-11-29T04:18:06.310Z', '2025-11-29T04:18:06.310Z', 'Esta leyenda explica el origen divino del maíz, el alimento más sagrado de las culturas andinas. El maíz era considerado un regalo directo de la Pachamama (Madre Tierra) y se usaba en todas las ceremonias importantes. La moraleja enseña la gratitud y el respeto por los dones de la naturaleza. También muestra la importancia de los sueños como forma de comunicación con lo divino. El maíz representa abundancia, vida y conexión con los dioses.', NULL, NULL, 'intermedio', NULL),
(95, 'cuento', 'quechua', 'Enchantasqa Qucha', 'Huk hatun orqu ukhupi, huk sumaq qucha kasqa. Kay quchaqa k''anchaqmi, anqas samiyuq, intip k''anchaynin reflectakuptinmi qori hina rikukuq. Runakunaqa kay quchata "Qori Qucha" sutiyarqanku, paykunaqa yachanku kay quchapi huk sirena kawsasqanta.

Sirenaqa Yawar Waqaq sutiyuq, sumaq warmi, challwa chakiyuq. Tuta punchaypim quchapi kawsaq, wañuy takikunata takispa. Runakunaqa manchaypas karqanku, respetaypas, paykunaqa mana quchaman haykuyta atirqanku, sirenapa piñayninta manchaspa.

Huk punchay, huk chulla maqta, Tupaq sutiyuq, quchaman aysakurqan. Payqa quchamanta challwata hap''iyta munarqan paypa aylluypaq. Manchaymantam rikurqan huk sumaq warmita, umapiqa t''ikakunata churakusqa, challwa chakiyuq.

Yawar Waqaqqa takishasqa, millunku aswan sumaq takiyta mana uyarisqa. Tupaqqa hechizasqa kasqa, mana puriy atispaqa, sirenaman qhawaspa. Sirenaqa ninku:

"Tupaq, qamqa noqaman jamunki. Imapaqchus kay quchaman haykumunki? ¿Yachanki qampa kawsayqa peligropi kasqanta?"

Tupaqqa kallpanchakuspa rimaq: "Noqaqa yachani, ichaqa noqaqa manchakuni mana. Noqaqa qampa takiykita uyariyta munani, sumaqtan takishanki."

Sirenaqa admirakusqa, mana pipas paywan sumaqta rimayta munasqanta yachakuspa. Nirqan:

"Qamqa mana manañiq sonqoyuq kanki, Tupaq. Kunantaq noqaqa qamman huk willakuyta willasqayki.

Ñuqaqa ñawpataqa runayá karqani, sipas, Killa sutiyuq. Noqaqa munakusqayta munarqani, ichaqa payqa mana noqawan kasarayta munarqan. Llakikuywan, noqaqa kay quchaman purirqani, wañuyta maskhaspa.

Pachamama noqata qhawaykuspa, mana wañuyta qorqan. Aswanqa noqata sirena man tikuchiwarqan, yuyariyta atispa, ichaqa mana runakunawan kawsay atispa. Kunantaq noqaqa kaypi kawsani, tukuy tiempo takispa, noqapa llakikuyniyta."

Tupaqpa sonqonqa nanakurun. Nirqan: "Yawar Waqaq, qamqa manan sapallayki. Noqaqa kaypi qamwan kasqayki, sapa killa, qamta uyarispa."

Chay pachaman ta, Tupaqqa sapa killa quchaman kutirqan, Yawar Waqaqwan rimarispa. Paykunaqa amigokunaman tukurupurqanku. Sirenaqa manan askhata llakikuq, Tupaq noqapi kasqanta ruway sapa p''unchay.

Huk punchay, Pachamamaqa Tupaqpa allin sonqonta qhawaykuspa, sirenatat kutichirqan runaman. Yawar Waqaqqa khuyashasqa, phuyumanhinaman tukurupusqa, qori quchamanta orqhomurqan.

Tupaqqa qheparqan sirenata, ichaqa payqa wakin segundokunapi chinkakarupusqa. Chaymantapacha, quchaqa "Qori Qucha" sutiyuq kashan, maypi leyendaqa kawsaqkunalla yuyarisqa.', 'En el interior de un gran cerro, había una hermosa laguna. Esta laguna era brillante, de color azul, cuando el brillo del sol se reflejaba se veía como oro. Las personas llamaban a esta laguna "Laguna de Oro", ellos sabían que en esta laguna vivía una sirena.

La sirena llamada Yawar Waqaq (Llorasangre), era una mujer hermosa, con pies de pez. Día y noche vivía en la laguna, cantando canciones de muerte. Las personas tenían miedo y respeto, ellos no podían entrar a la laguna, temiendo el enojo de la sirena.

Un día, un joven solo, llamado Tupaq, se acercó a la laguna. Él quería agarrar peces de la laguna para su familia. Con miedo vio a una mujer hermosa, en la cabeza tenía flores puestas, con pies de pez.

Yawar Waqaq estaba cantando, ella nunca había escuchado un canto más hermoso. Tupaq estaba hechizado, sin poder caminar, mirando a la sirena. La sirena dice:

"Tupaq, tú vienes a mí. ¿Para qué entras a esta laguna? ¿Sabes que tu vida está en peligro?"

Tupaq fortaleciéndose habló: "Yo sé, pero yo no tengo miedo. Yo quiero escuchar tu canto, cantas muy hermoso."

La sirena admirada, se dio cuenta que nadie quería hablar bien con ella. Dijo:

"Tú tienes corazón sin maldad, Tupaq. Ahora yo te contaré una historia.

Yo antes era humana, una joven, llamada Killa. Yo amaba a mi amado, pero él no quería casarse conmigo. Con tristeza, yo caminé a esta laguna, buscando la muerte.

La Pachamama viéndome, no me dio la muerte. Más bien me transformó en sirena, pudiendo recordar, pero sin poder vivir con humanos. Ahora yo vivo aquí, todo el tiempo cantando, mi tristeza."

El corazón de Tupaq dolió. Dijo: "Yawar Waqaq, tú no estás sola. Yo estaré aquí contigo, cada mes, escuchándote."

Desde ese tiempo, Tupaq cada mes regresaba a la laguna, hablando con Yawar Waqaq. Ellos se volvieron amigos. La sirena ya no estaba tan triste, haciendo que Tupaq esté con ella cada día.

Un día, la Pachamama viendo el buen corazón de Tupaq, devolvió a la sirena a humana. Yawar Waqaq estaba liberada, como nube se transformó, salió de la laguna de oro.

Tupaq esperó a la sirena, pero ella en algunos segundos desapareció. Desde entonces, la laguna se llama "Laguna de Oro", donde la leyenda es recordada solo por los vivos.', NULL, '🏔️', '2025-11-29T04:18:06.310Z', '2025-11-29T04:18:06.310Z', 'Esta leyenda enseña sobre la compasión, la lealtad y el poder transformador del amor genuino. Muestra cómo la bondad y la persistencia pueden romper maldiciones. La sirena representa las almas perdidas por el desamor, y Tupaq simboliza la esperanza y la empatía. La moraleja es que ningún ser debe estar solo en su sufrimiento, y que pequeños actos de bondad pueden cambiar destinos. También refleja la creencia andina en la transformación espiritual y la conexión profunda entre humanos y naturaleza.', NULL, NULL, 'intermedio', NULL),
(96, 'cuento', 'quechua', 'Ukuku Orqopa', 'Huk hatun orqupi, qasam chakinrayku, ukuku kawsaq. Kay ukuquqa mana sapalla, aswanqa hatun familiayuqmi. Paykunaqa t''unpa pachapi kawsaq, chiripi, maypi rit''im sapa killa urmamusqa.

Ukuku taytaqa, Atoc sutiyuq, sumaq ukukum. Payqa challpakunata yachan, yurakumata yachan, mayta mikhuna tariy. Chayqa huk punchay tukuy tikrakarun.

Intiqa sinch''ita ruphayarqan. Rit''ikunaqa ch''ullnuyarqanku, maytaq ukukukunapa wasinmi chinkakarapusqa. Atocqa waqarqan: "¡Ñuqanchisqa wañunanchis! Rit''i manan kaqchu!"

Paykunapa churinku, Yuraq sutiyuq, nirqan: "Tayta, ñuqaqa maskaq huk allin wayt''ata. Noqanchisqa atipakunanchis!"

Yuraq puriyta qallarirqan, karuman karuman. Payqa tarirqan huk hatun sach''ata, maypi wayraqa q''uñi. Chaypim Condor Apu kawsaq, hatun kuntur, orqopa rikchaq.

Yuraqqa ninku: "Apu, ñuqanchisqa yanapakuyta necesitanchis. Orquqa ruphasqa, ñuqanchispa wasinanchis chinkamusqa."

Kuntur Apuqa Yuraqta qawarqan. Payqa yacharqan kay ukukunaqa allin sonqoyuq kasqanta. Ninku: "Churiy, qankunaqa allin kawsaqkuna kanki. Noqaqa yanapasqayki. Ichaqa qankunaqa aswan hatun orqoman aywanaykichis, maypi rit''iqa mana ch''ullnuyasqa, maypi chiri wasikunaqa kaqmi."

Yuraq kutirqan paypa taytanman. Tukuy familiaqa tantakurqanku, hatun viajeman qheparispa. Purirqanku killakuna, chayaspa aswan hatun orquta, Apu Ausangate nisqa.

Chaypim rit''i wiñaq, hatun qasakunapas. Ukukukunaqa huk muqu qhayapi wayta tarirqanku, chaypim kawsayta qallarishanku.

Chaymantapacha, ukukukunaqa Apu Ausangatepim kawsanku. Paykunaqa agradecekuranku Kuntur Apuwan Pachamamawan, salvakusqankumanta. Paykunaqa respetasqa, mana pipas paykunata millanamanchu.', 'En un gran cerro, por el frío extremo, vivía un oso. Este oso no estaba solo, más bien tenía una gran familia. Ellos vivían en tiempo de helada, en el frío, donde la nieve cada mes caía.

El padre oso, llamado Atoc, era un hermoso oso. Él conocía plantas, conocía hierbas, dónde encontrar comida. Pero un día todo cambió.

El sol calentaba fuertemente. Las nieves se derretían, donde la casa de los osos desapareció. Atoc lloraba: "¡Nosotros moriremos! ¡No hay nieve!"

Su hijo, llamado Yuraq, decía: "Padre, yo buscaré un buen lugar. ¡Nosotros venceremos!"

Yuraq comenzó a caminar, lejos y lejos. Él encontró un gran árbol, donde el viento era frío. Ahí vivía el Cóndor Apu, gran cóndor, espejo del cerro.

Yuraq dice: "Apu, nosotros necesitamos ayuda. El cerro se calentó, nuestra casa desapareció."

El Cóndor Apu miró a Yuraq. Él supo que estos osos eran de buen corazón. Dice: "Hijo, ustedes son buenos vivientes. Yo les ayudaré. Pero ustedes deben ir a un cerro más alto, donde la nieve no se derrite, donde hay casas frías."

Yuraq regresó a su padre. Toda la familia se reunió, preparándose para el gran viaje. Caminaron meses, llegando al cerro más alto, llamado Apu Ausangate.

Ahí la nieve crece, también hay grandes heladas. Los osos encontraron refugio en una cueva fría, ahí comienzan a vivir.

Desde entonces, los osos viven en el Apu Ausangate. Ellos agradecieron al Cóndor Apu y a la Pachamama, por salvarlos. Ellos son respetados, nadie los odia.', NULL, '🏔️', '2025-11-29T04:18:06.310Z', '2025-11-29T04:18:06.310Z', 'Este cuento enseña sobre la adaptación al cambio climático y la importancia de buscar soluciones ante las adversidades. Yuraq representa la valentía juvenil y la iniciativa. El Cóndor Apu simboliza la sabiduría que guía a quienes la buscan. La migración de los osos al Ausangate explica por qué estos animales sagrados viven en las alturas. La moraleja es que ante los cambios, debemos tener coraje para buscar nuevos caminos y pedir ayuda a los sabios.', NULL, NULL, 'intermedio', NULL),
(97, 'cuento', 'aymara', 'Qamaqi ukat Phaxsi', 'Nayra pachanakana, mä jach''a qamaqi jakïna. Jupax wali yatirina, ukhamarus wali jan walt''äwina. Sapa aruma jupax qullunakaru uñstayäna, ukax yatiqañataki.

Mä uru, qamaqi Phaxsiru uñti. Phaxsix qullunakan taypin sumach''ukiwa jakaskäna. Qamaqi sarnaqasax sasaw:

"¡Phaxsi! Phaxsi sumäwa! Nayax muntha jumatjam puriñ ukar sarañapataki."

Phaxsix jaysäna, qamaqi jan sum amuyunïtaw sasa. Nayri:

"Qamaqi, jumasti nayrthapxta. Jumasti mä jan walt''iri kanktawa. Kunatsa nayarux munapxta?"

Qamaqi ajayumpis nayri: "Nayax mä yatiriw jicha. Nayax yatiña munta jumana alajpacha qillqt''at tuqita, sumanak''anak tuqita. Nayrax yatxatt''apxsma, ichas janiw nayrax Phaxsi tuqit mä jisk''a yatxatthapkti."

Phaxsix qamaqir sarnaqasax wali jan kustäna. Ukampisti, mä p''iqi qamaqi jumanak uka qillqawinaka mistust''ayañataki.

"Ukat kunjamatï, qamaqi. Nayax jumparu mä amtawi quñani. Jumasti qullunar sarnaqañamawa, sapa qullunar mä yatiqawi jikxatañama. Kimsa phaxsi qhipaxa, nanakaw jikisiñani. Siw jumasti nayat sipansa wali yatiqatasa, jumaru alajpachar purt''ayañama."

Qamaqi kusisisaw qalltix sarañ qullunakaru. Nayriri qulluna, jupax mä marani jikxatayi. Maranix sasaw: "Qamaqi, sumanak''ax janiw wali chhijñu tuqikiti, akanakax jan walt''äwinakan tuqikispawa."

Payiri qulluna, jupax mä kunturi jikxatayi. Kunturix sasaw: "Qamaqi, wali jach''anakax janiw taqi jaqinakan tukuyapakiti. Amuyt''asiñax taqi tuqikiw jach''awa."

Kimsa phaxsi qhipa, qamaqi Phaxsimp kutt''ayi. Phaxsix jiskt''ayi: "¿Kuna yatiqatati?"

Qamaqi nayri: "Nayax yatxattwa. Sumanak''ax janiw chhijñu tuqikiti. Jach''anak''ax munañanakampiw jikxatasi. Nayax jichasti jan walt''iri sasaw lup''iña."

Phaxsix wali kusisi. Nayri: "Qamaqi, jumasti jichhasti yatirina. Ukhamarusa, nayax jumaru mä yänakaw quni. Sapa uru, alajpachat uñt''ayañamataki, ichas jumasti jaqinakar yatichañama, kuna yatiqatamatix ukanak yatichañataki."

Ukankamax qamaqi sapa uru qullunakar sarnaqaski, yatichaskiwa jaqinakaru sumanak''anakampi jan walt''äwinakampi. Jupax mä yatiriruw tukupayi, mayamp jan walt''awir ukasti.', 'En tiempos antiguos, vivía un gran zorro. Él era muy sabio, pero también muy travieso. Cada noche él miraba a los cerros, para aprender.

Un día, el zorro vio a la Luna. La Luna estaba viviendo hermosamente en medio de los cerros. El zorro caminando decía:

"¡Luna! ¡Luna hermosa! Yo quisiera contigo caminar hacia arriba para ir."

La Luna se reía, diciendo que el zorro no tiene buen pensamiento. Dijo:

"Zorro, yo te conozco primero. Tú eres uno malo. ¿Por qué me quieres a mí?"

El zorro con alma dijo: "Yo soy un sabio ahora. Yo quiero saber de ti sobre la escritura del cielo, sobre las hermosuras. Yo he aprendido, quizás yo no he aprendido nada pequeño sobre la Luna."

La Luna al zorro caminando no le gustó mucho. Sin embargo, pensó enseñarle al zorro algunas de esas escrituras.

"Entonces así, zorro. Yo te doy un pensamiento. Tú debes caminar a los cerros, en cada cerro encontrarás una enseñanza. Tres meses después, aquí nos encontraremos. Si tú me convences que has aprendido bien, te llevaré al cielo."

El zorro alegrándose comenzó a ir a los cerros. En el primer cerro, él encontró a una víbora. La víbora decía: "Zorro, la hermosura no es sobre tener rabia, es sobre las maldades."

En el segundo cerro, él encontró a un cóndor. El cóndor decía: "Zorro, las grandes cosas no son para terminar de todas las personas. Pensar en todo es grande."

Tres meses después, el zorro regresó a la Luna. La Luna preguntó: "¿Qué has aprendido?"

El zorro dijo: "Yo he aprendido. La hermosura no es sobre rabia. Las grandezas vienen con deseos. Yo ahora dejo de ser llamado malo."

La Luna muy alegre. Dijo: "Zorro, tú ahora eres sabio. Y también, yo te doy un trabajo. Cada día, para mirar el cielo, quizás tú debes enseñar a las personas, lo que has aprendido enseñarles."

Desde entonces el zorro cada día camina por los cerros, enseñando a las personas sobre hermosuras y maldades. Él se volvió un sabio, ya no más siendo malo.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Este cuento enseña sobre la redención y el aprendizaje. El zorro, tradicionalmente visto como travieso en la cultura andina, busca transformarse a través del conocimiento. La Luna representa la sabiduría divina que prueba a quienes desean aprender. La moraleja es que nadie nace sabio, y que incluso aquellos considerados "malos" pueden cambiar mediante el esfuerzo y la humildad. También muestra que la verdadera sabiduría incluye reconocer nuestros defectos.', NULL, NULL, 'intermedio', NULL),
(98, 'cuento', 'aymara', 'Imilla ukat Kurmi', 'Mä jach''a qullunak taypin, mä imilla sutinix Phuju kasäna. Jupax sapa uru qullunakaru uywanakamp sartäna. Jupax wali sumas takiskäna.

Mä uru, jallu ch''allxtayäna. Jalluxa q''uñitawa, intix mistxatäna ukhamaraki. Ukaxa mä jach''a kurmi aljiri. Kurmix sapa saminakampiw aljiri: wila, qillu, ch''uxña, anqas, larama, kulli, janq''u.

Phuju kurmiru uñstasax sasaw: "¡Kurmi! ¡Kurmi sumäwa! Kawkïtsa sarnaqta?"

Kurmix jaysäsax nayri: "Phuju, nayax sarnaqtha alajpachat uka pacharu. Nayax mä irpiriw Pacha Maman, intimpi jallunar mayachasiri."

Phuju sasaw: "Nayax jupampiw sarañ munta. Nayax janiw kawkir sarxatthakti, mayats kurmix puriski ukarux sarañ munta."

Kurmix amuyt''asi. Jupax imillaru uñji, sonqopax sumäskiwa. Nayri: "Ukamaraki, Phuju. Jumasti nayamp sart''asisma, ukampisti mä amtanaka pächañamawa. Nayax kimsa jisk''a yan''anaka quñani. Kimsa uru qhipa nanakaw jikisiñani kaypach jikxatañataki."

Nayrïr yan''anaxa: manq''a uywanakar churañax sapa uru janiw armatakiti. Payïr yan''anaxa: jilanak''anar yanapt''añax jan munañkaspasa. Kimsa ñir yan''anaxa: Pachamaman yupaychañax taqpachan.

Phuju kusisisaw sasaw: "Nayax pacht''äna sapa yan''anaka."

Nayri uran, Phuju uywanakar manq''a churxayäna, jan armakipansti. Payiri uran, jilanakapax mä jach''a llamp''u apakätayna, Phujux jupanakaru yanapt''ayi, jan munxkaspasa. Kimsa uran, Phujux walja t''ikanaka apsusaw Pacha Maman quñ jikxatayi.

Kurmix jikxatäna. Jupax sasaw: "Phuju, jumasti sumanak''as sonqonit amtani. Kunjamatï, nayax mä jaya samimamp simt''ayañama."

Kurmix Phujur ch''uxña samimpi simt''ayi. Ukhat jall phaxsin saräna, Phujux uñjäna mayjt''awinak, qullunaka, qutanak, jach''a achuqallan sumachasïna aljayätänwa.

Ukankamasti, Phujux khuskäna mä jaya yatiña: kawkin kurmisti aljiri, ukanx suma amunak ukat jan walt''awinakax mayjt''ata. Jupax jaqinakarux yatichäna, taqinïs suma jakañapatakix suma lurañanakaw ruwañapa sasa.', 'En medio de grandes cerros, una niña llamada Phuju (nube) vivía. Ella cada día a los cerros con animales iba. Ella cantaba muy hermoso.

Un día, lluvia cayó. La lluvia era fría, el sol salió también. Entonces un gran arcoíris apareció. El arcoíris con cada color apareció: rojo, amarillo, verde, azul, anaranjado, morado, blanco.

Phuju al arcoíris mirando decía: "¡Arcoíris! ¡Arcoíris hermoso! ¿A dónde caminas?"

El arcoíris riéndose dijo: "Phuju, yo camino al cielo a ese mundo. Yo soy un mensajero de la Pacha Mama, mezclando sol con lluvia."

Phuju decía: "Yo contigo quiero ir. Yo no he ido a ningún lugar, a donde el arcoíris camina quiero ir."

El arcoíris pensó. Él a la niña vio, su corazón era hermoso. Dijo: "Entonces así, Phuju. Tú conmigo caminarás, pero unos pensamientos debes vestir. Yo tres pequeños trabajos doy. Tres días después aquí nos encontraremos en este mundo encontrarse."

El primer trabajo era: dar comida a los animales cada día sin olvidar. El segundo trabajo era: ayudar a los hermanos aunque no quieras. El tercer trabajo era: agradecer a la Pachamama en todo momento.

Phuju alegrándose decía: "Yo vestiré cada trabajo."

El primer día, Phuju a los animales comida dio, sin olvidar. El segundo día, los hermanos una gran carga traían, Phuju a ellos ayudó, aunque no quería. El tercer día, Phuju muchas flores llevando a la Pacha Mama para dar encontró.

El arcoíris llegó. Él decía: "Phuju, tú de hermosas cosas corazón piensas. Entonces así, yo con un especial color te vestiré."

El arcoíris a Phuju con color verde vistió. Entonces al otro mes fueron, Phuju vio cambios, cerros, lagos, gran universo hermoseándose aparecían.

Desde entonces, Phuju obtuvo un conocimiento especial: donde el arcoíris aparece, ahí buenos pensamientos y maldades están cambiados. Ella a las personas enseñaba, que todos para vivir bien deben hacer buenas acciones.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Esta leyenda enseña sobre la responsabilidad y el cumplimiento de compromisos. El arcoíris (kurmi) es sagrado en la cultura aymara y representa la conexión entre mundos. Phuju aprende que para alcanzar cosas especiales se requiere esfuerzo diario, ayuda desinteresada y gratitud. La moraleja es que los privilegios vienen con responsabilidades, y que nuestras acciones diarias construyen nuestro carácter. El color verde simboliza la vida, la esperanza y la conexión con la naturaleza.', NULL, NULL, 'intermedio', NULL),
(99, 'cuento', 'aymara', 'Thayan Qalltawi', 'Nayra timpunak, janiw thayax utjkänti kay pachana. Jaqinakax jakasipki jan thayampi, ukaxa wali junt''uwa kasäna, jan wayra jist''antañataki.

Mä uru, mä jilata, Willka sutini, qullumar purxatayi. Jupax sasaw: "Pachamama, jaqinakax jan thayampiw junt''usipki. ¿Kuna luraña?"

Pacha Mamax musparpana Willkar uñstayatayna. Jupax mä jach''a warmi uñstayatayna, qullunakan taypin sayt''atawa. Sasaw:

"Willka, jumasti ch''aman sonqonïtawa. Kunjamatï, nayax mä yänakaw qutani. Jumasti mä hatun orqor puriñamawa, Illimani sutini. Ukanx mä jach''a phusiri, thayan taykapa. Jupax phusisaw, thayax mistuni."

Willkax orqor sarnaqäna. Purxäna killanak, taypi jan manq''asamp ukhamarakis jan phusiñamp. Ukaxa jupax mä aymara sonqomp ch''amachasiwa.

Illimani orqor purst''asaw, Willkax uñji mä jach''a phuku, ukaxa rit''imp junt''ata kasäna. Ukank mä jach''a thaya tayka jakasäna, sutipax Wayra kasäna.

Wayra Willkar sasaw: "¿Kunats muntha, jaqicha?"

Willka muxsa sonqomp sasaw: "Mamita, jaqinakax thayan tuqiw makxatapki. Janiw thayax utjkiti. Jumasti nayar yanapt''apxitati?"

Wayra Willkar uñji. Jupax yatxatayna kunatixa kaypachanx suma thayax utjkaspax taqiniw suma jakasipxispa. Sasaw:

"Willka, nayax yanapt''ana. Ukampisti, jumasti mä ch''aman lurawi pacht''añamawa. Jumasti aka phusiri aptr''añamawa, ukhamaraki kaypach sarañ phoqt''ayañataki."

Willkax phusiri apt''ayi. Ukaxa wali jach''a kasäna, jila pxata phusir lurata. Willkax sarnaqasax, phusisaw thayax qallti mistuña.

Ukasti, jaqinakax uñji thayan pur puriski. Taqinïx kusisisaw qamaqayapxi: "¡Thayax utat puriski! ¡Kusisiñäni!"

Willkax Wayra taykamp chimpu taypir chhakañchasaw kaypach kutt''ayi. Jaqinakax Willkar yupaychapxi, thayan apjasitapataki. Jupax sapa uru phusisaw, thayax qullunakat, pampanakat, qutanakat purisïna.

Ukankamasti, jaqinakax yatapxi kunatix thayax mä jach''a bendición Pachamaman kasqasax. Sapa uru yupaychapxiwa Willkar, Wayrar ukhamarakis Pacha Mamar.', 'En tiempos antiguos, no había viento en este mundo. Las personas vivían sin viento, eso era muy caluroso, sin aire para respirar.

Un día, un hermano, llamado Willka, fue caminando al cerro. Él decía: "Pachamama, las personas sin viento están calurosas. ¿Qué hacer?"

La Pacha Mama en sueño a Willka se apareció. Ella una gran mujer se apareció, en medio de los cerros estaba parada. Decía:

"Willka, tú tienes corazón fuerte. Entonces así, yo un trabajo doy. Tú debes ir a un gran cerro, llamado Illimani. Ahí hay un gran soplador, la madre del viento. Ella soplando, el viento saldrá."

Willka al cerro caminó. Fue caminando meses, en medio sin comer y también sin soplar. Pero él con corazón aymara se fortaleció.

Al cerro Illimani llegando, Willka vio una gran cueva, esa con nieve estaba llena. Ahí una gran madre viento vivía, su nombre era Wayra.

Wayra a Willka decía: "¿Qué quieres, hombrecito?"

Willka con corazón humilde decía: "Madrecita, las personas sobre viento están pidiendo. No hay viento. ¿Tú me ayudarías?"

Wayra a Willka vio. Ella había aprendido que si en este mundo hubiera buen viento todos vivirían bien. Decía:

"Willka, yo ayudaré. Pero, tú debes vestir un fuerte trabajo. Tú debes llevar este soplador, y también por este mundo ir esparciendo."

Willka el soplador llevó. Ese era muy grande, de varios colores de soplar hecho. Willka caminando, soplando el viento comenzó a salir.

Entonces, las personas vieron que el viento estaba caminando. Todos alegrándose gritaban: "¡El viento está viniendo a la casa! ¡Alegrémonos!"

Willka con Wayra madre en medio de comunidad descansando a este mundo regresó. Las personas a Willka agradecieron, por haber traído el viento. Él cada día soplando, el viento de los cerros, de las pampas, de los lagos caminaba.

Desde entonces, las personas saben que el viento es una gran bendición de la Pachamama. Cada día agradecen a Willka, a Wayra y también a la Pacha Mama.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Esta leyenda explica el origen divino del viento y su importancia para la vida. En la cosmovisión aymara, cada elemento natural tiene un origen sagrado y una madre protectora. Willka representa el sacrificio y la perseverancia por el bien común. La moraleja enseña que los grandes beneficios requieren grandes esfuerzos, y que debemos agradecer los dones naturales que a menudo damos por sentados. El viento simboliza el aliento de vida y la conexión entre todos los seres.', NULL, NULL, 'intermedio', NULL),
(100, 'cuento', 'aymara', 'Challwiri ukat Qutan Sirina', 'Titicaca qutan patxan, mä challwiri jakäna, Apaza sutini. Jupax sapa uru qutaru saräna challwa katurkañ ayllupataki. Jupax mä suma jaqiwa, jan khitir jan walt''ir luriri.

Mä uru, Apaza challwa katukat jikxatanaw mä jach''a uñstawi. Mä warmi, ukaxa challwa chakat sintiwa, ukax qutankat misturiwa. Jupax wali sumäna, qullunakan samininak janiwa ukjatakixa.

Apazax manchasisaw jithiqti: "¿Khitsa jumasti? ¿Sirinati?"

Sirinax jaysasisaw sasaw: "Jisa, Apaza. Nayax mä sirinaw, Quta Mamana sutijja. Nayax aka qutana jaktha. Kunjamats janiw nayar ajllkiti?"

Apaza amuykipasaw sasaw: "Nayax sapa uru kaypan challwa katurktha, ukampis nayax janiw khitis sirina jikxatthapktti. Kunats muntha nayat?"

Quta Mamax wali llakisita uñstayasaw sasaw: "Apaza, nayax mä aruskipawi munta. Nayax ñawra timpunakat kaykanakaw jakthwa, janiw khitis nayamp arusiri. Taqinix manchasipxiwa, nayax milltasipxiwa."

Apazax sonqopax llakisin. Sasaw: "Quta Mama, janiw jumasti miltañakiti. Jumasti sumawa. Kunats lurañ atthta?"

Sirinax sasaw: "Nayax sapa uru kaykanw takistha, ukampis nayax mä arust''iriruw muntha. Jumasti sapa phaxsi kaypan sarnaqapxitati nayamp arust''asiñataki?"

Apaza amuyt''asisaw sasaw: "Kunats jani? Nayax qutan jupat uñcht''apxthwa, ukampis nayax janiw khitis suma jaqit jikxatthaktti. Jumasti suma amuyunïtawa."

Ukankamasti, Apaza sapa phaxsi qutaru kutt''atäna Quta Mamamamp arust''asiñataki. Payirinakax amigonakamaw tukt''apxi. Sirinax jichasti janiw aski llakisiti, Apaza ukan kasipataki.

Mä uru, mä jan walt''a jaqix Quta Mamar churat munkäna. Jupax yatxatäna sirinax mä jach''a payasa imatkisa. Apazax ukar uñjasaw, jithisaw qutan patxar siri.

"¡Quta Mama! ¡Mä jan walt''a jaqix jumaru churat munkaskiwa!"

Sirinax khuskhusisaw manqha qutaru. Ukampisti, Apazax jan walt''a jaqimp ch''amanchasisaw sasaw: "Janiw jumasti sirina churpxkaspatti! Jupax nayan amigojawa!"

Jan walt''a jaqix Apazar ajllisaw saransäna. Quta Mamax Apaza wali ch''aman sonqonit uñjisaw, mä jacha miraki luri.

Sirinax Apazar sasaw: "Apaza, jumasti nayatakix wali ch''amakankthawa. Kunjamatï, nayax jumparu mä surti qutana. Sapa uru jumasti challwa katurkañ atapxta, ukampis sapa challwax mä jach''a bendición kanpachani."

Ukankamasti, Apaza challenganakax wali jilïriw jikxatasïna. Jaqinakax Apazar sum machaq uñjasipxi, ukampisti jupax wali sumaw jaqinakaru yanapt''apxäna.

Ukankamax, Apaza ukat Quta Mamax amigonakamarakiw qhipäxarusipxi. Jaqinakax yatxatapxi qutax mä jach''a sariri, mayats respetañax ukax bendicionanakampiw kutt''aspa.', 'En la orilla del lago Titicaca, vivía un pescador, llamado Apaza. Él cada día al lago iba a agarrar pescado para la familia. Él era una buena persona, a nadie mal hacedor.

Un día, Apaza pescado agarrando encontró una gran aparición. Una mujer, esa con pies de pez estaba vestida, esa del lago había salido. Ella era muy hermosa, de los colores de los cerros no era diferente.

Apaza asustándose preguntó: "¿Quién eres tú? ¿Eres sirena?"

La sirena riéndose decía: "Sí, Apaza. Yo soy una sirena, mi nombre es Quta Mama (Madre Lago). Yo vivo en este lago. ¿Cómo es que no me has escogido?"

Apaza pensando decía: "Yo cada día aquí pescado agarro, pero yo no he encontrado a nadie sirena. ¿Qué quieres de mí?"

Quta Mama muy triste apareciendo decía: "Apaza, yo quiero una conversación. Yo desde tiempos antiguos aquí vivo, nadie conmigo habla. Todos tienen miedo, de mí tienen asco."

A Apaza su corazón entristeció. Decía: "Quta Mama, no debes ser odiada. Tú eres hermosa. ¿Qué puedo hacer?"

La sirena decía: "Yo cada día aquí canto, pero yo quiero un hablador. ¿Tú cada mes aquí caminarías conmigo para conversar?"

Apaza pensando decía: "¿Por qué no? Yo al lago contigo miro, pero yo no he encontrado a nadie buena persona. Tú tienes buen pensamiento."

Desde entonces, Apaza cada mes al lago regresaba con Quta Mama para conversar. Los dos se volvieron amigos. La sirena ahora ya no estaba tan triste, por Apaza estar ahí.

Un día, una mala persona a Quta Mama quería atrapar. Él había aprendido que la sirena tenía un gran tesoro algo. Apaza eso viendo, corrió hacia la orilla del lago.

"¡Quta Mama! ¡Una mala persona te quiere atrapar!"

La sirena rápidamente al fondo del lago se fue. Sin embargo, Apaza con la mala persona fortaleciéndose decía: "¡No atraparás a la sirena! ¡Ella es mi amiga!"

La mala persona a Apaza mirando se fue. Quta Mama de Apaza el muy fuerte corazón viendo, un gran milagro hizo.

La sirena a Apaza decía: "Apaza, tú para mí muy fuerte has estado. Entonces así, yo a ti una suerte doy. Cada día tú podrás agarrar pescado, pero cada pescado será una gran bendición."

Desde entonces, los pescados de Apaza muy grandes llegaron a ser. Las personas a Apaza con buenos ojos veían, pero él muy bien a las personas ayudaba.

Desde allí, Apaza y Quta Mama amigos continuaron siendo. Las personas aprendieron que el lago es un gran caminador, donde respetarlo es con bendiciones regresar.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Este cuento enseña sobre la amistad verdadera más allá de las diferencias y el valor de defender a los vulnerables. La sirena representa a los seres marginados que necesitan compañía y respeto. Apaza simboliza la bondad genuina y la valentía de proteger a los amigos. La moraleja es que la verdadera riqueza no está en tesoros materiales, sino en las relaciones basadas en el respeto mutuo. También enseña que el lago Titicaca es sagrado y debe ser respetado, pues es hogar de seres especiales.', NULL, NULL, 'intermedio', NULL),
(101, 'cuento', 'aymara', 'Wayna Waranakan arust''iri', 'Mä jach''a ayllunak taypin, mä wayna jakasäna, Qhari sutini. Jupax wali yatiqiriwa, ukampisti jupax askinakaruw jiskt''iri. Sapa aruma jupax alajpach waranakaru uñstasïna.

Jupapa awkinakax sarasïna: "Qhari, ¿kunatsa sapa uru alajpachar uñtt''asita? Jumasti challwanakar qhawawaykxañäni."

Qhari sasaw: "Awkiy, nayax waranakax arusipxtan amuyktha. Jupanakax sapa aruma mä jan uñt''ata rimaskipxi."

Awkinakax jan criyisax, jaysasipxäna. Ukampisti Qhari sapa aruma qullur sartasïna, waranakamp arust''asiñ munasaw.

Mä tuta, Qhari wali jach''a qucha patxan sarxatayi. Jupax alajpachar uñtasaw, waranakax wali sumach''ukiw aljayañ qallariri. Jupax sasaw:

"Waranaka, ¿khitipsa kunsa nayar yatichapxta?"

Mä jach''a waranax, Willka Warana sutini, sasaw: "Qhari, jumasti suma amuyunïta, ukat ch''aman sonqonïtawa. Kunjamatï, nanakax mä yatichawi qutana."

Waranakax Qharir yatichapxi kunatix sapa waranax mä nayranaksan kawki jaqinaks sarapxirïna. Waranakax sarapxapxi thakhinak uñacht''ayasa, jaqinakax jan chhaqhañapataki.

"Ukampisti," Willka Waranax nayri, "jumasti mä jach''a yan''anak lurañamawa. Jumasti ayllumar kutañama, jaqinakarux yatichañama, kunatixa nanakax kaykan kasitaxsa, taqiniw janiw sapallanakakiti sasaw."

Qhari kusisisaw, ukampisti jiskt''ayi: "¿Kunatsa nayax mä waranata jikxatañ atthta?"

Willka Waranax sasaw: "Sapa jaqinakax mä warananipxiwa alajpachan. Uka waranax jupanakan kawsawinakan uñstayiri. Suma lurañanakamp jaqix aswan sumach''ukiw aljiri, jan walt''a lurañanakamp jaqix jisk''achiri."

Qhari ukanak ist''asax, sonqopax wali muxsañatäna. Jupax kutañ qalltix ayllupar. Jupax taqinikarux yatichäna kunatsa waranakax yatichätapasa.

Jaqinakax nayrïr janiw criyañapxi. Ukampisti mä tuta, Qharix taqinakar pusxatayi qulluruxa alajpachar uñjañataki. Waranakax wali sumach''ukiw takxatañ qalltapxi, mayjawinak sumach''asañamp.

Ukankamasti, taqinix yatxatapxi kunatixa alajpachax mä jach''a qillqatawa, mayampis nanakax taqi mayacht''atawa. Jaqinakax qalltapxi suma jakañ, suma amuyunakarusa.

Qharix mä yatirix tukt''ayi, mayampis jupax janiw wali ch''amanak jan uñt''at jawsaña atkenapuni. Jupax yatiri jaqinakax waranakampiw uñacht''asipxirïna.', 'Una gran estrella, llamada Willka Warana (Estrella Sagrada), decía: "Qhari, tú tienes buen pensamiento, y tienes corazón fuerte. Entonces así, nosotras una enseñanza damos."

Las estrellas a Qhari enseñaron que cada estrella era donde personas de antes habían ido. Las estrellas iban mostrando caminos, para que las personas no se pierdan.

"Pero," Willka Warana dijo, "tú debes hacer un gran trabajo. Tú debes regresar a la comunidad, a las personas enseñarles, que nosotras estamos aquí, todos no estamos solos diciendo."

Qhari alegrándose, pero preguntó: "¿Por qué yo podría encontrar una estrella?"

Willka Warana decía: "Cada persona tiene una estrella en el cielo. Esa estrella es el aparecedor de sus vidas. Con buenas acciones la persona más hermosamente aparece, con malas acciones la persona se hace más pequeña."

Qhari esas cosas escuchando, su corazón muy humildemente se puso. Él comenzó a regresar a la comunidad. Él a todos enseñó lo que las estrellas le habían enseñado.

Las personas al principio no creyeron. Pero una noche, Qhari a todos llevó al cerro para ver el cielo. Las estrellas muy hermosamente comenzaron a brillar, hermoseando los cambios.

Desde entonces, todos aprendieron que el cielo es una gran escritura, donde también nosotros todos estamos unidos. Las personas comenzaron a vivir bien, con buenos pensamientos.

Qhari se volvió un sabio, donde también él no podía conversar mucho con desconocidos sin fuerzas. Él enseñó que las personas sabias con las estrellas están mostrados.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Este cuento enseña sobre la conexión cósmica y la responsabilidad personal. En la cosmovisión aymara, cada persona tiene su estrella que refleja sus acciones en la tierra. Qhari representa al buscador de conocimiento que comparte la sabiduría con su comunidad. La moraleja es que nuestras acciones afectan no solo nuestra vida terrenal, sino también nuestra existencia espiritual. También enseña que nadie está solo, todos estamos conectados en el gran tejido del universo.', NULL, NULL, 'intermedio', NULL),
(102, 'cuento', 'aymara', 'Qullu Jaytiri', 'Nayra pachanakan, jach''a qullunakax wali ch''amakäna, janiw jupanakax mayjtxakiti. Ukampisti mä qullu, Janq''u Qullu (Cerro Blanco) sutini, wali llakisiriw kasäna.

Janq''u Qullux uñjasäna kunatix jaqinakax sapa uru ch''amakipxi, llakisipxi, ukhamarakis jupanakax janiw respetañ yatxapkiti Pachamamar. Qullux sonqopax wali nanakäna.

Mä uru, qullux qalltix jaytiri. Jupapa jayt''awinakax rit''iruwa tikarapxi, jalluruxa, ukax pampanakaru uraykipxäna. Jaqinakax ajllisax sarapxi: "¿Kunatsa Janq''u Qullux jayasaskixa?"

Mä jach''a yatiri, Tata Choque sutini, qullur sartayi kunatix luraski ukat yatxatañataki. Jupax qullump jikxatasaw, qullux arusiri:

"Tata Choque, nayax jayasktwa kunatixa jaqinakax jan sum amuyuninak jakt''apxi. Jupanakax Pachamamar janiw yupaychasipkiti, jupanakax mayacht''asiñax jan yatxapkiti. Nayax wali llakisthwa."

Tata Choquex qullur saraw: "Janq''u Qullu, ¿kuna lurañax atthta?"

Qullux sasaw: "Nayax munapxthwa jaqinakax yatxatañapa kunatix taqinix mayacht''atawa. Qullunaka, jawira, qutat, inti, phaxsi – taqinix mä familiatwa. Jaqinakax ukat yatxatasipxix suma jakasipxaspawa."

Tata Choquex amuyt''asisaw sasaw: "Nayax ayllumarux yatichañawa. Ukampisti, ¿jumasti kunjamasa uñacht''ayapxta?"

Janq''u Qullux sasaw: "Nayax mä ch''iwix apayäna. Ch''iwix wila samiwa, ukax wali jach''a lurañanak uñacht''ayaspa. Siw jaqinakax ch''iwiruxa rit''impi yupaychasipxix, nayax jayxatamax sayt''añawa."

Tata Choquex ayllumar kutxatayi. Jupax taqinikar yatichäna kunatix Janq''u Qullux sañatapasa. Jaqinakax nayrïr jan criyasipxäna, ukampisti yatxatapxi kunatix qulluxa jawsaskiwa.

Taqinixa tantachapxi. Mä jach''a ceremonia lurxatäna. Jaqinakax rit''inak, t''ikanaka, winu, khuka apasax qulluruxa purxapxi. Jupanakax takisax, yupaychasax Pachamamar, Janq''u Qullur, taqpach Pachar.

Uka tutax mä mirakiw uñstayasäna. Janq''u Qullux sayt''ayi jaytañat. Alajpachax sumach''ukiw q''illu samimp k''achañachayi. Ch''iwix wali jach''ana aljiri qullun patxan, mayamp taqi jaqinakat uñjasax.

Ukankamasti, jaqinakax yatxatapxi kunatix Pachamamax, qullunakax, taqpach pachax uñakipanakawa. Jupanakax sapa wata mä ceremonia lurxapxi Janq''u Qullur yupaychasax.

Janq''u Qullux janiw jaytañax sayt''apxäna, ukampisti jupax chuymamp jaqinakampiw saräna, jupanakax yatxatasipax taqinix mayacht''atax sasa.', 'En tiempos antiguos, los grandes cerros eran muy fuertes, no se cambiaban. Pero un cerro, llamado Janq''u Qullu (Cerro Blanco), era muy triste.

Janq''u Qullu veía que las personas cada día se enojaban, se entristecían, y también ellos no sabían respetar a la Pachamama. El corazón del cerro dolía mucho.

Un día, el cerro comenzó a llorar. Sus lágrimas se volvieron nieve, en lluvia, eso bajaba a las pampas. Las personas mirando iban: "¿Por qué Janq''u Qullu está llorando?"

Un gran sabio, llamado Tata Choque, al cerro fue para aprender qué estaba haciendo. Él con el cerro encontrándose, el cerro habló:

"Tata Choque, yo estoy llorando porque las personas con malos pensamientos están viviendo. Ellos a la Pachamama no agradecen, ellos unirse no saben. Yo estoy muy triste."

Tata Choque al cerro decía: "Janq''u Qullu, ¿qué hacer puedo?"

El cerro decía: "Yo quiero que las personas aprendan que todos estamos unidos. Cerros, río, lago, sol, luna – todos somos una familia. Las personas eso aprendiendo vivirán bien."

Tata Choque pensando decía: "Yo a la comunidad enseñaré. Pero, ¿tú cómo mostrarás?"

Janq''u Qullu decía: "Yo he traído un pájaro ch''iwi. El ch''iwi es de color rojo, eso mostrará trabajos muy grandes. Si las personas al ch''iwi con nieve agradecen, yo dejaré de llorar."

Tata Choque a la comunidad regresó. Él a todos enseñó lo que Janq''u Qullu había dicho. Las personas al principio no creyeron, pero aprendieron que el cerro estaba hablando.

Todos se reunieron. Una gran ceremonia se hizo. Las personas con nieve, flores, vino, coca llevando al cerro fueron. Ellos cantando, agradeciendo a la Pachamama, a Janq''u Qullu, a todo el Mundo.

Esa noche un milagro apareció. Janq''u Qullu paró de llorar. El cielo hermosamente con color amarillo se iluminó. El ch''iwi muy grande apareció en la cima del cerro, donde también a todas las personas vio.

Desde entonces, las personas aprendieron que la Pachamama, los cerros, todo el mundo los están viendo. Ellos cada año una ceremonia hacen agradeciendo a Janq''u Qullu.

Janq''u Qullu el llorar paró, pero él con corazón con las personas fue, ellos aprendieron que todos estamos unidos.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Esta leyenda enseña sobre la interconexión entre naturaleza y humanidad, y las consecuencias de nuestro comportamiento. El cerro que llora representa el dolor de la naturaleza ante el maltrato humano. Tata Choque simboliza el sabio mediador entre mundos. La moraleja es que nuestras acciones afectan a toda la creación, y que el respeto y la gratitud pueden sanar heridas profundas. El ch''iwi (ave sagrada) es símbolo de la comunicación divina y la promesa renovada entre humanos y naturaleza.', NULL, NULL, 'intermedio', NULL),
(103, 'cuento', 'aymara', 'Yuqalla ukat Kunturi Usuntata', 'Mä jisk''a yuqalla, Inti sutini, uywanakarux michxäna qullunakan. Jupax wali suma sonqonïna, taqpach uywanakar sum uñjxatayna.

Mä uru, Intix mä jach''a kunturi usuntata jikxatayi. Kunturix jiwañ jak''ätayna, mä chiqan usutawa. Intix wali llakisitaw kunturir qawayi.

"Kunturi tata, ¿kuna usuntati? Nayax yanapt''apxta," Intix sasaw.

Kunturix wali usuntasaw janiw sum jawsañ atxäna, ukampisti jupax uñjxi Intipax suma sonqonïtaxa. Kunturix sasaw: "Yuqalla, nayax mä jan walt''a jaqit uskuntaytwa. Nayax janiw purtañ atktti."

Intix kunturir apayi jupapa utapar. Jupax kunturipax usunakan qullañ qalltayi qullanakan yatxatatanakampi. Sapa uru Intix manq''a churäna kunturir, uma churäna, ukhamarakis jupamp arusxätayna.

Killanakata qhipax, kunturix jach''añ qalltayi. Chiqapax alïtaw tukupayi. Kunturix Intir sasaw: "Yuqalla, jumasti nayatakix wali sumawa lurtawa. Nayax janiw kunjam yuspagarpxta yatktti, ukampisti nayax mä yänakaw qutana."

"Janiw, kunturi tata. Jumasti jan kuna yuspagarpxañakiti. Nayax munapxthwa yanapt''añaxa," Intix sasaw.

Kunturix admirasitaw Intipax suma sonqonir uñji. Sasaw: "Ukampisti nayax mä yatxatawi qutana. Jumasti mä pito lluxt''ayañamawa. Aka pitox ch''iwi saminiwa. Siw kunatix jansa wali ch''amak jan walt''awinakax utjki, aka pito phusakasa. Nayax jikxatañawa, yanapt''añataki."

Intix kusisitaw pitoti katuqatayi. Kunturix jupamp mä semanx qhipxatayi, ukampixa wali ch''amañtäna purt''añataki.

Mä aruma, kunturix Intir sasaw: "Kunjamatï, yuqalla, nayax sarañ wakiskthwa. Alajpachax suyt''askithwa. Ukampisti janiw armxañämakiti, sapa kutix jumasti nayar wakisktasa, pitu phusxapxasma."

Kunturix phawayasaw alajpachar sari. Intix wali llakisitaw kunturi sarañat uñjasaw, ukampisti kusisitakiwa kunturix jach''atänaxa.

Marata qhipax, Intipax ayllunapax mä jan walt''a pachax puriñ qalltayi. Mä jach''a tormenta puriñ qalltayi, ukax taqpach pampanakax chinkarapxañ munäna.

Intix yuyaripxi kunturipax pitoti. Jupax pitu lluxt''ayasaw phusxi. Ukax jach''a ch''iwa sonidow mistuni.

Minutonakata qhipax, kunturix jach''a poder kut jikxatayi. Jupax wali sumaw phawxatayi, tempestad jaqunt''asax sayt''ayi. Taqpach jaqinakax salvxatapxi.

"¡Inti! Jumasti nayar waktapxta. Nayax jikxatthwa yanapt''añaxa," kunturix sasaw alajpachata.

Ukankamasti, jaqinakax yatxatapxi kunatix allin lurañanakax wali jach''a kutt''ayañanakaniwa. Intix yatiri tukt''ayi, kunturinarux qullañ yatiri.

Jupax yatichxäna kunatix taqpach jakañanakax wali valorañakiwa, jan jach''a o jisk''atakis uñjasaw. Ukat suma lurañax sapa kutix wali bendicionanakamp kutt''aspa.', 'Un niño pequeño, llamado Inti, cuidaba animales en los cerros. Él tenía muy buen corazón, a todos los animales bien veía.

Un día, Inti un gran cóndor herido encontró. El cóndor estaba muriendo, en un ala estaba herido. Inti muy triste al cóndor miró.

"Cóndor padre, ¿qué te pasó? Yo te ayudaré," Inti decía.

El cóndor muy herido no podía hablar bien, pero él vio que Inti tenía buen corazón. El cóndor decía: "Niño, yo de una mala persona fui atacado. Yo no puedo ir."

Inti al cóndor llevó a su casa. Él las heridas del cóndor comenzó a curar con hierbas aprendidas. Cada día Inti comida daba al cóndor, agua daba, y también con él hablaba.

Después de meses, el cóndor comenzó a sanar. El ala bien se volvió. El cóndor a Inti decía: "Niño, tú para mí muy bien has hecho. Yo no sé cómo agradecer, pero yo un trabajo doy."

"No, cóndor padre. Tú no necesitas agradecer nada. Yo quería ayudar," Inti decía.

El cóndor admirado del buen corazón de Inti vio. Decía: "Pero yo una enseñanza doy. Tú debes sacar un silbato. Este silbato es de color rojo. Si acaso cuando muy fuertes malas cosas hay, este silbato soplando. Yo vendré, para ayudar."

Inti alegre el silbato agarró. El cóndor con él una semana se quedó, con eso muy fuerte se puso para ir.

Una noche, el cóndor a Inti decía: "Entonces así, niño, yo debo ir. El cielo me está esperando. Pero no olvides, cada vez tú me necesites, el silbato soplarás."

El cóndor volando al cielo fue. Inti muy triste viendo al cóndor irse, pero también alegre porque el cóndor estaba sano.

Después de años, en la familia de Inti un mal tiempo comenzó a venir. Una gran tormenta comenzó a venir, eso todas las pampas querían desaparecer.

Inti recordó el silbato del cóndor. Él el silbato sacando sopló. Eso un gran sonido rojo salió.

Después de minutos, el cóndor con gran poder de repente llegó. Él muy bien voló, la tempestad reuniendo paró. Todas las personas se salvaron.

"¡Inti! Tú me has llamado. Yo he venido a ayudar," el cóndor decía desde el cielo.

Desde entonces, las personas aprendieron que las buenas acciones son muy grandes pagos. Inti se volvió sabio, curador de cóndores sabedor.

Él enseñaba que todas las vidas son muy valiosas, sin ver grande o pequeño. Y que las buenas acciones cada vez con muchas bendiciones regresan.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Este cuento enseña sobre la compasión, la bondad desinteresada y la reciprocidad sagrada. Inti representa la pureza infantil y el cuidado genuino por todos los seres. El cóndor simboliza el poder protector que responde a la bondad. La moraleja es que ayudar a otros sin esperar nada a cambio crea lazos que trascienden lo ordinario. También enseña que ninguna criatura es insignificante, y que el respeto por la vida siempre es recompensado. El silbato rojo representa la conexión eterna entre almas nobles.', NULL, NULL, 'intermedio', NULL),
(104, 'cuento', 'aymara', 'Sawuña Warmi ukat Kurmi', 'Mä ayllunak taypin, mä warmi sawuna wali suma uraqit sawäna. Jupapa sutinix Sami kasäna, kunatix jupapa sawunakax wali sumach''ukïna, taqpach saminakamp.

Sami sapa uru sawasäna, ukampisti mä uru jupax janiw kunatix sawañas jikxatxiti. Jupax wali llakisiri, kunatix janiw sumanak''a amuyt''añ atxayna.

"¿Kunats nayax sawañaxa? Janiw kuna amuyunakax puriskapuniti," Samixa sasaw jayxatäna.

Uka tutax, Samixa muspharpxäna. Mä jach''a kurmi, qhana saminakampiwa aljxatayi jupan muspharpan. Kurmix warmi uñstayasaw, wali sumawa, sapa samimp simtata.

"Sami, ¿kunatsa llakisitati?" kurmixa jiskt''i.

"Nayax janiw kuna sawañas jikxatktti. Nayan amuyunajax janiw puriskapuniti," Samixa nayri.

Kurmix jaysasitaw sasaw: "Sami, jumasti suma sawuñänïtawa, ukampisti jumasti mä yatichawi jikxatañamawa. Saminakax janiw sapakiñanakakiti. Taqpachanx mayacht''asitawa."

"¿Kunjamasa?" Samixa jiskt''i.

"Sapa samix mä yatiyäwiw apani. Wila samixa: ch''amani ukat munasiña. Q''illu samixa: inti kusisiñani ukat jach''aña. Ch''uxña samixa: pacha ukat jakaña. Anqas samixa: uma ukat amuyt''aña. Taqinix mayacht''asitawa mä jach''a uraqit luruñataki."

Samixa sonqopax khuskxi. Sasaw: "Kunjamatï, ¿nayax sawañas kunjamas wakicht''añaxa?"

Kurmix sasaw: "Jumasti qullumar sarañamawa. Ukanakax sapa saminak yatichirin jikxatañamawa. Jupanakax jumaru mä samir quñapxani. Pusi qullunak sarañamawa. Ukhamakasax, jumasti kurmijam sawañ atapxta."

Sami q''esasaw, kunjamatix kurmix sapäsa. Nayrïr qullunar purixatayi, ukanakax Wila Qullu kasäna. Ukanx mä jach''a nina jakasäna, wila samimpiw k''achantiri.

Ninax Samir sasaw: "Sami, nayax wila samiw aptha. Ch''amani ukat munasir aptha. Sawunakan taypin, wila samixa sonqo, chuyma, munayä mistuyiriwa." Ninax Samir mä wila sampa apayayi.

Payïr qullunar, Q''illu Qullur purixi. Ukanx inti k''achantasarakiwa. Intix sasaw: "Nayax q''illu samiw aptha. Kusisiñani, jach''añani. Sawunakanx, q''illu samixa inti uywa, jakañapaki ch''amachiriwa." Q''illu sampa apayi.

Kimsa ñir qullunar, Ch''uxña Qullur purixi. Ukanx qutawa jakasäna, ch''uxña samimpi k''achantiri. Qutax sasaw: "Nayax ch''uxña samiw aptha. Jakaña, uma, pacha. Sawunakanx, ch''uxña samixa taqpach uñachtayaspa." Ch''uxña sampa apayi.

Pusi ñir qullunar, Anqas Qullur purixi. Ukanx wayra jakasäna, alajpach samimpi. Wayrax sasaw: "Nayax anqas samiw aptha. Amuyt''aña, sapxaña, qhanachayaña. Sawunakanx, anqas samixa amuyt''awi mistuyiriwa." Anqas sampa apayi.

Sami ayllumar kutxatayi. Jupax qalltxi sawuña mä jach''a aguayo, taqpach saminakamp. Jupax mayacht''ayi taqpach yatichañanaka.

Uka aguayoxa wali sumach''ukïtaw qalltiri. Sapa jaqix uñjasax saräna: "¡Kay aguayoxa kurmijamawa! ¡Janiw kunjama sawutakisa!"

Sami jichhax yatxatayna kunatixa sawuñax janiw sapaki lurañakiti. Sapa samixa mä yatiyäwiw apani, ukat taqpachan mayacht''asitawa mä suma uñtatanakaw mistuni.

Ukankamasti, Sami mä jach''a sawuñ yatiri tukupayi. Jupax yatichxäna taqpach wawanakar, kunatix saminakax amuyt''asiñanak ukax sawuñanakampisa. Jupax sapxäna kunatix jakawisanakax kurmijamakiwa: taqpach amuyunaka, ch''amanaka, munañanakax mayacht''asisa, mä suma jakaña lurañataki.', 'En medio de una comunidad, una mujer tejedora muy bien tejía con colores. Su nombre era Sami (Color), porque sus tejidos eran muy hermosos, con todos los colores.

Sami cada día tejía, pero un día ella no encontró qué tejer. Ella estaba muy triste, porque no podía pensar hermosuras.

"¿Qué tejeré? Mis pensamientos no están viniendo," Sami decía llorando.

Esa noche, Sami soñó. Un gran arcoíris, con colores brillantes apareció en su sueño. El arcoíris en mujer apareciendo, era muy hermosa, con cada color vestida.

"Sami, ¿por qué estás triste?" el arcoíris preguntó.

"Yo no he encontrado qué tejer. Mis pensamientos no están viniendo," Sami dijo.

El arcoíris riéndose decía: "Sami, tú tienes buen tejer, pero tú debes encontrar una enseñanza. Los colores no son solos. En todo están unidos."

"¿Cómo?" Sami preguntó.

"Cada color lleva un mensaje. Color rojo es: fuerza y amor. Color amarillo es: sol alegría y grandeza. Color verde es: mundo y vida. Color azul es: agua y pensamiento. Todos unidos están para hacer un gran tejido."

El corazón de Sami entendió. Decía: "Entonces así, ¿cómo preparo mi tejido?"

El arcoíris decía: "Tú debes ir al cerro. Ahí encontrarás a cada enseñador de color. Ellos te darán un color. Debes ir a cuatro cerros. Entonces así, tú podrás tejer como arcoíris."

Sami despertó, haciendo como el arcoíris había dicho. Al primer cerro fue, ese era Cerro Rojo. Ahí vivía un gran fuego, con color rojo brillaba.

El fuego a Sami decía: "Sami, yo llevo color rojo. Llevo fuerza y amor. En los tejidos, color rojo es corazón, alma, amor salidor." El fuego a Sami una lana roja dio.

Al segundo cerro, Cerro Amarillo fue. Ahí el sol también brillaba. El sol decía: "Yo llevo color amarillo. Alegría, grandeza. En los tejidos, color amarillo es sol crianza, para vivir fortalecedor." Lana amarilla dio.

Al tercer cerro, Cerro Verde fue. Ahí un lago vivía, con color verde brillaba. El lago decía: "Yo llevo color verde. Vida, agua, mundo. En los tejidos, color verde todo muestra." Lana verde dio.

Al cuarto cerro, Cerro Azul fue. Ahí el viento vivía, con color del cielo. El viento decía: "Yo llevo color azul. Pensamiento, conocimiento, claridad. En los tejidos, color azul pensamiento salidor es." Lana azul dio.

Sami a la comunidad regresó. Ella comenzó a tejer un gran aguayo, con todos los colores. Ella unió todas las enseñanzas.

Ese aguayo muy hermosamente comenzó a ser. Cada persona viéndolo iba: "¡Este aguayo es como arcoíris! ¡Nunca así tejido!"

Sami ahora había aprendido que el tejido no es hacer solo. Cada color lleva un mensaje, y todo junto es salir hermosas vistas.

Desde entonces, Sami una gran tejedora sabia se volvió. Ella enseñaba a todos los niños, que los colores son pensamientos también en los tejidos. Ella decía que las vidas son como arcoíris: todos los pensamientos, fuerzas, amores unidos, hacen una buena vida.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Esta leyenda enseña sobre la integración y el valor de la diversidad. Cada color representa aspectos esenciales de la vida que deben trabajar juntos. Sami simboliza al artista que aprende que la verdadera creatividad viene de comprender las conexiones profundas. La moraleja es que nada existe de forma aislada, todo está interconectado. En el tejido andino, cada color tiene significado espiritual y social. El cuento también enseña que la belleza surge de la unión armoniosa de diferentes elementos.', NULL, NULL, 'intermedio', NULL),
(105, 'cuento', 'aymara', 'Rit''i Qullunakan Arktawi', 'Jach''a qullunakan patxanx, kawkïn rit''inakax sapa maranakaw wiñapxi, mä jach''a mallku jakasäna. Jupax Jach''a Rit''i sutiyxätäna. Jupax taqpach rit''i qullunakan arkatiri kasäna.

Mä wawa, Illapa sutini, wali yatiqiriwa. Jupax sapa kutix qullunakar uñt''asäna, yatiqasäna qurlunakan, qullanakan, taqpach imaynakan tuqita.

Mä uru, Illapa qullur sarnaqasax, wali ch''ijch''i kasäna. Jupax chhaqhasax pusiri. Uka tutax, jupax mä jach''a phuku ukxar jikxatayi. Ukanx mä jach''a condorwa jakasäna.

Condorax Illapar sasaw: "Wawa, ¿kunatsa juma kaykanxa? Kunjamatï janiw chhaqañamakiti."

Illapa wali ajjasaw sasaw: "Nayax qullunak yatxatañ munapxthwa, ukampix chhaqhapxtha."

Condorax sasaw: "Nayax jumaru pusañ atthwa Jach''a Rit''ir. Jupax qullunakan mallkupawa. Jupax jumaru yatichañ atxi."

Illapa condor qhipan sarasax, mayja alajpach qullunakaru purasaw, chayapxi mä jach''a rit''i pallalla, ukanx mä jach''a achachila jakasäna, rit''impi simtata, jank''ak chanuniw.

Jach''a Rit''ix Illapar uñjasax sasaw: "Wawa, ¿kunatsa kaykar jutapxtati? Kaykanakax jan jaqinakatakikiti."

Illapa muxsañatäsaw sasaw: "Tata, nayax qullunakan tuqit yatxatañ munapxthwa. Nayax nayan ayllujar yatichañ munapxtha kunatix qullunakax wali valorañanak kasqasa."

Achachilax admirasitaw Illapa sonqonit uñji. Sasaw: "Kunjamatï, wawa. Nayax jumparu yatichañawa. Ukampisti jumasti kimsa yatichawi ist''añamawa, jan armasaw."

Nayrïr yatichawix kasäna: "Rit''inakax janiw sapakiw uma ukakiti, akanakax taqpach jakañan umapawa. Siw janiw rit''inakax utjkaspax, jawiranakas sayt''ani, jaqinakasas jiwxapxani."

Payïr yatichawix kasäna: "Qullunakax janiw sapakiw saykatanakakiti. Akanakax taqpach pachamp mayacht''atawa. Qullunakax alajpachampi, pampanampi, manqha pachampi parlt''asipxiwa."

Kimsa ñir yatichawix kasäna: "Jaqinakax qullunakaru respetañapaw munxi. Jan respetasipxix, qullunakax piñxasipxaspawa, chirimp, tormenta tempastadamp, rit''i mikhipxamp kutt''asipxaspawa."

Illapa taqpach yatichañanak sonqopar apsusaw sasaw: "Tata, nayax taqpach ist''apxthwa. Nayax nayan jaqinakar yatichañawa."

Jach''a Rit''ix kusisitaw sasaw: "Kunjamatï, wawa. Jumasti jichhax rit''i qullunakan yatirip kanktawa. Jumasti sapa maranakaw kaypan kutt''asaw, nayar yatirinakar willt''añamataki."

Illapa ayllumar kutxatayi. Jupax taqpach yatxatatanak yatichxäna. Jaqinakax qalltapxi qullunakaru respetaña, yupaychaña, jan millt''aña.

Sapa maranakax, Illapa qulluruxa kutxatayna, Jach''a Rit''imp parlt''asax. Jupax yatiriw tukt''ayi, qullunakan, rit''inakan, pachanan tuqit.

Ukankamasti, jaqinakax yatxatapxi kunatix rit''i qullunakax wali jakawinak apaniri kasqasa. Respeto ukat yupaychañampx qullunakax taqpachanakaru qullxiri, umampi, munañampisa.

Illapa yatichxäna kunatix janiw qullunakax sapaki pachanak kasqanakiti, akanakax nanakan familias Pachamamans kasqasa. Ukat qullunakaru suma uñjañax taqpach jakawinak valorañawa.', 'En las cimas de grandes cerros, donde nieves cada año crecen, vivía un gran mallku. Él era llamado Jach''a Rit''i (Gran Nieve). Él era el guardián de todos los cerros nevados.

Un niño, llamado Illapa, era muy estudioso. Él cada vez a los cerros miraba, aprendía sobre hierbas, curaciones, sobre todas las cosas.

Un día, Illapa al cerro caminando, era muy frío. Él perdiéndose se iba. Esa noche, él un gran cueva encontró. Ahí un gran cóndor vivía.

El cóndor a Illapa decía: "Niño, ¿por qué tú estás aquí? Entonces así no debes perderte."

Illapa con frío decía: "Yo quiero aprender de los cerros, pero me he perdido."

El cóndor decía: "Yo puedo llevarte a Jach''a Rit''i. Él es el mallku de los cerros. Él puede enseñarte."

Illapa detrás del cóndor yendo, cambiando a cielos de cerros yendo, llegaron a una gran cumbre nevada, ahí un gran abuelo vivía, con nieve vestido, con barba blanca.

Jach''a Rit''i a Illapa viendo decía: "Niño, ¿por qué has venido aquí? Aquí no es para personas."

Illapa humillándose decía: "Padre, yo quiero aprender sobre los cerros. Yo quiero enseñar a mi comunidad que los cerros son muy valiosos."

El abuelo admirado del corazón de Illapa vio. Decía: "Entonces así, niño. Yo te enseñaré. Pero tú debes escuchar tres enseñanzas, sin olvidar."

La primera enseñanza era: "Las nieves no son solo agua aquí, estas son de toda la vida el agua. Si no hubiera nieves, los ríos pararían, las personas también morirían."

La segunda enseñanza era: "Los cerros no están solos parados. Estos con todo el mundo están unidos. Los cerros con el cielo, con la pampa, con el mundo de abajo hablan."

La tercera enseñanza era: "Las personas a los cerros deben querer respetar. Si no respetan, los cerros se enojarán, con frío, con tormenta, con granizo regresarán."

Illapa todas las enseñanzas a su corazón llevando decía: "Padre, yo todo he escuchado. Yo enseñaré a mi gente."

Jach''a Rit''i alegre decía: "Entonces así, niño. Tú ahora eres sabio de cerros nevados. Tú cada año aquí debes regresar, para contarme a los sabios."

Illapa a la comunidad regresó. Él todas las cosas aprendidas enseñaba. Las personas comenzaron a los cerros respetar, agradecer, no odiar.

Cada año, Illapa al cerro regresaba, con Jach''a Rit''i hablando. Él se volvió sabio, de los cerros, de las nieves, del mundo.

Desde entonces, las personas aprendieron que los cerros nevados son muy trayentes de vida. Con respeto y agradecimiento los cerros a todos curan, con agua, con amor también.

Illapa enseñaba que los cerros no son solos mundos, estos son nuestras familias de la Pachamama. Y que a los cerros bien ver es todas las vidas valorar.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Esta leyenda enseña sobre la ecología sagrada y la dependencia humana de los ecosistemas de montaña. Jach''a Rit''i representa los Apus protectores de las alturas. Illapa simboliza la curiosidad respetuosa y el deseo de aprender. La moraleja es que los glaciares y nevados son fuentes de vida, no solo paisajes. También enseña que el conocimiento conlleva responsabilidad de transmitir y proteger. Los cerros nevados en la cosmovisión andina son seres vivos que requieren reciprocidad y respeto.', NULL, NULL, 'intermedio', NULL),
(106, 'cuento', 'aymara', 'Pacha Maman Anatan', 'Nayra timpunakan, jaqinakax Pacha Mamamar yupaychasax wali jach''a anatanak lurxapxäna. Ukampisti maranakampixa, jaqinakax qalltapxi armañ anatanaka, ukax Pacha Mamax wali llakisitäna.

Mä uru, Pacha Mamax amuyt''asisaw sasaw: "Nayax jaqinakarux mä yatichawi qukañawa. Nayax mä tormenta apayañawa, ukhamatwa yatxatañapa kunatix nayax wali valorañaksa."

Jach''a tempestad purintayxi. Jalluxa janiw sayt''iti, wayraxa wali ch''amaw purxäna, qullunakax llipipxäna. Jaqinakax wali ajjasaw utanakapan qhipxapxäna.

Mä jisk''a warmi, Phaxsi sutini, wali muxsa sonqonïna. Jupax Pacha Mamar qawasax sasaw: "Pachamama, ¿kunatsa piñasitati? ¿Kuna lurañ atthta?"

Uka tutax, Phaxsix muspharpxäna. Pacha Mamax mä jach''a warmi uñstayasax, sumach''ukina, taqpach uywanakamaraki qullanakampi chikatatwa.

"Phaxsi, nayax piñasthwa kunatix jaqinakax nayar armapxi. Jupanakax janiw nayan t''ant''an mikhkaspax, nayan uman umkaspax yatxapkiti. Jupanakax anatanaka janiw lurapkiti, nayax chinkapuniñapatakjamaw amuyapxi."

Phaxsi llakisitaw sasaw: "Pachamama, janiw taqpachanakax armkaspakiti. Nayax yatxatthwa jumasti wali valorañaksa. ¿Kuna lurañaxa?"

Pacha Mamax sasaw: "Jumasti taqpach jaqinakar tantachasaw, mä jach''a anata lurasaw. Taqpachanakax nayar yupaychapxañapa. Siw ukham lurxañax, nayax toment''a sayt''ayañawa ukat suma pachanak kutt''ayañawa."

Phaxsi q''esasax ayllupar kutt''i. Jupax taqpach jaqinakar tantachxatayi: awkinaka, taykanak, wawanaka, achachilanaka, taqpachanaka.

"Jaqinaka, Pacha Mamax piñasitawa. Nanakax armapxitanwa. Kunjamatï, nanakax mä jach''a anata lurañaniwa."

Jaqinakax qalltapxi wakicht''asiñ anatanakat. Saminaka apxapxi: wila, q''illu, ch''uxña, anqas. T''ikanaka, khuka, vinu, manq''anaka, taqpacha.

Sapa jaqix mä lurawi pacht''ayi. Awkinakax misa wakicht''apxi Pacha Mamataki. Warminakax sawunaka, aguayonaka lurxapxi. Wawanakax takxapxi, tusiñ yatxapxi.

Anata urux puriri. Taqpachanakax qulluruxa sarxapxi, t''ikanakamp, kintumarakimp. Jupanakax qallxatapxi mesa allichaña Pacha Mamataki.

Mesanx: t''ikanaka, khuka kintu, vinu, manq''a, dulce, taqpacha ch''allanaka. Phaxsix nayrirïrinxa sayt''asax sasaw:

"Pachamama, Mamita, nanakax kaykan jutapxitanwa jumaru yupaychañataki. Nanakax yatxatapxitanwa kunatix jumasti taqpach jakawinak quriri kasatasa. Jumasti nanakan Taykasawa."

Taqpach jaqinakax takxatapxi, tusxapxi, ch''allxapxi. Achachilax misa lurapxi, Pacha Mamar yupaychañataki. Wawanakax t''ikanakamp ch''iwchilaw mistuyxapxi.

Ukax mä jach''a anataw kamachariri. Jallux sayt''xi, wayraxa q''uñtayiri, intix qalltix k''achantaña. Qullunakax sumach''ukiw aljayañ qallxiri.

Pachamama jikxatäna. Janiw uñjañ atxätaynati, ukampisti taqpachanakax chuymanakampx uñjañ atxapxi. Mä jach''a chuymaw qullunakapat mistuña, wali sumawa, wali llamp''uwa.

"Jaqinaka, nanakax wali sumawa rurtanwa. Nanakax nayar jan armapxkaspawa. Kunjamatï, nayax nayrapach bendicionanaka qutanwa."

Ukhat pachax tikrayi. Challunakax sum wiñapxi, qullunakax sumach''ukïriw tikarapxi, qutanakax ch''uxña umaw junt''atapxi. Pachamama taqpacharu bendicioniw churiri.

Ukankamasti, jaqinakax sapa wata anatanakaw lurxapxi Pacha Mamataki. Janiw armañakiti, aswanxa yupaychañawa, sapa uru agradecesañawa.

Phaxsix mä yatiri tukt''ayi. Jupax yatichxäna kunatix Pacha Mamax janiw jach''a anatakatak maskaskiti, aswanx sonqon munasiñanak, respetañanak maskaskiwa.

"Pacha Mamax nanakan Taykanwa. Jupax sapa uru nanakaru manq''a qusi, uma qusi, jakañatakis qusi. Ukat nanakax sapa kutix yupaychañapawa, janiw qhispiyasa, janiw anatanakatasa, sonqomanta yupaychañawa."

Jaqinakax kay yatichawi sonqonakapar apxapxi. Ukhamatwa, sapa uru, taqpachanakax Pacha Mamar yupaychapxi: p''unchay qalltiñana, inti jalanti, manq''aña nayraqata, taqpachan tyimpunak.

Ukat Pacha Mamax taqpachanakarux bendición sañani: suma sata, suma challwa, suma jakaña, suma chuymani. Jaqinakax yatxatapxi kunatix suma jakañax yupaychañamp, respetañamp jikxataraki sasaw.', 'Las personas comenzaron a prepararse para las fiestas. Colores llevaron: rojo, amarillo, verde, azul. Flores, coca, vino, comidas, todo.

Cada persona un trabajo vistió. Los padres mesa prepararon para la Pachamama. Las mujeres tejidos, aguayos hicieron. Los niños cantaron, bailar aprendieron.

El día de fiesta llegó. Todos al cerro fueron, con flores, con coca también. Ellos comenzaron a arreglar mesa para la Pachamama.

En la mesa: flores, coca kintu, vino, comida, dulce, todas ofrendas. Phaxsi en primer lugar parada decía:

"Pachamama, Madrecita, nosotros aquí hemos venido para agradecerte. Nosotros hemos aprendido que tú eres dadora de todas las vidas. Tú eres nuestra Madre."

Todas las personas cantaron, bailaron, ofrendaron. Los abuelos misa hicieron, para agradecer a la Pacha Mama. Los niños con flores pájaros hicieron volar.

Eso fue una gran fiesta que se organizó. La lluvia paró, el viento se enfrió, el sol comenzó a brillar. Los cerros hermosamente comenzaron a aparecer.

Pachamama llegó. No se podía ver, pero todos con sus corazones podían ver. Un gran corazón de los cerros salió, muy hermoso, muy suave.

"Personas, ustedes muy bien han hecho. Ustedes no me han olvidado. Entonces así, yo hacia adelante bendiciones doy."

Entonces el mundo cambió. Los cultivos bien crecieron, los cerros hermosamente florecieron, los lagos con agua verde se llenaron. Pachamama a todos bendición dio.

Desde entonces, las personas cada año fiestas hacen para la Pachamama. Sin olvidar, más bien agradeciendo, cada día agradeciéndose.

Phaxsi una sabia se volvió. Ella enseñaba que la Pachamama no estaba buscando grandes fiestas, más bien del corazón amores, respetos estaba buscando.

"La Pachamama es nuestra Madre. Ella cada día a nosotros comida da, agua da, para vivir también da. Y nosotros cada vez debemos agradecer, no libremente, no con fiestas solamente, de corazón agradecer."

Las personas esta enseñanza a sus corazones llevaron. Entonces así, cada día, todos a la Pacha Mama agradecen: en la mañana empezando, sol bajando, antes de comer, en todos los tiempos.

Y la Pachamama a todos bendición sigue dando: buena siembra, buen pescado, buena vida, buen corazón. Las personas aprendieron que la buena vida con agradecimiento, con respeto llega también diciendo.', NULL, '🏔️', '2025-11-29T04:35:37.957Z', '2025-11-29T04:35:37.957Z', 'Esta leyenda final enseña sobre la gratitud y la reciprocidad sagrada en la cosmovisión andina. La Pachamama no busca grandes rituales vacíos, sino amor y respeto genuino del corazón. Phaxsi representa la devoción humilde que restaura el equilibrio. La moraleja es que la verdadera espiritualidad está en el agradecimiento diario, no solo en ceremonias ocasionales. También enseña que cuando respetamos y cuidamos la naturaleza, ella responde con abundancia. El cuento cierra el ciclo mostrando que la relación entre humanos y tierra debe ser de amor mutuo constante.', NULL, NULL, 'intermedio', NULL)
ON CONFLICT DO NOTHING;
SELECT setval(pg_get_serial_sequence('contenido_cultural', 'id'), COALESCE((SELECT MAX(id) FROM contenido_cultural), 1));

COMMIT;
