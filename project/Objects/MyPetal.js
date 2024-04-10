import {CGFobject} from '../../lib/CGF.js';

/**
 * MyPetal class - Represents a petal of a flower, which consists of two triangles
 */
export class MyPetal extends CGFobject {
    constructor(scene, rotateAngle) {
        super(scene);
        this.rotateAngle = rotateAngle;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            //vertices of the first triangle
            0,2,0, //top vertice
            -0.5,1,0, //left vertice
            0.5,1,0, // right vertice
            
            //vertices of the second triangle, which has the same base but the vertice is at the bottom
            0.5,1,0, //right vertice
            0,0,0, //bottom vertice
            -0.5,1,0, //left vertice
        ];

        this.indices = [
            0, 1, 2,
            2, 1, 0,
            3, 5, 4,
            4, 5, 3    
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1
        ];
        


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        // WE WANT TO ROTATE THE PETAL rotateAngle radians
        this.scene.pushMatrix();
        this.scene.rotate(this.rotateAngle, 0, 0, 1);
        super.display();
        this.scene.popMatrix();



    }
}
