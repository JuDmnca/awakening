<template>
  <section class="sound_icon z-50">
    <!-- TO DO : Enable tailwind here -->
    <canvas id="canvasSoundIcon" ref="canvasSoundIcon" class="cursor-pointer" width="50" height="50" />
  </section>
</template>
<script>
import noise1d from '../../Utils/js/Noise1D'
export default {
  props: {
    iconName: {
      type: String,
      default: 'box'
    },
    iconColor: {
      type: String,
      default: '#fff'
    }
  },
  data () {
    return {
      ctx: null,
      heightMemory: null,
      timeDelta: 0,
      timeTotal: 0,
      newDate: null,
      myReq: null,
      oldDate: new Date().getTime(),
      isClicked: false,
      isMuted: false
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const canvas = this.$refs.canvasSoundIcon
      if (canvas.getContext) {
        this.ctx = canvas.getContext('2d')
        this.myReq = requestAnimationFrame(this.update)
        // Listener
        canvas.addEventListener('click', () => {
          this.isClicked = !this.isClicked
          if (this.isMuted) {
            this.$nuxt.$emit('unMute')
            this.isMuted = false
          } else {
            this.$nuxt.$emit('mute')
            this.isMuted = true
          }
        })
      } else {
        // console.log('errer sound icon')
      }
    },
    draw (timeTotal, stopDrawing) {
      const randomLevel = 0.3
      const maxHeight = 40
      const speedAttenuation = 1000
      const heightPixelMute = 2
      const widthBar = 2
      const nbBars = 8
      const rect = {
        x: 14,
        y: 25
      }
      const rectangles = []
      let xOff = 0
      const randomHeight = []
      const tween = []
      this.ctx.fillStyle = this.iconColor
      for (let i = 0; i < nbBars; i++) {
        rectangles.push(new Path2D())

        if (stopDrawing) {
          tween[i] = this.heightMemory[i]
          tween[i] -= 1
          if (tween[i] >= heightPixelMute) {
            rectangles[i].rect(rect.x + xOff, rect.y - tween[i] / 2, widthBar, tween[i])
          } else {
            rectangles[i].rect(rect.x + xOff, rect.y - heightPixelMute / 2, widthBar, heightPixelMute)
          }
        } else {
          randomHeight.push(noise1d(timeTotal / speedAttenuation + i * randomLevel) * maxHeight)
          rectangles[i].rect(rect.x + xOff, rect.y - randomHeight[i] / 2, widthBar, randomHeight[i])
        }
        xOff += 3
        this.ctx.fill(rectangles[i])
      }
      if (!stopDrawing) {
        this.heightMemory = randomHeight
      } else {
        this.heightMemory = tween
      }
    },
    update () {
      this.newDate = new Date().getTime()
      this.timeDelta = this.newDate - this.oldDate
      this.timeTotal += this.timeDelta
      this.oldDate = this.newDate
      this.ctx.clearRect(0, 0, 400, 120)
      this.draw(this.timeTotal, this.isClicked)
      this.myReq = requestAnimationFrame(this.update)
    }
  }
}
</script>

<style scoped>
    .sound_icon {
        position: absolute;
        right: 50px;
        bottom: 50px;
        display: flex;
        z-index: 10;
    }

    .sound_icon:hover {
        cursor: none;
    }

    #canvasSoundIcon {
        margin: auto;
    }
</style>
