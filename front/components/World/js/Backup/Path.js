import * as THREE from 'three'

class Path {
    constructor(props) {
        this.props = props
        this.splineCamera = null
        this.cameraParams = null

        this.direction = new THREE.Vector3()
        this.binormal = new THREE.Vector3()
        this.normal = new THREE.Vector3()
        this.position = new THREE.Vector3()
        this.lookAt = new THREE.Vector3()
        this.pipeSpline = new THREE.CatmullRomCurve3(this.props.pathVectors)

        this.parent = null
        this.tubeGeometry = null
        this.mesh = null

        this.material = new THREE.MeshLambertMaterial({ color: 0xff00ff, opacity: 0 })

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
            fov: 75,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.01,
            far: 1000
        }
        this.splineCamera = new THREE.PerspectiveCamera(this.cameraParams.fov, this.cameraParams.aspect, this.cameraParams.near, this.cameraParams.far)

        this.addTube()
    }

    addTube() {
        const extrudePath = this.pipeSpline

        this.tubeGeometry = new THREE.TubeGeometry(extrudePath, this.params.extrusionSegments, this.params.radius, this.params.radiusSegments, this.params.closed, )
    }

    render(progression) {

        const looptime = 20
        const t = ( progression % looptime ) / looptime

        this.tubeGeometry.parameters.path.getPointAt( t, this.position )
        this.position.multiplyScalar( this.params.scale )

        const segments = this.tubeGeometry.tangents.length
        const pickt = t * segments
        const pick = Math.floor(pickt)
        const pickNext = ( pick + 1 ) % segments

        // console.log(this.tubeGeometry.binormals[ pickNext ])

        this.binormal.subVectors( this.tubeGeometry.binormals[ pickNext ], this.tubeGeometry.binormals[ pick ])
        this.binormal.multiplyScalar(pickt - pick).add(this.tubeGeometry.binormals[ pick ])

        this.tubeGeometry.parameters.path.getTangentAt(t, this.direction)
        // const offset = -1

        this.normal.copy( this.binormal ).cross( this.direction )
        // this.position.add( this.normal.clone().multiplyScalar( offset ))

        this.splineCamera.position.copy( this.position )
        // console.log(this.splineCamera.position)

        this.tubeGeometry.parameters.path.getPointAt( (t + 30 / this.tubeGeometry.parameters.path.getLength() ) % 1, this.lookAt)
        // this.lookAt.multiplyScalar( this.params.scale )

        this.lookAt.copy(this.position).add(this.direction)
        this.splineCamera.matrix.lookAt( this.splineCamera.position, this.lookAt, this.normal)
        this.splineCamera.quaternion.setFromRotationMatrix( this.splineCamera.matrix )
        this.splineCamera.rotation.z = Math.PI * 2
    }
}

export default Path