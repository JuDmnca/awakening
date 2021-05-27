<template>
  <div class="constellation">
    <canvas id="canvas" ref="canvas" />
    <transition name="fade">
      <Constellation-Profile v-if="isVisible" />
    </transition>
  </div>
</template>

<script>
import Scene from '../components/World/js/Constellation/Scene'
export default {
  name: 'Constellation',
  data () {
    return {
      isVisible: false,
      profiles: {
        id: null,
        datas: {}
      }
    }
  },
  computed: {
  },
  mounted () {
    // TO DO : Uncomment to send datas user to Firestore
    // if (this.$store.state.userIsOkToSendDatas) {
    //   this.sendDatasUserToFirestore()
    // }
    this.getFirestore()
    // Watch the click of crystal to display a profile
    this.$nuxt.$on('onCrystalClick', () => {
      this.isVisible = !this.isVisible
    })
  },
  methods: {
    async getFirestore () {
      await this.$fire.firestore
        .collection('profiles')
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.profiles.id = doc.id
            this.profiles.datas = doc.data()
            this.$store.commit('constellation/setDatas', this.profiles)
          })
          // eslint-disable-next-line no-new
          new Scene({
            $canvas: this.$refs.canvas
          })
        })
    },
    async sendDatasUserToFirestore () {
      const profilesRef = await this.$fire.firestore.collection('profiles')
      await profilesRef.doc().set({
        nom: this.$store.state.user.name,
        odeur: this.$store.state.user.smell
      })
    }
  }
}
</script>

<style scoped>
body {
  cursor: none;
}

canvas {
    z-index: 0;
    position: absolute;
    top: 0;
}
</style>
