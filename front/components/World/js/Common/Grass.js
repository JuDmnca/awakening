import { Object3D, Mesh, Vector3, InstancedMesh } from 'three/build/three.module'
import modelGrass from '../../../../assets/models/m_grass.gltf'
import Loader from '../../../Utils/js/Loader'

export default class Grass {
  constructor (params) {
    this.container = params.container
    this.surface = params.surface
    this.count = params.count
    this.scaleFactor = params.scaleFactor
    this.material = params.material ? params.material : params.model.material

    if (process.client) {
      this.surfaceSampler = require('three/examples/jsm/math/MeshSurfaceSampler')
    }

    this.loadGrass()
    setTimeout(() => {
      this.generate()
    }, 5000)
  }

  async loadGrass () {
    const grass = new Loader({ model: modelGrass })
    this.model = await grass.initGrass()
  }

  generate () {
    this.normalizeModel()
    this.createSurface()
    this.generateInstanceMesh()
  }

  normalizeModel () {
    this.model.geometry.computeVertexNormals()
    this.model.geometry.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor)
  }

  createSurface () {
    this.surface.updateMatrixWorld()
    const groundGeometry = this.surface.geometry.toNonIndexed()

    this.groundMesh = new Mesh(groundGeometry, this.material)
  }

  generateInstanceMesh () {
    const dummy = new Object3D()
    this.createMesh()
    this.buildSampler()

    for (let i = 0; i < this.count; i++) {
      this.sampler.sample(this._position, this._normal)
      this._normal.add(this._position)
      dummy.position.copy(this._position)
      dummy.updateMatrix()
      dummy.rotation.y += i
      dummy.position.y += 1
      dummy.scale.set(0.5 + i / 200, 0.5 + i / 200, 0.5 + i / 200)
      this.mesh.setMatrixAt(i, dummy.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true

    this.container.add(this.mesh)
  }

  createMesh () {
    this.mesh = new InstancedMesh(this.model.geometry, this.material, this.count)
    this._position = new Vector3()
    this._normal = new Vector3()
    this.mesh.name = 'Grass'
  }

  buildSampler () {
    this.sampler = new this.surfaceSampler.MeshSurfaceSampler(this.groundMesh).setWeightAttribute()
    this.sampler.build()
  }

  destroy () {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.container.remove(this.mesh)
  }
}
