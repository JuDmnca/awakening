<template>
  <section class="profile flex">
    <div class="profile__content flex flex-col items-center">
      <h1>Votre profil de quête</h1>
      <h2
        class="profile__name"
        :style="{
          background: 'radial-gradient(circle, ' + $store.state.constellation.currentUser.color +' -50%, rgba(252,70,107,0) 61%)',
        }"
      >
        <span>{{ $store.state.constellation.currentUser.name }} </span>
      </h2>
      <p class="profile__description small">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ultrices quam sed neque placerat, non laoreet magna viverra.
      </p>
    </div>
    <div class="profile__responses flex">
      <div class="profile__response">
        <p class="small">
          Votre odeur
        </p>
        <h2 class="responses__title">
          {{ $store.state.constellation.currentUser.smell }}
        </h2>
      </div>
      <div class="profile__response">
        <p class="small">
          Votre son
        </p>
        <h2 class="responses__title">
          {{ $store.state.constellation.currentUser.sound }}
        </h2>
      </div>
    </div>
    <div class="profile__buttons flex">
      <div class="profile__icon profile__icon--close border border-white rounded-full flex" @click.prevent="$nuxt.$emit('onCrystalClick')">
        <UI-Icons-Cross
          class="m-auto"
          :width="16"
          :height="16"
          :color="'#FFF'"
        />
      </div>
      <div class="profile__icon profile__icon--random border border-white rounded-full flex self-center" @click.prevent="getRandomProfile()">
        <UI-Icons-Dice
          class="m-auto"
          :color="'#FFF'"
          :width="25"
          :height="25"
        />
      </div>
    </div>
    <div class="profile__underlay" />
  </section>
</template>

<script>
export default {
  data () {
    return {
      errorMessage: null
    }
  },
  methods: {
    async sendDatasUserToFirebase () {
      const profilesRef = await this.$fire.firestore.collection('profiles')
      await profilesRef.doc().set({
        nom: this.$store.state.user.name,
        odeur: this.$store.state.user.smell,
        sound: this.$store.state.user.sound
      })
    },
    getRandomProfile () {
      this.$store.commit('constellation/getRandomUser')
    }
  }
}
</script>

<style scoped>
h1 {
  font-family: 'Sofia Pro';
  font-size: 20px;
  color: white;
  text-transform: uppercase;
}

.profile {
  color: white;
  font-family: 'ButlerLight';
  font-weight: 300;
  position: relative;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  font-size: 44px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.profile__content {
  width: calc(100vw - 120px);
  padding-top: 60px;
}

.profile__name {
  font-family: 'Butler';
  position: relative;
  background: radial-gradient(circle, green 0%, rgba(252,70,107,0) 61%);
  height: 198px;
  font-size: 100px;
  width: 100%;
  margin: 15px 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: 20% !important;
  background-repeat: no-repeat !important;
  background-position: center !important;
}

.profile__description {
  width: 40%;
  text-align: center;
}

.profile__responses {
  width: 75%;
  display: flex;
  justify-content: space-between;
}

.profile__response {
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.profile__response p {
  text-align: center;
  text-transform: uppercase;
  padding-bottom: 2.5rem;
}

.profile__response h2 {
  text-align: center;
}

.profile__buttons {
  width: calc(100% - 120px);
  display: flex;
  justify-content: center;
  padding-bottom: 60px;
}

.profile__underlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  left: 0;
  top: 0;
  z-index: -1;
  opacity: 0.6;
}

.small {
  font-family: 'Sofia Pro';
  font-size: 16px;
  line-height: 24px;
}

.profile__icon {
  cursor: pointer;
  margin: 0 15px;
}

.profile__icon--close,
.profile__icon--random {
  width: 60px;
  height: 60px;
}
</style>
