import { defineType, defineField } from 'sanity'

/** 视频 */
export const video = defineType({
  name: 'video',
  title: '视频',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: '视频标题',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'url',
      title: '视频链接',
      type: 'url',
      description: '如 YouTube、Vimeo 或直链',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'thumbnail',
      title: '封面图',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
    }),
    defineField({
      name: 'description',
      title: '描述',
      type: 'text',
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      description: '数字越小越靠前',
    }),
  ],
})
