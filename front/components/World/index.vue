<template>
    <section class="scene">
        <canvas id="canvas" ref="canvas"></canvas>
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

</style>

