/**
 * 产品名称/描述自动翻译到中文、法文。
 * 支持两种引擎（二选一即可，无需信用卡）：
 *
 * 1) MyMemory（推荐，无需信用卡）
 *    - 配置 MYMEMORY_EMAIL=你的邮箱
 *    - 免费约 5 万字符/天，仅需在请求里带邮箱，无需注册
 *
 * 2) DeepL
 *    - 配置 DEEPL_AUTH_KEY=你的密钥
 *    - 免费版约 50 万字符/月，需在 DeepL 注册
 */

const DEEPL_FREE_API = "https://api-free.deepl.com/v2/translate"
const DEEPL_PRO_API = "https://api.deepl.com/v2/translate"
const MYMEMORY_API = "https://api.mymemory.translated.net/get"

export type TargetLang = "zh" | "fr"

const DEEPL_TARGET: Record<TargetLang, string> = { zh: "ZH", fr: "FR" }
const MYMEMORY_LANGPAIR: Record<TargetLang, string> = { zh: "en|zh", fr: "en|fr" }

/** MyMemory 单次请求最多 500 字节，长文本按段翻译再拼接 */
const MYMEMORY_CHUNK_CHARS = 400

async function translateWithDeepL(text: string, targetLang: TargetLang): Promise<string> {
  const key = process.env.DEEPL_AUTH_KEY?.trim()
  if (!key) throw new Error("DEEPL_AUTH_KEY not set")

  const isFree = key.endsWith(":fx")
  const url = isFree ? DEEPL_FREE_API : DEEPL_PRO_API
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `DeepL-Auth-Key ${key}` },
    body: JSON.stringify({
      text: [text],
      target_lang: DEEPL_TARGET[targetLang],
    }),
  })
  if (!res.ok) throw new Error(`DeepL API error ${res.status}: ${await res.text()}`)
  const data = (await res.json()) as { translations?: Array<{ text?: string }> }
  const out = data.translations?.[0]?.text
  return typeof out === "string" ? out : text
}

async function translateWithMyMemory(text: string, targetLang: TargetLang): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL?.trim()
  const langpair = MYMEMORY_LANGPAIR[targetLang]
  const chunks: string[] = []
  let offset = 0
  const str = text
  while (offset < str.length) {
    const chunk = str.slice(offset, offset + MYMEMORY_CHUNK_CHARS)
    offset += MYMEMORY_CHUNK_CHARS
    const params = new URLSearchParams({ q: chunk, langpair })
    if (email) params.set("de", email)
    const res = await fetch(`${MYMEMORY_API}?${params.toString()}`)
    if (!res.ok) throw new Error(`MyMemory API error ${res.status}: ${await res.text()}`)
    const data = (await res.json()) as { responseData?: { translatedText?: string } }
    const translated = data.responseData?.translatedText ?? chunk
    chunks.push(translated)
  }
  return chunks.join("")
}

export async function translateText(
  text: string,
  targetLang: TargetLang
): Promise<string> {
  const trimmed = text?.trim()
  if (!trimmed) return ""

  if (process.env.DEEPL_AUTH_KEY?.trim()) {
    return translateWithDeepL(trimmed, targetLang)
  }
  if (process.env.MYMEMORY_EMAIL?.trim()) {
    return translateWithMyMemory(trimmed, targetLang)
  }
  console.warn("[translate] 未配置 DEEPL_AUTH_KEY 或 MYMEMORY_EMAIL，返回原文")
  return trimmed
}

export async function translateProductFields(
  name: string,
  description: string | null | undefined
): Promise<{ nameZh: string; nameFr: string; descriptionZh: string | null; descriptionFr: string | null }> {
  const [nameZh, nameFr, descriptionZh, descriptionFr] = await Promise.all([
    name?.trim() ? translateText(name, "zh") : Promise.resolve(""),
    name?.trim() ? translateText(name, "fr") : Promise.resolve(""),
    description?.trim() ? translateText(description, "zh") : Promise.resolve(null),
    description?.trim() ? translateText(description, "fr") : Promise.resolve(null),
  ])
  return {
    nameZh: nameZh || "",
    nameFr: nameFr || "",
    descriptionZh: descriptionZh || null,
    descriptionFr: descriptionFr || null,
  }
}
