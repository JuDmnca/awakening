const state = () => ({
  counter: 0,
  done: false
})

const actions = {
}

const mutations = {
  increaseCounter (state) {
    state.counter++
  },
  updateDone (state, resp) {
    state.done = resp
  }
}

export default {
  state,
  actions,
  mutations
}
