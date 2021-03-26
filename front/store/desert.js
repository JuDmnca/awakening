import * as THREE from 'three'

const state = () => ({
  counter: 0,
  done: false,
  velSpringiness: 0.1,
  rotation: null
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
    state.rotation = new THREE.Vector3( resp.x, 0, -resp.y )
  }
}

export default {
  state,
  actions,
  mutations
}
