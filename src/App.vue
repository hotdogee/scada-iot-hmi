<template>
  <v-app dark fill-height footer toolbar id="app">
    <v-toolbar extended>
      <v-toolbar-title>SCADA/IoT</v-toolbar-title>
      <v-menu>
        <v-toolbar-title slot="activator">
          <span>宜蘭清水九號井</span>
          <v-icon dark>arrow_drop_down</v-icon>
        </v-toolbar-title>
        <v-list>
          <v-list-tile v-for="item in items" :key="item">
            <v-list-tile-title v-text="item"></v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <!-- <v-spacer></v-spacer> -->
      <!-- <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>apps</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn> -->
    <v-tabs slot="extension" dark fixed icons centered>
      <v-tabs-bar slot="activators" class="grey darken-4">
        <v-tabs-slider class="primary"></v-tabs-slider>
        <v-tabs-item to="/plc/text" class="primary--text">
          <v-icon>subject</v-icon>
          Text
        </v-tabs-item>
        <v-tabs-item to="/plc/card" class="primary--text">
          <v-icon>view_module</v-icon>
          Card
        </v-tabs-item>
        <v-tabs-item to="/plc/chart" class="primary--text">
          <v-icon>timeline</v-icon>
          Chart
        </v-tabs-item>
      </v-tabs-bar>
    </v-tabs>
    </v-toolbar>
    <main>
      <v-container fluid grid-list-md>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </v-container>
    </main>
    <v-footer>
      <div>Made with ❤ by Han Lin <span class="hidden-xs-only">(hotdogee)</span></div>
      <v-spacer></v-spacer>
      <div>© {{ new Date().getFullYear() }} 蘭陽地熱</div>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data: () => ({
    items: [
      '宜蘭清水九號井'
    ]
  })
}
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
<style lang="stylus">
  @require './stylus/main'
</style>
