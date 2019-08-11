// import _ from 'lodash'
// import Logger from 'assets/logger'
// const logger = new Logger('notifications.getters')
/*
export function someGetter (state) {
}
*/
export function isSubscribed (state) {
  // subscription should be null or a PushSubscription object
  // state.subscription.constructor.name === 'PushSubscription'
  return !!state.subscription
}

export function subscription (state) {
  // subscription should be null or a PushSubscription object
  // state.subscription.constructor.name === 'PushSubscription'
  // return state.subscription ? state.subscription.toJSON() : state.subscription
  return state.subscription
}

export function notificationList (state) {
  return state.notificationList
}

export function unreadNotificationList (state) {
  return state.notificationList.filter(notification => !notification.isRead) || []
}
