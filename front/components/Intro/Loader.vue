<template>
  <section>
    <transition name="fade">
      <div v-if="!loaded" class="loader">
        <div class="progress" />
      </div>
    </transition>
    <transition name="fade">
      <div v-if="showLogo">
        <img class="logo" src="~/assets/svg/monogram.svg" alt="">
      </div>
    </transition>
    <transition name="fade">
      <FormsQuestion
        v-if="showName"
        :label="'Quel est votre surnom ?'"
        :step="0"
        :confirmation="`C'est bon`"
      />
    </transition>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        loaded: false,
        showLogo: false,
        showName: false
      }
    },
    mounted() {
      setTimeout(() => {
        this.loaded = true
      }, 500)
      setTimeout(() => {
        this.showLogo = true
      }, 1500)
      setTimeout(() => {
        this.showLogo = false
      }, 3500)
      setTimeout(() => {
        this.showName = true
      }, 4500)
    },
  }
</script>

<style>
section {
  position: absolute;
  width: 100%;
  height: 100vh;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  background-color: black;
}

.loader {
  border-radius: 10px;
  width: 200px;
  height: 5px;
  background-color: rgba(255, 255, 255, 0.5);
}

.progress {
  border-radius: 8px;
  width: 20px;
  height: 5px;
  background-color: #fff;
  transition: 0.32s ease-out width;
}

.logo {
  width: 40px;
}
</style>

