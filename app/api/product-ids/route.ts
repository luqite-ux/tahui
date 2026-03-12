import { NextResponse } from "next/server"
import { client } from "@/sanity/lib/client"

/**
 * 返回所有产品文档的 _id，供批量翻译脚本使用（脚本只请求站点，不直连 Sanity）。
 * 若配置了 TRANSLATE_API_SECRET，需在请求头带 Authorization: Bearer <secret>。
 */
export async function GET(request: Request) {
  try {
    const secret = process.env.TRANSLATE_API_SECRET
    if (secret) {
      const received = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
      if (received !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const result = await client.fetch<{ _id: string }[]>(
      '*[_type == "product"]._id'
    )
    const ids = result.filter(Boolean)
    return NextResponse.json({ ids })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
