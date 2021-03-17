<template>
    <section class="scene">
        <canvas id="canvas" ref="canvas"></canvas>
        <FormsQuestion />
    </section>
</template>

<script>
    import Scene from './js/Scene'

    export default {
        name: 'scene',
        data() {
            return {}
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

