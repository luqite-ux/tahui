/**
 * 从已部署的 Vercel 站点 (www.tahui-factory.cn) 下载所有 /images/ 下的图片到本地 public/images/
 * 使用前请确保站点可访问：npm run download-images
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://www.tahui-factory.cn";
const OUT_DIR = path.join(__dirname, "..", "public", "images");

// 代码中引用的所有图片路径（不含 /images/ 前缀，仅文件名）
const IMAGE_FILES = [
  "logo.png",
  "logo.svg",
  "hero-model.png",
  "hero-model-2.png",
  "hero-model-3.png",
  "hero-model-4.png",
  "category-seamless.jpg",
  "category-materials.jpg",
  "category-craftsmanship.jpg",
  "manufacturing.jpg",
  "factory-linking.jpg",
  "factory-finishing.jpg",
  "factory-sorting.jpg",
  "factory-pressing.jpg",
  "factory-packaging.jpg",
  "quality-hero.jpg",
  "quality-commitment.jpg",
  "cert-1.jpg",
  "cert-2.jpg",
  "cert-3.jpg",
  "manufacturing-hero.jpg",
  "wholegarment.jpg",
  "linking-workshop.jpg",
  "sorting-workshop.jpg",
  "finishing-workshop.jpg",
  "steaming-workshop-1.jpg",
  "warehouse.jpg",
  "factory-gate.jpg",
  "contact-map.jpg",
  "product-seamless-sweaters.jpg",
  "product-seamless-underwear.jpg",
  "product-vests.jpg",
  "product-sweaters.jpg",
  "product-cardigans.jpg",
  "product-hoodies.jpg",
  "product-dresses.jpg",
  "product-skirts.jpg",
  "product-scarves.jpg",
  "product-accessories.jpg",
  "product-blankets.jpg",
  "product-jacquard.jpg",
  "product-embroidery.jpg",
  "product-dyeing.jpg",
];

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          download(res.headers.location).then(resolve).catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject);
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let ok = 0;
  let fail = 0;

  for (const file of IMAGE_FILES) {
    const url = `${BASE_URL}/images/${file}`;
    const outPath = path.join(OUT_DIR, file);
    try {
      const buf = await download(url);
      fs.writeFileSync(outPath, buf);
      console.log("OK:", file);
      ok++;
    } catch (e) {
      console.log("SKIP:", file, "(", e.message, ")");
      fail++;
    }
  }

  console.log("\nDone.", ok, "downloaded,", fail, "skipped (404 or error).");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
