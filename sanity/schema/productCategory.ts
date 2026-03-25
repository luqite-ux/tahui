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
    defineField({
      name: 'id',
      type: 'string',
      title: 'ID（用于锚点/URL）',
      description: '建议仅使用小写字母、数字与短横线，如 seamless, multi-material, craftsmanship',
      validation: (r) =>
        r
          .required()
          .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
            name: 'slug-like',
            invert: false,
          })
          .error('ID 必须为 URL 安全格式（仅小写字母/数字/短横线），不要包含空格'),
    }),
    defineField({ name: 'number', type: 'string', title: '序号', description: '如 01, 02, 03' }),
    defineField({ name: 'order', type: 'number', title: '排序', description: '数字越小越靠前（用于前台展示顺序）' }),
    defineField({ name: 'title', type: 'string', title: '标题（英文）', description: '默认显示标题' }),
    defineField({ name: 'titleZh', type: 'string', title: '标题（中文）', description: '留空则显示英文标题' }),
    defineField({ name: 'titleFr', type: 'string', title: '标题（法文）', description: '留空则显示英文标题' }),
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
