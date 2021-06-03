<template>
  <section style="color: white;" class="profile flex flex-col items-center">
    <img ref="userImg" class="profile__img" src="">
    <h2 class="profile__name">
      <span>{{ $store.state.constellation.currentUser.name }} </span>
    </h2>
    <p class="profile__description small">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultrices quam sed neque placerat, non laoreet magna viverra. Sed maximus eros non dui cursus condimentum. Vestibulum libero nisl, feugiat quis magna id, iaculis pretium ante. Duis sem felis, accumsan ut quam et, tincidunt sagittis odio.
    </p>
    <div class="profile__responses flex flex-col w-1/2">
      <div class="responses flex flex-col">
        <p class="small">
          Votre odeur
        </p>
        <h2 class="responses__title">
          {{ $store.state.constellation.currentUser.smell }}
        </h2>
      </div>
      <div class="responses flex flex-col">
        <p class="small">
          Votre son
        </p>
        <h2 class="responses__title">
          Les klaxons
        </h2>
      </div>
    </div>
    <!-- <h3 ref="previous">
      Previous
    </h3>
    <h3 ref="next">
      Next
    </h3> -->
    <!-- <button @click="getRandomProfile">
      Random profile
    </button> -->
    <!-- Just testing upload here -->
    <!-- <form @submit.prevent="sendDatasUserToFirebase">
      <input id="input" ref="input" type="file">
      <button type="submit">
        Envoyer
      </button>
      <span v-if="errorMessage" style="color:red">{{ errorMessage }}</span>
    </form> -->
    <div class="absolute border border-white rounded-full close p-6" @click.prevent="$nuxt.$emit('onCrystalClick')">
      <UI-Icons-Cross
        :width="16"
        :height="16"
        :color="'#FFF'"
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
    // this.$refs.previous.addEventListener('click', () => {
    //   this.$store.commit('constellation/switchUser', 'Previous')
    // })
    // this.$refs.next.addEventListener('click', () => {
    //   this.$store.commit('constellation/switchUser', 'Next')
    // })
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
  font-family: 'ButlerLight';
  font-weight: 300;
  position: relative;
  z-index: 10;
  padding: 0 100px 100px 100px;
  font-size: 44px;
}

.profile__name {
  font-family: 'Butler';
  margin: 49px 0 49px 0;
  position: relative;
  background: radial-gradient(circle, rgba(0,42,255,1) 0%, rgba(252,70,107,0) 61%);
  height: 100px;
  display: flex;
  align-items: center;
}

.profile__description {
  width: 40%;
  margin: auto;
}

.profile__responses {
  margin-top: 74px;
}

.responses:nth-child(2n) {
  align-items: flex-end;
}

.small {
  font-family: 'Sofia Pro';
  font-size: 16px;
  line-height: 24px;
}

.profile__img {
  width: 10%;
  margin-top: 100px;
}

.close {
  top: 100px;
  right: 100px;
  cursor: pointer;
}
</style>
