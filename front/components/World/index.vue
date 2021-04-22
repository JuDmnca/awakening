<template>
    <section class="scene rel">
        <canvas id="canvas" ref="canvas" />
        <FormsQuestion v-if="isVisible" :label="label" :step="step" />
        <EffectsVignettage />
    </section>
</template>

<script>
    import Scene from './js/Scene'

    export default {
        name: 'scene',
        data() {
            return {
                visible: false,
                label: '',
                step: 0
            }
        },
        computed: {
            isVisible() {
                return this.visible
            }
        },
        mounted() {
            new Scene({
                $canvas: this.$refs.canvas
            })
            this.$nuxt.$on('questionVisible', (step) => {
                this.step = step
                if (step === 2) {
                    this.label = 'Odeur'
                } else if (step === 3) {
                    this.label = 'Goût'
                } else {
                    this.label = 'Son'
                }
                this.visible = true
            })
            this.$nuxt.$on('questionHidden', () => {
                this.visible = false
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
    width: 100%;
    height: 100vh;
}
</style>

