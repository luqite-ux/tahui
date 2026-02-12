# Tahui 网站 Sanity 改造方案

## 一、复用旧项目 vs 新建项目

### 建议决策表

| 情况 | 建议 | 说明 |
|------|------|------|
| 旧 Sanity 项目是**同类型官网**（工厂/品牌站），且 schema 已包含：首页、产品分类、工厂/制造/品质等 | **优先复用** | 少做重复工作，只需把本仓库接上该项目的 projectId/dataset，并迁移内容与图片 |
| 旧项目是**博客/电商/其它类型**，或 schema 与本站结构差异大 | **建议新建** | 在本仓库内新建 Sanity 配置与 schema，按当前页面结构设计，避免被旧 schema 束缚 |
| 旧项目找不到或不确定 | **在本项目新建** | 与 Next 同仓库，部署、环境变量、版本都统一，后续维护简单 |

### 若选择「复用」旧项目

1. 在旧项目里确认或新增 **dataset**（建议为 tahui 单独建一个 dataset，如 `production`，避免和别的站混用）。
2. 在本仓库配置：
   - `.env.local` 中 `NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET` 指向旧项目。
   - 若旧项目已有 schema，且和本站页面一致，只需在本仓库安装 `next-sanity`、`@sanity/client` 等，接上 client 与 GROQ 查询，无需再建 schema。
3. 把下面「图片策略」里的图片上传到该项目的 **Assets**，并在对应文档中引用。

### 若选择「新建」（本仓库已按此准备）

- 在 [sanity.io](https://sanity.io) 新建一个 Project（或使用现有 Organization 下新建）。
- 在本仓库已预留 `sanity.config.ts`、`sanity/lib`、`sanity/schema` 等结构，你只需填入 `projectId` 和 `dataset`，并执行 `npx sanity deploy`（若用独立 Studio）或直接使用嵌入的 Studio 路由。

---

## 二、图片策略：保留 v0 图片、先入 Sanity 再逐步替换

目标：**不破坏现有整体感觉**，先让内容与图片进 Sanity，后续只换图、不改版。

### 2.1 做法概述

1. **先全部用现有 v0/本地图片**  
   把当前 `public/images/` 里用到的图片上传到 Sanity 的 **Asset**（Image），不删本地备份亦可。

2. **用 Sanity 文档引用这些图片**  
   例如：首页设置文档里「Hero 轮播」引用 4 张图，产品分类文档引用 category/product 图，工厂/制造/品质页各自引用对应图片字段。

3. **前端从 Sanity 读图并渲染**  
   用 `urlFor(image).width().height().url()` 或 next-sanity 的 Image 组件渲染，**视觉上与现在一致**。

4. **后续替换**  
   在 Sanity Studio 里把某张图从「当前 asset」换成新上传的图，保存即可；前端无需改代码，也不会破坏整体感觉。

### 2.2 建议先迁入 Sanity 的图片清单（与现网一致）

按页面整理，便于在 Studio 里按模块替换：

| 页面/模块 | 图片路径 | 说明 |
|-----------|----------|------|
| **首页 Hero** | `hero-model.png`, `hero-model-2.png`, `hero-model-3.png`, `hero-model-4.png` | v0 风格，建议保留并先入 Sanity |
| **首页 品类** | `category-seamless.jpg`, `category-materials.jpg`, `category-craftsmanship.jpg` | 三大类主图 |
| **首页 制造/工厂步骤** | `manufacturing.jpg`, `factory-linking.jpg`, `factory-finishing.jpg`, `factory-sorting.jpg`, `factory-pressing.jpg`, `factory-packaging.jpg` | 步骤说明图 |
| **产品页** | 同上品类图 + `product-*.jpg`（seamless-sweaters, product-vests, product-sweaters, …） | 与首页一致，可复用同一 asset |
| **制造页** | `manufacturing-hero.jpg`, `wholegarment.jpg` | 主视觉 |
| **工厂导览** | `factory-gate.jpg`, `linking-workshop.jpg`, `sorting-workshop.jpg`, `finishing-workshop.jpg`, `steaming-workshop-1.jpg`, `warehouse.jpg` | 各区域图 |
| **品质页** | `quality-hero.jpg`, `quality-commitment.jpg`, `cert-1.jpg`, `cert-2.jpg`, `cert-3.jpg` | 主图 + 证书 |
| **关于/联系** | `factory-gate.jpg`, `linking-workshop.jpg`, `contact-map.jpg` | 与其它页可复用 |

以上全部先按「现有 v0/本地图」上传到 Sanity，后续有更好图片再在 Studio 里替换对应字段即可。

### 2.3 替换时注意

- 在 Sanity 中替换 **image 类型字段** 引用的 asset 即可，无需改 schema。
- 若希望「同一张图多处用」，可在 Studio 中多处引用同一个 Image asset，避免重复上传。

---

## 三、本站内容结构（供 schema 设计参考）

当前硬编码内容与 Sanity 文档类型对应关系：

| 文档类型 | 对应页面/模块 | 主要字段示例 |
|----------|----------------|--------------|
| **siteSettings / homepage** | 首页 | hero 轮播图数组、统计数据、优势文案、认证列表、工厂步骤图+文案 |
| **productCategory** | 产品页 / 首页品类 | 分类 id、标题、描述、主图、子品类（名称、描述、图） |
| **page**（about/contact/factory-tour/manufacturing/quality） | 各单页 | 标题、SEO、区块（富文本/图+文）、图片引用 |

当前仓库中的 `sanity/schema` 已按上述结构设计了初版 schema，可直接在 Studio 中创建文档并引用已上传的图片。

---

## 四、本仓库已完成的 Sanity 接入

- **依赖**：已加入 `sanity`、`next-sanity`、`@sanity/image-url`（需执行一次 `pnpm install`）。
- **配置**：`sanity/env.ts`、`sanity/lib/client.ts`、`sanity/lib/image.ts`、根目录 `sanity.config.ts`。
- **Schema**：`sanity/schema/` 下已有首页（homepage + hero 轮播）、产品分类（productCategory + 子类）、工厂步骤（factoryStep），可直接在 Studio 中创建文档并引用图片。
- **Studio 路由**：访问 `/studio` 即可使用嵌入的 Sanity Studio（配置好 projectId/dataset 后）。

## 五、下一步（快速开始）

1. **确定用「复用」还是「新建」**：按上文决策表选择。
2. **配置环境变量**：复制 `.env.example` 为 `.env.local`，填入 `NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`（新建项目时在 [sanity.io/manage](https://www.sanity.io/manage) 创建 Project 和 Dataset）。
3. **安装并启动**：执行 `pnpm install` 与 `pnpm dev`，浏览器打开 `/studio`。
4. **上传图片**：在 Studio 的 Media 中批量上传「二、图片清单」中的图片（先保留现有 v0 图，后续在 Studio 里替换即可）。
5. **创建文档并引用图片**：新建「首页设置」文档，添加 Hero 轮播图并引用刚上传的 4 张 hero 图；新建「产品分类」文档并引用品类/产品图；工厂步骤可按需建文档或后续再接。
6. **前端接 GROQ**：用 `client.fetch()` 或后续接入 `defineLive` 拉取首页、产品分类等，用 `urlFor()` 渲染图片，逐步替换当前硬编码（先做首页与产品页，再迁移其它页）。

完成以上步骤后，即可保留当前 v0 图片效果，并在 Sanity 中随时替换为更好图片而不破坏整体感觉。

---

## 六、一次性把现有图片和数据导入后台（脚本）

若后台已能正常打开，但「首页」「产品分类」「工厂步骤」等还没有文档，可以用本仓库的迁移脚本把 `public/images/` 里的现有图片上传到 Sanity，并自动创建对应文档（首页 Hero 轮播、3 个产品分类、6 条工厂步骤）。以后要改图或文案，直接在 Studio 里改即可。

**前提**：`.env.local` 中已配置 `NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`、`SANITY_API_WRITE_TOKEN`。

**运行**（在项目根目录）：

```bash
pnpm run sanity:populate
```

或直接：

```bash
node scripts/populate-sanity-initial.mjs
```

脚本会：

1. 上传 4 张 Hero 轮播图（`hero-model.png` 等）并创建/更新「首页设置」文档；
2. 上传 3 张品类图并创建 3 条「产品分类」文档（Seamless / Multi-Material / Craftsmanship）；
3. 上传 6 张工厂步骤图并创建 6 条「工厂步骤」文档。

完成后在 Studio 侧栏刷新即可看到数据；图片和文案后续可在 Studio 中随时修改。
