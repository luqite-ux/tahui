# 图片资源说明

## 从已发布的 Vercel 站把图全部拉回本地

项目已部署在 **www.tahui-factory.cn** 时，可以直接从线上站下载所有图片到本地：

```bash
npm run download-images
```

脚本会从 `https://www.tahui-factory.cn/images/` 拉取代码里用到的所有图片（模特图、logo、分类图、工厂图等）并保存到 `public/images/`。若某张图线上没有（404），会跳过并在控制台提示。

## v0 导出的 ZIP 为什么不带这些图？

v0 预览时用的是他们自己的占位图或 CDN，**Download ZIP 只包含代码，不包含 `/images/` 下的资源**。若你已通过 Vercel 发布，用上面的 `npm run download-images` 即可把线上图都下载下来。

## 已放置的图片（从「产品资料/部分整理」复制）

- **首页分类**：`category-seamless.jpg`、`category-materials.jpg`、`category-craftsmanship.jpg`
- **首页工厂**：`factory-linking.jpg`、`factory-finishing.jpg`、`factory-sorting.jpg`、`factory-pressing.jpg`、`factory-packaging.jpg`、`manufacturing.jpg`
- **Hero 轮播**：`hero-model.png`、`hero-model-2.png`、`hero-model-3.png`、`hero-model-4.png`（目前用产品图占位，可替换为正式模特图）
- **Logo**：`logo.svg`（由 `placeholder-logo.svg` 复制，可替换为正式品牌 logo）

## 其他页面仍可能 404 的图片（需自行补充）

按页面汇总，把对应文件放到 `public/images/` 即可：

| 文件 | 用途 |
|------|------|
| `quality-hero.jpg`、`quality-commitment.jpg`、`cert-1.jpg`～`cert-n.jpg` | Quality 页 |
| `manufacturing-hero.jpg`、`wholegarment.jpg` | Manufacturing 页 |
| `factory-gate.jpg`、`linking-workshop.jpg`、`sorting-workshop.jpg`、`finishing-workshop.jpg`、`steaming-workshop-1.jpg`、`warehouse.jpg` | Factory Tour / About 页 |
| `contact-map.jpg` | Contact 页（可用地图截图或占位图） |
| `product-*.jpg`（如 product-seamless-sweaters.jpg 等） | Products 页各分类下的产品图 |

可从「产品资料」中挑选合适图片，复制到 `public/images/` 并命名为上表文件名；或继续用 `scripts/copy-images.js` 增加复制规则。
