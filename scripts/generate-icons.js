const sharp = require('sharp');
const path = require('path');

const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
const outDir = path.join(__dirname, '..', 'public');

const sizes = [192, 512];

async function generate() {
  for (const size of sizes) {
    await sharp(svgPath)
      .resize(size, size)
      .png()
      .toFile(path.join(outDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  // Also generate apple-touch-icon
  await sharp(svgPath)
    .resize(180, 180)
    .png()
    .toFile(path.join(outDir, 'apple-icon.png'));
  console.log('Generated apple-icon.png');

  // Favicon (32x32)
  await sharp(svgPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(outDir, 'favicon-32.png'));
  console.log('Generated favicon-32.png');
}

generate().catch(err => {
  console.error('Failed to generate icons:', err);
  process.exit(1);
});
