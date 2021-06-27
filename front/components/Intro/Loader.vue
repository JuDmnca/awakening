<template>
  <section class="loader__container">
    <transition name="fade">
      <div class="container">
        <transition name="fade">
          <p v-if="showIntroParagraph" class="container__inner container__inner--top title-big">
            Certaines périodes peuvent nous faire perdre ce qui nous relie à nous-même.
          </p>
        </transition>
        <transition name="fade">
          <p v-if="showIntroParagraph2" class="container__inner container__inner--top title-big">
            Ce lien peut être retrouvé <br>à travers l'éveil de nos sens.
          </p>
        </transition>
        <transition name="fade">
          <div v-if="!endLoaded" class="loader container__inner container__inner--bottom">
            <div class="progress" :style="progress" />
            <span style="display: none">{{ completed }}</span>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="loaded" class="container__inner container__inner--bottom">
            <div ref="button" class="button-wrapper" @click="startIntro()">
              <button>
                Redécouvrir mes sens
              </button>
            </div>
          </div>
        </transition>
        <transition name="fade">
          <div v-if="showLogo" class="container__logo">
            <img class="logo" src="~/assets/svg/monogram.svg" alt="">
          </div>
        </transition>
      </div>
    </transition>
    <transition name="fade">
      <TransitionQuestion
        v-if="showName"
        :label="'Comment voulez-vous vous appeler ?'"
        :step="0"
        :confirmation="`C'est bon`"
        @done="nextQuestion"
      />
      <IntroMic
        v-if="showMic"
        @done="nextQuestion"
      />
      <TransitionQuestion
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
      showIntroParagraph: true,
      showIntroParagraph2: false,
      showLogo: false,
      showName: false,
      showMic: false,
      showColor: false
    }
  },
  computed: {
    progress () {
      return {
        width: `${this.$store.state.loading / 6}%`
      }
    },
    completed () {
      if (this.$store.state.loading === 600) {
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
      this.showIntroParagraph = false
      setTimeout(() => {
        this.showIntroParagraph2 = true
      }, 2000)
      setTimeout(() => {
        this.loaded = true
      }, 3000)
    })
    this.$nuxt.$on('started', () => {
      setTimeout(() => {
        this.started = true
      }, 1000)
      setTimeout(() => {
        this.showColor = true
      }, 3500)
      // setTimeout(() => {
      //   this.showLogo = false
      // }, 7000)
      // setTimeout(() => {
      //   this.showName = true
      // }, 8000)
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
      this.$nuxt.$emit('swoosh')
      setTimeout(() => {
        this.$emit('done')
        this.$nuxt.$emit('startExperience')
      }, 1000)
    },
    startIntro () {
      this.loaded = false
      this.showIntroParagraph2 = false
      this.$nuxt.$emit('started')
    }
  }
}
</script>

<style scoped>
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
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
}

.container__inner {
  text-align: center;
}

.container__inner--top {
  margin: auto;
  width: 1100px;
  color: white;
}

.container__inner--bottom {
  position: absolute;
  bottom: 100px;
}

.loader {
  border-radius: 10px;
  width: 200px;
  height: 3px;
  background-color: rgba(255, 255, 255, 0.5);
}

.loader__btn {
  margin-top: 200px;
}

.progress {
  border-radius: 8px;
  width: 0px;
  height: 3px;
  background-color: #fff;
  transition: 0.5s ease-in-out width;
}

.container__logo {
  height: 100vh;
  display: flex;
}

.logo {
  width: 40px;
  margin: auto;
}
</style>
