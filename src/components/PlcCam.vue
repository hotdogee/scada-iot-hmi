<template>
  <div class="row wrap container">
    <div class="col-xs-12 col-sm-6">
      <q-card class="bg-white">
        <q-card-main>
          <canvas id="camera-canvas1" class="camera-canvas"></canvas>
        </q-card-main>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-card class="bg-white">
        <q-card-main>
          <canvas id="camera-canvas2" class="camera-canvas"></canvas>
        </q-card-main>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-card class="bg-white">
        <q-card-main>
          <canvas id="camera-canvas3" class="camera-canvas"></canvas>
        </q-card-main>
      </q-card>
    </div>
    <div class="col-xs-12 col-sm-6">
      <q-card class="bg-white">
        <q-card-main>
          <canvas id="camera-canvas4" class="camera-canvas"></canvas>
        </q-card-main>
      </q-card>
    </div>
  </div>
</template>

<script>
import JSMpeg from '../statics/jsmpeg.min.js'
import {
  QCard,
  QCardMain
} from 'quasar'

export default {
  name: 'plc-cam',
  mounted () {
    // setup live view
    const canvas1 = document.getElementById('camera-canvas1')
    const url1 = 'ws://cam.scada.hanl.in/cam1'
    const player1 = new JSMpeg.Player(url1, {canvas: canvas1, preserveDrawingBuffer: true})
    const canvas2 = document.getElementById('camera-canvas2')
    const url2 = 'ws://cam.scada.hanl.in/cam2'
    const player2 = new JSMpeg.Player(url2, {canvas: canvas2, preserveDrawingBuffer: true})
    const canvas3 = document.getElementById('camera-canvas3')
    const url3 = 'ws://cam.scada.hanl.in/cam3'
    const player3 = new JSMpeg.Player(url3, {canvas: canvas3, preserveDrawingBuffer: true})
    const canvas4 = document.getElementById('camera-canvas4')
    const url4 = 'ws://cam.scada.hanl.in/cam4'
    const player4 = new JSMpeg.Player(url4, {canvas: canvas4, preserveDrawingBuffer: true})
  },
  components: {
    QCard,
    QCardMain
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.camera-canvas {
  width: 100%;
}
</style>
