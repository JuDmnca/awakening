import * as THREE from 'three'
import { gsap } from 'gsap'

let nuxt
let store
if (process.browser) {
  window.onNuxtReady(({ $nuxt, $store }) => {
    nuxt = $nuxt
    store = $store
  })
}
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

  addEvents () {
    nuxt.$on('zoomCamera', (position) => {
      this.zoomCamera(position)
    })
    nuxt.$on('unzoomCamera', (position) => {
      this.unzoomCamera(position)
    })
  }

  updatePerspective () {
    this.camera.fov = 50
  }

  zoomCamera () {
    store.commit('updateCameraZoom')
    gsap.to(
      this.camera.position,
      {
        x: this.camera.position.x,
        y: this.camera.position.y - 1,
        z: this.camera.position.z + 3,
        duration: 2,
        ease: 'power3.out',
        onComplete: this.unzoomCamera(this.camera.position)
      }
    )
  }

  unzoomCamera (position) {
    store.commit('updateCameraZoom')
    gsap.killTweensOf(this.camera)
    gsap.to(
      this.camera.position,
      {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 0.7,
        ease: 'power3.out'
      }
    )
  }
}
