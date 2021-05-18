<template>
  <div class="container">
    <UI-HoldCursor />
    <World />
  </div>
</template>

<script>
import World from '~/components/World/index'

export default {
  components: {
    World
  },
}
</script>

<style>
body {
  background-color: black;
  cursor: none;
}
</style>
