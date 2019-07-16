import _ from 'lodash'
import Logger from 'assets/logger'
// import { get } from 'http';
const logger = new Logger('user.getters')
/*
export function someGetter (state) {
}
*/
export function isSignedIn (state) {
  // TODO: check expired
  return !!state.accessToken
}

export function displayInfo (state) {
  // priority: displayName, fullName, google,
  const account = state.user.accounts.reduce((acc, a) => {
    logger.log('acc, a', acc, a)
    if (a.type === 'email') {
      acc.email = a.value
      acc.email_verified = !!a.verificationId
      acc.name = ''
    } else if (a.type === 'google') {
      if (!acc.email) {
        acc.email = a.email
        acc.email_verified = a.email_verified
      }
      acc.name = acc.name || a.name
      acc.avatar = acc.avatar || a.picture
    } else if (a.type === 'facebook') {
      if (!acc.email) {
        acc.email = a.email
        acc.email_verified = true
      }
      acc.name = acc.name || a.name
      acc.avatar = acc.avatar || a.picture.data.url
    } else if (a.type === 'line') {
      if (!acc.email) {
        acc.email = a.email
        acc.email_verified = true
      }
      acc.name = acc.name || a.name
      acc.avatar = acc.avatar || a.picture
    } else if (a.type === 'twitter') {
      if (!acc.email) {
        acc.email = a.email
        acc.email_verified = true
      }
      acc.name = acc.name || a.name
      acc.avatar = acc.avatar || a.profile_image_url_https
    }
    return acc
  }, {})
  return Object.assign(
    {
      name: 'Guest',
      avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
      email: 'No Email',
      email_verified: false
    },
    account,
    {
      name: state.user.displayName || state.user.displayName || account.name
    }
  )
}

export function name (state) {
  return state.user.name
}

export function birthday (state) {
  return state.user.birthday
}

export const nationality = state => {
  return state.user.nationality
}

export const identification = state => {
  return state.user.identification
}

export const alienResidentCertification = state => {
  return state.user.alienResidentCertification
}

export const passportNum = state => {
  return state.user.passportNum
}

export function userId (state) {
  return state.user._id
}

export function accounts (state) {
  return state.user.accounts
}

export function isValidated (state) {
  return state.user.accounts[state.user.accountSelected].verificationId || null
}

export function authorizations (state) {
  return _.sortBy(state.user.authorizations, ['updated']) || []
}

export function authSelectedId (state) {
  return state.user.authorizationSelected
  // return authorization's id
}

export function authorization (state, getters) {
  if (state.user.authorizations) {
    if (state.user.authorizations.length > 0) {
      logger.log('1')
      return state.user.authorizations.find(auth => auth._id === state.user.authorizationSelected)
    } else if (isSignedIn(state)) {
      logger.log('2')
      return {
        scope: { role: 'user', org: 'binflux' }
      }
    } else {
      logger.log('3')
      return {
        scope: { role: 'guest', org: 'binflux' }
      }
    }
  }
}
