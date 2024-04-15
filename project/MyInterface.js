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
        this.gui.add(this.scene, 'gardenRows', 1, 10).name('Garden Rows');
        this.gui.add(this.scene, 'gardenCols', 1, 10).name('Garden Columns');

        // Slider para a distância entre as flores
        this.gui.add(this.scene, 'flowerSpacing', 1, 10).name('Flower Spacing');
        
   

        return true;
    }
}