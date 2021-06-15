<template>
  <section class="question">
    <label ref="label" class="">
      Nous autorisez-vous à activer votre micro afin de réaliser <br> des interactions au cours de cette expérience ?
    </label>
    <div ref="button" class="buttons">
      <button type="submit" @click="storeInfo(true)">
        J'accepte
      </button>
      <button type="submit" @click="storeInfo(false)">
        Non merci
      </button>
    </div>
  </section>
</template>

<script>
import gsap from 'gsap'

export default {
  mounted () {
    this.label = this.$refs.label
    this.button = this.$refs.button

    gsap.to(this.label, {
      y: -60,
      scale: 0.7,
      duration: 1,
      delay: 2,
      ease: 'power3.out',
      onComplete: this.showButtons
    })
  },
  methods: {
    showButtons () {
      gsap.to(this.button, { opacity: 1, duration: 1, ease: 'power3.out' })
    },
    storeInfo (value) {
      this.$store.commit('setUserMic', value)
      this.$emit('done')
    }
  }
}
</script>

<style>
.question {
  position: absolute;
  width: 1100px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.buttons {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  color: white;
}

.buttons button:last-of-type {
  margin-left: 50px;
  color: #888888;
  margin-right: 0;
}

.buttons {
  opacity: 0;
  display: flex;
  font-size: 12px;
}
</style>
