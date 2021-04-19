import Land from '../Land'
import Cube from './Cube'
import Plant from './Plant'
import modelDesert from '../../../../assets/models/m_desert.glb'
import Raycaster from "../Utils/Raycaster"
import { gsap } from "gsap"
import * as THREE from 'three'
import perlinNoise3d from 'perlin-noise-3d'
import Particles from './Particles'
import MainGui from '../Utils/MainGui'
import ColorGUIHelper from '../Utils/ColorGUIHelper'
import Rotation from '../Utils/Rotation'

const sandTexture = require("../../../../assets/textures/t_sand.png")

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}

export default class Desert {
  constructor(props) {
    this.props = props

    // Generals params
    this.params = {
      spotLightOnFlowersColor: '#ff57e9'
    }
    
    this.hold = false
    this.land = new Land({texture: sandTexture})

    this.camera = this.props.camera
    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null

    this.progression = null

    this.desertGroup = new THREE.Group()

    this.myCube = null
    // TO DO : Maybe remove that
    // this.cubeLight = new THREE.PointLight(0xffffff, 0, 5)

    this.plantsGroup = new THREE.Group()
    this.plants = []
    this.plantsOffsets = {
      x: 10,
      y: 0.1,
      z: 2
    }

    this.noise = new perlinNoise3d()

    this.spores = null

    this.spotLightOnFlowers = null

    this.gui = new MainGui()

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

    this.plantsGroup.position.set(-2.2075, 1.896, -1.7811)
    this.plantsGroup.scale.set(2.5,2.5,2.5)

    this.desertGroup.add(this.plantsGroup)

    // Lights
    this.desertGroup.add( this.cubeLight );

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    // Add Spores
    this.spores = new Particles()
    this.desertGroup.add(this.spores.init(renderer))

    // SpotLights on Flowers
    this.spotLightOnFlowers = new THREE.PointLight( this.params.spotLightOnFlowersColor, 1, 0 );
    this.spotLightOnFlowers.position.y += 5
    this.spotLightOnFlowers.position.x -= 3
    this.spotLightOnFlowers.position.z -= 3
    // this.spotLightOnFlowers.color = '#ffffff'
    this.desertGroup.children[2].add( this.spotLightOnFlowers );

    // Fog
    const colorBG = new THREE.Color('#877d6f')
    scene.fog = new THREE.Fog(colorBG, 10, 300)
    scene.background = new THREE.Color(colorBG)

    // GUI
      // Lights
    const lightsFolder = this.gui.gui.addFolder('Lights')
    lightsFolder.addColor(new ColorGUIHelper(this.spotLightOnFlowers, 'color'), 'value').name('flowers color')
    lightsFolder.add(this.spotLightOnFlowers, 'intensity', 0, 2, 0.1).name('intensity flowers')
    
    // Listeners
    window.addEventListener('click', () => {
      this.handleClick()
    })
    window.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.hold = true
    });
    window.addEventListener("mouseup", (e) => {
      e.preventDefault();
      this.hold = false
    });

    window.addEventListener("mouseup", (e) => {
      e.preventDefault();
      this.hold = false
    });

    scene.add(this.desertGroup)
  }

  handleClick() {
    if (this.intersects.length > 0) {
      gsap.to(this, {progression: 19.9999, duration: 2.5, ease: "power3.out"} )
    }
  }
  
  // TO DO : Maybe remove that
  // handleCubeHover() {
  //   if (this.intersects.length > 0) {
  //     document.body.style.cursor = "pointer"
  //     this.intersected = this.intersects[0].object
  //     this.intersected.currentHex = this.intersected.material.emissive.getHex()
  //     this.intersected.material.emissive.setHex( 0xcccc00 )

  //     // Emissive cubeLight of cube on hover
  //     const lightAltitude = 3
  //     this.cubeLight.position.set( this.intersected.position.x, this.intersected.position.y + lightAltitude, this.intersected.position.z );
  //     // this.cubeLight.intensity = 1
  //   } else if (this.intersected) {
  //     document.body.style.cursor = "initial"
  //     this.intersected.material.emissive.setHex("default")
  //     this.cubeLight.intensity = 0
  //   }
  // }

  isFixedView () {
    if (this.progression > 19) {
      return true
    } else {
      return false
    }
  }

  inhale() {
    gsap.to(
      this.desertGroup.children[2].material.uniforms.uZSpeed,
      {
        value: 40,
        duration: 2000,
        ease: "power3.out"
      }
    )
  }

  exhale() {
    gsap.to(
      this.desertGroup.children[2].material.uniforms.uZSpeed,
      {
        value: -2,
        duration: 2000,
        ease: "power3.out"
      }
    )  
  }

  render(elapsedTime) {
    this.intersects = this.raycaster.render(this.desertGroup)
    if(this.hold){
      this.inhale()
    } else {
      this.exhale()
    }
    this.desertGroup.children[2].material.uniforms.uTime.value = elapsedTime
    this.handleCubeHover()
    this.plants.forEach(plant => {
      plant.update()
    })
  }
}