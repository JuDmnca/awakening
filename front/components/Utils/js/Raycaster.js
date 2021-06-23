import * as THREE from 'three'

export default class Raycaster {
  constructor () {
    this.raycaster = new THREE.Raycaster()
    this.intersects = []
  }

  init (camera, renderer) {
    window.addEventListener('mousemove', (e) => {
      this.mouseMovement(e, camera, renderer)
    })
  }

  mouseMovement (e, camera, renderer) {
    this.raycaster.setFromCamera({
      x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
      y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
    }, camera.camera)
  }

  render (scene) {
    if (scene.children) {
      this.intersects = this.raycaster.intersectObjects(scene.children)
    }

    for (let i = 0; i < this.intersects.length; i++) {
      // console.log(this.intersects[ i ].object)
    }
    return this.intersects
  }
}
