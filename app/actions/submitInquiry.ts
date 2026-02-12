'use server'

import { getServerClient } from '@/sanity/lib/serverClient'
import { writeToken } from '@/sanity/env'

export type SubmitInquiryState = { ok: boolean; message: string }

export async function submitInquiry(_prev: SubmitInquiryState, formData: FormData): Promise<SubmitInquiryState> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim()
  const company = (formData.get('company') as string)?.trim()
  const phone = (formData.get('phone') as string)?.trim()
  const inquiryType = (formData.get('inquiryType') as string)?.trim()
  const productType = (formData.get('productType') as string)?.trim()
  const quantity = (formData.get('quantity') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()

  if (!name || !email || !message) {
    return { ok: false, message: '请填写必填项：联系人、邮箱、留言内容。' }
  }

  if (!writeToken) {
    console.error('[Sanity] SANITY_API_WRITE_TOKEN is not set. Inquiry not saved.')
    return { ok: false, message: '提交功能未配置，请稍后再试或直接通过邮件/WhatsApp 联系我们。' }
  }

  const client = getServerClient()

  try {
    await client.create({
      _type: 'inquiry',
      name,
      email,
      company: company || undefined,
      phone: phone || undefined,
      inquiryType: inquiryType || undefined,
      productType: productType || undefined,
      quantity: quantity || undefined,
      message,
      status: 'pending',
      receivedAt: new Date().toISOString(),
    })
    return { ok: true, message: 'Thank you for your inquiry! We will respond within 24 hours.' }
  } catch (e) {
    console.error('[Sanity] Failed to create inquiry:', e)
    return { ok: false, message: '提交失败，请稍后再试或直接通过邮件/WhatsApp 联系我们。' }
  }
}
