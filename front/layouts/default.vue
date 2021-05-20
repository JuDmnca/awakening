<template>
  <div>
    <UI-HoldCursor />
    <transition name="fadeOut">
      <IntroLoader v-if="loader" @done="hideLoader" />
    </transition>
    <UI-About />
    <Nuxt />
  </div>
</template>

<script>
export default {
  data () {
    return {
      loader: false
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
