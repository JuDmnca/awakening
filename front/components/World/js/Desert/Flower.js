import * as THREE from 'three'

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

  init (flowerType, flowerModel) {
    let flowerFrag = null

    switch (flowerType) {
      case 'white':
        flowerFrag = require('../../../../assets/textures/t_white.png')
        break
      case 'tulip':
        flowerFrag = require('../../../../assets/textures/t_tulip_red.jpg')
        break
      case 'blue':
        flowerFrag = require('../../../../assets/textures/t_blue.png')
        break
    }

    // Petal texture
    const flowerTexture = new THREE.TextureLoader().load(flowerFrag)
    const flowerShaderMaterial = this.toMaterial(flowerTexture)

    this.flowerObject = flowerModel
    if (flowerType !== 'blue') {
      this.applyMaterial(flowerShaderMaterial)
    } else {
      for (let nbChildren = 0; nbChildren <= (this.flowerObject.children[0].children[0].children.length - 1); nbChildren++) {
        this.flowerObject.children[0].children[0].children[nbChildren].material = flowerShaderMaterial
      }
    }

    return this.flowerObject
  }

  updateColor () {
    const flowerFrag = require(`../../../../assets/textures/t_tulip_${store.state.user.colorName}.jpg`)
    const flowerTexture = new THREE.TextureLoader().load(flowerFrag)
    const flowerShaderMaterial = this.toMaterial(flowerTexture)

    this.applyMaterial(flowerShaderMaterial)
  }

  // Create a material from a texture
  toMaterial (flowerTexture) {
    const flowerVert = require('../../../../assets/textures/t_petal_s.jpg')
    const flowerSpringiness = new THREE.TextureLoader().load(flowerVert)

    return new THREE.ShaderMaterial({
      uniforms: {
        petalMap: { type: 't', value: flowerTexture },
        springinessMap: { type: 't', value: flowerSpringiness },
        rotationForceMatrix: { type: 'm4', value: new THREE.Matrix4() }
      },
      vertexShader: petalVert,
      fragmentShader: petalFrag,
      side: THREE.DoubleSide
    })
  }

  applyMaterial (material) {
    for (let nbChildren = 0; nbChildren <= (this.flowerObject.children[0].children.length - 1); nbChildren++) {
      this.flowerObject.children[0].children[nbChildren].material = material
    }
  }

  // Update flower rotation according to mouse position
  update () {
    if (store && store.state.desert.fRotation != null) {
      // Calculate force & orientation
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

  // Method to apply function to petal childs
  traversePetalsChilds (fct) {
    this.flowerObject.children[0].traverse((c) => {
      if (c instanceof THREE.Mesh) {
        fct(c)
      }
    })
  }
}
