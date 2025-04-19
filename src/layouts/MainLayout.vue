<template>
  <q-layout view="hhh lpr fff">
    <q-header class="text-grey-9 bg-white">
      <q-toolbar elevated>
        <img src="/icons/favicon-32x32.png" />
        <q-toolbar-title class="nav-title">
          <q-item-label>SCADA/IoT</q-item-label>
        </q-toolbar-title>
        <q-space></q-space>
        <q-btn flat round dense icon="notifications" class="q-mr-xs">
          <q-badge v-show="!isLive" color="red" floating> ! </q-badge>
          <q-menu max-height="130px">
            <q-list style="min-width: 100px">
              <q-item v-for="n in notifications" :key="n.message">
                <q-item-section>{{ n.message }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
        <q-btn flat round dense icon="person">
          <q-menu fit>
            <q-card class="user-form">
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img src="~assets/avatar-640.png" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>訪客權限</q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <!-- Navigation -->
      <q-tabs class="bg-grey-9 text-white">
        <!-- <q-route-tab icon="subject" to="/text" label="文字" /> -->
        <q-route-tab icon="dashboard" :to="{ name: 'card' }" label="即時數據" />
        <q-route-tab icon="timeline" :to="{ name: 'chart' }" label="歷史統計" />
        <q-route-tab icon="videocam" :to="{ name: 'card' }" label="現場直播" />
        <q-route-tab disable icon="videogame_asset" to="/dcs" label="電廠控制">
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 5]"
          >
            無權限
          </q-tooltip>
        </q-route-tab>
      </q-tabs>
    </q-header>

    <q-footer elevated class="text-grey-9 text-overline bg-white">
      <q-toolbar>
        <div class="ellipsis">
          Made with
          <span class="text-red-14">❤</span> by Han Lin (hotdogee)
        </div>
        <q-space></q-space>
        <div class="copyright">© {{ currentYear }}</div>
      </q-toolbar>
    </q-footer>

    <q-page-container class="bg-grey-9">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
// Import dependencies
import { useLogsStore } from 'src/stores/logs'
import { computed } from 'vue'
import { loggers } from '../boot/logger'

// Setup stores
const logsStore = useLogsStore()

// Computed properties
const currentYear = computed(() => new Date().getFullYear())

const isLive = computed(() => {
  let status = true
  if (logsStore.end) {
    const endTimestamp = Date.parse(logsStore.end)
    if (!isNaN(endTimestamp)) {
      const elapsed = Date.now() - endTimestamp
      if (elapsed > 60 * 1000) {
        status = false
      }
    } else {
      console.warn('Invalid date format in logsStore.end:', logsStore.end)
    }
  }
  return status
})

interface Notification {
  message: string
}

const notifications = computed<Notification[]>(() => {
  if (!isLive.value) {
    return [{ message: '系統維護中' }]
  }
  return [{ message: '無推播通知' }]
})

// Lifecycle hooks equivalent
// Vue 3 doesn't require explicit lifecycle hooks for logging creation
loggers.info?.('created') // Component initialized
</script>

<style>
.copyright {
  min-width: 5rem;
  white-space: nowrap;
  overflow: hidden;
  text-align: end;
}

.q-tab__label {
  font-size: 1rem;
}
@media (min-width: 992px) {
  .q-tab,
  .q-tab.icon-and-label {
    padding-left: 50px;
    padding-right: 50px;
  }
}
</style>
