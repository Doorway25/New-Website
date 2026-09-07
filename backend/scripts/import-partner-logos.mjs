import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, "../../tmp-partner-logos");
const outDir = path.resolve(__dirname, "../uploads/university-logos");
const publicDir = path.resolve(__dirname, "../../public/university-logos");

const LOGO_MAP = {
  "01": "arden-university",
  "02": "buckinghamshire-new-university",
  "03": "canterbury-christ-church-university",
  "04": "coventry-university",
  "07": "aston-university",
  "08": "regent-college-london",
  "09": "leeds-beckett-university",
  "10": "university-of-law",
  "11": "queens-university-belfast",
  "12": "newcastle-university",
  "13": "city-st-georges-university-of-london",
  "14": "wrexham-university",
  "15": "bloomsbury-institute-london",
  "16": "bath-spa-university",
  "18": "university-of-roehampton",
  "19": "bpp-university",
  "20": "health-sciences-university",
  "21": "university-of-winchester",
  "22": "lincoln-bishop-university",
  "23": "john-von-neumann-university",
  "24": "gbs-malta",
  "25": "gbs-dubai",
  "26": "icn-business-school",
  "27": "schiller-international-university",
  "28": "into-university-partnerships",
  "29": "oxford-international",
};

/** Logos that are essentially black-on-black and need contrast lift */
const FORCE_BOOST = new Set(["16", "02", "14", "21"]);
/** Extra-low black cutoff for nearly invisible marks */
const ULTRA_DARK = new Set(["16"]);

function saturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  if (max === 0) return 0;
  return (max - min) / max;
}

async function processLogo(num, slug) {
  const input = path.join(assetsDir, `logo-${num}.png`);
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  let greyInk = 0;
  let colorInk = 0;
  let maxLum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    if (max <= 2) continue;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    maxLum = Math.max(maxLum, lum);
    if (saturation(r, g, b) < 0.12) greyInk += 1;
    else colorInk += 1;
  }

  const boost =
    FORCE_BOOST.has(num) || (colorInk < 80 && greyInk > 200 && maxLum < 70);
  const blackCut = ULTRA_DARK.has(num) ? 1 : boost ? 6 : 24;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (boost) {
      if (max <= blackCut) {
        data[i + 3] = 0;
      } else {
        // Dark charcoal mark for white card backgrounds
        const t = Math.min(1, (lum + (ULTRA_DARK.has(num) ? 2 : 8)) / (ULTRA_DARK.has(num) ? 8 : 55));
        const v = Math.round(18 + t * 55);
        data[i] = v;
        data[i + 1] = v;
        data[i + 2] = v;
        data[i + 3] = 255;
      }
    } else if (max <= blackCut) {
      data[i + 3] = 0;
    }
  }

  const buf = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ threshold: 4 })
    .resize({
      width: 512,
      height: 256,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 8 })
    .toBuffer();

  await fs.promises.writeFile(path.join(outDir, `${slug}.png`), buf);
  console.log("ok", num, slug, boost ? "(boosted)" : "");
}

await fs.promises.mkdir(outDir, { recursive: true });
await fs.promises.mkdir(publicDir, { recursive: true });

for (const [num, slug] of Object.entries(LOGO_MAP)) {
  await processLogo(num, slug);
  await fs.promises.copyFile(path.join(outDir, `${slug}.png`), path.join(publicDir, `${slug}.png`));
}

console.log("done");
