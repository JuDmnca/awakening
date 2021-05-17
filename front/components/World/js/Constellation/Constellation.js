import * as THREE from "three"
import Camera from '../Camera'
import MainGui from '../Utils/MainGui'
import Cube from '../Desert/Cube'

let store
let nuxt
if (process.browser) {
  window.onNuxtReady(({$nuxt, $store}) => {
    nuxt = $nuxt
    store = $store
  })
}

class Constellation {
    constructor() {
        this.scene = null
        this.renderer = null

        this.camera = null

        this.events = false

        this.windowHalf = new THREE.Vector2()

        this.size = {
            windowW: null,
            windowH: null
        }

        this.clock = null

        this.time = {
            total: null,
            delta: null
        }

        this.light = null

        // General Params
        this.params = {
            light: {
                angle: Math.PI / 2,
                color: '#ffffff',
                intensity: 2.85,
                distance: 400
            }
        }

        this.gui = null

    }

    init($canvas) {
        // FPS indicator
        (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

        this.setSize()

        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({
            canvas: $canvas
        })

        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.renderer.setSize(this.size.windowW, this.size.windowH)
        // this.renderer.shadowMap.enabled = true
        // this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        this.clock = new THREE.Clock()
        this.clock.start()

        // Init camera
        this.initCamera()

        // Listeners
        this.addWheelEvent()

        // Init light
        this.light = new THREE.PointLight(this.params.light.color, this.params.light.intensity, this.params.light.distance)
        this.light.position.set(0, 10, 0)
        this.light.castShadow = true
        this.light.shadow.mapSize.width = 1024
        this.light.shadow.mapSize.height = 1024
        // Blur of the shadows
        this.light.shadow.radius = 3
        this.scene.add(this.light)

        // Common GUI
        // this.gui = new MainGui()
        // const commonFolder = this.gui.gui.addFolder('Common')
        // commonFolder.add(this.params, 'scrollSpeed', 0, 10, 0.1)
        // const lightFolder = commonFolder.addFolder('Sun')
        // lightFolder.add(this.light.position, 'x', -300, 300, 1).name('x')
        // lightFolder.add(this.light.position, 'y', -300, 300, 1).name('y')
        // lightFolder.add(this.light.position, 'z', -300, 300, 1).name('z')
        // lightFolder.add(this.light, 'intensity', 0, 20, 0.01).name('intensity')
        // lightFolder.add(this.light, 'distance', 0, 600, 1).name('distance')

        this.scene.background = new THREE.Color('#003c66')

        // Cube
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
        const cubeMaterial = new THREE.MeshStandardMaterial({
            color: "red",
            // wireframe: true,
            // flatShading: true,
            opacity: 1
        })

        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        cube.position.z = -10
        this.scene.add(cube)
        // console.log(this.camera.camera.position, cube.position, this.light.position)
    }
    initCamera() {
        this.camera = new Camera({
        window: this.size,
        })
        this.scene.add(this.camera.camera)
    }

    setSize() {
        this.size = {
            windowW: window.innerWidth,
            windowH: window.innerHeight
        }
        this.windowHalf.x = this.size.windowW / 2
        this.windowHalf.y = this.size.windowH / 2
    }

    resize() {
        this.setSize()
        this.camera.camera.aspect = this.size.windowW / this.size.windowH
        this.camera.camera.updateProjectionMatrix()
        this.renderer.setSize(this.size.windowW, this.size.windowH)
    }

    addWheelEvent() {
        window.addEventListener('resize', () => {
            this.resize()
        })
    }

    render() {
        
        this.time.delta = this.clock.getDelta()
        this.time.total += this.time.delta

        this.renderer.render(this.scene, this.camera.camera)
    }
}

export default new Constellation()