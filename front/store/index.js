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
  colorPalette: null,
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
    let colorPalette = []
    switch (resp) {
      case 'red':
        hexacode = '#dc0c47'
        colorPalette = ['FBB1C6', 'DC0B47', 'E8721F', '7B4EA3']
        break
      case 'orange':
        hexacode = '#e8721f'
        colorPalette = ['F7D1B6', 'E8721F', 'DC0B47', 'EDC52C']
        break
      case 'yellow':
        hexacode = '#edc52c'
        colorPalette = ['F7E6A1', 'EDC52C', 'E8721F', '7BBD21']
        break
      case 'green':
        hexacode = '#7bbd22'
        colorPalette = ['C0EA86', '7BBD21', '0F7B33', '18A4DB']
        break
      case 'darkgreen':
        hexacode = '#0e7b33'
        colorPalette = ['1EB651', '0F7B33', '18A4DB', '0F7B33']
        break
      case 'blue':
        hexacode = '#1281ab'
        colorPalette = ['A3DEF5', '18A4DB', '1F6CAD', '7B4EA3']
        break
      case 'darkblue':
        hexacode = '#1f6cad'
        colorPalette = ['63AAE3', '1F6CAD', '7B4EA3', '18A4DB']
        break
      case 'purple':
        hexacode = '#7b4ea3'
        colorPalette = ['C3ACD7', '7B4EA3', 'DC0B47', '7B4EA3']
        break
    }
    state.user.color = hexacode
    state.colorPalette = colorPalette
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
