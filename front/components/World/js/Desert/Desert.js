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
    this.land = new Land()
    this.myCube = new Cube()
    this.raycaster = new Raycaster()
    this.intersects = []
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
  }

  init(scene, renderer) {
    this.land.load(scene, modelDesert)

    scene.add(this.myCube.cube)

    // GUI
    MainGui.init(this.myCube)
    this.raycaster.init(this.path, renderer)

    // Path
    this.path.init()

    // Listeners
    window.addEventListener('click', () => {
      this.handleClick()
    })
  }

  handleClick() {
    if (this.intersects.length > 0) {
        gsap.to(this, {progression: 19.9999, duration: 2.5, ease: "power3.out"} )
        // setTimeout(() => {
        //     this.updateScene()
        // }, 1000)
    }
  }

  render(scene) {
    this.intersects = this.raycaster.render(scene)
    this.path.render(this.progression)
  }
}

export default Desert