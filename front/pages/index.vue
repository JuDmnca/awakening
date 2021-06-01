<template>
  <div class="container">
    <UI-HoldCursor />
    <World />
    <transition name="fade">
      <div v-if="loading" class="loading">
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
// Test Icon : TO DO : PUT real animation
import * as animationData from '@/assets/lottie/scroll-test.json'
import World from '~/components/World/index'

export default {
  components: {
    World,
    lottie
  },
  data () {
    return {
      loading: false,
      anim: null, // for saving the reference to the animation
      lottieOptions: { animationData: animationData.default }
    }
  },
  mounted () {
    this.$nuxt.$on('handleScrollAnimation', () => {
      this.loading = !this.loading
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
