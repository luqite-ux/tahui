import { defineType, defineField, defineArrayMember } from 'sanity'

/** 首页 Hero 轮播单张 */
export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero 轮播项',
  type: 'object',
  options: {
    preview: {
      select: { alt: 'alt', media: 'image' },
      prepare: ({ alt, media }: { alt?: string; media?: unknown }) => ({
        title: alt || '轮播图',
        media,
      }),
    },
  },
  fields: [
    defineField({
      name: 'image',
      title: '图片',
      type: 'image',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'alt',
      title: '替代文字',
      type: 'string',
      description: '用于无障碍与 SEO',
    }),
  ],
})

/** 首页设置（单例：首页内容与 Hero） */
export const homepage = defineType({
  name: 'homepage',
  title: '首页设置',
  type: 'document',
  options: {
    preview: {
      prepare: () => ({
        title: '首页设置',
        subtitle: '轮播图与统计数据',
      }),
    },
  },
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Hero 轮播图',
      type: 'array',
      of: [defineArrayMember({ type: 'heroSlide' })],
      description: '先上传现有 v0 图片，后续可在 Studio 中直接替换',
    }),
    defineField({
      name: 'stats',
      title: '首页统计数据',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          options: {
            preview: {
              select: { label: 'label', value: 'value' },
              prepare: ({ label, value }: { label?: string; value?: string }) => ({
                title: label || value || '统计项',
              }),
            },
          },
          fields: [
            defineField({ name: 'value', type: 'string', title: '数值' }),
            defineField({ name: 'label', type: 'string', title: '标签' }),
          ],
        }),
      ],
    }),
  ],
})
