<template>
  <div class="constellation">
    <canvas id="canvas" ref="canvas" />
    <transition name="fade">
      <Constellation-Profile v-if="isVisible" />
    </transition>
  </div>
</template>

<script>
import Scene from '../components/World/js/Constellation/Scene'
export default {
  name: 'Constellation',
  data () {
    return {
      isVisible: false
    }
  },
  computed: {
  },
  mounted () {
    // eslint-disable-next-line no-new
    new Scene({
      $canvas: this.$refs.canvas
    })

    // Watch the click of crystal to display a profile
    this.$nuxt.$on('onCrystalClick', () => {
      this.isVisible = !this.isVisible
    })
  },
  methods: {
  }
}
</script>

<style scoped>
body {
  cursor: none;
}

canvas {
    z-index: 0;
    position: absolute;
    top: 0;
}
</style>
