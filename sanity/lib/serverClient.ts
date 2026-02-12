import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, writeToken } from '@/sanity/env'

/**
 * 带 Token 的 Sanity 客户端，仅用于服务端（Server Action、API Route 等）写入。
 * 不要在前端或 getServerSideProps 之外暴露此 client 或 writeToken。
 */
export function getServerClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: writeToken || undefined,
  })
}
