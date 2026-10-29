"""
Generación de audio de SimiAru con modelos MMS de Meta (síntesis de voz neuronal entrenada en la lengua).

  quechua → facebook/mms-tts-quz  (Cusco-Collao, el mismo grupo dialectal que Puno)
  aymara  → facebook/mms-tts-ayr  (aymara central)

El audio se pregenera UNA sola vez por entrada léxica: costo recurrente cero, latencia cero,
y funciona sin conexión cuando la PWA lo guarda. Licencia del audio: CC-BY-NC-4.0 (la de los modelos).

Modos:
  Lote de prueba (por defecto): genera N palabras en una carpeta local para escucharlas.
      No sube nada ni toca la base.
        python generate_audio.py --idioma quechua --muestra 30
  Generación completa: sube a Cloudinary y llena vocabulario.audio_url. Exige --confirmar.
        python generate_audio.py --idioma quechua --todo --subir --confirmar

Siempre escribe un manifiesto CSV (palabra, archivo, modelo, duración) para reportar la cobertura.
Variables: DATABASE_URL y, para subir, CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET
(se leen de backend/.env si existe).
"""
import argparse
import csv
import datetime as dt
import os
import random
import re
import sys
from pathlib import Path

MODELS = {"quechua": "facebook/mms-tts-quz", "aymara": "facebook/mms-tts-ayr"}
ROOT = Path(__file__).resolve().parents[2]


def load_env():
    env_file = ROOT / "backend" / ".env"
    if env_file.exists():
        for line in env_file.read_text(encoding="utf-8").splitlines():
            m = re.match(r"^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$", line)
            if m and m.group(1) not in os.environ:
                os.environ[m.group(1)] = m.group(2).strip().strip('"').strip("'")


def fetch_words(idioma, only_missing):
    import psycopg

    sql = """
        SELECT v.id, v.palabra_objetivo, v.palabra_espanol, v.audio_url
        FROM vocabulario v
        JOIN lecciones l ON v.leccion_id = l.id
        JOIN unidades u ON l.unidad_id = u.id
        WHERE u.idioma = %s
    """
    if only_missing:
        sql += " AND (v.audio_url IS NULL OR v.audio_url = '')"
    sql += " ORDER BY v.id"
    with psycopg.connect(os.environ["DATABASE_URL"]) as conn, conn.cursor() as cur:
        cur.execute(sql, (idioma,))
        return [dict(zip(("id", "texto", "espanol", "audio_url"), row)) for row in cur.fetchall()]


def clean_text(text):
    """Texto para el modelo: minúsculas y apóstrofos unificados (las glotalizadas se escriben con ')."""
    text = text.lower().strip()
    text = re.sub(r"[’‘´`ʼ]", "'", text)
    text = re.sub(r"\s*\(.*?\)\s*", " ", text)  # quita aclaraciones entre paréntesis
    return re.sub(r"\s+", " ", text).strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--idioma", choices=sorted(MODELS), required=True)
    parser.add_argument("--modelo", help="Otro modelo MMS (para lenguas nuevas), por ejemplo facebook/mms-tts-cni")
    parser.add_argument("--muestra", type=int, default=30, help="Cantidad de palabras al azar para el lote de prueba")
    parser.add_argument("--todo", action="store_true", help="Todas las palabras sin audio (en vez de una muestra)")
    parser.add_argument("--semilla", type=int, default=2026, help="Semilla de la muestra (reproducible)")
    parser.add_argument("--salida", default=str(ROOT / "tools" / "tts" / "salida"))
    parser.add_argument("--subir", action="store_true", help="Subir a Cloudinary y guardar audio_url en la base")
    parser.add_argument("--confirmar", action="store_true", help="Necesario junto con --subir")
    args = parser.parse_args()

    if args.subir and not args.confirmar:
        sys.exit("--subir modifica la base de producción: agrega --confirmar si de verdad quieres hacerlo.")

    load_env()
    if "DATABASE_URL" not in os.environ:
        sys.exit("Falta DATABASE_URL (en el entorno o en backend/.env)")

    import numpy as np
    import soundfile as sf
    import torch
    from transformers import AutoTokenizer, VitsModel

    model_id = args.modelo or MODELS[args.idioma]
    print(f"Cargando {model_id}…")
    tokenizer = AutoTokenizer.from_pretrained(model_id)
    model = VitsModel.from_pretrained(model_id)
    model.eval()
    torch.manual_seed(0)  # la síntesis VITS tiene un componente aleatorio: así cada audio es reproducible

    words = fetch_words(args.idioma, only_missing=args.todo)
    if not args.todo:
        random.Random(args.semilla).shuffle(words)
        words = words[: args.muestra]
    print(f"{len(words)} palabras para generar")

    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M")
    out_dir = Path(args.salida) / f"{args.idioma}-{stamp}"
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.subir:
        import cloudinary
        import cloudinary.uploader

        cloudinary.config(
            cloud_name=os.environ["CLOUDINARY_CLOUD_NAME"],
            api_key=os.environ["CLOUDINARY_API_KEY"],
            api_secret=os.environ["CLOUDINARY_API_SECRET"],
        )

    rows = []
    for i, word in enumerate(words, 1):
        text = clean_text(word["texto"])
        inputs = tokenizer(text, return_tensors="pt")
        if inputs["input_ids"].shape[-1] == 0:
            rows.append({**word, "texto_modelo": text, "archivo": "", "segundos": 0, "estado": "sin_simbolos_validos"})
            continue
        with torch.no_grad():
            wave = model(**inputs).waveform[0].cpu().numpy()
        wave = wave / max(1e-6, float(np.max(np.abs(wave)))) * 0.95  # volumen parejo
        file = out_dir / f"{word['id']}.wav"
        sf.write(file, wave, model.config.sampling_rate)
        row = {**word, "texto_modelo": text, "archivo": file.name, "segundos": round(len(wave) / model.config.sampling_rate, 2), "estado": "generado"}

        if args.subir:
            import psycopg

            result = cloudinary.uploader.upload(
                str(file), resource_type="video", folder=f"simiaru/audio/{args.idioma}", public_id=str(word["id"]), overwrite=True, format="mp3"
            )
            with psycopg.connect(os.environ["DATABASE_URL"]) as conn, conn.cursor() as cur:
                cur.execute("UPDATE vocabulario SET audio_url = %s WHERE id = %s", (result["secure_url"], word["id"]))
            row["estado"] = "subido"
            row["url"] = result["secure_url"]
        rows.append(row)
        print(f"  [{i}/{len(words)}] {word['texto']} → {row['estado']}")

    manifest = out_dir / "manifiesto.csv"
    with manifest.open("w", newline="", encoding="utf-8") as f:
        fields = ["id", "texto", "texto_modelo", "espanol", "archivo", "segundos", "estado", "url"]
        writer = csv.DictWriter(f, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    (out_dir / "LEEME.txt").write_text(
        f"Audio sintético generado con {model_id} (licencia CC-BY-NC-4.0) el {stamp}.\n"
        "Es una voz sintética, no la de un hablante nativo. Escúchalo y anota en el manifiesto qué palabras suenan mal.\n",
        encoding="utf-8",
    )
    ok = sum(1 for r in rows if r["estado"] in ("generado", "subido"))
    print(f"\nListo: {ok}/{len(rows)} audios en {out_dir}\nManifiesto: {manifest}")


if __name__ == "__main__":
    main()
