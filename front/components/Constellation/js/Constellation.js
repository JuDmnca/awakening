/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import { Vector3 } from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import gsap from 'gsap'

import gemModel from '@/assets/models/gems_constellation/gem-1-compressed.gltf'
import gemModel2 from '@/assets/models/gems_constellation/gem-2-compressed.gltf'
import gemModel3 from '@/assets/models/gems_constellation/gem-3-compressed.gltf'

import Camera from '../../Utils/js/Camera'
import Loader from '../../Utils/js/Loader'
import Raycaster from '../../Utils/js/Raycaster'
import Bloom from '../../Utils/js/Bloom'
import MainGui from '../../Utils/js/MainGui'

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
    this.clock = null

    this.scene = null
    this.renderer = null

    this.camera = null
    this.light = null

    this.events = false

    this.windowHalf = new THREE.Vector2()

    this.size = {
      windowW: null,
      windowH: null
    }

    this.time = {
      total: null,
      delta: null
    }

    this.gemsModels = [gemModel, gemModel2, gemModel3]

    // General Params
    this.params = {
      light: {
        angle: Math.PI / 2,
        color: '#ffffff',
        intensity: 0.3,
        distance: 1000
      }
    }

    // Orbit Control
    this.controls = null

    // Raycaster
    this.raycaster = null
    this.intersectedObject = null
    this.lastIntersectedObject = null
    this.isIntersected = false

    // Crystals
    this.cristalScale = 1.5
    this.gems = []
    this.randomCubesSpeed = []
    this.gemGeometry = null

    // Post Processing
    this.bloom = null
  }

  init ($canvas) {
    // FPS indicator
    (function () { const script = document.createElement('script'); script.onload = function () { const stats = new Stats(); document.body.appendChild(stats.dom); requestAnimationFrame(function loop () { stats.update(); requestAnimationFrame(loop) }) }; script.src = '//mrdoob.github.io/stats.js/build/stats.min.js'; document.head.appendChild(script) })()

    this.setSize()

    this.scene = new THREE.Scene()
    this.clock = new THREE.Clock()
    this.clock.start()

    this.addRenderer($canvas)
    this.initCamera()
    this.initLight()

    // Skybox
    this.loadTexture()
    this.addSkybox()

    // Crystals
    this.generateCrystals()

    this.addControls()
    this.addRaycaster()
    this.addBloom()

    // Listeners
    this.addWheelEvent()
    window.addEventListener('click', () => {
      if (this.intersectedObject.length > 0) {
        nuxt.$emit('onCrystalClick')
        const currentUser = {
          id: this.intersectedObject[0].object.userId,
          datas: this.intersectedObject[0].object.datas
        }
        store.commit('constellation/setCurrentUser', currentUser)
      }
    })

    // Debug
    this.addGUI()
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

  addRenderer ($canvas) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: $canvas
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.size.windowW, this.size.windowH)
  }

  initCamera () {
    this.camera = new Camera({
      window: this.size
    })
  }

  initLight () {
    this.light = new THREE.PointLight(this.params.light.color, this.params.light.intensity, this.params.light.distance)
    this.light.position.set(0, -17, 0)
    this.scene.add(this.light)
  }

  loadTexture () {
    const loader = new THREE.CubeTextureLoader()
    loader.premultiplyAlpha = true
    this.texture = loader.load([
      require('../../../assets/textures/png/constellation/px.png'),
      require('../../../assets/textures/png/constellation/nx.png'),
      require('../../../assets/textures/png/constellation/py.png'),
      require('../../../assets/textures/png/constellation/ny.png'),
      require('../../../assets/textures/png/constellation/pz.png'),
      require('../../../assets/textures/png/constellation/nz.png')
    ])
    this.texture.encoding = THREE.sRGBEncoding
  }

  addSkybox () {
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

    skybox.material.uniforms.envMap.value = this.texture

    Object.defineProperty(skybox.material, 'envMap', {
      get () {
        return this.uniforms.envMap.value
      }
    })

    const skyboxGroup = new THREE.Group()
    skyboxGroup.add(skybox)
    this.scene.add(skyboxGroup)
  }

  async generateCrystals () {
    const textureCrystals = this.texture
    textureCrystals.mapping = THREE.CubeRefractionMapping
    textureCrystals.encoding = THREE.sRGBEncoding
    const crystalsMaterial = new THREE.MeshPhongMaterial({
      envMap: textureCrystals,
      side: THREE.DoubleSide,
      // refractionRatio: 1,
      reflectivity: 1,
      // combine: THREE.AddOperation,
      transparent: true,
      opacity: 0.8,
      // premultipliedAlpha: true,
      depthWrite: false
      // emissive: colorCrystals,
      // emissiveIntensity: 0.8
      // map: textureCrystalsTest
    })

    // Load gems geometry
    // this.scene.add(this.gemGeometry)

    // Generation of this.gems
    for (let i = 0; i < store.state.constellation.dataUsers.length; i++) {
      const cubeMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#' + Math.floor(Math.random() * 16777215).toString(16)),
        // envMap: textureCrystals,
        refractionRatio: 0.98
      })
      const gemMesh = await new Loader({ material: cubeMaterial, model: this.gemsModels[this.getRandomInt(3)], position: { x: 0, y: 0, z: -5 } }).initGems()
      const x = [this.getRandomArbitrary(-30, -5), this.getRandomArbitrary(15, 30)]
      const y = [this.getRandomArbitrary(-10, -5), this.getRandomArbitrary(5, 30)]
      const z = [this.getRandomArbitrary(-30, -5), this.getRandomArbitrary(15, 30)]
      const pos = new Vector3(x[this.getRandomInt(2)], y[this.getRandomInt(2)], z[this.getRandomInt(2)])
      gemMesh.position.copy(pos)
      gemMesh.layers.enable(1)
      gemMesh.datas = store.state.constellation.dataUsers[i]
      // gemMesh.material.color = new THREE.Color('#29ff3e')
      switch (gemMesh.datas.color) {
        case 'blue':
          gemMesh.material.color = new THREE.Color('#2461ff')
          break
        case 'purple':
          gemMesh.material.color = new THREE.Color('#be6eff')
          break
        case 'lime':
          gemMesh.material.color = new THREE.Color('#29ff3e')
          break
        case 'orange':
          gemMesh.material.color = new THREE.Color('#ff9224')
          break
        case 'red':
          gemMesh.material.color = new THREE.Color('#ff2424')
          break
        case 'yellow':
          gemMesh.material.color = new THREE.Color('#ffff29')
          break
        default:
          gemMesh.material.color = new THREE.Color('#ffff29')
      }
      gemMesh.Ydirection = Math.random() < 0.5 ? -1 : 1 // Random -1 or 1 direction
      gemMesh.userId = i
      this.gems.push(gemMesh)

      this.scene.add(this.gems[i])
    }

    // Generation of random cube speed
    for (let i = 0; i < this.gems.length; i++) {
      this.randomCubesSpeed.push(Math.random())
    }
  }

  addControls () {
    this.controls = new OrbitControls(this.camera.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.enableZoom = false
    this.controls.minPolarAngle = Math.PI / 2
    this.controls.rotateSpeed = 1
    this.controls.enableRotate = true
    this.controls.minDistance = 1
  }

  addRaycaster () {
    this.raycaster = new Raycaster()
    this.raycaster.init(this.camera, this.renderer)
    this.raycaster.render(this.scene)
  }

  addBloom () {
    this.bloom = new Bloom({
      scene: this.scene,
      camera: this.camera.camera,
      renderer: this.renderer,
      size: this.size,
      params: {
        exposure: 2.5,
        bloomStrength: 2.5,
        bloomThreshold: 0,
        bloomRadius: 1
      }
    })
  }

  addWheelEvent () {
    window.addEventListener('resize', () => {
      this.resize()
    })
  }

  addGUI () {
    this.gui = new MainGui()
    const controlsFolder = this.gui.gui.addFolder('Controls')
    controlsFolder.add(this.controls, 'rotateSpeed', 0, 2, 0.1).name('Controls Speed')

    const lightFolder = this.gui.gui.addFolder('Light')
    lightFolder.add(this.light, 'intensity', 0, 30, 0.1).name('Intensity')
    lightFolder.add(this.light, 'distance', 0, 2000, 1).name('Distance')
    lightFolder.add(this.light.position, 'y', -100, 100, 1).name('y')
  }

  getRandomArbitrary (min, max) {
    return Math.random() * (max - min) + min
  }

  getRandomInt (max) {
    return Math.floor(Math.random() * max)
  }

  render () {
    this.time.delta = this.clock.getDelta()
    this.time.total += this.time.delta

    if (this.gems.length === store.state.constellation.dataUsers.length) {
      for (let i = 0; i < this.gems.length; i++) {
        this.gems[i].rotation.y = this.time.total * (this.randomCubesSpeed[i] + 0.1)
        this.gems[i].position.y += Math.cos(this.time.total) / ((this.randomCubesSpeed[i] + 0.2) * 150) * this.gems[i].Ydirection
      }
    }

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
          ease: 'power3.out'
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
          ease: 'power3.out'
        }
      )
      this.lastIntersectedObject = null
      this.isIntersected = false
    }

    this.controls.update()
    this.bloom.render()
  }
}

export default new Constellation()
