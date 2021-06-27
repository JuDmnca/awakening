<template>
  <transition name="fade">
    <section v-if="showIcons" class="common">
      <div class="button-wrapper about" @click="openAbout">
        ABOUT
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
  computed: {
    showIcons () {
      return this.showCommon
    }
  },
  mounted () {
    this.$nuxt.$on('startExperience', () => {
      this.showCommon = true
    })
    if (this.$route.fullPath === '/constellation') {
      this.showCommon = true
    }
  },
  methods: {
    openAbout () {
      this.$emit('clicked')
    }
  }
}
</script>

<style scoped>
.about {
  position: absolute;
  bottom: 30px;
  left: 30px;
  z-index: 10;
  color: white;
}
</style>
