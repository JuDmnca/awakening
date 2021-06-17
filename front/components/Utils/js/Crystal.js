import * as THREE from 'three'

let store
if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}

export default class Crystal {
  constructor (props) {
    this.props = props
  }

  loadImages () {
    this.cubeMap = [
      require('../../../assets/textures/png/constellation/px.png'),
      require('../../../assets/textures/png/constellation/nx.png'),
      require('../../../assets/textures/png/constellation/py.png'),
      require('../../../assets/textures/png/constellation/ny.png'),
      require('../../../assets/textures/png/constellation/pz.png'),
      require('../../../assets/textures/png/constellation/nz.png')
    ]
    this.textureCrystals = new THREE.CubeTextureLoader().load(this.cubeMap)
    this.textureCrystals.mapping = THREE.CubeRefractionMapping
    this.textureCrystals.encoding = THREE.sRGBEncoding
  }

  getColor () {
    this.color = new THREE.Color(store.state.user.color)
  }

  getExteriorMaterial () {
    return new THREE.MeshPhongMaterial({
      color: this.color,
      envMap: this.textureCrystals,
      refractionRatio: 0.5,
      combine: THREE.AddOperation,
      transparent: true,
      opacity: 0.85,
      premultipliedAlpha: true,
      depthWrite: false
    })
  }

  getInnerMaterial () {
    return new THREE.MeshPhongMaterial({
      color: this.color,
      opacity: 0.7,
      transparent: true,
      emissive: this.color,
      emissiveIntensity: 0.2
    })
  }
}
