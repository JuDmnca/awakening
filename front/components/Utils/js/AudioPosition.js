import * as THREE from 'three'

let nuxt
if (process.browser) {
  window.onNuxtReady(({ $nuxt }) => {
    nuxt = $nuxt
  })
}

export default class AudioPosition {
  constructor (props) {
    this.sound = null
    this.props = props
    this.url = this.props.url
    this.camera = this.props.camera
    this.init(this.props.mesh)
  }

  init (mesh) {
    const listener = new THREE.AudioListener()
    this.camera.add(listener)
    this.sound = new THREE.PositionalAudio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load(this.url, (buffer) => {
      this.sound.setBuffer(buffer)
      this.sound.setRefDistance(0.1)
      this.sound.setMaxDistance(0.1)
      this.sound.setLoop(this.props.loop)
      this.sound.setVolume(this.props.volume)
      nuxt.$on('mute', () => {
        this.sound.setVolume(0)
        console.log('muteeee')
      })
      nuxt.$on('unMute', () => {
        this.sound.setVolume(this.props.volume)
      })
    })
    mesh.add(this.sound)
  }
}