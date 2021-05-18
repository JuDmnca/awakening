import * as THREE from 'three'
import particlesFragmentShader from '../../../../assets/shaders/particles/particles.frag'
import particlesVertexShader from '../../../../assets/shaders/particles/particles.vert'
import noise2D from '../Utils/Noise2D'

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}

class Particles {
    constructor(props) {
        this.props = props
        this.particlesGeometry = null
        this.particlesMaterial = null
        this.particles = null
        this.count = 20000
        this.init()
    }

    init() {
        /*
        * Particles
        */
        // Geometry
        this.particlesGeometry = new THREE.BufferGeometry()

        let positions = new Float32Array(this.count * 3)
        const scales = new Float32Array(this.count)
        const colors = new Float32Array(this.count * 3)
        const randomSpeed = new Float32Array(this.count)
        const directionNoised = new Float32Array(this.count)
        let xOff = 0
        let yOff = 0
        for(let i = 0; i < this.count * 3; i++){

            const i3 = i * 3
            // Position
            positions[i3 + 0] = (Math.random() - 0.5) * 10 * Math.random() - 2
            positions[i3 + 1] = (Math.random() - 0.5) * 75 * Math.random() - 35
            positions[i3 + 2] = (Math.random() - 0.5) * 10 * Math.random()

            // Scale
            scales[i] = Math.random() + 0.2

            // Colors
            colors[i3 + 0] = 1
            colors[i3 + 1] = 87/255
            colors[i3 + 2] = 233/255

            // Random Speed
            randomSpeed[i] = Math.pow(noise2D(xOff, yOff), 2)

            // Noise
            directionNoised[i] = noise2D(xOff, yOff) * 2

            xOff += 0.001
            yOff += 0.001
        }

        this.particlesGeometry.setAttribute(
            'position',
            new THREE.BufferAttribute(positions, 3)
        )

        this.particlesGeometry.setAttribute(
            'randomSpeed',
            new THREE.BufferAttribute(randomSpeed, 1)
        )

        this.particlesGeometry.setAttribute('directionNoised', new THREE.BufferAttribute(directionNoised, 1))
        this.particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
        this.particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        // this.particlesGeometry.attributes.color = new THREE.Vector3(1.0, 1.0, 0.0)

        // Material
        this.particlesMaterial = new THREE.ShaderMaterial({
            depthWrite: true,
            transparent: true,
            alphaTest: 0.001,
            blending: THREE.AdditiveBlending,
            vertexColors: true,
            vertexShader: particlesVertexShader,
            fragmentShader: particlesFragmentShader,
            uniforms: {
                uTime: {value: 0},
                uSize: {value: 25.0 * window.devicePixelRatio},
                uZSpeed: {value: 1.0}
            }
        })

        this.particlesMaterial.fragmentShader = particlesFragmentShader

        // Particles mesh
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
    }

    render(elapsedTime) {
        this.particlesMaterial.uniforms.uTime.value = elapsedTime
    }
}

export default Particles
