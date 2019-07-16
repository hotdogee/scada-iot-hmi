// local-settings is not cleared on logout
export default {
  fontSize: 114,
  locale: 'default' // use quasar lang instead of browser navigator.language
}
/*
 * User not logged in
 * if anonymous user doesn't exist in indexedDB
 * create anonymous user in indexedDB
 * auto detect locale
 * anonymous user changes will be saved to indexedDB
 * read locale from anonymous user in indexedDB
 * User sign up
 * send anonymous user locale
 * User sign in
 * read locale from user service
 * write user indexedDB, keep anonymous indexedDB
 * User sign out
 * remove user indexedDB
 */
