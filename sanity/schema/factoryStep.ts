import { defineType, defineField } from 'sanity'

/** 首页/工厂步骤单条（图 + 标题 + 描述） */
export const factoryStep = defineType({
  name: 'factoryStep',
  title: '工厂步骤',
  type: 'document',
  fields: [
    defineField({ name: 'step', type: 'string', title: '步骤编号', description: '如 Step 1' }),
    defineField({ name: 'title', type: 'string', title: '标题' }),
    defineField({ name: 'description', type: 'text', title: '描述' }),
    defineField({
      name: 'image',
      title: '图片',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
    }),
  ],
})
