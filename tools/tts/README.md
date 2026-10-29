# Audio con modelos MMS

Genera la pronunciación de cada palabra del diccionario con modelos de síntesis de voz **entrenados en la lengua** (Meta MMS), en lugar del sintetizador de español del navegador, que no distingue las consonantes glotalizadas ni aspiradas.

| Lengua | Modelo | Variedad |
| --- | --- | --- |
| Quechua | `facebook/mms-tts-quz` | Cusco-Collao (el grupo dialectal de Puno) |
| Aymara | `facebook/mms-tts-ayr` | Aymara central |

El audio se genera **una sola vez** por palabra y se guarda en Cloudinary (columna `vocabulario.audio_url`): costo recurrente cero, sin espera para quien aprende y disponible sin conexión gracias a la PWA.

**Licencia del audio:** CC BY-NC 4.0, la de los modelos MMS (el código de SimiAru es MIT).

## Instalación

```bash
cd tools/tts
py -3.12 -m venv .venv                     # Windows (en Linux/Mac: python3.12 -m venv .venv)
.venv/Scripts/pip install torch --index-url https://download.pytorch.org/whl/cpu
.venv/Scripts/pip install -r requirements.txt
```

## 1. Lote de prueba (escuchar antes de publicar)

```bash
.venv/Scripts/python generate_audio.py --idioma quechua --muestra 30
```

Escribe 30 palabras al azar (semilla fija, reproducible) en `tools/tts/salida/<idioma>-<fecha>/`, con un `manifiesto.csv`. **No sube nada ni toca la base.** Escúchalas y anota en el manifiesto cuáles suenan mal y por qué fenómeno (glotalizada, aspirada, uvular…): ese desglose va en la sección de validación del artículo.

## 2. Generación completa

Solo después de revisar el lote de prueba:

```bash
.venv/Scripts/python generate_audio.py --idioma quechua --todo --subir --confirmar
```

Genera las palabras que aún no tienen audio, las sube a Cloudinary (`simiaru/audio/<idioma>/<id>.mp3`) y guarda la URL en la base. `--confirmar` es obligatorio porque modifica la base de producción. Necesita `DATABASE_URL` y las claves de Cloudinary (se leen de `backend/.env`).

## Una lengua nueva

```bash
.venv/Scripts/python generate_audio.py --idioma <id> --modelo facebook/mms-tts-<iso639-3> --muestra 30
```

Revisa antes en Hugging Face que el modelo exista para ese código ISO 639-3.
