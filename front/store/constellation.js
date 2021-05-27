// import * as THREE from 'three'

const state = () => ({
  isClicked: false,
  dataUsers: {
    id: null,
    name: '',
    smell: ''
  }
})

const actions = {
}

const mutations = {
  getDatas (state, resp) {
    state.dataUsers.name = resp.name
    state.dataUsers.smell = resp.smell
  },
  switchUser (state, resp) {
    // TO DO : Requêtes à la bdd avec le current ID +1 ou -1
    if (resp === 'Previous') {
      state.dataUsers.name = 'Hatios'
      state.dataUsers.smell = 'Le kebab'
    } else if (resp === 'Next') {
      state.dataUsers.name = 'Alexia'
      state.dataUsers.smell = 'La salade'
    }
  }
}

export default {
  state,
  actions,
  mutations
}
