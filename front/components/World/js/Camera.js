import * as THREE from 'three'

export default class Camera {
  constructor(options) {
    this.window = options.window

    this.container = new THREE.Object3D()

    this.setCamera()
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.window.windowW / this.window.windowH,
      0.1,
      1000
    )
    this.container.add(this.camera)
  }
}