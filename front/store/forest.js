const state = () => ({
  interaction: false
})

const mutations = {
  toggleInteraction (state) {
    state.interaction = !state.interaction
  }
}

export default {
  state,
  mutations
}
