const state = () => ({
  user: {
    id: '',
    name: '',
    mic: false,
    color: '',
    smell: '',
    taste: '',
    sound: ''
  },
  worldRotation: null,
  sceneIndex: 1,
  durationHold: 1.5,
  cameraZoomed: false,
  userIsOkToSendDatas: false
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
  setUserMic (state, resp) {
    state.user.mic = resp
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
  },
  updateWorldRotation (state, resp) {
    state.worldRotation = resp
  },
  increaseSceneIndex (state) {
    state.sceneIndex++
<<<<<<< HEAD
  },
  updateCameraZoom (state) {
    state.cameraZoomed = !state.cameraZoomed
=======
>>>>>>> ff4b867547e20ee37e09da4fae23dd02f66454ab
  }
}

export default {
  state,
  actions,
  mutations
}
