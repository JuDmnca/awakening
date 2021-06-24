<template>
  <transition name="fade">
    <p v-if="subtitleVisible" class="subtitle">
      {{ $store.state.subtitle }}
    </p>
  </transition>
</template>

<script>
export default {
  name: 'Subtitle',
  data () {
    return {
      show: false
    }
  },
  computed: {
    subtitleVisible () {
      return this.show
    }
  },
  mounted () {
    this.$nuxt.$on('toggleShowSubtitle', () => {
      this.show = !this.show
    })
  }
}
</script>

<style scoped>
.subtitle {
  font-family: 'ButlerLight';
  font-size: 30px;
  position: absolute;
  color: white;
  bottom: 50px;
  display: flex;
  justify-content: center;
  width: 100vw;
}
</style>
