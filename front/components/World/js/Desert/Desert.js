/* eslint-disable no-unused-vars */
import { gsap } from 'gsap'
import * as THREE from 'three'
import perlinNoise3d from 'perlin-noise-3d'
import { ReinhardToneMapping } from 'three'
import Raycaster from '../Utils/Raycaster'
import modelDesert from '../../../../assets/models/m_desert_draco.gltf'
import modelGrass from '../../../../assets/models/m_grass.gltf'
import Loader from '../Loader'
import Land from '../Land'
import Rotation from '../Utils/Rotation'
import Sound from '../Utils/SoundLoader'
import Particles from './Particles'
import Plant from './Plant'
import Cube from './Cube'

const sandTexture = require('../../../../assets/textures/t_sand.png')

let store, nuxt
if (process.browser) {
  window.onNuxtReady(({ $nuxt, $store }) => {
    store = $store
    nuxt = $nuxt
  })
}

export default class Desert {
  constructor (props) {
    this.props = props
    this.name = 'desert'

    this.hold = false
    this.land = new Land({ texture: sandTexture, index: 0 })

    this.camera = this.props.camera
    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null

    this.progression = null

    this.desertGroup = new THREE.Group()

    this.myCube = null

    this.plantsGroup = new THREE.Group()
    this.grass = null
    this.flowerTypes = ['white', 'tulip', 'blue']
    this.plants = []
    this.plantsOffsets = {
      x: 10,
      y: 0.1,
      z: 2
    }

    // Noise
    // eslint-disable-next-line new-cap
    this.noise = new perlinNoise3d()

    // Particles
    this.spores = null

    // GUI
    // this.gui = new MainGui()

    this.sporesElevation = 0

    // Audio
    this.ambiantFile = require('../../../../assets/sounds/wind.ogg')

    // Cursor
    this.isCursorActive = false
  }

  async init (scene, renderer) {
    renderer.toneMappingExposure = Math.pow(2, 4.0)
    const desertModel = await this.land.load(modelDesert, 1)
    this.desertGroup.add(desertModel)

    // Sound
    this.sound = new Sound({ camera: this.camera, audioFile: this.ambiantFile })

    // Material rocks
    const cubeMap = [
      require('../../../../assets/textures/png/constellation/px.png'),
      require('../../../../assets/textures/png/constellation/nx.png'),
      require('../../../../assets/textures/png/constellation/py.png'),
      require('../../../../assets/textures/png/constellation/ny.png'),
      require('../../../../assets/textures/png/constellation/pz.png'),
      require('../../../../assets/textures/png/constellation/nz.png')
    ]

    const colorCrystals = new THREE.Color('#bd1780')
    const textureCrystals = new THREE.CubeTextureLoader().load(cubeMap)
    textureCrystals.mapping = THREE.CubeRefractionMapping
    textureCrystals.encoding = THREE.sRGBEncoding
    const crystalsMaterial = new THREE.MeshPhongMaterial({
      color: colorCrystals,
      envMap: textureCrystals,
      refractionRatio: 0.98,
      combine: THREE.AddOperation,
      transparent: true,
      opacity: 0.95,
      premultipliedAlpha: true,
      depthWrite: false
    })
    const innerCrystalsMaterial = new THREE.MeshPhongMaterial({
      color: colorCrystals,
      opacity: 1,
      transparent: true,
      emissive: colorCrystals,
      emissiveIntensity: 1
    })

    // Crytals materials
    for (let i = 1; i <= this.desertGroup.children[0].children.length - 1; i++) {
      const child = this.desertGroup.children[0].children[i]
      if (child.name.includes('inside')) {
        child.material = innerCrystalsMaterial
        child.layers.enable(1)
      } else if (child.name.includes('outside')) {
        child.material = crystalsMaterial
        child.layers.enable(1)
      }
    }

    // Watch on store if we have to mute sounds
    store.watch(() => store.state.desert.isMuted, (isMuted) => {
      if (isMuted) {
        this.sound.sound.pause()
      } else {
        this.sound.sound.play()
      }
    })
    this.sound.sound.play()

    // Add Plants (Flower + Stem)
    let index = -1
    for (let nbPlants = 0; nbPlants <= 15; nbPlants++) {
      index++
      if (index >= 3) {
        index = 0
      }
      const plant = new Plant({ orientation: nbPlants, flowerType: this.flowerTypes[index] })
      this.plants.push(plant)

      setTimeout(() => {
        this.plantsGroup.add(plant.init())
      }, 1000)
    }
    // Flowers hover zone
    this.myCube = new Cube({ scene: this.plantsGroup, position: { x: 0.2, y: 0, z: 0.6 } })

    // Grass
    this.grass = new Loader({ model: modelGrass })
    setTimeout(() => {
      this.plantsGroup.add(this.grass.initGrass())
    }, 1000)

    this.plantsGroup.position.set(-41, 0.5, 1.4)
    this.plantsGroup.scale.set(2.5, 2.5, 2.5)
    this.plantsGroup.name = 'Plants'
    this.desertGroup.add(this.plantsGroup)

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    // Spores
    this.spores = new Particles()
    this.spores.particles.position.set(-41, 1, 1.4)

    this.desertGroup.add(this.spores.particles)
    this.desertGroup.add(this.plantsGroup)

    // Raycaster
    this.raycaster.init(this.camera, renderer)
    // SpotLights on Flowers
    this.spotLightOnFlowers = new THREE.PointLight(0xFFF, 1, 10)
    this.spotLightOnFlowers.position.y += 15
    this.spotLightOnFlowers.position.x -= 3
    this.spotLightOnFlowers.position.z -= 3

    // Fog
    const colorBG = new THREE.Color('#040408')
    // scene.fog = new THREE.Fog(colorBG, 10, 300)
    const loader = new THREE.CubeTextureLoader()
    loader.premultiplyAlpha = true
    const SkyboxTexture = loader.load([
      require('../../../../assets/textures/png/rocks/px.png'),
      require('../../../../assets/textures/png/rocks/nx.png'),
      require('../../../../assets/textures/png/rocks/py.png'),
      require('../../../../assets/textures/png/rocks/ny.png'),
      require('../../../../assets/textures/png/rocks/pz.png'),
      require('../../../../assets/textures/png/rocks/nz.png')
    ])
    SkyboxTexture.encoding = THREE.sRGBEncoding

    // Skybox
    const skybox = new THREE.Mesh(
      new THREE.BoxBufferGeometry(20000, 20000, 20000),
      new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(THREE.ShaderLib.cube.uniforms),
        vertexShader: THREE.ShaderLib.cube.vertexShader,
        fragmentShader: THREE.ShaderLib.cube.fragmentShader,
        // depthTest: false,
        depthWrite: false,
        side: THREE.BackSide
        // toneMapped: false
      })
    )

    skybox.material.uniforms.envMap.value = SkyboxTexture
    // skybox.layers.enable(1)
    Object.defineProperty(skybox.material, 'envMap', {
      get () {
        return this.uniforms.envMap.value
      }
    })

    scene.add(skybox)

    // Listeners
    window.addEventListener('click', () => {
      this.handleClick()
    })

    // Add desert scene to main scene
    this.desertGroup.name = 'desert'
    scene.add(this.desertGroup)
  }

  enableSporesMovement () {
    window.addEventListener('mousedown', () => {
      this.hold = true
      this.sporesElevation += 1000
      this.inhale()
      if (store.state.desert.interaction) {
        nuxt.$emit('zoomCamera', { position: { x: -41, y: 1, z: 1.4 } })
      }
    })

    let lastMouseX = -1
    let lastMouseY = -1
    window.addEventListener('mousemove', (e) => {
      // Spores elevating when mousemove
      e.preventDefault()
      const mouseX = e.pageX
      const mouseY = e.pageY
      if (lastMouseX > -1) {
        this.sporesElevation += Math.max(Math.abs(mouseX - lastMouseX), Math.abs(mouseY - lastMouseY))
      }
      lastMouseX = mouseX
      lastMouseY = mouseY
      this.inhale({ mousemove: true })
    })

    window.addEventListener('mouseup', () => {
      this.exhale()
      if (store.state.cameraIsZoomed) {
        this.cameraOnUnhold()
      }
    })
  }

  handleClick () {
    if (this.intersects.length > 0) {
      store.commit('desert/toggleInteraction', true)
    }
  }

  cameraOnUnhold () {
    nuxt.$emit('unzoomCamera')
  }

  isFixedView () {
    if (this.progression > 0.9) {
      return true
    } else {
      return false
    }
  }

  inhale (mousemove = false) {
    gsap.killTweensOf([this.spores.particles.material.uniforms.uZSpeed])
    // Movement on mousemove
    if (mousemove) {
      gsap.to(
        this.spores.particles.material.uniforms.uZSpeed,
        {
          value: this.sporesElevation / 1000,
          duration: 3,
          ease: 'power3.out'
        }
      )
    } else {
      // Movement on hold
      gsap.to(
        this.spores.particles.material.uniforms.uZSpeed,
        {
          value: this.sporesElevation / 1000,
          duration: store.state.durationHold,
          ease: 'power4.inOut'
        }
      )
    }
  }

  exhale () {
    gsap.killTweensOf([this.spores.particles.material.uniforms.uZSpeed])
    this.sporesElevation -= 1000
    gsap.to(
      this.spores.particles.material.uniforms.uZSpeed,
      {
        value: this.sporesElevation / 1000,
        duration: 1,
        ease: 'power3.out'
      }
    )
  }

  render (elapsedTime) {
    if (this.plantsGroup.children[0]) {
      this.intersects = this.raycaster.render(this.plantsGroup)
    }
    if (this.intersects.length > 0 && !this.isCursorActive && nuxt) {
      this.isCursorActive = true
      nuxt.$emit('activeCursor')
    } else if (this.intersects.length === 0 && nuxt && this.isCursorActive) {
      this.isCursorActive = false
      nuxt.$emit('unactiveCursor')
    }
    if (this.spores) {
      this.spores.particles.material.uniforms.uTime.value = elapsedTime
    }
    this.plants.forEach((plant) => {
      plant.update()
    })
  }
}
