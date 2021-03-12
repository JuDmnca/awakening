import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import model from '../../../assets/models/desert_scaled.gltf'
class Desert {
    constructor() {
        this.loader = null
    }

    init(scene) {
        this.loader = new GLTFLoader()

        this.loader.load( model, function ( gltf ) {

            gltf.scene.position.x = -79
            gltf.scene.position.y = 11
            gltf.scene.position.z = 20

            scene.add( gltf.scene );

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }
}

export default Desert