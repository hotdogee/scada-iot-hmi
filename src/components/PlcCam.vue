<template>
  <div>
  <transition-group name="cards" tag="div" class="row wrap container">
    <div class="col-xs-12 col-sm-6 cards-item" v-for="(cam, index) in cameras" :key="index" v-show="cam.show">
      <q-card class="bg-white">
        <q-card-main>
          <canvas ref="camera-canvas" class="camera-canvas"></canvas>
        </q-card-main>
      </q-card>
    </div>
  </transition-group>
  <q-inner-loading :visible="!cameras[0].show">
    <q-spinner-radio size="50px" color="white"></q-spinner-radio>
  </q-inner-loading>
  </div>
</template>

<script>
import JSMpeg from '../statics/jsmpeg.min.js'
import {
  QCard,
  QCardMain,
  QInnerLoading,
  QSpinnerRadio
} from 'quasar'

export default {
  name: 'plc-cam',
  data: function () {
    return {
      loading: true,
      cameras: [
        {
          url: 'ws://cam.scada.hanl.in/cam1',
          show: false
        },
        {
          url: 'ws://cam.scada.hanl.in/cam2',
          show: false
        },
        {
          url: 'ws://cam.scada.hanl.in/cam3',
          show: false
        },
        {
          url: 'ws://cam.scada.hanl.in/cam4',
          show: false
        }
      ]
    }
  },
  mounted () {
    // setup live view
    // console.log(this.$refs)
    this.cameras.forEach((cam, index) => {
      cam.player = new JSMpeg.Player(cam.url, {canvas: this.$refs['camera-canvas'][index], preserveDrawingBuffer: true})
      // cam.show = true
      setTimeout(() => {
        cam.show = true
      }, 2000 + index * 500)
    })
  },
  beforeDestroy () {
    // console.log('plc-cam beforeDestroy called!')
    this.cameras.forEach((cam, index) => {
      cam.player.destroy()
      cam.show = false
    })
  },
  components: {
    QCard,
    QCardMain,
    QInnerLoading,
    QSpinnerRadio
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.camera-canvas {
  width: 100%;
}
.cards-enter-active, .cards-leave-active {
  transition: opacity .8s ease;
}
.cards-enter, .cards-leave-to {
  opacity: 0;
}
</style>
