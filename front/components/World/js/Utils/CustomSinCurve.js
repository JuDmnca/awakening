import * as THREE from 'three'

class CustomSinCurve extends THREE.Curve {
  constructor (props) {
    super()
    this.props = props
    this.length = this.props.length
  }

  getPoint (t, optionalTarget = new THREE.Vector3()) {
    const tx = 0
    const ty = Math.sin(t) * this.length
    const tz = t * this.length / 100

    return optionalTarget.set(tx, ty, tz)
  }
}
export default CustomSinCurve
