import Vue from 'vue'
import Router from 'vue-router'

import Header from '@/components/common/Header'
import Sidebar from '@/components/common/Sidebar'
import Tags from '@/components/common/Tags'
import Test from '@/components/Test'

Vue.use(Router)

export default new Router({
  routes: [
      {
        path: '/',
        redirect: '/test'
      },
      {
        path: '/',
        component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
        meta: { title: '自述文件' },
        children: [
          {
            path: '/test',
            component: () => import(/* webpackChunkName: "test" */ '../components/Test.vue'),
            meta: { title: '系统首页' }
          },{
            path: '/Type',
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/Type.vue'),
            meta: { title: '分类管理' }
          },{
            path: '/Brand',
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/Brand.vue'),
            meta: { title: '品牌管理' }
          },{
            path: '/Attr',
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/Attr.vue'),
            meta: { title: '属性管理' }
          },
          {
            path: '/Product',
            component: () => import(/* webpackChunkName: "dashboard" */ '../components/product/Product.vue'),
            meta: { title: '商品管理' }
          }
        ]
     }
  ]
})
