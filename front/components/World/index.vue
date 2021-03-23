<template>
    <section class="scene">
        <canvas id="canvas" ref="canvas"></canvas>
        <FormsQuestion v-if="isVisible" />
        <span class="cursor-timer"></span>
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
.cursor-timer {
    width: 20px;
    height: 20px;
    opacity: 0;
    background-color: yellow;
    position: absolute;
    top: 0;
}
</style>

