import Vue from 'vue'
import Router from 'vue-router'
import PlcText from '@/components/PlcText'
import PlcCard from '@/components/PlcCard'
import PlcChart from '@/components/PlcChart'
import Construction from '@/components/Construction'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Index',
      redirect: { name: 'PlcCard' }
    },
    {
      path: '/plc/text',
      name: 'PlcText',
      component: PlcText
    },
    {
      path: '/plc/card',
      name: 'PlcCard',
      component: PlcCard
    },
    {
      path: '/plc/chart',
      name: 'PlcChart',
      component: PlcChart
    }
  ]
})
