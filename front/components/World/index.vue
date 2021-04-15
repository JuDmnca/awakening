<template>
    <section class="scene">
        <canvas id="canvas" ref="canvas" />
        <FormsQuestion v-if="isVisible" />
    </section>
</template>

<script>
    import Scene from './js/Scene'

    export default {
        name: 'scene',
        data() {
            return {}
        },
        computed: {
            isVisible() {
                return false
            }
        },
        mounted() {
            new Scene({
                $canvas: this.$refs.canvas
            })
        }
    }
</script>

<style>
body {
    height: 100vh;
    overflow: hidden;
}
.scene {
    position: fixed;
    height: 100vh;
}
</style>

