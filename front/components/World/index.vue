<template>
    <transition name='fade'>
        <section class="scene rel">
            <canvas id="canvas" ref="canvas" />
            <FormsQuestion v-if="isVisibleQ" :label="label" :step="step" />
            <EffectsVignettage v-if="isVisibleV" @onscreen="updateScene" />
        </section>
    </transition>
</template>

<script>
    import Scene from './js/Scene'

    export default {
        name: 'scene',
        data() {
            return {
                visibleQ: false,
                visibleV: true,
                label: '',
                step: 0
            }
        },
        computed: {
            isVisibleQ() {
                return this.visibleQ
            },
            isVisibleV() {
                return this.visibleV
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
                this.visibleQ = true
            })
            this.$nuxt.$on('questionHidden', () => {
                this.visibleQ = false
            })
            this.$nuxt.$on('endSceneTransition', () => {
                this.visibleV = false
            })
        },
        methods: {
            updateScene() {
                this.$nuxt.$emit('startSceneTransition')
            }
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
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

