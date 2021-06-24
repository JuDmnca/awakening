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
