<template>
  <q-page class="row wrap content-start q-pa-xs">
    <div
      v-for="(cam, index) in cameras"
      :key="index"
      class="col-xs-12 col-sm-6"
    >
      <q-card class="bg-white q-ma-xs">
        <q-card-section>
          <!-- <canvas ref="camera-canvas" class="camera-canvas"></canvas> -->
          <q-img
            :src="camImagesSrc[index]"
            spinner-color="white"
          >
          </q-img>
          <!-- <video
            ref="camera-video"
            class="absolute-full q-pa-md camera-video"
            muted="muted"
          ></video> -->
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped>
.camera-video {
  width: 100%;
}
.cards-enter-active,
.cards-leave-active {
  transition: opacity 0.8s ease;
}
.cards-enter,
.cards-leave-to {
  opacity: 0;
}
</style>

<script>
import Hls from 'hls.js'
import flvjs from 'flv.js'
// import { mapGetters, mapState } from 'vuex'
import { mapGetters } from 'vuex'
export default {
  name: 'pages.Cam',
  data: function () {
    return {
      loading: true,
      cameras: [
        {
          url: 'https://scada.hanl.in/media/live/cam1/index.m3u8',
          hlsUrl: 'https://scada.hanl.in/live/cam1/index.m3u8',
          flvUrl: 'https://scada.hanl.in/media/live/cam1.flv',
          show: false
        },
        {
          url: 'https://scada.hanl.in/media/live/cam2/index.m3u8',
          hlsUrl: 'https://scada.hanl.in/live/cam2/index.m3u8',
          flvUrl: 'https://scada.hanl.in/media/live/cam2.flv',
          show: false
        },
        {
          url: 'https://scada.hanl.in/media/live/cam3/index.m3u8',
          hlsUrl: 'https://scada.hanl.in/live/cam3/index.m3u8',
          flvUrl: 'https://scada.hanl.in/media/live/cam3.flv',
          show: false
        },
        {
          url: 'https://scada.hanl.in/media/live/cam4/index.m3u8',
          hlsUrl: 'https://scada.hanl.in/live/cam4/index.m3u8',
          flvUrl: 'https://scada.hanl.in/media/live/cam4.flv',
          show: false
        }
      ]
    }
  },
  computed: {
    // ...mapState('images', ['camImages'])
    ...mapGetters('images', ['camImagesSrc'])
  },
  mounted () {
    // setup live view
    // console.log(this.$refs)
    // this.cameras.forEach((cam, index) => {
    //   // this.loadHls(this.$refs['camera-video'][index], cam.url)
    //   this.loadFlv(this.$refs['camera-video'][index], cam.flvUrl)
    //   // this.loadHls(this.$refs['camera-video'][index], cam.hlsUrl)
    //   // cam.player = new JSMpeg.Player(cam.url, {canvas: this.$refs['camera-video'][index], preserveDrawingBuffer: true})
    //   // cam.show = true
    //   setTimeout(() => {
    //     cam.show = true
    //   }, 2000 + index * 500)
    // })
  },
  beforeDestroy () {
    // console.log('plc-cam beforeDestroy called!')
    // this.cameras.forEach((cam, index) => {
    //   // cam.player.destroy()
    //   cam.show = false
    // })
  },
  methods: {
    loadHls (video, src) {
      if (Hls.isSupported()) {
        var hls = new Hls()
        hls.loadSource(src)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.play()
        })
        // hls.on(Hls.Events.ERROR, function (event, data) {
        //   var errorType = data.type
        //   var errorDetails = data.details
        //   var errorFatal = data.fatal

        //   console.log(`Error: ${errorType} - ${errorDetails} - ${errorFatal} - ${src}`)
        //   switch(data.type) {
        //     case Hls.ErrorTypes.NETWORK_ERROR:
        //       // try to recover network error
        //       console.log("fatal network error encountered, try to recover")
        //       hls.startLoad()
        //       break
        //     case Hls.ErrorTypes.MEDIA_ERROR:
        //       console.log("fatal media error encountered, try to recover")
        //       hls.recoverMediaError()
        //       break
        //   }
        //   hls.loadSource(src)
        // })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // hls.js is not supported on platforms that do not have Media Source Extensions (MSE) enabled.
        // When the browser has built-in HLS support (check using `canPlayType`), we can provide an HLS manifest (i.e. .m3u8 URL) directly to the video element throught the `src` property.
        // This is using the built-in support of the plain video element, without using hls.js.
        // Note: it would be more normal to wait on the 'canplay' event below however on Safari (where you are most likely to find built-in HLS support) the video.src URL must be on the user-driven
        // white-list before a 'canplay' event will be emitted the last video event that can be reliably listened-for when the URL is not on the white-list is 'loadedmetadata'.
        video.src = src
        video.addEventListener('loadedmetadata', function () {
          video.play()
        })
      }
    },
    loadFlv (videoElement, url) {
      if (flvjs.isSupported()) {
        var flvPlayer = flvjs.createPlayer({
          type: 'flv',
          url
        })
        flvPlayer.attachMediaElement(videoElement)
        flvPlayer.load()
        flvPlayer.play()
      }
    }
  }
}
</script>
