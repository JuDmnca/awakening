import * as THREE from 'three'

let nuxt
if (process.browser) {
  window.onNuxtReady(({ $nuxt }) => {
    nuxt = $nuxt
  })
}

export default class SoundLoader {
  constructor (props) {
    this.props = props
    this.camera = this.props.camera
    this.audioFile = this.props.audioFile
    this.sound = this.listener = this.audioLoader = null
    this.init()
  }

  init () {
    this.listener = new THREE.AudioListener()
    this.camera.camera.add(this.listener)

    this.audioLoader = new THREE.AudioLoader()

    this.sound = new THREE.Audio(this.listener)
    this.audioLoader.load(this.audioFile.default, (buffer) => {
      this.sound.setBuffer(buffer)
      this.sound.setLoop(true)
      this.sound.setVolume(0.5)
      this.sound.play()
      nuxt.$on('toggleMute', (e) => {
        this.sound.isPlaying ? this.sound.pause() : this.sound.play()
      })
    })
  }
}
