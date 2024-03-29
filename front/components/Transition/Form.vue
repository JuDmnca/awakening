<template>
  <div class="form-wrapper">
    <form ref="form" @submit.prevent>
      <label ref="label" class="title-big">{{ label }}</label>
      <input
        v-if="step != 1"
        ref="input"
        :placeholder="placeholder"
        onfocus="this.placeholder = ''"
        name="input"
        type="string"
        required
      >
      <div v-else ref="input" class="colors">
        <input id="red" type="radio" name="color" value="red">
        <label for="red">
          <span class="color" />
          <span class="selected" />
        </label>
        <input id="orange" type="radio" name="color" value="orange">
        <label for="orange">
          <span class="color" />
          <span class="selected" />
        </label>
        <input id="yellow" type="radio" name="color" value="yellow">
        <label for="yellow">
          <span class="color" />
          <span class="selected" />
        </label>
        <input id="green" type="radio" name="color" value="green">
        <label for="green">
          <span class="color" />
          <span class="selected" />
        </label>
        <input id="blue" type="radio" name="color" value="blue">
        <label for="blue">
          <span class="color" />
          <span class="selected" />
        </label>
        <input id="purple" type="radio" name="color" value="purple">
        <label for="purple">
          <span class="color" />
          <span class="selected" />
        </label>
      </div>
    </form>
    <div ref="button" class="button button-wrapper" @click="sendValidation">
      <button>
        {{ confirmation }}
      </button>
      <transition name="fade">
        <p v-if="errorMessage" class="error_message">
          {{ errorMessage }}
        </p>
      </transition>
    </div>
  </div>
</template>

<script>
import gsap from 'gsap'
export default {
  name: 'QForm',
  props: {
    label: {
      type: String,
      default: '',
      required: true
    },
    placeholder: {
      type: String,
      default: 'Pierre',
      required: false
    },
    step: {
      type: Number,
      default: 0,
      required: false
    },
    confirmation: {
      type: String,
      default: '',
      required: false
    }
  },
  data () {
    return {
      question: '',
      input: '',
      errorMessage: '',
      sent: false
    }
  },
  mounted () {
    this.input = this.$refs.input
    this.question = this.$refs.label
    this.button = this.$refs.button

    gsap.to(this.question, {
      y: -60,
      scale: 0.7,
      duration: 2,
      delay: 2,
      ease: 'power3.inOut',
      onComplete: this.showInput
    })
  },
  methods: {
    showInput () {
      if (this.step === 1) {
        const inputs = this.input.querySelectorAll('.color')
        gsap.from(inputs, {
          y: +30,
          duration: 1,
          ease: 'power3.inOut',
          stagger: 0.1
        })
        gsap.to(inputs, {
          opacity: 1,
          duration: 1,
          ease: 'power3.inOut',
          stagger: 0.1
        })
        gsap.to(this.button, { opacity: 1, duration: 1, ease: 'power3.inOut' })
      } else {
        gsap.from(this.input, { y: +30, duration: 1, ease: 'power3.inOut' })
        gsap.to([this.input, this.button], {
          opacity: 1,
          duration: 1,
          ease: 'power3.inOut'
        })
      }
    },
    sendValidation (e) {
      if (!this.sent) {
        e.preventDefault()
        this.sent = !this.sent
        let data = this.$refs.input.value

        if (this.step === 1) {
          const colors = document.getElementsByName('color')
          for (let i = 0; i < colors.length; i++) {
            if (colors[i].checked) { data = colors[i].id }
          }
        }

        // UNCOMMENT ON PROD
        if (!data) {
          this.errorMessage = 'Il faut choisir une couleur pour continuer le voyage'
        } else if (!data) {
          this.errorMessage = 'Il faut répondre pour continuer le voyage'
        } else if (data) {
          this.errorMessage = ''
          this.$emit('validation', data)
        }
      }
    }
  }
}
</script>

<style scoped>
.form-wrapper {
  z-index: 5;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

form {
  width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

label {
  font-size: 40px;
  will-change: transform;
}

input {
  max-width: 250px;
  opacity: 0;
  text-align: center;
  font-size: 24px;
  color: white;
  padding-bottom: 10px;
  border-bottom: 1px #fff solid;
  z-index: 10;
  will-change: transform;
}

input::placeholder {
  color: white;
  opacity: 0.4;
}

.error_message {
  position: absolute;
  bottom: 130%;
}

.colors {
  width: 70%;
  display: flex;
  justify-content: space-between;
}

input[type="radio"] {
  display: none;
}

.color {
  opacity: 0;
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.button-wrapper {
  text-align: center;
  width: 300px;
}

.selected {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  display: inline-block;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  transition: all ease-out 0.2s;
}

input[type="radio"] + label {
  position: relative;
  padding: 0 20px;
  transition: all ease-out 0.3s;
}

input[type="radio"]#red + label .selected,
input[type="radio"]#orange + label .selected,
input[type="radio"]#yellow + label .selected,
input[type="radio"]#green + label .selected,
input[type="radio"]#blue + label .selected,
input[type="radio"]#purple + label .selected
{
  background: radial-gradient(white 0%, black 80%);
  opacity: 0;
  z-index: -1;
}

input[type="radio"]#red + label .color {
  background-color: #E83100;
}

input[type="radio"]#orange + label .color {
  background-color: #e8721f;
}

input[type="radio"]#yellow + label .color {
  background-color: #edc52c;
}

input[type="radio"]#green + label .color {
  background-color: #7bbd22;
}

input[type="radio"]#blue + label .color {
  background-color: #1281ab;
}

input[type="radio"]#purple + label .color {
  background-color: #7b4ea3;
}

input[type="radio"] + label:hover {
  transform: translateY(-10px);
}

input[type="radio"]:checked + label .selected {
  opacity: 0.3 !important;
}

.button {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, 0);
  transition: opacity 0.3s ease;
  color: white !important;
}

.button {
  opacity: 0;
  font-size: 12px;
}
</style>
