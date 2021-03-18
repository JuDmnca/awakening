import * as THREE from 'three'
class Path {
    constructor() {
        this.splineCamera = null
        this.cameraParams = null

        this.direction = new THREE.Vector3()
        this.binormal = new THREE.Vector3()
        this.normal = new THREE.Vector3()
        this.position = new THREE.Vector3()
        this.lookAt = new THREE.Vector3()
        this.vectorsCurve = [new THREE.Vector3( 76, -11, 20 ), new THREE.Vector3( 68, -11, -10 ), new THREE.Vector3( 75, -10, -10 )]
        this.pipeSpline = new THREE.CatmullRomCurve3(this.vectorsCurve)

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
            fov: 84,
            aspect: window.innerWidth / window.innerHeight,
            near: 0.01,
            far: 1000
        }
        this.splineCamera = new THREE.PerspectiveCamera(this.cameraParams.fov, this.cameraParams.aspect, this.cameraParams.near, this.cameraParams.far)

        this.addTube()

        // const gui = new dat.GUI( { width: 400 } )

        // const folderGeometry = gui.addFolder( 'Geometry' )

        // folderGeometry.add( this.params, 'extrusionSegments', 50, 500).step(50).onChange( () => {
        //     this.addTube()
        // })

        // folderGeometry.add( this.params, 'radiusSegments', 2, 12 ).step( 1 ).onChange( () => {
        //     this.addTube()
        // })

        // folderGeometry.add( this.params, 'closed').onChange( () => {
        //     this.addTube()
        // })
        // folderGeometry.open()

        // const folderCamera = gui.addFolder( 'Camera' )
        // folderCamera.add( this.params, 'animationView' ).onChange( () => {

        // })
    }

    addTube() {
        const extrudePath = this.pipeSpline

        this.tubeGeometry = new THREE.TubeGeometry(extrudePath, this.params.extrusionSegments, this.params.radius, this.params.radiusSegments, this.params.closed, )
    }

    addGeometry( geometry ) {
        mesh = new THREE.Mesh( geometry, this.material )
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
        const offset = 15

        this.normal.copy( this.binormal ).cross( this.direction )
        // this.position.add( this.normal.clone().multiplyScalar( offset ))

        this.splineCamera.position.copy( this.position )

        this.tubeGeometry.parameters.path.getPointAt( (t + 30 / this.tubeGeometry.parameters.path.getLength() ) % 1, this.lookAt)
        // this.lookAt.multiplyScalar( this.params.scale )

        this.lookAt.copy( this.position ).add( this.direction )
        this.splineCamera.matrix.lookAt( this.splineCamera.position, this.lookAt, this.normal)
        this.splineCamera.quaternion.setFromRotationMatrix( this.splineCamera.matrix )
        this.splineCamera.rotation.z = Math.PI * 2
    }
}

export default new Path()