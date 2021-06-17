import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as THREE from 'three'

let store
if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}
export default class Loader {
  constructor (props) {
    this.loader = null
    this.props = props
    this.loader = new GLTFLoader()
    this.init()
  }

  init () {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderConfig({ type: 'js' })
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
    this.loader.setDRACOLoader(dracoLoader)
  }

  defaultInit (index) {
    const promise = new Promise((resolve) => {
      const position = this.props.position
      const materialImported = this.props.material[index]

      this.loader.load(
        this.props.models[index],
        function (gltf) {
          gltf.scene.position.x = position.x
          gltf.scene.position.y = position.y
          gltf.scene.position.z = position.z

          const materials = []
          if (materialImported) {
            for (let i = 0; i < materialImported.length; i++) {
              const texture = new THREE.TextureLoader().load(materialImported[i])
              texture.flipY = false
              materials[i] = new THREE.MeshBasicMaterial({
                map: texture
              })
            }
          }

          if (gltf.scene.children[0].name === 'Desert') {
            gltf.scene.children[0].children[0].material = materials[0]
            gltf.scene.children[0].children[1].material = materials[0]
          }
          resolve(gltf.scene)
        }
      )
    }, undefined, function (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    })
    promise.then(function () {
      store.commit('setLoading', 100)
    })
    return promise
  }

  initGems () {
    return new Promise((resolve) => {
      const position = this.props.position
      const materialImported = this.props.material

      this.loader.load(
        this.props.model,
        function (gltf) {
          gltf.scene.position.x = position.x
          gltf.scene.position.y = position.y
          gltf.scene.position.z = position.z
          gltf.scene.scale.set(3, 3, 3)

          const mesh = new THREE.Mesh(gltf.scene.children[0].geometry, materialImported)
          resolve(mesh)
        },
        function (xhr) {
        })
    }, undefined, function (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    })
  }

  initFlowerObject (type) {
    const promise = new Promise((resolve) => {
      let rotation = 0

      const flower = new THREE.Object3D()

      this.loader.load(
        this.props.model,
        function (gltf) {
          rotation = rotation + (Math.floor(Math.random() * 360))

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
              break
          }

          flower.name = type
          flower.add(gltf.scene)
          resolve(flower)
        })
    }, undefined, function (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    })
    promise.then(function () {
      store.commit('setLoading', 100)
    })
    return promise
  }

  initGrass () {
    const promise = new Promise((resolve) => {
      this.loader.load(
        this.props.model,
        function (gltf) {
          resolve(gltf.scene.children[0])
        })
    }, undefined, function (error) {
    // eslint-disable-next-line no-console
      console.error(error)
    })
    promise.then(function () {
      store.commit('setLoading', 100)
    })
    return promise
  }
}
