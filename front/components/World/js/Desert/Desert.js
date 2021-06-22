/* eslint-disable no-unused-vars */
import { gsap } from 'gsap'
import * as THREE from 'three'
import perlinNoise3d from 'perlin-noise-3d'
import Raycaster from '../../../Utils/js/Raycaster'
import Rotation from '../../../Utils/js/Rotation'

import Sound from '../../../Utils/js/SoundLoader'
import crystalSoundURL from '../../../../assets/sounds/desert/crystalSound.mp3'
import fairyDustSoundURL from '../../../../assets/sounds/desert/fairy-dust-2.mp3'
import windURL from '../../../../assets/sounds/intro/vent.mp3'
import swooshURL from '../../../../assets/sounds/intro/swoosh.mp3'
import note1URL from '../../../../assets/sounds/desert/note-1.mp3'
import note2URL from '../../../../assets/sounds/desert/note-2.mp3'
import note3URL from '../../../../assets/sounds/desert/note-3.mp3'
import inhaleURL from '../../../../assets/sounds/desert/inhale.mp3'
import exhaleURL from '../../../../assets/sounds/desert/exhale.mp3'
import AudioPosition from '../../../Utils/js/AudioPosition'

import modelTulip from '../../../../assets/models/m_tulip.gltf'
import modelWhite from '../../../../assets/models/m_white_flower.gltf'
import modelBlue from '../../../../assets/models/m_blue_flower.gltf'

import Loader from '../../../Utils/js/Loader'

import Particles from './Particles'
import Plant from './Plant'
import Grass from './Grass'
import Cube from './Cube'

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
    this.name = 'Desert'

    this.hold = false

    this.camera = this.props.camera

    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null

    this.desertGroup = new THREE.Group()
    this.desertModel = this.props.model

    // FLOWERS
    this.plantsGroup = new THREE.Group()
    this.grass = null
    this.flowerTypes = ['white', 'tulip', 'blue']
    this.flowerModels = [modelWhite, modelTulip, modelBlue]
    this.plants = []
    this.flowersHoverZone = null
    this.plantsOffsets = {
      x: 10,
      y: 0.1,
      z: 2
    }
    this.spores = null
    this.sporesElevation = 0

    this.crystal = props.crystal

    // NOISE
    // eslint-disable-next-line new-cap
    this.noise = new perlinNoise3d()

    // SOUND
    this.swooshSound = null
    this.inhaleSound = null
    this.exhaleSound = null
    this.ambiantFile = null
    this.swooshFile = null
    this.note1File = null
    this.note2File = null
    this.note3File = null
    this.inhaleFile = null
    this.exhaleFile = null
    this.sporesPlayer = null

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

    this.inhaleIsCompleted = false

    // DEV : Set true
    // PROD : Set false
    this.canClickOnFlowers = false

    this.sporesSoundAlreadyPlayed = false
    this.intersectIsEnable = false
  }

  init (scene, renderer) {
    // GET MODEL
    this.desertGroup.add(this.desertModel)

    // LOAD FLOWERS MODELS
    this.loadFlowers()

    // ADD GRASS
    this.addGrass()

    // SOUND
    this.addSound(scene)

    nuxt.$on('started', () => {
      this.wind.sound.play()
      this.crystalSound.sound.play()
    })

    nuxt.$on('swoosh', () => {
      this.swooshSound.sound.play()
      this.intersectIsEnable = true
      setTimeout(() => {
        store.commit('setSubtitle', 'Notre esprit peut parfois nous sembler vide…')
        nuxt.$emit('toggleShowSubtitle')
      }, 3000)
      setTimeout(() => {
        nuxt.$emit('toggleShowSubtitle')
      }, 8000)
      setTimeout(() => {
        store.commit('setSubtitle', 'Et la perception de nos sens affaiblie.')
        nuxt.$emit('toggleShowSubtitle')
      }, 8500)
      setTimeout(() => {
        nuxt.$emit('toggleShowSubtitle')
      }, 13500)
      setTimeout(() => {
        store.commit('setSubtitle', 'Mais il suffit d’une stimulation singulière…')
        nuxt.$emit('toggleShowSubtitle')
      }, 14000)
      setTimeout(() => {
        nuxt.$emit('toggleShowSubtitle')
      }, 19000)
      setTimeout(() => {
        store.commit('setSubtitle', 'Pour redonner vie à notre monde intérieur.')
        nuxt.$emit('toggleShowSubtitle')
      }, 19500)
      setTimeout(() => {
        nuxt.$emit('toggleShowSubtitle')
        this.canClickOnFlowers = true
      }, 24500)
    })

    // RAYCASTER
    this.raycaster.init(this.camera, renderer)

    // FOG
    this.addFog(scene)

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

  async addSound (scene) {
    this.wind = new Sound({ camera: this.camera, audioFile: windURL, loop: true, canToggle: true, volume: 0.02 })
    this.swooshSound = new Sound({ camera: this.camera, audioFile: swooshURL, loop: false, canToggle: false, volume: 0.05 })
    this.note1Sound = new Sound({ camera: this.camera, audioFile: note1URL, loop: false, canToggle: false, volume: 1 })
    this.note2Sound = new Sound({ camera: this.camera, audioFile: note2URL, loop: false, canToggle: false, volume: 1 })
    this.note3Sound = new Sound({ camera: this.camera, audioFile: note3URL, loop: false, canToggle: false, volume: 1 })
    this.inhaleSound = new Sound({ camera: this.camera, audioFile: inhaleURL, loop: false, volume: 0.7 })
    this.exhaleSound = new Sound({ camera: this.camera, audioFile: exhaleURL, loop: false, volume: 0.7 })

    // Init sound spacialization
    this.soundCube = new Cube({ scene, position: { x: 72, y: 10, z: 62 } })
    this.crystalSound = new AudioPosition({ url: crystalSoundURL, camera: this.camera.camera, mesh: this.soundCube.cube, loop: true, volume: 12, refDistance: 0.03 })
    this.soundCube.cube.add(this.crystalSound.sound)
    this.sporesSound = await new AudioPosition({ url: fairyDustSoundURL, camera: this.camera.camera, mesh: this.plantsGroup, loop: false, volume: 5, refDistance: 1 })
  }

  removeAllSound () {
    this.disconnectSoundIfSource(this.wind.sound)
    this.disconnectSoundIfSource(this.swooshSound.sound)
    this.disconnectSoundIfSource(this.note1Sound.sound)
    this.disconnectSoundIfSource(this.note2Sound.sound)
    this.disconnectSoundIfSource(this.exhaleSound.sound)
    this.disconnectSoundIfSource(this.crystalSound.sound)
    this.disconnectSoundIfSource(this.sporesSound.sound)
    // Remove the sound after 3 seconds because the sound is playing when we remove all sounds
    setTimeout(() => {
      this.disconnectSoundIfSource(this.note3Sound.sound)
      this.disconnectSoundIfSource(this.inhaleSound.sound)
    }, 3000)
  }

  disconnectSoundIfSource (sound) {
    if (sound.source) {
      sound.disconnect()
    }
  }

  async loadFlowers () {
    for (let j = 0; j <= (this.flowerModels.length - 1); j++) {
      const loader = new Loader({ model: this.flowerModels[j] })
      this.flowerModels[j] = await loader.initFlowerObject(this.flowerTypes[j])
    }
    this.addFlowers()
  }

  async addFlowers () {
    let index = -1
    for (let nbPlants = 0; nbPlants <= 60; nbPlants++) {
      index++
      if (index >= 3) {
        index = 0
      }
      const plant = new Plant(
        {
          orientation: nbPlants,
          flowerType: this.flowerTypes[index],
          model: this.flowerModels[index].clone()
        })
      this.plants.push(plant)

      const loadedPlant = await plant.init()

      this.plantsGroup.add(loadedPlant)
    }
    this.flowersHoverZone = new Cube({ scene: this.plantsGroup, position: { x: 0.2, y: 0, z: 0.6 } })

    this.plantsGroup.position.set(-41, 0.5, 1.4)
    this.plantsGroup.scale.set(2.5, 2.5, 2.5)
    this.plantsGroup.name = 'Plants'
    this.desertGroup.add(this.plantsGroup)
  }

  async addGrass () {
    const color = new THREE.Color('#242424')
    const material = new THREE.MeshBasicMaterial({
      color
    })
    this.grass = await new Grass(
      {
        container: this.desertGroup,
        surface: this.desertGroup.children[0].children[1],
        count: 300,
        scaleFactor: 4,
        material
      })
  }

  updateFlowersColor () {
    this.plants.forEach((plant) => {
      plant.updateColor()
    })
  }

  addParticles () {
    this.spores = new Particles({ color: store.state.colorPalette })
    this.spores.particles.position.set(-41, 1, 1.4)

    // Axis Helper for spores
    // const axesHelper = new THREE.AxesHelper(5)
    // this.spores.particles.add(axesHelper)

    this.desertGroup.add(this.spores.particles)
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
        depthWrite: false,
        side: THREE.BackSide
      })
    )

    skybox.material.uniforms.envMap.value = SkyboxTexture
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
      this.crystal.getColor()
      this.updateFlowersColor()
      this.addColorToCrystal()
      this.addParticles()
    })
  }

  addSoundToCrystal (crystal) {
    crystal.add(this.crystalSound.sound)
  }

  addColorToCrystal () {
    for (let i = 0; i <= this.desertGroup.children[0].children.length - 1; i++) {
      const child = this.desertGroup.children[0].children[i]
      if (child.name.includes('inside')) {
        child.material = this.crystal.getInnerMaterial()
        child.layers.enable(1)
      } else if (child.name.includes('outside')) {
        child.material = this.crystal.getExteriorMaterial()
        child.layers.enable(1)
      }
    }
  }

  sporesOnHold () {
    if (store.state.desert.canInhaleOnHold) {
      this.hold = true
      this.sporesElevation += 1000
      this.inhale()
    }

    // If we find how to do a clean camera zoom
    // if (store.state.desert.haveClickedOnFlowers) {
    //   nuxt.$emit('zoomCamera', { position: { x: -41, y: 1, z: 1.4 } })
    // }
  }

  sporesOnMouseMove (e) {
    e.preventDefault()
    const mouseX = e.pageX
    const mouseY = e.pageY
    if (this.lastMouseX > -1) {
      this.sporesElevation += Math.max(Math.abs(mouseX - this.lastMouseX), Math.abs(mouseY - this.lastMouseY))
    }
    if (this.sporesElevation > 10000 && !store.state.desert.canInhaleOnHold) {
      store.commit('desert/setCanInhaleOnHold', true)
    }
    this.lastMouseX = mouseX
    this.lastMouseY = mouseY
    this.inhale({ mousemove: true })
  }

  sporesOnMouseUp () {
    if (this.inhaleIsCompleted === false && store.state.desert.canInhaleOnHold) {
      this.exhale()
    } else {
      this.inhaleIsCompleted = false
    }
    // if (store.state.cameraIsZoomed) {
    //   nuxt.$emit('unzoomCamera')
    // }
  }

  handleClick () {
    if (this.intersects.length > 0 && !store.state.desert.haveClickedOnFlower) {
      store.commit('desert/setHaveClickedOnFlowers')
    }
  }

  inhale (mousemove = false) {
    const volume = { x: 0 }
    gsap.killTweensOf([this.spores.particles.material.uniforms.uZSpeed])
    gsap.killTweensOf([this.spores.particles.material.uniforms.uYSpeed])
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

      // Fairy dust sound
      if (store.state.desert.haveClickedOnFlower && !this.sporesSoundAlreadyPlayed) {
        this.sporesSound.sound.play()
        this.sporesSoundAlreadyPlayed = true
      }
    } else {
      // Movement on hold
      gsap.killTweensOf([this.spores.particles.material.uniforms.uYSpeed])
      gsap.killTweensOf([this.spores.particles.material.uniforms.uZSpeed])
      console.log('hold')
      gsap.to(
        this.spores.particles.material.uniforms.uYSpeed,
        {
          value: this.spores.particles.material.uniforms.uYSpeed.value + 1,
          duration: store.state.durationHold,
          ease: 'power4.inOut',
          onComplete: () => {
            console.log('hold ended')
            this.inhaleIsCompleted = true
            if (store.state.desert.counter === 1 && store.state.desert.haveClickedOnFlower) {
              this.note1Sound.sound.play()
            } else if (store.state.desert.counter === 2 && store.state.desert.haveClickedOnFlower) {
              this.note2Sound.sound.play()
            } else if (store.state.desert.counter === 3) {
              this.note3Sound.sound.play()
            }
          }
        }
      )

      gsap.to(
        this.spores.particles.material.uniforms.uZSpeed,
        {
          value: this.spores.particles.material.uniforms.uZSpeed.value + 1,
          duration: store.state.durationHold,
          ease: 'power4.inOut',
          onComplete: () => {
            this.inhaleIsCompleted = true
          }
        }
      )

      // Sound
      // If raycaster is empty
      if (store.state.desert.haveClickedOnFlower) {
        this.inhaleSound.sound.play()
        if (this.exhaleSound.sound.isPlaying) {
          this.exhaleSound.sound.stop()
        }
      }
    }
  }

  exhale () {
    // Spores
    gsap.killTweensOf([this.spores.particles.material.uniforms.uZSpeed])
    gsap.killTweensOf([this.spores.particles.material.uniforms.uYSpeed])
    this.sporesElevation -= 1000
    gsap.to(
      this.spores.particles.material.uniforms.uZSpeed,
      {
        value: this.sporesElevation / 1000,
        duration: 3,
        ease: 'power3.out'
      }
    )

    // Sound
    // If raycaster is empty
    if (store.state.desert.haveClickedOnFlower) {
      if (this.inhaleSound.sound.isPlaying) {
        this.inhaleSound.sound.stop()
      }
      this.exhaleSound.sound.play()
    }
  }

  render (elapsedTime, timeDelta, progression) {
    if (nuxt && store && !this.events) {
      this.addEvents()
      this.events = true
    }
    if (this.plantsGroup.children[0] && this.progression > 0.8 && this.canClickOnFlowers) {
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
      this.spores.render(elapsedTime)
    }
    this.plants.forEach((plant) => {
      plant.update()
    })
  }
}
