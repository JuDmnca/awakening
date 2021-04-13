import stemVert from "../../../../assets/shaders/plant/stem.vert"
import stemFrag from "../../../../assets/shaders/plant/stem.frag"

import pistilHeadVert from "../../../../assets/shaders/plant/pistilHead.vert"
import pistilHeadFrag from "../../../../assets/shaders/plant/pistilHead.frag"

import * as THREE from 'three'
import Flower from './Flower'
import CustomSinCurve from '../Utils/CustomSinCurve'

let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}

class Plant {
  constructor(props) {
    this.props = props

		this.POZ = new THREE.Vector3(this.getRandomFloat(-1, 1), 0.03, this.getRandomFloat(-1, 1) );
		this.ROTATION = new THREE.Vector3(-this.getRandomFloat(0.5, 1), 0.5 - (this.props.orientation/2), 0 );

    this.segments = 32;
    this.radiusSegment = 100;
    this.size = 0.01;
    this.length = this.getRandomFloat(0.05, 0.5);
    this.curve = 1;

    this.curve = new CustomSinCurve({curve: this.curve, length: this.length})
    this.plantHeadPosition = this.curve.getPoints()[this.curve.getPoints().length-1];

    this.plantplantGeometry = new THREE.TubeGeometry( this.curve, this.segments, this.size, this.radiusSegment );

    this.plantShaderMaterial = new THREE.ShaderMaterial({
      uniforms : {
        rotationForceMatrix : { type : 'm4', value : new THREE.Matrix4() }
      },
      vertexShader: stemVert,
      fragmentShader: stemFrag
    });

    this.plantplantMesh = new THREE.Mesh( this.plantplantGeometry, this.plantShaderMaterial );

    this.flower = null

    // TEST
    this.pistilHeadGeometry = new THREE.SphereGeometry( this.size*2, this.radiusSegment, this.segment );
		this.pistilHeadShaderMaterial = new THREE.ShaderMaterial({
			uniforms : {
				rotationForceMatrix : { type : 'm4', value : new THREE.Matrix4() }
			},
			vertexShader: pistilHeadVert,
			fragmentShader: pistilHeadFrag
		});
    this.pistilHeadMesh = new THREE.Mesh( this.pistilHeadGeometry, this.pistilHeadShaderMaterial );
		this.pistilHeadMesh.position.set( this.plantHeadPosition.x, this.plantHeadPosition.y, this.plantHeadPosition.z);

    this.plantMesh = new THREE.Object3D();
    this.plant = new THREE.Group()
    this.plant.add(this.plantplantMesh)
    this.plant.add(this.pistilHeadMesh)

    this.plantMesh.add(this.plant);
  }

    init() {
      this.flower = new Flower()
      this.plant.add(this.flower.init())
      this.plant.children[2].position.set(this.plantHeadPosition.x, this.plantHeadPosition.y, this.plantHeadPosition.z);

      this.plantMesh.position.set(this.POZ.x,this.POZ.y,this.POZ.z);
      // this.plantMesh.rotation.set(this.ROTATION.x, this.ROTATION.y, this.ROTATION.z);

      return this.plantMesh
    }

    update() {
      if (store && store.state.desert.sRotation != null) {
        let distRotation = store.state.desert.sRotation.clone().sub(this.plantMesh.children[0].rotation.toVector3());
        let distRotationMatrix = this._createRotationMatrix(distRotation);

        // force to apply at flowerObject
        let rotationForce = distRotation.multiplyScalar(store.state.desert.velStem);

        // update rotation with rotationForce
        this.plantMesh.children[0].rotation.setFromVector3(this.plantMesh.children[0].rotation.toVector3().add(rotationForce));

        this.plantMesh.children[0].children[0].material.uniforms.rotationForceMatrix.value = distRotationMatrix;
        this.flower.update()
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

    getRandomFloat(min, max) {
      return Math.random() * (max - min) + min;
    }
}

export default Plant