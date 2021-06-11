import * as THREE from 'three'

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
      this.sound.setRefDistance(1)
      this.sound.setMaxDistance(0.1)
      this.sound.setLoop(true)
      this.sound.setVolume(5)
      this.sound.play()
    })
    mesh.add(this.sound)
  }
}
