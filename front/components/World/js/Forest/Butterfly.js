import modelButterfly from '../../../../assets/models/m_butterfly.gltf'
import Loader from '../../../Utils/js/Loader'

export default class Butterfly {
  constructor (props) {
    this.props = props
    this.scene = props.scene
    this.mixer = props.mixer

    this.butterfly = null

    this.loadButterfly()
  }

  async loadButterfly () {
    const loader = new Loader({ model: modelButterfly })
    this.butterfly = await loader.initButterfly({ mixer: this.mixer })

    this.scene.add(this.butterfly)
  }
}
