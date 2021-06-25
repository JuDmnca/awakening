<template>
  <div class="container">
    <transition name="fade">
      <div v-if="show" class="progress progress--grey" />
    </transition>
    <transition name="fade">
      <div v-if="show" ref="progressWhite" class="progress progress--white" />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Progress',
  data () {
    return {
      show: false
    }
  },
  mounted () {
    // IF WE WANT TO USE THE COLOR OF USER FOR THE PROGRESS BAR
    // this.$nuxt.$on('swoosh', () => {
    //   this.$refs.progressWhite.style.backgroundColor = this.$store.state.user.color
    // })

    this.$nuxt.$on('showProgressBar', () => { this.show = true })

    this.$nuxt.$on('sporesElevation', (sporesLevel) => {
      if (sporesLevel < 100 && this.show) {
        this.fillProgressBar(sporesLevel)
      } else if (this.show) {
        this.onProgressBarCompleted()
      }
    })

    this.$nuxt.$on('startTransition', () => {
      this.show = false
    })
  },
  methods: {
    fillProgressBar (sporesLevel) {
      this.$refs.progressWhite.style.width = sporesLevel * 2.5 + 'px'
    },
    onProgressBarCompleted () {
      this.$refs.progressWhite.style.width = '250px'
      this.$store.commit('desert/setCanInhaleOnHold', true)
      this.show = false
      setTimeout(() => {
        this.$store.commit('setSubtitle', 'Et s\'il suffisait d\'une inspiration ?')
        this.$nuxt.$emit('toggleShowSubtitle')
        setTimeout(() => {
          this.$nuxt.$emit('toggleShowSubtitle')
        }, 4000)
      }, 1000)
    }
  }
}
</script>

<style scoped>
.container {
  width: 200px;
  display: flex;
  margin: auto;
}

.progress {
    position: absolute;
    border-radius: initial;
    width: 250px;
    background: grey;
    margin: auto;
    bottom: 55px;
    height: 6px;
}

.progress--grey::after {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    border: solid 1px white;
    box-sizing: border-box;
    border-radius: 9999px;
    left: -33px;
    top: -1px;
}

.progress--grey::before {
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    background: white;
    border-radius: 9999px;
    right: -33px;
    top: -1px;
}

.progress--white {
  background: white;
  width: 0%;
}
</style>
