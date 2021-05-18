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

        const materialImported = this.material
        const position = this.props.position
        const index = this.props.index

        this.loader.load( this.props.model, function ( gltf ) {
            gltf.scene.position.x = position.x
            gltf.scene.position.y = position.y
            gltf.scene.position.z = position.z
            gltf.scene.scale.set(3,3,3)

            const texture = new THREE.TextureLoader().load( materialImported )
            const material = new THREE.MeshBasicMaterial ({
                map: texture,
            })
            gltf.scene.children[6].material = material

            scene.add( gltf.scene )

        }, undefined, function ( error ) {
            console.error( error )
        })
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
                case 'tulip':
                    gltf.scene.position.multiplyScalar(-1)
                    gltf.scene.scale.set(1.6,1.6,1.6)
                    gltf.scene.position.set(0,-0.03,0)
                    gltf.scene.rotation.x = 0.3;
                  break;
                case 'daisy':
                    gltf.scene.position.multiplyScalar(-1)
                    gltf.scene.scale.set(1.6,1.6,1.6)
                    gltf.scene.rotation.x = 0.3;
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