let store
let nuxt
if (process.browser) {
  window.onNuxtReady(({$nuxt, $store}) => {
    nuxt = $nuxt
    store = $store
  })
}
class RotationControl {

  constructor() {
    this.ratio = 10

    let timer
    // TO DO : launch when nuxt has emitted 'startExperience'
    if(process.client) {
      window.addEventListener('mousemove', (event) => {
        clearTimeout(timer)
        if (nuxt) {
          nuxt.$emit('startmove')
        }
        this.onMouseMove(event)
        timer = setTimeout(() => {
          if (nuxt) {
            nuxt.$emit('endmove')
          }
        }, 500)
      })
    }
  }

  onMouseMove(event) {
    let x = (45 * (event.y - window.innerHeight/2)) / window.innerHeight/2,
        z = (45 * (event.x - window.innerWidth/2)) / window.innerWidth/2
    this.rotateElement(x/this.ratio, z/this.ratio)
    let xS = (20 * (event.y - window.innerHeight/2)) / window.innerHeight/2,
        zS = (20 * (event.x - window.innerWidth/2)) / window.innerWidth/2
    this.rotateElement(xS/this.ratio, zS/this.ratio)
  }

  rotateElement(x, z){
    if(store) {
      let euler
      if (store.state.worldRotation) {
        euler = store.state.worldRotation.clone()
        euler.x = 0
      }
      store.commit('desert/updateFRotation', {x: x, z: z, euler: euler})
      store.commit('desert/updateSRotation', {x: x, z: z, euler: euler})
    }
  }
}

module.exports = new RotationControl()
