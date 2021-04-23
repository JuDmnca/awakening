<template>
  <div>
    <World />
    <UI-HoldCursor />
    <!-- <IntroLoader /> -->
    <Nuxt />
  </div>
</template>

<script>
  import World from '~/components/World/index'

  export default {
    components: {
      World
    }
  }
</script>
