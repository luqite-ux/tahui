import { defineType, defineField } from 'sanity'

/** 案例 */
export const caseDocument = defineType({
  name: 'case',
  title: '案例',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '案例标题',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL 别名',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'summary',
      title: '简介',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: '主图',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
    }),
    defineField({
      name: 'body',
      title: '正文',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      description: '数字越小越靠前',
    }),
  ],
})
