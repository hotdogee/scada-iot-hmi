<template>
  <q-layout ref="layout" view="hhh lpr fff" class="bg-dark">
    <!-- Header -->
    <q-toolbar slot="header" color="dark">
      <img src="/statics/icons/favicon-32x32.png">
      <q-toolbar-title class="col-auto">
        SCADA/IoT
      </q-toolbar-title>
      <q-select color="dark"
        v-model="select"
        :options="selectListOptions"
        class="no-shadow no-margin"
        inverted
      />
    </q-toolbar>

    <!-- Navigation -->
    <q-tabs slot="navigation" align="center" color="dark">
      <q-route-tab slot="title" icon="subject" to="/text" label="Text" />
      <q-route-tab slot="title" icon="view_module" to="/card" label="Card" />
      <q-route-tab slot="title" icon="timeline" to="/chart" label="Chart" />
      <!-- <q-route-tab slot="title" icon="videocam" to="/cam" label="Cam" /> -->
    </q-tabs>

    <!-- sub-routes -->
    <router-view></router-view>

    <!-- Footer -->
    <q-toolbar slot="footer" color="dark">
      <q-toolbar-title>
        <small class="text-grey-5">Made with <span class="text-red-14">❤</span> by Han Lin <span class="gt-xs">(hotdogee)</span></small>
      </q-toolbar-title>
      <q-toolbar-title>
        <small class="text-grey-5"><span class="pull-right">© {{ new Date().getFullYear() }} 蘭陽地熱</span></small>
      </q-toolbar-title>
    </q-toolbar>
  </q-layout>
</template>

<script>
import {
  QLayout,
  QToolbar,
  QToolbarTitle,
  QSelect,
  QTabs,
  QRouteTab
} from 'quasar'

export default {
  name: 'index',
  data () {
    return {
      select: 'geo9',
      selectListOptions: [
        {
          label: '宜蘭清水九號井',
          value: 'geo9'
        }
      ]
    }
  },
  components: {
    QLayout,
    QToolbar,
    QToolbarTitle,
    QSelect,
    QTabs,
    QRouteTab
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
// @import '~variables'
</style>
<style>
@media (min-width: 992px) {
  .q-tab, .q-tab.icon-and-label {
      padding-left: 50px;
      padding-right: 50px;
  }
}
</style>
