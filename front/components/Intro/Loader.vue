<template>
  <section class="loader__container">
    <transition name="fade">
      <div v-if="!endLoaded" class="container">
        <p class="text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor.
        </p>
        <div class="loader">
          <div class="progress" :style="progress" />
          <span style="display: none">{{ completed }}</span>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-if="loaded" class="loader__btn">
        <button @click="startIntro()">
          Redécouvrir mes sens
        </button>
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
        @done="nextQuestion"
      />
      <IntroMic
        v-if="showMic"
        @done="nextQuestion"
      />
      <FormsQuestion
        v-if="showColor"
        :label="'Quelle est la couleur de votre humeur aujourd’hui ?'"
        :step="1"
        :confirmation="`Commencer l'expérience`"
        @done="startExperience"
      />
    </transition>
  </section>
</template>

<script>
export default {
  data () {
    return {
      loaded: false,
      endLoaded: false,
      started: false,
      showLogo: false,
      showName: false,
      showMic: false,
      showColor: false
    }
  },
  computed: {
    progress () {
      return {
        width: `${this.$store.state.loading / 5}%`
      }
    },
    completed () {
      if (this.$store.state.loading === 500) {
        this.$nuxt.$emit('loaded')
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    this.$nuxt.$on('loaded', () => {
      this.endLoaded = true
      setTimeout(() => {
        this.loaded = true
      }, 1000)
    })
    this.$nuxt.$on('started', () => {
      setTimeout(() => {
        this.started = true
      }, 1000)
      setTimeout(() => {
        this.showLogo = true
      }, 3500)
      setTimeout(() => {
        this.showLogo = false
      }, 7000)
      setTimeout(() => {
        this.showName = true
      }, 8000)
    })
  },
  methods: {
    nextQuestion () {
      if (this.showName) {
        this.showName = false
        setTimeout(() => {
          this.showMic = true
        }, 1000)
      } else {
        this.showMic = false
        setTimeout(() => {
          this.showColor = true
        }, 1000)
      }
    },
    startExperience () {
      this.showColor = false
      setTimeout(() => {
        this.$emit('done')
        this.$nuxt.$emit('startExperience')
      }, 1000)
    },
    startIntro () {
      this.loaded = false
      this.$nuxt.$emit('started')
    }
  }
}
</script>

<style>
.loader__container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
  background-color: black;
}

.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.loader {
  border-radius: 10px;
  width: 200px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.5);
  margin-top: 200px;
}

.progress {
  border-radius: 8px;
  width: 0px;
  height: 3px;
  background-color: #fff;
  transition: 0.5s ease-in-out width;
}

.logo {
  width: 40px;
}
</style>
