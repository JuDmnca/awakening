import * as THREE from "three"
import Camera from '../Camera'
import MainGui from '../Utils/MainGui'
import Cube from '../Desert/Cube'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Raycaster from '../Utils/Raycaster'
import gsap from "gsap"
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import Bloom from '../Utils/Bloom.js'

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

        this.nbEtoiles = 40

        this.raycaster = null
        this.intersectedObject = null
        this.lastIntersectedObject = null
        this.isIntersected = false
        this.cristalScale = 1.5

        this.cubes = []
        this.randomCubesSpeed = []

        // Post Processing
        this.bloom = null
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
        const cubeTransparentMaterial = new THREE.MeshStandardMaterial({
            color: "red",
            opacity: 0,
            transparent: 0
        })


        // const cube = new THREE.Mesh(cubeGeometry, cubeTransparentMaterial)
        // this.scene.add(cube)
        // console.log(Math.floor(Math.random()*16777215).toString(16))
        // Generation of this.cubes
        for(let i = 0; i < this.nbEtoiles; i++) {
            const cubeMaterial = new THREE.MeshStandardMaterial({
                
                color: new THREE.Color('#' + Math.floor(Math.random()*16777215).toString(16)),
                opacity: 1,
                transparent: 1
            })

            this.cubes.push(new THREE.Mesh(cubeGeometry, cubeMaterial))
            
            this.cubes[i].position.set(this.getRandomArbitrary(-30, 30) , this.getRandomArbitrary(-15, 30), this.getRandomArbitrary(-30, 30))
            
            // this.cubes[i].scale = new THREE.Vector3(0.5, 0.5, 0.5)
            this.scene.add(this.cubes[i])
        }

        // Generation of random cube speed
        for(let i = 0; i < this.cubes.length; i++) {
            this.randomCubesSpeed.push(Math.random())
        }

        // Init camera
        this.initCamera()
        // this.camera.camera.position.z = -2

        // Listeners
        this.addWheelEvent()

        // Init light
        this.light = new THREE.PointLight(this.params.light.color, this.params.light.intensity, this.params.light.distance)
        this.light.position.set(0, 0, 0)
        this.scene.add(this.light)

        this.scene.background = new THREE.Color('#003c66')

        // Controls
        this.controls = new OrbitControls( this.camera.camera, this.renderer.domElement );
        this.controls.enableDamping = true
        this.controls.enableZoom = false
        this.controls.minPolarAngle = Math.PI / 2
        this.controls.rotateSpeed = 1
        this.controls.enableRotate = true
        this.controls.minDistance = 1

        // Raycaster
        this.raycaster = new Raycaster()
        this.raycaster.init(this.camera, this.renderer)
        this.raycaster.render(this.scene)

        // Post Processing
        this.bloom = new Bloom({scene: this.scene, camera: this.camera.camera, renderer: this.renderer})
        // Params for constellation : BT : 0, BS: 1, BR : 0.4

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
        this.scene.background = new THREE.Color('black')

        // GUI
        this.gui = new MainGui()
        const controlsFolder = this.gui.gui.addFolder('Controls')
        controlsFolder.add(this.controls, 'rotateSpeed', 0, 2, 0.1).name('Controls Speed')

        // const postProcessingFolder = this.gui.gui.addFolder('Post Processing')
        // this.gui.gui.add( paramsBloomPass, 'exposure', 0.1, 2 ).onChange( function ( value ) {

        //     renderer.toneMappingExposure = Math.pow( value, 4.0 );

        // } )
        // postProcessingFolder.add(this.bloomPass, 'strength', 0, 3, 0.1).name('BloomStrength')
        // postProcessingFolder.add(this.bloomPass, 'threshold', 0, 3, 0.1).name('bloomThreshold')
        // postProcessingFolder.add(this.bloomPass, 'radius', 0, 3, 0.1).name('bloomRadius')
    }
    initCamera() {
        this.camera = new Camera({
            window: this.size,
        })
        // this.scene.add(this.camera.camera)
    }

    getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min
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
        for(let i = 0; i < this.cubes.length; i++) {
            this.cubes[i].rotation.y = this.time.total * (this.randomCubesSpeed[i] + 0.1)
            this.cubes[i].position.y += Math.cos(this.time.total) / ((this.randomCubesSpeed[i] + 0.2) * 150)
        }
        // Intersections
        const intersectedObject = this.raycaster.render(this.scene)
        if(intersectedObject.length > 0 && this.isIntersected === false) {
            this.lastIntersectedObject = intersectedObject[0]
            console.log(this.lastIntersectedObject.object)
            gsap.to(
                this.lastIntersectedObject.object.scale,
                {
                    x: this.cristalScale,
                    y: this.cristalScale,
                    z: this.cristalScale,
                    duration: 1,
                    ease: "power3.out",
                    onComplete: this.increaseCounter
                }
              )
            this.isIntersected = true
        } else if(!intersectedObject.length > 0 && this.isIntersected === true) {
            gsap.killTweensOf(this.lastIntersectedObject.object.scale)
            gsap.to(
                this.lastIntersectedObject.object.scale,
                {
                    x: 1/this.cristalScale,
                    y: 1/this.cristalScale,
                    z: 1/this.cristalScale,
                    duration: 1,
                    ease: "power3.out",
                    onComplete: this.increaseCounter
                }
            )
            this.lastIntersectedObject = null
            this.isIntersected = false
        }


        this.controls.update()

        this.bloom.animate()
    }
}

export default new Constellation()