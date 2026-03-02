/**
 * Script untuk generate PWA icons dari logo.png
 * Jalankan: bun scripts/generate-pwa-icons.mjs
 */

import sharp from "sharp";
import { mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");
const inputPath = join(rootDir, "public", "logo.png");
const outputDir = join(rootDir, "public", "icons");

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

console.log("Generating PWA icons...");

for (const size of sizes) {
  const outputPath = join(outputDir, `icon-${size}x${size}.png`);
  await sharp(inputPath)
    .resize(size, size, {
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 0 },
    })
    .png()
    .toFile(outputPath);
  console.log(`✓ Generated icon-${size}x${size}.png`);
}

console.log("\nAll PWA icons generated in public/icons/");
