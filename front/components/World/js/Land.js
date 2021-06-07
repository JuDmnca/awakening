import Loader from './Loader'
export default class Land {
  constructor (props) {
    this.props = props
    this.model = null
  }

  load (model) {
    if (this.props.index === 0) {
      this.model = new Loader({ model, material: this.props.texture, position: { x: 0, y: 0, z: 0 } })
    } else {
      this.model = new Loader({ model, material: this.props.texture, position: { x: 0, y: -20, z: 0 } })
    }
    return this.model.defaultInit()
  }
}
