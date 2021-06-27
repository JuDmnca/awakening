/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import gsap from 'gsap'
import Raycaster from '../../../Utils/js/Raycaster'

import Grass from '../Common/Grass'
import Butterfly from './Butterfly'

let store
let nuxt
if (process.browser) {
  window.onNuxtReady(({ $nuxt, $store }) => {
    nuxt = $nuxt
    store = $store
  })
}

export default class Forest {
  constructor (props) {
    this.props = props
    this.name = 'Forest'

    // Generals params
    this.hold = false

    this.scene = null

    this.camera = this.props.camera
    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null

    this.mixer = null

    this.progression = this.props.progression
    this.events = false

    this.forestGroup = new THREE.Group()
    this.forestModel = this.props.model
    this.animations = []

    this.crystal = props.crystal

    this.enable = true
    this.microphone = null
  }

  init (scene, renderer, mixer) {
    this.scene = scene
    this.mixer = mixer

    this.camera.updatePerspective()
    this.camera.camera.updateProjectionMatrix()

    this.addLight(scene)

    this.forestGroup.add(this.forestModel)

    this.addButterfly(this.forestGroup, mixer, this.animations)

    this.addFog(scene)
    this.addSkybox(scene)

    // nuxt.$on('smellSetted', () => {
    //   this.addSubtitles()
    // })

    // this.crystal.getColor()
    // this.addColorToCrystal()

    // this.updateBuissonMaterial()
    // this.addGrass()

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    this.forestGroup.name = this.name
    scene.add(this.forestGroup)
  }

  async addButterfly (scene, mixer, animations) {
    this.butterfly = await new Butterfly({ scene, mixer, animations })
  }

  addLight (scene) {
    const light = new THREE.AmbientLight(0xFFFFFF, 0.8)
    scene.add(light)
  }

  addFog (scene) {
    const colorBG = new THREE.Color('#040408')
    scene.fog = new THREE.Fog(colorBG, 10, 300)
  }

  addSkybox (scene) {
    const loader = new THREE.CubeTextureLoader()
    loader.premultiplyAlpha = true
    const SkyboxTexture = loader.load([
      require('../../../../assets/textures/png/forest/px.jpg'),
      require('../../../../assets/textures/png/forest/nx.jpg'),
      require('../../../../assets/textures/png/forest/py.jpg'),
      require('../../../../assets/textures/png/forest/ny.jpg'),
      require('../../../../assets/textures/png/forest/pz.jpg'),
      require('../../../../assets/textures/png/forest/nz.jpg')
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

  addSubtitles () {
    setTimeout(() => {
      store.commit('setSubtitle', 'Nos sens sont intimement liés à nos souvenirs.')
      nuxt.$emit('toggleShowSubtitle')
      nuxt.$emit('showCursor', 'Scroll')
      this.indicationIsVisible = true
    }, 3000)
    setTimeout(() => {
      nuxt.$emit('toggleShowSubtitle')
    }, 8000)
    setTimeout(() => {
      store.commit('setSubtitle', 'Votre esprit est sur le point de s’éveiller à nouveau.')
      nuxt.$emit('toggleShowSubtitle')
    }, 9000)
    setTimeout(() => {
      nuxt.$emit('toggleShowSubtitle')
    }, 14000)
    setTimeout(() => {
      store.commit('setSubtitle', 'Saurez-vous lui redonner sa voix ?')
      nuxt.$emit('toggleShowSubtitle')
      this.subTitlesAreCompleted = true
    }, 15000)
  }

  async addGrass () {
    const color = new THREE.Color('#2E3618')
    const material = new THREE.MeshBasicMaterial({
      color
    })
    let surface
    this.forestGroup.children[0].children.forEach((children) => {
      if (children.name === 'sol') {
        surface = children
      }
    })
    this.grass = await new Grass(
      {
        container: this.forestGroup.children[0],
        surface,
        count: 1000,
        scaleFactor: 4,
        material
      })
  }

  addColorToCrystal () {
    this.crystal.getColor()
    for (let i = 0; i <= this.forestGroup.children[0].children.length - 1; i++) {
      const child = this.forestGroup.children[0].children[i]
      if (child.name.includes('inside')) {
        child.material = this.crystal.getInnerMaterial()
        child.layers.enable(1)
      } else if (child.name.includes('outside')) {
        child.material = this.crystal.getExteriorMaterial()
        child.layers.enable(1)
      }
    }
  }

  updateBuissonMaterial () {
    let buissons
    this.forestGroup.children[0].children.forEach((children) => {
      if (children.name === 'buissons') {
        buissons = children
      }
    })
    buissons.material.depthWrite = true
    buissons.position.y -= 3
  }

  setAnimations () {
    this.animations[0].loop = THREE.LoopPingPong
    this.animations[0].timeScale = 0.1
    this.animations[0].play()
  }

  updateButterflySpeed () {
    const step = store.state.forest.step
    if (step < 3) {
      store.commit('forest/increaseStep')
      const step = store.state.forest.step
      this.animations[0].timeScale = step * 1.5
      if (step === 2) {
        setTimeout(() => {
          this.moveButterfly()
        }, 1000)
      } else {
        setTimeout(() => {
          this.enable = true
        }, 1000)
      }
    }
  }

  onClickIfMicrophoneIsDisabled () {
    this.enable = false
    this.updateButterflySpeed()
  }

  moveButterfly () {
    let butterfly
    this.forestGroup.children.forEach((children) => {
      if (children.name === 'Butterfly') {
        butterfly = children
      }
    })
    gsap.to(butterfly.position, { y: 10, duration: 3, ease: 'power3.inOut', onComplete: this.endScene })
  }

  endScene () {
    nuxt.$emit('startTransition', 3)
    nuxt.$emit('startSceneTransition')
  }

  addEvents () {
    nuxt.$on('ColorSetted', () => {
      this.crystal.getColor()
      this.addColorToCrystal()
      this.updateBuissonMaterial()
      this.setAnimations()
      this.addSubtitles()
    })
  }

  render (timeTotal, timeDelta) {
    this.noScroll += timeDelta

    if (this.noScroll > 2 && !this.indicationIsVisible) {
      nuxt.$emit('showCursor', 'Scroll')
      this.indicationIsVisible = true
    }

    if (nuxt && store && !this.events) {
      this.addEvents()
      this.events = true
    }

    if (this.progression >= 0.59 && !this.isClickedOnButterfly && this.subTitlesAreCompleted) {
      this.isClickedOnButterfly = true
      setTimeout(() => {
        nuxt.$emit('toggleShowSubtitle')
      }, 3000)
    }

    if (this.isClickedOnButterfly && this.microphone.analyzer) {
      const volume = this.microphone.listen()
      if (volume > 132 && this.enable) {
        this.enable = false
        this.updateButterflySpeed()
      }
    }
  }
}
