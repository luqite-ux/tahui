import { defineType, defineField } from 'sanity'

/** 专利 (Patent) */
export const patent = defineType({
  name: 'patent',
  title: '专利',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '专利名称',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'number',
      title: '专利号',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: '摘要 / 说明',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: '图片',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      description: '数字越小越靠前',
    }),
  ],
})
