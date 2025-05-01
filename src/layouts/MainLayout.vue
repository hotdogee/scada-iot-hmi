<template>
  <q-layout view="hhh lpr fff">
    <q-header class="text-grey-9 bg-white">
      <q-toolbar elevated>
        <img src="/icons/favicon-32x32.png" />
        <q-toolbar-title class="nav-title">
          <q-item-label class="flex items-center justify-start font-medium">
            <div class="mr-2 inline-flex py-[2px]">SCADA/IoT</div>
            <div
              class="inline-flex items-center justify-center rounded-lg bg-emerald-100 px-2 py-[2px] text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
            >
              {{ t('demo_mode') }}
            </div>
          </q-item-label>
        </q-toolbar-title>
        <LocaleSelect />
        <q-btn flat round dense icon="notifications" class="q-mr-xs" @click="checkNotifications">
          <q-badge v-show="unread > 0" color="red" floating> {{ unread }} </q-badge>
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
            <q-card flat>
              <q-item>
                <q-item-section avatar>
                  <q-avatar>
                    <img src="~assets/avatar-640.png" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label> {{ t('guest') }} </q-item-label>
                </q-item-section>
              </q-item>
            </q-card>
          </q-menu>
        </q-btn>
      </q-toolbar>
      <!-- Navigation -->
      <q-tabs class="bg-grey-9 text-white">
        <!-- <q-route-tab icon="subject" to="/text" :label="t('text')" /> -->
        <q-route-tab
          class="max-w-38"
          content-class="align-center flex justify-center"
          icon="dashboard"
          :to="{ name: 'card' }"
          :label="t('card')"
        />
        <q-route-tab
          class="max-w-38"
          content-class="align-center flex justify-center"
          icon="timeline"
          :to="{ name: 'chart' }"
          :label="t('chart')"
        />
        <q-route-tab
          class="max-w-38"
          content-class="align-center flex justify-center"
          icon="article"
          :to="{ name: 'about' }"
          :label="t('about')"
        />
        <q-route-tab
          class="max-w-38"
          content-class="align-center flex justify-center"
          icon="mail"
          :to="{ name: 'contact' }"
          :label="t('contact')"
        />
        <!-- <q-route-tab disable icon="videocam" :to="{ name: 'cam' }" :label="t('camera')" />
        <q-route-tab disable icon="videogame_asset" :to="{ name: 'dcs' }" :label="t('control')">
          <q-tooltip
            transition-show="flip-right"
            transition-hide="flip-left"
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 5]"
          >
            {{ t('unauthorized') }}
          </q-tooltip>
        </q-route-tab> -->
      </q-tabs>
    </q-header>

    <q-footer class="text-grey-9 text-overline bg-white">
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
// import { useLogsStore } from 'src/stores/logs'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { loggers } from '../boot/logger'
import LocaleSelect from 'src/components/LocaleSelect.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// Setup stores
// const logsStore = useLogsStore()

// Computed properties
const currentYear = computed(() => new Date().getFullYear())

// const isLive = computed(() => {
//   let status = true
//   if (logsStore.end) {
//     const endTimestamp = Date.parse(logsStore.end)
//     if (!isNaN(endTimestamp)) {
//       const elapsed = Date.now() - endTimestamp
//       if (elapsed > 60 * 1000) {
//         status = false
//       }
//     } else {
//       console.warn('Invalid date format in logsStore.end:', logsStore.end)
//     }
//   }
//   return status
// })

interface Notification {
  message: string
}

const notifications = computed<Notification[]>(() => {
  return [{ message: t('demo_notification') }]
})

const unread = useStorage('unread-notifications', 1)
function checkNotifications() {
  unread.value = 0
}

loggers.info?.('created')
</script>

<i18n>
{
  "en": {
    "text": "Text",
    "card": "Real-time",
    "chart": "Historical",
    "about": "About",
    "contact": "Contact",
    "camera": "Camera",
    "control": "Control",
    "unauthorized": "Unauthorized",
    "guest": "Guest",
    "demo_mode": "Demo Mode",
    "demo_notification": "Connected to Demo Data Stream",
    "no_notification": "No Notifications",
  },
  "tw": {
    "text": "文字",
    "card": "即時數據",
    "chart": "歷史統計",
    "about": "系統資訊",
    "contact": "聯繫方式",
    "camera": "現場直播",
    "control": "電廠控制",
    "unauthorized": "無權限",
    "guest": "訪客權限",
    "demo_mode": "展示模式",
    "demo_notification": "系統展示中",
    "no_notification": "無推播通知",
  }
}
</i18n>

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
