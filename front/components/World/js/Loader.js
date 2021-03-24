import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'
const sand = require("../../../assets/textures/sand.png")
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

            //  À REMOVE : TEST TEXTURES
            if (gltf.scene.name === 'Scene') {
                const texture = new THREE.TextureLoader().load( sand );

                // immediately use the texture for material creation
                const material = new THREE.MeshBasicMaterial( { map: texture } );
                gltf.scene.children[4].material = material
            }

            scene.add( gltf.scene );

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }
}

export default Loader