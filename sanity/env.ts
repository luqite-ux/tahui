/**
 * Sanity 项目配置，可从环境变量读取（便于复用旧项目或新建项目）
 * 新建项目时在 .env.local 中设置 NEXT_PUBLIC_SANITY_PROJECT_ID 和 NEXT_PUBLIC_SANITY_DATASET
 * 服务端写入（如询盘提交）需配置 SANITY_API_WRITE_TOKEN，仅服务端使用，不要加 NEXT_PUBLIC_
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''

/** 服务端写入用 Token，在 Sanity 项目 API → Tokens 创建，权限选 Editor；仅服务端读取 */
export const writeToken = process.env.SANITY_API_WRITE_TOKEN || ''

if (!projectId && typeof window === 'undefined') {
  console.warn('[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Set it in .env.local to use Sanity.')
}
