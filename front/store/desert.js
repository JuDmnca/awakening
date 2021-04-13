import * as THREE from 'three'

const state = () => ({
  counter: 0,
  done: false,
  velSpringiness: 0.1,
  velStem: 0.07,
  fRotation: null,
  sRotation: null
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
  updateFRotation (state, resp) {
    state.fRotation = new THREE.Vector3( resp.x, 0, -resp.z )
  },
  updateSRotation (state, resp) {
    state.sRotation = new THREE.Vector3( resp.x, 0, -resp.z )
  }
}

export default {
  state,
  actions,
  mutations
}
