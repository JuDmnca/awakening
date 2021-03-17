import * as THREE from "three"
import gsap from 'gsap'
import Path from './Path'
import Land from './Land'
import Cube from './Cube'
import { Group } from "three"

class Common {
    constructor() {
        this.scene = null
        this.camera = null
        this.renderer = null
        this.progression = null
        this.mouse = new THREE.Vector2()
        this.target = new THREE.Vector2()
        this.windowHalf = new THREE.Vector2()
        this.raycaster = new THREE.Raycaster()
        this.intersects = []
        this.scene0 = new THREE.Group()
        this.scene1 = new THREE.Group()
        this.scene2 = new THREE.Group()
        this.scene3 = new THREE.Group()
        this.currentScene = 0
        this.land = new Land()

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

        this.myCube = new Cube()
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

        this.renderer = new THREE.WebGLRenderer({
            canvas: $canvas
        })

        this.renderer.setPixelRatio(window.devicePixelRatio)

        this.renderer.setSize(this.size.windowW, this.size.windowH)

        this.clock = new THREE.Clock()
        this.clock.start()

        // this.axesHelper = new THREE.AxesHelper( 5 )
        // this.scene.add( this.axesHelper )

        window.addEventListener('mousemove', (e) => {
            this.mouseMovement(e)
        })
        window.addEventListener('wheel', (e) => {
            this.onMouseWheel(e)
        })
        window.addEventListener('resize', () => {
            this.resize()
        })
        window.addEventListener('click', () => {
            this.handleClick()
        })

        Path.init()
        this.scene.add(Path.splineCamera)

        // Load for first scene
        this.land.init()
        this.land.load(0, this.scene0)
        this.scene.add(this.scene0)

        this.light = new THREE.SpotLight('white', 3.5, 200)
        this.light.position.z = 100
        this.light.position.y = 50
        this.scene.add(this.light)

        this.scene.add(this.myCube.cube)

        // Set max distance for raycaster
        this.raycaster.far = 10
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
        this.raycaster.setFromCamera({
            x: (e.clientX / this.renderer.domElement.clientWidth) * 2 - 1,
            y: -(e.clientY / this.renderer.domElement.clientHeight) * 2 + 1
        }, Path.splineCamera);
    }

    onMouseWheel(e) {
        this.camera.position.z += e.deltaY * 0.1
        this.progression += (e.deltaY / 10) * 0.1

        // Remove the error if backwards scroll at the beginning
        this.progression < 0 ? this.progression = 0 : this.progression
        this.progression > 15 ? this.progression = 0 : this.progression
    }

    resize() {
        this.setSize()
        Path.splineCamera.aspect = this.size.windowW / this.size.windowH
        Path.splineCamera.updateProjectionMatrix()
        this.renderer.setSize(this.size.windowW, this.size.windowH)
    }

    handleClick() {
        if (this.intersects.length > 0) {
            console.log('clickkkkkkkkk')
            console.log(Path.splineCamera)
            gsap.to(this, {progression: 19.99, duration: 2.5, ease: "power3.out"} )
            setTimeout(() => {
                this.updateScene()
            }, 1000)
        }
    }

    updateScene() {
        this.scene.remove(this.scene0)
        this.currentScene++
        this.land.load(this.currentScene, this.scene1)
        this.scene1.rotation.y = Math.PI / 2
        this.scene.add(this.scene1)
    }

    render() {
        this.time.delta = this.clock.getDelta()
        this.time.total += this.time.delta

        this.intersects = []

        if (this.scene.children) {
            this.intersects = this.raycaster.intersectObjects( this.scene.children );
        }

        for ( let i = 0; i < this.intersects.length; i ++ ) {
            // console.log(this.intersects[ i ].object)
        }

        Path.render(this.progression)

        this.target.x = ( 1 - this.mouse.x ) * 0.002;
        this.target.y = ( 1 - this.mouse.y ) * 0.002;

        // Path.splineCamera.rotation.x += 0.5 * ( this.target.y - Path.splineCamera.rotation.x )
        Path.splineCamera.rotation.y += 0.5 * ( this.target.x - Path.splineCamera.rotation.y )

        this.renderer.render(this.scene, Path.splineCamera)
    }
}

export default new Common()