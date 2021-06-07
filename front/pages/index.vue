<template>
  <div class="container">
    <UI-HoldCursor />
    <World />
    <transition name="fade">
      <div v-if="animation" class="animation">
        <lottie
          :width="100"
          :height="100"
          style="margin-top: 200px;"
          :options="lottieOptions"
          @animCreated="handleAnimation"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import lottie from 'vue-lottie/src/lottie.vue'
// Test Icon : TO DO : PUT real animations
import * as scrollData from '@/assets/lottie/scroll-test.json'
import * as hoverData from '@/assets/lottie/hover-test.json'
import * as holdData from '@/assets/lottie/hold-test.json'
import World from '~/components/World/index'

export default {
  components: {
    World,
    lottie
  },
  data () {
    return {
      animation: false,
      anim: null, // for saving the reference to the animation
      lottieOptions: { animationData: scrollData.default }
    }
  },
  mounted () {
    this.$nuxt.$on('handleScrollAnimation', () => {
      // this.animation = !this.animation
    })
    this.$nuxt.$on('handleHoverAnimation', () => {
      this.lottieOptions = { animationData: hoverData.default }
      // this.animation = !this.animation
    })
    this.$nuxt.$on('handleHoldAnimation', () => {
      this.lottieOptions = { animationData: holdData.default }
      // this.animation = !this.animation
    })
  },
  methods: {
    handleAnimation (anim) {
      this.anim = anim
    }
  }
}
</script>

<style>
body {
  background-color: black;
  cursor: none;
}
</style>
