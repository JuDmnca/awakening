<template>
  <transition name="fade">
    <section v-if="showCommon" class="common">
      <button class="about">
        ABOUT
      </button>
      <UI-Icons-Sound width="40" height="40" icon-color="#fff" />
    </section>
  </transition>
</template>

<script>
export default {
  data () {
    return {
      showCommon: false
    }
  },
  mounted () {
    this.$nuxt.$on('started', () => {
      this.showCommon = true
    })
  }
}
</script>

<style>
  .about {
    position: absolute;
    bottom: 50px;
    left: 50px;
    z-index: 10;
  }
</style>
