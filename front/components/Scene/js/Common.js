import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import gsap from 'gsap'
import Path from './Path'

class Common {
    constructor() {
        this.scene = null
        this.camera = null
        this.renderer = null
        this.progression = null
        this.mouse = new THREE.Vector2()
        this.target = new THREE.Vector2()
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
    }

    init($canvas) {
        this.setSize()

        this.scene = new THREE.Scene()

        this.camera = new THREE.PerspectiveCamera(
            45,
            this.size.windowW / this.size.windowH,
            0.1,
            500
        )
        this.camera.position.set(0, 0, 50)
        // this.camera.lookAt(this.scene.position)

        this.renderer = new THREE.WebGLRenderer({
            canvas: $canvas
        })

        this.renderer.setPixelRatio(window.devicePixelRatio)

        // this.renderer.setClearColor(0xFFF2F5)
        this.renderer.setSize(this.size.windowW, this.size.windowH)

        this.clock = new THREE.Clock()
        this.clock.start()

        // this.axesHelper = new THREE.AxesHelper( 5 )
        // this.scene.add( this.axesHelper )

        // this.controls = new OrbitControls( this.camera, this.renderer.domElement )
        // this.controls.enableZoom = false
        // this.controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
		// this.controls.dampingFactor = 0.05

        window.addEventListener('mousemove', (e) => {
            this.mouseMovement(e)
        })
        window.addEventListener('wheel', (e) => {
            this.onMouseWheel(e)
        })

        Path.init()
        
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

    onMouseWheel(e) {
        this.camera.position.z += e.deltaY * 0.1
        this.progression += (e.deltaY / 10) * 0.1 
    }

    resize() {
        this.setSize()
        this.camera.aspect = this.size.windowW / this.size.windowH
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.size.windowW, this.size.windowH)
    }

    render() {
        this.time.delta = this.clock.getDelta()
        this.time.total += this.time.delta

        Path.render(this.progression)

        this.target.x = ( 1 - this.mouse.x ) * 0.0005;
        this.target.y = ( 1 - this.mouse.y ) * 0.0005;

        // console.log(this.target.y)
        Path.splineCamera.rotation.x += 0.5 * ( this.target.y - this.camera.rotation.x )
        Path.splineCamera.rotation.y += 0.5 * ( this.target.x - this.camera.rotation.y )

        // this.controls.update()

        this.renderer.render(this.scene, Path.splineCamera)
    }
}

export default new Common()