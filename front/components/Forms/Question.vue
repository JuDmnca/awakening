<template>
  <section class="question" :style="style">
    <transition name="fadeCanvas">
      <FormsBackground v-if="!intro" />
    </transition>
    <transition name="fade">
      <FormsForm
        :placeholder="placeholder"
        :step="step"
        :label="label"
        :confirmation="confirmation"
        @validation="storeInfo"
      />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'Question',
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
    color: {
      type: String,
      default: 'white',
      required: false
    },
    confirmation: {
      type: String,
      default: '',
      required: false
    },
    intro: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  async asyncData ({ app }) {
    // const ref = app.$fire.database.ref('users/julie/name')
    // ref.on('value', (snapshot) => {
    //   const data = snapshot.val();
    // })
  },
  data () {
    return {
      button: ''
    }
  },
  computed: {
    style () {
      return {
        color: this.color
      }
    }
  },
  methods: {
    storeInfo (data) {
      switch (this.step) {
        case 0:
          this.$store.commit('setUserName', data)
          this.$emit('done')
          break
        case 1:
          this.$store.commit('setUserColor', data)
          this.$emit('done')
          this.$nuxt.$emit('ColorSetted')
          break
        case 2:
          this.$store.commit('setUserSmell', data)
          break
        case 3:
          this.$store.commit('setUserTaste', data)
          break
        case 4:
          this.$store.commit('setUserSound', data)
          break
      }
      if (this.step > 1) {
        this.$nuxt.$emit('endSceneTransition')
        this.$nuxt.$emit('questionHidden')
      }
    },
    other () {
      // PUSH INFO TO FIREBASE : TO DO LATER AT THE END
      // const newUser = this.$fire.database.ref('users/').push({
      //     name: name,
      //     color: ''
      // })
      // const userId = newUser.key
      // this.$fire.database.ref('users/' + this.$store.state.user.id).update({
      //     color: color
      // })
    }
  }
}
</script>

<style>
    .question {
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 3;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
