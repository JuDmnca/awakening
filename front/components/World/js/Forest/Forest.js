/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import gsap from 'gsap'
import Raycaster from '../../../Utils/js/Raycaster'

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
  }

  init (scene, renderer, mixer) {
    this.scene = scene
    this.mixer = mixer

    this.camera.updatePerspective()
    this.camera.camera.updateProjectionMatrix()

    this.addLight(scene)

    this.forestGroup.add(this.forestModel)
    this.addColorToCrystal()

    this.addButterfly(scene, mixer, this.animations)

    // this.crystal.getColor()
    // this.addColorToCrystal()

    // this.updateBuissonMaterial()
    // this.addGrass()

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    scene.add(this.forestGroup)
  }

  async addButterfly (scene, mixer, animations) {
    this.butterfly = await new Butterfly({ scene, mixer, animations })
  }

  addLight (scene) {
    const light = new THREE.AmbientLight(0x404040, 1)
    scene.add(light)
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

  updateBuissonMaterial () {
    let buissons
    this.forestGroup.children[0].children.forEach((children) => {
      if (children.name === 'buissons') {
        buissons = children
      }
    })
    buissons.material.depthWrite = true
    buissons.position.y -= 3
  }

  setAnimations () {
    this.animations[0].loop = THREE.LoopPingPong
    this.animations[0].timeScale = 0.1
    this.animations[0].play()
  }

  updateButterflySpeed () {
    if (store.state.forest.step < 3) {
      store.commit('forest/increaseStep')
      const step = store.state.forest.step
      this.animations[0].timeScale = step * 1.5
      setTimeout(() => {
        this.enable = true
      }, 1000)
    } else {
      this.moveButterfly()
    }
  }

  moveButterfly () {
    let butterfly
    this.scene.children.forEach((children) => {
      if (children.name === 'Butterfly') {
        butterfly = children
      }
    })
    gsap.to(butterfly.position, { y: 10, duration: 3, ease: 'power3.inOut', onComplete: this.endScene })
  }

  endScene () {
    nuxt.$emit('startTransition', 3)
    nuxt.$emit('startSceneTransition')
  }

  addEvents () {
    nuxt.$on('ColorSetted', () => {
      this.crystal.getColor()
      this.addColorToCrystal()
      this.updateBuissonMaterial()
      this.setAnimations()
    })
  }

  render () {
    if (nuxt && store && !this.events) {
      this.addEvents()
      this.events = true
    }
    if (this.progression >= 0.59) {
      this.isClickedOnButterfly = true
    }

    if (this.isClickedOnButterfly) {
      const volume = this.microphone.listen()
      if (volume > 132 && this.enable) {
        this.enable = false
        this.updateButterflySpeed()
      }
    }
  }
}
