import {CGFobject} from '../../lib/CGF.js';
import {MyTriangle} from '../Primitives/MyTriangle.js';
/**
 * MyPetal class - Represents a petal of a flower, which consists of two triangles
 */
export class MyPetal extends CGFobject {
    constructor(scene, rotateAngle, curvatureAngle) {
        super(scene);
        this.rotateAngle = rotateAngle;
        this.curvatureAngle = curvatureAngle;
        this.triangle1 = new MyTriangle(scene, 1, 1);
        this.triangle2 = new MyTriangle(scene, 1, 1);   
    }

    display() {

        this.scene.pushMatrix();    
        // Rotate the entire petal by the rotation angle around the Z axis
        this.scene.rotate(this.rotateAngle, 0, 0, 1);

        //translate the first triangle height (which now is 1)
        //then, rotate the triangle by curvature angle
        this.scene.pushMatrix();

        this.scene.translate(0, 1, 0);
        this.scene.rotate(this.curvatureAngle, 1, 0, 0);
        this.triangle1.display();

        this.scene.popMatrix();


        //now, rotate the second triangle by 180 degrees
        //and translate it to share the base with the first triangle
        this.scene.pushMatrix();

        this.scene.translate(0, 1, 0);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.triangle2.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.popMatrix();

        this.scene.popMatrix();




    }
}
