'use server'

import { createClient } from '@supabase/supabase-js'
import {
  createSupabaseCaptchaContextFromEnv,
  verifyCaptchaSubmission,
} from '@/lib/inquiry-captcha'

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
  const captchaToken = String(formData.get('captchaToken') || '')
  const captchaAnswer = String(formData.get('captchaAnswer') || '')
  const captchaScope = String(formData.get('captchaScope') || '')

  if (!name || !email || !message) {
    return { ok: false, message: '请填写必填项：联系人、邮箱、留言内容。' }
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID?.trim()
  if (!url || !key || !tenantId) {
    console.error('[Inquiry] Supabase public configuration is incomplete.')
    return { ok: false, message: '提交功能未配置，请稍后再试或直接通过邮件/WhatsApp 联系我们。' }
  }

  const captchaSecret = process.env.CAPTCHA_SECRET?.trim()
  if (!captchaSecret) return { ok: false, message: 'Verification service is unavailable. Please try again later.' }
  let captchaResult
  try {
    const { tenantId, siteScope, store } = createSupabaseCaptchaContextFromEnv()
    captchaResult = await verifyCaptchaSubmission({
      secret: captchaSecret,
      tenantId,
      siteScope,
      store,
      scope: captchaScope,
      token: captchaToken,
      answer: captchaAnswer,
    })
  } catch {
    return { ok: false, message: 'Verification service is unavailable. Please try again later.' }
  }
  if (!captchaResult.ok) {
    return {
      ok: false,
      message: captchaResult.code === 'expired'
        ? 'The verification code has expired. Please enter the new code.'
        : 'The verification code is incorrect. Please try again.',
    }
  }

  try {
    const client = createClient(url, key, { auth: { persistSession: false } })
    const details = [message, productType && `Product: ${productType}`, quantity && `Quantity: ${quantity}`].filter(Boolean).join('\n')
    const { error } = await client.from('inquiries').insert({
      tenant_id: tenantId,
      name,
      email,
      company: company || null,
      phone: phone || null,
      subject: inquiryType || 'Website inquiry',
      message: details,
      status: 'unread',
    })
    if (error) throw error
    return { ok: true, message: 'Thank you for your inquiry! We will respond within 24 hours.' }
  } catch (e) {
    console.error('[Inquiry] Failed to save inquiry:', e)
    return { ok: false, message: '提交失败，请稍后再试或直接通过邮件/WhatsApp 联系我们。' }
  }
}
