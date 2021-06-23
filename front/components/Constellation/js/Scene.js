import Constellation from './Constellation'

export default class Scene {
  constructor (props) {
    this.props = props
    this.init()
  }

  init () {
    Constellation.init(this.props.$canvas)
    window.addEventListener('resize', this.resize.bind(this))
    this.loop()
  }

  resize () {
    Constellation.resize()
  }

  loop () {
    this.render()
    requestAnimationFrame(this.loop.bind(this))
  }

  render () {
    Constellation.render()
  }
}
