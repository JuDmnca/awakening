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
    this.flowerTypes = ['lavender', 'orchid', 'daisy']
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
    let index = -1
    for(let nbPlants = 0; nbPlants <= 1; nbPlants++) {
      index++
      if (index >= 3) {
        index = 0
      }
      const plant = new Plant({orientation: nbPlants, flowerType: this.flowerTypes[index]})
      this.plants.push(plant)

      this.plantsGroup.add(plant.init())
    }

    this.plantsGroup.position.set(-2.2075, 3, -1.7811)
    this.plantsGroup.scale.set(2.5,2.5,2.5)

    this.desertGroup.add(this.plantsGroup)

    // Lights
    // this.desertGroup.add( this.cubeLight );

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    // Add Spores
    this.spores = new Particles()
    this.desertGroup.add(this.spores.particles)

    // SpotLights on Flowers
    this.spotLightOnFlowers = new THREE.PointLight( this.params.spotLightOnFlowersColor, 1, 0 );
    this.spotLightOnFlowers.position.y += 5
    this.spotLightOnFlowers.position.x -= 3
    this.spotLightOnFlowers.position.z -= 3
    // this.spotLightOnFlowers.color = '#ffffff'
    this.spores.particles.add( this.spotLightOnFlowers );

    // Fog
    const colorBG = new THREE.Color('#877d6f')
    scene.fog = new THREE.Fog(colorBG, 10, 300)
    scene.background = new THREE.Color(colorBG)

    // GUI
    // Lights
    const currentSceneFolder = this.gui.gui.addFolder('Current Scene')
    const lightsFolder = currentSceneFolder.addFolder('Lights')
    lightsFolder.addColor(new ColorGUIHelper(this.spotLightOnFlowers, 'color'), 'value').name('flowers color')
    lightsFolder.add(this.spotLightOnFlowers, 'intensity', 0, 2, 0.1).name('intensity flowers')
    // Fog and Background
    const fogFolder = currentSceneFolder.addFolder('Fog')
    fogFolder.addColor(new ColorGUIHelper(scene.fog, 'color'), 'value').name('fog color')
    fogFolder.addColor(new ColorGUIHelper(scene, 'background'), 'value').name('background color')

    // Listeners
    window.addEventListener('click', () => {
      this.handleClick()
    })
    window.addEventListener("mousedown", (e) => {
      this.hold = true
      this.inhale(30)
    });
    window.addEventListener("mouseup", (e) => {
      this.hold = false
      this.exhale()
    });
    
    let lastMouseX = -1; 
    let lastMouseY = -1;
    let mouseSpeed = 0;
    window.addEventListener("mousemove", (e) => {
      // Spores elevating when mousemove
      // TO DO : activate this listener when we are near the flowers
      e.preventDefault();
      let mouseX = e.pageX;
      let mouseY = e.pageY;
      if (lastMouseX > -1) {
          mouseSpeed = Math.max( Math.abs(mouseX-lastMouseX), Math.abs(mouseY-lastMouseY) );
        }
      lastMouseX = mouseX;
      lastMouseY = mouseY;

      this.inhale(mouseSpeed)
    });

    scene.add(this.desertGroup)
  }

  handleClick() {
    if (this.intersects.length > 0) {
      gsap.to(this, {progression: 1, duration: 1, ease: "power3.out"} )
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
    if (this.progression > 0.9) {
      return true
    } else {
      return false
    }
  }

  inhale(speedOfSpores) {
    gsap.to(
      this.spores.particles.material.uniforms.uZSpeed,
      {
        value: speedOfSpores * 10,
        duration: 2000,
        ease: "power3.out"
      }
    )
  }

  exhale() {
    gsap.to(
      this.spores.particles.material.uniforms.uZSpeed,
      {
        value: -10,
        duration: 2000,
        ease: "power3.out"
      }
    )
  }

  render(elapsedTime) {
    this.intersects = this.raycaster.render(this.desertGroup)
    this.spores.particles.material.uniforms.uTime.value = elapsedTime
    // this.handleCubeHover()
    this.plants.forEach(plant => {
      plant.update()
    })
  }
}