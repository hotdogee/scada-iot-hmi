<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
  	<q-ajax-bar ref="bar" position="top" size="8" color="primary"></q-ajax-bar>
    <router-view></router-view>
  </div>
</template>

<script>
import {
  QAjaxBar
} from 'quasar'
export default {
  name: 'app',
  components: {
    QAjaxBar
  }
}
</script>

<style>
/* .fade-enter-active, .fade-leave-active {
  transition: opacity .3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
} */
</style>
<style lang="stylus">
// @import '~variables'

// main
//   text-align center
//   margin-top 40px

// header
//   margin 0
//   height 10px
//   background-color $primary
</style>
