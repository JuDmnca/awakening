/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import Stats from 'three/examples/jsm/libs/stats.module'
import Camera from '../Camera'
import MainGui from '../Utils/MainGui'
import Cube from '../Desert/Cube'
import Raycaster from '../Utils/Raycaster'
import Bloom from '../Utils/Bloom.js'

let store
let nuxt
if (process.browser) {
  window.onNuxtReady(({ $nuxt, $store }) => {
    nuxt = $nuxt
    store = $store
  })
}

class Constellation {
  constructor () {
    this.scene = null
    this.renderer = null

    this.camera = null

    this.events = false

    this.windowHalf = new THREE.Vector2()

    this.size = {
      windowW: null,
      windowH: null
    }

    this.clock = null

    this.time = {
      total: null,
      delta: null
    }

    this.light = null

    // General Params
    this.params = {
      light: {
        angle: Math.PI / 2,
        color: '#ffffff',
        intensity: 2.85,
        distance: 400
      }
    }

    this.gui = null

    this.controls = null

    this.nbEtoiles = 40

    this.raycaster = null
    this.intersectedObject = null
    this.lastIntersectedObject = null
    this.isIntersected = false
    this.cristalScale = 1.5

    this.cubes = []
    this.randomCubesSpeed = []

    // Post Processing
    this.bloom = null
  }

  init ($canvas) {
    // FPS indicator
    (function () { const script = document.createElement('script'); script.onload = function () { const stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop () { stats.update(); requestAnimationFrame(loop) }) }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script) })()

    this.setSize()

    this.scene = new THREE.Scene()

    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas
    })

    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.renderer.setSize(this.size.windowW, this.size.windowH)

    this.clock = new THREE.Clock()
    this.clock.start()

    // Skybox
    const loader = new THREE.CubeTextureLoader()
    loader.premultiplyAlpha = true
    const texture = loader.load([
      require('../../../../assets/textures/png/rocks/px.png'),
      require('../../../../assets/textures/png/rocks/nx.png'),
      require('../../../../assets/textures/png/rocks/py.png'),
      require('../../../../assets/textures/png/rocks/ny.png'),
      require('../../../../assets/textures/png/rocks/pz.png'),
      require('../../../../assets/textures/png/rocks/nz.png')
    ])
    texture.encoding = THREE.sRGBEncoding
    const skybox = new THREE.Mesh(
      new THREE.BoxBufferGeometry(200, 200, 200),
      new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib.cube.uniforms),
        vertexShader: THREE.ShaderLib.cube.vertexShader,
        fragmentShader: THREE.ShaderLib.cube.fragmentShader,
        depthTest: false,
        depthWrite: false,
        side: THREE.BackSide,
        toneMapped: false
      })
    )

    skybox.material.uniforms.envMap.value = texture

    Object.defineProperty(skybox.material, 'envMap', {

      get () {
        return this.uniforms.envMap.value
      }

    })

    const skyboxGroup = new THREE.Group()
    skyboxGroup.add(skybox)
    this.scene.add(skyboxGroup)

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
    const cubeTransparentMaterial = new THREE.MeshStandardMaterial({
      color: 'red',
      opacity: 0,
      transparent: 0
    })

    // Generation of this.cubes
    for (let i = 0; i < this.nbEtoiles; i++) {
      const cubeMaterial = new THREE.MeshStandardMaterial({

        color: new THREE.Color('#' + Math.floor(Math.random() * 16777215).toString(16)),
        opacity: 1,
        transparent: 1
      })

      this.cubes.push(new THREE.Mesh(cubeGeometry, cubeMaterial))

      this.cubes[i].position.set(this.getRandomArbitrary(-30, 30), this.getRandomArbitrary(-15, 30), this.getRandomArbitrary(-30, 30))
      this.cubes[i].layers.enable(1)
      this.scene.add(this.cubes[i])
    }

    // Generation of random cube speed
    for (let i = 0; i < this.cubes.length; i++) {
      this.randomCubesSpeed.push(Math.random())
    }

    // Init camera
    this.initCamera()

    // Listeners
    this.addWheelEvent()
    window.addEventListener('click', () => {
      if (this.intersectedObject.length > 0) {
        const datas = {
          name: 'Julie',
          smell: 'Muscade'
        }
        store.commit('constellation/getDatas', datas)
        store.commit('constellation/toggleVisible')
      }
    })

    // Init light
    this.light = new THREE.PointLight(this.params.light.color, this.params.light.intensity, this.params.light.distance)
    this.light.position.set(0, 0, 0)
    this.scene.add(this.light)

    // this.scene.background = new THREE.Color('#003c66')

    // Controls
    this.controls = new OrbitControls(this.camera.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enableZoom = false
    this.controls.minPolarAngle = Math.PI / 2
    this.controls.rotateSpeed = 1
    this.controls.enableRotate = true
    this.controls.minDistance = 1

    // Raycaster
    this.raycaster = new Raycaster()
    this.raycaster.init(this.camera, this.renderer)
    this.raycaster.render(this.scene)

    // Post Processing
    this.bloom = new Bloom({
      scene: this.scene,
      camera: this.camera.camera,
      renderer: this.renderer,
      params: {
        exposure: 0.4,
        bloomStrength: 1,
        bloomThreshold: 0,
        bloomRadius: 1
      }
    })
    // Params for constellation : BT : 0, BS: 1, BR : 0.4

    // GUI
    this.gui = new MainGui()
    const controlsFolder = this.gui.gui.addFolder('Controls')
    controlsFolder.add(this.controls, 'rotateSpeed', 0, 2, 0.1).name('Controls Speed')
  }

  initCamera () {
    this.camera = new Camera({
      window: this.size
    })
  }

  getRandomArbitrary (min, max) {
    return Math.random() * (max - min) + min
  }

  setSize () {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight
    }
    this.windowHalf.x = this.size.windowW / 2
    this.windowHalf.y = this.size.windowH / 2
  }

  resize () {
    this.setSize()
    this.camera.camera.aspect = this.size.windowW / this.size.windowH
    this.camera.camera.updateProjectionMatrix()
    this.renderer.setSize(this.size.windowW, this.size.windowH)
  }

  addWheelEvent () {
    window.addEventListener('resize', () => {
      this.resize()
    })
  }

  render () {
    this.time.delta = this.clock.getDelta()
    this.time.total += this.time.delta
    for (let i = 0; i < this.cubes.length; i++) {
      this.cubes[i].rotation.y = this.time.total * (this.randomCubesSpeed[i] + 0.1)
      this.cubes[i].position.y += Math.cos(this.time.total) / ((this.randomCubesSpeed[i] + 0.2) * 150)
    }
    // Intersections
    // if(store) {
    //     console.log(store.state.constellation.isVisible)
    // }

    this.intersectedObject = this.raycaster.render(this.scene)
    if (this.intersectedObject.length > 0 && this.isIntersected === false) {
      this.lastIntersectedObject = this.intersectedObject[0]
      gsap.killTweensOf(this.lastIntersectedObject.object.scale)
      gsap.to(
        this.lastIntersectedObject.object.scale,
        {
          x: this.cristalScale,
          y: this.cristalScale,
          z: this.cristalScale,
          duration: 1,
          ease: 'power3.out',
          onComplete: this.increaseCounter
        }
      )
      this.isIntersected = true
    } else if (!this.intersectedObject.length > 0 && this.isIntersected === true) {
      gsap.killTweensOf(this.lastIntersectedObject.object.scale)
      gsap.to(
        this.lastIntersectedObject.object.scale,
        {
          x: 1 / this.cristalScale,
          y: 1 / this.cristalScale,
          z: 1 / this.cristalScale,
          duration: 1,
          ease: 'power3.out',
          onComplete: this.increaseCounter
        }
      )
      this.lastIntersectedObject = null
      this.isIntersected = false
    }

    // this.renderer.render(this.scene, this.camera.camera)

    this.controls.update()

    this.bloom.render()
  }
}

export default new Constellation()
