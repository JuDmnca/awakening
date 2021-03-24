import Land from '../Land'
import Cube from './Cube'
import modelDesert from '../../../../assets/models/desert_test.glb'
import MainGui from "../Helpers/MainGui"
import Raycaster from "../Raycaster"
import Path from "../Path"
import gsap from 'gsap'
import * as THREE from 'three'

class Desert {
  constructor(props) {
    this.props = props
    this.hold = false
    this.land = new Land()
    this.myCube = new Cube()
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
  }

  init(scene, renderer) {
    this.land.load(scene, modelDesert)

    scene.add(this.myCube.cube)

    // Lights
    scene.add( this.cubeLight );

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
      this.intersected = this.intersects[0].object
      this.intersected.currentHex = this.intersected.material.emissive.getHex()
      this.intersected.material.emissive.setHex( 0xcccc00 )

      // Emissive cubeLight of cube on hover
      this.cubeLight.position.set( this.intersected.position.x, this.intersected.position.y + 1, this.intersected.position.z );
      this.cubeLight.intensity = 1
    } else if (this.intersected) {
      this.intersected.material.emissive.setHex("default")
      this.cubeLight.intensity = 0
    }
  }

  showCursorTimer (t) {
    const circle = document.body.querySelector('.cursor-timer')
    if (!this.hold) {
      this.hold = true
      gsap.to(circle, {opacity: 1, duration: 1})
      gsap.to(circle, {x: 500, duration: 3})
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

  render(scene) {
    this.intersects = this.raycaster.render(scene)
    this.handleCubeHover()
    this.path.render(this.progression)
  }
}

export default Desert