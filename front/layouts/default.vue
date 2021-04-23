<template>
  <div>
    <World />
    <UI-HoldCursor />
    <transition name="fadeOut">
      <IntroLoader v-if="loader" @done="hideLoader" />
    </transition>
    <Interface-Common />
    <Nuxt />
  </div>
</template>

<script>
  import World from '~/components/World/index'

  export default {
    components: {
      World
    },
    data() {
      return {
        loader: true
      }
    },
    methods: {
      hideLoader() {
        this.loader = false
      }
    },
  }
</script>
