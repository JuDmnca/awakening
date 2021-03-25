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

        const position = this.props.position

        const scaleY = this.props.scaleY

        this.loader.load( this.props.model, function ( gltf ) {

            gltf.scene.position.x = position.x
            gltf.scene.position.y = position.y
            gltf.scene.position.z = position.z

            if(scaleY) {
                gltf.scene.scale.y = scaleY
            }
            
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