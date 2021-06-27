<template>
  <div>
    <transition name="fadeOut">
      <IntroLoader v-if="loader && main" @done="hideLoader" />
    </transition>
    <About v-if="about" @clicked="toggleAbout" />
    <UI-HoldCursor />
    <UI-About @clicked="toggleAbout" />
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
      loader: true,
      aboutStatus: false
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
    },
    about () {
      return this.aboutStatus
    }
  },
  methods: {
    hideLoader () {
      this.loader = false
    },
    toggleAbout () {
      this.aboutStatus = !this.aboutStatus
    }
  }
}
</script>
<style scoped>

</style>
