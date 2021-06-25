/* eslint-disable no-unused-vars */
import * as THREE from 'three'
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

    this.microphone = null
  }

  init (scene, renderer, mixer) {
    this.mixer = mixer

    this.camera.updatePerspective()
    this.camera.camera.updateProjectionMatrix()

    this.addLight(scene)

    this.forestGroup.add(this.forestModel)
    this.addColorToCrystal()

    this.addButterfly(scene, mixer, this.animations)
    this.addGrass()

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    scene.add(this.forestGroup)
  }

  async addButterfly (scene, mixer, animations) {
    this.butterfly = await new Butterfly({ scene, mixer, animations })
  }

  addLight (scene) {
    const light = new THREE.AmbientLight(0x404040, 0.8)
    scene.add(light)
  }

  onClick () {
    this.isClickedOnButterfly = true
  }
  
  async addGrass () {
    const color = new THREE.Color('#242424')
    const material = new THREE.MeshBasicMaterial({
      color
    })
    this.grass = await new Grass(
      {
        container: this.forestGroup.children[0],
        surface: this.forestGroup.children[0].children[5],
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

  handleClick () {
    if (this.progression >= 0.59) {
      this.animations[0].play()
    }
  }

  addEvents () {
    nuxt.$on('ColorSetted', () => {
      this.crystal.getColor()
      this.addColorToCrystal()
    })
    window.addEventListener('click', () => {
      this.handleClick()
    })
  }

  render () {
    if (nuxt && store && !this.events) {
      this.addEvents()
      this.events = true
    }
    // if (this.forestGroup) {
    //   this.intersects = this.raycaster.render(this.forestGroup)
    // }

    if (this.isClickedOnButterfly) {
      const volume = this.microphone.listen()
      if (volume > 140) {
        console.log('activer le papillon')
      }
    }
  }
}
