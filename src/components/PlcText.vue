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
