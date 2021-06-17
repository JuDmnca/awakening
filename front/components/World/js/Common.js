import * as THREE from 'three'
import Camera from '../../Utils/js/Camera'
import Crystal from '../../Utils/js/Crystal'
import Bloom from '../../Utils/js/Bloom'

import Land from './Land'
import Desert from './Desert/Desert'
import Forest from './Forest/Forest'

const desertCurve = [
  [41.891, 0.85967, -41.585],
  [37.092, 2.2471, -25.002],
  [22.111, 1.6593, -25.574],
  [15.148, 2.2951, -4.389],
  [-4.7436, 1.6304, 6.2753]
]

const forestCurve = [
  [-39.9991, 1, 9.91934],
  [-30.2841, 1, 14.3279],
  [-15.1083, 1, 28.0624],
  [6.2926, -1.827358, 22.9185],
  [9.55505, 1.56179, 6.12564],
  [6.74007, 3.17393, 0.254782],
  [10.534, 2.30262, -3.18313],
  [10.7498, 1, -9.15631],
  [-5.18898, 1, -18.1431],
  [-27.2973, 0.70418, -13.7742]
]

const allCurves = [desertCurve, forestCurve]

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
    this.pauseRender = false

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
      delta: null
    }

    this.enableSporesElevationAt = 0.85

    this.crystal = new Crystal()

    this.light = null

    // General Params
    this.params = {
      scrollSpeed: 7,
      light: {
        angle: Math.PI / 2,
        color: '#ffffff',
        intensity: 0.1,
        distance: 1000
      }
    }

    // BLOOM
    this.bloom = null

    this.gui = null
    this.sporesCanMove = false
  }

  async init ($canvas) {
    // FPS
    // eslint-disable-next-line
    (function () { const script = document.createElement('script'); script.onload = function () { const stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop () { stats.update(); requestAnimationFrame(loop) }) }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script) })()

    this.setSize()
    this.scene = new THREE.Scene()
    this.addRenderer($canvas)

    this.clock = new THREE.Clock()
    this.clock.start()

    // Load Scene Models
    this.lands = new Land()
    this.models = await this.lands.load()

    // Init camera
    this.cameraDisplacement()
    this.vectCam = new THREE.Vector3(this.p1.x, this.p1.y, this.p1.z)
    this.initCamera()
    this.addLight()

    this.addEventListeners()

    // Load first group (desert)
    this.currentScene = new Desert({ camera: this.camera, model: this.lands.get(0), crystal: this.crystal })
    this.currentScene.init(this.scene, this.renderer)

    // Load second group (forest)
    // this.sporesCanMove = false
    // this.currentScene = new Forest({ camera: this.camera, model: this.lands.get(1), crystal: this.crystal })
    // this.currentScene.init(this.scene, this.renderer)
    // this.curveNumber += 1

    this.initBloom()
  }

  setSize () {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight
    }
    this.windowHalf.x = this.size.windowW / 2
    this.windowHalf.y = this.size.windowH / 2
  }

  addRenderer ($canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas,
      antialias: true,
      alpha: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.size.windowW, this.size.windowH)
  }

  initCamera () {
    this.camera = new Camera({
      window: this.size
    })
    this.scene.add(this.camera.camera)
  }

  addLight (scene) {
    this.light = new THREE.PointLight(this.params.light.color, this.params.light.intensity, this.params.light.distance)
    this.light.position.set(162, 162, -406)
    this.light.name = 'Pointlight'

    this.scene.add(this.light)
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

    if (store && store.state.sceneIndex === 1) {
      const euler = this.camera.camera.rotation.clone()
      store.commit('updateWorldRotation', euler)
    }

    // Enable spores movement and inhale if end of path
    if (store.state.sceneIndex === 1 && this.progression >= this.enableSporesElevationAt && this.sporesCanMove === false) {
      this.sporesCanMove = true
    }
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

  addEventListeners () {
    window.addEventListener('mousemove', (e) => {
      this.mouseMovement(e)

      // DESERT
      if (this.sporesCanMove) {
        this.currentScene.sporesOnMouseMove(e)
      }
      // Disable animation if mousemove on desert scene
      if (this.currentScene.name === 'Desert') {
        this.currentScene.onCursorMovement(e)
      }
    })

    window.addEventListener('resize', () => {
      this.resize()
    })

    nuxt.$on('startExperience', () => {
      window.addEventListener('wheel', (e) => {
        if (this.curves[this.curveNumber] !== undefined) {
          this.moveCamera(e)
        }

        // DESERT
        if (this.currentScene.name === 'Desert') {
          this.currentScene.onWheelMovement(e)
        }
      })
    })

    window.addEventListener('mousedown', () => {
      // DESERT
      if (this.currentScene.name === 'Desert') {
        this.currentScene.onHold()
      }

      if (this.sporesCanMove) {
        this.currentScene.sporesOnHold()
      }
    })

    window.addEventListener('mouseup', () => {
      // DESERT
      if (this.sporesCanMove) {
        this.currentScene.sporesOnMouseUp()
      }
    })
  }

  addTransitionEvent () {
    nuxt.$on('startSceneTransition', () => {
      this.pauseRender = true
      this.removeGroup(this.currentScene)

      this.sporesCanMove = false
      this.currentScene = new Forest({ camera: this.camera, model: this.lands.get(1), crystal: this.crystal })
      this.currentScene.init(this.scene, this.renderer)

      this.curveNumber += 1
      this.progression = 0
      store.commit('increaseSceneIndex')
    })
    nuxt.$on('endSceneTransition', () => {
      this.pauseRender = false
    })
    nuxt.$on('pauseRender', () => {
      this.pauseRender = true
    })
    nuxt.$on('playRender', () => {
      this.pauseRender = false
    })
  }

  removeGroup (group) {
    const selectedObject = this.scene.getObjectByName(group.name)
    this.scene.remove(selectedObject)
  }

  initBloom () {
    this.bloom = new Bloom({
      scene: this.scene,
      camera: this.camera.camera,
      renderer: this.renderer,
      size: this.size,
      params: {
        exposure: 1.1, // Set to one when bloom renderer actived
        bloomStrength: 1.8,
        bloomThreshold: 0,
        bloomRadius: 0.8
      }
    })
  }

  render () {
    if (nuxt && store && !this.events) {
      this.addTransitionEvent()
      this.camera.addEvents()
      this.crystal.loadImages()
      this.events = true
    }

    this.time.delta = this.clock.getDelta()
    this.time.total += this.time.delta

    // TO DO : update code so camera moves like head following the mouse BUT needs to check camera rotation before
    // if (!this.currentScene.isFixedView()) {
    //     this.target.x = ( 1 - this.mouse.x ) * 0.002;
    //     this.target.y = ( 1 - this.mouse.y ) * 0.002;

    //     // this.camera.camera.rotation.x += 0.01 * ( this.target.y - this.camera.camera.rotation.x )
    //     // this.camera.camera.rotation.y += 0.2 * ( this.target.x - this.camera.camera.rotation.y )
    // }

    if (!this.pauseRender) {
      // Update camera rotation & look at
      if (store && !store.state.cameraIsZoomed) {
        if (store && store.state.desert.interaction && store.state.sceneIndex === 1) {
          this.camera.camera.position.lerp(end, 0.1)
        } else {
          this.vectCam.set(this.p1.x, this.p1.y, this.p1.z)
          this.camera.camera.position.lerp(this.vectCam, 0.1)
        }
      }
      this.camLook.lerp(this.camTarget, 0.05)
      this.camera.camera.lookAt(this.camLook)

      this.currentScene.render(this.time.total, this.time.delta, this.progression)

      // Render
      this.bloom.render()
      // this.renderer.render(this.scene, this.camera.camera)
    }
  }
}

export default new Common()
