import Land from '../Land'
import Cube from './Cube'
import Flower from './Flower'
import Plant from './Plant'
import modelDesert from '../../../../assets/models/desert-dev.glb'
import Raycaster from "../Utils/Raycaster"
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

    this.progression = null

    this.desertGroup = new THREE.Group()

    this.myCube = null
    this.cubeLight = new THREE.PointLight(0xffff00, 0, 5)

    this.plantsGroup = new THREE.Group()
    this.plants = []
    this.plantsOffsets = {
      x: 10,
      y: 0.1,
      z: 2
    }

    this.noise = new perlinNoise3d()
  }

  init(scene, renderer) {
    this.land.load(this.desertGroup, modelDesert)

    // Cube - Hover zone for flowers
    this.myCube = new Cube({scene: this.plantsGroup, position: {x: 0, y: 0, z: -1.5}})

    // Add Plants (Flower + Stem)
    for(let nbPlants = 0; nbPlants <= 14; nbPlants++) {
      const plant = new Plant({orientation: nbPlants})
      this.plants.push(plant)

      this.plantsGroup.add(plant.init())
    }

    this.plantsGroup.position.set(-10,2,-10)

    this.desertGroup.add(this.plantsGroup)

    // Lights
    this.desertGroup.add( this.cubeLight );

    // GUI
    // MainGui.init(this.)
    // this.raycaster.init(this.path, renderer)

    // Listeners
    window.addEventListener('click', () => {
      this.handleClick()
    })
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
    this.plants.forEach(plant => {
      plant.update()
    })
  }
}

export default Desert