import {CGFinterface, dat} from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);
        
        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        //Slider element in GUI
        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        // Slider para as dimensões do jardim
        //this.gui.add(this.scene, 'gardenRows', 1, 10).name('Garden Rows').onChange(this.scene.updateGarden.bind(this.scene));
        this.gui.add(this.scene, 'gardenRows', 1, 10).name('Garden Rows');
        this.gui.add(this.scene, 'gardenCols', 1, 10).name('Garden Columns');

        // Slider para a distância entre as flores
        this.gui.add(this.scene, 'flowerSpacing', 1, 10).name('Flower Spacing');

        this.gui.add(this.scene, 'speedFactor', 0.1, 3).name('Speed Factor');

        
        this.initKeys();

        return true;
    }

    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function() {};
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    }

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    }

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}