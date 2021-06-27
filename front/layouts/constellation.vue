<template>
  <div>
    <About v-if="about" @clicked="toggleAbout" />
    <UI-HoldCursor />
    <UI-About @clicked="toggleAbout" />
    <Nuxt />
  </div>
</template>

<script>
export default {
  data () {
    return {
      aboutStatus: false
    }
  },
  computed: {
    about () {
      return this.aboutStatus
    }
  },
  methods: {
    toggleAbout () {
      this.aboutStatus = !this.aboutStatus
    }
  }
}
</script>
