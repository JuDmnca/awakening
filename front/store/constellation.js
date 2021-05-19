import * as THREE from 'three'

const state = () => ({
  isClicked: false,
  dataUsers: {
      name: '',
      smell: ''
  }
})

const actions = {
}

const mutations = {
  toggleVisible(state) {
    state.isClicked = !state.isClicked
  },
  getDatas(state, resp) {
    state.dataUsers.name = resp.name
    state.dataUsers.smell = resp.smell
  }
}

export default {
  state,
  actions,
  mutations
}
