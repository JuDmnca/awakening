const state = () => ({
  userId: '',
  userName: '',
  userColor: ''
})

const actions = {
}

const mutations = {
  setUserId (state, resp) {
    state.userId = resp
  },
  setUserName (state, resp) {
    state.userName = resp
  },
  setUserColor (state, resp) {
    state.userColor = resp
  }
}

export default {
  state,
  actions,
  mutations
}
