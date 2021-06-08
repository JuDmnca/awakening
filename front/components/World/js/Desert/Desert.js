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

    this.desertGroup = new THREE.Group()

    // FLOWERS
    this.plantsGroup = new THREE.Group()
    this.grass = null
    this.flowerTypes = ['white', 'tulip', 'blue']
    this.plants = []
    this.flowersHoverZone = null
    this.plantsOffsets = {
      x: 10,
      y: 0.1,
      z: 2
    }
    this.spores = null
    this.sporesElevation = 0

    // NOISE
    // eslint-disable-next-line new-cap
    this.noise = new perlinNoise3d()

    // SOUND
    this.ambiantFile = require('../../../../assets/sounds/wind.ogg')

    // CURSOR
    this.isCursorActive = false

    // TIMES
    this.time = {
      stationary: 0,
      cursorImmobile: 0,
      noHold: 0
    }
    this.isStationary = false
    this.isCursorImmobile = true
    this.isHold = false

    this.cursorDistance = 0
    this.enableSporesElevationAt = 0.85
    this.progression = 0
  }

  async init (scene, renderer) {
    renderer.toneMappingExposure = Math.pow(1.5, 4.0)

    // LOAD MODEL
    const desertModel = await this.land.load(modelDesert, 1)
    this.desertGroup.add(desertModel)

    // SOUND
    this.addSound()

    // FLOWERS
    this.addFlowers()

    // RAYCASTER
    this.raycaster.init(this.camera, renderer)

    // FOG
    // this.addFog(scene)

    // SKYBOX
    this.addSkybox(scene)

    // MOUSE
    this.lastMouseX = -1
    this.lastMouseY = -1

    // Add desert scene to main scene
    this.desertGroup.name = this.name
    scene.add(this.desertGroup)
  }

  onWheelMovement (e) {
    this.time.stationary = 0
    if (this.isStationary) {
      nuxt.$emit('handleScrollAnimation')
    }
    this.isStationary = false
  }

  onHold () {
    this.time.noHold = 0
    if (this.isHold) {
      nuxt.$emit('handleHoldAnimation')
    }
    this.isHold = false
  }

  onCursorMovement (e) {
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
  }

  addSound () {
    this.sound = new Sound({ camera: this.camera, audioFile: this.ambiantFile })

    // Watch on store if we have to mute sounds
    store.watch(() => store.state.desert.isMuted, (isMuted) => {
      if (isMuted) {
        this.sound.sound.pause()
      } else {
        this.sound.sound.play()
      }
    })
    this.sound.sound.play()
  }

  addFlowers () {
    let index = -1
    for (let nbPlants = 0; nbPlants <= 20; nbPlants++) {
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
    this.flowersHoverZone = new Cube({ scene: this.plantsGroup, position: { x: 0.2, y: 0, z: 0.6 } })

    // Grass
    this.grass = new Loader({ model: modelGrass })
    setTimeout(() => {
      this.plantsGroup.add(this.grass.initGrass())
    }, 1000)

    this.plantsGroup.position.set(-41, 0.5, 1.4)
    this.plantsGroup.scale.set(2.5, 2.5, 2.5)
    this.plantsGroup.name = 'Plants'
    this.desertGroup.add(this.plantsGroup)

    // Spores
    this.spores = new Particles()
    this.spores.particles.position.set(-41, 1, 1.4)

    this.desertGroup.add(this.spores.particles)
    this.desertGroup.add(this.plantsGroup)
  }

  addFog (scene) {
    const colorBG = new THREE.Color('#040408')
    scene.fog = new THREE.Fog(colorBG, 10, 300)
  }

  addSkybox (scene) {
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
  }

  addEvents () {
    window.addEventListener('click', () => {
      this.handleClick()
    })
    nuxt.$on('ColorSetted', () => {
      this.colorCrystals()
    })
  }

  colorCrystals () {
    const cubeMap = [
      require('../../../../assets/textures/png/constellation/px.png'),
      require('../../../../assets/textures/png/constellation/nx.png'),
      require('../../../../assets/textures/png/constellation/py.png'),
      require('../../../../assets/textures/png/constellation/ny.png'),
      require('../../../../assets/textures/png/constellation/pz.png'),
      require('../../../../assets/textures/png/constellation/nz.png')
    ]

    const colorCrystals = new THREE.Color(store.state.user.color)
    const textureCrystals = new THREE.CubeTextureLoader().load(cubeMap)
    textureCrystals.mapping = THREE.CubeRefractionMapping
    textureCrystals.encoding = THREE.sRGBEncoding
    const crystalsMaterial = new THREE.MeshPhongMaterial({
      color: colorCrystals,
      envMap: textureCrystals,
      refractionRatio: 0.5,
      combine: THREE.AddOperation,
      transparent: true,
      opacity: 0.8,
      premultipliedAlpha: true,
      depthWrite: false
    })
    const innerCrystalsMaterial = new THREE.MeshPhongMaterial({
      color: colorCrystals,
      opacity: 0.5,
      transparent: true,
      emissive: colorCrystals,
      emissiveIntensity: 1
    })

    for (let i = 0; i <= this.desertGroup.children[0].children.length - 1; i++) {
      const child = this.desertGroup.children[0].children[i]
      if (child.name.includes('inside')) {
        child.material = innerCrystalsMaterial
        child.layers.enable(1)
      } else if (child.name.includes('outside')) {
        child.material = crystalsMaterial
        child.layers.enable(1)
      }
    }
  }

  sporesOnHold () {
    this.hold = true
    this.sporesElevation += 1000
    this.inhale()
    if (store.state.desert.interaction) {
      nuxt.$emit('zoomCamera', { position: { x: -41, y: 1, z: 1.4 } })
    }
  }

  sporesOnMouseMove (e) {
    e.preventDefault()
    const mouseX = e.pageX
    const mouseY = e.pageY
    if (this.lastMouseX > -1) {
      this.sporesElevation += Math.max(Math.abs(mouseX - this.lastMouseX), Math.abs(mouseY - this.lastMouseY))
    }
    this.lastMouseX = mouseX
    this.lastMouseY = mouseY
    this.inhale({ mousemove: true })
  }

  sporesOnMouseUp () {
    this.exhale()
    if (store.state.cameraIsZoomed) {
      nuxt.$emit('unzoomCamera')
    }
  }

  handleClick () {
    if (this.intersects.length > 0 && !store.state.desert.interaction) {
      store.commit('desert/toggleInteraction', true)
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
        duration: 3,
        ease: 'power3.out'
      }
    )
  }

  render (elapsedTime, timeDelta, progression) {
    if (nuxt && store && !this.events) {
      this.addEvents()
    }
    if (this.plantsGroup.children[0]) {
      this.intersects = this.raycaster.render(this.plantsGroup)
    }
    // Indications
    this.time.stationary += timeDelta
    this.time.cursorImmobile += timeDelta
    this.time.noHold += timeDelta
    this.progression = progression

    // stationary = time to wait to show the indication
    // progression < 0.5 : indicator just in the first part of the scene.
    // console.log('stationary : ', this.time.stationary, ' isStationary : ', this.isStationary, ' progression : ', this.progression)
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
