import * as THREE from 'three'
import { ReinhardToneMapping } from 'three'
import Camera from './Camera'
import MainGui from './Utils/MainGui'
// import Bloom from './Utils/Bloom'

import Desert from './Desert/Desert'

const desertCurve = [
  [41.891, 0.85967, -41.585],
  [37.092, 2.2471, -25.002],
  [22.111, 1.6593, -25.574],
  [15.148, 2.2951, -4.389],
  [-4.7436, 1.6304, 6.2753]
]

const prairieCurve = [
]

const forestCurve = [
]

const allCurves = [desertCurve, prairieCurve, forestCurve]

const start = new THREE.Vector3(-41, 1, 1.4)
const end = new THREE.Vector3(start.x - 1, start.y + 6, start.z - 7.4)

let store
let nuxt
if (process.browser) {
  window.onNuxtReady(({ $nuxt, $store }) => {
    nuxt = $nuxt
    store = $store
  })
}

class Common {
  constructor () {
    this.scene = null
    this.renderer = null

    this.camera = null
    this.progression = null
    this.curveNumber = 0
    this.camLook = start.clone()
    this.camTarget = start.clone()

    this.events = false

    this.canMove = null
    this.addscroll = false

    this.mouse = new THREE.Vector2()
    this.target = new THREE.Vector2()

    this.windowHalf = new THREE.Vector2()

    this.currentScene = null

    this.size = {
      windowW: null,
      windowH: null
    }

    this.clock = null

    this.time = {
      total: null,
      delta: null,
      stationary: 0,
      cursorImmobile: 0,
      noHold: 0
    }
    this.isStationary = false
    this.isCursorImmobile = true
    this.isHold = false

    this.cursorDistance = 0
    this.enableSporesElevationAt = 0.85

    this.light = null

    // General Params
    this.params = {
      scrollSpeed: 7,
      light: {
        angle: Math.PI / 2,
        color: '#ffffff',
        intensity: 1,
        distance: 1000
      }
    }

    // BLOOM
    this.bloom = null

    this.gui = null
    this.sporesCanMove = false
  }

  init ($canvas) {
    // FPS
    // eslint-disable-next-line
    (function () { const script = document.createElement('script'); script.onload = function () { const stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop () { stats.update(); requestAnimationFrame(loop) }) }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script) })()

    this.setSize()

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas
      // antialias: true,
      // alpha: true
    })
    this.renderer.toneMapping = ReinhardToneMapping
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.size.windowW, this.size.windowH)
    // this.renderer.setClearColor(0xFF0000)

    this.clock = new THREE.Clock()
    this.clock.start()

    // Init camera
    this.cameraDisplacement()
    this.vectCam = new THREE.Vector3(this.p1.x, this.p1.y, this.p1.z)
    this.initCamera()

    this.addWheelEvent()

    // Load first group (desert)
    this.currentScene = new Desert({ camera: this.camera })
    this.currentScene.init(this.scene, this.renderer)

    // Init light
    this.light = new THREE.PointLight(this.params.light.color, this.params.light.intensity, this.params.light.distance)
    this.light.position.set(162, 162, -406)
    this.gui = new MainGui()
    const moonFolder = this.gui.gui.addFolder('Moon')
    moonFolder.add(this.light.position, 'x', -1000, 1000, 1).name('x')
    moonFolder.add(this.light.position, 'y', -1000, 1000, 1).name('y')
    moonFolder.add(this.light.position, 'z', -1000, 1000, 1).name('z')
    moonFolder.add(this.light, 'intensity', 0, 3, 0.1).name('intensity')

    this.scene.add(this.light)

    // this.initBloom()
  }

  initCamera () {
    this.camera = new Camera({
      window: this.size
    })
    this.scene.add(this.camera.camera)
  }

  cameraDisplacement () {
    this.curves = []

    // Scale curves
    allCurves.forEach((curve, index) => {
      if (index === 0) {
        this.scale = 3
      }
      this.curves.push(new THREE.CatmullRomCurve3(curve))

      for (let i = 0; i < curve.length; i++) {
        const x = curve[i][0] * this.scale
        const y = curve[i][1] * this.scale + 4
        const z = curve[i][2] * this.scale
        curve[i] = new THREE.Vector3(x, y, -z)
      }
    })

    // Init variables
    this.p1 = this.curves[0].points[0]
    this.progression = 0
    this.curveNumber = 0
  }

  moveCamera (e) {
    if (e.deltaY <= 0) {
      this.progression >= 0.98 ? this.progression = 1 : this.progression += -e.deltaY * this.params.scrollSpeed / Math.pow(10, 5)
    } else {
      this.progression <= 0.01 ? this.progression = 0 : this.progression += -e.deltaY * this.params.scrollSpeed / Math.pow(10, 5)
    }
    this.currentScene.progression = this.progression
    this.p1 = this.curves[this.curveNumber].getPointAt(this.progression)

    if (store) {
      const euler = this.camera.camera.rotation.clone()
      store.commit('updateWorldRotation', euler)
    }

    // Enable spores movement and inhale if end of path
    if (this.progression >= this.enableSporesElevationAt && this.sporesCanMove === false) {
      this.currentScene.enableSporesMovement()
      this.sporesCanMove = true
    }
  }

  setSize () {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight
    }
    this.windowHalf.x = this.size.windowW / 2
    this.windowHalf.y = this.size.windowH / 2
  }

  mouseMovement (e) {
    this.mouse.x = (e.clientX - this.windowHalf.x)
    this.mouse.y = (e.clientY - this.windowHalf.y)
  }

  resize () {
    this.setSize()
    this.camera.camera.aspect = this.size.windowW / this.size.windowH
    this.camera.camera.updateProjectionMatrix()
    this.renderer.setSize(this.size.windowW, this.size.windowH)
  }

  addWheelEvent () {
    window.addEventListener('mousemove', (e) => {
      this.mouseMovement(e)

      // Disable animation if mousemove
      this.time.cursorImmobile = 0
      if (!this.isCursorImmobile) {
        nuxt.$emit('handleHoverAnimation')
      }
      this.isCursorImmobile = true

      // Compute distance of mousemove at the end of the path
      if (this.progression > this.enableSporesElevationAt) {
        this.cursorDistance += Math.abs(e.movementX)
        this.cursorDistance += Math.abs(e.movementY)
      }
    })

    window.addEventListener('resize', () => {
      this.resize()
    })

    window.addEventListener('wheel', (e) => {
      if (this.curves[this.curveNumber] !== undefined) {
        this.moveCamera(e)
      }
      this.time.stationary = 0
      if (this.isStationary) {
        nuxt.$emit('handleScrollAnimation')
      }
      this.isStationary = false
    })

    window.addEventListener('mousedown', () => {
      this.time.noHold = 0
      if (this.isHold) {
        nuxt.$emit('handleHoldAnimation')
      }
      this.isHold = false
    })
  }

  addTransitionEvent () {
    nuxt.$on('startSceneTransition', () => {
      switch (store.state.sceneIndex) {
        case 1:
          this.removeGroup(this.currentScene)
          // this.currentScene = new Prairie({camera: this.camera})
          // this.currentScene.init(this.scene, this.renderer)
          break
        case 2:
          this.removeGroup(this.currentScene)
          // this.currentScene = new Forest({camera: this.camera})
          // this.currentScene.init(this.scene, this.renderer)
          break
      }
      store.commit('increaseSceneIndex')
    })
  }

  removeGroup (group) {
    const selectedObject = this.scene.getObjectByName(group.name)
    this.scene.remove(selectedObject)
  }

  // initBloom () {
  //   this.bloom = new Bloom({
  //     scene: this.scene,
  //     camera: this.camera.camera,
  //     renderer: this.renderer,
  //     params: {
  //       exposure: 2, // Set to one when bloom renderer actived
  //       bloomStrength: 1.5,
  //       bloomThreshold: 0,
  //       bloomRadius: 1
  //     }
  //   })
  // }

  render () {
    if (nuxt && store && !this.events) {
      this.addTransitionEvent()
      this.events = true
      this.camera.addEvents()
    }

    this.time.delta = this.clock.getDelta()
    this.time.total += this.time.delta
    this.time.stationary += this.time.delta
    this.time.cursorImmobile += this.time.delta
    this.time.noHold += this.time.delta

    // stationary = time to wait to show the indication
    // progression < 0.5 : indicator just in the first part of the scene.
    if (this.time.stationary > 10 && !this.isStationary && this.progression < 0.5) {
      this.isStationary = true
      nuxt.$emit('handleScrollAnimation')
    } else if (this.time.cursorImmobile > 10 && this.cursorDistance < 25000 && this.progression > this.enableSporesElevationAt && this.isCursorImmobile) {
      this.isCursorImmobile = false
      nuxt.$emit('handleHoverAnimation')
    } else if (this.time.noHold > 10 && this.cursorDistance > 25000 && this.progression > this.enableSporesElevationAt && !this.isHold) {
      this.isHold = true
      nuxt.$emit('handleHoldAnimation')
    }

    // Update camera rotation & look at
    if (store && !store.state.cameraIsZoomed) {
      if (store && store.state.desert.interaction) {
        this.camera.camera.position.lerp(end, 0.1)
      } else {
        this.vectCam.set(this.p1.x, this.p1.y, this.p1.z)
        this.camera.camera.position.lerp(this.vectCam, 0.1)
      }
    }
    this.camLook.lerp(this.camTarget, 0.05)
    this.camera.camera.lookAt(this.camLook)

    this.currentScene.render(this.time.total)

    // TO DO : update code so camera moves like head following the mouse BUT needs to check camera rotation before
    // if (!this.currentScene.isFixedView()) {
    //     this.target.x = ( 1 - this.mouse.x ) * 0.002;
    //     this.target.y = ( 1 - this.mouse.y ) * 0.002;

    //     // this.camera.camera.rotation.x += 0.01 * ( this.target.y - this.camera.camera.rotation.x )
    //     // this.camera.camera.rotation.y += 0.2 * ( this.target.x - this.camera.camera.rotation.y )
    // }

    // this.bloom.render()
    this.renderer.render(this.scene, this.camera.camera)
  }
}

export default new Common()
