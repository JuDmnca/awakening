// import * as THREE from 'three'

const state = () => ({
  isClicked: false,
  currentUser: {
    id: null,
    name: null,
    smell: null
  },
  dataUsers: []
})

const actions = {
}

const mutations = {
  setDatas (state, resp) {
    state.dataUsers.push(resp.datas)
  },
  switchUser (state, resp) {
    // TO DO : Requêtes à la bdd avec le current ID +1 ou -1
    if (resp === 'Previous') {
      state.currentUser.name = 'Hatios'
      state.currentUser.smell = 'Le kebab'
    } else if (resp === 'Next') {
      state.currentUser.name = 'Alexia'
      state.currentUser.smell = 'La salade'
    }
  },
  setCurrentUser (state, resp) {
    state.currentUser.nom = resp.nom
    state.currentUser.odeur = resp.odeur
  }
}

export default {
  state,
  actions,
  mutations
}
