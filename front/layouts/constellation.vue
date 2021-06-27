<template>
  <div>
    <transition name="fade">
      <About v-if="about" @clicked="toggleAbout" />
    </transition>
    <transition name="fade">
      <Constellation-Intro v-if="intro" @end="toggleIntro" />
    </transition>
    <UI-HoldCursor />
    <UI-About @clicked="toggleAbout" />
    <Nuxt />
  </div>
</template>

<script>
export default {
  data () {
    return {
      aboutStatus: false,
      introStatus: true
    }
  },
  computed: {
    about () {
      return this.aboutStatus
    },
    intro () {
      return this.introStatus
    }
  },
  methods: {
    toggleAbout () {
      this.aboutStatus = !this.aboutStatus
    },
    toggleIntro () {
      this.introStatus = !this.introStatus
    }
  }
}
</script>
