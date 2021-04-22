import * as THREE from 'three'
import Loader from '../Loader'
import Fruit from './Fruit'

// import modelTree from '../../../../assets/models/m_tree.gltf'
// treeTexture = require("../../../../assets/textures/t_tree.jpg")

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}
export default class Tree {
  constructor(props) {
    this.props = props
    this.ready = false
    this.tree = new THREE.Object3D()

    // Load tree texture
    const texture = new THREE.TextureLoader().load(treeTexture)

    // Init tree object
    this.treeObject = new Loader({model: modelTree, material: texture})
    this.treeObject = this.treeObject.initTreeObject()

    this.tree.add(this.treeObject)
  }

  init() {
    const fruit = new Fruit()
    this.tree.add(fruit)

    return this.tree
  }
}
