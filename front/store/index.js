const state = () => ({
  loading: 0,
  // PROD : Remove user test for constellation
  user: {
    name: '',
    mic: false,
    color: null,
    colorName: null,
    smell: null,
    sound: null
  },
  colorPalette: null,
  transition: false,
  sceneIndex: 2,
  durationHold: 1.5,
  cameraZoomed: false,
  userIsOkToSendDatas: false,
  subtitle: ''
})

const mutations = {
  setLoading (state, resp) {
    state.loading += resp
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
        hexacode = '#EB2101'
        colorPalette = ['FA9D9C', 'DC0B47', 'E8721F']
        break
      case 'orange':
        hexacode = '#e8721f'
        colorPalette = ['F7D1B6', 'E8721F', 'DC0B47']
        break
      case 'yellow':
        hexacode = '#edc52c'
        colorPalette = ['FAE58D', 'EDC52C', 'E8721F']
        break
      case 'green':
        hexacode = '#7bbd22'
        colorPalette = ['C0EA86', '7BBD21', '0F7B33']
        break
      case 'blue':
        hexacode = '#1281ab'
        colorPalette = ['A3DEF5', '18A4DB', '1F6CAD']
        break
      case 'purple':
        hexacode = '#7b4ea3'
        colorPalette = ['C3ACD7', '7B4EA3', 'DC0B47']
        break
    }
    state.user.color = hexacode
    state.user.colorName = resp
    state.colorPalette = colorPalette
  },
  setUserSmell (state, resp) {
    state.user.smell = resp
  },
  setUserSound (state, resp) {
    state.user.sound = resp
  },
  increaseSceneIndex (state) {
    state.sceneIndex++
  },
  updateCameraZoom (state) {
    state.cameraZoomed = !state.cameraZoomed
  },
  setSubtitle (state, resp) {
    state.subtitle = resp
  }
}

export default {
  state,
  mutations
}
