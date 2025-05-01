<template>
  <q-select
    v-model="locale"
    :options="localeOptions"
    dense
    borderless
    emit-value
    map-options
    options-dense
    class=""
  >
    <template #selected-item="scope">
      <div class="flex items-center">
        <span class="ml-2">{{ scope.opt.label }}</span>
      </div>
    </template>
    <template #option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-label>
          <span class="flags text-base">{{ scope.opt.flag }}</span>
          <span class="ml-2">{{ scope.opt.label }}</span>
        </q-item-label>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
// import { useQuasar } from 'quasar'

// const $q = useQuasar()
const { locale } = useI18n()

const localeOptions = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'tw', label: 'Taiwan', flag: '🇹🇼' }
]

// Watch for changes in the locale ref (v-model) and persist them
watch(locale, (newLocale) => {
  if (newLocale) {
    locale.value = newLocale
    // $q.localStorage.set(LOCALE_STORAGE_KEY, newLocale)
    console.log(`Locale changed to: ${newLocale}.`)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');

.flags {
  font-family: 'Noto Color Emoji', sans-serif;
  font-weight: 400;
  font-style: normal;
}
</style>
