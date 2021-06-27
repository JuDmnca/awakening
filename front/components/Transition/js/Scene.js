import * as THREE from 'three'
import vertex from '../../../assets/shaders/background/background.vert'
import fragment from '../../../assets/shaders/background/background.frag'

export default class Scene {
  constructor (props) {
    this.props = props
    this.requestAnim = null
    this.time = 0
    this.init()
  }

  init () {
    this.setSize()
    this.scene = new THREE.Scene()
    this.initCamera()

    this.setRenderer()
    this.setColors()
    this.createPlane()

    this.loop()
  }

  setSize () {
    this.size = {
      windowW: window.innerWidth,
      windowH: window.innerHeight
    }
  }

  resize () {
    this.setSize()
    this.camera.aspect = this.size.windowW / this.size.windowH
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.size.windowW, this.size.windowH)
  }

  initCamera () {
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.camera.position.z = 5
  }

  setRenderer () {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.props.$canvas,
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.size.windowW, this.size.windowH)
  }

  hexToRGB (hexColor) {
    return {
      x: ((hexColor >> 16) & 0xFF) / 255,
      y: ((hexColor >> 8) & 0xFF) / 255,
      z: (hexColor & 0xFF) / 255
    }
  }

  setColors () {
    this.colors = []
    for (let i = 0; i < 3; i++) {
      this.colors[i] = this.hexToRGB(`0x${this.props.color[i]}`)
    }
  }

  createPlane () {
    this.geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        color1: { value: this.colors[0] },
        color2: { value: this.colors[1] },
        color3: { value: this.colors[2] },
        center: { value: { x: 0.5, y: 0.5 } },
        rez: { type: 'vec2', value: [window.innerWidth, window.innerHeight] }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.scene.add(this.mesh)
  }

  loop () {
    this.render()
    this.requestAnim = window.requestAnimationFrame(this.loop.bind(this))
  }

  clean () {
    window.cancelAnimationFrame(this.requestAnim)
    this.requestAnim = undefined
    this.renderer.clean()
  }

  render () {
    this.time += 0.01
    this.material.uniforms.time.value = this.time
    this.renderer.render(this.scene, this.camera)
  }
}
