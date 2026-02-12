import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schema'
import { dataset, projectId } from './sanity/env'

export default defineConfig({
  name: 'tahui',
  title: 'Tahui 官网',
  basePath: '/studio', // 与 App Router 中 Studio 路由一致，避免出现 "Tool not found: studio"
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .id('content')
          .title('内容')
          .items([
            S.listItem()
              .id('homepage')
              .title('首页')
              .child(S.document().schemaType('homepage').documentId('homepage')),
            S.listItem().id('patent').title('专利').child(S.documentTypeList('patent')),
            S.listItem().id('siteSettings').title('站点设置').child(S.documentTypeList('siteSettings')),
            S.listItem().id('productCategory').title('产品分类').child(S.documentTypeList('productCategory')),
            S.listItem().id('product').title('产品').child(S.documentTypeList('product')),
            S.listItem().id('case').title('案例').child(S.documentTypeList('case')),
            S.listItem().id('video').title('视频').child(S.documentTypeList('video')),
            S.listItem().id('inquiry').title('询盘').child(S.documentTypeList('inquiry')),
            S.divider(),
            S.listItem().id('factoryStep').title('工厂步骤').child(S.documentTypeList('factoryStep')),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
})
