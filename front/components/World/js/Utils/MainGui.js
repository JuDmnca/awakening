export default class MainGui {
    constructor() {
        this.guiModule = null
        this.gui = null
        this.init()
    }

    init() {
        if(process.client) {
            this.guiModule = require('three/examples/jsm/libs/dat.gui.module')
        }

        this.gui  = new this.guiModule.GUI({ width: 300 }); // 300 px
        this.gui.domElement.id = 'gui'
    }
}