import * as THREE from 'three'

// Futur composant flower
class Cube {
    constructor() {
        this.init()
    }

    init() {
        this.geometry = new THREE.BoxGeometry(2, 2, 2)
        // this.material = new THREE.MeshNormalMaterial()
        this.material = new THREE.MeshStandardMaterial({
            color: "grey",
            // wireframe: true,
            flatShading: true
        })
        this.material.color.convertSRGBToLinear()

        this.cube = new THREE.Mesh( this.geometry, this.material )

        this.cube.position.x = 4
        this.cube.position.y = 0
        this.cube.position.z = -1
    }
}

export default Cube
