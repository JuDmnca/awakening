<template>
    <transition name='fade'>
        <section class="scene rel">
            <canvas id="canvas" ref="canvas" />
            <FormsQuestion v-if="isVisibleQ" :label="label" :step="step" />
            <EffectsVignettage v-if="isVisibleV" @onscreen="updateScene" />
            <!-- Just to test icons -->
            <UIIconsSound width="40" height="40" iconColor="#fff"/>
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
.scene {
  position: fixed;
  width: 100%;
  height: 100vh;
}
</style>

