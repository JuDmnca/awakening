<template>
  <canvas class="background" :style="colorSetted? bg : ''" />
</template>

<script>
import * as PIXI from 'pixi.js'
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur'
import SimplexNoise from 'simplex-noise'
import debounce from 'debounce'

export default {
  data () {
    return {
      circles: [],
      simplex: new SimplexNoise()
    }
  },
  computed: {
    colorPalette () {
      return this.$store.state.colorPalette
    },
    colorSetted () {
      if (this.$store.state.colorPalette) {
        return true
      } else {
        return false
      }
    },
    bg () {
      return {
        background: `#${this.$store.state.colorPalette[0]}`
      }
    }
  },
  mounted () {
    const app = new PIXI.Application({
      view: document.querySelector('.background'),
      resizeTo: window,
      backgroundAlpha: 0
    })
    app.stage.filters = [new KawaseBlurFilter(30, 10, true)]

    for (let i = 0; i < 10; i++) {
      const bounds = this.setBounds()
      const circle = {
        bounds,
        x: this.random(bounds.x.min, bounds.x.max),
        y: this.random(bounds.y.min, bounds.y.max),
        scale: this.random(1, 2),
        fill: '0x' + this.colorPalette[i % 3],
        radius: this.random(window.innerHeight / 5, window.innerHeight / 2),
        xOff: this.random(0, 1000),
        yOff: this.random(0, 1000),
        inc: this.random(0.0009, 0.0012),
        graphics: new PIXI.Graphics(),
        alpha: 0.825
      }
      app.stage.addChild(circle.graphics)
      this.circles.push(circle)
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      app.ticker.add(() => {
        // update and render each orb, each frame. app.ticker attempts to run at 60fps
        this.circles.forEach((circle) => {
          this.update(circle)
          this.render(circle)
        })
      })
    } else {
      // perform one update and render per orb, do not animate
      this.circles.forEach((circle) => {
        this.update(circle)
        this.render(circle)
      })
    }
    window.addEventListener(
      'resize',
      debounce(() => {
        this.circles.forEach((circle) => {
          circle.bounds = this.setBounds()
        })
      }, 250)
    )
  },
  methods: {
    random (min, max) {
      return Math.random() * (max - min) + min
    },
    map (n, start1, end1, start2, end2) {
      return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2
    },
    setBounds () {
      const maxDist = window.innerWidth
      const originX = window.innerWidth / 1.25
      const originY = window.innerWidth < 1000 ? window.innerHeight : window.innerHeight / 1.375

      return {
        x: {
          min: originX - maxDist,
          max: originX + maxDist
        },
        y: {
          min: originY - maxDist,
          max: originY + maxDist
        }
      }
    },
    update (circle) {
      const xNoise = this.simplex.noise2D(circle.xOff, circle.xOff)
      const yNoise = this.simplex.noise2D(circle.yOff, circle.yOff)
      const scaleNoise = this.simplex.noise2D(circle.xOff, circle.yOff)

      circle.x = this.map(xNoise, -1, 1, circle.bounds.x.min, circle.bounds.x.max)
      circle.y = this.map(yNoise, -1, 1, circle.bounds.y.min, circle.bounds.y.max)
      circle.scale = this.map(scaleNoise, -1, 1, 0.5, 1)

      circle.xOff += circle.inc
      circle.yOff += circle.inc
    },
    render (circle) {
      circle.graphics.x = circle.x
      circle.graphics.y = circle.y
      circle.graphics.scale.set(circle.scale)

      circle.graphics.clear()

      circle.graphics.beginFill(circle.fill)
      circle.graphics.drawCircle(0, 0, circle.radius)
      circle.graphics.endFill()
    }
  }
}
</script>

<style>
.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 4;
}
</style>
