<template>
  <transition name="fade">
    <section v-if="showCommon" class="common">
      <div class="button-wrapper about">
        <n-link to="about">
          ABOUT
        </n-link>
      </div>
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
  bottom: 30px;
  left: 30px;
  z-index: 10;
}
.about a {
  color: white;
}
</style>
