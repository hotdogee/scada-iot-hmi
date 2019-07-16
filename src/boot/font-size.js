import Logger from 'assets/logger'
const logger = new Logger('boot.fontSize')

export default async ({ app, router, store, Vue }) => {
  // console.log(locale)
  // console.log(app.created)
  // console.log(app.mounted)
  app.mixins = app.mixins || []
  app.mixins.push({
    beforeCreate () {
      // load default
      document.documentElement.style['font-size'] = `114%`
      this.$store.watch(
        state => {
          return state.localSettings.fontSize
        },
        (fontSize, old) => {
          logger.log(`fontSize changed: ${old} -> ${fontSize}`)
          logger.debug(document.documentElement)
          document.documentElement.style['font-size'] = `${fontSize}%`
          // console.log(lang)
          // console.log(state)
          // console.log(locale)
          // console.log(this.$router)
          // console.log(this.$router.app)
          // console.log(this.$router.app.$i18n.locale)
        }
      )
    }
  })
}
