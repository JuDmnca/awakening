<template>
  <section class="transition-container">
    <transition name="fadeCanvas">
      <TransitionBackground />
    </transition>
    <transition name="fade">
      <TransitionSentence
        v-if="showText"
        :step="step"
      />
      <TransitionQuestion
        v-if="!showText && !end"
        :placeholder="placeholder"
        :step="step"
        :label="label"
        :confirmation="confirmation"
        @validation="endTransition"
      />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'TransitionContainer',
  props: {
    step: {
      type: Number,
      default: 0,
      required: false
    }
  },
  data () {
    return {
      text: true,
      end: false,
      label: '',
      placeholder: '',
      confirmation: ''
    }
  },
  computed: {
    showText () {
      return this.text
    }
  },
  mounted () {
    if (this.step === 2) {
      this.label = 'Quelle odeur vous a déjà procuré une telle sensation ?'
      this.placeholder = 'La vanille'
    } else {
      this.label = 'Existe-t-il une mélodie qui ferait renaitre en vous un souvenir particulier ?'
      this.placeholder = 'Le bruit des vagues'
    }
    this.confirmation = 'Valider mon souvenir'
    setTimeout(() => {
      this.showQuestion()
    }, 7000)
  },
  methods: {
    endTransition () {
      this.$nuxt.$emit('endSceneTransition')
      this.end = true
      setTimeout(() => {
        this.$nuxt.$emit('endTransition')
      }, 2000)
    },
    showQuestion () {
      this.text = false
    }
  }
}
</script>

<style>
.transition-container {
  width: 100%;
  height: 100vh;
}
</style>
