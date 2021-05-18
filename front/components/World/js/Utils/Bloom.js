import MainGui from '../Utils/MainGui'
import * as THREE from "three"

export default class Bloom {
  constructor(props) {
    this.effectComposer = null
    this.renderPass = null
    this.unrealBloomPass = null
    this.renderer = props.renderer
    this.camera = props.camera
    this.scene = props.scene

    this.composer = null
    this.init()
  }

  init() {
    if (process.client) {
      this.effectComposer = require('three/examples/jsm/postprocessing/EffectComposer.js')
      this.renderPass = require('three/examples/jsm/postprocessing/RenderPass.js')
      this.unrealBloomPass = require('three/examples/jsm/postprocessing/UnrealBloomPass.js')
    }

    const params = {
      exposure: 2,
      bloomStrength: 0,
      bloomThreshold: 3,
      bloomRadius: 1
    }

    const renderScene = new this.renderPass.RenderPass( this.scene, this.camera )

    const bloomPass = new this.unrealBloomPass.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 )
    bloomPass.threshold = params.bloomThreshold
    bloomPass.strength = params.bloomStrength
    bloomPass.radius = params.bloomRadius

    this.composer = new this.effectComposer.EffectComposer( this.renderer )
    this.composer.addPass( renderScene )
    this.composer.addPass( bloomPass )

    this.gui = new MainGui()
    this.gui.gui.add( params, 'exposure', 0.1, 2 ).onChange( function ( value ) {
      this.renderer.toneMappingExposure = Math.pow( value, 4.0 )
    } )

    this.gui.gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
      bloomPass.threshold = Number( value )
    } )

    this.gui.gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange( function ( value ) {
      bloomPass.strength = Number( value )
    } )

    this.gui.gui.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
      bloomPass.radius = Number( value )
    } )
  }

  animate() {
    this.composer.render()
  }
}