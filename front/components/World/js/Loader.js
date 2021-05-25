import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'

export default class Loader {
  constructor (props) {
    this.loader = null
    this.props = props
    this.material = this.props.material
    this.loader = new GLTFLoader()
  }

  init (scene) {
    return new Promise((resolve) => {
      const materialImported = this.material
      const position = this.props.position
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderConfig({ type: 'js' })
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
      this.loader.setDRACOLoader(dracoLoader)
      this.loader.load(this.props.model, function (gltf) {
        gltf.scene.position.x = position.x
        gltf.scene.position.y = position.y
        gltf.scene.position.z = position.z
        gltf.scene.scale.set(3, 3, 3)
        const texture = new THREE.TextureLoader().load(materialImported)
        texture.flipY = false
        const material = new THREE.MeshBasicMaterial({
          map: texture
        })
        gltf.scene.children[0].material = material
        gltf.scene.children[38].material = material
        resolve(gltf.scene)
      })
    }, undefined, function (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    })
  }

  initFlowerObject (type) {
    const materialImported = this.material
    let rotation = 0

    const flower = new THREE.Object3D()

    this.loader.load(this.props.model, function (gltf) {
      rotation = rotation + (Math.floor(Math.random() * 360))

      if (type !== 'blue') {
        for (let nbChildren = 0; nbChildren <= (gltf.scene.children.length - 1); nbChildren++) {
          gltf.scene.children[nbChildren].material = materialImported
        }
      } else {
        for (let nbChildren = 0; nbChildren <= (gltf.scene.children[0].children.length - 1); nbChildren++) {
          gltf.scene.children[0].children[nbChildren].material = materialImported
        }
      }

      gltf.scene.rotation.y = rotation

      // Center 3D object
      const box = new THREE.Box3().setFromObject(gltf.scene)
      box.getCenter(gltf.scene.position)

      gltf.scene.position.multiplyScalar(-1)

      // Position flower object on the top of the stem
      switch (type) {
        case 'white':
          gltf.scene.position.set(0, -0.02, 0)
          break
        case 'tulip':
          gltf.scene.scale.set(1.6, 1.6, 1.6)
          gltf.scene.position.set(0, -0.03, 0)
          gltf.scene.rotation.x = 0.3
          break
        case 'blue':
          break
        case 'lavender':
          break
      }

      flower.name = type
      flower.add(gltf.scene)
    }, undefined, function (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    })

    return flower
  }

  initGrass () {
    const grass = new THREE.Object3D()
    this.loader.load(this.props.model, function (gltf) {
      gltf.scene.scale.set(1.6, 1.6, 1.6)
      gltf.scene.position.set(2.5, -1.5, 2)
      grass.add(gltf.scene)
      grass.name = 'grass'
    }, undefined, function (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    })
    return grass
  }
}
