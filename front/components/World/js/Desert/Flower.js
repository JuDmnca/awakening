import * as THREE from 'three'
import Loader from '../Loader'
import modelFlower from '../../../../assets/models/flower.gltf'

import petalVert from "../../../../assets/shaders/flower/flower.vert"
import petalFrag from "../../../../assets/shaders/flower/flower.frag"

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}
export default class Flower {
  constructor(props) {
    this.props = props
    this.flowerObject = null
    this.ready = false
  }

  init() {
    // Import flower petals texture
    const flowerFrag = require("../../../../assets/textures/petal2.png")
    const flowerTexture = new THREE.TextureLoader().load( flowerFrag );

    // Import flower petals springiness texture
    const flowerVert = require("../../../../assets/textures/petal_s.jpg")
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
    this.flowerObject = new Loader({model: modelFlower, material: flowerShaderMaterial})
    this.flowerObject = this.flowerObject.initFlowerObject()

    return this.flowerObject
  }

  update() {
    if (store && store.state.desert.fRotation != null) {
      let distRotation = store.state.desert.fRotation.clone().sub(this.flowerObject.rotation.toVector3());
      let distRotationMatrix = this.createRotationMatrix(distRotation);

      // force to apply at flowerObject
      let rotationForce = distRotation.multiplyScalar(store.state.desert.velSpringiness);

      // update rotation with rotationForce
      this.flowerObject.rotation.setFromVector3(this.flowerObject.rotation.toVector3().add(rotationForce));

      if (this.flowerObject.children[0]) {
        this.traversePetalsChilds( ( child ) => {
          // apply shader only to petal with shader material
          if (child.material instanceof THREE.ShaderMaterial) {
            child.material.uniforms.rotationForceMatrix.value = distRotationMatrix;
          }
        })
      }
    }
  }

  createRotationMatrix(vectRotation) {
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

  traversePetalsChilds(fct) {
		this.flowerObject.children[0].traverse( (c) => {
			if ( c instanceof THREE.Mesh ) {
				fct(c)
			}
		})
	}

}
