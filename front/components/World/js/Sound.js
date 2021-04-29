import * as THREE from 'three'


export default class Sound {
    constructor(props) {
        this.props = props
        this.camera = this.props.camera
        this.sound, this.listener, this.audioLoader
        this.init()
    }

    init() {
        const audioFile = require("../../../assets/sounds/wind.ogg")
        this.listener = new THREE.AudioListener();
        console.log(audioFile)
        this.camera.camera.add( this.listener );
        
        this.audioLoader = new THREE.AudioLoader()

        this.sound = new THREE.PositionalAudio( this.listener );
        const sound = this.sound
        this.audioLoader.load( audioFile.default, function ( buffer ) {
            sound.setBuffer( buffer );
            sound.setRefDistance( 20 );
            sound.play();

        } );
    }
}