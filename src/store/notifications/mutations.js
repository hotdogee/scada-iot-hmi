// import initialState from './state'
import Vue from 'vue'
// import _ from 'lodash'
// import Logger from 'assets/logger'
// const logger = new Logger('notifications.mutations')
/*
export function someMutation (state, payload) {
}
*/

export function setSubscription (state, { subscription }) {
  state.subscription = subscription
}

export function setPermission (state, { permission }) {
  state.permission = permission
}

export function updateNotificationRead (state, { id, isRead }) {
  const notification = state.notificationList.find(notification => {
    return notification.id === id
  })
  Vue.set(notification, 'isRead', isRead)
}
