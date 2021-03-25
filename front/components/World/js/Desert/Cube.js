import * as THREE from 'three'

// Futur composant flower
class Cube {
    constructor(props) {
        this.props = props
        this.scene = props.scene
        this.init(this.scene)
    }

    init(scene) {
        this.geometry = new THREE.BoxGeometry(2.5, 2, 2.5)
        // this.material = new THREE.MeshNormalMaterial()
        this.material = new THREE.MeshStandardMaterial({
            color: "grey",
            // wireframe: true,
            flatShading: true,
            opacity: 0,
            transparent: true,
        })
        this.material.color.convertSRGBToLinear()

        this.cube = new THREE.Mesh( this.geometry, this.material )
        this.cube.opacity = 0
        this.cube.position.x = this.props.position.x
        this.cube.position.y = this.props.position.y
        this.cube.position.z = this.props.position.z

        scene.add(this.cube)
    }
}

export default Cube
