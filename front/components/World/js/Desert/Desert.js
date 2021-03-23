import Land from '../Land'
import Cube from './Cube'
// import modelDesert from '../../../../assets/models/desert_scaled.gltf'
import modelDesert from '../../../../assets/models/desert_test.glb'
import MainGui from "../Helpers/MainGui"

class Desert {
  constructor(props) {
    this.props = props
    this.land = new Land()
    this.myCube = new Cube()
  }

  init(scene) {
    this.land.load(scene, modelDesert)

    scene.add(this.myCube.cube)

    // GUI
    MainGui.init(this.myCube)
  }
}

export default Desert