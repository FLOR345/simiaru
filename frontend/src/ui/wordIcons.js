// Ícono de cada palabra del diccionario según su significado en castellano (solo íconos, nada de emojis).
// Mezcla varias familias de react-icons (Game Icons, Phosphor, Tabler) y Lucide para tener más variedad:
// animales, comida, cuerpo, ropa, naturaleza, música, números... Si no hay uno exacto, se usa el de su categoría.
import {
  GiCondorEmblem, GiFox, GiFrog, GiSnake, GiSpiderWeb, GiOwl, GiHorseHead, GiGoat, GiSheep, GiCow, GiPig, GiRabbit, GiMouse,
  GiSittingDog, GiChicken, GiRooster, GiDuck, GiTropicalFish, GiButterfly, GiFly, GiHummingbird, GiDeer, GiBearHead, GiLion,
  GiEarthWorm, GiSnail, GiCorn, GiPotato, GiChiliPepper, GiGarlic, GiBread, GiBubblingBowl, GiWaterSplash, GiWheat, GiSteak,
  GiFriedEggs, GiCheeseWedge, GiMilkCarton, GiShinyApple, GiBanana, GiCarrot, GiCoffeeMug, GiSaltShaker, GiSugarCane, GiSmallFire,
  GiCookingPot, GiKnifeFork, GiMountains, GiVolcano, GiRiver, GiPineTree, GiCactus, GiFlowers, GiOakLeaf, GiSun, GiSunrise,
  GiSunset, GiMoon, GiStarSwirl, GiFluffyCloud, GiRaining, GiSnowflake1, GiWindsock, GiStoneWall, GiHighGrass, GiEarthAmerica,
  GiWoodenDoor, GiStonePath, GiStoneBridge, GiHutsVillage, GiField, GiSickle, GiShakingHands, GiNoseFront, GiLips, GiTooth,
  GiFootprint, GiBrain, GiBoneKnife, GiBeard, GiShirt, GiWinterHat, GiDress, GiSandal, GiPrimitiveNecklace, GiShoulderBag,
  GiYarn, GiSewingNeedle, GiSpinningWheel, GiDrum, GiPanFlute, GiGuitar, GiMusicalNotes, GiTribalMask, GiPrayer, GiPartyFlags,
  GiBabyFace, GiFamilyHouse, GiFemale, GiVitruvianMan, GiHourglass, GiCalendar, GiNightSky, GiAbacus, GiOpenBook, GiTalk,
  GiWalk, GiNightSleep, GiCook, GiDrinking, GiTwoCoins, GiCompass, GiHelp, GiPlantsAndAnimals, GiEagleHead, GiFeather,
  GiCamelHead, GiHeartBeats, GiEyeball, GiEarrings, GiArm, GiLeg, GiHand, GiPeriscope, GiCrown, GiRainbowStar,
} from 'react-icons/gi';
import { PiHandWaving, PiHandshake, PiQuestion, PiChatsCircle, PiNumberCircleOne, PiPalette, PiUsersThree, PiHouseLine, PiSmiley, PiArrowsOutCardinal, PiCompassRose, PiTShirt, PiHandHeart } from 'react-icons/pi';
import { TbArrowBigUp, TbArrowBigDown, TbArrowBigLeft, TbArrowBigRight, TbTargetArrow, TbClockHour4, TbHeartHandshake, TbPlant2 } from 'react-icons/tb';
import { BookOpen, Sparkles, Mountain, Drama } from 'lucide-react';

// Si alguno no existe en la versión instalada, se cae al ícono de la categoría
const ok = (Icon) => (typeof Icon === 'function' || typeof Icon === 'object' ? Icon : null);

// [expresión sobre el significado en castellano, ícono]; gana la primera que coincide
const RULES = [
  [/\b(llama|alpaca|vicuña|guanaco|camélido|auquénido|paqocha|qawra)/, GiCamelHead],
  [/\b(cóndor|condor)/, GiCondorEmblem],
  [/\b(águila|aguila|halcón|halcon|gavilán|buitre|ave de rapiña|carroñera|caracara|cernícalo)/, GiEagleHead],
  [/\b(colibrí|colibri|picaflor)/, GiHummingbird],
  [/\b(búho|buho|lechuza)/, GiOwl],
  [/\b(zorro)/, GiFox],
  [/\b(sapo|rana|renacuajo)/, GiFrog],
  [/\b(serpiente|víbora|culebra)/, GiSnake],
  [/\b(araña)/, GiSpiderWeb],
  [/\b(caballo|yegua|potro|burro|asno|mula)/, GiHorseHead],
  [/\b(cabra|chivo)/, GiGoat],
  [/\b(oveja|carnero|cordero)/, GiSheep],
  [/\b(vaca|toro|buey|ternero)/, GiCow],
  [/\b(cerdo|chancho|puerco)/, GiPig],
  [/\b(conejo|liebre|vizcacha|chinchilla)/, GiRabbit],
  [/\b(ratón|raton|rata|cuy|cobayo)/, GiMouse],
  [/\b(perro|can\b)/, GiSittingDog],
  [/\b(gallo)/, GiRooster],
  [/\b(gallina|pollo|pollito)/, GiChicken],
  [/\b(pato|ganso|parihuana|flamenco)/, GiDuck],
  [/\b(pez|pescado|trucha|ispi|carachi|challwa)/, GiTropicalFish],
  [/\b(mariposa|polilla|oruga)/, GiButterfly],
  [/\b(mosca|mosquito|abeja|abejorro|avispa|insecto|hormiga|piojo|pulga)/, GiFly],
  [/\b(venado|ciervo|taruka)/, GiDeer],
  [/\b(oso)\b/, GiBearHead],
  [/\b(puma|gato montés|león|leon|gato)/, GiLion],
  [/\b(gusano|lombriz)/, GiEarthWorm],
  [/\b(caracol)/, GiSnail],
  [/\b(pluma|ala\b|plumaje)/, GiFeather],
  [/\b(ave|pájaro|pajaro|perdiz|codorniz|paloma|loro|gorrión|avestruz|suri|ñandú)/, GiEagleHead],
  [/\b(maíz|maiz|choclo|mote|mazorca|cancha)/, GiCorn],
  [/\b(papa|chuño|tunta|oca|olluco|ulluku|tubérculo|camote|yuca)/, GiPotato],
  [/\b(ají|aji|rocoto|pimiento|uchu)/, GiChiliPepper],
  [/\b(ajo|cebolla)/, GiGarlic],
  [/\b(pan|tanta|harina|galleta)/, GiBread],
  [/\b(sopa|caldo|mazamorra|lawa|chairo|guiso)/, GiBubblingBowl],
  [/\b(agua|lluvia de|bebida)\b/, GiWaterSplash],
  [/\b(quinua|quínoa|quinoa|cañihua|trigo|cebada|grano|semilla|kiwicha)/, GiWheat],
  [/\b(carne|charqui|asado|cecina)/, GiSteak],
  [/\b(huevo)/, GiFriedEggs],
  [/\b(queso)/, GiCheeseWedge],
  [/\b(leche)/, GiMilkCarton],
  [/\b(fruta|fruto|manzana|durazno|tuna|pacay|lúcuma|chirimoya)/, GiShinyApple],
  [/\b(plátano|platano|banana)/, GiBanana],
  [/\b(zanahoria|verdura|hortaliza|calabaza|zapallo)/, GiCarrot],
  [/\b(café|cafe|té\b|mate|chicha|tomar|beber)/, GiCoffeeMug],
  [/\b(sal)\b/, GiSaltShaker],
  [/\b(azúcar|azucar|dulce|miel|caña)/, GiSugarCane],
  [/\b(fuego|leña|fogón|fogon|quemar|ceniza)/, GiSmallFire],
  [/\b(olla|cocinar|cocina|fogón)/, GiCookingPot],
  [/\b(comida|alimento|comer|almuerzo|cena|desayuno|merienda)/, GiKnifeFork],
  [/\b(volcán|volcan)/, GiVolcano],
  [/\b(cerro|montaña|montana|cordillera|nevado|apu|cumbre|pico)/, GiMountains],
  [/\b(río|rio|lago|laguna|mar\b|ola|manantial|vertiente|bofedal|charco)/, GiRiver],
  [/\b(árbol|arbol|bosque|tronco|queñua|eucalipto|arbusto|t'ula)/, GiPineTree],
  [/\b(cactus|cacto|espina)/, GiCactus],
  [/\b(flor|flores|pétalo)/, GiFlowers],
  [/\b(hoja|planta|hierba|yerba|coca)/, GiOakLeaf],
  [/\b(amanecer|aurora|madrugada)/, GiSunrise],
  [/\b(atardecer|anochecer|puesta del sol|ocaso|oeste)/, GiSunset],
  [/\b(sol|soleado|calor)\b/, GiSun],
  [/\b(luna|mes\b)/, GiMoon],
  [/\b(estrella|lucero|constelación|vía láctea)/, GiStarSwirl],
  [/\b(arcoíris|arcoiris|arco iris)/, GiRainbowStar],
  [/\b(nube|neblina|niebla)/, GiFluffyCloud],
  [/\b(lluvia|llover|llovizna|granizo|trueno|rayo|relámpago)/, GiRaining],
  [/\b(nieve|helada|hielo|frío|frio|escarcha)/, GiSnowflake1],
  [/\b(viento|aire|ventarrón|soplar)/, GiWindsock],
  [/\b(piedra|roca|pedregoso|muro)/, GiStoneWall],
  [/\b(pasto|paja|ichu|césped|pradera|pampa)/, GiHighGrass],
  [/\b(tierra|mundo|pachamama|universo|suelo|barro|greda)/, GiEarthAmerica],
  [/\b(puerta|entrada|salida)/, GiWoodenDoor],
  [/\b(camino|ruta|sendero|viaje)/, GiStonePath],
  [/\b(puente)/, GiStoneBridge],
  [/\b(pueblo|comunidad|ayllu|ciudad|aldea|marka|llaqta)/, GiHutsVillage],
  [/\b(chacra|campo|terreno|parcela|cosecha|sembrar|siembra|cultivar|arar|regadío|canal)/, GiField],
  [/\b(hoz|herramienta|chaquitaclla|pala|azadón)/, GiSickle],
  [/\b(casa|hogar|vivienda|choza|cuarto|habitación|techo|pared)/, PiHouseLine],
  [/\b(nariz)/, GiNoseFront],
  [/\b(boca|labio)/, GiLips],
  [/\b(diente|muela)/, GiTooth],
  [/\b(pie|pies|talón|tobillo)\b/, GiFootprint],
  [/\b(cabeza|cerebro|mente|pensar|pensamiento)/, GiBrain],
  [/\b(hueso|costilla|esqueleto)/, GiBoneKnife],
  [/\b(pelo|cabello|barba|bigote|ceja|pestaña)/, GiBeard],
  [/\b(ojo|ojos|mirar|ver)\b/, GiEyeball],
  [/\b(oreja|oído|oir|oír|escuchar)/, GiEarrings],
  [/\b(corazón|corazon|pecho)/, GiHeartBeats],
  [/\b(brazo|codo|hombro|músculo)/, GiArm],
  [/\b(pierna|rodilla|muslo|cadera)/, GiLeg],
  [/\b(mano|dedo|uña|palma)/, GiHand],
  [/\b(cuello|garganta|espalda|cuerpo|cara|rostro|ombligo|barriga|estómago)/, GiVitruvianMan],
  [/\b(camisa|polo|chompa|chaqueta|saco|blusa|ropa|vestido de|vestimenta)/, GiShirt],
  [/\b(sombrero|chullo|gorro|montera)/, GiWinterHat],
  [/\b(falda|pollera|vestido|faja|aguayo|manta|lliclla|awayu)/, GiDress],
  [/\b(sandalia|ojota|zapato|calzado|abarca)/, GiSandal],
  [/\b(collar|arete|adorno|tupu|prendedor)/, GiPrimitiveNecklace],
  [/\b(bolsa|bolso|chuspa|costal|wayaqa)/, GiShoulderBag],
  [/\b(lana|hilo|ovillo|hilar|cordón|cuerda)/, GiYarn],
  [/\b(coser|aguja|costurera|bordar)/, GiSewingNeedle],
  [/\b(tejer|tejido|telar|tejedor|tejedora|rueca|huso)/, GiSpinningWheel],
  [/\b(tambor|bombo|wankara|wanqara)/, GiDrum],
  [/\b(zampoña|siku|flauta|quena|pinkillo|pinkillu|sikura|lakita|tarka)/, GiPanFlute],
  [/\b(charango|guitarra|instrumento)/, GiGuitar],
  [/\b(canción|cancion|canto|cantar|música|musica|melodía|baile|bailar|danza|danzar)/, GiMusicalNotes],
  [/\b(máscara|mascara|disfraz)/, GiTribalMask],
  [/\b(ritual|ofrenda|ceremonia|rezar|orar|sagrado|ch'alla|challa|despacho|espíritu|alma|dios)/, GiPrayer],
  [/\b(fiesta|carnaval|celebración|anata|bandera|wiphala)/, GiPartyFlags],
  [/\b(autoridad|jefe|rey|reina|inca|inka|mallku|kuraka|curaca|líder)/, GiCrown],
  [/\b(bebé|bebe|guagua|recién nacido|criatura)/, GiBabyFace],
  [/\b(mujer|madre|mamá|abuela|hermana|hija|tía|esposa|niña|muchacha|señora)/, GiFemale],
  [/\b(familia|padres|parientes|hijos|nietos)/, GiFamilyHouse],
  [/\b(amigo|compañero|vecino|juntos|unidos|ayni|minka|reciprocidad)/, TbHeartHandshake],
  [/\b(hombre|padre|papá|abuelo|hermano|hijo|tío|esposo|niño|muchacho|señor|joven|anciano|persona|gente|nosotros|ellos|yo|tú)\b/, PiUsersThree],
  [/\b(hora|tiempo|reloj|momento|rato|tarde|temprano)\b/, TbClockHour4],
  [/\b(día|dia|semana|año|ano|ayer|mañana|hoy|fecha|antes|después|siempre|época|antiguo)\b/, GiCalendar],
  [/\b(noche|oscuridad|medianoche)/, GiNightSky],
  [/\b(contar|número|numero|cantidad|medida|cuenta)/, GiAbacus],
  [/\b(libro|leer|escribir|palabra|letra|idioma|lenguaje|aprender|estudiar|enseñar|escuela)/, GiOpenBook],
  [/\b(hablar|decir|conversar|dialogar|contar un|preguntar|responder|gritar)/, GiTalk],
  [/\b(caminar|andar|correr|ir\b|venir|llegar|salir|entrar|subir|bajar|viajar)/, GiWalk],
  [/\b(dormir|descansar|soñar|sueño)/, GiNightSleep],
  [/\b(dinero|plata|moneda|pagar|comprar|vender|trueque|precio)/, GiTwoCoins],
  [/\b(norte|sur|este|oriental|dirección)/, PiCompassRose],
  [/\b(arriba|encima|alto)\b/, TbArrowBigUp],
  [/\b(abajo|debajo|bajo)\b/, TbArrowBigDown],
  [/\b(izquierda)/, TbArrowBigLeft],
  [/\b(derecha)/, TbArrowBigRight],
  [/\b(centro|medio|mitad)/, TbTargetArrow],
  [/\b(cerca|lejos|dónde|donde|lugar|aquí|allí)/, GiCompass],
  [/\b(hola|saludo|saludar|buenos|buenas|bienvenid|adiós|adios|hasta|chau|despedida|despedir)/, PiHandWaving],
  [/\b(gracias|por favor|de nada|perdón|disculpa|mucho gusto)/, PiHandHeart],
  [/\b(sí|si|no|así|bien|bueno|está bien|de acuerdo|aceptar)\b/, PiHandshake],
  [/[¿?]|\b(qué|quién|cuál|cuándo|cuánto|cómo|por qué)/, PiQuestion],
  [/\b(alegre|feliz|alegría|reír|reir|sonrisa|contento)/, PiSmiley],
];

const CATEGORY = {
  animales: GiPlantsAndAnimals, comida: GiKnifeFork, alimentos: GiKnifeFork, numeros: GiAbacus, familia: GiFamilyHouse, colores: PiPalette,
  color: PiPalette, presentaciones: PiChatsCircle, presentacion: PiChatsCircle, saludos: PiHandWaving, saludo: PiHandWaving,
  despedidas: PiHandWaving, despedida: PiHandWaving, cortesia: PiHandHeart, pregunta: PiQuestion, respuesta: PiChatsCircle,
  verbos: GiWalk, naturaleza: Mountain, cultura: Drama, caracteristicas: Sparkles, cuerpo: GiVitruvianMan, ropa: PiTShirt,
  hogar: PiHouseLine, tiempo: GiHourglass, ubicacion: PiArrowsOutCardinal, musica: GiMusicalNotes,
};

// Sin tildes ni eñes, para que  funcione con "árbol", "águila", "niño"...
const plain = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const norm = plain;
const PLAIN_RULES = RULES.map(([re, Icon]) => [new RegExp(plain(re.source), re.flags), Icon]);

export const wordIcon = (word) => {
  const text = norm(word?.palabra_espanol);
  const cat = norm(word?.categoria);
  // Los colores se muestran con su paleta; los números con el ábaco (antes que cualquier otra coincidencia)
  if (cat === 'colores' || cat === 'color') return PiPalette;
  for (const [re, Icon] of PLAIN_RULES) if (re.test(text) && ok(Icon)) return Icon;
  return ok(CATEGORY[cat]) || (cat === 'numeros' ? PiNumberCircleOne : BookOpen);
};

// Ícono de una categoría (para los botones de categorías)
export const categoryIcon = (cat) => ok(CATEGORY[plain(cat)]) || null;

// Color real de las palabras de colores (para pintar la ficha con ese color)
const SWATCH = [
  [/blanquisimo|blanco puro/, '#f8fafc'], [/blanco/, '#f1f5f9'], [/negro|oscuro/, '#1c1917'], [/rojo|granate/, '#dc2626'],
  [/rosado claro|rosa claro/, '#fbcfe8'], [/rosad|rosa/, '#ec4899'], [/anaranjad|naranja/, '#f97316'], [/amarill|dorado/, '#eab308'],
  [/verde|bosque/, '#16a34a'], [/celeste|cielo/, '#38bdf8'], [/azul/, '#2563eb'], [/morad|violeta|lila|purpura/, '#7c3aed'],
  [/marron|cafe|pardo|chocolate/, '#92400e'], [/gris|ceniciento|plomo/, '#78716c'], [/turquesa/, '#14b8a6'], [/plateado|plata/, '#cbd5e1'],
];
export const colorOf = (word) => {
  const cat = plain(word?.categoria);
  if (cat !== 'colores' && cat !== 'color') return null;
  const t = plain(word?.palabra_espanol);
  const hit = SWATCH.find(([re]) => re.test(t));
  return hit ? hit[1] : null;
};

export default wordIcon;
