import { defineArrayMember, defineField, defineType } from 'sanity'

/** 博客文章（支持英文为主，中文/法文可翻译字段） */
export const blogPost = defineType({
  name: 'blogPost',
  title: '博客',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '标题（英文）',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'titleZh',
      title: '标题（中文）',
      type: 'string',
      description: '留空则显示英文标题',
    }),
    defineField({
      name: 'titleFr',
      title: '标题（法文）',
      type: 'string',
      description: '留空则显示英文标题',
    }),
    defineField({
      name: 'slug',
      title: 'URL 别名',
      type: 'slug',
      options: { source: 'title' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'excerpt',
      title: '摘要（英文）',
      type: 'text',
      rows: 3,
      description: '用于列表页与 SEO 描述（建议 80-160 字符）',
    }),
    defineField({
      name: 'excerptZh',
      title: '摘要（中文）',
      type: 'text',
      rows: 3,
      description: '留空则显示英文摘要',
    }),
    defineField({
      name: 'excerptFr',
      title: '摘要（法文）',
      type: 'text',
      rows: 3,
      description: '留空则显示英文摘要',
    }),
    defineField({
      name: 'coverImage',
      title: '封面图',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
    }),
    defineField({
      name: 'publishedAt',
      title: '发布时间',
      type: 'datetime',
      description: '用于排序与是否展示（未来时间视为未发布）',
    }),
    defineField({
      name: 'body',
      title: '正文（英文）',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
    defineField({
      name: 'bodyZh',
      title: '正文（中文）',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: '留空则显示英文正文（正文建议在 Studio 中人工翻译维护）',
    }),
    defineField({
      name: 'bodyFr',
      title: '正文（法文）',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description: '留空则显示英文正文（正文建议在 Studio 中人工翻译维护）',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      publishedAt: 'publishedAt',
    },
    prepare: ({ title, media, publishedAt }: { title?: string; media?: unknown; publishedAt?: string }) => ({
      title: title || '未命名博客',
      subtitle: publishedAt ? `发布：${new Date(publishedAt).toLocaleDateString()}` : '未设置发布时间',
      media,
    }),
  },
})

