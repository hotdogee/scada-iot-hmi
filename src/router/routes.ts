import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Index',
    redirect: { name: 'PlcCard' },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'card',
        name: 'PlcCard',
        component: () => import('pages/CardPage.vue')
      }
      // {
      //   path: 'chart',
      //   name: 'PlcChart',
      //   component: () => import('pages/ChartPage.vue')
      // },
      // {
      //   path: 'cam',
      //   name: 'PlcCam',
      //   component: () => import('pages/CamPage.vue')
      // }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
