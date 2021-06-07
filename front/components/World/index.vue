<template>
  <transition name="fade">
    <section class="scene rel">
      <canvas id="canvas" ref="canvas" />
      <FormsQuestion
        v-if="isVisibleQ"
        :label="label"
        :step="step"
        :placeholder="placeholder"
        :confirmation="confirmation"
        :intro="false"
      />
      <EffectsVignettage v-if="isVisibleV" @onscreen="updateScene" />
      <!-- Just to test icons -->
      <!-- <UI-IconsSound width="40" height="40" iconColor="#fff"/> -->
    </section>
  </transition>
</template>

<script>
import Scene from './js/Scene'

export default {
  name: 'Scene',
  data () {
    return {
      visibleQ: false,
      visibleV: true,
      label: '',
      placeholder: '',
      confirmation: '',
      step: 0
    }
  },
  computed: {
    isVisibleQ () {
      return this.visibleQ
    },
    isVisibleV () {
      return this.visibleV
    }
  },
  mounted () {
    // eslint-disable-next-line no-new
    new Scene({
      $canvas: this.$refs.canvas
    })
    this.$nuxt.$on('questionVisible', (step) => {
      this.step = step
      if (step === 2) {
        this.label = 'Quelle odeur vous a déjà procuré une telle sensation ?'
        this.placeholder = 'La vanille'
        this.confirmation = 'Confirmer'
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
    updateScene () {
      this.$nuxt.$emit('startSceneTransition')
    }
  }
}
</script>

<style scoped>
.scene {
  position: fixed;
  width: 100%;
  height: 100vh;
}

canvas {
    position: fixed;
    top: 0;
    left: 0;
}
</style>
