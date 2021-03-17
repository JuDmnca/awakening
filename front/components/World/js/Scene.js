import Common from './Common'
import Plane from './Plane'
import Cube from './Cube'

export default class Scene {
    constructor(props) {
        this.props = props
        this.init()
    }

    init() {
        Common.init(this.props.$canvas)
        window.addEventListener('resize', this.resize.bind(this))
        this.loop()
    }

    resize() {
        Common.resize()
    }

    loop() {
        this.render()
        requestAnimationFrame(this.loop.bind(this))
    }

    render() {
        Common.render()
    }
}