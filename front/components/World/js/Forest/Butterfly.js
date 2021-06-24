import modelButterfly from '../../../../assets/models/m_butterfly.gltf'
import Loader from '../../../Utils/js/Loader'

export default class Butterfly {
  constructor (props) {
    this.props = props
    this.scene = props.scene
    this.mixer = props.mixer
    this.animations = props.animations

    this.butterfly = null

    this.loadButterfly()
  }

  async loadButterfly () {
    const loader = new Loader({ model: modelButterfly })
    this.butterfly = await loader.initButterfly(this.mixer, this.animations)

    this.scene.add(this.butterfly)
  }
}
