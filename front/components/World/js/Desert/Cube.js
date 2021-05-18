import * as THREE from 'three'
import MainGui from '../Utils/MainGui'

// Futur composant flower
export default class Cube {
    constructor(props) {
        this.props = props
        this.scene = props.scene
        this.init(this.scene)
    }

    init(scene) {
        this.geometry = new THREE.BoxGeometry(3, 3, 2.5,)
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

        // Gui
        // this.gui = new MainGui()
        // const positions = this.gui.gui.addFolder('Position Cube')
        // positions.add(this.cube.position, 'x', 0, 10, .1).name('x')
        // positions.add(this.cube.position, 'y', 0, 10, .1).name('y')
        // positions.add(this.cube.position, 'z', 0, 10, .1).name('z')
    }
}
