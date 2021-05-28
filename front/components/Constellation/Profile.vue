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
    <!-- Just testing upload here -->
    <form @submit.prevent="sendDatasUserToFirebase">
      <input id="input" ref="input" type="file">
      <button type="submit">
        Envoyer
      </button>
      <span v-if="errorMessage" style="color:red">{{ errorMessage }}</span>
    </form>
    <img ref="userImg" src="">
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
      await this.presizeImageBeforeUpload(this.$refs.input.files[0])
      console.log('hello', this.fileCompressed)
      setTimeout(() => console.log('hello', this.fileCompressed), 1000)
      // const blob = await this.dataURItoBlob(this.fileCompressed)
      // let fileName = this.$refs.input.files[0].name
      // // Quick verification of the type of the image
      // if (fileName.includes('.jpg') || fileName.includes('.jpeg') || fileName.includes('.png') || fileName.includes('.svg')) {
      //   // I put the id of the user at the beginning of the name of his picture to link the pic to the user
      //   fileName = parseInt(this.$store.state.constellation.dataUsers.length + 1) + fileName
      //   // Image's user pushed in the firebase storage
      //   const ppStorageRef = await this.$fire.storage.ref().child('pp/' + fileName)
      //   ppStorageRef.put(blob).then((snapshot) => {
      //     console.log('Uploaded a blob or file!', fileName)
      //   })

      //   // Profiles info pushed in the firestore db
      //   const profilesRef = await this.$fire.firestore.collection('profiles')
      //   await profilesRef.doc().set({
      //     nom: this.$store.state.user.name,
      //     odeur: this.$store.state.user.smell,
      //     img: 'pp/' + fileName
      //   })
      //   this.errorMessage = null
      // } else {
      //   this.errorMessage = 'Le format du fichier n\'est pas accepté'
      // }
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
    presizeImageBeforeUpload (file) {
      if (!file) { return }
      // let srcEncoded

      const reader = new FileReader()

      reader.readAsDataURL(file)

      reader.onload = (event) => {
        const imgElement = document.createElement('img')
        imgElement.src = event.target.result
        // document.querySelector("#input").src = event.target.result

        imgElement.onload = (e) => {
          const canvas = document.createElement('canvas')
          const MAX_WIDTH = 400
          const MAX_HEIGHT = 300
          let width = imgElement.width
          let height = imgElement.height
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width
              width = MAX_WIDTH
            }
          } else if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }

          // const scaleSize = MAX_WIDTH / e.target.width
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')

          ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height)

          this.fileCompressed = ctx.canvas.toDataURL(e.target, 'image/jpeg')
          console.log('putiannnnn', this.fileCompressed)
          // you can send srcEncoded to the server
          // document.querySelector("#output").src = srcEncoded
        }
      }
    },
    dataURItoBlob (dataURI) {
      console.log('heklo on fun ', dataURI)
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      const byteString = atob(dataURI.split(',')[1])

      // separate out the mime component
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

      // write the bytes of the string to an ArrayBuffer
      const ab = new ArrayBuffer(byteString.length)

      // create a view into the buffer
      const ia = new Uint8Array(ab)

      // set the bytes of the buffer to the correct values
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }

      // write the ArrayBuffer to a blob, and you're done
      const blob = new Blob([ab], { type: mimeString })
      return blob
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
