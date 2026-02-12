import { defineType, defineField } from 'sanity'

/** 询盘（可仅作后台记录，或对接表单提交） */
export const inquiry = defineType({
  name: 'inquiry',
  title: '询盘',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '联系人',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: '邮箱',
      type: 'string',
      validation: (r) => r.email(),
    }),
    defineField({
      name: 'company',
      title: '公司',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: '电话 / WhatsApp',
      type: 'string',
    }),
    defineField({
      name: 'inquiryType',
      title: '询盘类型',
      type: 'string',
      options: {
        list: [
          { title: 'OEM Production Inquiry', value: 'OEM Production Inquiry' },
          { title: 'ODM Development Inquiry', value: 'ODM Development Inquiry' },
          { title: 'Sample Request', value: 'Sample Request' },
          { title: 'Factory Visit Request', value: 'Factory Visit Request' },
          { title: 'General Inquiry', value: 'General Inquiry' },
        ],
      },
    }),
    defineField({
      name: 'productType',
      title: '产品品类',
      type: 'string',
      options: {
        list: [
          { title: 'Sweaters & Pullovers', value: 'Sweaters & Pullovers' },
          { title: 'Cardigans', value: 'Cardigans' },
          { title: 'Hoodies & Sweatshirts', value: 'Hoodies & Sweatshirts' },
          { title: 'Dresses & Skirts', value: 'Dresses & Skirts' },
          { title: 'Scarves & Accessories', value: 'Scarves & Accessories' },
          { title: 'Other Knitwear', value: 'Other Knitwear' },
        ],
      },
    }),
    defineField({
      name: 'quantity',
      title: '预估数量',
      type: 'string',
      description: '如 500-1000 pieces per style',
    }),
    defineField({
      name: 'message',
      title: '留言内容',
      type: 'text',
    }),
    defineField({
      name: 'status',
      title: '状态',
      type: 'string',
      options: {
        list: [
          { title: '待处理', value: 'pending' },
          { title: '已回复', value: 'replied' },
          { title: '已关闭', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'receivedAt',
      title: '收到时间',
      type: 'datetime',
      readOnly: true,
    }),
  ],
})
