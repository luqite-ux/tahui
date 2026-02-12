import { defineType, defineField, defineArrayMember } from 'sanity'

/** 产品（单个产品文档，可与产品分类关联） */
export const product = defineType({
  name: 'product',
  title: '产品',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '产品名称',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL 别名',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: '所属分类',
      type: 'reference',
      to: [{ type: 'productCategory' }],
    }),
    defineField({
      name: 'description',
      title: '描述',
      type: 'text',
    }),
    defineField({
      name: 'images',
      title: '产品图',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', title: '替代文字' })],
        }),
      ],
    }),
    defineField({
      name: 'order',
      title: '排序',
      type: 'number',
      description: '数字越小越靠前',
    }),
  ],
})
