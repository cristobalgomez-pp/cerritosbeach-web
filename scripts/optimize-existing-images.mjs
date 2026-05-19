/**
 * One-time migration: compresses existing images in Supabase Storage.
 * Re-uploads each file in-place (same path) so no DB changes are needed.
 *
 * Run: node scripts/optimize-existing-images.mjs
 */

import { readFileSync } from "fs";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

// ─── Load .env.local ──────────────────────────────────────────────────────────

function loadEnv() {
  const env = {};
  try {
    const lines = readFileSync(".env.local", "utf8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
  } catch {
    console.error("No se pudo leer .env.local");
    process.exit(1);
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
let SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env.local");
  process.exit(1);
}

// El Storage API requiere JWT. Si la clave está en formato sb_secret_,
// obtenemos el JWT del CLI de Supabase automáticamente.
if (SERVICE_KEY.startsWith("sb_")) {
  const ref = SUPABASE_URL.match(/https:\/\/([^.]+)\./)?.[1];
  if (!ref) { console.error("No se pudo extraer el project ref de SUPABASE_URL"); process.exit(1); }
  try {
    const out = execSync(`npx supabase projects api-keys --project-ref ${ref} 2>/dev/null`).toString();
    const match = out.match(/service_role\s*\|\s*(eyJ[A-Za-z0-9._-]+)/);
    if (!match) throw new Error("JWT no encontrado en output del CLI");
    SERVICE_KEY = match[1];
    console.log("✓ JWT service_role obtenido del CLI de Supabase\n");
  } catch (e) {
    console.error("No se pudo obtener el JWT service_role del CLI:", e.message);
    console.error("Asegúrate de estar logueado: npx supabase login");
    process.exit(1);
  }
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ─── Config ───────────────────────────────────────────────────────────────────

const BUCKETS = ["content-images", "avatars"];
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 85; // sharp uses 0-100 for png via .png({ quality })
const WEBP_QUALITY = 82;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

async function listAllFiles(bucket, prefix = "") {
  const files = [];
  const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000 });
  if (error) throw new Error(`list ${bucket}/${prefix}: ${error.message}`);

  for (const item of data ?? []) {
    if (item.id === null) {
      // It's a folder
      const sub = await listAllFiles(bucket, prefix ? `${prefix}/${item.name}` : item.name);
      files.push(...sub);
    } else {
      files.push({ bucket, path: prefix ? `${prefix}/${item.name}` : item.name, metadata: item.metadata });
    }
  }
  return files;
}

async function optimizeFile(bucket, path, dryRun = false) {
  // Download
  const { data: blob, error: dlErr } = await supabase.storage.from(bucket).download(path);
  if (dlErr || !blob) throw new Error(`download: ${dlErr?.message}`);

  const buffer = Buffer.from(await blob.arrayBuffer());
  const originalSize = buffer.length;

  // Detect type by path extension
  const ext = path.split(".").pop()?.toLowerCase();
  let compressed;
  let contentType;

  const image = sharp(buffer).resize(MAX_WIDTH, null, { withoutEnlargement: true });

  if (ext === "jpg" || ext === "jpeg") {
    compressed = await image.jpeg({ quality: JPEG_QUALITY, progressive: true }).toBuffer();
    contentType = "image/jpeg";
  } else if (ext === "png") {
    compressed = await image.png({ quality: PNG_QUALITY, compressionLevel: 8 }).toBuffer();
    contentType = "image/png";
  } else if (ext === "webp") {
    compressed = await image.webp({ quality: WEBP_QUALITY }).toBuffer();
    contentType = "image/webp";
  } else {
    return null; // skip SVG, GIF, etc.
  }

  // Skip if not meaningfully smaller (< 5% gain)
  if (compressed.length >= originalSize * 0.95) {
    return { skipped: true, originalSize, compressedSize: compressed.length };
  }

  // Re-upload in-place (skip in dry-run)
  if (!dryRun) {
    const { error: upErr } = await supabase.storage
      .from(bucket)
      .upload(path, compressed, { upsert: true, contentType });
    if (upErr) throw new Error(`upload: ${upErr.message}`);
  }

  return { skipped: false, originalSize, compressedSize: compressed.length };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const DRY_RUN = process.argv.includes("--dry-run");
  if (DRY_RUN) console.log("⚠  MODO DRY-RUN — no se subirá nada\n");

  console.log("Listando archivos en Supabase Storage…\n");

  let allFiles = [];
  for (const bucket of BUCKETS) {
    const files = await listAllFiles(bucket);
    console.log(`  ${bucket}: ${files.length} archivo(s)`);
    allFiles.push(...files);
  }

  const imageFiles = allFiles.filter(({ path }) =>
    /\.(jpe?g|png|webp)$/i.test(path)
  );

  console.log(`\nImágenes a procesar: ${imageFiles.length}\n`);

  let totalOriginal = 0;
  let totalCompressed = 0;
  let optimized = 0;
  let skipped = 0;
  let errors = 0;

  for (const { bucket, path } of imageFiles) {
    process.stdout.write(`  [${bucket}] ${path} … `);
    try {
      const result = await optimizeFile(bucket, path, DRY_RUN);
      if (!result) {
        console.log("omitido (formato no soportado)");
        skipped++;
        continue;
      }
      totalOriginal += result.originalSize;
      totalCompressed += result.compressedSize;
      if (result.skipped) {
        console.log(`ya optimizada (${fmt(result.originalSize)})`);
        skipped++;
      } else {
        const pct = Math.round((1 - result.compressedSize / result.originalSize) * 100);
        const action = DRY_RUN ? "[DRY-RUN]" : "✓";
        console.log(`${fmt(result.originalSize)} → ${fmt(result.compressedSize)} (-${pct}%) ${action}`);
        if (!DRY_RUN) optimized++;
        else optimized++; // count projected saves in dry-run too
      }
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
      errors++;
    }
  }

  const label = DRY_RUN ? "Ahorro proyectado" : "Ahorro total";
  console.log(`
────────────────────────────────${DRY_RUN ? "\nMODO DRY-RUN — nada fue modificado" : ""}
Optimizadas : ${optimized}
Omitidas    : ${skipped}
Errores     : ${errors}
${label}: ${fmt(totalOriginal - totalCompressed)} (${fmt(totalOriginal)} → ${fmt(totalCompressed)})
────────────────────────────────
${DRY_RUN ? "Para aplicar los cambios: node scripts/optimize-existing-images.mjs" : ""}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
