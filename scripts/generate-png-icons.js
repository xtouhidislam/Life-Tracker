// ==============================================================================
// Pure Node.js PNG Generator for LifeQuest PWA Icons
// Generates standard PNGs without third-party dependencies using built-in zlib
// ==============================================================================

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// CRC32 table for PNG chunk checksums
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, "ascii");
  data.copy(chunk, 8);
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  chunk.writeUInt32BE(crc32(typeAndData), 8 + len);
  return chunk;
}

function generatePng(size) {
  const width = size;
  const height = size;

  // Raw RGBA scanlines with filter byte 0 preceding each row
  const rawData = Buffer.alloc(height * (1 + width * 4));

  const center = size / 2;
  const ringRadius = size * 0.28;
  const ringWidth = Math.max(3, size * 0.05);
  const dotRadius = size * 0.1;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4);
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Base background: #154D38 (21, 77, 56)
      let r = 21;
      let g = 77;
      let b = 56;
      let a = 255;

      // Draw center dot: #6EE7B7 (110, 231, 183)
      if (dist <= dotRadius) {
        r = 110;
        g = 231;
        b = 183;
      }
      // Draw outer ring: #34D399 (52, 211, 153)
      else if (Math.abs(dist - ringRadius) <= ringWidth / 2) {
        r = 52;
        g = 211;
        b = 153;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // PNG Signature
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // IHDR chunk: width(4), height(4), bitDepth(1=8), colorType(1=6:RGBA), comp(1=0), filter(1=0), interlace(1=0)
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // Deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Non-interlaced
  const ihdrChunk = createChunk("IHDR", ihdrData);

  // IDAT chunk: compressed scanlines
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk("IDAT", compressed);

  // IEND chunk
  const iendChunk = createChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(__dirname, "..", "public");

const ICONS = [
  { file: "icon-192.png", size: 192 },
  { file: "icon-512.png", size: 512 },
  { file: "maskable-icon-512.png", size: 512 },
  { file: "apple-touch-icon.png", size: 180 },
  { file: "badge-72.png", size: 72 },
];

ICONS.forEach(({ file, size }) => {
  const buf = generatePng(size);
  const outPath = path.join(publicDir, file);
  fs.writeFileSync(outPath, buf);
  console.log(`Generated ${file} (${size}x${size}, ${buf.length} bytes)`);
});
