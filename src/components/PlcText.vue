<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card light>
        <v-card-text>
          <pre class="text-xs-center">{{ logText }}</pre>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'plc-text',
  computed: mapGetters([
    // map this.logs to store.state.logs
    'logText'
  ])
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
