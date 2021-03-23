import * as THREE from 'three'
import ColorGUIHelper from './ColorGUIHelper'

class MainGui {
    constructor() {
        this.gui = null
    }

    init(myCube) {
        if(process.client) {
            this.gui = require('three/examples/jsm/libs/dat.gui.module')
         }
         console.log('gui : ', this.gui)
         const datGui  = new this.gui.GUI({ autoPlace: true });
         datGui.domElement.id = 'gui'
 
         const folder = datGui.addFolder(`Cube`)
 
         folder.addColor(new ColorGUIHelper(myCube.cube.material,'color'),'value') //
         .name('color')
         // .onChange(animationLoop)
    }
}

export default new MainGui()