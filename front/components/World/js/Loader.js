import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'
class Loader {
    constructor(props) {
        this.loader = null
        this.props = props
    }

    init(scene) {
        this.loader = new GLTFLoader()
        const textureImported = this.props.texture

        this.loader.load( this.props.model, function ( gltf ) {

            gltf.scene.position.x = 0
            gltf.scene.position.y = 0
            gltf.scene.position.z = 0
            
            if(textureImported){
                const texture = new THREE.TextureLoader().load( textureImported );

                // immediately use the texture for material creation
                const material = new THREE.MeshPhongMaterial( { map: texture } );
                gltf.scene.children[4].material = material
            }

            scene.add( gltf.scene );

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }
}

export default Loader