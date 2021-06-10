<template>
  <div>
    <transition name="fadeOut">
      <!-- <IntroLoader v-if="loader && main" @done="hideLoader" /> -->
    </transition>
    <UI-About />
    <Nuxt />
  </div>
</template>

<script>
export default {
  data () {
    return {
      loader: true
    }
  },
  computed: {
    main () {
      if (this.$nuxt.$route.path === '/') {
        return true
      } else {
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
