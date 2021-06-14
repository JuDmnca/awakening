import { Object3D, Mesh, Vector3, InstancedMesh } from 'three/build/three.module'
import modelGrass from '../../../../assets/models/m_grass.glb'
import Loader from '../Loader'

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
    this.model.geometry.computeVertexNormals()
    this.model.geometry.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor)

    this.surface.updateMatrixWorld()
    const groundGeometry = this.surface.geometry.toNonIndexed()

    const groundMesh = new Mesh(groundGeometry, this.material)
    const dummy = new Object3D()
    const sampler = new this.surfaceSampler.MeshSurfaceSampler(groundMesh).setWeightAttribute()
    this.mesh = new InstancedMesh(this.model.geometry, this.material, this.count)
    const _position = new Vector3()
    const _normal = new Vector3()
    this.mesh.name = 'Grass'
    sampler.build()

    for (let i = 0; i < this.count; i++) {
      sampler.sample(_position, _normal)
      _normal.add(_position)
      dummy.position.copy(_position)
      // dummy.lookAt(_normal)
      dummy.updateMatrix()
      dummy.rotation.y += i
      dummy.scale.set(0.5 + i / 200, 0.5 + i / 200, 0.5 + i / 200)
      this.mesh.setMatrixAt(i, dummy.matrix)
    }
    this.mesh.instanceMatrix.needsUpdate = true

    this.container.add(this.mesh)
  }

  destroy () {
    this.mesh.geometry.dispose()
    this.mesh.material.dispose()
    this.container.remove(this.mesh)
  }
}
