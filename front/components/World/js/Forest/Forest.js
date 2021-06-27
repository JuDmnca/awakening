/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import gsap from 'gsap'
import Raycaster from '../../../Utils/js/Raycaster'

import Sound from '../../../Utils/js/SoundLoader'
import birdsURL from '../../../../assets/sounds/forest/birds.mp3'
import introURL from '../../../../assets/sounds/forest/intro.mp3'
import introLoopURL from '../../../../assets/sounds/forest/intro-loop.mp3'
import note1URL from '../../../../assets/sounds/desert/note-1.mp3'
import note2URL from '../../../../assets/sounds/desert/note-2.mp3'
import note3URL from '../../../../assets/sounds/desert/note-3.mp3'

import Grass from '../Common/Grass'
import Butterfly from './Butterfly'

let store
let nuxt
if (process.browser) {
  window.onNuxtReady(({ $nuxt, $store }) => {
    nuxt = $nuxt
    store = $store
  })
}

export default class Forest {
  constructor (props) {
    this.props = props
    this.name = 'Forest'

    // Generals params
    this.hold = false

    this.scene = null

    this.camera = this.props.camera
    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null

    this.mixer = null

    this.progression = this.props.progression
    this.events = false

    this.forestGroup = new THREE.Group()
    this.forestModel = this.props.model
    this.animations = []

    this.crystal = props.crystal

    this.enable = true
    this.microphone = null
    this.volume = null
  }

  init (scene, renderer, mixer) {
    this.scene = scene
    this.mixer = mixer

    this.camera.updatePerspective()
    this.camera.camera.updateProjectionMatrix()

    this.addLight(scene)

    this.forestGroup.add(this.forestModel)

    this.addButterfly(this.forestGroup, mixer, this.animations)

    this.addFog(scene)

    this.addSounds()

    // nuxt.$on('smellSetted', () => {
    //   this.addSubtitles()
    // })

    // this.crystal.getColor()
    // this.addColorToCrystal()

    // this.updateMaterials()
    // this.addGrass()

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    this.forestGroup.name = this.name

    scene.add(this.forestGroup)
  }

  async addButterfly (scene, mixer, animations) {
    this.butterfly = await new Butterfly({ scene, mixer, animations })
    nuxt.$on('swoosh', () => {
      const butterflyMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(store.state.user.color)
      })
      setTimeout(() => {
        this.butterfly.butterfly.material = butterflyMaterial
        console.log(this.butterfly.butterfly.material)
      }, 3000)
    })
  }

  addLight (scene) {
    const light = new THREE.AmbientLight(0xFFFFFF, 0.8)
    scene.add(light)
  }

  addFog (scene) {
    const colorBG = new THREE.Color('#89C7D9')
    scene.fog = new THREE.Fog(colorBG, 40, 300)
  }

  addSounds () {
    this.birdsSound = new Sound({ camera: this.camera, audioFile: birdsURL, loop: true, canToggle: true, volume: 0.01 * 3 })
    this.introLoopSound = new Sound({ camera: this.camera, audioFile: introLoopURL, loop: true, canToggle: false, volume: 0.02 * 3 })
    this.introSound = new Sound({ camera: this.camera, audioFile: introURL, loop: false, canToggle: false, volume: 0.02 * 3, onEnded: true, soundCallBack: this.introLoopSound })
    this.note1Sound = new Sound({ camera: this.camera, audioFile: note1URL, loop: false, canToggle: false, volume: 0.5 * 3 })
    this.note2Sound = new Sound({ camera: this.camera, audioFile: note2URL, loop: false, canToggle: false, volume: 0.5 * 3 })
    this.note3Sound = new Sound({ camera: this.camera, audioFile: note3URL, loop: false, canToggle: false, volume: 0.5 * 3 })
  }

  playSounds () {
    this.birdsSound.sound.play()
    this.introSound.sound.play()
  }

  addSubtitles () {
    setTimeout(() => {
      store.commit('setSubtitle', 'Nos sens sont intimement liés à nos souvenirs.')
      nuxt.$emit('toggleShowSubtitle')
      nuxt.$emit('showCursor', 'Scroll')
      this.indicationIsVisible = true
    }, 3000)
    setTimeout(() => {
      nuxt.$emit('toggleShowSubtitle')
    }, 8000)
    setTimeout(() => {
      store.commit('setSubtitle', 'Votre esprit est sur le point de s’éveiller à nouveau.')
      nuxt.$emit('toggleShowSubtitle')
    }, 9000)
    setTimeout(() => {
      nuxt.$emit('toggleShowSubtitle')
    }, 14000)
    setTimeout(() => {
      store.commit('setSubtitle', 'Saurez-vous lui redonner sa voix ?')
      nuxt.$emit('toggleShowSubtitle')
      this.subTitlesAreCompleted = true
    }, 15000)
  }

  stifleSounds () {
    this.birdsSound.sound.setVolume(0.003 * 3)
    this.introLoopSound.sound.setVolume(0.006 * 3)
    this.introSound.sound.setVolume(0.006 * 3)
  }

  removeAllSound () {
    this.disconnectSoundIfSource(this.birdsSound.sound)
    this.disconnectSoundIfSource(this.introLoopSound.sound)
    this.disconnectSoundIfSource(this.introSound.sound)
  }

  disconnectSoundIfSource (sound) {
    if (sound.source) {
      sound.disconnect()
    }
  }

  async addGrass () {
    const color = new THREE.Color('#2E3618')
    const material = new THREE.MeshBasicMaterial({
      color
    })
    let surface
    this.forestGroup.children[0].children.forEach((children) => {
      if (children.name === 'sol') {
        surface = children
      }
    })
    this.grass = await new Grass(
      {
        container: this.forestGroup.children[0],
        surface,
        count: 1000,
        scaleFactor: 4,
        material
      })
  }

  addColorToCrystal () {
    this.crystal.getColor()
    for (let i = 0; i <= this.forestGroup.children[0].children.length - 1; i++) {
      const child = this.forestGroup.children[0].children[i]
      if (child.name.includes('inside')) {
        child.material = this.crystal.getInnerMaterial()
        child.layers.enable(1)
      } else if (child.name.includes('outside')) {
        child.material = this.crystal.getExteriorMaterial()
        child.layers.enable(1)
      }
    }
  }

  updateMaterials () {
    this.forestGroup.children[0].children.forEach((children) => {
      if (children.name === 'buissons') {
        children.material.depthWrite = true
        children.position.y -= 3
      }
    })
  }

  setAnimations () {
    this.animations[0].loop = THREE.LoopPingPong
    this.animations[0].timeScale = 0.1
    this.animations[0].play()
  }

  updateButterflySpeed () {
    const step = store.state.forest.step
    if (step < 3) {
      const step = store.state.forest.step
      this.animations[0].timeScale = Math.exp(step * 2)
      if (step === 0) {
        this.note1Sound.sound.play()
        nuxt.$emit('toggleShowSubtitle')
        setTimeout(() => {
          store.commit('setSubtitle', 'Continues')
          nuxt.$emit('toggleShowSubtitle')
        }, 1000)
      }
      if (step === 1) {
        this.note2Sound.sound.play()
        nuxt.$emit('toggleShowSubtitle')
        setTimeout(() => {
          store.commit('setSubtitle', 'Tu y es presque !')
          nuxt.$emit('toggleShowSubtitle')
        }, 1000)
      }
      if (step === 2) {
        this.note3Sound.sound.play()
        nuxt.$emit('toggleShowSubtitle')
        setTimeout(() => {
          this.moveButterfly()
          store.commit('setSubtitle', 'Bravo !')
          nuxt.$emit('toggleShowSubtitle')
          nuxt.$emit('butterflyIsAwake')
        }, 1000)
      } else {
        this.enable = false
        setTimeout(() => {
          this.enable = true
        }, 3000)
      }
      store.commit('forest/increaseStep')
    }
  }

  onClickIfMicrophoneIsDisabled () {
    if (this.enable) {
      this.updateButterflySpeed()
    }
  }

  moveButterfly () {
    let butterfly
    this.forestGroup.children.forEach((children) => {
      if (children.name === 'Butterfly') {
        butterfly = children
      }
    })
    gsap.to(butterfly.position, {
      x: 14,
      y: 3,
      z: -1,
      duration: 3,
      ease: 'power3.inOut',
      onComplete: this.endScene
    })
  }

  endScene () {
    nuxt.$emit('hideCursor')
    nuxt.$emit('startTransition', 3)
    nuxt.$emit('startSceneTransition')
    nuxt.$emit('toggleShowSubtitle')
  }

  addEvents () {
    nuxt.$on('ColorSetted', () => {
      this.crystal.getColor()
      this.addColorToCrystal()
      this.updateMaterials()
      this.setAnimations()
      this.addSubtitles()
      this.playSounds()
    })
  }

  render (timeTotal, timeDelta) {
    this.noScroll += timeDelta

    if (this.noScroll > 2 && !this.indicationIsVisible && this.progression < 0.5) {
      nuxt.$emit('showCursor', 'Scroll')
      this.indicationIsVisible = true
    }

    if (!this.indicationIsVisible && this.progression > 0.5 && this.subTitlesAreCompleted) {
      setTimeout(() => {
        nuxt.$emit('showCursor', 'RÉVEILLEZ LE PAPILLON')
        this.indicationIsVisible = true
      }, 1000)
    }

    if (nuxt && store && !this.events) {
      this.addEvents()
      this.events = true
    }

    if (this.progression >= 0.58 && !this.isClickedOnButterfly && this.subTitlesAreCompleted) {
      this.isClickedOnButterfly = true
    }

    if (this.isClickedOnButterfly && this.microphone.analyzer) {
      this.volume = this.microphone.listen()
      if (this.volume > 131 && this.enable) {
        this.enable = false
        this.updateButterflySpeed()
      }
    }
  }
}
