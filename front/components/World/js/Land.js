import * as THREE from 'three'
import Loader from './Loader'

class Land {
    constructor(props) {
        this.props = props
        this.model = null
    }

    load(scene, model) {
        this.model = new Loader({model: model})
        this.model.init(scene)
    }
}

export default Land