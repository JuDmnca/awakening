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
    let hexacode = ''
    switch (resp) {
      case 'red':
        hexacode = '0xdc0c47'
        break
      case 'orange':
        hexacode = '0xe8721f'
        break
      case 'yellow':
        hexacode = '0xedc52c'
        break
      case 'green':
        hexacode = '0x7bbd22'
        break
      case 'darkgreen':
        hexacode = '0x0e7b33'
        break
      case 'blue':
        hexacode = '0x1281ab'
        break
      case 'darkblue':
        hexacode = '0x1f6cad'
        break
      case 'purple':
        hexacode = '0x7b4ea3'
        break
    }
    state.user.color = hexacode
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
  },
  updateCameraZoom (state) {
    state.cameraZoomed = !state.cameraZoomed
  }
}

export default {
  state,
  actions,
  mutations
}
