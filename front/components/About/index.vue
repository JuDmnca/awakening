<template>
  <transition name="fade">
    <div class="container about">
      <div class="about__content">
        <div class="about__text">
          <h1>À propos d’Awakening</h1>
          <p>
            Certaines périodes de notre vie nous font perdre ce qui nous relie <br>
            à nous-même et aux autres.  Avec Awakening, vivez une expérience interactive <br>
            pour vous redécouvrir à travers l’éveil de vos sens.
          </p>
        </div>
        <div class="about__gems">
          <a href="https://juliedemendonca.fr" class="about__gem">
            <img src="/gem-yellow.png" alt="Yellow Gem">
            <h3>Julie De Mendonça</h3>
            <p>Développeuse</p>
          </a>
          <a href="https://www.behance.net/pierrehatier" class="about__gem">
            <img src="/gem-blue.png" alt="Blue Gem">
            <h3>Pierre Hatier</h3>
            <p>Designer</p>
          </a>
          <a href="https://www.behance.net/ppinto2oli85e9/appreciated" class="about__gem">
            <img src="/gem-green.png" alt="Green Gem">
            <h3>Pierre Pinto De Oliveira</h3>
            <p>Développeur</p>
          </a>
          <a href="http://alexiaseve.com" class="about__gem">
            <img src="/gem-purple.png" alt="Purple Gem">
            <h3>Alexia Sève</h3>
            <p>Designeuse</p>
          </a>
        </div>
        <a href="" class="about__video">
          <img src="/play.png" alt="Play Button">
          <p>Voir la vidéo de présentation</p>
        </a>
      </div>
      <div @click="closeAbout">
        <img src="/close.png" alt="Close Button" class="about__close">
      </div>
      <div class="about__underlay" />
    </div>
  </transition>
</template>

<script>
export default {
  methods: {
    closeAbout () {
      this.$emit('clicked')
    }
  }
}
</script>

<style>
.about.container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 200;
  cursor: none;
}

.about__content {
  width: calc(100% - 120px);
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}

.about__text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about__underlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  left: 0;
  top: 0;
  z-index: -1;
  opacity: 0.6;
}

.about__gems {
  width: 100%;
  display: flex;
  height: auto;
}

.about__gem {
  height: auto;
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about__gem img {
  height: 400px;
  margin-top: -3rem;
}

.about__video {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.about__video img {
  width: 50px;
  height: 50px;
}

.about__video p {
  padding-top: 1.5rem;
  text-transform: uppercase;
}

.about__close {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 60px;
  right: 60px;
}

h1 {
  color: white;
  text-transform: uppercase;
  padding-bottom: 3rem;
}

h3 {
  color: white;
  font-size: 30px;
  padding: 0 0 0.5rem 0;
  font-family: 'ButlerLight';
  margin-top: -3rem;
}

p {
  text-align: center;
  color: white;
}
</style>
