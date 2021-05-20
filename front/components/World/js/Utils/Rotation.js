let store
let nuxt
if (process.browser) {
  window.onNuxtReady(({ $nuxt, $store }) => {
    nuxt = $nuxt
    store = $store
  })
}
class RotationControl {
  constructor () {
    this.ratio = 10

    let timer
    // TO DO : launch when nuxt has emitted 'startExperience'
    if (process.client) {
      window.addEventListener('mousemove', (event) => {
        clearTimeout(timer)
        if (nuxt) {
          // nuxt.$emit('startmove')
        }
        this.onMouseMove(event)
        timer = setTimeout(() => {
          if (nuxt) {
            // nuxt.$emit('endmove')
          }
        }, 500)
      })
    }
  }

  onMouseMove (event) {
    const x = ((event.y - window.innerHeight / 2) / window.innerHeight / 2) * 4
    const z = ((event.x - window.innerWidth / 2) / window.innerWidth / 2) * 4
    this.rotateElement(x / 2, z / 2, 'flower')
    const xS = ((event.y - window.innerHeight / 2) / window.innerHeight / 2) * 4
    const zS = ((event.x - window.innerWidth / 2) / window.innerWidth / 2) * 4
    this.rotateElement(xS / 2, zS / 2, 'stem')
  }

  rotateElement (x, z, type) {
    if (store) {
      let euler
      if (store.state.worldRotation) {
        euler = store.state.worldRotation.clone()
        euler.x = 0
      }
      if (type === 'stem') {
        store.commit('desert/updateSRotation', { x, z, euler })
      } else {
        store.commit('desert/updateFRotation', { x, z, euler })
      }
    }
  }
}

module.exports = new RotationControl()
