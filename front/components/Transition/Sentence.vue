<template>
  <section class="sentence">
    <transition name="fade">
      <p class="title-big">
        {{ text }}
      </p>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'Sentence',
  props: {
    step: {
      type: Number,
      default: 0,
      required: false
    }
  },
  data () {
    return {
      text: ''
    }
  },
  mounted () {
    console.log(this.step)
    if (this.step === 2) {
      this.text = 'Vous êtes enivré par le parfum des fleurs.'
    } else {
      this.text = 'Votre mélodie à éveillé une force chez le papillon.'
    }
  }
}
</script>

<style>
.sentence {
  position: absolute;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
}

.sentence p {
  color: white;
}
</style>
