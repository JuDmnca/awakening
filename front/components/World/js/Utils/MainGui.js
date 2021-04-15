export default class MainGui {
    constructor() {
        this.gui = null
    }

    init() {
        if(process.client) {
            this.gui = require('three/examples/jsm/libs/dat.gui.module')
        }

        console.log('gui : ', this.gui)
        const datGui  = new this.gui.GUI({ autoPlace: true });
        datGui.domElement.id = 'gui'
        return datGui
    }
}