const state = () => ({
  user: {
    id: '',
    name: '',
    color: '',
    smell: '',
    taste: '',
    sound: ''
  }
})

const actions = {
}

const mutations = {
  setUserId (state, resp) {
    state.user.id = resp
  },
  setUserName (state, resp) {
    state.user.name = resp
  },
  setUserColor (state, resp) {
    state.user.color = resp
  },
  setUserSmell (state, resp) {
    state.user.smell = resp
  },
  setUserTaste (state, resp) {
    state.user.taste = resp
  },
  setUserSound (state, resp) {
    state.user.sound = resp
  }
}

export default {
  state,
  actions,
  mutations
}
