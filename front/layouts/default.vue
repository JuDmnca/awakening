<template>
  <div>
    <transition name="fadeOut">
      <IntroLoader v-if="loader && main" @done="hideLoader" />
    </transition>
    <UI-HoldCursor />
    <UI-About />
    <Nuxt />
    <World />
    <Subtitle />
    <Bar-Progress />
  </div>
</template>

<script>
import World from '~/components/World/index'
import Subtitle from '~/components/Subtitles/Subtitle'

export default {
  components: {
    World,
    Subtitle
  },
  data () {
    return {
      loader: true
    }
  },
  computed: {
    main () {
      if (this.$nuxt.$route.path === '/') {
        this.$nuxt.$emit('PlayRender')
        return true
      } else {
        this.$nuxt.$emit('PauseRender')
        return false
      }
    }
  },
  methods: {
    hideLoader () {
      this.loader = false
    }
  }
}
</script>
<style scoped>

</style>
