import * as THREE from 'three'
import CustomSinCurve from '../../../Utils/js/CustomSinCurve'

import stemVert from '../../../../assets/shaders/plant/stem.vert'
import stemFrag from '../../../../assets/shaders/plant/stem.frag'

import budVert from '../../../../assets/shaders/plant/bud.vert'
import budFrag from '../../../../assets/shaders/plant/bud.frag'
import Flower from './Flower'

let store
if (process.browser) {
  window.onNuxtReady(({ $store }) => {
    store = $store
  })
}
export default class Plant {
  constructor (props) {
    this.props = props

    this.setVariables()
    this.createStem()
    this.createBud()
    this.createMesh()

    this.plantMesh.add(this.plant)
  }

  async init () {
    // Add flower
    this.flower = new Flower()
    const flower = await this.flower.init(this.flowerType, this.flowerModel)
    this.plant.add(flower)

    // Set flower at the top of the stem
    this.plant.children[2].position.set(this.budPosition.x, this.budPosition.y, this.budPosition.z)

    this.plantMesh.position.set(this.POZ.x, this.POZ.y, this.POZ.z)
    // this.plantMesh.rotation.set(this.ROTATION.x, this.ROTATION.y, this.ROTATION.z);

    return this.plantMesh
  }

  setVariables () {
    // Get random position & rotation to randomize plants
    this.POZ = new THREE.Vector3(this.getRandomFloat(-2, 2), 0.02, this.getRandomFloat(-2, 2))
    this.ROTATION = new THREE.Vector3(-this.getRandomFloat(0.5, 1), 0.5 - (this.props.orientation / 2), 0)

    // Curve variables
    this.segments = 32
    this.radiusSegment = 100
    this.size = 0.01
    this.length = this.getRandomFloat(0.3, 0.6)

    // Flower Type
    this.flowerType = this.props.flowerType
    this.flowerModel = this.props.model
    this.flower = null
    this.toInitial = false

    this.events = false
    this.moving = 0
  }

  createStem () {
    // Set small curve for small flowers
    if (this.flowerType === 'blue') {
      this.length = 0.1
    }
    this.curve = new CustomSinCurve({ length: this.length })
    this.stemGeometry = new THREE.TubeGeometry(this.curve, this.segments, this.size, this.radiusSegment)

    this.stemShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        rotationForceMatrix: { type: 'm4', value: new THREE.Matrix4() }
      },
      vertexShader: stemVert,
      fragmentShader: stemFrag
    })

    this.stemMesh = new THREE.Mesh(this.stemGeometry, this.stemShaderMaterial)
    this.stemMesh.name = 'stem'
  }

  createBud () {
    // Get last point of the curve to position bud
    this.budPosition = this.curve.getPoints()[this.curve.getPoints().length - 1]

    this.budGeometry = new THREE.SphereGeometry(this.size * 2, this.radiusSegment, this.segment)
    this.budShaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        rotationForceMatrix: { type: 'm4', value: new THREE.Matrix4() }
      },
      vertexShader: budVert,
      fragmentShader: budFrag
    })

    this.budMesh = new THREE.Mesh(this.budGeometry, this.budShaderMaterial)
    this.budMesh.position.set(this.budPosition.x, this.budPosition.y, this.budPosition.z)
  }

  createMesh () {
    // Create Plant Object3D (which contains stem, bud & flower)
    this.plantMesh = new THREE.Object3D()

    // Create Plant Stem (which contains stem & bud)
    this.plant = new THREE.Group()
    this.plant.add(this.stemMesh)
    this.plant.add(this.budMesh)
  }

  updateColor () {
    if (this.flower.flowerObject.name === 'tulip') {
      this.flower.updateColor()
    }
  }

  // Update plant rotation according to mouse position
  update () {
    if (store && store.state.desert.sRotation != null && store.state.desert.haveClickedOnFlower) {
      const distRotation = store.state.desert.sRotation.clone().sub(this.plantMesh.children[0].rotation.toVector3())
      const distRotationMatrix = this.createRotationMatrix(distRotation)

      // Force to apply at flowerObject
      const rotationForce = distRotation.multiplyScalar(store.state.desert.velStem)

      // Update rotation with rotationForce
      this.plantMesh.children[0].rotation.setFromVector3(this.plantMesh.children[0].rotation.toVector3().add(rotationForce))
      this.plantMesh.children[0].children[0].material.uniforms.rotationForceMatrix.value = distRotationMatrix

      // Update flower petals
      if (this.flower) {
        this.flower.update()
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

  getRandomFloat (min, max) {
    return Math.random() * (max - min) + min
  }
}
