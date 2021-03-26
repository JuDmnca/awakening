import * as THREE from 'three'

const state = () => ({
  counter: 0,
  done: false,
  rotation: new THREE.Vector3( 0, 0, 0 )
})

const actions = {
}

const mutations = {
  increaseCounter (state) {
    state.counter++
  },
  updateDone (state, resp) {
    state.done = resp
  },
  updateRotation (state, resp) {
    state.rotation.x = resp.x
    state.rotation.y = resp.y
  }
}

export default {
  state,
  actions,
  mutations
}
