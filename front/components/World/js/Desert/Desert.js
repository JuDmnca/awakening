import Land from '../Land'
import Cube from './Cube'
import Flower from './Flower'
import modelDesert from '../../../../assets/models/desert.glb'
import MainGui from "../Utils/MainGui"
import Raycaster from "../Utils/Raycaster"
import Path from "../Path"
import gsap from 'gsap'
import * as THREE from 'three'
import perlinNoise3d from 'perlin-noise-3d'

import Rotation from '../Utils/Rotation'

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
      new THREE.Vector3(0, 3, -0.8), // Point avant la plongée
      new THREE.Vector3(0, 2, -1),
      new THREE.Vector3(0, 1.5, -1.2) // Point plongée
    ]
    this.path = new Path({pathVectors: this.pathVectors})
    this.progression = null

    this.desertGroup = new THREE.Group()

    this.myCube = null
    this.cubeLight = new THREE.PointLight(0xffff00, 0, 5)

    this.flowerGroup = new THREE.Group()
    this.flower = null
    this.flowers = []
    this.flowerOffsets = {
      x: 10,
      y: 0,
      z: 0
    }

    this.noise = new perlinNoise3d()
  }

  init(scene, renderer) {
    this.land.load(this.desertGroup, modelDesert)

    // Cube - Hover zone for flowers
    this.myCube = new Cube({scene: this.flowerGroup, position: {x: 0, y: 0, z: -1.5}})

    // Flower
    // this.flower = new Flower()
    // this.flowerGroup.add(this.flower.init())

    // Flower group
    for(let nbFlowers = 0; nbFlowers <= 15; nbFlowers++) {
      const flower = new Flower()
      this.flowers.push(flower)

      this.flowerOffsets.x += 2 // To be not too organic
      this.flowerOffsets.y += 0.1
      this.flowerOffsets.z += 2 // To be not too organic

      this.flowerGroup.add(flower.init())
      flower.flowerObject.position.x = - this.noise.get(this.flowerOffsets.x) * 3 + 1
      flower.flowerObject.position.y = 0
      flower.flowerObject.position.z = this.noise.get(this.flowerOffsets.z) * 3 - 1
      flower.flowerObject.scale.y = this.noise.get(this.flowerOffsets.y + 10)
    }

    this.flowerGroup.position.z = -2

    this.desertGroup.add(this.flowerGroup)

    // Lights
    this.desertGroup.add( this.cubeLight );

    // GUI
    // MainGui.init(this.myCube)
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
    scene.add(this.desertGroup)
  }

  handleClick() {
    if (this.intersects.length > 0) {
      gsap.to(this, {progression: 19.9999, duration: 2.5, ease: "power3.out"} )
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
      // this.cubeLight.intensity = 1
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

  isFixedView () {
    if (this.progression > 19) {
      return true
    } else {
      return false
    }
  }

  render() {
    this.intersects = this.raycaster.render(this.desertGroup)
    this.handleCubeHover()
    this.path.render(this.progression)
    this.flowers.forEach(flower => {
      flower.update()
    })

    // this.flower.update()
  }
}

export default Desert