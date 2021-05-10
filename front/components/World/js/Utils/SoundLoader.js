import * as THREE from 'three'


export default class SoundLoader {
    constructor(props) {
        this.props = props
        this.camera = this.props.camera
        this.audioFile = this.props.audioFile
        this.sound, this.listener, this.audioLoader
        this.init()
    }

    init() {
        this.listener = new THREE.AudioListener();
        this.camera.camera.add( this.listener );
        
        this.audioLoader = new THREE.AudioLoader()

        this.sound = new THREE.PositionalAudio( this.listener );
        // const sound = this.sound
        this.audioLoader.load( this.audioFile.default, ( buffer ) => {
            this.sound.setBuffer( buffer );
            this.sound.setRefDistance( 20 );
            // sound.play();
        } );

        const SoundControls = function () {

            this.master = listener.getMasterVolume();
            this.firstSphere = sound1.getVolume();
            this.secondSphere = sound2.getVolume();
            this.thirdSphere = sound3.getVolume();
            this.Ambient = sound4.getVolume();

        };
    }
}