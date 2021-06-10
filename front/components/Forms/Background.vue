<template>
  <canvas ref="background" class="background" />
</template>

<script>
import Scene from './js/Scene'

export default {
  data () {
    return {
      circles: []
    }
  },
  computed: {
    colorPalette () {
      return this.$store.state.colorPalette
    }
  },
  mounted () {
    // eslint-disable-next-line no-new
    new Scene({
      $canvas: this.$refs.background,
      color: this.colorPalette
    })
  }
}
</script>

<style>
.background {
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 4;
}
</style>
