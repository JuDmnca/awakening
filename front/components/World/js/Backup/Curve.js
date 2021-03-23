import * as THREE from 'three'
class Path {
    constructor() {
        this.splineCamera = null
        this.cameraParams = null

        this.vectors = [new THREE.Vector3( 76, -11, 20 ), new THREE.Vector3( 68, -11, -10 ), new THREE.Vector3( 70, -11, -10 )]
        this.curve = new THREE.CubicBezierCurve3(this.vectors)
        this.curveObject = null

        this.params = {
            scale: 1,
            extrusionSegments: 1,
            radius: 1,
            radiusSegments: 1,
            closed: true,
            animationView: false,
            lookAhead: false,
            cameraHelper: false
        }
    }

    init() {
        this.cameraParams = {
            fov: 84,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.01,
            far: 1000
        }
        this.splineCamera = new THREE.PerspectiveCamera(this.cameraParams.fov, this.cameraParams.aspect, this.cameraParams.near, this.cameraParams.far)

        const points = this.curve.getPoints( 50 )
        const geometry = new THREE.BufferGeometry().setFromPoints( points )
        const material = new THREE.LineBasicMaterial( { color : 0xff0000 } )
        this.curveObject = new THREE.Line( geometry, material )
    }

    render(progression) {

        const looptime = 20
        const t = ( progression % looptime ) / looptime
    }
}

export default new Path()