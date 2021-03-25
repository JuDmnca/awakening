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
    this.cubeLight = new THREE.PointLight(0xffff00, 0, 5)
    this.group = new THREE.Group()
    this.flowerPosition = {x: -5, y: 0, z: 0}
    this.flower = null
    this.flowerOffsets = {
      x: 10,
      y: 0,
      z: 0
    }
    this.myCube = null
    this.noise = new perlinNoise3d()
    this.flowerGroup = new THREE.Group()
  }

  init(scene, renderer) {
    this.land.load(this.group, modelDesert)

    // Cube - Hover zone for flowers
    this.myCube = new Cube({scene: this.flowerGroup, position: {x: 2.5, y: 0, z: -1.5}})

    // Flower
    // this.flower = new Flower({scene: this.group, position: this.flowerPosition})

    // Flower group
    for(let nbFlowers = 0; nbFlowers <= 15; nbFlowers++) {
      new Flower({
        scene: this.flowerGroup, 
        position: {
          x: - this.noise.get(this.flowerOffsets.x) * 3, // 3 is for the distance between flowers
          y: 0,
          z: this.noise.get(this.flowerOffsets.z) * 3 - 15.5 // 3 is for the distance between flowers and 15.5 is for positionning
        },
        scaleY: this.noise.get(this.flowerOffsets.y + 10) // Min = 0.5 and Max = 1
      })
      this.flowerOffsets.x += 2 // To be not too organic
      this.flowerOffsets.y += 0.1
      this.flowerOffsets.z += 2 // To be not too organic
    }
    this.group.add(this.flowerGroup)

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
      const lightAltitude = 3
      this.cubeLight.position.set( this.intersected.position.x, this.intersected.position.y + lightAltitude, this.intersected.position.z );
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