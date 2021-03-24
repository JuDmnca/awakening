import * as THREE from 'three'
import Loader from './Loader'

class Land {
    constructor(props) {
        this.props = props
        this.model = null
    }

    load(scene, model) {
        this.model = new Loader({model: model, texture: this.props.texture, position: {x: 0, y: 0, z: 0}})
        this.model.init(scene)
    }
}

export default Land