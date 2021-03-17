import * as THREE from 'three'
import Loader from './Loader'
import modelDesert from '../../../assets/models/desert_scaled.gltf'

class Land {
    constructor(props) {
        this.props = props
        this.model = null
        this.models = []
    }

    init() {
        this.models.push(modelDesert)
        this.models.push(modelDesert)
    }

    load(idScene, scene) {
        console.log( this.models[idScene])
        this.model = new Loader({model: this.models[idScene]})
        this.model.init(scene)
    }
}

export default Land