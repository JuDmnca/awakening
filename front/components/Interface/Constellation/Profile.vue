<template>
  <section style="color: white;" class="common-constellation">
      <h1>Hello Constellation</h1>
      <h2>{{ this.$store.state.constellation.dataUsers.name }}</h2>
      <h2>{{ this.$store.state.constellation.dataUsers.smell }}</h2>
      <h3 ref="previous">Previous</h3>
      <h3 ref="next">Next</h3>
      <!-- <UI-Icons-Cross :width="16" :height="16" :color="'#FFF'" class="cross" ref="cross" :toClose="true"/> -->
  </section>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    mounted() {
      this.$refs.previous.addEventListener('click', () => {
       this.$store.commit('constellation/switchUser', 'Previous') 
      })
      this.$refs.next.addEventListener('click', () => {
       this.$store.commit('constellation/switchUser', 'Next') 
      })
    },
    updated() {
    }
  }
</script>

<style scoped>
.common-constellation {
  z-index: 10;
  padding: 100px
}

.cross {
  position: absolute;
  top: 100px;
  right: 100px;
}
</style>

