import Common from './Common'
export default class Scene {
  constructor (props) {
    this.props = props
    this.requestAnim = null
    this.init()
  }

  async init () {
    await Common.init(this.props.$canvas)
    window.addEventListener('resize', this.resize.bind(this))
    this.loop()
  }

  resize () {
    Common.resize()
  }

  loop () {
    this.render()
    this.requestAnim = window.requestAnimationFrame(this.loop.bind(this))
  }

  clean () {
    window.cancelAnimationFrame(this.requestAnim)
    this.requestAnim = undefined
    Common.clean()
  }

  render () {
    Common.render()
  }
}
