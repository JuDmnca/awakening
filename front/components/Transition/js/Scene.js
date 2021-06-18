import * as THREE from 'three'
import vertex from '../../../assets/shaders/background/background.vert'
import fragment from '../../../assets/shaders/background/background.frag'

export default class Scene {
  constructor (props) {
    this.props = props
    this.time = 0
    this.init()
  }

  init () {
    this.setSize()
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.props.$canvas,
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(this.size.windowW, this.size.windowH)

    function hexToRGB (hexColor) {
      return {
        x: ((hexColor >> 16) & 0xFF) / 255,
        y: ((hexColor >> 8) & 0xFF) / 255,
        z: (hexColor & 0xFF) / 255
      }
    }

    const color1 = hexToRGB(`0x${this.props.color[0]}`)
    const color2 = hexToRGB(`0x${this.props.color[1]}`)
    const color3 = hexToRGB(`0x${this.props.color[2]}`)

    this.geometry = new THREE.PlaneBufferGeometry(2, 2, 1, 1)
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        color1: { value: color1 },
        color2: { value: color2 },
        color3: { value: color3 },
        center: { value: { x: 0.5, y: 0.5 } },
        rez: { type: 'vec2', value: [window.innerWidth, window.innerHeight] }
      },
      vertexShader: vertex,
      fragmentShader: fragment,
      side: THREE.DoubleSide
    })

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.scene.add(this.mesh)

    this.camera.position.z = 5

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

  loop () {
    this.render()
    requestAnimationFrame(this.loop.bind(this))
  }

  render () {
    this.time += 0.01
    this.material.uniforms.time.value = this.time
    this.renderer.render(this.scene, this.camera)
  }
}
