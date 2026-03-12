import { NextResponse } from "next/server"
import { getServerClient } from "@/sanity/lib/serverClient"
import { translateProductFields } from "@/lib/translate"
import { projectId, dataset, writeToken } from "@/sanity/env"

/** 校验请求（可选：设置 TRANSLATE_API_SECRET 后需在 Header 或 body 中携带） */
function checkSecret(request: Request, body: Record<string, unknown>): boolean {
  const secret = process.env.TRANSLATE_API_SECRET
  if (!secret) return true
  const header = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  const bodySecret = body.secret as string | undefined
  return header === secret || bodySecret === secret
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Record<string, unknown>
    if (!checkSecret(request, body)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = body.id as string | undefined
    const ids = body.ids as string[] | undefined
    const idsToProcess = id ? [id] : Array.isArray(ids) ? ids : []

    if (idsToProcess.length === 0) {
      return NextResponse.json(
        { error: "Missing body: id (string) or ids (string[])" },
        { status: 400 }
      )
    }

    if (!writeToken) {
      return NextResponse.json(
        { error: "SANITY_API_WRITE_TOKEN not configured" },
        { status: 500 }
      )
    }

    const client = getServerClient()
    const results: { id: string; ok: boolean; error?: string }[] = []

    for (const docId of idsToProcess) {
      const cleanId = docId.startsWith("drafts.") ? docId : docId
      try {
        const doc = await client.getDocument(cleanId)
        if (!doc) {
          results.push({ id: cleanId, ok: false, error: "Document not found" })
          continue
        }
        if (doc._type !== "product") {
          results.push({ id: cleanId, ok: false, error: "Not a product document" })
          continue
        }

        const name = (doc as { name?: string }).name
        const description = (doc as { description?: string | null }).description
        if (!name?.trim()) {
          results.push({ id: cleanId, ok: false, error: "Product has no name" })
          continue
        }

        const { nameZh, nameFr, descriptionZh, descriptionFr } =
          await translateProductFields(name, description ?? undefined)

        await client.patch(cleanId).set({
          nameZh: nameZh || undefined,
          nameFr: nameFr || undefined,
          descriptionZh: descriptionZh ?? undefined,
          descriptionFr: descriptionFr ?? undefined,
        }).commit()

        results.push({ id: cleanId, ok: true })
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e)
        results.push({ id: cleanId, ok: false, error: message })
      }
    }

    return NextResponse.json({ projectId, dataset, results })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
