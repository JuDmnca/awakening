<template>
  <transition name="fade">
    <section class="scene rel">
      <canvas id="canvas" ref="canvas" style="z-index: -2" />
      <transition name="fade" mode="out-in">
        <TransitionContainer
          v-if="transitionVisible"
          :step="step"
        />
      </transition>
      <TransitionVignettage v-if="vignettageVisible" @onscreen="updateScene" />
      <!-- Just to test icons -->
      <!-- <UI-IconsSound width="40" height="40" iconColor="#fff"/> -->
    </section>
  </transition>
</template>

<script>
import Scene from './js/Scene'

export default {
  name: 'Scene',
  data () {
    return {
      transition: false,
      vignettage: true,
      label: '',
      placeholder: '',
      confirmation: '',
      step: 0
    }
  },
  computed: {
    transitionVisible () {
      return this.transition
    },
    vignettageVisible () {
      return this.vignettage
    }
  },
  mounted () {
    // eslint-disable-next-line no-new
    new Scene({
      $canvas: this.$refs.canvas
    })
    this.$nuxt.$on('startTransition', (step) => {
      this.step = step
      this.transition = true
      setTimeout(() => {
        this.vignettage = false
      }, 4000)
    })
    this.$nuxt.$on('endTransition', () => {
      this.transition = false
    })
  },
  methods: {
    updateScene () {
      this.$nuxt.$emit('startSceneTransition')
    }
  }
}
</script>

<style scoped>
.scene {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
}

canvas {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
