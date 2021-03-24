import * as THREE from 'three'
import Loader from '../Loader'
// import modelFlower from '../../../../assets/models/flower.glb'
import modelFlower from '../../../../assets/models/flower_2.gltf'

class Flower {
    constructor(props) {
        this.scene = props
        this.init(this.scene)
    }

    init(scene) {
        this.model = new Loader({model: modelFlower})
        this.model.init(scene)
    }
}

export default Flower
