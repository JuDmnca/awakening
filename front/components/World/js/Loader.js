import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'
import perlinNoise3d from 'perlin-noise-3d'

class Loader {
    constructor(props) {
        this.loader = null
        this.props = props
        this.material = this.props.material
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
                if (textureImported.includes('sand')) {
                    gltf.scene.children[4].material = material
                    // gltf.scene.children[0].material = material
                    // gltf.scene.children[0].scale.set(3,3,3)
                }
                scene.add( gltf.scene );
            }

        }, undefined, function ( error ) {

            console.error( error );

        } );
    }

    initFlowerObject () {
        this.loader = new GLTFLoader()
        const materialImported = this.material
        let rotation = 0

        const object = new THREE.Object3D()

        this.loader.load( this.props.model, function ( gltf ) {
            rotation = rotation + (Math.floor(Math.random() * 360))

            for(let nbChildren = 0; nbChildren <= (gltf.scene.children.length - 2) ; nbChildren++) {
                gltf.scene.children[nbChildren].material = materialImported
            }
            gltf.scene.rotation.y = rotation
            const box = new THREE.Box3().setFromObject( gltf.scene );
            box.getCenter( gltf.scene.position );
            gltf.scene.position.multiplyScalar( - 1 );
            gltf.scene.scale.set(1.6,1.6,1.6);
            gltf.scene.position.y = -0.49 * 1.6;
            gltf.scene.position.z = -0.1;
            gltf.scene.rotation.x = 0.1;

            object.add(gltf.scene)

        }, undefined, function ( error ) {

            console.error( error )

        } )

        return object
    }
}

export default Loader