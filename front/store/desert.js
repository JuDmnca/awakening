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
  haveClickedOnFlower: false,
  // PROD : SET TO FALSE
  canInhaleOnHold: false
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
  },
  updateSRotation (state, resp) {
    state.sRotation = new THREE.Vector3(-resp.x, 0, resp.z)
  },
  setHaveClickedOnFlowers (state) {
    state.haveClickedOnFlower = true
  },
  setCanInhaleOnHold (state, resp) {
    state.canInhaleOnHold = resp
  }
}

export default {
  state,
  actions,
  mutations
}
