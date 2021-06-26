const state = () => ({
  interaction: false,
  step: 0
})

const mutations = {
  toggleInteraction (state) {
    state.interaction = !state.interaction
  },
  increaseStep (state) {
    state.step += 1
  }
}

export default {
  state,
  mutations
}
