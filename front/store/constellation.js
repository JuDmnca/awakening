// import * as THREE from 'three'

const state = () => ({
  isClicked: false,
  currentUser: {
    id: null,
    name: null,
    smell: null,
    img: null,
    color: null
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
    if (resp === 'Previous' && state.dataUsers[state.currentUser.id - 1]) {
      state.currentUser.name = state.dataUsers[state.currentUser.id - 1].nom
      state.currentUser.smell = state.dataUsers[state.currentUser.id - 1].odeur
      state.currentUser.img = state.dataUsers[state.currentUser.id - 1].img
      state.currentUser.color = state.dataUsers[state.currentUser.id - 1].color
      state.currentUser.id = state.currentUser.id - 1
    } else if (resp === 'Next' && state.dataUsers[state.currentUser.id + 1]) {
      state.currentUser.name = state.dataUsers[state.currentUser.id + 1].nom
      state.currentUser.smell = state.dataUsers[state.currentUser.id + 1].odeur
      state.currentUser.img = state.dataUsers[state.currentUser.id + 1].img
      state.currentUser.color = state.dataUsers[state.currentUser.id + 1].color
      state.currentUser.id = state.currentUser.id + 1
    }
  },
  setCurrentUser (state, resp) {
    state.currentUser.id = resp.id
    state.currentUser.name = resp.datas.nom
    state.currentUser.smell = resp.datas.odeur
    state.currentUser.img = resp.datas.img
    state.currentUser.color = resp.datas.color
  },
  getRandomUser (state) {
    const randomId = Math.floor(Math.random() * state.dataUsers.length)
    const randomProfile = state.dataUsers[randomId]
    state.currentUser.name = randomProfile.nom
    state.currentUser.smell = randomProfile.odeur
    state.currentUser.img = randomProfile.img
    state.currentUser.color = randomProfile.color
    state.currentUser.id = randomProfile.id
  }
}

export default {
  state,
  actions,
  mutations
}
