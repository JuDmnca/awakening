<template>
  <transition name="fade">
    <div v-if="show" ref="progress" class="progress" />
  </transition>
</template>

<script>
export default {
  name: 'Progress',
  data () {
    return {
      show: true
    }
  },
  mounted () {
    this.$nuxt.$on('swoosh', () => {
      this.$refs.progress.style.backgroundColor = this.$store.state.user.color
    })
    this.$nuxt.$on('sporesElevation', (sporesLevel) => {
      if (sporesLevel < 100) {
        this.$refs.progress.style.width = sporesLevel + 'vw'
      } else {
        this.$refs.progress.style.width = '100vw'
        this.$store.commit('desert/setCanInhaleOnHold', true)
      }
    })
    this.$nuxt.$on('startTransition', () => {
      this.show = false
    })
  },
  methods: {

  }
}
</script>

<style scoped>
.progress {
    position: absolute;
    border-radius: initial;
    bottom: 0;
    left: 0;
    height: 5px;
    width: 0vw;
}
</style>
