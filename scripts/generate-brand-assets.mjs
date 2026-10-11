import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="af-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#090d16" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <linearGradient id="af-border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="45%" stop-color="#3b82f6" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.8" />
    </linearGradient>

    <linearGradient id="af-left" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#2563eb" />
    </linearGradient>

    <linearGradient id="af-right" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60a5fa" />
      <stop offset="100%" stop-color="#4f46e5" />
    </linearGradient>

    <linearGradient id="af-slash" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#38bdf8" />
    </linearGradient>

    <filter id="af-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Outer Squircle Container -->
  <rect
    x="2.5"
    y="2.5"
    width="59"
    height="59"
    rx="16"
    fill="url(#af-bg)"
    stroke="url(#af-border)"
    stroke-width="2.5"
  />

  <!-- Left Chevron < -->
  <path
    d="M24 20L13 32L24 44"
    stroke="url(#af-left)"
    stroke-width="4.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Right Chevron > -->
  <path
    d="M40 20L51 32L40 44"
    stroke="url(#af-right)"
    stroke-width="4.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Dynamic Assessment Force Slash -->
  <path
    d="M36 17L28 47"
    stroke="url(#af-slash)"
    stroke-width="3.6"
    stroke-linecap="round"
    filter="url(#af-glow)"
  />

  <!-- Precision Assessment Core Node -->
  <circle cx="32" cy="32" r="2.8" fill="#ffffff" />
</svg>
`;

// CRC32 implementation for PNG chunks
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[i] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function createPng(width, height, rgbaBuffer) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const rawRows = [];
  const rowBytes = width * 4;
  for (let y = 0; y < height; y++) {
    rawRows.push(Buffer.from([0]));
    rawRows.push(rgbaBuffer.subarray(y * rowBytes, (y + 1) * rowBytes));
  }
  const idatData = zlib.deflateSync(Buffer.concat(rawRows));

  const ihdrChunk = makeChunk("IHDR", ihdrData);
  const idatChunk = makeChunk("IDAT", idatData);
  const iendChunk = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

function renderRasterLogo(size) {
  const rgba = Buffer.alloc(size * size * 4);
  const scale = size / 64;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const nx = x / scale;
      const ny = y / scale;

      // Squircle distance
      const dx = Math.min(nx - 2, 62 - nx);
      const dy = Math.min(ny - 2, 62 - ny);
      if (dx < 0 || dy < 0) {
        rgba[idx + 3] = 0;
        continue;
      }

      const cornerR = 14;
      if (dx < cornerR && dy < cornerR) {
        const dist = Math.hypot(cornerR - dx, cornerR - dy);
        if (dist > cornerR + 0.5) {
          rgba[idx + 3] = 0;
          continue;
        }
      }

      // Base background color
      const gradT = (nx + ny) / 128;
      const rBg = Math.round(15 * (1 - gradT) + 2 * gradT);
      const gBg = Math.round(23 * (1 - gradT) + 6 * gradT);
      const bBg = Math.round(42 * (1 - gradT) + 23 * gradT);

      rgba[idx] = rBg;
      rgba[idx + 1] = gBg;
      rgba[idx + 2] = bBg;
      rgba[idx + 3] = 255;

      // Outer border (width ~2.5)
      const isBorder =
        (dx < 2.5 && dy >= 2.5) ||
        (dy < 2.5 && dx >= 2.5) ||
        (dx < cornerR && dy < cornerR && Math.abs(Math.hypot(cornerR - dx, cornerR - dy) - cornerR) < 1.8);

      if (isBorder) {
        rgba[idx] = 56;
        rgba[idx + 1] = 189;
        rgba[idx + 2] = 248;
        rgba[idx + 3] = 230;
      }

      // Left chevron < (apex at 13,32; arms to 24,20 and 24,44)
      const leftDist1 = Math.abs((ny - 32) + (nx - 13) * 1.09);
      const leftDist2 = Math.abs((32 - ny) + (nx - 13) * 1.09);
      if (
        nx >= 12 &&
        nx <= 25 &&
        ((ny <= 32 && leftDist1 < 2.8) || (ny >= 32 && leftDist2 < 2.8))
      ) {
        rgba[idx] = 56;
        rgba[idx + 1] = 189;
        rgba[idx + 2] = 248;
        rgba[idx + 3] = 255;
      }

      // Right chevron > (apex at 51,32; arms to 40,20 and 40,44)
      const rightDist1 = Math.abs((ny - 32) + (51 - nx) * 1.09);
      const rightDist2 = Math.abs((32 - ny) + (51 - nx) * 1.09);
      if (
        nx >= 39 &&
        nx <= 52 &&
        ((ny <= 32 && rightDist1 < 2.8) || (ny >= 32 && rightDist2 < 2.8))
      ) {
        rgba[idx] = 99;
        rgba[idx + 1] = 102;
        rgba[idx + 2] = 241;
        rgba[idx + 3] = 255;
      }

      // Dynamic Slash / Force vector: (36, 17) to (28, 47)
      // Line equation: (ny - 17) / 30 = (36 - nx) / 8 => 8*(ny - 17) = 30*(36 - nx)
      const slashX = 36 - ((ny - 17) / 30) * 8;
      if (ny >= 16 && ny <= 48 && Math.abs(nx - slashX) < 2.2) {
        rgba[idx] = 255;
        rgba[idx + 1] = 255;
        rgba[idx + 2] = 255;
        rgba[idx + 3] = 255;
      }

      // Center Node circle (32, 32, radius 3)
      if (Math.hypot(nx - 32, ny - 32) < 3.2) {
        rgba[idx] = 255;
        rgba[idx + 1] = 255;
        rgba[idx + 2] = 255;
        rgba[idx + 3] = 255;
      }
    }
  }

  return createPng(size, size, rgba);
}

function createIcoFile(pngBuffer32) {
  // ICO Header: 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // ICO format
  header.writeUInt16LE(1, 4); // 1 image

  // Directory entry: 16 bytes
  const dir = Buffer.alloc(16);
  dir.writeUInt8(32, 0); // width 32
  dir.writeUInt8(32, 1); // height 32
  dir.writeUInt8(0, 2); // color count
  dir.writeUInt8(0, 3); // reserved
  dir.writeUInt16LE(1, 4); // color planes
  dir.writeUInt16LE(32, 6); // bits per pixel
  dir.writeUInt32LE(pngBuffer32.length, 8); // image size
  dir.writeUInt32LE(6 + 16, 12); // image offset

  return Buffer.concat([header, dir, pngBuffer32]);
}

// Generate files
console.log("Generating brand assets...");

// 1. Vector icon (SVG)
fs.writeFileSync(path.join(rootDir, "src/app/icon.svg"), SVG_CONTENT, "utf8");
fs.writeFileSync(path.join(rootDir, "public/icon.svg"), SVG_CONTENT, "utf8");
console.log("✓ src/app/icon.svg & public/icon.svg created");

// 2. High-res raster PNG
const png32 = renderRasterLogo(32);
const png192 = renderRasterLogo(192);

fs.writeFileSync(path.join(rootDir, "public/apple-icon.png"), png192);
fs.writeFileSync(path.join(rootDir, "src/app/apple-icon.png"), png192);
console.log("✓ public/apple-icon.png (192x192) created");

// 3. ICO file
const icoBuffer = createIcoFile(png32);
fs.writeFileSync(path.join(rootDir, "src/app/favicon.ico"), icoBuffer);
fs.writeFileSync(path.join(rootDir, "public/favicon.ico"), icoBuffer);
console.log("✓ src/app/favicon.ico & public/favicon.ico created");

console.log("All brand assets generated successfully!");
