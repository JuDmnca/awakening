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
    if (this.step === 2) {
      this.text = 'Vos narines se remplissent du parfum enivrant des fleurs et une sensation de bien-être vous submerge.'
    } else {
      this.text = 'Votre mélodie à éveillé une force chez le papillon blablabla.'
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
  transform: scale(0.7);
  text-align: center;
}
</style>
