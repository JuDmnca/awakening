import Desert from '../../../assets/models/m_desert.glb'
import Forest from '../../../assets/models/m_foret_export.glb'
import Loader from './Loader'

const sandTexture = require('../../../assets/textures/t_sand.png')

export default class Land {
  constructor (props) {
    this.props = props
    this.models = []
  }

  async load () {
    this.loader = new Loader({ models: [Desert, Forest], material: [sandTexture], position: { x: 0, y: 0, z: 0 } })
    for (let i = 0; i < 2; i++) {
      this.models[i] = await this.loader.defaultInit(i)
    }
  }

  get (index) {
    return this.models[index]
  }
}
