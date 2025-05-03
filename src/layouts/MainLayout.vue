<template>
  <q-layout view="hhh lpr fff">
    <q-header class="text-grey-9 bg-white">
      <q-toolbar elevated class="max-sm:px-2">
        <img src="/icons/favicon-32x32.png" />
        <q-toolbar-title class="nav-title">
          <q-item-label class="flex items-center justify-start font-medium">
            <div class="mr-2 inline-flex py-[2px]">SCADA/IoT</div>
            <div
              class="inline-flex items-center justify-center rounded-lg bg-emerald-100 px-2 py-[2px] text-sm font-medium text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
            >
              <span class="md:hidden">{{ t('demo') }}</span>
              <span class="max-md:hidden">{{ t('demo_mode') }}</span>
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
                    <q-icon name="account_circle" size="42px" class="text-[#95bbdf]" />
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
          class="max-w-38 min-w-10"
          content-class="align-center flex justify-center mt-3 min-w-10"
          icon="dashboard"
          :to="{ name: 'card' }"
          :label="t('card')"
        />
        <q-route-tab
          class="max-w-38 min-w-10"
          content-class="align-center flex justify-center mt-3 min-w-10"
          icon="timeline"
          :to="{ name: 'chart' }"
          :label="t('chart')"
        />
        <q-route-tab
          class="max-w-38 min-w-10"
          content-class="align-center flex justify-center mt-3 min-w-10"
          icon="article"
          :to="{ name: 'about' }"
          :label="t('about')"
        />
        <q-route-tab
          class="max-w-38 min-w-10"
          content-class="align-center flex justify-center mt-3 min-w-10"
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

    <q-footer class="bg-white">
      <q-toolbar class="footer-toolbar text-zinc-700">
        <q-item-section class="creator-section">
          <q-item-label lines="1" class="creator-text font-semibold">
            Made with <span class="heart">❤</span> by Han Lin (hotdogee)
          </q-item-label>
        </q-item-section>
        <q-space />
        <div class="copyright pr-4">© {{ currentYear }}</div>
        <div className="flex flex-row space-x-3">
          <div
            className="h-6 w-6 fill-current hover:text-green-700 hover:drop-shadow-md dark:hover:text-green-300"
          >
            <a href="https://github.com/hotdogee/scada-iot-hmi">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="">
                <title>GitHub icon</title>
                <path
                  d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                />
              </svg>
            </a>
          </div>
          <div
            className="h-6 w-6 fill-current hover:text-green-700 hover:drop-shadow-md dark:hover:text-green-300"
          >
            <a href="https://www.linkedin.com/in/hotdogee/">
              <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="">
                <title>LinkedIn icon</title>
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                />
              </svg>
            </a>
          </div>
        </div>
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
    "demo": "Demo",
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
    "demo": "展示",
    "demo_notification": "系統展示中",
    "no_notification": "無推播通知",
  }
}
</i18n>

<style scoped>
@media (width < 40rem) {
  .q-toolbar {
    padding: 0 6px;
  }
  .q-toolbar__title {
    padding: 0 6px;
  }
  .q-tab {
    padding: 0 8px;
  }
}

.copyright {
  min-width: 5rem;
  white-space: nowrap;
  overflow: hidden;
  text-align: end;
}

.creator-section {
  opacity: 0.9;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
}

.creator-text {
  font-size: 0.85rem;
  letter-spacing: 0.25px;
}

.heart {
  color: #ff4081;
  display: inline-block;
  animation: heartbeat 1.5s ease infinite;
}

@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  14% {
    transform: scale(1.3);
  }
  28% {
    transform: scale(1);
  }
  42% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1);
  }
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
