import * as THREE from 'three'

export default class Camera {
  constructor (options) {
    this.window = options.window

    this.setCamera()
  }

  setCamera () {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.window.windowW / this.window.windowH,
      0.1,
      1000
    )
  }
}
