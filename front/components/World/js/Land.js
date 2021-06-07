import Loader from './Loader'
export default class Land {
  constructor (props) {
    this.props = props
    this.model = null
  }

  load (model) {
    this.model = new Loader({ model, material: this.props.texture, position: { x: 0, y: 0, z: 0 } })
    return this.model.defaultInit()
  }
}
