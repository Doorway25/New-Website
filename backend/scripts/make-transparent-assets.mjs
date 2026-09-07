import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public");

async function blackToTransparent(inputName, outputName, threshold = 28) {
  const input = path.join(root, inputName);
  const output = path.join(root, outputName);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r <= threshold && g <= threshold && b <= threshold) {
      data[i + 3] = 0;
    }
  }

  await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toFile(output);

  console.log("wrote", outputName, `${info.width}x${info.height}`);
}

await blackToTransparent("ED--door-png-logo-wide.png", "logo-color.png", 20);
await blackToTransparent("ED-door-white-logo-hori.png", "logo-white.png", 20);
await blackToTransparent("magnific__background__89202.png", "overlay-map.png", 18);
await blackToTransparent("doorway-guideline.png", "overlay-graduate.png", 18);
console.log("done");
