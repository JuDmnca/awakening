/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import Raycaster from '../../../Utils/js/Raycaster'

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

    this.progression = null
    this.events = false

    this.forestGroup = new THREE.Group()
    this.forestModel = this.props.model
    this.animations = this.props.animations

    this.crystal = props.crystal

    this.microphone = null
  }

  init (scene, renderer) {
    this.camera.updatePerspective()
    this.camera.camera.updateProjectionMatrix()

    this.addLight(scene)

    this.forestGroup.add(this.forestModel)
    this.addColorToCrystal()

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    // this.animations[0].reset().play()
    // this.animations[1].play()

    scene.add(this.forestGroup)
  }

  addLight (scene) {
    const light = new THREE.AmbientLight(0x404040, 0.8)
    scene.add(light)
  }

  onClick () {
    this.isClickedOnButterfly = true
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
    // this.animations[0].play()
    // this.animations[1].play()
  }

  addEvents () {
    nuxt.$on('ColorSetted', () => {
      this.crystal.getColor()
      this.addColorToCrystal()
    })
    // window.addEventListener('click', () => {
    //   this.handleClick()
    // })
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
