import * as THREE from "three"
import { ReinhardToneMapping } from "three"
import Camera from './Camera'
import MainGui from './Utils/MainGui'
import Bloom from './Utils/Bloom'

import Desert from './Desert/Desert'
import Prairie from './Prairie/Prairie'

const desertCurve = [
    [41.891, 0.85967, -41.585],
    [37.092, 2.2471, -25.002],
    [22.111, 1.6593, -25.574],
    [15.148, 2.2951, -4.389],
    [-4.7436, 1.6304, 6.2753],
    [-18.112, 3.9526, 1.2379]
]

const prairieCurve = [
]

const forestCurve = [
]

const allCurves = [desertCurve, prairieCurve, forestCurve]

const start = new THREE.Vector3(-42, 1, 6)

let store
let nuxt
if (process.browser) {
  window.onNuxtReady(({$nuxt, $store}) => {
    nuxt = $nuxt
    store = $store
  })
}

class Common {
    constructor() {
        this.scene = null
        this.renderer = null

        this.camera = null
        this.progression = null
        this.curveNumber = 0
        this.camLook = start.clone()
        this.camTarget = start.clone()

        this.events = false

        this.canMove = null
        this.addscroll = false

        this.mouse = new THREE.Vector2()
        this.target = new THREE.Vector2()

        this.windowHalf = new THREE.Vector2()

        this.currentScene = null

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
            scrollSpeed: 7,
            light: {
                angle: Math.PI / 2,
                color: '#ffffff',
                intensity: 2.85,
                distance: 400
            }
        }

        // BLOOM
        this.bloom = null

        this.gui = null
        this.sporesCanMove = false
    }

    init($canvas) {
        // FPS
        (function(){var script=document.createElement('script');script.onload=function(){var stats=new Stats();document.body.appendChild(stats.dom);requestAnimationFrame(function loop(){stats.update();requestAnimationFrame(loop)});};script.src='//mrdoob.github.io/stats.js/build/stats.min.js';document.head.appendChild(script);})()

        this.setSize()

        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({
            canvas: $canvas,
            antialias: true,
            alpha: true
        })
        this.renderer.toneMapping = ReinhardToneMapping
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(this.size.windowW, this.size.windowH)
        this.renderer.setClearColor(0x000000)

        this.clock = new THREE.Clock()
        this.clock.start()

        // Init camera
        this.cameraDisplacement()
        this.vectCam = new THREE.Vector3(this.p1.x, this.p1.y, this.p1.z)
        this.initCamera()

        this.addWheelEvent()

        // Load first group (desert)
        this.currentScene = new Desert({camera: this.camera})
        this.currentScene.init(this.scene, this.renderer)

        // Init light
        this.light = new THREE.PointLight(this.params.light.color, this.params.light.intensity, this.params.light.distance)
        this.light.position.set(0, 500, 0)
        this.light.castShadow = true
        this.light.shadow.mapSize.width = 1024
        this.light.shadow.mapSize.height = 1024
        // Blur of the shadows
        this.light.shadow.radius = 3
        // this.light.position.x = Math.cos(this.params.light.angle) + 300
        // this.light.position.y = Math.sin(this.params.light.angle) + 300
        // this.light.position.z = 100
        this.scene.add(this.light)

        // Common GUI
        // this.gui = new MainGui()
        // const commonFolder = this.gui.gui.addFolder('Common')
        // commonFolder.add(this.params, 'scrollSpeed', 0, 10, 0.1)
        // const lightFolder = this.gui.gui.addFolder('Sun')
        // lightFolder.add(this.light.position, 'x', -300, 300, 1).name('x')
        // lightFolder.add(this.light.position, 'y', -300, 500, 1).name('y')
        // lightFolder.add(this.light.position, 'z', -300, 300, 1).name('z')
        // lightFolder.add(this.light, 'intensity', 0, 20, 0.01).name('intensity')
        // lightFolder.add(this.light, 'distance', 0, 600, 1).name('distance')

        // lightFolder.add(this.light, 'shadow', 0, 500, 0.01).name('shadow')
        // lightFolder.add(this.params.light, 'angle', 0, Math.PI * 2, 0.1).name('angle')
        // lightFolder.add(this.light, 'intensity', 0, 10, 1).name('Intensity')

        this.bloom = new Bloom( {scene: this.scene, camera: this.camera.camera, renderer: this.renderer} )
    }

    initCamera() {
        this.camera = new Camera({
        window: this.size,
        })
        this.scene.add(this.camera.camera)
    }

    cameraDisplacement() {
        this.curves = []

        // Scale curves
        allCurves.forEach((curve, index) => {
            if (index === 0) {
                this.scale = 3
            }
            this.curves.push(new THREE.CatmullRomCurve3(curve))

            for (var i = 0; i < curve.length; i++) {
                var x = curve[i][0] * this.scale
                var y = curve[i][1] * this.scale + 4
                var z = curve[i][2] * this.scale
                curve[i] = new THREE.Vector3(x, y, -z)
            }
        })

        // Init variables
        this.p1 = this.curves[0].points[0]
        this.progression = 0
        this.curveNumber = 0
    }

    moveCamera(e) {
        if (e.deltaY <= 0) {
            this.progression >= 0.98 ? this.progression = 1 : this.progression += -e.deltaY * this.params.scrollSpeed / Math.pow(10, 5)
        } else {
            this.progression <= 0.01 ? this.progression = 0 : this.progression += -e.deltaY * this.params.scrollSpeed / Math.pow(10, 5)
        }
        this.currentScene.progression = this.progression
        this.p1 = this.curves[this.curveNumber].getPointAt(this.progression)

        if (store) {
            const euler = this.camera.camera.rotation.clone()
            store.commit('updateWorldRotation', euler)
        }

        // Enable spores movement and inhale if end of path
        if(this.progression >= 0.98 && this.sporesCanMove === false){
            this.currentScene.enableSporesMovement()
            this.sporesCanMove = true
        }
    }

    setSize() {
        this.size = {
            windowW: window.innerWidth,
            windowH: window.innerHeight
        }
        this.windowHalf.x = this.size.windowW / 2
        this.windowHalf.y = this.size.windowH / 2
    }

    mouseMovement(e) {
        this.mouse.x = ( e.clientX - this.windowHalf.x )
        this.mouse.y = ( e.clientY - this.windowHalf.y )
    }

    resize() {
        this.setSize()
        this.camera.camera.aspect = this.size.windowW / this.size.windowH
        this.camera.camera.updateProjectionMatrix()
        this.renderer.setSize(this.size.windowW, this.size.windowH)
    }

    addWheelEvent() {
        window.addEventListener('mousemove', (e) => {
            this.mouseMovement(e)
        })
        window.addEventListener('resize', () => {
            this.resize()
        })
        window.addEventListener('wheel', (e) => {
            if (this.curves[this.curveNumber] !== undefined) {
                this.moveCamera(e)
            }
        })
    }

    addTransitionEvent() {
        nuxt.$on('startSceneTransition', () => {
            switch (store.state.sceneIndex) {
                case 1:
                    this.removeGroup(this.currentScene)
                    console.log('new scene : prairie')
                    // this.currentScene = new Prairie({camera: this.camera})
                    // this.currentScene.init(this.scene, this.renderer)
                    break;
                case 2:
                    this.removeGroup(this.currentScene)
                    // this.currentScene = new Forest({camera: this.camera})
                    // this.currentScene.init(this.scene, this.renderer)
                    break;
                case 3:
                    this.removeGroup(this.currentScene)
                    // this.currentScene = new Sky({camera: this.camera})
                    // this.currentScene.init(this.scene, this.renderer)
                    break;
            }
            store.commit('increaseSceneIndex')
        })
    }

    removeGroup(group) {
        const selectedObject = this.scene.getObjectByName(group.name);
        this.scene.remove( selectedObject )
    }

    render() {
        if (nuxt && store && !this.events) {
            this.addTransitionEvent()
            this.events = true
        }

        this.time.delta = this.clock.getDelta()
        this.time.total += this.time.delta

        this.currentScene.render(this.time.total)

        // Update camera rotation & look at
        this.vectCam.set(this.p1.x, this.p1.y, this.p1.z)
        this.camera.camera.position.lerp(this.vectCam, 0.1)
        this.camLook.lerp(this.camTarget, 0.05)
        this.camera.camera.lookAt(this.camLook)

        // TO DO : update code so camera moves like head following the mouse BUT needs to check camera rotation before
        // if (!this.currentScene.isFixedView()) {
        //     this.target.x = ( 1 - this.mouse.x ) * 0.002;
        //     this.target.y = ( 1 - this.mouse.y ) * 0.002;

        //     // this.camera.camera.rotation.x += 0.01 * ( this.target.y - this.camera.camera.rotation.x )
        //     // this.camera.camera.rotation.y += 0.2 * ( this.target.x - this.camera.camera.rotation.y )
        // }

        this.bloom.render()
        // this.renderer.render(this.scene, this.camera.camera)
    }
}

export default new Common()