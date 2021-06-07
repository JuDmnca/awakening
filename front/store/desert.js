import * as THREE from 'three'

const state = () => ({
  counter: 0,
  done: false,
  velSpringiness: 0.1,
  velStem: 0.07,
  initialRotation: null,
  fRotation: null,
  sRotation: null,
  isMuted: false,
  interaction: false
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
  updateInitialRotation (state) {
    state.initialRotation = new THREE.Vector3(0, 0, 0)
  },
  updateFRotation (state, resp) {
    state.fRotation = new THREE.Vector3(-resp.x, 0, resp.z)
    if (resp.euler !== undefined) {
      state.fRotation = state.fRotation.applyEuler(resp.euler)
    }
  },
  updateSRotation (state, resp) {
    state.sRotation = new THREE.Vector3(-resp.x, 0, resp.z)
    if (resp.euler !== undefined) {
      state.sRotation = state.sRotation.applyEuler(resp.euler)
    }
  },
  toggleMute (state) {
    state.isMuted = !state.isMuted
  },
  toggleInteraction (state) {
    state.interaction = !state.interaction
  }
}

export default {
  state,
  actions,
  mutations
}
