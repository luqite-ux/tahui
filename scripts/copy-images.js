const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = path.join(root, "产品资料", "部分整理");
const out = path.join(root, "public", "images");

if (!fs.existsSync(out)) fs.mkdirSync(out, { recursive: true });

const copies = [
  [path.join(src, "产品图", "Seamless Knitwear", "01.jpg"), "category-seamless.jpg"],
  [path.join(src, "产品图", "Multi-Material Collection", "01.jpg"), "category-materials.jpg"],
  [path.join(src, "产品图", "Advanced Craftsmanship", "01.jpg"), "category-craftsmanship.jpg"],
  [path.join(src, "首页工厂图", "Linking Workshop.jpg"), "factory-linking.jpg"],
  [path.join(src, "首页工厂图", "Hand Finishing.jpg"), "factory-finishing.jpg"],
  [path.join(src, "首页工厂图", "Quality Sorting.jpg"), "factory-sorting.jpg"],
  [path.join(src, "首页工厂图", "Steam Pressing.jpg"), "factory-pressing.jpg"],
  [path.join(src, "首页工厂图", "Packaging.jpg"), "factory-packaging.jpg"],
  [path.join(src, "首页工厂图", "Linking Workshop.jpg"), "manufacturing.jpg"],
  [path.join(src, "产品图", "Seamless Knitwear", "01.jpg"), "hero-model.png"],
  [path.join(src, "产品图", "Seamless Knitwear", "02.jpg"), "hero-model-2.png"],
  [path.join(src, "产品图", "Multi-Material Collection", "01.jpg"), "hero-model-3.png"],
  [path.join(src, "产品图", "Advanced Craftsmanship", "01.jpg"), "hero-model-4.png"],
];

for (const [from, name] of copies) {
  const to = path.join(out, name);
  if (fs.existsSync(from)) {
    fs.copyFileSync(from, to);
    console.log("OK:", name);
  } else {
    console.log("SKIP (not found):", from);
  }
}

console.log("Done.");
