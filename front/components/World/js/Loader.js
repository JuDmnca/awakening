import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Loader {
    constructor(props) {
        this.loader = null
        this.props = props
    }

    init(scene) {
        this.loader = new GLTFLoader()

        this.loader.load( this.props.model, function ( gltf ) {

            gltf.scene.position.x = 0
            gltf.scene.position.y = 0
            gltf.scene.position.z = 0

            scene.add( gltf.scene );

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }
}

export default Loader