import { defineType, defineField } from 'sanity'

/** 站点设置（单例：站点级配置） */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: '站点设置',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '站点标题',
      type: 'string',
      description: '用于浏览器标题、SEO 等',
    }),
    defineField({
      name: 'description',
      title: '站点描述',
      type: 'text',
      description: '站点简介，用于 SEO',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
    }),
    defineField({
      name: 'footerText',
      title: '页脚文案',
      type: 'text',
    }),
  ],
})
