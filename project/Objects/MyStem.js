import { CGFobject } from '../../lib/CGF.js';
import { MyDisc } from '../Primitives/MyDisc.js';
import { MyCylinder } from '../Primitives/MyCylinder.js';
export class MyStem extends CGFobject {
    constructor(scene, slices, height, radius, curvatureAngle, hasPetal = false, stemSide) {
        super(scene);
        this.height = height;
        this.radius = radius;
        this.hasPetal = hasPetal;
        this.curvatureAngle = curvatureAngle;
        this.stemSide = stemSide;
        this.cylinder = new MyCylinder(scene, slices, height, radius); // The side surface
        this.topBase = new MyDisc(scene, slices, radius); // Top base disc
        this.bottomBase = new MyDisc(scene, slices, radius); // Bottom base disc
    }

    display() {
       // Display the side surface
       this.cylinder.display();

       // Display the top base
       this.scene.pushMatrix();
       this.scene.translate(0, this.cylinder.height, 0); // Move to the top of the cylinder
       this.scene.rotate(Math.PI / 2, -1, 0, 0); // Rotate around the X axis to align the disc horizontally
       this.topBase.display();
       this.scene.popMatrix();

       // Display the bottom base
       this.scene.pushMatrix();
       this.scene.rotate(Math.PI / 2, 1, 0, 0); // Rotate around the X axis to align the disc horizontally
       this.bottomBase.display();
       this.scene.popMatrix();

    }
}
