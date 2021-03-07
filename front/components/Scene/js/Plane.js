import * as THREE from 'three'
import Common from './Common'
import vertexShader from "./shaders/Plane/plane.vert"
import fragmentShader from "./shaders/Plane/plane.frag"

export default class Plane {
    constructor() {
        this.init()
    }

    init() {
        const uniforms = {
            blue: {value: new THREE.Color("#7ac4c9") },
            darkBlue: {value: new THREE.Color("#146a85")}
        }

        this.geometry = new THREE.PlaneGeometry( 10, 10, 10, 10 )
        this.material = new THREE.RawShaderMaterial( {
            vertexShader,
            fragmentShader,
            side: THREE.DoubleSide,
            uniforms
        } )
        this.plane = new THREE.Mesh( this.geometry, this.material )
        // this.plane.rotation.x = - Math.PI / 2
        // this.plane.rotation.z = 3 * Math.PI / 4

        this.axesHelper = new THREE.AxesHelper( 5 )
        this.plane.add( this.axesHelper )

        Common.scene.add( this.plane )
    }
}