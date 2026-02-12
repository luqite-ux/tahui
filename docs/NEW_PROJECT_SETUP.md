# 新建 Sanity Project / Dataset 操作指南

参照「原来的 Sanity」侧栏（首页、专利、站点设置、产品分类、产品、案例、视频、询盘），在本仓库新建 Project 与 Dataset 并接好本仓库的配置与 schema。

---

## 一、你需要做的步骤

### 1. 新建 Project 与 Dataset（二选一）

**方式 A：在 Sanity 官网创建（推荐）**

1. 打开 [https://www.sanity.io/manage](https://www.sanity.io/manage)，登录。
2. 点击 **Create project**，填写项目名称（如 `Tahui 官网`），选择 Organization。
3. 创建完成后，在项目里进入 **Datasets**，点击 **Add dataset**，名称建议用 `production`（或 `development` 做测试）。

**方式 B：用 Sanity MCP 创建（需先配置 MCP）**

若要用 Cursor 的 Sanity MCP 创建项目，需先认证：

```bash
npx sanity@latest mcp configure
```

按提示登录后，即可在对话中让 AI 帮你创建 Project / Dataset。

---

### 2. 配置本仓库环境变量

1. 复制环境变量示例并重命名为本地配置：

   ```bash
   copy .env.example .env.local
   ```

   （PowerShell 下若没有 `copy`，可用：`Copy-Item .env.example .env.local`）

2. 编辑 `.env.local`，填入新建项目的 **Project ID** 和 **Dataset 名称**：

   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=你的项目ID
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

   - **Project ID**：在 [sanity.io/manage](https://www.sanity.io/manage) 打开项目，在项目设置或 URL 中可见（一串字母数字）。
   - **Dataset**：你在该项目下创建的 dataset 名称，如 `production`。

---

### 3. 安装依赖并启动

```bash
pnpm install
pnpm dev
```

浏览器打开 **http://localhost:3000/studio**，即可使用嵌入的 Sanity Studio。  
若侧栏能看到「首页、专利、站点设置、产品分类、产品、案例、视频、询盘」，说明本仓库的 schema 已与「原来的 Sanity」结构对齐。

---

### 4. 可选：部署 Studio 到 Sanity 托管

若希望用独立 Studio 地址（如 `https://xxx.sanity.studio`）编辑内容：

```bash
npx sanity@latest deploy
```

按提示选择或登录项目，完成后用该 URL 登录即可。

---

## 二、本仓库已做的「参照原来 Sanity」的配置

- **Schema**：已按原侧栏增加/保留以下文档类型，并在 `sanity/schema` 中定义：
  - 首页（homepage）
  - 专利（patent）
  - 站点设置（siteSettings）
  - 产品分类（productCategory）
  - 产品（product）
  - 案例（case）
  - 视频（video）
  - 询盘（inquiry）
- **侧栏顺序**：在 `sanity.config.ts` 中通过 `structure` 将上述类型按「首页 → 专利 → 站点设置 → 产品分类 → 产品 → 案例 → 视频 → 询盘」排列，与原名一致。

你只需完成「一、你需要做的步骤」中的创建 Project/Dataset 和配置 `.env.local`，即可开始使用。

---

## 三、内容与图片

- **内容**：新 Dataset 为空，需在 Studio 中新建各类型文档（如先建「首页设置」「站点设置」等）。
- **图片**：可参考 [SANITY_MIGRATION.md](./SANITY_MIGRATION.md) 的「图片策略」：先把 `public/images/` 中的图上传到 Sanity Assets，再在对应文档中引用。

完成以上步骤后，你就拥有了一个新建的 Sanity Project/Dataset，且内容结构参照了原来的 Sanity。
