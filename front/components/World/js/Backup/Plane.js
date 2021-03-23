import * as THREE from 'three'
import Common from '../Common'
import vertexShader from "../Shaders/Plane/plane.vert"
import fragmentShader from "../Shaders/Plane/plane.frag"

export default class Plane {
    constructor() {
        this.init()
    }

    init() {
        const uniforms = {
            blue: {value: new THREE.Color("#7ac4c9") },
            darkBlue: {value: new THREE.Color("#146a85")}
        }

        this.geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 )
        this.material = new THREE.RawShaderMaterial( {
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            uniforms
        } )
        this.plane = new THREE.Mesh( this.geometry, this.material )
        // this.plane.rotation.x = - Math.PI / 2
        // this.plane.rotation.z = 3 * Math.PI / 4
        this.plane.position.x = 69.95803833007812
        this.plane.position.y = -11.2
        this.plane.position.z = -4.220249652862549

        Common.scene.add( this.plane )
    }
}