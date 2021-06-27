/* eslint-disable no-console */
// let nuxt
// if (process.browser) {
//   window.onNuxtReady(({ $nuxt }) => {
//     nuxt = $nuxt
//   })
// }

export default class Microphone {
  constructor () {
    this.isAgrees = false
    this.audioCtx = null
    this.analyzer = null
    this.dataArray = null
    this.volumeMeter = null
    this.gainNode = null
    this.volume = null
  }

  init () {
    // nuxt.$on('started', () => {
    //   console.log('wesh')
    //   this.getAutorisation()
    // })
  }

  getAutorisation () {
    const chunks = []
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia(
        // constraints - only audio needed for this app
        {
          audio: true
        })

      // Success callback
        .then(stream => this.onSuccess(stream, chunks))

      // Error callback
        .catch(function (err) {
          console.log('The following getUserMedia error occurred: ' + err)
        }
        )
    } else {
      console.log('getUserMedia not supported on your browser!')
    }
  }

  onSuccess (stream, chunks) {
    // const mediaRecorder = new MediaRecorder(stream)

    this.analyze(stream)

    // nuxt.$on('startRecord', () => {
    //   mediaRecorder.start()
    //   console.log(mediaRecorder.state)
    //   console.log('recorder started')
    // })

    // nuxt.$on('stopRecord', () => {
    //   mediaRecorder.stop()
    //   console.log(mediaRecorder.state)
    //   console.log('recorder stopped')
    // })

    // mediaRecorder.onstop = (e) => {
    //   console.log('data available after MediaRecorder.stop() called.')
    // }

    // mediaRecorder.ondataavailable = (e) => {
    //   chunks.push(e.data)
    // }
  }

  analyze (stream) {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext()
      // this.gainNode = this.audioCtx.createGain()
    }
    const source = this.audioCtx.createMediaStreamSource(stream)

    this.analyzer = this.audioCtx.createAnalyser()
    this.analyzer.fftSize = 2048
    const bufferLength = this.analyzer.frequencyBinCount
    this.dataArray = new Uint8Array(bufferLength)

    source.connect(this.analyzer)
    source.connect(this.gainNode)
    // this.gainNode.connect(this.audioCtx.destination)
  }

  listen () {
    this.analyzer.getByteTimeDomainData(this.dataArray)

    let somme = 0
    for (let i = 0; i <= 300; i++) {
      somme += this.dataArray[i]
    }
    const moyenne = somme / 300
    return moyenne
  }
}
