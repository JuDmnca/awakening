<template>
  <div class="constellation__intro">
    <transition name="fade">
      <p v-if="showFirst" class="container__inner container__inner--top title-big">
        Vous vous êtes reconnecté <br>à vous-même…
      </p>
    </transition>
    <transition name="fade">
      <p v-if="showSecond" class="container__inner container__inner--top title-big">
        …Etes-vous prêt <br>à vous reconnecter aux autres ?
      </p>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Subtitle',
  data () {
    return {
      first: true,
      second: false
    }
  },
  computed: {
    showFirst () {
      return this.first
    },
    showSecond () {
      return this.second
    }
  },
  mounted () {
    setTimeout(() => {
      this.first = false
    }, 4000)
    setTimeout(() => {
      this.second = true
    }, 5000)
    setTimeout(() => {
      this.second = false
    }, 9000)
    setTimeout(() => {
      this.$emit('end')
    }, 10000)
  }
}
</script>

<style scoped>
.constellation__intro {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  background: black;
  color: white;
  text-align: center;
}
</style>
