import { spawn } from 'node:child_process';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';

const ROOT = process.cwd();
const MEMORIES_ROOT = path.join(ROOT, 'public', 'memories');

const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const VIDEO_EXTS = new Set(['.mp4', '.mov', '.webm', '.m4v']);

const IMAGE_MIN_BYTES = 400 * 1024; // 400 KB
const VIDEO_MIN_BYTES = 5 * 1024 * 1024; // 5 MB
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
    if (entry.isFile()) {
      files.push(full);
    }
  }
  return files;
}

async function optimizeImage(filePath) {
  const stat = await fs.stat(filePath);
  const originalBytes = stat.size;
  if (originalBytes < IMAGE_MIN_BYTES) {
    return { changed: false, originalBytes, finalBytes: originalBytes, reason: 'below-threshold' };
  }

  const ext = path.extname(filePath).toLowerCase();
  let pipeline = sharp(filePath, { failOn: 'none' }).rotate().resize({
    width: MAX_DIMENSION,
    height: MAX_DIMENSION,
    fit: 'inside',
    withoutEnlargement: true,
  });

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 74, mozjpeg: true, chromaSubsampling: '4:2:0' });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, palette: true, quality: 75, effort: 9 });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 74, effort: 6 });
  } else {
    return { changed: false, originalBytes, finalBytes: originalBytes, reason: 'unsupported' };
  }

  const optimized = await pipeline.toBuffer();
  const finalBytes = optimized.length;

  // Skip if no meaningful gain.
  if (finalBytes >= originalBytes * 0.98) {
    return { changed: false, originalBytes, finalBytes: originalBytes, reason: 'no-gain' };
  }

  await fs.writeFile(filePath, optimized);
  return { changed: true, originalBytes, finalBytes, reason: 'optimized' };
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

async function optimizeVideo(filePath) {
  const stat = await fs.stat(filePath);
  const originalBytes = stat.size;
  if (originalBytes < VIDEO_MIN_BYTES) {
    return { changed: false, originalBytes, finalBytes: originalBytes, reason: 'below-threshold', finalPath: filePath };
  }

  const dir = path.dirname(filePath);
  const baseName = path.basename(filePath, path.extname(filePath));
  const ext = path.extname(filePath).toLowerCase();
  const targetPath = path.join(dir, `${baseName}.mp4`);
  const tempPath = path.join(dir, `${baseName}.opt.mp4`);

  await fs.rm(tempPath, { force: true });

  await runFfmpeg([
    '-y',
    '-i',
    filePath,
    '-map',
    '0:v:0',
    '-map',
    '0:a:0?',
    '-vf',
    `scale='if(gt(iw,ih),${MAX_DIMENSION},-2)':'if(gt(iw,ih),-2,${MAX_DIMENSION})'`,
    '-c:v',
    'libx264',
    '-preset',
    'veryfast',
    '-crf',
    '30',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-b:a',
    '96k',
    '-movflags',
    '+faststart',
    tempPath,
  ]);

  const tempStat = await fs.stat(tempPath);
  const finalBytes = tempStat.size;
  const shouldReplace = finalBytes < originalBytes * 0.95 || ext !== '.mp4';

  if (!shouldReplace) {
    await fs.rm(tempPath, { force: true });
    return { changed: false, originalBytes, finalBytes: originalBytes, reason: 'no-gain', finalPath: filePath };
  }

  await fs.rm(targetPath, { force: true });
  if (targetPath === filePath) {
    await fs.rm(filePath, { force: true });
  }
  await fs.rename(tempPath, targetPath);

  if (targetPath !== filePath) {
    await fs.rm(filePath, { force: true });
  }

  return { changed: true, originalBytes, finalBytes, reason: 'optimized', finalPath: targetPath };
}

async function main() {
  if (!ffmpegPath) {
    throw new Error('ffmpeg-static binary not found. Install dependencies first.');
  }

  const allFiles = await walkFiles(MEMORIES_ROOT);
  const imageFiles = allFiles.filter((filePath) => IMAGE_EXTS.has(path.extname(filePath).toLowerCase()));
  const videoFiles = allFiles.filter((filePath) => VIDEO_EXTS.has(path.extname(filePath).toLowerCase()));

  console.log(`Images found: ${imageFiles.length}`);
  console.log(`Videos found: ${videoFiles.length}`);

  let imageSaved = 0;
  let videoSaved = 0;
  let imageChanged = 0;
  let videoChanged = 0;

  for (const filePath of imageFiles) {
    try {
      const result = await optimizeImage(filePath);
      if (result.changed) {
        imageChanged += 1;
        imageSaved += result.originalBytes - result.finalBytes;
        console.log(`IMG optimized: ${path.relative(ROOT, filePath)} (${formatMB(result.originalBytes)} -> ${formatMB(result.finalBytes)})`);
      }
    } catch (error) {
      console.warn(`IMG failed: ${path.relative(ROOT, filePath)} :: ${error.message}`);
    }
  }

  for (const filePath of videoFiles) {
    try {
      const result = await optimizeVideo(filePath);
      if (result.changed) {
        videoChanged += 1;
        videoSaved += result.originalBytes - result.finalBytes;
        const before = path.relative(ROOT, filePath);
        const after = path.relative(ROOT, result.finalPath);
        console.log(`VID optimized: ${before} -> ${after} (${formatMB(result.originalBytes)} -> ${formatMB(result.finalBytes)})`);
      }
    } catch (error) {
      console.warn(`VID failed: ${path.relative(ROOT, filePath)} :: ${error.message}`);
    }
  }

  console.log('--- Optimization Summary ---');
  console.log(`Images optimized: ${imageChanged}, saved: ${formatMB(imageSaved)}`);
  console.log(`Videos optimized: ${videoChanged}, saved: ${formatMB(videoSaved)}`);
  console.log(`Total saved: ${formatMB(imageSaved + videoSaved)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
