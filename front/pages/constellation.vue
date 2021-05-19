<template>
  <div class="constellation">
    <canvas id="canvas" ref="canvas" />
    <transition name="fade" >
      <Interface-Constellation-Profile v-if="isVisible" />
    </transition>
  </div>
</template>

<script>
import Scene from '../components/World/js/Constellation/Scene'
export default {
    name: 'constellation',
        data() {
            return {
              isVisible: false
            }
        },
        computed: {
        },
        mounted() {
            new Scene({
                $canvas: this.$refs.canvas
            })

            // Watch of the window have to be open
            this.$store.watch(() => this.$store.state.constellation.isClicked, isClicked => {
              isClicked ? this.isVisible = true : this.isVisible = false
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
