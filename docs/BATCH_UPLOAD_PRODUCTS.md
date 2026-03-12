# 批量上传产品到 Sanity

通过本地 JSON 文件批量创建「产品」文档，适合一次性导入多条产品或从 Excel/表格整理后导入。

## 前置条件

1. 已在 Sanity 中创建好**产品分类**（如运行过 `populate-sanity-initial.mjs` 会创建 `seamless`、`multi-material`、`craftsmanship`）。
2. `.env.local` 中已配置：
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`（默认 `production`）
   - `SANITY_API_WRITE_TOKEN`（在 Sanity 项目 API → Tokens 创建，权限选 Editor）
3. （可选）若希望“自动翻译”产品名称/描述（中文、法文），二选一即可：
   - **MyMemory（推荐，无需信用卡）**：`MYMEMORY_EMAIL=你的邮箱`，免费约 5 万字符/天
   - **DeepL**：`DEEPL_AUTH_KEY=你的密钥`，免费版约 50 万字符/月（部分地区需信用卡）
   - 另可设置：`SANITY_WEBHOOK_SECRET`、`TRANSLATE_API_SECRET`（自己设一段随机字符串）

## 使用步骤

### 1. 准备 JSON 文件

在项目根目录下执行时，默认读取 `scripts/products-to-import.json`。也可指定其他路径。

每条产品支持字段：

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` 或 `title` | 是 | 产品名称 |
| `slug` | 否 | URL 别名，不填则根据 name 自动生成 |
| `category` | 否 | 产品分类的 **id**（如 `seamless`、`multi-material`、`craftsmanship`），需与 Sanity 中 productCategory 的 id 一致 |
| `description` | 否 | 描述文案 |
| `nameZh` | 否 | 产品名称（中文），不填则前台回退显示英文 name |
| `nameFr` | 否 | 产品名称（法文），不填则前台回退显示英文 name |
| `descriptionZh` | 否 | 描述（中文），不填则回退显示英文 description |
| `descriptionFr` | 否 | 描述（法文），不填则回退显示英文 description |
| `images` | 否 | 图片数组，见下 |
| `image` | 否 | 单张图片文件名（等同于 `images: [filename]`） |
| `order` | 否 | 排序数字，越小越靠前 |

**图片写法**：

- 只写文件名（相对于 `public/images/`）：`"images": ["product-sweaters.jpg"]`
- 或带 alt：`"images": [{"file": "product-sweaters.jpg", "alt": "Sweaters"}]`
- 图片需放在 `public/images/` 下，或使用绝对路径（不推荐提交到仓库）

示例见 `scripts/products-to-import.json`。

### 2. 执行脚本

在项目根目录执行：

```bash
node --env-file=.env.local scripts/batch-upload-products.mjs
```

指定其他 JSON 文件：

```bash
node --env-file=.env.local scripts/batch-upload-products.mjs path/to/your-products.json
```

若 Node 版本不支持 `--env-file`（&lt; 20），可先加载环境变量再执行，或使用 `dotenv`。

### 3. 在 Studio 中查看

脚本会直接创建**正式文档**（非 draft）。打开 Sanity Studio（如 `/studio`），在「产品」列表中刷新即可看到新数据。如需在前端展示，请确认产品页/列表的 GROQ 已查询 `product` 类型。

---

## 自动翻译（可选）

如果你不想手动填 `nameZh/nameFr/descriptionZh/descriptionFr`，可以启用自动翻译：

### A. 开启 Webhook（推荐：新增/编辑产品自动翻译）

1. 在 `.env.local` 设置（翻译引擎二选一，无需信用卡可用 MyMemory）：

```env
# 二选一：MyMemory 仅需邮箱，DeepL 需申请 Key
MYMEMORY_EMAIL=你的邮箱
# 或 DEEPL_AUTH_KEY=你的deepl_key

SANITY_WEBHOOK_SECRET=自己设置一段随机字符串
```

2. 在 Sanity 管理后台 → API → Webhooks 新建 Webhook：

- URL：`https://你的域名/api/webhooks/sanity-translate`
- Trigger：Document (create, update)
- Filter：`_type == "product"`
- Secret：填写与 `SANITY_WEBHOOK_SECRET` 相同的值

这样以后每次保存产品，都会自动把英文 `name/description` 翻译写回到 `nameZh/nameFr/descriptionZh/descriptionFr`。

### B. 一次性批量翻译（已有产品）

1. 在 `.env.local` 设置翻译引擎（二选一）+ 可选密钥：

```env
MYMEMORY_EMAIL=你的邮箱
# 或 DEEPL_AUTH_KEY=你的deepl_key

TRANSLATE_API_SECRET=自己设置一段随机字符串
```

2. **站点在 Vercel 时**（推荐，本机不直连 Sanity，避免超时）：
   - 在 Vercel 项目 → Settings → Environment Variables 里配置：
     - `MYMEMORY_EMAIL`（你的邮箱）
     - `SANITY_API_WRITE_TOKEN`、`NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`
     - `TRANSLATE_API_SECRET`（自己设一段随机字符串，用于保护接口）
   - 重新部署后，在**本地**执行（只请求你的站点，翻译在 Vercel 执行）：
     ```bash
     SITE_URL=https://你的域名 npm run translate-products
     ```
     若设置了 `TRANSLATE_API_SECRET`，需在本地 `.env.local` 里写同一值，脚本会带在请求头里。

3. **本地开发**时：先 `npm run dev`，再执行 `npm run translate-products`（需本机能访问 Sanity）。

## 从 Excel/表格整理 JSON

1. 在 Excel 中列好：产品名称、slug（可选）、分类 id、描述、图片文件名、排序。
2. 另存为 CSV 或导出为 JSON 数组（可用在线工具 CSV to JSON）。
3. 确保 JSON 根节点是数组，且字段名与上表一致（如 `name`、`category`、`images`）。
4. 将文件保存为 `scripts/your-file.json` 后执行上述命令。

## 注意事项

- **分类 id** 必须与 Sanity 里已有 productCategory 的 `id` 字段一致，否则该产品不会关联分类。
- 同一脚本可多次运行：每次都会**新增**产品，不会根据 name/slug 去重。若需避免重复，请先在 Studio 中检查或清理后再导入。
- 图片会从 `public/images/` 上传到 Sanity Assets，请勿放过大文件，以免上传超时。
