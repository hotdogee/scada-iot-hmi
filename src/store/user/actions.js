/*
export async function someAction (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
}
*/
import jwtDecode from 'jwt-decode'
import { filter } from 'lodash'
import Logger from 'assets/logger'
const logger = new Logger('user.actions')

export async function generateKey (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  commit('setKey', {
    key: null,
    publicKey: null
  })
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256' // can be 'P-256', 'P-384', or 'P-512'
    },
    false, // whether the key is extractable (i.e. can be used in exportKey)
    ['sign', 'verify']
  )
  const jwk = await window.crypto.subtle.exportKey(
    'jwk', // can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
    key.publicKey // can be a publicKey or privateKey, as long as extractable was true
  )
  const publicKey = jwk.x + jwk.y
  commit('setKey', {
    key,
    publicKey
  })
  // document.getElementById('q-app').__vue__.$store.state.user.key.publicKey
  return key
}

async function sign (key, payload) {
  const publicKey = await window.crypto.subtle.exportKey(
    'jwk', // can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
    key.publicKey // can be a publicKey or privateKey, as long as extractable was true
  )
  const document = {
    payload,
    publicKey: JSON.stringify(publicKey),
    timestamp: new Date(),
    // timestamp: new Date('2018-11-06T07:34:20.671Z'),
    userAgent: navigator.userAgent
  }
  logger.log(`document = ${document}`)
  const enc = new TextEncoder()
  const signature = await window.crypto.subtle.sign(
    {
      name: 'ECDSA',
      hash: { name: 'SHA-256' } // can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
    },
    key.privateKey, // from generateKey or importKey above
    enc.encode(JSON.stringify(document)) // ArrayBuffer of data you want to sign
  )
  logger.log(`signature(${signature.byteLength}) = ${new Uint8Array(signature)}`)
  return { signature, document }
}

export async function signUp (
  { commit, dispatch, state, getters, rootState, rootGetters },
  credentials
) {
  try {
    commit('setPending', { pending: true })
    commit('setErrors', { errors: {} })
    const key = await dispatch('generateKey')
    const { signature, document } = await sign(key, {
      email: credentials.email
    })

    const data = {
      accounts: [
        {
          type: 'email',
          value: credentials.email
        }
      ],
      password: credentials.password,
      recaptchaToken: credentials.recaptchaToken,
      locale: rootGetters['localSettings/locale'],
      signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      document
    }
    logger.log(`data.signature = ${data.signature}`)

    const users = this.$feathers.api.service('users')
    logger.log('this.$feathers:', this.$feathers)
    const user = await users.create(data) // send email
    logger.log('users.create:', user)
    commit('setUser', {
      user
    })
    dispatch('refreshToken')
  } catch (error) {
    commit('setKey', {
      key: null,
      publicKey: null
    })
    logger.error('users.create:', error)
    // TypeError: Cannot read property 'publicKey' of null
    // {name: "NotAuthenticated", message: "Strategy ecdsa is not permitted", code: 401, className: "not-authenticated", errors: {…}}
    if (error.errors) {
      commit('setErrors', error)
    } else {
      // console.log(error.name, error.message)
      commit('setErrors', {
        errors: {
          error
        }
      })
    }
  } finally {
    commit('setPending', { pending: false })
  }
}

export async function refreshToken (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  try {
    const { signature, document } = await sign(state.key, {
      userId: state.user._id
    })

    const data = {
      strategy: 'ecdsa',
      signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      document
    }
    logger.log(`data.signature = ${data.signature}`)

    const result = await this.$feathers.api.authenticate(data)
    logger.log('ecdsa strategy:', result)
    commit('setAccessToken', {
      accessToken: result.accessToken
    })
    commit('setUser', { user: result.user })
    return result
  } catch (error) {
    logger.error('refreshToken:', error)
    // TypeError: Cannot read property 'publicKey' of null
    // {name: "NotAuthenticated", message: "Strategy ecdsa is not permitted", code: 401, className: "not-authenticated", errors: {…}}
  }
}

export async function getUser (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload = {
    userId: ''
  }
) {
  try {
    commit('setPending', { pending: true })
    commit('setErrors', { errors: {} })
    // get userId
    const userId = payload.userId || state.user._id || state.payload.userId
    logger.debug('getUser:', userId)
    if (!userId) throw new Error('userId is empty')
    // get user
    const users = this.$feathers.api.service('users')
    const user = await users.get(userId)
    logger.log('users.get:', user)
    // {
    //   _id: "5be4a374bf2bac9cd8b03ff4"
    //   email: "test"
    //   role: "user"
    //   created: "2018-11-08T20:58:28.492Z"
    //   updated: "2018-11-08T20:58:28.492Z"
    // }
    commit('setUser', { user })
  } catch (error) {
    logger.error('getUser:', error)
    if (error.errors) {
      commit('setErrors', error)
    } else {
      // console.log(error.name, error.message)
      commit('setErrors', {
        errors: {
          error
        }
      })
    }
  } finally {
    commit('setPending', { pending: false })
  }
}

export async function signIn (
  { commit, dispatch, state, getters, rootState, rootGetters },
  credentials
) {
  try {
    commit('setPending', { pending: true })
    commit('setErrors', { errors: {} })
    const key = await dispatch('generateKey')
    const { signature, document } = await sign(key, {
      'accounts.value': credentials.email
    })

    const data = {
      strategy: 'local',
      'accounts.value': credentials.email,
      password: credentials.password,
      signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      document
    }
    logger.log(`data.signature = ${data.signature}`)

    const result = await this.$feathers.api.authenticate(data)
    // {accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyIsInR5cGUiOi…cwIn0.O7zEqy5T_WR9GWWs13NOwgc9bJIRG74u1xuFKepqL_U"}
    logger.log('local strategy:', result)
    commit('setAccessToken', {
      accessToken: result.accessToken
    })
    // get userId
    const payload = jwtDecode(result.accessToken)
    // {
    //   aud: "api"
    //   exp: 1561308276
    //   iat: 1561306476
    //   iss: "infans.io"
    //   jti: "f7b2e9f4-f727-4d1f-bbe7-69ab9aca5d28"
    //   sub: "5d0901810516e204e1aeadb2"
    // }
    logger.log('payload:', payload)
    commit('setPayload', { payload })
    // get user
    const users = this.$feathers.api.service('users')
    const user = await users.get(payload.sub)
    // {
    //   _id: "5be4a374bf2bac9cd8b03ff4"
    //   email: "test"
    //   role: "user"
    //   created: "2018-11-08T20:58:28.492Z"
    //   updated: "2018-11-08T20:58:28.492Z"
    // }
    logger.log('users.get:', user)
    commit('setUser', { user })
  } catch (error) {
    commit('setKey', {
      key: null,
      publicKey: null
    })
    logger.error('signIn:', error)
    if (Object.entries(error.errors).length !== 0 && error.errors.constructor === Object) {
      // errors.erros has text
      const errors = error.errors
      commit('setErrors', { errors })
    } else if (Object.entries(error.errors).length === 0 && error.errors.constructor === Object) {
      // errors.erros is empty, use errors.message's text instead
      const errorMessage = error.message
      let errors = {}
      errors[errorMessage] = errorMessage
      commit('setErrors', { errors })
    } else {
      commit('setErrors', {
        errors: {
          error
        }
      })
    }
  } finally {
    commit('setPending', { pending: false })
  }
}

export async function oauthSignIn (
  { commit, dispatch, state, getters, rootState, rootGetters },
  { user }
) {
  try {
    commit('setPending', { pending: true })
    commit('setErrors', { errors: {} })
    const key = await dispatch('generateKey')
    const { signature, document } = await sign(key, {
      'accounts.type': user.accounts[0].type,
      'accounts.value': user.accounts[0].value
    })

    const data = {
      document,
      signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
      userId: user._id
    }
    logger.debug(`public-keys data = `, data)
    const service = this.$feathers.api.service('public-keys')
    const result = await service.create(data)
    // {accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyIsInR5cGUiOi…cwIn0.O7zEqy5T_WR9GWWs13NOwgc9bJIRG74u1xuFKepqL_U"}
    logger.log('public-keys created:', result)
    dispatch('refreshToken')
  } catch (error) {
    commit('setKey', {
      key: null,
      publicKey: null
    })
    logger.error('oauthSignIn:', error)
    if (error.errors) {
      commit('setErrors', error)
    } else {
      // console.log(error.name, error.message)
      commit('setErrors', {
        errors: {
          error
        }
      })
    }
  } finally {
    commit('setPending', { pending: false })
  }
}

function clearServices ({ commit, serviceNameArr }) {
  serviceNameArr.forEach(serviceName => {
    return commit(`${serviceName}/clearAll`, null, { root: true })
  })
}
export async function signOut (
  { commit, dispatch, state, getters, rootState, rootGetters },
  payload
) {
  try {
    const auth = Object.assign({}, state)
    Promise.all(
      filter(Object.keys(this._actions), v => v.endsWith('/signOut') && !v.startsWith('user/')).map(
        v => {
          logger.debug(v)
          return dispatch(v, { auth }, { root: true })
        }
      )
    ).then(() => {
      logger.debug('$feathers.api.logout')
      this.$feathers.api.logout()
    })
    const serviceNameArr = [
      'settings',
      'patients',
      'calendars',
      'medications',
      'treatments',
      'treatment_statuses',
      'types',
      'type_permissions',
      'verify_users',
      'verify_role_user',
      'verify_roles',
      'buckets',
      'bucket_details',
      'thaw_logs',
      'tanks',
      'embryos',
      'embryo_images'
    ]
    // clear all the services' state
    clearServices({ commit, serviceNameArr })
    // set user store to guest state
    commit('signOut')
  } catch (error) {
    logger.error('signOut:', error)
    if (error.errors) {
      commit('setErrors', error)
    } else {
      // console.log(error.name, error.message)
      commit('setErrors', {
        errors: {
          error
        }
      })
    }
  } finally {
    // commit('setPending', { pending: false })
  }
}

export async function sendVerifyEmail (
  { commit, dispatch, state, getters, rootState, rootGetters },
  account
) {
  logger.log('sendVerifyEmail args:', account)
  const data = {
    userId: state.user._id,
    email: account.value,
    locale: rootGetters['localSettings/locale']
  }
  logger.debug('sendVerifyEmail data:', data)
  const emailVerifications = this.$feathers.api.service('email-verifications')
  const response = await emailVerifications.create(data)
  logger.info('sendVerifyEmail email-verifications create response:', response)
}

export async function verifyEmail (
  { commit, dispatch, state, getters, rootState, rootGetters },
  token
) {
  try {
    const payload = jwtDecode(token)
    // get userId
    // const payload = jwtDecode(token)
    // {
    //   "userId": "5c8d58b0ff298a003d05a8c9",
    //   "email": "hotdogee2@gmail.com",
    //   "iat": 1552767152,
    //   "exp": 1552768952,
    //   "aud": "users.patch",
    //   "iss": "binflux.com",
    //   "sub": "verify",
    //   "jti": "1214e3d8-686c-42db-a57e-3029d1e6a4b8"
    // }
    // logger.log('payload:', payload)
    // get user
    // const users = this.$feathers.api.service('users')
    // const user = await users.patch(payload.userId, data)
    // {
    //   _id: "5be4a374bf2bac9cd8b03ff4"
    //   email: "test"
    //   role: "user"
    //   created: "2018-11-08T20:58:28.492Z"
    //   updated: "2018-11-08T20:58:28.492Z"
    // }
    // logger.log('users.patch:', user)
    const emailVerifications = this.$feathers.api.service('email-verifications')
    const response = await emailVerifications.patch(payload.vid, {
      token
    })
    logger.log('emailVerifications:', response)
    // // const emailVerifications = document.getElementById('q-app').__vue__.$feathers.api.service('email-verifications')
    // emailVerifications.create({
    //   token: 'hack'
    // }).then(res => console.log(res))
    // // context error JsonWebTokenError: jwt malformed
    // emailVerifications.create({
    //   userId: 'hack'
    // }).then(res => console.log(res))
    // // Forbidden{type: "FeathersError", name: "Forbidden", message: "You are not allowed to create email-verifications", code: 403, className: "forbidden",}
    // commit('setUser', {
    //   user
    // })
    return response
  } catch (error) {
    logger.error('verifyEmail:', error)
    if (error.errors) {
      commit('setErrors', error)
    } else {
      // console.log(error.name, error.message)
      commit('setErrors', {
        errors: {
          error
        }
      })
    }
  } finally {
    // commit('setPending', { pending: false })
  }
}

export async function requestPasswordReset (
  { commit, dispatch, state, getters, rootState, rootGetters },
  credentials
) {
  logger.log('requestPasswordReset args:', credentials)
  const data = {
    email: credentials.email,
    locale: rootGetters['localSettings/locale']
  }
  logger.debug('requestPasswordReset data:', data)
  const service = this.$feathers.api.service('password-resets')
  const response = await service.create(data)
  logger.info('requestPasswordReset password-resets create response:', response)
}

export async function resetPassword (
  { commit, dispatch, state, getters, rootState, rootGetters },
  { token, password }
) {
  try {
    logger.log('resetPassword args:', { token, password })
    const payload = jwtDecode(token)
    // get userId
    // const payload = jwtDecode(token)
    // {
    //   "userId": "5c8d58b0ff298a003d05a8c9",
    //   "email": "hotdogee2@gmail.com",
    //   "iat": 1552767152,
    //   "exp": 1552768952,
    //   "aud": "users.patch",
    //   "iss": "binflux.com",
    //   "sub": "verify",
    //   "jti": "1214e3d8-686c-42db-a57e-3029d1e6a4b8"
    // }
    // logger.log('payload:', payload)
    // get user
    // const users = this.$feathers.api.service('users')
    // const user = await users.patch(payload.userId, data)
    // {
    //   _id: "5be4a374bf2bac9cd8b03ff4"
    //   email: "test"
    //   role: "user"
    //   created: "2018-11-08T20:58:28.492Z"
    //   updated: "2018-11-08T20:58:28.492Z"
    // }
    // logger.log('users.patch:', user)
    logger.debug('resetPassword jwt payload:', payload)
    const service = this.$feathers.api.service('password-resets')
    const response = await service.patch(payload.vid, {
      token,
      password
    })
    logger.info('resetPassword password-resets patch response:', response)
    // // const emailVerifications = document.getElementById('q-app').__vue__.$feathers.api.service('email-verifications')
    // emailVerifications.create({
    //   token: 'hack'
    // }).then(res => console.log(res))
    // // context error JsonWebTokenError: jwt malformed
    // emailVerifications.create({
    //   userId: 'hack'
    // }).then(res => console.log(res))
    // // Forbidden{type: "FeathersError", name: "Forbidden", message: "You are not allowed to create email-verifications", code: 403, className: "forbidden",}
    // commit('setUser', {
    //   user
    // })
    return response
  } catch (error) {
    logger.error('resetPassword:', error)
    if (error.errors) {
      commit('setErrors', error)
    } else {
      // console.log(error.name, error.message)
      commit('setErrors', {
        errors: {
          error
        }
      })
    }
  } finally {
    // commit('setPending', { pending: false })
  }
}

export async function patchPersonalInfo (
  { commit, dispatch, state, getters, rootState, rootGetters },
  { field, val }
) {
  try {
    commit('setPending', { pending: true })
    const { signature, document } = await sign(state.key, {
      userId: state.user._id
    })
    const data = { signature, document }
    data[field] = val
    const users = this.$feathers.api.service('users')
    const user = await users.patch(getters.userId, data)
    commit('setField', { field, val: user[field] })
  } catch (error) {
    if (error.errors) {
      commit('setErrors', error)
    } else {
      commit('setErrors', {
        errors: {
          error
        }
      })
    }
  } finally {
    commit('setPending', { pending: false })
  }
}
