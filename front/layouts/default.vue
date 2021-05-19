<template>
  <div>
    <!-- <World /> -->
    <UI-HoldCursor />
    <transition name="fadeOut">
      <IntroLoader v-if="loader" @done="hideLoader" />
    </transition>
    <Interface-Common />
    <Nuxt />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loader: false
      }
    },
    methods: {
      hideLoader() {
        this.loader = false
      }
    },
  }
</script>
<style scoped>

</style>