<template>
  <div class="row wrap container">
    <div class="col-xs-12 col-sm-10 offset-sm-1 col-md-8 offset-md-2 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
      <q-card class="bg-white">
        <q-card-main>
          <pre class="text-center">{{ logText }}</pre>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>
<template>
  <div class="flex justify-center full-height" :class="heightSize">
    <div class="card text-white text-center width-3of4 bg-width-2of5 gt-bg-width-1of4 sm-auto " id="login">
      <div class="card-title" :class="finalBgColor">
        <svg id="logo" viewBox="0 0 483 483"
             style="enable-background:new 0 0 460 460;"
             xml:space="preserve" width="128px" height="128px"
             v-html="logoMethod">
        </svg>
        <h4>{{logo}}</h4>
      </div>
      <div class="card-content bg-white ">
        <div class="stacked-label">
          <input required class="full-width" type="email" v-model="email">
          <label>Email</label>
        </div>
        <div class="stacked-label">
          <input required class="full-width" type="password" v-model="password">
          <label>Password</label>
        </div>
      </div>
      <div class="card-actions inline-block vertical-middle">
        <button class="teal fit " :class="buttonClass" @click="login()">Login</button>
        <button class="red fit" :class="buttonClass" @click="login()">Login Google</button>
        <button class="blue fit" :class="buttonClass" @click="login()">Login Facebook</button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  QCard,
  QCardMain
} from 'quasar'
import { mapGetters } from 'vuex'

export default {
  name: 'plc-text',
  computed: mapGetters([
    // map this.logs to store.state.logs
    'logText'
  ]),
  components: {
    QCard,
    QCardMain
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
