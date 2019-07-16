<template>
  <q-layout view="hhh lpr fff">
    <q-header class="bg-white text-grey-9">
      <q-toolbar elevated>
        <img src="/statics/icons/favicon-32x32.png" />
        <q-toolbar-title class="title">蘭陽地熱 SCADA/IoT</q-toolbar-title>
      </q-toolbar>
      <!-- Navigation -->
      <q-tabs class="bg-grey-9 text-white">
        <!-- <q-route-tab icon="subject" to="/text" label="文字" /> -->
        <q-route-tab icon="dashboard" to="/card" label="即時數據" />
        <q-route-tab icon="timeline" to="/chart" label="歷史統計" />
        <q-route-tab icon="videocam" to="/cam" label="現場直播" />
        <q-route-tab disable icon="videogame_asset" to="/dcs" label="電廠控制" />
      </q-tabs>
    </q-header>

    <q-footer elevated class="bg-white text-grey-9 text-overline">
      <q-toolbar>
        <div>
          Made with
          <span class="text-red-14">❤</span> by Han Lin (hotdogee)
        </div>
        <q-toolbar-title></q-toolbar-title>
        <div>© {{ new Date().getFullYear() }} 蘭陽地熱</div>
      </q-toolbar>
    </q-footer>

    <q-page-container class="bg-grey-9">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  name: 'Index',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
.title {
  line-height: 2rem;
  font-size: 1.125rem;
}
</style>
