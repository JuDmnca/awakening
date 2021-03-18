import * as THREE from 'three'

class Cube {
    constructor() {
        this.init()
    }

    init() {
        this.geometry = new THREE.BoxGeometry(3)
        // this.material = new THREE.MeshNormalMaterial()
        this.material = new THREE.MeshStandardMaterial({
            color: 0xff3333,
            flatShading: true
        })
        this.material.color.convertSRGBToLinear()

        this.cube = new THREE.Mesh( this.geometry, this.material )

        this.cube.position.x = 69.95803833007812
        this.cube.position.y = -10.5
        this.cube.position.z = -4.220249652862549
    }
}

export default Cube
