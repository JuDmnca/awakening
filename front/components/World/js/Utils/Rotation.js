let store
if (process.browser) {
  window.onNuxtReady(({$store}) => {
    store = $store
  })
}

class RotationControl {

  constructor() {
    this.ratio = 10;

    // window.addEventListener('deviceorientation', (event) => {
    //   this._onOrientationMove(event);
    // });

    if(process.client) {
      window.addEventListener('mousemove', (event) => {
        this._onMouseMove(event);
      });
    }
  }

  // _onOrientationMove(event){
  //   this.rotateElement((55-event.beta)/this.ratio,(event.gamma)/this.ratio);
  // }

  _onMouseMove(event) {
    let x = (45 * (event.y - window.innerHeight/2)) / window.innerHeight/2,
        z = (45 * (event.x - window.innerWidth/2)) / window.innerWidth/2;
    this.rotateElement(x/this.ratio, z/this.ratio);
  }

  rotateElement(x, z){
    if(store) {
      store.commit('desert/updateRotation', {x: x, z: z})
    }
  }
}

module.exports = new RotationControl();
