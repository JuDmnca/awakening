import * as THREE from 'three'
import { ReinhardToneMapping } from 'three'

import vertex from '../../../assets/shaders/bloom/bloom.vert'
import fragment from '../../../assets/shaders/bloom/bloom.frag'
import MainGui from './MainGui'

const ENTIRE_SCENE = 0
const BLOOM_SCENE = 1

const bloomLayer = new THREE.Layers()
bloomLayer.set(BLOOM_SCENE)

const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black', fog: false })
const materials = {}

let bloomComposer = null
let finalComposer = null

export default class Bloom {
  constructor (props) {
    let effectComposer = null
    let renderPass = null
    let shaderPass = null
    let unrealBloomPass = null

    this.renderer = props.renderer
    this.size = props.size
    this.currentScene = 0

    this.camera = props.camera
    this.scene = props.scene
    const params = props.params

    if (process.client) {
      effectComposer = require('three/examples/jsm/postprocessing/EffectComposer.js')
      renderPass = require('three/examples/jsm/postprocessing/RenderPass.js')
      shaderPass = require('three/examples/jsm/postprocessing/ShaderPass.js')
      unrealBloomPass = require('three/examples/jsm/postprocessing/UnrealBloomPass.js')
    }

    const renderScene = new renderPass.RenderPass(this.scene, this.camera)

    this.renderer.toneMapping = ReinhardToneMapping
    this.renderer.toneMappingExposure = Math.pow(params.exposure, 4.0)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.size.windowW, this.size.windowH)

    const bloomPass = new unrealBloomPass.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius

    bloomComposer = new effectComposer.EffectComposer(this.renderer)
    bloomComposer.renderToScreen = false
    bloomComposer.addPass(renderScene)
    bloomComposer.addPass(bloomPass)

    const finalPass = new shaderPass.ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        defines: {}
      }), 'baseTexture'
    )
    finalPass.needsSwap = true

    finalComposer = new effectComposer.EffectComposer(this.renderer)
    finalComposer.addPass(renderScene)
    finalComposer.addPass(finalPass)

    // this.initGUI(params, this.renderer, bloomPass)
  }

  initGUI (params, renderer, bloomPass) {
    this.gui = new MainGui()
    this.gui.gui.add(params, 'exposure', 0.1, 2).onChange(function (value) {
      renderer.toneMappingExposure = Math.pow(value, 4.0)
    })

    this.gui.gui.add(params, 'bloomThreshold', 0.0, 1.0).onChange(function (value) {
      bloomPass.threshold = Number(value)
    })

    this.gui.gui.add(params, 'bloomStrength', 0.0, 3.0).onChange(function (value) {
      bloomPass.strength = Number(value)
    })

    this.gui.gui.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).onChange(function (value) {
      bloomPass.radius = Number(value)
    })
  }

  setSize () {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight
    }
    this.windowHalf.x = this.size.windowW / 2
    this.windowHalf.y = this.size.windowH / 2
  }

  renderBloom (mask) {
    if (mask === true) {
      this.scene.traverse(this.darkenNonBloomed)
      this.scene.background = new THREE.Color('#000000')
      bloomComposer.render()
      this.scene.traverse(this.restoreMaterial)
      this.scene.background = new THREE.Color('#89C7D9')
    } else {
      this.camera.layers.set(BLOOM_SCENE)
      bloomComposer.render()
      this.camera.layers.set(ENTIRE_SCENE)
    }
  }

  darkenNonBloomed (obj) {
    if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
      materials[obj.uuid] = obj.material
      obj.material = darkMaterial
    }
  }

  restoreMaterial (obj) {
    if (materials[obj.uuid]) {
      obj.material = materials[obj.uuid]
      delete materials[obj.uuid]
    }
  }

  render () {
    this.renderer.setClearColor(0x000000)
    this.renderBloom(true)
    if (this.currentScene === 1) {
      this.renderer.setClearColor(0x13171C)
    } else {
      this.renderer.setClearColor(0x89C7D9)
    }
    finalComposer.render()
  }
}
