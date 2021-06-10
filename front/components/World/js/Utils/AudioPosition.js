import * as THREE from 'three'

export default class AudioPosition {
  constructor (props) {
    this.sound = null
    this.props = props
    this.url = this.props.url
    this.camera = this.props.camera
    this.init()
  }

  init () {
    console.log('coucou EH OH')
    const listener = new THREE.AudioListener()
    this.camera.add(listener)
    this.sound = new THREE.PositionalAudio(listener)
    const audioLoader = new THREE.AudioLoader()
    audioLoader.load(this.url, (buffer) => {
      this.sound.setBuffer(buffer)
      this.sound.setRefDistance(2)
      this.sound.setLoop(true)
      // this.sound.setVolume(0.2)
      this.sound.setMaxDistance(3)
      this.sound.play()
    })
  }
}
