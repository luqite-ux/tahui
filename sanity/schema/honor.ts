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
      description: '证书名称（勿填 UUID，否则会显示异常）如：绿色低碳信用评价AAA级企业',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'titleEn',
      title: '英文名称',
      type: 'string',
      description: '用于英文站点展示，请务必填写（如仅填中文名会显示中文）',
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
          { title: '社会责任 (BSCI 等)', value: 'bsci' },
          { title: '专利证书', value: 'patent' },
          { title: '荣誉资质', value: 'honor' },
          { title: '绿色低碳信用', value: 'green' },
          { title: '其他', value: 'other' },
        ],
        layout: 'radio',
      },
      initialValue: 'other',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'orientation',
      title: '图片方向',
      type: 'string',
      options: {
        list: [
          { title: '竖版 (3:4)', value: 'portrait' },
          { title: '高竖版 (2:3)', value: 'tall' },
          { title: '横版 (4:3)', value: 'landscape' },
          { title: '方形', value: 'square' },
        ],
        layout: 'radio',
      },
      initialValue: 'portrait',
      description: '根据证书实际方向选择，横版证书选横版可完整显示',
      hidden: ({ document }) => !document?.image,
    }),
    defineField({
      name: 'image',
      title: '证书图片',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
      description: '证书展示图（建议完整扫描）。PDF 项请务必上传预览图，否则仅显示下载图标',
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
        green: '绿色低碳',
        other: '其他',
      }
      const suffix = category ? ` (${catLabels[category] ?? category})` : ''
      return { title: title ? `${title}${suffix}` : '未命名', media }
    },
  },
})
