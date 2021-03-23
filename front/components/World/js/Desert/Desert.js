import Land from '../Land'
import modelDesert from '../../../../assets/models/desert_scaled.gltf'

class Desert {
  constructor(props) {
    this.props = props
    this.land = new Land()
  }

  init(scene) {
    this.land.load(scene, modelDesert)
  }
}

export default Desert