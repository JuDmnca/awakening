import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'

export default class Loader {
    constructor(props) {
        this.loader = null
        this.props = props
        this.material = this.props.material
    }

    init(scene) {
        this.loader = new GLTFLoader()

        const position = this.props.position

        const object = new THREE.Object3D()

        this.loader.load( this.props.model, function ( gltf ) {
            gltf.scene.position.x = position.x
            gltf.scene.position.y = position.y
            gltf.scene.position.z = position.z
            gltf.scene.scale.set(3,3,3)

            scene.add( gltf.scene );

        }, undefined, function ( error ) {
            console.error( error );
        });
    }

    initFlowerObject (type) {
        this.loader = new GLTFLoader()
        const materialImported = this.material
        let rotation = 0

        const object = new THREE.Object3D()

        this.loader.load( this.props.model, function ( gltf ) {
            rotation = rotation + (Math.floor(Math.random() * 360))

            for(let nbChildren = 0; nbChildren <= (gltf.scene.children.length - 1) ; nbChildren++) {
                gltf.scene.children[nbChildren].material = materialImported
            }

            gltf.scene.rotation.y = rotation
            gltf.scene.rotation.x = 0.1;

            // Center 3D object
            const box = new THREE.Box3().setFromObject( gltf.scene );
            box.getCenter( gltf.scene.position );

            // Position flower object on the top of the stem
            switch (type) {
                case 'lavender':
                    gltf.scene.position.multiplyScalar(-1)
                    gltf.scene.scale.set(2,2,2)
                    gltf.scene.position.y = -0.6
                    gltf.scene.rotation.y = 0
                    gltf.scene.rotation.x = 0
                    gltf.scene.children[0].position.set(0,0,-0.19)
                    gltf.scene.children[1].position.set(0,0.1,-0.14)
                    gltf.scene.children[2].position.set(0,0.14,-0.13)
                    gltf.scene.children[3].position.set(0,0.2,-0.08)
                    gltf.scene.children[4].position.set(0,0.24,-0.04)
                    gltf.scene.children[5].position.set(0,0.3,0.01)
                  break;
                case 'orchid':
                    gltf.scene.position.multiplyScalar(-1)
                    gltf.scene.scale.set(1.6,1.6,1.6)
                    gltf.scene.position.y = -0.5 * 1.6
                    gltf.scene.position.z = -0.09
                  break;
                case 'daisy':
                    gltf.scene.position.multiplyScalar(-1)
                    gltf.scene.scale.set(1.6,1.6,1.6)
                  break;
            }

            object.name = type
            object.add(gltf.scene)

        }, undefined, function ( error ) {
            console.error( error )
        })

        return object
    }
}