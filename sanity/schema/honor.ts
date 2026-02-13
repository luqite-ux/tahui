import { defineType, defineField } from 'sanity'

/** 资质与荣誉 (Honors & Qualifications) - 证书、资质、奖项等 */
export const honor = defineType({
  name: 'honor',
  title: '资质与荣誉',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '名称',
      type: 'string',
      description: '证书/资质名称，如 ISO 9001、高新技术企业认定',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'titleEn',
      title: '英文名称',
      type: 'string',
      description: '可选，用于英文站点',
    }),
    defineField({
      name: 'description',
      title: '简介',
      type: 'text',
      description: '简短说明，可选',
    }),
    defineField({
      name: 'category',
      title: '分类',
      type: 'string',
      options: {
        list: [
          { title: 'ISO 认证', value: 'iso' },
          { title: '社会责认证 (BSCI 等)', value: 'bsci' },
          { title: '专利证书', value: 'patent' },
          { title: '荣誉资质', value: 'honor' },
          { title: '其他', value: 'other' },
        ],
        layout: 'radio',
      },
      initialValue: 'other',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'image',
      title: '证书图片',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
      description: '证书/荣誉的展示图，建议上传清晰扫描件',
    }),
    defineField({
      name: 'pdfFile',
      title: 'PDF 文件',
      type: 'file',
      options: {
        accept: '.pdf',
        storeOriginalFilename: true,
      },
      description: '可选，如有 PDF 版证书可上传供下载',
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      description: '数字越小越靠前显示',
      initialValue: 0,
    }),
  ],
  orderings: [
    { title: '按排序值', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
    { title: '按名称', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: '按分类', name: 'categoryAsc', by: [{ field: 'category', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title', category: 'category', media: 'image' },
    prepare({ title, category, media }) {
      const catLabels: Record<string, string> = {
        iso: 'ISO',
        bsci: 'BSCI',
        patent: '专利',
        honor: '荣誉',
        other: '其他',
      }
      const suffix = category ? ` (${catLabels[category] ?? category})` : ''
      return { title: title ? `${title}${suffix}` : '未命名', media }
    },
  },
})
