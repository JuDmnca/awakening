import * as THREE from 'three'
import particlesFragmentShader from '../../../../assets/shaders/particles/particles.frag'
import particlesVertexShader from '../../../../assets/shaders/particles/particles.vert'
import noise2D from '../../../Utils/js/Noise2D'

class Particles {
  constructor (props) {
    this.props = props
    this.particlesGeometry = null
    this.particlesMaterial = null
    this.particles = null
    this.count = 20000
    this.colors = this.props.color

    this.init()
  }

  init () {
    this.createGeometry()
    this.setVariables()
    this.generateParticles()
    this.setAttributes()
    this.createMaterial()
    this.createMesh()
  }

  hexToRGB (hexColor) {
    return {
      x: ((hexColor >> 16) & 0xFF) / 255,
      y: ((hexColor >> 8) & 0xFF) / 255,
      z: (hexColor & 0xFF) / 255
    }
  }

  createGeometry () {
    this.particlesGeometry = new THREE.BufferGeometry()
  }

  setVariables () {
    // Normalize colors to use them in shader
    this.NormalizedColors = []
    for (let i = 0; i < this.colors.length; i++) {
      this.NormalizedColors[i] = this.hexToRGB(`0x${this.colors[i]}`)
    }

    this.positions = new Float32Array(this.count * 3)
    this.scales = new Float32Array(this.count)
    this.colors = new Float32Array(this.count * 3)
    this.randomSpeed = new Float32Array(this.count)
    this.directionNoised = new Float32Array(this.count)
  }

  generateParticles () {
    let xOff = 0
    let yOff = 0

    for (let i = 0; i < this.count * 3; i++) {
      const i3 = i * 3
      // Position (x, y, z)
      this.positions[i3 + 0] = (Math.random() - 0.5) * 10 * Math.random()
      this.positions[i3 + 1] = (Math.random() - 0.5) * 75 * Math.random() - 38
      this.positions[i3 + 2] = (Math.random() - 0.5) * 10 * Math.random()

      // Scale
      this.scales[i] = Math.random() + 0.2

      // Colors
      this.colors[i3 + 0] = this.NormalizedColors[1].x
      this.colors[i3 + 1] = this.NormalizedColors[1].y
      this.colors[i3 + 2] = this.NormalizedColors[1].z

      // Random Speed
      this.randomSpeed[i] = Math.pow(noise2D(xOff, yOff), 2)

      // Noise
      this.directionNoised[i] = noise2D(xOff, yOff) * 2
      xOff += 0.001
      yOff += 0.001
    }
  }

  setAttributes () {
    this.particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(this.positions, 3)
    )
    this.particlesGeometry.setAttribute(
      'randomSpeed',
      new THREE.BufferAttribute(this.randomSpeed, 1)
    )
    this.particlesGeometry.setAttribute(
      'directionNoised',
      new THREE.BufferAttribute(this.directionNoised, 1)
    )
    this.particlesGeometry.setAttribute(
      'aScale',
      new THREE.BufferAttribute(this.scales, 1)
    )
    this.particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(this.colors, 3)
    )
  }

  createMaterial () {
    this.particlesMaterial = new THREE.ShaderMaterial({
      depthWrite: true,
      transparent: true,
      alphaTest: 0.001,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: particlesVertexShader,
      fragmentShader: particlesFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 25.0 * window.devicePixelRatio },
        uYSpeed: { value: 1.0 },
        uZSpeed: { value: 1.0 }
      }
    })

    this.particlesMaterial.fragmentShader = particlesFragmentShader
  }

  createMesh () {
    this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
  }

  render (elapsedTime) {
    this.particlesMaterial.uniforms.uTime.value = elapsedTime
  }
}

export default Particles
