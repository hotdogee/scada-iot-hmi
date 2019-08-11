import { Quasar } from 'quasar'
import Logger from 'assets/logger'
const logger = new Logger('localSettings.mutations')
/*
export function someMutation (state, payload) {
}
*/

export function setFontSize (state, { fontSize }) {
  state.fontSize = fontSize
}

const fallbackLocale = 'en-us'
const supportedLocale = {
  'zh-tw': 'zh-hant',
  'zh-hk': 'zh-hant',
  'zh-hant': 'zh-hant',
  'zh-cn': 'zh-hans',
  'zh-hans': 'zh-hans'
}
function getDefaultLocale () {
  const browserLanguage = Quasar.lang.getLocale()
  logger.debug(
    'browserLanguage',
    browserLanguage,
    fallbackLocale,
    supportedLocale[browserLanguage] || fallbackLocale
  )
  return supportedLocale[browserLanguage] || fallbackLocale
}

export function setDefaultLocale (state) {
  logger.debug('setDefaultLocale', state.locale, getDefaultLocale())
  if (state.locale === 'default') {
    state.locale = getDefaultLocale()
  }
}

export function setLocale (state, { locale }) {
  state.locale = supportedLocale[locale] || fallbackLocale
}
