import Desert from '../../../assets/models/m_desert.glb'
import Forest from '../../../assets/models/m_forest.gltf'
import Loader from '../../Utils/js/Loader'

const sandTexture = [
  require('../../../assets/textures/t_sand.png')
]
const forestTexture = [
  require('../../../assets/textures/t_forest.png')
]

export default class Land {
  constructor (props) {
    this.props = props
    this.models = []
    this.mixer = this.props.mixer
    this.animations = this.props.animations
  }

  async load () {
    this.loader = new Loader({ models: [Desert, Forest], material: [sandTexture, forestTexture], position: { x: 0, y: 0, z: 0 } })
    for (let i = 0; i < 2; i++) {
      this.models[i] = await this.loader.defaultInit(i, this.mixer, this.animations)
    }
  }

  get (index) {
    return this.models[index]
  }
}
