<template>
  <div class="constellation">
    <canvas id="canvas" ref="canvas" />
  </div>
</template>

<script>
import Scene from '../components/World/js/Constellation/Scene'
export default {
    name: 'constellation',
        data() {
            return {
            }
        },
        computed: {
        },
        mounted() {
            new Scene({
                $canvas: this.$refs.canvas
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
    position: absolute;
    top: 0;
}
</style>
