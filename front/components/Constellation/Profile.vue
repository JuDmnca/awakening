<template>
  <section style="color: white;" class="profile">
    <h1>Hello Constellation</h1>
    <h2>{{ $store.state.constellation.currentUser.name }}</h2>
    <h2>{{ $store.state.constellation.currentUser.smell }}</h2>
    <h3 ref="previous">
      Previous
    </h3>
    <h3 ref="next">
      Next
    </h3>
    <button @click="getRandomProfile">
      Random profile
    </button>
    <!-- Just testing upload here -->
    <form @submit.prevent="sendDatasUserToFirebase">
      <input id="input" ref="input" type="file">
      <button type="submit">
        Envoyer
      </button>
      <span v-if="errorMessage" style="color:red">{{ errorMessage }}</span>
    </form>
    <img ref="userImg" class="profile_img" src="">
    <div @click.prevent="$nuxt.$emit('onCrystalClick')">
      <UI-Icons-Cross
        :width="16"
        :height="16"
        :color="'#FFF'"
        class="cross"
      />
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      errorMessage: null,
      fileCompressed: null
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
    })
  },
  methods: {
    // TO DO : Put this function on where we want to upload datas user
    async sendDatasUserToFirebase () {
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
      const storageRef = await this.$fire.storage.ref()
      if (this.$store.state.constellation.currentUser.img) {
        storageRef.child(this.$store.state.constellation.currentUser.img).getDownloadURL()
          .then((url) => {
            const xhr = new XMLHttpRequest()
            xhr.responseType = 'blob'

            xhr.open('GET', url)
            xhr.send()

            const img = this.$refs.userImg
            img.setAttribute('src', url)
          })
          .catch((error) => {
            // Handle any errors
            console.log(error)
          })
      }
    },
    getRandomProfile () {
      this.$store.commit('constellation/getRandomUser')
    }
  }
}
</script>

<style scoped>
.profile {
  position: relative;
  z-index: 10;
  padding: 100px;
  height: 80vh;
}

.profile_img {
  width: 25%;
}

.cross {
  position: absolute;
  top: 100px;
  right: 100px;
}
</style>
