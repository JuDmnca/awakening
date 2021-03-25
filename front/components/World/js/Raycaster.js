import * as THREE from 'three'

class Raycaster {
    constructor() {
        this.raycaster = new THREE.Raycaster()
        this.intersects = []
    }

    init(path, renderer) {
        window.addEventListener('mousemove', (e) => {
            this.mouseMovement(e, path, renderer)
        })
    }

    mouseMovement(e, path, renderer) {
        this.raycaster.setFromCamera({
            x: (e.clientX / renderer.domElement.clientWidth) * 2 - 1,
            y: -(e.clientY / renderer.domElement.clientHeight) * 2 + 1
        }, path.splineCamera);
    }

    render(scene) {
        if (scene.children) {
            this.intersects = this.raycaster.intersectObjects( scene.children[0].children )
        }

        for ( let i = 0; i < this.intersects.length; i ++ ) {
            // console.log(this.intersects[ i ].object)
        }
        return this.intersects
    }
}

export default Raycaster
