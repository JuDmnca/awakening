import * as THREE from 'three'
import Loader from '../Loader'
// import modelFlower from '../../../../assets/models/flower.glb'
import modelFlower from '../../../../assets/models/flower_2.gltf'

import petalVert from "../Shaders/Flower/flower.vert"
import petalFrag from "../Shaders/Flower/flower.frag"
import { Vector3 } from 'three'

// const petaleTexture = require("../../../../assets/textures/petale.png")

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}
class Flower extends THREE.Object3D {
    constructor(props) {
        super()
        this.props = props
        this.scene = props.scene
        this.model = null
        this.flowerObject = new THREE.Object3D()
    }

    init() {
        const position = this.props.position

        const flowerFrag = require("../../../../assets/textures/texture_03.jpg")
        const flowerTexture = new THREE.TextureLoader().load( flowerFrag );

        const flowerVert = require("../../../../assets/textures/texture_springiness.jpg")
        const flowerSpringiness = new THREE.TextureLoader().load( flowerVert );

        const flowerShaderMaterial = new THREE.ShaderMaterial( {
            uniforms: {
              petalMap: { type: "t", value: flowerTexture },
              springinessMap: { type: "t", value: flowerSpringiness },
              rotationForceMatrix : { type : 'm4', value : new THREE.Matrix4() },
            },
            vertexShader: petalVert,
            fragmentShader: petalFrag,
            side: THREE.DoubleSide
        });
        this.flowerObject = new Loader({model: modelFlower, position: position, scaleY: this.props.scaleY, material: flowerShaderMaterial})
        this.flowerObject = this.flowerObject.initObject()
        return this.flowerObject
    }

    update() {
        if (store && store.state.desert.rotation != null) {
          console.log(this.flowerObject)
            let distRotation = store.state.desert.rotation.clone().sub(this.flowerObject.rotation.toVector3());
            let distRotationMatrix = this._createRotationMatrix(distRotation);

            // // - force to apply at flowerObject
            let rotationForce = distRotation.multiplyScalar(store.state.desert.velSpringiness);

            // - update rotation with rotationForce
            this.flowerObject.rotation.setFromVector3(this.flowerObject.rotation.toVector3().add(rotationForce));
        }
    }

    _createRotationMatrix(vectRotation) {
		let m = new THREE.Matrix4();
		let m1 = new THREE.Matrix4();
		let m2 = new THREE.Matrix4();
		let m3 = new THREE.Matrix4();

		m1.makeRotationX( -vectRotation.x );
		m2.makeRotationY( -vectRotation.y );
		m3.makeRotationY( -vectRotation.z );

		m.multiplyMatrices( m1, m2 );
		m.multiply( m3 );

		return m;
	}
}

export default Flower
