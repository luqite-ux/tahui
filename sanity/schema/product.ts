import { defineType, defineField, defineArrayMember } from 'sanity'

/** 产品（单个产品文档，可与产品分类关联） */
export const product = defineType({
  name: 'product',
  title: '产品',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '产品名称（英文）',
      type: 'string',
      description: '默认显示名称，也用于生成 URL',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'nameZh',
      title: '产品名称（中文）',
      type: 'string',
      description: '留空则显示英文名称',
    }),
    defineField({
      name: 'nameFr',
      title: '产品名称（法文）',
      type: 'string',
      description: '留空则显示英文名称',
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
      title: '描述（英文）',
      type: 'text',
    }),
    defineField({
      name: 'descriptionZh',
      title: '描述（中文）',
      type: 'text',
      description: '留空则显示英文描述',
    }),
    defineField({
      name: 'descriptionFr',
      title: '描述（法文）',
      type: 'text',
      description: '留空则显示英文描述',
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
