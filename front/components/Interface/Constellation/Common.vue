<template>
  <section style="color: white;" class="common-constellation">
      <h1>Hello Constellation</h1>
      <h2>{{ this.$store.state.constellation.dataUsers.name }}</h2>
      <h2>{{ this.$store.state.constellation.dataUsers.smell }}</h2>
  </section>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    mounted() {
      setInterval(() => {
        this.$store.state.constellation.dataUsers.smell
      }, 1000)

    },
  }
</script>

<style scoped>
.common-constellation {
  z-index: 10;
}
</style>

