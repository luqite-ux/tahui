# 推送到 GitHub 指南

项目已配置好 `.gitignore`（不会提交 `.env.local` 等敏感文件），并已完成 `git init`。

若你遇到「Another git process seems to be running」或 `index.lock` 被占用，请先**关闭所有 Cursor/VS Code 里的终端**，再在**新的 PowerShell 或 CMD** 中执行下面步骤。

---

## 1. 在 GitHub 上创建新仓库

1. 打开 https://github.com/new
2. 填写 **Repository name**（例如：`tahui` 或 `tahui-website`）
3. 选择 **Private** 或 **Public**
4. **不要**勾选 "Add a README"、"Add .gitignore"、"Choose a license"（本地已有）
5. 点击 **Create repository**

---

## 2. 在本地完成提交并推送

在项目根目录 `e:\huanqiuweb\tahui` 打开终端，依次执行：

```powershell
# 进入项目目录
cd e:\huanqiuweb\tahui

# 若提示 index.lock 被占用，先删除锁文件（关闭所有终端后再试）
# Remove-Item .git\index.lock -Force -ErrorAction SilentlyContinue

# 添加所有文件（.env.local 已被 .gitignore 排除）
git add -A

# 首次提交
git commit -m "Initial commit: Next.js + Sanity 网站与后台"

# 添加 GitHub 远程（把 YOUR_USERNAME 和 YOUR_REPO 换成你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# 推送到 main 分支（若 GitHub 显示的是 master，可改为 git push -u origin master）
git branch -M main
git push -u origin main
```

---

## 3. Vercel 与 GitHub 联动（可选）

网站已在 Vercel 部署时，可以改为从 GitHub 部署，便于后续自动发布：

1. 登录 https://vercel.com
2. 进入对应项目 → **Settings** → **Git**
3. 若当前是「从本地上传」或 v0 导入，可**断开**当前连接
4. 选择 **Connect Git Repository** → 选 **GitHub** → 授权并选择刚创建的仓库
5. 在 Vercel 的 **Environment Variables** 中配置与本地 `.env.local` 相同的变量：
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_WRITE_TOKEN`（若后台需要写 Sanity）

之后每次 `git push` 到该仓库，Vercel 会自动构建并部署。

---

## 4. 敏感信息提醒

- `.env.local` 已加入 `.gitignore`，**不会被提交**。
- 若曾误提交过密钥，请到 GitHub 仓库 **Settings → Secrets and variables → Actions** 检查，并在 Sanity 后台**重新生成 Token**，再在 Vercel 环境变量里更新。
