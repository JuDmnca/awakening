import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

class Common{
    constructor(){
        this.scene = null;
        this.camera = null;
        this.renderer = null;

        this.size = {
            windowW: null,
            windowH: null
        };

        this.clock = null;

        this.time = {
            total: null,
            delta: null
        };
    }

    init($canvas){
        this.setSize();
        
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            45, 
            this.size.windowW / this.size.windowH,
            0.1, 
            10000
        );
        this.camera.position.set(10, 10, -10);
        this.camera.lookAt(this.scene.position);

        this.renderer = new THREE.WebGLRenderer({
            canvas: $canvas
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // this.renderer.setClearColor(0xFFF2F5);
        this.renderer.setSize(this.size.windowW, this.size.windowH);

        this.clock = new THREE.Clock();
        this.clock.start();

        // this.axesHelper = new THREE.AxesHelper( 5 );
        // this.scene.add( this.axesHelper );

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
		this.controls.dampingFactor = 0.05;

    }

    setSize(){
        this.size = {
            windowW: window.innerWidth,
            windowH: window.innerHeight
        }
    }

    resize(){
        this.setSize();
        this.camera.aspect = this.size.windowW / this.size.windowH;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.size.windowW, this.size.windowH);
    }

    render(){
        this.time.delta = this.clock.getDelta();
        this.time.total += this.delta;

        this.controls.update()
        
        this.renderer.render(this.scene, this.camera);
    }
}

export default new Common();