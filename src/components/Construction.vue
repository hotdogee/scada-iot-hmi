<template>
  <v-layout row wrap>
    <v-flex xs12 sm6 offset-sm3>
      <v-card light>
        <v-card-media height="200px" class="text-xs-center">
          <v-icon x-large light id="icon">build</v-icon>
        </v-card-media>
        <v-card-title primary-title>
          <div>
            <div class="headline">施工中</div>
          </div>
        </v-card-title>
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
  ])
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#icon {
  font-size: 14rem;
}
</style>
