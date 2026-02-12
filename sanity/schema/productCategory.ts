import { defineType, defineField, defineArrayMember } from 'sanity'

/** 产品子类（如 Seamless Sweaters、Cardigans） */
export const productSubCategory = defineType({
  name: 'productSubCategory',
  title: '产品子类',
  type: 'object',
  fields: [
    defineField({ name: 'name', type: 'string', title: '名称' }),
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

/** 产品大类（Seamless / Multi-Material / Craftsmanship） */
export const productCategory = defineType({
  name: 'productCategory',
  title: '产品分类',
  type: 'document',
  fields: [
    defineField({ name: 'id', type: 'string', title: 'ID（用于锚点）', description: '如 seamless, multi-material, craftsmanship' }),
    defineField({ name: 'number', type: 'string', title: '序号', description: '如 01, 02, 03' }),
    defineField({ name: 'title', type: 'string', title: '标题' }),
    defineField({ name: 'description', type: 'text', title: '描述' }),
    defineField({
      name: 'image',
      title: '分类主图',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
    }),
    defineField({
      name: 'items',
      title: '子品类',
      type: 'array',
      of: [defineArrayMember({ type: 'productSubCategory' })],
    }),
  ],
})
