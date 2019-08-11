import VueI18n from 'vue-i18n'
import enUS from 'src/i18n/en-us'
import zhHant from 'src/i18n/zh-hant'
import { Quasar } from 'quasar'
import Logger from 'assets/logger'
const logger = new Logger('boot.i18n')
// const localeToLang = {
//   'zh-tw': 'zh-hant',
//   'zh-hk': 'zh-hant',
//   'zh-cn': 'zh-hans'
// }
const loadedI18n = new Set(['zh-hant', 'en-us'])
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

export default async ({ app, router, store, Vue }) => {
  Vue.use(VueI18n)
  app.mixins = app.mixins || []
  app.mixins.push({
    i18n: new VueI18n({
      locale: 'zh-hant',
      fallbackLocale: 'en-us',
      messages: {
        'zh-hant': zhHant,
        'en-us': enUS
      }
    }),
    beforeCreate () {
      const setLocale = async locale => {
        logger.debug('this', this)
        if (locale === 'default') {
          locale = getDefaultLocale()
        }
        // convert locale to language
        // const lang = localeToLang.hasOwnProperty(locale)
        //   ? localeToLang[locale]
        //   : locale
        // logger.log('$i18n', lang)
        // dynamically load quasar translations
        try {
          const { default: messages } = await import(`quasar/lang/${locale}`)
          Quasar.lang.set(messages)
        } catch (error) {
          logger.error(error)
          // Requested Quasar Language Pack does not exist,
          // let's not break the app, so catching error
        }
        // console.log(lang)
        // console.log(state)
        // console.log(locale)
        // console.log(this.$router)
        // console.log(this.$router.app)
        // console.log(this.$router.app.$i18n.locale)
        // this.$router.app.$i18n.locale = lang
        // dynamically load vue-i18n translations
        if (!loadedI18n.has(locale)) {
          try {
            const { default: messages } = await import(
              /* webpackChunkName: "lang-[request]" */
              `src/i18n/${locale}`
            )
            this.$i18n.setLocaleMessage(locale, messages)
            loadedI18n.add(locale)
          } catch (error) {
            logger.error(error)
          }
        }
        this.$i18n.locale = locale
      }
      this.$store.watch(
        state => {
          return state.localSettings.locale
        },
        (locale, old) => {
          logger.log(`locale changed: ${old} -> ${locale}`)
          setLocale(locale)
          store.commit('localSettings/setLocale', { locale })
        }
      )
      setLocale(this.$store.state.localSettings.locale)
      // store.commit('localSettings/setDefaultLocale')
    }
  })
}
