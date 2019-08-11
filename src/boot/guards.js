// import { getState } from 'src/store/storage'
import Logger from 'assets/logger'
const logger = new Logger('boot.guards')

export default ({ app, router, store, Vue }) => {
  router.beforeResolve((to, from, next) => {
    let isSignedIn = store.getters['user/isSignedIn']
    let authorization = store.getters['user/authorization']
    // logger.log('state', store.state.user.accessToken)
    logger.log('User is sign in: ', isSignedIn, to, from)
    if (
      to.matched.some(record => record.meta.app === 'patient') ||
      to.matched.some(record => record.meta.app === 'cm')
    ) {
      if (
        to.matched.some(record => {
          logger.log('record.meta.auth:', record.meta.auth)
          return record.meta.auth
        })
      ) {
        if (!isSignedIn) {
          // if is app
          // if user is not logged in, redirect to login page.
          logger.debug('guarded')
          next({
            name: 'sign-up-and-login',
            replace: true,
            // redirect back to original path when done signing in
            query: { redirect: to.fullPath }
          })
        } else if (to.matched.some(record => Array.isArray(record.meta.auth))) {
          logger.log('authorization:', authorization)
          if (
            to.matched.some(
              record =>
                Array.isArray(record.meta.auth) &&
                record.meta.auth.some(rule => rule.role && rule.role === authorization.scope.role)
            )
          ) {
            // auth role matched
            logger.debug('auth role matched')
            next()
          } else {
            // no matching auth
            logger.debug('no matching auth')
            next({
              name: 'auth-apply',
              replace: true,
              // redirect back to original path when done signing in
              query: {
                redirect: to.fullPath,
                authRequired: to.meta.auth
              }
            })
          }
        } else {
          // already sign in, handle role here
          next()
        }
      } else {
        // already sign in, handle role here
        next()
      }
    } else {
      next()
    }
  })
  // watch if authorization changed
  app.mixins = app.mixins || []
  app.mixins.push({
    beforeCreate () {
      this.$store.watch(
        (state, getters) => {
          return getters['user/authorization']
        },
        (authorization, old) => {
          logger.log('authorization from: ', old, ' to:', authorization)
          // if (val.scope.role === 'guest') {
          //   router.replace({ name: 'sign-up-and-login' })
          // }
          if (
            (authorization.scope.role !== old.scope.role ||
              authorization.scope.org !== old.scope.org) &&
            this.$route.name !== null
          ) {
            if (this.$route.name === 'sign-up-and-login') {
              let path = this.$route.query.redirect
              logger.log(`path ${path}`)
              logger.log('from :', this.$route, ' to: ', path)
              if (path) {
                router.replace({ path: path })
              } else {
                router.replace({ name: 'treatment' })
              }
            } else if (this.$route.name === 'auth-apply') {
              // check if new authorization can access
              let path = this.$route.query.redirect
              logger.log('from :', this.$route, ' to: ', path)
              router.replace({ path: path })
            } else {
              logger.log('reload ', this.$route)
              // router.go() // reload current route
            }
          }
        }
      )
    }
  })
  // next()
  // to.matched.some(record => {
  //   logger.log('record.meta', record.test, record)
  // })
  // let allowedToEnter = true
  // to.matched.some((record) => {
  //   // check if there is meta data
  //   let isLoggedIn = store.getters['user/isLoggedIn']
  //   if (!isLoggedIn && record.name === 'index') {
  //     next({
  //       path: '/sign-in',
  //       replace: true
  //     })
  //     return
  //   }

  //   if ('meta' in record) {
  //     // ------------------------------------------------------------
  //     // check if user needs to be logged in to access this page
  //     if ('requiresAuth' in record.meta) {
  //       if (record.meta.requiresAuth) {
  //         // console.log('Page requires auth:', to, from)
  //         // this route requires auth, check if user is logged in
  //         // if not, redirect to login page.
  //         if (!isLoggedIn) {
  //           // User is not logged in, redirect to signin page
  //           allowedToEnter = false
  //           next({
  //             path: '/sign-in',
  //             replace: true,
  //             // redirect back to original path when done signing in
  //             query: { redirect: to.fullPath }
  //           })
  //         }
  //       }
  //     }
  //     // ------------------------------------------------------------
  //     // check if user has correct permissions to access this page
  //     if (allowedToEnter && 'permissions' in record.meta) {
  //       let canProceed = false
  //       let permissions = record.meta.permissions
  //       // get currently logged in user permissions
  //       let token = store.getters['auth/token']
  //       // decipher the token
  //       let session = JWT.read(token)
  //       // check if they are not an admin (administrator)
  //       if (session.claim.permissions.administrator) {
  //         canProceed = true
  //       }
  //       else {
  //         for (let index = 0; index < permissions.length; ++index) {
  //           let permission = permissions[index]
  //           // console.log('Permission needed:', permission)
  //           if (permission === 'administrator') {
  //             if (session.claim.permissions.administrator) {
  //               canProceed = true
  //             }
  //           }
  //           else if (permission === 'liveview') {
  //             if (session.claim.permissions.liveview) {
  //               canProceed = true
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  // })
}
