import Land from '../Land'
// import modelPrairie from '../../../../assets/models/m_prairie.glb'
import Raycaster from "../Utils/Raycaster"
import * as THREE from 'three'
import MainGui from '../Utils/MainGui'
import ColorGUIHelper from '../Utils/ColorGUIHelper'
import Rotation from '../Utils/Rotation'

// const grassTexture = require("../../../../assets/textures/t_grass.png")

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}

export default class Prairie {
  constructor(props) {
    this.props = props

    // Generals params
    this.hold = false
    this.land = new Land({texture: grassTexture})

    this.camera = this.props.camera
    this.raycaster = new Raycaster()
    this.intersects = []
    this.intersected = null

    this.progression = null

    this.prairieGroup = new THREE.Group()

    this.tree = new THREE.Group()

    this.noise = new perlinNoise3d()
    this.gui = new MainGui()
  }

  init(scene, renderer) {

    this.land.load(this.prairieGroup, modelPrairie)

    this.tree = new Tree()
    this.tree = this.tree.init()
    this.prairieGroup.add(this.tree)

    // Raycaster
    this.raycaster.init(this.camera, renderer)

    // Fog
    const colorBG = new THREE.Color('#877d6f')
    scene.fog = new THREE.Fog(colorBG, 10, 300)
    scene.background = new THREE.Color(colorBG)

    // GUI
    // Fog and Background
    const fogFolder = currentSceneFolder.addFolder('Fog')
    fogFolder.addColor(new ColorGUIHelper(scene.fog, 'color'), 'value').name('fog color')
    fogFolder.addColor(new ColorGUIHelper(scene, 'background'), 'value').name('background color')

    scene.add(this.prairieGroup)
  }

  render() {
    if(this.prairieGroup) {
      this.intersects = this.raycaster.render(this.prairieGroup)
    }
  }
}