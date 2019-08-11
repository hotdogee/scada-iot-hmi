import { helpers } from 'vuelidate/lib/validators'

// const apiErrors = (field) => helpers.withParams(
//   { type: 'apiErrors', value: field },
//   (value) => {
//     logger.log(`apiErrors.this = ${this}`)
//     // logger.log(`apiErrors.vm = `, vm)
//     return this ? !!this.errors[field] : this
//   }
// )
// const apiErrors2 = (field) => (value) => {
//   logger.log(`apiErrors.this = ${this}`)
//   // logger.log(`apiErrors.vm = `, vm)
//   return this ? !!this.errors[field] : this
// }
export function apiErrors (field) {
  // logger.log(`apiErrors.this = `, this)
  return helpers.withParams({ type: 'apiErrors', field: field }, function (value, vm) {
    // logger.log(`apiErrors->this = `, this)
    // logger.log(`apiErrors->this.errors = `, this.errors)
    // logger.log(`apiErrors.vm = `, vm)
    // // return false if there is an error
    // if (this.$v[field].$dirty) {
    //   return true
    // }
    if (vm.errors[field]) {
      vm.$v[field].$touch()
      return false
    } else {
      return true
    }
  })
}
