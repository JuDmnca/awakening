let nuxt
if (process.browser) {
  window.onNuxtReady(({$nuxt}) => {
    nuxt = $nuxt
  })
}
export default class Scroll {
  constructor(props) {
    this.delta = 0
    this.document = props.document

    this.document.addEventListener('wheel', (event) => {
      this.wheelMove(event)
    })
  }

  wheelMove(event) {
    this.delta = this.delta + event.deltaY
    if (nuxt) {
      nuxt.$emit('wheelMove', {event: event, value: true})
    }
    setTimeout(() => {
      this.stop()
    }, 300);
  }

  stop() {
    if (nuxt) {
      nuxt.$emit('wheelMove', false)
    }
  }

  getDelta() {
    const delta = 0 + this.delta
    this.delta = 0
    return delta
  }
}