
const routes = [
  {
    path: '/',
    name: 'Index',
    redirect: { name: 'PlcCard' },
    component: () => import('layouts/Index.vue'),
    children: [
      {
        path: 'text',
        name: 'PlcText',
        component: () => import('pages/Card.vue')
      },
      {
        path: 'card',
        name: 'PlcCard',
        component: () => import('pages/Card.vue')
      },
      {
        path: 'chart',
        name: 'PlcChart',
        component: () => import('pages/Chart.vue')
      },
      {
        path: 'cam',
        name: 'PlcCam',
        component: () => import('pages/Cam.vue')
      },
      {
        path: 'dcs',
        name: 'PlcDcs',
        component: () => import('pages/Card.vue')
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
