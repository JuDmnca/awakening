/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import Land from '../Land'
import modelForest from '../../../../assets/models/m_forest.glb'
import Raycaster from '../Utils/Raycaster'

const grassTexture = require('../../../../assets/textures/t_sand.png')

let store
if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}

export default class Forest {
  constructor (props) {
    this.props = props
    this.name = 'forest'

    // Generals params
    this.hold = false
    this.land = new Land({ texture: grassTexture, index: 1 })

    this.camera = this.props.camera
    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null

    this.progression = null

    this.forestGroup = new THREE.Group()
  }

  async init (scene, renderer) {
    renderer.toneMappingExposure = Math.pow(2, 4.0)
    const forestModel = await this.land.load(modelForest, 1)
    this.forestGroup.add(forestModel)

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    scene.add(this.forestGroup)
  }

  render () {
    if (this.forestGroup) {
      this.intersects = this.raycaster.render(this.forestGroup)
    }
  }
}
