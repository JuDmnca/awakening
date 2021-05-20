import * as THREE from 'three'
import MainGui from '../Utils/MainGui'
import vertex from '../../../../assets/shaders/bloom/bloom.vert'
import fragment from '../../../../assets/shaders/bloom/bloom.frag'

const ENTIRE_SCENE = 0; const BLOOM_SCENE = 1

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

    this.renderer.toneMappingExposure = Math.pow(params.exposure, 4.0)
    const bloomPass = new unrealBloomPass.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius

    this.initGUI(params, this.renderer, bloomPass)

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

  renderBloom (mask) {
    if (mask === true) {
      this.scene.traverse(this.darkenNonBloomed)
      bloomComposer.render()
      this.scene.traverse(this.restoreMaterial)
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
    this.renderer.setClearColor(0x13171C)
    finalComposer.render()
  }
}
