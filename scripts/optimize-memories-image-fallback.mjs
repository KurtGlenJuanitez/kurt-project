import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const ROOT = process.cwd();
const MEMORIES_ROOT = path.join(ROOT, 'public', 'memories');
const IMAGE_EXTS = new Set(['.jpg', '.jpeg']);
const MAX_DIMENSION = 1920;

function formatMB(bytes) {
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function walkFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(full)));
      continue;
    }
    if (entry.isFile()) files.push(full);
  }
  return files;
}

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(stderr || `ffmpeg exited with code ${code}`));
    });
  });
}

async function optimizeFallbackJpeg(filePath) {
  const original = await fs.stat(filePath);
  const ext = path.extname(filePath);
  const tempPath = `${filePath}.fftmp${ext.toLowerCase()}`;

  await fs.rm(tempPath, { force: true });

  await runFfmpeg([
    '-y',
    '-i',
    filePath,
    '-vf',
    `scale='if(gt(iw,ih),${MAX_DIMENSION},-2)':'if(gt(iw,ih),-2,${MAX_DIMENSION})'`,
    '-q:v',
    '4',
    '-frames:v',
    '1',
    tempPath,
  ]);

  const optimized = await fs.stat(tempPath);
  if (optimized.size >= original.size * 0.98) {
    await fs.rm(tempPath, { force: true });
    return { changed: false, originalBytes: original.size, finalBytes: original.size };
  }

  await fs.rm(filePath, { force: true });
  await fs.rename(tempPath, filePath);
  return { changed: true, originalBytes: original.size, finalBytes: optimized.size };
}

async function main() {
  const all = await walkFiles(MEMORIES_ROOT);
  const candidates = all.filter((filePath) => IMAGE_EXTS.has(path.extname(filePath).toLowerCase()));

  let checked = 0;
  let decoded = 0;
  let optimizedCount = 0;
  let bytesSaved = 0;

  for (const filePath of candidates) {
    checked += 1;
    try {
      await sharp(filePath, { failOn: 'none' }).metadata();
      decoded += 1;
      continue;
    } catch {
      // Try ffmpeg fallback when libvips cannot decode the file.
    }

    try {
      const result = await optimizeFallbackJpeg(filePath);
      if (result.changed) {
        optimizedCount += 1;
        bytesSaved += result.originalBytes - result.finalBytes;
        console.log(`Fallback optimized: ${path.relative(ROOT, filePath)} (${formatMB(result.originalBytes)} -> ${formatMB(result.finalBytes)})`);
      }
    } catch (error) {
      console.warn(`Fallback failed: ${path.relative(ROOT, filePath)} :: ${error.message}`);
    }
  }

  console.log('--- Fallback Summary ---');
  console.log(`JPEG/JPG checked: ${checked}`);
  console.log(`Decoded by sharp: ${decoded}`);
  console.log(`Fallback optimized: ${optimizedCount}`);
  console.log(`Saved: ${formatMB(bytesSaved)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
