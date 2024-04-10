import { CGFobject } from '../../lib/CGF.js';
import { MyDisc } from '../Primitives/MyDisc.js';
import { MyCylinder } from '../Primitives/MyCylinder.js';
export class MyStem extends CGFobject {
    constructor(scene, slices, height, radius) {
        super(scene);
        this.cylinder = new MyCylinder(scene, slices, height, radius); // The side surface
        //this.topBase = new MyDisc(scene, slices, radius); // Top base disc
        //this.bottomBase = new MyDisc(scene, slices, radius); // Bottom base disc
    }

    display() {
        // Display the side surface
        this.cylinder.display();

    }
}
