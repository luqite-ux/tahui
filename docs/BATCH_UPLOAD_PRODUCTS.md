# 批量上传产品到 Sanity

通过本地 JSON 文件批量创建「产品」文档，适合一次性导入多条产品或从 Excel/表格整理后导入。

## 前置条件

1. 已在 Sanity 中创建好**产品分类**（如运行过 `populate-sanity-initial.mjs` 会创建 `seamless`、`multi-material`、`craftsmanship`）。
2. `.env.local` 中已配置：
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`（默认 `production`）
   - `SANITY_API_WRITE_TOKEN`（在 Sanity 项目 API → Tokens 创建，权限选 Editor）

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

## 从 Excel/表格整理 JSON

1. 在 Excel 中列好：产品名称、slug（可选）、分类 id、描述、图片文件名、排序。
2. 另存为 CSV 或导出为 JSON 数组（可用在线工具 CSV to JSON）。
3. 确保 JSON 根节点是数组，且字段名与上表一致（如 `name`、`category`、`images`）。
4. 将文件保存为 `scripts/your-file.json` 后执行上述命令。

## 注意事项

- **分类 id** 必须与 Sanity 里已有 productCategory 的 `id` 字段一致，否则该产品不会关联分类。
- 同一脚本可多次运行：每次都会**新增**产品，不会根据 name/slug 去重。若需避免重复，请先在 Studio 中检查或清理后再导入。
- 图片会从 `public/images/` 上传到 Sanity Assets，请勿放过大文件，以免上传超时。
