/* eslint-disable no-unused-vars */

import { gsap } from 'gsap'
import * as THREE from 'three'
import perlinNoise3d from 'perlin-noise-3d'
import Raycaster from '../Utils/Raycaster'
import modelDesert from '../../../../assets/models/m_desert.glb'
import Land from '../Land'
import MainGui from '../Utils/MainGui'
import ColorGUIHelper from '../Utils/ColorGUIHelper'
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

    // Generals params
    this.params = {
      spotLightOnFlowersColor: '#BED9FD'
    }

    this.hold = false
    this.land = new Land({ texture: sandTexture })

    this.camera = this.props.camera
    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null

    this.progression = null

    this.desertGroup = new THREE.Group()

    this.myCube = null

    this.plantsGroup = new THREE.Group()
    this.flowerTypes = ['white', 'tulip', 'blue', 'lavender']
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

    // Lights
    this.spotLightOnFlowers = null

    // GUI
    // this.gui = new MainGui()

    this.sporesElevation = 0
    this.cameraIsZoomed = false

    // Audio
    this.ambiantFile = require('../../../../assets/sounds/wind.ogg')

    // Cursor
    this.isCursorActive = false
  }

  init (scene, renderer) {
    this.land.load(this.desertGroup, modelDesert, 1)

    // Sound
    this.sound = new Sound({ camera: this.camera, audioFile: this.ambiantFile })

    /*
      * Material rocks
      * Need to do this shit to wait the complete load
      * TO DO : Have to find an other way
    */
    const cubeMap = [
      require('../../../../assets/textures/png/rocks/px.png'),
      require('../../../../assets/textures/png/rocks/nx.png'),
      require('../../../../assets/textures/png/rocks/py.png'),
      require('../../../../assets/textures/png/rocks/ny.png'),
      require('../../../../assets/textures/png/rocks/pz.png'),
      require('../../../../assets/textures/png/rocks/nz.png')
    ]

    const textureCrystals = new THREE.CubeTextureLoader().load(cubeMap)
    textureCrystals.mapping = THREE.CubeRefractionMapping
    textureCrystals.encoding = THREE.sRGBEncoding
    const crystalsMaterial = new THREE.MeshLambertMaterial({
      color: 0x210021,
      envMap: textureCrystals,
      refractionRatio: 0.8,
      reflectivity: 1,
      combine: THREE.AddOperation,
      transparent: true,
      opacity: 0.5,
      premultipliedAlpha: true,
      depthWrite: false
    })
    const innerCrystalsMaterial = new THREE.MeshBasicMaterial({
      color: 'white',
      opacity: 0.1,
      transparent: true
    })

    // Have to setTimouté to wait the generation of crystals and the watcher of the sound
    setTimeout(() => {
      // Crytals materials
      for (let i = 1; i <= 19; i++) {
        this.desertGroup.children[2].children[i].material = crystalsMaterial
        this.desertGroup.children[2].children[i].layers.enable(1)
        this.desertGroup.children[2].children[i + 19].material = innerCrystalsMaterial
        this.desertGroup.children[2].children[i + 19].layers.enable(1)
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
    }, 2000)

    // Cube - Hover zone for flowers
    this.myCube = new Cube({ scene: this.plantsGroup, position: { x: 0.2, y: 0, z: 0.7 } })

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

    this.plantsGroup.position.set(-41, 1, 1.4)
    this.plantsGroup.scale.set(2.5, 2.5, 2.5)
    this.plantsGroup.name = 'Plants'

    this.desertGroup.add(this.plantsGroup)

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    // Spores
    this.spores = new Particles()
    this.spores.particles.position.set(-41, 1, 1.4)
    this.desertGroup.add(this.spores.particles)

    // SpotLights on Flowers
    this.spotLightOnFlowers = new THREE.PointLight(this.params.spotLightOnFlowersColor, 1, 10)
    this.spotLightOnFlowers.position.y += 15
    this.spotLightOnFlowers.position.x -= 3
    this.spotLightOnFlowers.position.z -= 3
    // this.spotLightOnFlowers.color = '#ffffff'
    this.spores.particles.add(this.spotLightOnFlowers)

    // Fog
    const colorBG = new THREE.Color('#404040')
    scene.fog = new THREE.Fog(colorBG, 10, 300)
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
      new THREE.BoxBufferGeometry(20000, 20000, 20000),
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

    scene.add(skybox)

    // GUI
    // Lights
    // const currentSceneFolder = this.gui.gui.addFolder('Current Scene')
    // const lightsFolder = currentSceneFolder.addFolder('Lights')
    // lightsFolder.addColor(new ColorGUIHelper(this.spotLightOnFlowers, 'color'), 'value').name('flowers color')
    // lightsFolder.add(this.spotLightOnFlowers, 'intensity', 0, 2, 0.1).name('intensity flowers')
    // // Fog and Background
    // const fogFolder = currentSceneFolder.addFolder('Fog')
    // fogFolder.addColor(new ColorGUIHelper(scene.fog, 'color'), 'value').name('fog color')
    // fogFolder.addColor(new ColorGUIHelper(scene, 'background'), 'value').name('background color')

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
      this.cameraOnHold()
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
      if (this.cameraIsZoomed) {
        this.cameraOnUnhold(this.camera.camera.position)
      }
    })
  }

  handleClick () {
    if (this.intersects.length > 0) {
      // eslint-disable-next-line no-console
      console.log(this.camera.camera)
      // gsap.to(this, {progression: 1, duration: 1, ease: "power3.out"} )
    }
  }

  cameraOnHold () {
    this.cameraIsZoomed = true
    gsap.to(
      this.camera.camera.position,
      {
        x: this.camera.camera.position.x + 1,
        y: this.camera.camera.position.y - 1,
        z: this.camera.camera.position.z - 1,
        duration: 2,
        ease: 'power3.out',
        onComplete: this.cameraOnUnhold(this.camera.camera.position)
      }
    )
  }

  cameraOnUnhold (camera) {
    gsap.killTweensOf(camera)
    gsap.to(
      this.camera.camera.position,
      {
        x: this.camera.camera.position.x - 1,
        y: this.camera.camera.position.y + 1,
        z: this.camera.camera.position.z + 1,
        duration: 1,
        ease: 'power3.out',
        onComplete: () => {
          this.cameraIsZoomed = false
        }
      }
    )
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
    if (this.intersects.length > 0 && this.isCursorActive === false && nuxt) {
      this.isCursorActive = true
      nuxt.$emit('activeCursor')
    } else if (this.intersects.length === 0 && nuxt && this.isCursorActive === true) {
      this.isCursorActive = false
      nuxt.$emit('unactiveCursor')
    }
    this.spores.particles.material.uniforms.uTime.value = elapsedTime
    this.plants.forEach((plant) => {
      plant.update()
    })
  }
}
