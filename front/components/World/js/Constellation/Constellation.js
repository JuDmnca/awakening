import * as THREE from "three"
import Camera from '../Camera'
import MainGui from '../Utils/MainGui'
import Cube from '../Desert/Cube'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

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

        this.controls = null
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

        this.clock = new THREE.Clock()
        this.clock.start()

        // Cube
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2)
        const cubeMaterial = new THREE.MeshStandardMaterial({
            color: "red",
            opacity: 0,
            transparent: 0
        })
        const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
        this.scene.add(cube)

        // Init camera
        this.initCamera()
        this.camera.camera.position.z = -2

        // Listeners
        this.addWheelEvent()

        // Init light
        this.light = new THREE.PointLight(this.params.light.color, this.params.light.intensity, this.params.light.distance)
        this.light.position.set(0, 10, 0)
        this.scene.add(this.light)

        this.scene.background = new THREE.Color('#003c66')

        // Controls
        this.controls = new OrbitControls( this.camera.camera, this.renderer.domElement );
        this.controls.enableDamping = true
        // this.controls.enableRotate = true

        this.controls.minDistance = 1

        // Skybox
        const loader = new THREE.CubeTextureLoader()
        const texture = loader.load([
            require('../../../../assets/textures/png/rocks/px.png'),
            require('../../../../assets/textures/png/rocks/nx.png'),
            require('../../../../assets/textures/png/rocks/py.png'),
            require('../../../../assets/textures/png/rocks/ny.png'),
            require('../../../../assets/textures/png/rocks/pz.png'),
            require('../../../../assets/textures/png/rocks/nz.png')
        ]);
        this.scene.background = texture

    }
    initCamera() {
        this.camera = new Camera({
            window: this.size,
        })
        // this.scene.add(this.camera.camera)
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
        
        this.controls.update()

        this.renderer.render(this.scene, this.camera.camera)
    }
}

export default new Constellation()