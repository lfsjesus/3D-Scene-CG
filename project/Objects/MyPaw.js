import {CGFobject} from '../../lib/CGF.js';
import {MyCylinder} from '../Primitives/MyCylinder.js';

export class MyPaw extends CGFobject {
    constructor(scene, appearance) {
        super(scene);
        this.outterPart = new MyCylinder(scene, 16, 0.2, 0.02, appearance);
        this.longPart = new MyCylinder(scene, 16, 0.5, 0.02, appearance);
        this.appearance = appearance;
        
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {

        
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.scene.rotate(Math.PI/2 + Math.PI/9, 1, 0, 0);
        this.outterPart.display();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/8, 1, 0, 0);
        this.scene.translate(0, -0.63, 0.144);
        
        this.longPart.display();

        this.scene.popMatrix();
    

    }
}
