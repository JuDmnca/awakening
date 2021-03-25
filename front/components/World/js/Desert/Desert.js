import Land from '../Land'
import Cube from './Cube'
import Flower from './Flower'
import modelDesert from '../../../../assets/models/desert.glb'
import MainGui from "../Helpers/MainGui"
import Raycaster from "../Raycaster"
import Path from "../Path"
import gsap from 'gsap'
import * as THREE from 'three'
import perlinNoise3d from 'perlin-noise-3d'

const sandTexture = require("../../../../assets/textures/sand.png")

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}

class Desert {
  constructor(props) {
    this.props = props
    this.hold = false
    this.land = new Land({texture: sandTexture})
    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null
    this.pathVectors = [
      new THREE.Vector3(0, 2, 20),
      new THREE.Vector3(2, 2, 15),
      new THREE.Vector3(-3, 2, 10),
      new THREE.Vector3(3, 3, -0.8), // Point avant la plongée
      new THREE.Vector3(3, 2, -1),
      new THREE.Vector3(3, 1.5, -1.2) // Point plongée
    ]
    this.path = new Path({pathVectors: this.pathVectors})
    this.progression = null
    this.cubeLight = new THREE.PointLight(0xffff00, 0, 15)
    this.group = new THREE.Group()
    this.flowerPosition = {x: -5, y: 0, z: 0}
    this.flower = null
    this.flowerOffsets = {
      x: 0,
      y: 0,
      z: 0
    }
    this.myCube = null
    this.noise = new perlinNoise3d()
    this.noiseStep = 0
    this.flowerGroup = new THREE.Group()
  }

  init(scene, renderer) {
    this.land.load(this.group, modelDesert)

    // Flower
    // this.flower = new Flower({scene: this.group, position: this.flowerPosition})

    // Flower group
    for(let nbFlowers = 0; nbFlowers <= 200; nbFlowers++) {
      new Flower({
        scene: this.flowerGroup, 
        position: {
          x: - this.noise.get(this.flowerOffsets.x + 10) * 10,
          y: 0,
          z: - this.noise.get(this.flowerOffsets.z) * 10
        },
        scaleY: this.noise.get(this.flowerOffsets.y)
      })
      this.flowerOffsets.x += 0.1
      this.flowerOffsets.y += 0.01
      this.flowerOffsets.z += 0.1
    }
    scene.add(this.flowerGroup)
    
    // Cube
    this.myCube = new Cube({scene: this.group, position: {x: 0, y: 0, z: 5}})

    // Lights
    this.group.add( this.cubeLight );

    // GUI
    MainGui.init(this.myCube)
    this.raycaster.init(this.path, renderer)

    // Path
    this.path.init()

    // Listeners
    window.addEventListener('click', () => {
      this.handleClick()
    })
    window.addEventListener('mousedown', (e) => {
      e.preventDefault()
      this.showCursorTimer(e.target)
    })
    window.addEventListener('mouseup', (e) => {
      e.preventDefault()
      this.hideCursorTimer()
    })
    // FOR LATER : TOUCH INTERACTION
    // window.addEventListener('touchstart', (e) => {
    //   this.hold(e)
    // })
    scene.add(this.group)
  }

  handleClick() {
    if (this.intersects.length > 0) {
        gsap.to(this, {progression: 19.9999, duration: 2.5, ease: "power3.out"} )
        // setTimeout(() => {
        //     this.updateScene()
        // }, 1000)
    }
  }

  handleCubeHover() {
    if (this.intersects.length > 0) {
      document.body.style.cursor = "pointer"
      this.intersected = this.intersects[0].object
      this.intersected.currentHex = this.intersected.material.emissive.getHex()
      this.intersected.material.emissive.setHex( 0xcccc00 )

      // Emissive cubeLight of cube on hover
      this.cubeLight.position.set( this.intersected.position.x, this.intersected.position.y + 1, this.intersected.position.z );
      this.cubeLight.intensity = 1
    } else if (this.intersected) {
      document.body.style.cursor = "initial"
      this.intersected.material.emissive.setHex("default")
      this.cubeLight.intensity = 0
    }
  }

  showCursorTimer (t) {
    const circle = document.body.querySelector('.cursor-timer')
    if (!this.hold) {
      this.hold = true
      gsap.to(circle, {opacity: 1, duration: 1})
      gsap.to(circle, {x: 500, duration: 3, onComplete: this.increaseCounter})
    } else {
      gsap.to(circle, {opacity: 1, duration: 1})
      gsap.to(circle, {x: 500, duration: 3})
    }
  }

  hideCursorTimer () {
    this.hold = false
    const circle = document.body.querySelector('.cursor-timer')
    gsap.to(circle, {opacity: 0, duration: 1})
    gsap.to(circle, {x: 0, duration: 1, overwrite: "auto"})
  }

  increaseCounter () {
    store.commit('desert/increaseCounter')
    console.log(store.state.desert.counter)
    if (store.state.desert.counter === 3) {
      console.log('Interaction done !')
    }
  }

  render() {
    this.intersects = this.raycaster.render(this.group)
    this.handleCubeHover()
    this.path.render(this.progression)
  }
}

export default Desert