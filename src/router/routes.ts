import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    redirect: { name: 'card' },
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'card',
        name: 'card',
        component: () => import('pages/CardPage.vue')
      },
      {
        path: 'chart',
        name: 'chart',
        component: () => import('pages/ChartPage.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('pages/AboutPage.vue')
      },
      {
        path: 'contact',
        name: 'contact',
        component: () => import('pages/ContactPage.vue')
      }
      // {
      //   path: 'cam',
      //   name: 'cam',
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
