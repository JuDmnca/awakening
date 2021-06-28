import * as THREE from 'three'
import modelButterfly from '../../../../assets/models/m_butterfly2.gltf'
import Loader from '../../../Utils/js/Loader'

let store
if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}

export default class Butterfly {
  constructor (props) {
    this.props = props
    this.scene = props.scene
    this.mixer = props.mixer
    this.animations = props.animations

    this.butterfly = null

    this.loadButterfly()
  }

  getColor () {
    this.color = new THREE.Color(store.state.user.color)
  }

  async loadButterfly () {
    const loader = new Loader({ model: modelButterfly })
    this.butterfly = await loader.initButterfly(this.mixer, this.animations)
    this.butterfly.position.set(6, 8.5, -2)

    this.scene.add(this.butterfly)
  }
}
