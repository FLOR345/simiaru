# Cómo agregar una lengua a SimiAru

SimiAru se extiende a otras lenguas originarias (asháninka, shipibo, awajún, guaraní…) con **una carpeta de dos archivos** y **un comando**. No hace falta cambiar el código.

## 1. Copia la plantilla

```bash
cp -r languages/plantilla languages/<id>
```

`<id>` es el identificador de la lengua: minúsculas, sin tildes ni espacios (por ejemplo `ashaninka`).

## 2. Completa `paquete.json`

| Campo | Para qué sirve |
| --- | --- |
| `id` | Identificador; debe coincidir con el nombre de la carpeta |
| `nombre`, `nombreNativo` | Cómo se muestra la lengua (en castellano y en la propia lengua) |
| `iso639_3` | Código ISO 639-3 (por ejemplo `cni` para asháninka) |
| `variedad`, `region` | Variedad dialectal que se enseña y dónde se habla |
| `color` | `verde`, `azul`, `terracota` o `morado` |
| `voz.modelo` | Modelo MMS de Meta para la voz (`facebook/mms-tts-<iso>`), si existe |
| `teclado` | Letras que no están en todos los teclados (apóstrofo de las glotalizadas, ñ, vocales largas); aparecen como botones al escribir |
| `frases` | Saludo, felicitación y ánimo que aparecen en las lecciones |
| `normalizador.reglas` | Reglas de variación de escritura aceptadas como “correcto con variante” |

Cada regla del normalizador es una expresión regular con su reemplazo y el fenómeno que representa (`glotalizada`, `aspirada`, `vocal`, `uvular`, `grafia`). Se aplican en orden a la respuesta y a la forma esperada; si coinciden después de aplicarlas, la respuesta es una variante válida. Ver los paquetes de `frontend/src/languages/quechua.json` y `aymara.json` como ejemplo.

> Las reglas deben salir del conocimiento de la variedad, revisadas por hablantes. No las generes con un modelo de lenguaje.

## 3. Completa `contenido.json`

- `fuente`: de dónde sale el contenido y su **licencia** (debe permitir redistribuirlo) y quién lo revisó.
- `unidades` → `lecciones` → `vocabulario` y `ejercicios`.
- Tipos de ejercicio: `multiple_choice`, `translate`, `listen_write`, `true_false`, `fill_blanks`, `matching`, `word_order`.

## 4. Valida e importa

```bash
cd backend
npm run import-language -- ../languages/<id> --dry-run   # solo valida
npm run import-language -- ../languages/<id>             # carga la base y registra la lengua en el frontend
```

El importador rechaza el paquete si quedan textos `COMPLETAR`, si falta la licencia de la fuente o si un ejercicio tiene un tipo que no existe. Todo se carga en una sola transacción: si algo falla, no se guarda nada.

## 5. (Opcional) Genera el audio

```bash
python tools/tts/generate_audio.py --idioma <id> --modelo facebook/mms-tts-<iso>
```

Ver `tools/tts/README.md`.

---

## Adding a language (English summary)

1. Copy `languages/plantilla` to `languages/<id>`.
2. Fill in `paquete.json` (metadata, MMS voice model, normalizer rules) and `contenido.json` (source + license, units, lessons, vocabulary, exercises).
3. Run `npm run import-language -- ../languages/<id> --dry-run`, then without `--dry-run`. The importer validates the pack, loads it into PostgreSQL in a single transaction, and registers the language in the frontend (`frontend/src/languages/<id>.json`). No application code changes are needed.
