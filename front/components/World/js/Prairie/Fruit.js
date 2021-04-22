import * as THREE from 'three'
import Loader from '../Loader'
// import modelFruit from '../../../../assets/models/m_fruit.gltf'
// fruitTexture = require("../../../../assets/textures/t_fruit.jpg")

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}
export default class Fruit {
  constructor(props) {
    this.props = props
    this.ready = false
  }

  init() {
    // Load fruit texture
    const texture = new THREE.TextureLoader().load(fruitTexture)

    // Init fruit object
    this.fruitObject = new Loader({model: modelFruit, material: texture})
    this.fruitObject = this.fruitObject.initTreeObject()

    return this.fruitObject
  }
}
