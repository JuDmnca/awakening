import * as THREE from 'three'
import Loader from '../Loader'
import modelTulip from '../../../../assets/models/m_tulip.gltf'
import modelwhite from '../../../../assets/models/m_white_flower.glb'
import modelblue from '../../../../assets/models/m_blue_flower.gltf'

import petalVert from '../../../../assets/shaders/flower/flower.vert'
import petalFrag from '../../../../assets/shaders/flower/flower.frag'

let store
if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}
export default class Flower {
  constructor (props) {
    this.props = props
    this.flowerObject = null
    this.ready = false

    this.count = 0
  }

  init (flowerType) {
    let modelFlower = null
    let flowerFrag = null
    let flowerVert = null

    switch (flowerType) {
      case 'white':
        modelFlower = modelwhite
        flowerFrag = require('../../../../assets/textures/t_white.png')
        flowerVert = require('../../../../assets/textures/t_petal_s.jpg')
        break
      case 'tulip':
        modelFlower = modelTulip
        flowerFrag = require('../../../../assets/textures/t_tulip.jpg')
        flowerVert = require('../../../../assets/textures/t_petal_s.jpg')
        break
      case 'blue':
        modelFlower = modelblue
        flowerFrag = require('../../../../assets/textures/t_blue.png')
        flowerVert = require('../../../../assets/textures/t_petal_s.jpg')
        break
    }

    // Petal texture
    const flowerTexture = new THREE.TextureLoader().load(flowerFrag)
    // Petal springiness texture
    const flowerSpringiness = new THREE.TextureLoader().load(flowerVert)

    const flowerShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        petalMap: { type: 't', value: flowerTexture },
        springinessMap: { type: 't', value: flowerSpringiness },
        rotationForceMatrix: { type: 'm4', value: new THREE.Matrix4() }
      },
      vertexShader: petalVert,
      fragmentShader: petalFrag,
      side: THREE.DoubleSide
    })

    this.flowerObject = new Loader({ model: modelFlower, material: flowerShaderMaterial })
    this.flowerObject = this.flowerObject.initFlowerObject(flowerType)

    return this.flowerObject
  }

  update () {
    if (store && store.state.desert.fRotation != null) {
      const distRotation = store.state.desert.fRotation.clone().sub(this.flowerObject.rotation.toVector3())
      const distRotationMatrix = this.createRotationMatrix(distRotation)

      // Apply force to flowerObject
      const rotationForce = distRotation.multiplyScalar(store.state.desert.velSpringiness)
      this.flowerObject.rotation.setFromVector3(this.flowerObject.rotation.toVector3().add(rotationForce))

      if (this.flowerObject.children[0]) {
        this.traversePetalsChilds((child) => {
          // Update uniforms to shaders petals
          if (child.material instanceof THREE.ShaderMaterial) {
            child.material.uniforms.rotationForceMatrix.value = distRotationMatrix
          }
        })
      }
    }
  }

  createRotationMatrix (vectRotation) {
    const m = new THREE.Matrix4()
    const m1 = new THREE.Matrix4()
    const m2 = new THREE.Matrix4()
    const m3 = new THREE.Matrix4()

    m1.makeRotationX(-vectRotation.x)
    m2.makeRotationY(-vectRotation.y)
    m3.makeRotationY(-vectRotation.z)

    m.multiplyMatrices(m1, m2)
    m.multiply(m3)

    return m
  }

  traversePetalsChilds (fct) {
    this.flowerObject.children[0].traverse((c) => {
      if (c instanceof THREE.Mesh) {
        fct(c)
      }
    })
  }
}
