import { NextResponse } from "next/server"
import { getServerClient } from "@/sanity/lib/serverClient"
import { translateProductFields } from "@/lib/translate"
import { writeToken } from "@/sanity/env"

/**
 * Sanity 文档 Webhook：当产品被创建或更新时，自动翻译 name/description 到中文、法文并写回。
 * 在 Sanity 后台 → API → Webhooks 添加：
 * - URL: https://你的域名/api/webhooks/sanity-translate
 * - Trigger: Document (create, update)
 * - Filter: _type == "product"
 * - 可选：Projection 留空即可（我们会按 _id 再拉一次完整文档）
 * - Secret: 与 .env.local 中 SANITY_WEBHOOK_SECRET 一致，用于校验
 */
export async function POST(request: Request) {
  try {
    const secret = process.env.SANITY_WEBHOOK_SECRET
    if (secret) {
      const received = request.headers.get("sanity-webhook-secret") ?? request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
      if (received !== secret) {
        return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 })
      }
    }

    if (!writeToken) {
      return NextResponse.json(
        { error: "SANITY_API_WRITE_TOKEN not configured" },
        { status: 500 }
      )
    }

    const body = (await request.json().catch(() => ({}))) as { _id?: string; _type?: string }
    const id = body._id
    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Missing _id in body" }, { status: 400 })
    }
    if (body._type && body._type !== "product") {
      return NextResponse.json({ ok: true, skipped: "not a product" })
    }

    const client = getServerClient()
    const doc = await client.getDocument(id)
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }
    if ((doc as { _type?: string })._type !== "product") {
      return NextResponse.json({ ok: true, skipped: "not a product" })
    }

    const name = (doc as { name?: string }).name
    const description = (doc as { description?: string | null }).description
    if (!name?.trim()) {
      return NextResponse.json({ ok: true, skipped: "no name to translate" })
    }

    const { nameZh, nameFr, descriptionZh, descriptionFr } =
      await translateProductFields(name, description ?? undefined)

    await client
      .patch(id)
      .set({
        nameZh: nameZh || undefined,
        nameFr: nameFr || undefined,
        descriptionZh: descriptionZh ?? undefined,
        descriptionFr: descriptionFr ?? undefined,
      })
      .commit()

    return NextResponse.json({ ok: true, id })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
