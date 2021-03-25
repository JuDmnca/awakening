import * as THREE from 'three'
import Loader from '../Loader'
// import modelFlower from '../../../../assets/models/flower.glb'
import modelFlower from '../../../../assets/models/flower_2.gltf'

const petaleTexture = require("../../../../assets/textures/petale.png")

class Flower {
    constructor(props) {
        this.props = props
        this.scene = props.scene
        this.model = null
        this.init(this.scene)
    }

    init(scene) {
        const position = this.props.position
        this.model = new Loader({model: modelFlower, position: position, scaleY: this.props.scaleY, texture: petaleTexture})
        this.model.init(scene)
    }
}

export default Flower
