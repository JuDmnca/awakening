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
  toggleClick(state, resp) {
    state.isClicked = !state.isClicked
    state.dataUsers.name = resp.name
    state.dataUsers.smell = resp.smell
  }
}

export default {
  state,
  actions,
  mutations
}
