import * as THREE from "three"
import Camera from './Camera.js'

import Desert from './Desert/Desert'

const desertCurve = [
    // GLOBAL
    [44.085, 1.2081, -45.012],
    [23.59, 1.2736, -44.35],
    [13.896, 1.8958, -34.535],
    [10.96, 1.4074, -12.929],
    [0.060661, 1.4757, -7.4292],
    [-2.2075, 1.896, -1.7811]

    // LOCAL
    // [-1, 0, 0],
    // [14.667, 0.065479, 13.231],
    // [28.439, 0.68773, 12.431],
    // [45.086, 0.19931, -1.6525],
    // [56.864, 0.26766, 1.5599],
    // [62.33, 0.3152, -1.1169]
]

const prairieCurve = [
]

const forestCurve = [
]

const allCurves = [desertCurve, prairieCurve, forestCurve]

const start = new THREE.Vector3(0, 0, 0)

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
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
        this.camTarget =start.clone()

        this.canMove = null
        this.mouse = new THREE.Vector2()
        this.target = new THREE.Vector2()

        this.windowHalf = new THREE.Vector2()

        this.currentScene = 0
        this.desert = new Desert()

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
    }

    init($canvas) {
        this.setSize()

        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({
            canvas: $canvas
        })

        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.renderer.setSize(this.size.windowW, this.size.windowH)

        this.clock = new THREE.Clock()
        this.clock.start()

        window.addEventListener('mousemove', (e) => {
            this.mouseMovement(e)
        })
        window.addEventListener('resize', () => {
            this.resize()
        })

        // Load for first scene
        this.desert.init(this.scene, this.renderer)

        this.cameraDisplacement()
        // Init camera vector
        this.vectCam = new THREE.Vector3(this.p1.x, this.p1.y, this.p1.z)
        this.initCamera()

        this.light = new THREE.SpotLight('white', 3.5, 200)
        this.light.position.z = 100
        this.light.position.y = 50
        this.scene.add(this.light)
    }


    initCamera() {
        this.camera = new Camera({
        window: this.size,
        })
        this.scene.add(this.camera.container)
    }

    cameraDisplacement() {
        this.curves = []
    
        // Scale curves
        allCurves.forEach((curve, index) => {    
            if (index === 0) {
                this.scale = 2
            }
            this.curves.push(new THREE.CatmullRomCurve3(curve))
   
            for (var i = 0; i < curve.length; i++) {
                var x = curve[i][0] * this.scale
                var y = curve[i][1] * this.scale
                var z = curve[i][2] * this.scale
                curve[i] = new THREE.Vector3(x, z, -y)
            }
        })
    
        // Init variables
        this.p1 = this.curves[0].points[0]

        this.progression = 0
        this.curveNumber = 0
    }

    moveCamera(e) {
        // TO DO : check if delta is + or - to allow reverse progression if > 1
        this.progression >= 0.98 ? this.progression = 1 : this.progression += e.deltaY * 0.00007  

        this.p1 = this.curves[this.curveNumber].getPointAt(this.progression)

        // this.desert.progression = this.progression
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

    render() {
        this.time.delta = this.clock.getDelta()
        this.time.total += this.time.delta

        this.desert.render(this.scene)

        window.addEventListener('wheel', (e) => {
            if (this.curves[this.curveNumber] !== undefined) {
            this.moveCamera(e)
            }
        })

        this.vectCam.set(this.p1.x, this.p1.y, this.p1.z)
        this.camera.camera.position.lerp(this.vectCam, 0.1)
        this.camLook.lerp(this.camTarget, 0.05)
        this.camera.camera.lookAt(this.camLook)

        if (!this.desert.isFixedView()) {
            this.target.x = ( 1 - this.mouse.x ) * 0.002;
            this.target.y = ( 1 - this.mouse.y ) * 0.002;

            // this.camera.camera.rotation.x += 0.01 * ( this.target.y - this.camera.camera.rotation.x )
            this.camera.camera.rotation.y -= 0.5 * ( this.target.x - this.camera.camera.rotation.y )
        }

        this.renderer.render(this.scene, this.camera.camera)
    }
}

export default new Common()