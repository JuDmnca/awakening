<template>
  <section class="v">
    <div ref="v_1" class="v_1" :style="colorSetted? v1 : ''" />
    <div ref="v_2" class="v_2" :style="colorSetted? v2 : ''" />
    <div ref="v_3" class="v_3" :style="colorSetted? v3 : ''" />
  </section>
</template>

<script>
import gsap from 'gsap'

export default {
  name: 'Vignettage',
  data () {
    return {
    }
  },
  computed: {
    colorSetted () {
      if (this.$store.state.colorPalette) {
        return true
      } else {
        return false
      }
    },
    v1 () {
      return {
        background: `radial-gradient(circle, rgba(255,0,255,0) 66.66%, #${this.$store.state.colorPalette[0]} 100%)`
      }
    },
    v2 () {
      return {
        background: `radial-gradient(circle, rgba(255,0,255,0) 33.33%, #${this.$store.state.colorPalette[0]} 100%)`
      }
    },
    v3 () {
      return {
        background: `#${this.$store.state.colorPalette[0]}`
      }
    }
  },
  mounted () {
    this.$refs.v_1.style.opacity = 0
    this.$refs.v_2.style.opacity = 0
    this.$refs.v_3.style.opacity = 0
    this.$nextTick(() => {
      window.addEventListener('mousedown', this.launchEffect)
      window.addEventListener('mouseup', this.unLaunchEffect)
    })
  },
  methods: {
    launchTransition (vignettageRef, end) {
      gsap.killTweensOf(vignettageRef)
      gsap.to(
        vignettageRef,
        {
          opacity: 1,
          duration: this.$store.state.durationHold,
          ease: 'power3.inOut',
          onComplete: () => {
            if (end) {
              this.$emit('onscreen')
            }
          }
        }
      )
    },
    unLaunchTransition (vignettageRef) {
      gsap.killTweensOf(vignettageRef)
      gsap.to(
        vignettageRef,
        {
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        }
      )
    },
    launchEffect () {
      switch (this.$store.state.desert.counter) {
        case 0:
          this.launchTransition(this.$refs.v_1.style, false)
          break
        case 1:
          this.launchTransition(this.$refs.v_2.style, false)
          break
        case 2:
          this.launchTransition(this.$refs.v_3.style, true)
          break
      }
    },
    unLaunchEffect () {
      switch (this.$store.state.desert.counter) {
        case 0:
          this.unLaunchTransition(this.$refs.v_1.style)
          break
        case 1:
          this.unLaunchTransition(this.$refs.v_2.style)
          break
        case 2:
          this.unLaunchTransition(this.$refs.v_3.style)
          break
      }
    }
  }
}
</script>

<style>
.v_1, .v_2, .v_3 {
    position: absolute;
    width: 100vw;
    height: 100vh;
}

.v_1 {
    opacity: 0;
    filter: blur(80px);
}

.v_2 {
    opacity: 0;
    filter: blur(80px);
}

.v_3 {
    opacity: 0;
}
</style>
