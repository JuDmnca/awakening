<template>
  <section style="color: white;" class="common-constellation">
    <h1>Hello Constellation</h1>
    <h2>{{ $store.state.constellation.currentUser.name }}</h2>
    <h2>{{ $store.state.constellation.currentUser.smell }}</h2>
    <h3 ref="previous">
      Previous
    </h3>
    <h3 ref="next">
      Next
    </h3>
    <img ref="userImg" src="">
    <form @submit.prevent="sendDatasUserToFirestore">
      <input id="input" ref="input" type="file">
      <button type="submit">
        Envoyer
      </button>
      <span v-if="errorMessage" style="color:red">{{ errorMessage }}</span>
    </form>
    <!-- <UI-Icons-Cross :width="16" :height="16" :color="'#FFF'" class="cross" ref="cross" :toClose="true"/> -->
  </section>
</template>

<script>
export default {
  data () {
    return {
      errorMessage: null
    }
  },
  mounted () {
    this.getProfilePicture()
    this.$refs.previous.addEventListener('click', () => {
      this.$store.commit('constellation/switchUser', 'Previous')
    })
    this.$refs.next.addEventListener('click', () => {
      this.$store.commit('constellation/switchUser', 'Next')
    })
  },
  updated () {
    this.$nextTick(function () {
      this.getProfilePicture()
    // Code that will run only after the
    // entire view has been re-rendered
    })
  },
  methods: {
    // TO DO : Put this function on where we want to upload the img
    async sendDatasUserToFirestore () {
      let fileName = this.$refs.input.files[0].name

      // Quick verification of the type of the image
      if (fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png') || fileName.includes('.svg')) {
        // I put the id of the user at the beginning of the name of his picture to link the pic to the user
        fileName = parseInt(this.$store.state.constellation.dataUsers.length + 1) + fileName
        // Image's user pushed in the firebase storage
        const ppStorageRef = await this.$fire.storage.ref().child('pp/' + fileName)
        ppStorageRef.put(this.$refs.input.files[0]).then((snapshot) => {
          console.log('Uploaded a blob or file!', fileName)
        })

        // Profiles info pushed in the firestore db
        const profilesRef = await this.$fire.firestore.collection('profiles')
        await profilesRef.doc().set({
          nom: this.$store.state.user.name,
          odeur: this.$store.state.user.smell,
          img: 'pp/' + fileName
        })
        this.errorMessage = null
      } else {
        this.errorMessage = 'Le format du fichier n\'est pas accepté'
      }
    },
    async getProfilePicture () {
      // console.log('youhouuuu', this.$store.state.constellation.currentUser.img)
      const storageRef = await this.$fire.storage.ref()
      if (this.$store.state.constellation.currentUser.img) {
        storageRef.child(this.$store.state.constellation.currentUser.img).getDownloadURL()
          .then((url) => {
            // This can be downloaded directly:
            const xhr = new XMLHttpRequest()
            xhr.responseType = 'blob'

            xhr.open('GET', url)
            xhr.send()

            // Or inserted into an <img> element
            const img = this.$refs.userImg
            img.setAttribute('src', url)
          })
          .catch((error) => {
            // Handle any errors
            console.log(error)
          })
      }
    }
  }
}
</script>

<style scoped>
.common-constellation {
  position: relative;
  z-index: 10;
  padding: 100px
}

.cross {
  position: absolute;
  top: 100px;
  right: 100px;
}
</style>
