"use client"

import React, { useActionState, useEffect, useState } from "react"
import { Send } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitInquiry } from "@/app/actions/submitInquiry"
import { InquiryCaptchaField } from "@/components/inquiry-captcha-field"

const productTypeKeys = ["sweaters", "cardigans", "hoodies", "dresses", "scarves", "other"] as const
const inquiryTypeKeys = ["oem", "odm", "sample", "visit", "general"] as const

export function ContactForm() {
  const t = useTranslations("contact")
  const locale = useLocale()
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0)
  const [formData, setFormData] = useState({
    company: "",
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    productType: "",
    quantity: "",
    message: "",
  })

  const [state, formAction] = useActionState(submitInquiry, { ok: false, message: "" })
  useEffect(() => {
    if (state.message) setCaptchaRefreshKey((value) => value + 1)
  }, [state])
  const showMessage = state.message && (state.ok || !state.ok)
  const isSuccess = state.ok

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-semibold text-accent tracking-wider uppercase mb-3">{t("formTag")}</p>
        <h2 className="text-2xl font-bold text-foreground lg:text-3xl">{t("formTitle")}</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">{t("formSubtitle")}</p>
      </div>

      <form action={formAction} className="space-y-6">
        {showMessage && (
          <div
            className={`rounded-lg border p-4 ${
              isSuccess
                ? "border-green-500/50 bg-green-500/10 text-green-800 dark:text-green-200"
                : "border-destructive/50 bg-destructive/10 text-destructive"
            }`}
          >
            {state.message}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company">{t("companyName")} *</Label>
            <Input
              id="company"
              name="company"
              required
              placeholder={t("placeholderCompany")}
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="border-border/60 focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">{t("contactName")} *</Label>
            <Input
              id="name"
              name="name"
              required
              placeholder={t("placeholderName")}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-border/60 focus:border-accent"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailAddress")} *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder={t("placeholderEmail")}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-border/60 focus:border-accent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{t("phoneWhatsApp")}</Label>
            <Input
              id="phone"
              name="phone"
              placeholder={t("placeholderPhone")}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border-border/60 focus:border-accent"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>{t("inquiryType")} *</Label>
            <Select required value={formData.inquiryType} onValueChange={(value) => setFormData({ ...formData, inquiryType: value })}>
              <SelectTrigger className="border-border/60">
                <SelectValue placeholder={t("placeholderInquiryType")} />
              </SelectTrigger>
              <SelectContent>
                {inquiryTypeKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(`inquiryTypes.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="inquiryType" value={formData.inquiryType} />
          </div>

          <div className="space-y-2">
            <Label>{t("productCategory")}</Label>
            <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value })}>
              <SelectTrigger className="border-border/60">
                <SelectValue placeholder={t("placeholderProductType")} />
              </SelectTrigger>
              <SelectContent>
                {productTypeKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {t(`productTypes.${key}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" name="productType" value={formData.productType} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">{t("estimatedQuantity")}</Label>
          <Input
            id="quantity"
            name="quantity"
            placeholder={t("placeholderQuantity")}
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="border-border/60 focus:border-accent"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">{t("messageDetails")} *</Label>
          <Textarea
            id="message"
            name="message"
            required
            rows={5}
            placeholder={t("placeholderMessage")}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="border-border/60 focus:border-accent"
          />
        </div>

        <InquiryCaptchaField
          refreshKey={captchaRefreshKey}
          language={locale === "zh" ? "zh" : "en"}
          tokenName="captchaToken"
          answerName="captchaAnswer"
          scopeName="captchaScope"
        />

        <Button type="submit" size="lg" className="w-full sm:w-auto bg-primary hover:bg-accent transition-all duration-300 hover:shadow-lg">
          <Send className="mr-2 h-4 w-4" />
          {t("sendInquiry")}
        </Button>
      </form>
    </div>
  )
}

